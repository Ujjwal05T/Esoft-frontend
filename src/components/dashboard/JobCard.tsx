'use client';

import React from 'react';

export interface JobCardProps {
  id: number;
  jobCategory: string;
  assignedStaffName?: string;
  remark?: string;
  audioUrl?: string;
  images?: string[];
  videos?: string[];
  createdAt: string;
  status?: string;
  onClick?: () => void;
}

// Play button icon for audio/video
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7z" fill="white" />
  </svg>
);

export default function JobCard({
  jobCategory,
  assignedStaffName,
  remark,
  audioUrl,
  images,
  videos,
  createdAt,
  onClick,
}: JobCardProps) {
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate how many media items to show and overflow count
  const maxVisibleImages = 2;
  const visibleImages = images?.slice(0, maxVisibleImages) || [];
  const overflowCount = (images?.length || 0) - maxVisibleImages;
  const hasAudioOrVideo = audioUrl || (videos && videos.length > 0);

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';

  return (
    <div
      className="bg-white rounded-[16px] p-[16px] shadow-sm border border-[#f0f0f0] cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Header Section */}
      <div className="mb-[12px]">
        {/* Job Category Title */}
        <h3
          className="text-[16px] font-semibold text-[#e5383b] mb-[6px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {jobCategory}
        </h3>

        {/* Assigned To & Date */}
        <div className="flex items-center gap-[8px] text-[12px]">
          <span className="text-[#99a2b6]">Assigned To:</span>
          <span className="text-[#2b2b2b] font-medium">
            {assignedStaffName || 'Unassigned'}
          </span>
          <span className="text-[#99a2b6] ml-[8px]">{formattedDate}</span>
        </div>
      </div>

      {/* Remark/Description */}
      {remark && (
        <p
          className="text-[15px] text-[#2b2b2b] mb-[16px] leading-[1.4]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {remark}
        </p>
      )}

      {/* Media Section */}
      {(visibleImages.length > 0 || overflowCount > 0 || hasAudioOrVideo) && (
        <div className="flex items-center gap-[10px]">
          {/* Visible Images */}
          {visibleImages.map((imageUrl, idx) => (
            <div
              key={`img-${idx}`}
              className="w-[64px] h-[64px] rounded-[8px] overflow-hidden bg-[#f5f5f5]"
            >
              <img
                src={`${mediaUrl}${imageUrl}`}
                alt={`Job ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Overflow Count */}
          {overflowCount > 0 && (
            <div className="w-[64px] h-[64px] rounded-[8px] bg-[#f5f3f4] flex items-center justify-center">
              <span
                className="text-[16px] font-medium text-[#99a2b6]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                +{overflowCount}
              </span>
            </div>
          )}

          {/* Audio/Video Play Button */}
          {hasAudioOrVideo && (
            <div className="w-[64px] h-[64px] rounded-full bg-[#e5383b] flex items-center justify-center shadow-md">
              <PlayIcon />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
