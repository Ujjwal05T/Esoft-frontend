'use client';

import React, { useState, useRef, useEffect } from 'react';
import CameraScannerOverlay from './CameraScannerOverlay';
import SuccessOverlay from './SuccessOverlay';

interface RequestPartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPartNumber: (partNumber: string) => void;
  onScanPart: () => void;
  onRequestManually: () => void;
  onSendRequest?: (data: PartRequestFormData[]) => void;
  onAddAnotherRequest?: () => void;
  onInquiryCreated?: () => void;
  vehicleId: number;
  vehicleVisitId?: number;
}

export interface PartRequestFormData {
  partName: string;
  preferredBrand: string;
  quantity: string;
  remark: string;
  audioBlob?: Blob;
  audioUrl?: string;
  audioDuration?: number;
  images: File[];
  imageUrls: string[];
}

// Single part request item interface (internal use)
interface PartRequestItem {
  id: string;
  partName: string;
  preferredBrand: string;
  quantity: string;
  remark: string;
  audioBlob: Blob | null;
  audioUrl: string | null;
  audioDuration: number;
  images: (File | null)[];
  imageUrls: string[];
  isExpanded: boolean;
  hasAttemptedSubmit: boolean;
}

// Brand options
const brandOptions = [
  { id: '1', name: 'OEM - Original Brands' },
  { id: '2', name: 'After Market' },
  { id: '3', name: 'Generic' },
  { id: '4', name: 'Premium' },
];

