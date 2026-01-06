import React from 'react';

// TypeScript Interfaces
export type InquiryStatus = 'approved' | 'requested' | 'declined';

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
}

export interface Inquiry {
  id: string;
  placedDate: string;
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
  onDelete?: (id: string) => void;
  onReRequest?: (id: string) => void;
}

// Status configuration utility
const getStatusConfig = (status: InquiryStatus) => {
  const configs = {
    approved: {
      bgColor: 'bg-[#4fd748]',
      textColor: 'text-white',
      label: 'Approved',
    },
    requested: {
      bgColor: 'bg-[#ff6600]',
      textColor: 'text-white',
      label: 'Requested',
    },
    declined: {
      bgColor: 'bg-[#e5383b]',
      textColor: 'text-white',
      label: 'Declined',
    },
  };
  return configs[status];
};

export default function InquiryCard({
  inquiry,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onReRequest,
}: InquiryCardProps) {
  const statusConfig = getStatusConfig(inquiry.status);

  return (
    <div className="bg-white rounded-[12px] overflow-hidden shadow-sm">
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full px-[16px] py-[12px] hover:bg-[#f5f3f4] transition-colors text-left"
      >
        {/* Top Row: ID + Status Badge */}
        <div className="flex items-start justify-between mb-[8px]">
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#e5383b] mb-[4px]">
              {inquiry.id}
            </p>
            <p className="text-[12px] text-[#828282]">
              Placed on: {inquiry.placedDate}
            </p>
          </div>
          <div
            className={`${statusConfig.bgColor} h-[24px] px-[10px] rounded-[6px] flex items-center justify-center ml-[12px]`}
          >
            <p className={`${statusConfig.textColor} text-[11px] font-medium`}>
              {statusConfig.label}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e5e5e5] my-[12px]" />

        {/* Bottom Row: Inquiry By + Job Category + Chevron */}
        <div className="flex items-center">
          <div className="flex justify-evenly items-center gap-6 text-[12px]">
            <div>
              <span className="text-black">Inquiry by: </span>
              <span className="text-[#e5383b] font-medium">{inquiry.inquiryBy}</span>
            </div>
            <div>
              <span className="text-black">Job Category: </span>
              <span className="text-[#e5383b] font-medium">{inquiry.jobCategory}</span>
            </div>
          </div>

        
        </div>
      </button>

      {/* Expanded Content - Conditional */}
      {isExpanded && (
        <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5]">
          {/* Items Section */}
          <div className="mb-[16px] pt-[16px]">
            <div className="flex flex-col gap-[12px]">
              {inquiry.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-black mb-[4px]">
                        {item.itemName}
                      </p>
                      {item.preferredBrand && (
                        <p className="text-[10px] text-[#7d7d7d] mb-[2px]">
                          Preferred Brand: {item.preferredBrand}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-[#7d7d7d]">
                          Notes: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="ml-[16px]">
                      <p className="text-[12px] font-semibold text-black text-right">
                        {item.quantity}pcs
                      </p>
                    </div>
                  </div>
                  {index < inquiry.items.length - 1 && (
                    <div className="border-t border-[#dadada] mt-[12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media Section - Only if media exists */}
          {inquiry.media && inquiry.media.length > 0 && (
            <div className="mb-[16px] pb-[16px] border-t border-[#e5e5e5] pt-[16px]">
              <div className="flex gap-[8px] items-center flex-wrap">
                {/* Image Thumbnails */}
                {inquiry.media
                  .filter((m) => m.type === 'image')
                  .map((media) => (
                    <div
                      key={media.id}
                      className="w-[44px] h-[44px] bg-[#d4d9e3] rounded-[8px] overflow-hidden flex items-center justify-center"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                          fill="#99a2b6"
                        />
                      </svg>
                    </div>
                  ))}

                {/* Audio Player */}
                {inquiry.media
                  .filter((m) => m.type === 'audio')
                  .map((media) => (
                    <div
                      key={media.id}
                      className="flex-1 min-w-[191px] border border-[#d3d3d3] rounded-[8px] p-[6px] flex items-center gap-[8px]"
                    >
                      <div className="w-[37px] h-[40px] bg-[#e5383b] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          width="91"
                          height="14"
                          viewBox="0 0 12 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 0v14l12-7L0 0z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 flex items-center gap-[4px]">
                        {/* Simple waveform visualization */}
                        <div className="flex items-center gap-[2px] h-[20px]">
                          {[...Array(29)].map((_, i) => (
                            <div
                              key={i}
                              className="w-[2px] bg-[#434343] opacity-60 rounded-[1px]"
                              style={{
                                height: `${Math.random() * 12 + 4}px`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      {media.duration && (
                        <p className="text-[12px] font-bold text-[#434343]">
                          0:{media.duration.toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex gap-[12px]">
            {/* Edit/Re-request Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (inquiry.status === 'declined' && onReRequest) {
                  onReRequest(inquiry.id);
                } else if (onEdit) {
                  onEdit(inquiry.id);
                }
              }}
              className="flex-1 bg-[#e5383b] text-white h-[40px] rounded-[8px] font-medium text-[14px] hover:bg-[#c82d30] transition-colors"
            >
              {inquiry.status === 'declined' ? 'Re-request' : 'Edit Request'}
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) {
                  onDelete(inquiry.id);
                }
              }}
              className="w-[100px] border-2 border-[#e5383b] text-[#e5383b] h-[40px] rounded-[8px] font-medium text-[14px] hover:bg-[#fef5f5] transition-colors flex items-center justify-center"
            >
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[4px]"
              >
                <path
                  d="M1 4h14M5.333 4V2.667C5.333 1.747 6.08 1 7 1h2c.92 0 1.667.746 1.667 1.667V4m2 0v11.333c0 .92-.746 1.667-1.667 1.667H5c-.92 0-1.667-.746-1.667-1.667V4h8.334z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
