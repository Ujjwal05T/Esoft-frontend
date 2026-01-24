'use client';

import Image from 'next/image';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  address?: string;
  aadhaarNumber?: string;
  isActive?: boolean;
}

interface StaffCardProps {
  staff: StaffMember;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

// Eye Icon for View button
const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function StaffCard({ 
  staff, 
  isExpanded = false, 
  onToggleExpand, 
  onEdit, 
  onView,
  showActions = true,
}: StaffCardProps) {
  return (
    <div 
      className="bg-white rounded-[12px] p-[16px] shadow-sm cursor-pointer"
      onClick={onToggleExpand}
    >
      <div className="flex items-start gap-[16px]">
        {/* Avatar */}
        <div className="relative w-[80px] h-[80px] rounded-[8px] overflow-hidden bg-[#f5f5f5] shrink-0">
          <Image
            src={staff.avatar}
            alt={staff.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 pt-[4px]">
          <h3
            className="text-[#e5383b] font-semibold text-[16px] mb-[4px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {staff.name}
          </h3>
          <p
            className="text-[#333333] text-[14px] mb-[4px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {staff.role}
          </p>
          <p
            className="text-[#e5383b] font-bold text-[14px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {staff.phone}
          </p>
        </div>
      </div>

      {/* Action Buttons - Only visible when expanded and showActions is true */}
      {isExpanded && showActions && (
        <div className="flex gap-[12px] mt-[16px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 bg-[#e5383b] rounded-[8px] py-[12px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
          >
            <span
              className="text-white font-medium text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Edit
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.();
            }}
            className="w-[56px] border border-[#e5383b] rounded-[8px] py-[12px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors"
          >
            <EyeIcon />
          </button>
        </div>
      )}
    </div>
  );
}