// Generate unique ID
const generateId = () => `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create empty part request
const createEmptyPartRequest = (): PartRequestItem => ({
  id: generateId(),
  partName: '',
  preferredBrand: '',
  quantity: '',
  remark: '',
  audioBlob: null,
  audioUrl: null,
  audioDuration: 0,
  images: [null, null, null],
  imageUrls: ['', '', ''],
  isExpanded: true,
  hasAttemptedSubmit: false,
});

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
const ChevronDownIcon = ({ className, color = '#E5383B' }: { className?: string; color?: string }) => (
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
      stroke={color}
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

// Part Request Accordion Item Component
interface PartRequestAccordionProps {
  item: PartRequestItem;
  index: number;
  totalItems: number;
  onUpdate: (id: string, updates: Partial<PartRequestItem>) => void;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  isRecording: boolean;
  recordingPartId: string | null;
  onStartRecording: (id: string) => void;
  onStopRecording: () => void;
}

const PartRequestAccordion = ({
  item,
  index,
  totalItems,
  onUpdate,
  onToggleExpand,
  onDelete,
  isRecording,
  recordingPartId,
  onStartRecording,
  onStopRecording,
}: PartRequestAccordionProps) => {
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle recording time
  useEffect(() => {
    if (isRecording && recordingPartId === item.id) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording, recordingPartId, item.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (imgIndex: number, file: File) => {
    const newImages = [...item.images];
    newImages[imgIndex] = file;
    
    const newUrls = [...item.imageUrls];
    if (item.imageUrls[imgIndex]) {
      URL.revokeObjectURL(item.imageUrls[imgIndex]);
    }
    newUrls[imgIndex] = URL.createObjectURL(file);
    
    onUpdate(item.id, { images: newImages, imageUrls: newUrls });
  };

  const deleteImage = (imgIndex: number) => {
    const newImages = [...item.images];
    newImages[imgIndex] = null;
    
    const newUrls = [...item.imageUrls];
    if (item.imageUrls[imgIndex]) {
      URL.revokeObjectURL(item.imageUrls[imgIndex]);
    }
    newUrls[imgIndex] = '';
    
    onUpdate(item.id, { images: newImages, imageUrls: newUrls });
  };

  const deleteAudio = () => {
    if (item.audioUrl) {
      URL.revokeObjectURL(item.audioUrl);
    }
    onUpdate(item.id, { audioBlob: null, audioUrl: null, audioDuration: 0 });
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

  // Audio ended handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [item.audioUrl]);

  // Get accordion title
  const getAccordionTitle = () => {
    if (item.partName.trim()) {
      return item.partName;
    }
    return `Part Request ${index + 1}`;
  };

  return (
    <div className="w-full mb-[12px]">
      {/* Accordion Header */}
      <button
        onClick={() => onToggleExpand(item.id)}
        className="w-full rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors"
        style={{ backgroundColor: '#e5383b' }}
      >
        <div className="flex items-center gap-[12px]">
          <span
            className="font-medium text-[15px] text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {getAccordionTitle()}
          </span>
          {item.quantity && (
            <span className="text-[12px] text-white/80 bg-white/20 px-[8px] py-[2px] rounded-full">
              Qty: {item.quantity}
            </span>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          {totalItems > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-[4px] hover:bg-white/20 rounded-[4px] transition-colors"
            >
              <TrashIcon color="white" />
            </button>
          )}
          <ChevronDownIcon 
            className={`transition-transform duration-300 ${item.isExpanded ? 'rotate-180' : ''}`}
            color="white"
          />
        </div>
      </button>

      {/* Accordion Content */}
      {item.isExpanded && (
        <div 
          className="flex flex-col gap-[16px] pt-[16px] px-[4px]"
          style={{ animation: 'accordionFadeIn 0.3s ease-out forwards' }}
        >
          {/* Part Name Input */}
          <div className="relative">
            <div
              className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                item.hasAttemptedSubmit && !item.partName.trim()
                  ? 'border-[#e5383b] bg-[#ffe0e0]'
                  : item.partName
                  ? 'border-[#e5383b]'
                  : 'border-[#d3d3d3]'
              }`}
            >
              {item.partName && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Part Name
                </label>
              )}
              <input
                type="text"
                value={item.partName}
                onChange={(e) => onUpdate(item.id, { partName: e.target.value })}
                placeholder={item.partName ? '' : 'Part Name'}
                className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                  item.hasAttemptedSubmit && !item.partName.trim() ? 'bg-transparent' : ''
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            {item.hasAttemptedSubmit && !item.partName.trim() && (
              <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please add part name
              </p>
            )}
          </div>

          {/* Preferred Brand Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                item.hasAttemptedSubmit && !item.preferredBrand
                  ? 'border-[#e5383b] bg-[#ffe0e0]'
                  : item.preferredBrand
                  ? 'border-[#e5383b]'
                  : 'border-[#d3d3d3]'
              }`}
            >
              {item.preferredBrand && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Preferred Brand
                </label>
              )}
              <span
                className={`text-[15px] ${item.preferredBrand ? 'text-black' : 'text-[#828282]'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.preferredBrand || 'Preferred Brand'}
              </span>
              <ChevronDownIcon className={showBrandDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>

            {showBrandDropdown && (
              <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {brandOptions.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      onUpdate(item.id, { preferredBrand: brand.name });
                      setShowBrandDropdown(false);
                    }}
                    className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <span className="text-[14px] text-[#e5383b]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {item.hasAttemptedSubmit && !item.preferredBrand && (
              <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please select preferred brand
              </p>
            )}
          </div>

          {/* Quantity Input */}
          <div className="relative">
            <div
              className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                item.hasAttemptedSubmit && !item.quantity.trim()
                  ? 'border-[#e5383b] bg-[#ffe0e0]'
                  : item.quantity
                  ? 'border-[#e5383b]'
                  : 'border-[#d3d3d3]'
              }`}
            >
              {item.quantity && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Quantity
                </label>
              )}
              <input
                type="text"
                value={item.quantity}
                onChange={(e) => onUpdate(item.id, { quantity: e.target.value })}
                placeholder={item.quantity ? '' : 'Quantity'}
                className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                  item.hasAttemptedSubmit && !item.quantity.trim() ? 'bg-transparent' : ''
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            {item.hasAttemptedSubmit && !item.quantity.trim() && (
              <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please add quantity
              </p>
            )}
          </div>

          {/* Remark Input */}
          <div className="relative">
            <div
              className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                item.hasAttemptedSubmit && !item.remark.trim()
                  ? 'border-[#e5383b] bg-[#ffe0e0]'
                  : item.remark
                  ? 'border-[#e5383b]'
                  : 'border-[#d3d3d3]'
              }`}
            >
              {item.remark && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Remark
                </label>
              )}
              <input
                type="text"
                value={item.remark}
                onChange={(e) => onUpdate(item.id, { remark: e.target.value })}
                placeholder={item.remark ? '' : 'Remark'}
                className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                  item.hasAttemptedSubmit && !item.remark.trim() ? 'bg-transparent' : ''
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            {item.hasAttemptedSubmit && !item.remark.trim() && (
              <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please add remark
              </p>
            )}
          </div>

          {/* Audio Section */}
          {!item.audioUrl ? (
            /* Audio Recording Button */
            <button
              onClick={() => {
                if (isRecording && recordingPartId === item.id) {
                  onStopRecording();
                } else if (!isRecording) {
                  onStartRecording(item.id);
                }
              }}
              disabled={isRecording && recordingPartId !== item.id}
              className={`w-full h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all ${
                isRecording && recordingPartId === item.id
                  ? 'bg-[#e5383b]'
                  : isRecording && recordingPartId !== item.id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#e5383b] hover:bg-[#c82d30]'
              }`}
              style={{
                background: isRecording && recordingPartId === item.id
                  ? 'linear-gradient(90deg, #e5383b 0%, #ff6b6b 50%, #e5383b 100%)'
                  : undefined,
              }}
            >
              {!(isRecording && recordingPartId === item.id) && <MicrophoneIcon />}
              <span
                className="text-white font-medium text-[14px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isRecording && recordingPartId === item.id
                  ? `Recording... (${formatTime(recordingTime)})`
                  : 'Press To record Audio'}
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
                {formatTime(item.audioDuration)}
              </span>

              {/* Delete Button */}
              <button
                onClick={deleteAudio}
                className="p-[4px] hover:bg-[#ffecec] rounded-[4px] transition-colors"
              >
                <TrashIcon />
              </button>

              {/* Hidden Audio Element */}
              <audio ref={audioRef} src={item.audioUrl || undefined} />
            </div>
          )}

          {/* Image Upload */}
          <div className="flex gap-[12px] justify-center">
            {[0, 1, 2].map((imgIndex) => (
              <div key={imgIndex} className="relative">
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileInputRefs.current[imgIndex] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(imgIndex, file);
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => !item.imageUrls[imgIndex] && fileInputRefs.current[imgIndex]?.click()}
                  className={`w-[100px] h-[100px] border rounded-[8px] flex items-center justify-center overflow-hidden transition-colors ${
                    item.imageUrls[imgIndex] ? 'border-transparent' : 'border-[#d3d3d3] hover:border-[#e5383b]'
                  }`}
                  style={{
                    background: item.imageUrls[imgIndex]
                      ? `url(${item.imageUrls[imgIndex]}) center/cover`
                      : 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                  }}
                >
                  {!item.imageUrls[imgIndex] && <PlusIcon />}
                </button>

                {item.imageUrls[imgIndex] && (
                  <button
                    onClick={() => deleteImage(imgIndex)}
                    className="absolute bottom-[8px] right-[8px] w-[28px] h-[28px] bg-[#e5383b] rounded-[6px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
                  >
                    <TrashIcon color="white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes accordionFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
  onInquiryCreated,
  vehicleId,
  vehicleVisitId,
}: RequestPartOverlayProps) {
  // View state
  const [currentView, setCurrentView] = useState<'search' | 'form'>('search');
  
  // Camera scanner state
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  
  // Search view state
  const [partNumber, setPartNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Multiple part requests state
  const [partRequests, setPartRequests] = useState<PartRequestItem[]>([createEmptyPartRequest()]);
  
  // Audio recording state (shared across all accordions)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPartId, setRecordingPartId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeRef = useRef(0);

  // Success overlay state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitPartNumber = () => {
    if (partNumber.trim()) {
      onSubmitPartNumber(partNumber.trim());
      // Update the first part request with detected part number
      setPartRequests((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          remark: `Part Number detected - ${partNumber.trim()}`,
        };
        return updated;
      });
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
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'scanned-part.jpg', { type: 'image/jpeg' });
        setPartRequests((prev) => {
          const updated = [...prev];
          const newImages = [...updated[0].images];
          newImages[0] = file;
          
          const newUrls = [...updated[0].imageUrls];
          if (updated[0].imageUrls[0]) {
            URL.revokeObjectURL(updated[0].imageUrls[0]);
          }
          newUrls[0] = imageSrc;
          
          updated[0] = {
            ...updated[0],
            images: newImages,
            imageUrls: newUrls,
            remark: 'Part scanned - processing image...',
          };
          return updated;
        });
      });
    
    setCurrentView('form');
    onScanPart();
  };

  // Update a specific part request
  const handleUpdatePartRequest = (id: string, updates: Partial<PartRequestItem>) => {
    setPartRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Toggle accordion expand/collapse
  const handleToggleExpand = (id: string) => {
    setPartRequests((prev) =>
      prev.map((item) => ({
        ...item,
        isExpanded: item.id === id ? !item.isExpanded : item.isExpanded,
      }))
    );
  };

  // Delete a part request
  const handleDeletePartRequest = (id: string) => {
    setPartRequests((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        // Cleanup URLs
        item.imageUrls.forEach((url) => url && URL.revokeObjectURL(url));
        if (item.audioUrl) URL.revokeObjectURL(item.audioUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // Add another request - collapse current and add new expanded one
  const handleAddAnother = () => {
    // Collapse all existing accordions and add a new expanded one
    setPartRequests((prev) => [
      ...prev.map((item) => ({ ...item, isExpanded: false })),
      createEmptyPartRequest(),
    ]);

    if (onAddAnotherRequest) {
      onAddAnotherRequest();
    }
  };

  // Audio recording functions
  const startRecording = async (partId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingTimeRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        handleUpdatePartRequest(partId, {
          audioBlob: blob,
          audioUrl: url,
          audioDuration: recordingTimeRef.current,
        });
        
        stream.getTracks().forEach((track) => track.stop());
        setRecordingPartId(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingPartId(partId);

      // Track recording time
      const interval = setInterval(() => {
        recordingTimeRef.current += 1;
      }, 1000);

      // Store interval reference
      (mediaRecorderRef.current as MediaRecorder & { _intervalId?: NodeJS.Timeout })._intervalId = interval;
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const recorder = mediaRecorderRef.current as MediaRecorder & { _intervalId?: NodeJS.Timeout };
      if (recorder._intervalId) {
        clearInterval(recorder._intervalId);
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Validate all part requests
  const validateAllRequests = (): boolean => {
    let isValid = true;
    
    setPartRequests((prev) =>
      prev.map((item) => {
        const hasErrors = !item.partName.trim() || !item.preferredBrand || !item.quantity.trim() || !item.remark.trim();
        if (hasErrors) {
          isValid = false;
          return { ...item, hasAttemptedSubmit: true, isExpanded: true };
        }
        return { ...item, hasAttemptedSubmit: true };
      })
    );

    return isValid;
  };

  const handleSendRequest = async () => {
    if (!validateAllRequests()) {
      return;
    }
    
    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('auth_user');
      if (!userStr) {
        console.error('No user found');
        return;
      }
      
      const user = JSON.parse(userStr);
      
      // Prepare inquiry data
      const { createInquiry } = await import('@/services/api');
      
      const inquiryData = {
        vehicleId,
        vehicleVisitId,
        workshopOwnerId: user.id,
        // If user is owner, requestedByStaffId is null. If user is staff, use their ID
        requestedByStaffId: user.role === 'owner' ? null : user.id,
        jobCategory: 'General Parts', // Could be made dynamic
        items: partRequests.map((item) => ({
          partName: item.partName,
          preferredBrand: item.preferredBrand,
          quantity: parseInt(item.quantity),
          remark: item.remark,
          audioUrl: item.audioUrl || undefined,
          audioDuration: item.audioDuration || undefined,
          image1Url: item.imageUrls[0] || undefined,
          image2Url: item.imageUrls[1] || undefined,
          image3Url: item.imageUrls[2] || undefined,
        })),
      };
      
      const result = await createInquiry(inquiryData);
      
      if (result.success) {
        console.log('Inquiry created successfully:', result.data);
        
        // Call the optional callback if provided
        if (onSendRequest) {
          const formData: PartRequestFormData[] = partRequests.map((item) => ({
            partName: item.partName,
            preferredBrand: item.preferredBrand,
            quantity: item.quantity,
            remark: item.remark,
            audioBlob: item.audioBlob || undefined,
            audioUrl: item.audioUrl || undefined,
            audioDuration: item.audioDuration,
            images: item.images.filter((img): img is File => img !== null),
            imageUrls: item.imageUrls.filter((url) => url !== ''),
          }));
          onSendRequest(formData);
        }
        
        // Notify parent that inquiry was created
        if (onInquiryCreated) {
          onInquiryCreated();
        }
        
        setShowSuccess(true);
      } else {
        console.error('Failed to create inquiry:', result.error);
        alert('Failed to send request: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('An error occurred while sending the request');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Reset everything
    partRequests.forEach((item) => {
      item.imageUrls.forEach((url) => url && URL.revokeObjectURL(url));
      if (item.audioUrl) URL.revokeObjectURL(item.audioUrl);
    });
    setPartRequests([createEmptyPartRequest()]);
    setPartNumber('');
    setCurrentView('search');
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      partRequests.forEach((item) => {
        item.imageUrls.forEach((url) => url && URL.revokeObjectURL(url));
        if (item.audioUrl) URL.revokeObjectURL(item.audioUrl);
      });
    };
  }, []);

  // Reset when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('search');
      setPartNumber('');
      // Reset part requests
      partRequests.forEach((item) => {
        item.imageUrls.forEach((url) => url && URL.revokeObjectURL(url));
        if (item.audioUrl) URL.revokeObjectURL(item.audioUrl);
      });
      setPartRequests([createEmptyPartRequest()]);
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
                className="font-bold text-[22px] text-black flex-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Request Parts
              </h2>
              <span 
                className="text-[14px] text-[#828282] bg-[#f0f0f0] px-[12px] py-[4px] rounded-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {partRequests.length} {partRequests.length === 1 ? 'Part' : 'Parts'}
              </span>
            </div>

            {/* Part Request Accordions */}
            <div className="flex flex-col">
              {partRequests.map((item, index) => (
                <PartRequestAccordion
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={partRequests.length}
                  onUpdate={handleUpdatePartRequest}
                  onToggleExpand={handleToggleExpand}
                  onDelete={handleDeletePartRequest}
                  isRecording={isRecording}
                  recordingPartId={recordingPartId}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-[12px] mt-[8px]">
              {/* Add Another Request Button */}
              <button
                onClick={handleAddAnother}
                className="w-full h-[52px] border border-[#e5383b] rounded-[8px] flex items-center justify-center gap-[8px] hover:bg-[#fef5f5] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span
                  className="text-[#e5383b] font-semibold text-[14px] uppercase tracking-[0.5px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ADD ANOTHER PART
                </span>
              </button>

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                className="w-full h-[52px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
              >
                <span
                  className="text-white font-semibold text-[16px] uppercase tracking-[1px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  SEND REQUEST ({partRequests.length} {partRequests.length === 1 ? 'PART' : 'PARTS'})
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

      {/* Success Overlay */}
      <SuccessOverlay
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        message="REQUEST SENT"
        autoCloseDelay={2000}
      />
    </>
  );
}
