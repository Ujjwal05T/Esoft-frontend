'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { InquiryItemResponse } from '@/services/api';

interface EditInquiryItemOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  item: InquiryItemResponse;
  onSave: (updatedItem: Partial<InquiryItemResponse>) => void;
}

// Back Arrow Icon
const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19L8 12L15 5"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function EditInquiryItemOverlay({
  isOpen,
  onClose,
  item,
  onSave,
}: EditInquiryItemOverlayProps) {
  const [partName, setPartName] = useState(item.partName);
  const [preferredBrand, setPreferredBrand] = useState(item.preferredBrand);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [remark, setRemark] = useState(item.remark || '');
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(item.audioUrl);
  const [audioDuration, setAudioDuration] = useState<number>(item.audioDuration || 0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Image state
  const [images, setImages] = useState<string[]>([
    item.image1Url,
    item.image2Url,
    item.image3Url,
  ].filter(Boolean) as string[]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when item changes
  useEffect(() => {
    setPartName(item.partName);
    setPreferredBrand(item.preferredBrand);
    setQuantity(item.quantity.toString());
    setRemark(item.remark || '');
    setAudioUrl(item.audioUrl);
    setAudioDuration(item.audioDuration || 0);
    setImages([
      item.image1Url,
      item.image2Url,
      item.image3Url,
    ].filter(Boolean) as string[]);
  }, [item]);

  const startRecording = async () => {
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
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setAudioDuration(duration);

        stream.getTracks().forEach(track => track.stop());
      };

      recordingStartTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioDuration(0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = 3 - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push(url);
    }

    setImages([...images, ...newImages]);
  };

  const deleteImage = (index: number) => {
    const imageToDelete = images[index];
    if (imageToDelete.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedItem: Partial<InquiryItemResponse> = {
      partName,
      preferredBrand,
      quantity: parseInt(quantity),
      remark,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || null,
      image1Url: images[0] || null,
      image2Url: images[1] || null,
      image3Url: images[2] || null,
    };

    onSave(updatedItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-52 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[500px] bg-white rounded-t-[16px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 -4px 19.2px rgba(229, 56, 59, 0.2)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[172px] h-[4px] bg-[#d9d9d9] rounded-[23px]" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-[16px] px-[16px] pb-[20px]">
          <button onClick={onClose} className="shrink-0">
            <BackArrowIcon />
          </button>
          <h2
            className="font-semibold text-[24px] text-black flex-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Edit Part
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-[16px] py-2 pb-[100px]">
          {/* Part Name */}
          <div className="mb-[16px] relative">
            <label
              className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              PART NAME
            </label>
            <div className="border border-[#e5383b] rounded-[8px] px-[16px] py-[14px]">
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full outline-none text-[15px] text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Preferred Brand */}
          <div className="mb-[16px] relative">
            <label
              className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              PREFERRED BRAND
            </label>
            <div className="border border-[#e5383b] rounded-[8px] px-[16px] py-[14px]">
              <input
                type="text"
                value={preferredBrand}
                onChange={(e) => setPreferredBrand(e.target.value)}
                className="w-full outline-none text-[15px] text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-[16px] relative">
            <label
              className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              QUANTITY
            </label>
            <div className="border border-[#e5383b] rounded-[8px] px-[16px] py-[14px]">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full outline-none text-[15px] text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Remark */}
          <div className="mb-[16px] relative">
            <label
              className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              REMARK
            </label>
            <div className="border border-[#e5383b] rounded-[8px] px-[16px] py-[14px]">
              <input
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full outline-none text-[15px] text-black resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="mb-[16px]">
            <p
              className="text-[14px] font-medium text-[#828282] mb-[12px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Media
            </p>

            <div className="grid grid-cols-4 gap-[12px]">
              {/* Audio Recording Card */}
              {audioUrl && (
                <div className="aspect-square rounded-[12px] border border-[#e5383b] bg-white p-[8px] flex flex-col items-center justify-center relative">
                  <button
                    onClick={deleteAudio}
                    className="absolute top-[4px] right-[4px] w-[20px] h-[20px] bg-[#e5383b] rounded-full flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="#e5383b" />
                    <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.92V21H13V18.92C16.39 18.43 19 15.53 19 12H17Z" fill="#e5383b" />
                  </svg>
                  <p className="text-[10px] text-[#828282] mt-[4px]">{audioDuration}s</p>
                </div>
              )}

              {/* Uploaded Images */}
              {images.map((image, index) => (
                <div key={index} className="aspect-square rounded-[12px] border border-[#d3d3d3] overflow-hidden relative">
                  <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteImage(index)}
                    className="absolute top-[4px] right-[4px] w-[20px] h-[20px] bg-[#e5383b] rounded-full flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add Button */}
              {(!audioUrl || images.length < 3) && (
                <button
                  onClick={() => {
                    if (!audioUrl) {
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    } else if (images.length < 3) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`aspect-square rounded-[12px] border-2 border-dashed flex flex-col items-center justify-center ${
                    isRecording ? 'border-[#e5383b] bg-[#fff5f5]' : 'border-[#d3d3d3] bg-white hover:bg-[#f5f5f5]'
                  } transition-colors`}
                >
                  {!audioUrl ? (
                    <>
                      <div className={`w-[24px] h-[24px] rounded-full ${isRecording ? 'bg-[#e5383b]' : 'bg-[#d3d3d3]'} mb-[4px]`} />
                      <p className="text-[10px] text-[#828282]">
                        {isRecording ? 'Stop' : 'Audio'}
                      </p>
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19M5 12H19" stroke="#828282" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <p className="text-[10px] text-[#828282] mt-[4px]">
                        {3 - images.length} more
                      </p>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Save Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-[16px] bg-white shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.1)]">
          <button
            onClick={handleSave}
            className="w-full h-[56px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
          >
            <span
              className="text-white font-normal text-[15px] uppercase tracking-[-0.01px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              SAVE CHANGES
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
