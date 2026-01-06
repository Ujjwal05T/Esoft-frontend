'use client';

import React, { useState, useRef, useEffect } from 'react';

// Types
interface OrderSuggestion {
  id: string;
  orderId: string;
  date: string;
}

interface Part {
  id: string;
  name: string;
}

interface Reason {
  id: string;
  name: string;
}

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  specs: string;
  plateNumber: string;
}

interface RaiseDisputeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DisputeFormData) => void;
  onChatWithUs?: () => void;
  orderSuggestions?: OrderSuggestion[];
  parts?: Part[];
  reasons?: Reason[];
  vehicleInfo?: VehicleInfo;
  buttonText?: 'CONFIRM' | 'SEND REQUEST';
}

export interface DisputeFormData {
  orderId: string;
  partName: string;
  reason: string;
  remark: string;
  audioBlob?: Blob;
  images: File[];
}

// Microphone Icon
const MicrophoneIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 12C9.66 12 11 10.66 11 9V3C11 1.34 9.66 0 8 0C6.34 0 5 1.34 5 3V9C5 10.66 6.34 12 8 12ZM14 9C14 12.53 10.96 15.36 7.5 15.93V18H10V20H6V18H8.5V15.93C5.04 15.36 2 12.53 2 9H0C0 13.08 3.05 16.44 7 16.93V18H9V16.93C12.95 16.44 16 13.08 16 9H14Z"
      fill="white"
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
            animation: isPlaying ? `waveform 0.5s ease-in-out ${i * 0.05}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveform {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
};

export default function RaiseDisputeOverlay({
  isOpen,
  onClose,
  onConfirm,
  onChatWithUs,
  orderSuggestions = [],
  parts = [],
  reasons = [],
  vehicleInfo,
  buttonText = 'CONFIRM',
}: RaiseDisputeOverlayProps) {
  // Form state
  const [orderId, setOrderId] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [remark, setRemark] = useState('');
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '']);

  // UI state
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);
  const [showPartDropdown, setShowPartDropdown] = useState(false);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  
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

  // Filter order suggestions based on input
  const filteredSuggestions = orderSuggestions.filter((order) =>
    order.orderId.toLowerCase().includes(orderId.toLowerCase())
  );

  // Handle audio recording
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

  // Handle image upload
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

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const handleConfirm = () => {
    onConfirm({
      orderId,
      partName: selectedPart,
      reason: selectedReason,
      remark,
      audioBlob: audioBlob || undefined,
      images: images.filter((img): img is File => img !== null),
    });
  };

  // Audio ended handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  // Cleanup on unmount
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-51 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[440px] bg-white rounded-t-[24px] max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[40px] h-[4px] bg-[#dadada] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-[12px] px-[20px] pb-[16px]">
          <button onClick={onClose} className="p-[4px]">
            <BackArrowIcon />
          </button>
          <h2
            className="font-bold text-[22px] text-black"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Raise Dispute
          </h2>
        </div>

        {/* Vehicle Info Section (Optional) */}
        {vehicleInfo && (
          <div className="px-[20px] pb-[16px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <p
                  className="font-semibold text-[18px] text-[#e5383b]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
                <p
                  className="text-[12px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {vehicleInfo.specs}
                </p>
              </div>
              <div
                className="border border-[#e5383b] rounded-[6px] px-[12px] py-[6px]"
              >
                <span
                  className="text-[12px] font-semibold text-[#e5383b]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {vehicleInfo.plateNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="px-[20px] pb-[20px] flex flex-col gap-[16px]">
          {/* Order ID Input */}
          <div className="relative">
            <div
              className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                orderId ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
              }`}
            >
              {orderId && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Order ID
                </label>
              )}
              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setShowOrderSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowOrderSuggestions(orderId.length > 0)}
                onBlur={() => setTimeout(() => setShowOrderSuggestions(false), 200)}
                placeholder={orderId ? '' : 'Order ID'}
                className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Order Suggestions Dropdown */}
            {showOrderSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => {
                      setOrderId(suggestion.orderId);
                      setShowOrderSuggestions(false);
                    }}
                    className="w-full px-[16px] py-[12px] flex items-center justify-between hover:bg-[#f5f5f5] text-left border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <span
                      className="text-[14px] text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {suggestion.orderId}
                    </span>
                    <span
                      className="text-[14px] text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {suggestion.date}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Part Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPartDropdown(!showPartDropdown);
                setShowReasonDropdown(false);
              }}
              className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                selectedPart ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
              }`}
            >
              {selectedPart && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Part Name
                </label>
              )}
              <span
                className={`text-[15px] ${selectedPart ? 'text-black' : 'text-[#828282]'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {selectedPart || 'Select Part'}
              </span>
              <ChevronDownIcon className={showPartDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>

            {/* Parts Dropdown */}
            {showPartDropdown && parts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {parts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => {
                      setSelectedPart(part.name);
                      setShowPartDropdown(false);
                    }}
                    className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <span
                      className="text-[14px] text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {part.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Reason Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowReasonDropdown(!showReasonDropdown);
                setShowPartDropdown(false);
              }}
              className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                selectedReason ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
              }`}
            >
              {selectedReason && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Reason
                </label>
              )}
              <span
                className={`text-[15px] ${selectedReason ? 'text-black' : 'text-[#828282]'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {selectedReason || 'Select Reason'}
              </span>
              <ChevronDownIcon className={showReasonDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>

            {/* Reasons Dropdown */}
            {showReasonDropdown && reasons.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {reasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => {
                      setSelectedReason(reason.name);
                      setShowReasonDropdown(false);
                    }}
                    className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <span
                      className="text-[14px] text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {reason.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Remark Textarea */}
          <div className="relative">
            <div
              className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                remark ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
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
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={remark ? '' : 'Remark'}
                rows={2}
                className="w-full outline-none text-[15px] text-black placeholder:text-[#828282] resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
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

                {/* Delete Button for uploaded image */}
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

          {/* Confirm/Send Request Button */}
          <button
            onClick={handleConfirm}
            className="w-full h-[52px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
          >
            <span
              className="text-white font-semibold text-[16px] uppercase tracking-[1px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {buttonText}
            </span>
          </button>

          {/* Chat With Us Link */}
          {onChatWithUs && (
            <button
              onClick={onChatWithUs}
              className="w-full py-[12px] flex items-center justify-center"
            >
              <span
                className="text-[#289d27] font-semibold text-[14px] uppercase tracking-[0.5px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                CHAT WITH US
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
