'use client';

import React, { useState, useRef, useEffect } from 'react';
import CameraScannerOverlay from './CameraScannerOverlay';

interface RequestPartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPartNumber: (partNumber: string) => void;
  onScanPart: () => void;
  onRequestManually: () => void;
  onSendRequest?: (data: PartRequestFormData) => void;
  onAddAnotherRequest?: () => void;
}

export interface PartRequestFormData {
  partName: string;
  preferredBrand: string;
  quantity: string;
  remark: string;
  audioBlob?: Blob;
  images: File[];
}

// Brand options
const brandOptions = [
  { id: '1', name: 'OEM - Original Brands' },
  { id: '2', name: 'After Market' },
  { id: '3', name: 'Generic' },
  { id: '4', name: 'Premium' },
];

// Arrow Right Icon
const ArrowRightIcon = ({ color = '#828282' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Back Arrow Icon
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// QR Scan Icon
const QRScanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="7" y="7" width="4" height="4" rx="1" fill="white" />
    <rect x="13" y="7" width="4" height="4" rx="1" fill="white" />
    <rect x="7" y="13" width="4" height="4" rx="1" fill="white" />
    <path d="M13 13H17V17H15V15H13V13Z" fill="white" />
  </svg>
);

// Diagonal Arrow Icon (for manual request card)
const DiagonalArrowIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="none" />
    <path
      d="M11 21L21 11M21 11H13M21 11V19"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Microphone Icon
const MicrophoneIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 12C9.66 12 11 10.66 11 9V3C11 1.34 9.66 0 8 0C6.34 0 5 1.34 5 3V9C5 10.66 6.34 12 8 12ZM14 9C14 12.53 10.96 15.36 7.5 15.93V18H10V20H6V18H8.5V15.93C5.04 15.36 2 12.53 2 9H0C0 13.08 3.05 16.44 7 16.93V18H9V16.93C12.95 16.44 16 13.08 16 9H14Z"
      fill="white"
    />
  </svg>
);

// Chevron Down Icon
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 10L12 15L17 10"
      stroke="#E5383B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus Icon for image upload
const PlusIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 6V26M6 16H26"
      stroke="#E5383B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Trash/Delete Icon
const TrashIcon = ({ color = '#E5383B' }: { color?: string }) => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 5H17M7 9V15M11 9V15M2 5L3 17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H13C13.5304 19 14.0391 18.7893 14.4142 18.4142C14.7893 18.0391 15 17.5304 15 17L16 5M6 5V2C6 1.73478 6.10536 1.48043 6.29289 1.29289C6.48043 1.10536 6.73478 1 7 1H11C11.2652 1 11.5196 1.10536 11.7071 1.29289C11.8946 1.48043 12 1.73478 12 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Play Icon
const PlayIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0V18L16 9L0 0Z" fill="white" />
  </svg>
);

// Pause Icon
const PauseIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="4" height="14" fill="white" />
    <rect x="8" y="0" width="4" height="14" fill="white" />
  </svg>
);

