'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

// Back Arrow Icon (red/pink color as per design)
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#E5383B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Scanning frame corners component
const ScannerFrame = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M2 40V10C2 5.58172 5.58172 2 10 2H40"
            stroke="#E5383B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Top Right Corner */}
      <div className="absolute top-0 right-0">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M10 2H40C44.4183 2 48 5.58172 48 10V40"
            stroke="#E5383B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M2 10V40C2 44.4183 5.58172 48 10 48H40"
            stroke="#E5383B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M10 48H40C44.4183 48 48 44.4183 48 40V10"
            stroke="#E5383B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default function CameraScannerOverlay({
  isOpen,
  onClose,
  onCapture,
}: CameraScannerOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    isStartingRef.current = false;
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous start attempts
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    
    setIsLoading(true);
    setError(null);

    try {
      // Check if mediaDevices is available (requires HTTPS or localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported. Please use HTTPS or localhost.');
      }

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for the video to be ready before playing
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });
        
        // Play with error handling for AbortError
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // Ignore AbortError - happens when camera is stopped during play
          if (playErr instanceof Error && playErr.name !== 'AbortError') {
            throw playErr;
          }
        }
      }

      setIsLoading(false);
      isStartingRef.current = false;
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // Set appropriate error message
      let errorMessage = 'Unable to access camera. Please check permissions.';
      if (err instanceof Error) {
        if (err.message.includes('not supported') || err.message.includes('HTTPS')) {
          errorMessage = 'Camera requires HTTPS. Please access via localhost or HTTPS.';
        } else if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      isStartingRef.current = false;
    }
  }, [facingMode]);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageSrc = canvas.toDataURL('image/jpeg', 0.9);

    // Stop camera and close overlay
    stopCamera();
    onCapture(imageSrc);
    onClose();
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    stopCamera(); // Stop current camera before switching
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Handle close
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Start/stop camera when overlay opens/closes or facing mode changes
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black">
      {/* Camera Feed */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-[14px]">Starting camera...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#E5383B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white text-[14px]">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-[#E5383B] text-white rounded-lg text-[14px] font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isLoading || error ? 'hidden' : ''}`}
          playsInline
          muted
        />

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Scanner Frame Overlay */}
      {!isLoading && !error && <ScannerFrame />}

      {/* Top Bar with Back Button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-[env(safe-area-inset-top,16px)]">
        <button
          onClick={handleClose}
          className="w-[44px] h-[44px] flex items-center justify-center"
        >
          <BackArrowIcon />
        </button>

        {/* Switch Camera Button (only show if no error) */}
        {!error && (
          <button
            onClick={switchCamera}
            className="w-[44px] h-[44px] flex items-center justify-center bg-black/30 rounded-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 8H15.01M3 16L8 11C8.928 10.107 10.072 10.107 11 11L16 16M14 14L15 13C15.928 12.107 17.072 12.107 18 13L21 16M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Bar with Capture Button */}
      {!isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-[max(32px,env(safe-area-inset-bottom))] pt-4">
          <button
            onClick={capturePhoto}
            className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-white" />
          </button>
        </div>
      )}

      {/* Instruction Text */}
      {!isLoading && !error && (
        <div className="absolute bottom-[130px] left-0 right-0 flex justify-center">
          <p className="text-white/80 text-[14px] font-medium text-center px-4">
            Position the part number within the frame
          </p>
        </div>
      )}
    </div>
  );
}
