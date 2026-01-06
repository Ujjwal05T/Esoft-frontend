import React from 'react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';

// TypeScript Interfaces
export type InquiryStatus = Extract<StatusType, 'open' | 'closed' | 'approved' | 'requested' | 'declined'>;
export type InquiryAction = 'edit' | 're-request' | 'approve' | 'none';

export interface InquiryMedia {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  duration?: number;
}

export interface InquiryItem {
  id: string;
  itemName: string;
  preferredBrand?: string;
  notes?: string;
  quantity: number;
  imageUrl?: string;
}

export interface Inquiry {
  id: string;
  vehicleName?: string;
  numberPlate?: string;
  placedDate: string;
  closedDate?: string;
  declinedDate?: string;
  status: InquiryStatus;
  inquiryBy: string;
  jobCategory: string;
  items: InquiryItem[];
  media: InquiryMedia[];
}

interface InquiryCardProps {
  inquiry: Inquiry;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onReRequest?: (id: string) => void;
  onApprove?: (id: string) => void;
  showNumberPlate?: boolean;
  action?: InquiryAction;
  maxVisibleItems?: number;
}

// Eye/View icon component
const ViewIcon = () => (
  <svg
    width="20"
    height="13"
    viewBox="0 0 20 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0.5C5.45 0.5 1.57 3.23 0 7.125c1.57 3.895 5.45 6.625 10 6.625s8.43-2.73 10-6.625C18.43 3.23 14.55 0.5 10 0.5zm0 11.042c-2.485 0-4.5-2.015-4.5-4.5S7.515 2.542 10 2.542s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.2c-1.49 0-2.7 1.21-2.7 2.7s1.21 2.7 2.7 2.7 2.7-1.21 2.7-2.7-1.21-2.7-2.7-2.7z"
      fill="#E5383B"
    />
  </svg>
);

// Image placeholder icon for items
const ItemImagePlaceholder = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="72" height="72" rx="8" stroke="#d3d3d3" strokeWidth="2" fill="none" />
    <path
      d="M40 30c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"
      fill="#d3d3d3"
    />
    <path
      d="M20 55l12-12 6 6 12-12 10 10v8c0 2.2-1.8 4-4 4H24c-2.2 0-4-1.8-4-4v-0z"
      fill="#d3d3d3"
    />
  </svg>
);

