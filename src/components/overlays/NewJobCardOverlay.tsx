'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createJobCardWithMedia, getStaff, type CreateJobCardData, type WorkshopStaffResponse } from '@/services/api';

interface NewJobCardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob?: (data: CreateJobCardData) => void;
  vehicleId: number; // Required vehicle ID
}

interface JobCategory {
  id: string;
  name: string;
  icon: string;
}

interface StaffMember {
  id: string;
  name: string;
}

export interface JobCardData {
  jobCategory: string;
  assignedStaff: string;
  remark: string;
  audioUrl?: string;
  images: string[];
}

// Job Categories data
const jobCategories: JobCategory[] = [
  { id: '1', name: 'General Service', icon: '🔧' },
  { id: '2', name: 'Engine', icon: '⚙️' },
  { id: '3', name: 'Brake System', icon: '🛞' },
  { id: '4', name: 'Denting/Painting', icon: '🎨' },
  { id: '5', name: 'AC', icon: '❄️' },
  { id: '6', name: 'Battery', icon: '🔋' },
  { id: '7', name: 'Tyre', icon: '⭕' },
  { id: '8', name: 'Clutch System', icon: '⚡' },
  { id: '9', name: 'Electrical', icon: '💡' },
  { id: '10', name: 'Suspension', icon: '🔩' },
];


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

// Chevron Down Icon
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 9L12 15L18 9"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Microphone Icon
const MicrophoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19V23"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Play Icon
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#e5383b" />
    <path d="M10 8L16 12L10 16V8Z" fill="white" />
  </svg>
);