// Audio Waveform Component
const AudioWaveform = ({ isPlaying }: { isPlaying: boolean }) => {
  const bars = [4, 8, 12, 6, 14, 8, 10, 16, 6, 12, 8, 14, 10, 6, 12, 8, 16, 10, 6, 14, 8, 12, 10, 8, 6, 10, 14, 8, 12, 6];
  
  return (
    <div className="flex items-center gap-[2px] h-[24px]">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-[2px] bg-[#828282] rounded-[1px] transition-all duration-150 ${
            isPlaying ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            height: `${height}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function RequestPartOverlay({
  isOpen,
  onClose,
  onSubmitPartNumber,
  onScanPart,
  onRequestManually,
  onSendRequest,
  onAddAnotherRequest,
}: RequestPartOverlayProps) {
  // View state
  const [currentView, setCurrentView] = useState<'search' | 'form'>('search');
  
  // Camera scanner state
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  
  // Search view state
  const [partNumber, setPartNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Form view state
  const [partName, setPartName] = useState('');
  const [preferredBrand, setPreferredBrand] = useState('');
  const [quantity, setQuantity] = useState('');
  const [remark, setRemark] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '']);
  
  // Validation state
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmitPartNumber = () => {
    if (partNumber.trim()) {
      onSubmitPartNumber(partNumber.trim());
      // Show the form view with detected part number
      setRemark(`Part Number detected - ${partNumber.trim()}`);
      setCurrentView('form');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitPartNumber();
    }
  };

  const handleBack = () => {
    if (currentView === 'form') {
      setCurrentView('search');
    } else {
      onClose();
    }
  };

  // Handle camera capture
  const handleCameraCapture = (imageSrc: string) => {
    // Convert base64 to blob/file for the images array
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'scanned-part.jpg', { type: 'image/jpeg' });
        const newImages = [...images];
        newImages[0] = file;
        setImages(newImages);
        
        const newUrls = [...imageUrls];
        if (imageUrls[0]) {
          URL.revokeObjectURL(imageUrls[0]);
        }
        newUrls[0] = imageSrc;
        setImageUrls(newUrls);
      });
    
    // Set remark about scanned part
    setRemark('Part scanned - processing image...');
    // Transition to form view
    setCurrentView('form');
    onScanPart();
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioDuration(recordingTime);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Image handling
  const handleImageUpload = (index: number, file: File) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newUrls = [...imageUrls];
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index]);
    }
    newUrls[index] = URL.createObjectURL(file);
    setImageUrls(newUrls);
  };

  const deleteImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newUrls = [...imageUrls];
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index]);
    }
    newUrls[index] = '';
    setImageUrls(newUrls);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendRequest = () => {
    setHasAttemptedSubmit(true);
    
    // Validate all required fields
    if (!partName.trim() || !preferredBrand || !quantity.trim() || !remark.trim()) {
      return; // Don't submit if validation fails
    }
    
    if (onSendRequest) {
      onSendRequest({
        partName,
        preferredBrand,
        quantity,
        remark,
        audioBlob: audioBlob || undefined,
        images: images.filter((img): img is File => img !== null),
      });
    }
  };

  const handleAddAnother = () => {
    // Reset form
    setPartName('');
    setPreferredBrand('');
    setQuantity('');
    setRemark('');
    setHasAttemptedSubmit(false);
    
    // Reset audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setIsPlaying(false);
    
    // Reset images
    setImages([null, null, null]);
    imageUrls.forEach(url => url && URL.revokeObjectURL(url));
    setImageUrls(['', '', '']);
    
    setPartNumber('');
    setCurrentView('search');
    
    if (onAddAnotherRequest) {
      onAddAnotherRequest();
    }
  };

  // Audio ended handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      imageUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  // Reset view when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('search');
      setPartNumber('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-[51] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[840px] bg-white rounded-t-[24px] max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[40px] h-[4px] bg-[#dadada] rounded-full" />
        </div>

        {currentView === 'search' ? (
          /* SEARCH VIEW */
          <div className="px-[17px] pb-[32px]">
            {/* Title */}
            <h2
              className="font-bold text-[24px] text-[#828282] mb-[24px] leading-[1.2]"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontStyle: 'italic',
              }}
            >
              Request by Part<br />
              Number / Scanning<br />
              Part
            </h2>

            {/* Part Number Input Row */}
            <div className="flex gap-[8px] mb-[20px]">
              {/* Part Number Input */}
              <div
                className={`flex-1 min-w-0 flex items-center border rounded-[12px] px-[10px] sm:px-[12px] py-[8px] sm:py-[10px] transition-colors ${
                  isFocused || partNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
              >
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={handleKeyPress}
                  placeholder="90915-10010"
                  className={`flex-1 min-w-0 outline-none font-bold text-[14px] sm:text-[16px] placeholder:text-[#c4c4c4] ${
                    partNumber ? 'text-[#e5383b]' : 'text-black'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  onClick={handleSubmitPartNumber}
                  className={`w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] ${partNumber ? 'bg-[#e5383b]' : 'bg-[#828282]'} text-white rounded-full flex items-center justify-center hover:opacity-90 transition-colors ml-[6px] sm:ml-[8px] flex-shrink-0`}
                >
                  <ArrowRightIcon color={'#ffffff'} />
                </button>
              </div>

              {/* Scan Part Button */}
              <button
                onClick={() => setShowCameraScanner(true)}
                className="flex items-center justify-center gap-[4px] sm:gap-[6px] bg-[#e5383b] text-white px-[10px] sm:px-[12px] py-[10px] sm:py-[12px] rounded-[12px] hover:bg-[#c82d30] transition-colors flex-shrink-0"
              >
                <QRScanIcon />
                <span
                  className="font-semibold text-[12px] sm:text-[14px] whitespace-nowrap hidden sm:inline"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Scan
                </span>
              </button>
            </div>

            {/* Request Part Manually Card */}
            <button
              onClick={() => {
                onRequestManually();
                setCurrentView('form');
              }}
              className="w-full bg-[#e5383b] rounded-[16px] p-[20px] flex items-end justify-between min-h-[180px] hover:bg-[#d43235] transition-colors relative overflow-hidden"
            >
              {/* Text Content */}
              <div className="flex flex-col items-start z-10">
                <h3
                  className="font-bold text-[28px] text-white leading-[1.1] text-left mb-[16px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Request<br />
                  Part<br />
                  Manually
                </h3>
                <DiagonalArrowIcon />
              </div>

              {/* Auto Parts Image */}
              <div className="absolute right-[-20px] bottom-[-10px] w-[200px] h-[180px]">
                <div
                  className="w-full h-full bg-contain bg-no-repeat bg-right-bottom"
                  style={{
                    backgroundImage: `url('/assets/images/auto-parts.png')`,
                  }}
                />
                {/* Fallback visual */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="80" cy="40" r="30" stroke="white" strokeWidth="4" fill="none" />
                    <circle cx="80" cy="40" r="12" stroke="white" strokeWidth="3" fill="none" />
                    <rect x="50" y="60" width="40" height="30" rx="4" stroke="white" strokeWidth="3" fill="none" />
                    <ellipse cx="25" cy="85" rx="15" ry="20" stroke="white" strokeWidth="3" fill="none" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* FORM VIEW */
          <div className="px-[20px] pb-[20px]">
            {/* Header */}
            <div className="flex items-center gap-[12px] pb-[20px]">
              <button onClick={handleBack} className="p-[4px]">
                <BackArrowIcon />
              </button>
              <h2
                className="font-bold text-[22px] text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Request Part
              </h2>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[16px]">
              {/* Part Name Input */}
              <div className="relative">
                <div
                  className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                    hasAttemptedSubmit && !partName.trim()
                      ? 'border-[#e5383b] bg-[#ffe0e0]'
                      : partName
                      ? 'border-[#e5383b]'
                      : 'border-[#d3d3d3]'
                  }`}
                >
                  {partName && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Part Name
                    </label>
                  )}
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder={partName ? '' : 'Part Name'}
                    className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                      hasAttemptedSubmit && !partName.trim() ? 'bg-transparent' : ''
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                {hasAttemptedSubmit && !partName.trim() && (
                  <p
                    className="text-[12px] text-[#e5383b] mt-[4px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Please add part name
                  </p>
                )}
              </div>

              {/* Preferred Brand Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                    hasAttemptedSubmit && !preferredBrand
                      ? 'border-[#e5383b] bg-[#ffe0e0]'
                      : preferredBrand
                      ? 'border-[#e5383b]'
                      : 'border-[#d3d3d3]'
                  }`}
                >
                  {preferredBrand && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Preferred Brand
                    </label>
                  )}
                  <span
                    className={`text-[15px] ${preferredBrand ? 'text-black' : 'text-[#828282]'}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {preferredBrand || 'Preferred Brand'}
                  </span>
                  <ChevronDownIcon className={showBrandDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>

                {showBrandDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {brandOptions.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setPreferredBrand(brand.name);
                          setShowBrandDropdown(false);
                        }}
                        className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                      >
                        <span
                          className="text-[14px] text-[#e5383b]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {brand.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {hasAttemptedSubmit && !preferredBrand && (
                  <p
                    className="text-[12px] text-[#e5383b] mt-[4px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Please select preferred brand
                  </p>
                )}
              </div>

              {/* Quantity Input */}
              <div className="relative">
                <div
                  className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                    hasAttemptedSubmit && !quantity.trim()
                      ? 'border-[#e5383b] bg-[#ffe0e0]'
                      : quantity
                      ? 'border-[#e5383b]'
                      : 'border-[#d3d3d3]'
                  }`}
                >
                  {quantity && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Quantity
                    </label>
                  )}
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={quantity ? '' : 'Quantity'}
                    className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                      hasAttemptedSubmit && !quantity.trim() ? 'bg-transparent' : ''
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                {hasAttemptedSubmit && !quantity.trim() && (
                  <p
                    className="text-[12px] text-[#e5383b] mt-[4px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Please add quantity
                  </p>
                )}
              </div>

              {/* Remark Input */}
              <div className="relative">
                <div
                  className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                    hasAttemptedSubmit && !remark.trim()
                      ? 'border-[#e5383b] bg-[#ffe0e0]'
                      : remark
                      ? 'border-[#e5383b]'
                      : 'border-[#d3d3d3]'
                  }`}
                >
                  {remark && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Remark
                    </label>
                  )}
                  <input
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={remark ? '' : 'Remark'}
                    className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                      hasAttemptedSubmit && !remark.trim() ? 'bg-transparent' : ''
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                {hasAttemptedSubmit && !remark.trim() && (
                  <p
                    className="text-[12px] text-[#e5383b] mt-[4px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Please add remark
                  </p>
                )}
              </div>

              {/* Audio Section */}
              {!audioUrl ? (
                /* Audio Recording Button */
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all ${
                    isRecording
                      ? 'bg-[#e5383b]'
                      : 'bg-[#e5383b] hover:bg-[#c82d30]'
                  }`}
                  style={{
                    background: isRecording
                      ? 'linear-gradient(90deg, #e5383b 0%, #ff6b6b 50%, #e5383b 100%)'
                      : undefined,
                  }}
                >
                  {!isRecording && <MicrophoneIcon />}
                  <span
                    className="text-white font-medium text-[14px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {isRecording ? `Recording... (${formatTime(recordingTime)})` : 'Press To record Audio'}
                  </span>
                </button>
              ) : (
                /* Audio Player */
                <div className="flex items-center gap-[12px] px-[12px] py-[8px] bg-[#f8f8f8] rounded-[12px]">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    className="w-[40px] h-[40px] bg-[#e5383b] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#c82d30] transition-colors"
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  {/* Waveform */}
                  <div className="flex-1">
                    <AudioWaveform isPlaying={isPlaying} />
                  </div>

                  {/* Duration */}
                  <span
                    className="text-[14px] text-[#434343] font-medium whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {formatTime(audioDuration)}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={deleteAudio}
                    className="p-[4px] hover:bg-[#ffecec] rounded-[4px] transition-colors"
                  >
                    <TrashIcon />
                  </button>

                  {/* Hidden Audio Element */}
                  <audio ref={audioRef} src={audioUrl} />
                </div>
              )}

              {/* Image Upload */}
              <div className="flex gap-[12px] justify-center">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => !imageUrls[index] && fileInputRefs.current[index]?.click()}
                      className={`w-[100px] h-[100px] border rounded-[8px] flex items-center justify-center overflow-hidden transition-colors ${
                        imageUrls[index] ? 'border-transparent' : 'border-[#d3d3d3] hover:border-[#e5383b]'
                      }`}
                      style={{
                        background: imageUrls[index]
                          ? `url(${imageUrls[index]}) center/cover`
                          : 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                      }}
                    >
                      {!imageUrls[index] && <PlusIcon />}
                    </button>

                    {imageUrls[index] && (
                      <button
                        onClick={() => deleteImage(index)}
                        className="absolute bottom-[8px] right-[8px] w-[28px] h-[28px] bg-[#e5383b] rounded-[6px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
                      >
                        <TrashIcon color="white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                className="w-full h-[52px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
              >
                <span
                  className="text-white font-semibold text-[16px] uppercase tracking-[1px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  SEND REQUEST
                </span>
              </button>

              {/* Add Another Request Button */}
              <button
                onClick={handleAddAnother}
                className="w-full h-[52px] border border-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#fef5f5] transition-colors"
              >
                <span
                  className="text-[#e5383b] font-semibold text-[14px] uppercase tracking-[0.5px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ADD ANOTHER REQUEST
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Camera Scanner Overlay */}
      <CameraScannerOverlay
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
