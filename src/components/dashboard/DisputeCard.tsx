import React from 'react';

// TypeScript Interfaces
export type DisputeStatus = 'open' | 'closed' | 'declined';
export type DisputeAction = 'edit' | 'accept' | 'chat';

export interface DisputeMedia {
  id: string;
  type: 'image' | 'audio';
  url: string;
  duration?: number;
}

export interface Dispute {
  id: string;
  vehicleName: string;
  plateNumber: string;
  receivedDate?: string;
  openedDate?: string;
  closedDate?: string;
  status: DisputeStatus;
  disputeRaised: string;
  resolutionStatus?: string;
  media?: DisputeMedia[];
  newNotifications?: number;
  newMessages?: number;
  showVehicleInfo?: boolean;
  action?: DisputeAction;
}

interface DisputeCardProps {
  dispute: Dispute;
  onEdit?: (id: string) => void;
  onAccept?: (id: string) => void;
  onView?: (id: string) => void;
  onChat?: (id: string) => void;
}

// Status configuration utility
const getStatusConfig = (status: DisputeStatus) => {
  const configs = {
    open: {
      bgColor: 'bg-[#ff6600]',
      borderColor: 'border-[#ff6600]',
      textColor: 'text-white',
      label: 'Open',
    },
    closed: {
      bgColor: 'bg-[#289d27]',
      borderColor: 'border-[#289d27]',
      textColor: 'text-white',
      label: 'Closed',
    },
    declined: {
      bgColor: 'bg-[#e5383b]',
      borderColor: 'border-[#e5383b]',
      textColor: 'text-white',
      label: 'Declined',
    },
  };
  return configs[status];
};