// Delete Icon
const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6H5H21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 8V24M8 16H24"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function NewJobCardOverlay({
  isOpen,
  onClose,
  onAddJob,
  vehicleId,
}: NewJobCardOverlayProps) {
  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>(''); // Staff ID
  const [selectedStaffName, setSelectedStaffName] = useState<string>(''); // Staff Name for display
  const [remark, setRemark] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Store actual File objects
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // For preview display
  const [videoFiles, setVideoFiles] = useState<File[]>([]); // Store actual Video files
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]); // For video preview display
  
  // Dropdown state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStaffPicker, setShowStaffPicker] = useState(false);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Staff members state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Fetch staff members on mount
  useEffect(() => {
    async function fetchStaff() {
      setLoadingStaff(true);
      try {
        const result = await getStaff();
        if (result.success && result.data) {
          // Map API response to StaffMember interface
          const mappedStaff: StaffMember[] = result.data.staff.map((s: WorkshopStaffResponse) => ({
            id: String(s.id),
            name: s.name,
          }));
          setStaffMembers(mappedStaff);
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoadingStaff(false);
      }
    }

    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setAudioDuration(recordingTime);
        setHasRecording(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setApiError('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleDeleteRecording = () => {
    audioChunksRef.current = [];
    setHasRecording(false);
    setAudioDuration(0);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      
      for (let i = 0; i < files.length && (imageFiles.length + newFiles.length) < 3; i++) {
        newFiles.push(files[i]);
        newPreviews.push(URL.createObjectURL(files[i]));
      }
      
      setImageFiles([...imageFiles, ...newFiles]);
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  // Handle video upload
  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      
      for (let i = 0; i < files.length && (videoFiles.length + newFiles.length) < 1; i++) { // Limit to 1 video for now
        newFiles.push(files[i]);
        newPreviews.push(URL.createObjectURL(files[i]));
      }
      
      setVideoFiles([...videoFiles, ...newFiles]);
      setVideoPreviewUrls([...videoPreviewUrls, ...newPreviews]);
    }
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleDeleteVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviewUrls[index]);
    setVideoFiles(videoFiles.filter((_, i) => i !== index));
    setVideoPreviewUrls(videoPreviewUrls.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleAddJob = async () => {
    if (!selectedCategory || !remark) {
      setApiError('Please fill in job category and remark');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Prepare job card data
      const jobCardData: CreateJobCardData = {
        vehicleId,
        jobCategory: selectedCategory,
        assignedStaffId: selectedStaff && selectedStaff.trim() !== '' ? parseInt(selectedStaff) : undefined,
        remark,
        priority: 'Normal',
      };

      // Prepare audio blob if recording exists
      const audioBlob = hasRecording && audioChunksRef.current.length > 0 
        ? new Blob(audioChunksRef.current, { type: 'audio/webm' })
        : undefined;

      // Call API with actual files
      const result = await createJobCardWithMedia(
        jobCardData, 
        audioBlob, 
        imageFiles.length > 0 ? imageFiles : undefined,
        videoFiles.length > 0 ? videoFiles : undefined
      );

      if (!result.success) {
        setApiError(result.error || 'Failed to create job card');
        setIsLoading(false);
        return;
      }

      // Success!
      setShowSuccess(true);
      
      // Call parent callback
      if (onAddJob) {
        onAddJob(jobCardData);
      }

      // Close after short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error creating job card:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory('');
      setSelectedStaff('');
      setSelectedStaffName('');
      setRemark('');
      // Clean up image preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreviewUrls([]);
      // Clean up video preview URLs
      videoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setVideoFiles([]);
      setVideoPreviewUrls([]);
      setShowCategoryPicker(false);
      setShowStaffPicker(false);
      setIsRecording(false);
      setRecordingTime(0);
      setHasRecording(false);
      setAudioDuration(0);
      setIsPlaying(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  }, [isOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
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
        className="relative w-full max-w-[500px] bg-white rounded-t-[16px] max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 -4px 19.2px rgba(229, 56, 59, 0.2)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[172px] h-[4px] bg-[#d9d9d9] rounded-[23px]" />
        </div>

        {/* Content */}
        <div className="px-[16px] pb-[24px]">
          {/* Header */}
          <div className="flex items-center gap-[16px] py-[16px]">
            <button onClick={onClose} className="p-[4px] hover:opacity-70 transition-opacity">
              <BackArrowIcon />
            </button>
            <h2
              className="font-semibold text-[24px] text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              New Job Card
            </h2>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-[16px]">
            {/* Job Category Dropdown */}
            <div className="relative">
              {selectedCategory && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282] z-10"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Job Category
                </label>
              )}
              <button
                onClick={() => {
                  setShowCategoryPicker(!showCategoryPicker);
                  setShowStaffPicker(false);
                }}
                className={`w-full flex items-center justify-between px-[16px] py-[14px] border rounded-[8px] ${
                  showCategoryPicker || selectedCategory? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
              >
                <span
                  className={`text-[15px] ${selectedCategory ? 'text-black' : 'text-[#828282]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {selectedCategory || 'Job Category'}
                </span>
                <ChevronDownIcon />
              </button>

              {/* Category Picker Grid */}
              {showCategoryPicker && (
                <div className="mt-[12px] bg-white border border-[#e0e0e0] rounded-[12px] p-[16px] shadow-lg">
                  <div className="grid grid-cols-3 gap-[12px]">
                    {jobCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowCategoryPicker(false);
                        }}
                        className={`flex flex-col items-center gap-[8px] p-[12px] rounded-[8px] border transition-colors ${
                          selectedCategory === category.name
                            ? 'border-[#e5383b] bg-[#fff5f5]'
                            : 'border-[#e0e0e0] hover:border-[#e5383b]'
                        }`}
                      >
                        <span className="text-[24px]">{category.icon}</span>
                        <span
                          className="text-[11px] text-center text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assign Staff Dropdown */}
            <div className="relative">
              {selectedStaffName && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282] z-10"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Assign Staff
                </label>
              )}
              <button
                onClick={() => {
                  setShowStaffPicker(!showStaffPicker);
                  setShowCategoryPicker(false);
                }}
                className={`w-full flex items-center justify-between px-[16px] py-[14px] border rounded-[8px] ${
                  showStaffPicker || selectedStaffName ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
              >
                <span
                  className={`text-[15px] ${selectedStaffName ? 'text-black' : 'text-[#828282]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {selectedStaffName || 'Assign Staff'}
                </span>
                <ChevronDownIcon />
              </button>

              {/* Staff Picker List */}
              {showStaffPicker && (
                <div className={`mt-[4px] bg-white border border-[#e0e0e0] rounded-[8px] shadow-lg overflow-hidden`}>
                  {staffMembers.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => {
                        setSelectedStaff(staff.id);
                        setSelectedStaffName(staff.name);
                        setShowStaffPicker(false);
                      }}
                      className={`w-full text-left px-[16px] py-[12px] hover:bg-[#f5f5f5] transition-colors ${
                        selectedStaff === staff.id ? 'bg-[#fff5f5] ' : ''
                      }`}
                    >
                      <span
                        className="text-[15px] text-black"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {staff.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remark Input */}
            <div className={`relative `}>
              {remark && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282] z-10"
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
                className={`w-full px-[16px] py-[14px] border ${remark ? 'border-[#e5383b]' : 'border-[#d3d3d3]'} rounded-[8px] text-[15px] text-black outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#828282]`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Audio Recording Section */}
            {!hasRecording ? (
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className="w-full bg-[#e5383b] text-white py-[14px] rounded-[8px] flex items-center justify-center gap-[8px] hover:bg-[#c82d30] transition-colors"
              >
                <MicrophoneIcon />
                <span
                  className="text-[15px] font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isRecording ? `Recording... (${formatTime(recordingTime)})` : 'Press To record Audio'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-[12px] bg-[#f5f5f5] rounded-[8px] px-[12px] py-[10px]">
                <button onClick={handlePlayPause}>
                  <PlayIcon />
                </button>
                <div className="flex-1 h-[24px] flex items-center">
                  {/* Waveform placeholder */}
                  <div className="flex items-center gap-[2px] h-full">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[2px] bg-[#d3d3d3] rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className="text-[13px] text-[#757575]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {formatTime(audioDuration)}
                </span>
                <button
                  onClick={handleDeleteRecording}
                  className="w-[28px] h-[28px] bg-[#e5383b] rounded-[4px] flex items-center justify-center"
                >
                  <DeleteIcon />
                </button>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid grid-cols-3 gap-[12px]">
              {/* Uploaded Images */}
              {imagePreviewUrls.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-[8px] overflow-hidden bg-[#f5f5f5]"
                >
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute bottom-[8px] right-[8px] w-[28px] h-[28px] bg-[#e5383b] rounded-[4px] flex items-center justify-center"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}

              {/* Add Image Placeholders */}
              {Array.from({ length: Math.max(0, 3 - imagePreviewUrls.length) }).map((_, index) => (
                <button
                  key={`placeholder-${index}`}
                  onClick={handleImageUpload}
                  className="aspect-square rounded-[8px] border-2 border-dashed border-[#e0e0e0] flex items-center justify-center hover:border-[#e5383b] transition-colors bg-[#fafafa]"
                >
                  <PlusIcon />
                </button>
              ))}

              {/* Video Upload Section */}
            <div className="mt-[12px] p-[12px] bg-[#f9f9f9] rounded-[8px] border border-dashed border-[#e0e0e0]">
               <div className="flex justify-between items-center mb-[8px]">
                 <p className="text-[12px] font-medium text-[#2b2b2b]">Add Video (Max 1)</p>
               </div>
               
               {videoPreviewUrls.length > 0 ? (
                 <div className="relative aspect-square bg-black rounded-[8px] overflow-hidden">
                   <video src={videoPreviewUrls[0]} controls className="w-full h-full object-contain" />
                   <button
                     onClick={() => handleDeleteVideo(0)}
                     className="absolute top-[8px] right-[8px] w-[28px] h-[28px] bg-[#e5383b] rounded-[4px] flex items-center justify-center z-10"
                   >
                     <DeleteIcon />
                   </button>
                 </div>
               ) : (
                 <button
                   onClick={handleVideoUpload}
                   className="w-full h-[40px] flex items-center justify-center gap-[8px]rounded-[6px] text-[13px] font-medium text-[#2b2b2b]"
                 >
                   <PlusIcon />
                 </button>
               )}
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoChange}
              accept="video/*"
              className="hidden"
            />
            </div>
          </div>

          {/* Add Job Button */}
          <div className="mt-[24px]">
            <button
              onClick={handleAddJob}
              className="w-full bg-[#e5383b] text-white py-[18px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
            >
              <span
                className="text-[15px] font-normal uppercase tracking-[-0.01px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Add Job
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
