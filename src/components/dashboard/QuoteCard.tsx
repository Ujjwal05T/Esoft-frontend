import React from 'react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';

// TypeScript Interfaces
export type QuoteStatus = Extract<StatusType, 'pending_review' | 'accepted'>;

export interface QuoteItem {
  id: string;
  itemName: string;
  brand?: string;
  mrp?: number;
  price: number;
  quantity: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface Quote {
  id: string;
  vehicleName: string;
  plateNumber: string;
  quoteId: string;
  submittedDate: string;
  status: QuoteStatus;
  items: QuoteItem[];
  estimatedTotal: number;
}

interface QuoteCardProps {
  quote: Quote;
  isExpanded: boolean;
  onToggle: () => void;
  showNumberPlate?: boolean;
  onAccept?: (id: string) => void;
  onView?: (id: string) => void;
  maxVisibleAvailable?: number;
  maxVisibleUnavailable?: number;
}

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

export default function QuoteCard({
  quote,
  isExpanded,
  onToggle,
  showNumberPlate = true,
  onAccept,
  onView,
  maxVisibleAvailable = 2,
  maxVisibleUnavailable = 2,
}: QuoteCardProps) {
  const isAccepted = quote.status === 'accepted';
  
  // Split items into available and unavailable
  const availableItems = quote.items.filter(item => item.isAvailable);
  const unavailableItems = quote.items.filter(item => !item.isAvailable);
  
  // Get visible items
  const visibleAvailableItems = availableItems.slice(0, maxVisibleAvailable);
  const extraAvailableCount = Math.max(0, availableItems.length - maxVisibleAvailable);
  
  const visibleUnavailableItems = unavailableItems.slice(0, maxVisibleUnavailable);
  const extraUnavailableCount = Math.max(0, unavailableItems.length - maxVisibleUnavailable);

  // Format price with rupee symbol
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <div className="bg-white rounded-[17px] overflow-hidden shadow-sm border border-[#f0f0f0]">
      {/* Clickable Header Section - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-[16px] py-[16px] hover:bg-[#fafafa] transition-colors text-left"
      >
        {/* Row 1: Vehicle Name + Number Plate + Status Badge */}
        <div className="flex items-start justify-between mb-[4px]">
          <div className="flex flex-col">
            {/* Vehicle Name */}
            <p 
              className="font-semibold text-[14px] text-[#4c4c4c]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {quote.vehicleName}
            </p>
            {/* Number Plate */}
            {showNumberPlate && (
              <p 
                className="font-bold text-[17px] text-[#e5383b]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {quote.plateNumber}
              </p>
            )}
          </div>
          <StatusBadge status={quote.status} />
        </div>

        {/* Row 2: Quote ID + Date */}
        <div className="flex flex-col mb-[12px]">
          <p 
            className="font-bold text-[14px] text-[#e8353b]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {quote.quoteId}
          </p>
          <p 
            className="font-medium text-[12px] text-[#828282]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Submitted: {quote.submittedDate}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#dadada] w-full" />

        {/* Collapsed View - Estimated Total (only when not expanded) */}
        {!isExpanded && (
          <div className="flex items-center justify-end gap-[8px] mt-[12px]">
            <p 
              className="font-medium text-[14px] text-[#828282]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Estimated Total:
            </p>
            <p 
              className="font-bold text-[20px] text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {formatPrice(quote.estimatedTotal)}
            </p>
          </div>
        )}
      </button>

      {/* Expanded Content - Detailed View */}
      {isExpanded && (
        <div className="px-[16px] pb-[16px]">
          {/* Available Parts Section */}
          {availableItems.length > 0 && (
            <div className="mb-[16px]">
              <p 
                className="font-semibold text-[14px] text-black mb-[12px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Available Parts:
              </p>
              
              {/* Available Parts List */}
              <div className="flex flex-col gap-[16px]">
                {visibleAvailableItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-[12px]">
                    {/* Item Image Placeholder */}
                    <div className="w-[80px] h-[80px] rounded-[12px] border border-[#d3d3d3] flex items-center justify-center shrink-0 overflow-hidden bg-white">
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
                          className="font-medium text-[14px] text-[#e5383b] mb-[2px]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.itemName}
                        </p>
                        {item.brand && (
                          <p 
                            className="text-[12px] text-[#525252] mb-[2px]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Brand: {item.brand}
                          </p>
                        )}
                        {item.mrp && (
                          <p 
                            className="text-[12px] text-[#828282]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            MRP: {formatPrice(item.mrp)}
                          </p>
                        )}
                      </div>
                      
                      {/* Price and Quantity */}
                      <div className="text-right">
                        <p 
                          className="font-bold text-[14px] text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {formatPrice(item.price)}
                        </p>
                        <p 
                          className="font-medium text-[12px] text-[#828282]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* "+X more" indicator for available items */}
              {extraAvailableCount > 0 && (
                <div className="mt-[12px] text-center">
                  <span 
                    className="text-[14px] font-semibold text-[#e5383b]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    +{extraAvailableCount} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Unavailable Parts Section */}
          {unavailableItems.length > 0 && (
            <div className="mb-[16px]">
              <p 
                className="font-semibold text-[14px] text-[#828282] mb-[12px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Unavailable Parts:
              </p>
              
              {/* Unavailable Parts List */}
              <div className="flex flex-col gap-[12px]">
                {visibleUnavailableItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-[12px] opacity-60">
                    {/* Item Image Placeholder */}
                    <div className="w-[60px] h-[60px] rounded-[8px] border border-[#d3d3d3] flex items-center justify-center shrink-0 overflow-hidden bg-[#f5f5f5]">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.itemName}
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <ItemImagePlaceholder />
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        <p 
                          className="font-medium text-[14px] text-[#e5383b]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.itemName}
                        </p>
                        {item.brand && (
                          <p 
                            className="text-[12px] text-[#828282]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Brand: {item.brand}
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity */}
                      <p 
                        className="font-medium text-[12px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* "+X more" indicator for unavailable items */}
              {extraUnavailableCount > 0 && (
                <div className="mt-[12px] text-center">
                  <span 
                    className="text-[14px] font-semibold text-[#e5383b]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    +{extraUnavailableCount} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Divider before total */}
          <div className="h-px bg-[#dadada] w-full mb-[12px]" />

          {/* Estimated Total */}
          <div className="flex items-center justify-end gap-[8px] mb-[16px]">
            <p 
              className="font-medium text-[14px] text-[#828282]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Estimated Total:
            </p>
            <p 
              className="font-bold text-[20px] text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {formatPrice(quote.estimatedTotal)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[8px] items-center">
            {/* Primary Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.(quote.id);
              }}
              disabled={isAccepted}
              className={`flex-1 h-[48px] rounded-[8px] font-semibold text-[14px] flex items-center justify-center transition-colors ${
                isAccepted 
                  ? 'bg-[#828282] text-white cursor-not-allowed' 
                  : 'bg-[#e5383b] text-white hover:bg-[#c82d30]'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isAccepted ? 'Order Placed' : 'Accept Quote'}
            </button>

            {/* View Button (Eye Icon) */}
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(quote.id);
                }}
                className="w-[100px] border border-[#e5383b] h-[48px] rounded-[8px] hover:bg-[#fef5f5] transition-colors flex items-center justify-center"
              >
                <ViewIcon />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