export default function DisputeCard({
  dispute,
  onEdit,
  onAccept,
  onView,
  onChat,
}: DisputeCardProps) {
  const statusConfig = getStatusConfig(dispute.status);
  const showVehicleInfo = dispute.showVehicleInfo !== false;
  const action = dispute.action || 'edit';

  // Determine date text based on status
  const getDateText = () => {
    if (dispute.closedDate) return `Closed: ${dispute.closedDate}`;
    if (dispute.openedDate) return `Opened: ${dispute.openedDate}`;
    return `Received: ${dispute.receivedDate || ''}`;
  };

  return (
    <div className="bg-white border border-[#d3d3d3] rounded-[10px] p-[16px] flex flex-col gap-[16px]">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-[48px]">
        <div className="flex-1 flex flex-col gap-[8px]">
          {/* Vehicle Info - Conditional */}
          {showVehicleInfo && (
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-[#4c4c4c]">
                {dispute.vehicleName}
              </p>
              <p className="text-[17px] font-bold text-[#e5383b]">
                {dispute.plateNumber}
              </p>
            </div>
          )}

          {/* Dispute ID and Date */}
          <div className="flex flex-col">
            <p className="text-[14px] font-bold text-[#e8353b]">
              {dispute.id}
            </p>
            <p className="text-[12px] font-medium text-[#828282]">
              {getDateText()}
            </p>
          </div>
        </div>

        {/* Status Badge or Notifications */}
        {dispute.newNotifications && dispute.newNotifications > 0 ? (
          <div className="flex items-center px-[12px] py-[4px]">
            <p className="text-[12px] font-medium text-[#e8353b] underline decoration-solid tracking-[-0.41px]">
              {dispute.newNotifications} new notification{dispute.newNotifications > 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <div
            className={`${statusConfig.bgColor} ${statusConfig.borderColor} border px-[12px] py-[4px] rounded-[7px] flex items-center justify-center`}
          >
            <p className={`${statusConfig.textColor} text-[12px] font-medium tracking-[-0.41px]`}>
              {statusConfig.label}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#dadada]" />

      {/* Dispute Details Section */}
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center justify-center">
          <p className="text-[11px] font-semibold text-[#828282]">
            Dispute raised:
          </p>
        </div>
        <div className="flex items-center gap-[20px] h-[17px] px-[20px] relative">
          <p className="text-[16px] font-bold text-[#e5383b] absolute left-0 top-1/2 -translate-y-1/2">
            {dispute.disputeRaised}
          </p>
        </div>

        {/* Resolution Status - For chat/closed states */}
        {(action === 'chat' || dispute.status === 'closed') && dispute.resolutionStatus && (
          <div className="flex items-center gap-[8px] text-[11px] font-semibold">
            <p className="text-[#828282]">Resolution status:</p>
            <p className="text-[#e5383b]">{dispute.resolutionStatus}</p>
          </div>
        )}
      </div>

      {/* Media Section - Only for chat action */}
      {action === 'chat' && dispute.media && dispute.media.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-[8px]">
            {/* Image Thumbnails */}
            {dispute.media
              .filter((m) => m.type === 'image')
              .slice(0, 4)
              .map((media, index) => (
                <div
                  key={media.id}
                  className="bg-white border border-[#d3d3d3] rounded-[8px] size-[38px] overflow-hidden flex items-center justify-center relative"
                >
                  {index === 3 && dispute.media && dispute.media.filter(m => m.type === 'image').length > 4 && (
                    <div className="absolute bottom-0 right-0 bg-[#f0f0f0] rounded-br-[4px] rounded-tl-[4px] px-[4px] flex items-center justify-center">
                      <p className="text-[10px] font-medium text-[#303030] tracking-[-0.41px]">
                        +{dispute.media.filter(m => m.type === 'image').length - 4}
                      </p>
                    </div>
                  )}
                  <svg
                    width="16"
                    height="16"
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
            {dispute.media
              .filter((m) => m.type === 'audio')
              .slice(0, 1)
              .map((media) => (
                <div
                  key={media.id}
                  className="border border-[#d3d3d3] rounded-[8px] p-[4px] flex items-center gap-[7px] flex-1 min-w-[191px]"
                >
                  <div className="w-[30px] h-[30px] bg-[#e5383b] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0v12l10-6L0 0z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="flex items-center gap-[2px] h-[20px]">
                      {[...Array(35)].map((_, i) => (
                        <div
                          key={i}
                          className="w-[1.2px] bg-[#434343] opacity-60 rounded-[0.6px]"
                          style={{
                            height: `${Math.random() * 10 + 2}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {media.duration && (
                    <p className="text-[9px] font-bold text-[#434343]">
                      0:{media.duration.toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              ))}
          </div>
          <div className="border-t border-[#dadada]" />
        </>
      )}

      {/* Action Buttons */}
      {(action === 'edit' || action === 'accept' || action === 'chat') && (
        <div className="flex gap-[8px] items-center">
          {/* Main Action Button */}
          {action === 'edit' && onEdit && (
            <div className="bg-[#e5383b] rounded-[5px] px-[21px] py-[9px] h-[38px] flex items-center justify-center flex-1">
              <p className="text-[10px] font-semibold text-white">Edit</p>
            </div>
          )}

          {action === 'accept' && onAccept && (
            <button
              onClick={() => onAccept(dispute.id)}
              className="bg-[#e5383b] rounded-[5px] px-[21px] py-[9px] h-[38px] flex items-center justify-center flex-1 hover:bg-[#c82d30] transition-colors"
            >
              <p className="text-[10px] font-semibold text-white">Accept Dispute</p>
            </button>
          )}

          {action === 'chat' && onChat && (
            <button
              onClick={() => onChat(dispute.id)}
              className="bg-[#e5383b] rounded-[5px] px-[21px] py-[9px] h-[42px] flex items-center justify-center flex-1 relative hover:bg-[#c82d30] transition-colors"
            >
              <p className="text-[10px] font-semibold text-white">
                {dispute.newMessages && dispute.newMessages > 0
                  ? `${dispute.newMessages} New Message${dispute.newMessages > 1 ? 's' : ''}`
                  : 'Messages'}
              </p>
              {dispute.newMessages && dispute.newMessages > 0 && (
                <div className="absolute left-0 top-0 w-[27px] h-[27px] bg-[#e5383b] border border-white rounded-full" />
              )}
            </button>
          )}

          {/* View Button (Eye Icon) */}
          {onView && (
            <button
              onClick={() => onView(dispute.id)}
              className="border border-[#e5383b] rounded-[5px] h-[38px] w-[111px] flex items-center justify-center hover:bg-[#fef5f5] transition-colors"
            >
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
            </button>
          )}
        </div>
      )}
    </div>
  );
}