export default function InquiryCard({
  inquiry,
  isExpanded,
  onToggle,
  onEdit,
  onView,
  onReRequest,
  onApprove,
  showNumberPlate = true,
  action = 'edit',
  maxVisibleItems = 3,
}: InquiryCardProps) {
  const visibleItems = inquiry.items?.slice(0, maxVisibleItems) || [];
  const extraItemsCount = Math.max(0, (inquiry.items?.length || 0) - maxVisibleItems);

  // Determine action based on status if not explicitly set
  const effectiveAction = action === 'edit' && inquiry.status === 'declined' ? 're-request' : action;

  // Get the date text based on status
  const getDateText = () => {
    if (inquiry.status === 'closed' && inquiry.closedDate) {
      return `Closed: ${inquiry.closedDate}`;
    }
    if (inquiry.status === 'declined' && inquiry.declinedDate) {
      return `Declined: ${inquiry.declinedDate}`;
    }
    return `Placed: ${inquiry.placedDate}`;
  };

  // Get action button label
  const getActionLabel = () => {
    switch (effectiveAction) {
      case 're-request':
        return 'Re-request';
      case 'approve':
        return 'Approve Inquiry';
      case 'edit':
      default:
        return 'Edit';
    }
  };

  // Handle action button click
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    switch (effectiveAction) {
      case 're-request':
        onReRequest?.(inquiry.id);
        break;
      case 'approve':
        onApprove?.(inquiry.id);
        break;
      case 'edit':
      default:
        onEdit?.(inquiry.id);
        break;
    }
  };

  return (
    <div className="bg-white rounded-[17px] overflow-hidden shadow-sm border border-[#f0f0f0]">
      {/* Clickable Header Section - Collapsed View */}
      <button
        onClick={onToggle}
        className="w-full px-[16px] py-[16px] hover:bg-[#fafafa] transition-colors text-left"
      >
        {/* Row 1: Vehicle Name + Number Plate + Status Badge */}
        {showNumberPlate && inquiry.numberPlate && (
          <div className="flex items-start justify-between mb-[4px]">
            <div className="flex flex-col">
              {/* Vehicle Name */}
              {inquiry.vehicleName && (
                <p 
                  className="font-semibold text-[14px] text-[#4c4c4c]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {inquiry.vehicleName}
                </p>
              )}
              {/* Number Plate */}
              <p 
                className="font-bold text-[17px] text-[#e5383b]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {inquiry.numberPlate}
              </p>
            </div>
            <StatusBadge status={inquiry.status} />
          </div>
        )}

        {/* Row 2: Inquiry ID + Date */}
        <div className="flex flex-col mb-[12px]">
          <div className="flex items-center justify-between">
            <p 
              className="font-bold text-[14px] text-[#e8353b]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {inquiry.id}
            </p>
            {/* Show status badge here if no number plate */}
            {(!showNumberPlate || !inquiry.numberPlate) && (
              <StatusBadge status={inquiry.status} />
            )}
          </div>
          <p 
            className="font-medium text-[12px] text-[#828282]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {getDateText()}
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#dadada] w-full mb-[12px]" />

        {/* Row 3: Inquiry By + Job Category */}
        <div 
          className="flex items-center justify-between text-[12px] font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div>
            <span className="text-black">Inquiry by: </span>
            <span className="text-[#e5383b]">{inquiry.inquiryBy}</span>
          </div>
          <div>
            <span className="text-black">Job Category: </span>
            <span className="text-[#e5383b]">{inquiry.jobCategory}</span>
          </div>
        </div>
      </button>

      {/* Expanded Content - Detailed View */}
      {isExpanded && (
        <div className="px-[16px] pb-[16px]">
          {/* Divider */}
          <div className="h-[1px] bg-[#dadada] w-full mb-[16px]" />

          {/* Required Parts Section Header */}
          {inquiry.items && inquiry.items.length > 0 && (
            <div className="mb-[16px]">
              <p 
                className="font-semibold text-[14px] text-black mb-[12px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Required Parts:
              </p>
              
              {/* Parts List */}
              <div className="flex flex-col gap-[16px]">
                {visibleItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-[12px]">
                    {/* Item Image Placeholder */}
                    <div className="w-[80px] h-[80px] rounded-[12px] border border-[#d3d3d3] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ItemImagePlaceholder />
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex items-start justify-between">
                      <div className="flex flex-col">
                        <p 
                          className="font-medium text-[14px] text-[#e5383b] mb-[4px]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.itemName}
                        </p>
                        {item.preferredBrand && (
                          <p 
                            className="text-[12px] text-[#525252] mb-[2px]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Preferred Brand: {item.preferredBrand}
                          </p>
                        )}
                        {item.notes && (
                          <p 
                            className="text-[12px] text-[#525252]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Notes: {item.notes}
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity */}
                      <p 
                        className="font-medium text-[14px] text-black whitespace-nowrap"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* "+X more" indicator */}
              {extraItemsCount > 0 && (
                <div className="relative mt-[16px]">
                  <div className="h-[1px] bg-[#dadada] w-full" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-[12px]">
                    <span 
                      className="text-[14px] font-semibold text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      +{extraItemsCount} more
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons Row - Only show if action is not 'none' */}
          {effectiveAction !== 'none' && (
            <div className="flex gap-[8px] items-center mt-[16px]">
              {/* Primary Action Button */}
              <button
                onClick={handleActionClick}
                className="flex-1 bg-[#e5383b] text-white h-[48px] rounded-[8px] font-semibold text-[14px] hover:bg-[#c82d30] transition-colors flex items-center justify-center"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {getActionLabel()}
              </button>

              {/* View Button (Eye Icon) */}
              {onView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(inquiry.id);
                  }}
                  className="w-[100px] border border-[#e5383b] h-[48px] rounded-[8px] hover:bg-[#fef5f5] transition-colors flex items-center justify-center"
                >
                  <ViewIcon />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
