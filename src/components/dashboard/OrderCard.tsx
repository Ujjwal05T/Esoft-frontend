'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge, { StatusType, normalizeStatus } from '@/components/ui/StatusBadge';

export type OrderStatus = 'in-process' | 'shipped' | 'delivered';

export interface OrderedPart {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  vehicleName: string;
  plateNumber: string;
  orderId: string;
  placedDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: OrderStatus;
  orderedParts: OrderedPart[];
}

interface OrderCardProps {
  order: Order;
  defaultExpanded?: boolean;
  onTrackOrder?: (orderId: string) => void;
  onDownloadInvoice?: (orderId: string) => void;
}

// Map OrderStatus to StatusType for StatusBadge
const mapOrderStatusToStatusType = (status: OrderStatus): StatusType => {
  const mapping: Record<OrderStatus, StatusType> = {
    'in-process': 'in_process',
    'shipped': 'shipped',
    'delivered': 'delivered',
  };
  return mapping[status];
};

// Image Placeholder Icon
const ImagePlaceholder = () => (
  <div className="w-[60px] h-[60px] bg-[#f5f5f5] rounded-[8px] flex items-center justify-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#d3d3d3" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#d3d3d3" />
      <path d="M21 15L16 10L5 21" stroke="#d3d3d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Track Order Icon
const TrackIcon = () => (
  <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6.5H19M19 6.5L14 1.5M19 6.5L14 11.5" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Chevron Icon for expand indicator
const ChevronDownIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function OrderCard({
  order,
  defaultExpanded = false,
  onTrackOrder,
  onDownloadInvoice,
}: OrderCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const visibleParts = isExpanded ? order.orderedParts.slice(0, 3) : [];
  const remainingCount = order.orderedParts.length - 3;
  const showMoreIndicator = isExpanded && remainingCount > 0;

  const deliveryLabel = order.status === 'delivered' ? 'Delivered at:' : 'Delivery by:';

  // Toggle expand when clicking anywhere on the card header
  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Navigate to order details page — pass card data as search params in case detail API returns null
  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      vehicleName: order.vehicleName,
      plateNumber: order.plateNumber,
      placedDate: order.placedDate,
    });
    router.push(`/owner/orders/${order.id}?${params.toString()}`);
  };

  // Prevent action button clicks from toggling expansion
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className="bg-white rounded-[12px] border border-[#e0e0e0] overflow-hidden cursor-pointer transition-all duration-300"
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
    >
      {/* Clickable Header Area */}
      <div 
        className="p-[16px] hover:bg-[#fafafa] transition-colors"
        onClick={handleCardClick}
      >
        {/* Top Row - Vehicle Info & Status */}
        <div className="flex items-start justify-between mb-[8px]">
          <div className="flex-1">
            <h3
              className="text-[16px] font-semibold text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {order.vehicleName}
            </h3>
            <p
              className="text-[14px] font-semibold text-[#e5383b]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {order.plateNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={mapOrderStatusToStatusType(order.status)} />
            <ChevronDownIcon isExpanded={isExpanded} />
          </div>
        </div>

        {/* Order ID & Placed Date */}
        <div className="mb-[12px]">
          <p
            className="text-[13px] text-[#757575]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {order.orderId}
          </p>
          <p
            className="text-[12px] text-[#9e9e9e]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Placed: {order.placedDate}
          </p>
        </div>

        {/* Delivery Date & Total Amount */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[12px] text-[#757575]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {deliveryLabel}
            </p>
            <p
              className="text-[14px] font-semibold text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {order.deliveryDate}
            </p>
          </div>
          <p
            className="text-[18px] font-bold text-[#e5383b]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Expandable Content - Animated */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-[16px] pb-[16px]">
          {/* Ordered Parts Header */}
          <p
            className="text-[12px] text-[#757575] mb-[12px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ordered Parts:
          </p>

          {/* Parts List */}
          <div className="space-y-[12px]">
            {visibleParts.map((part) => (
              <div key={part.id} className="flex items-center gap-[12px]">
                {/* Part Image */}
                {part.imageUrl ? (
                  <img
                    src={part.imageUrl}
                    alt={part.name}
                    className="w-[60px] h-[60px] rounded-[8px] object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}

                {/* Part Details */}
                <div className="flex-1">
                  <p
                    className="text-[14px] font-medium text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {part.name}
                  </p>
                  <p
                    className="text-[12px] text-[#757575]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Brand: {part.brand}
                  </p>
                </div>

                {/* Price & Quantity */}
                <div className="text-right">
                  <p
                    className="text-[14px] font-semibold text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    ₹{part.price.toLocaleString('en-IN')}
                  </p>
                  <p
                    className="text-[12px] text-[#757575]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Qty: {part.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* More Indicator */}
          {showMoreIndicator && (
            <div className="relative mt-[16px]">
              <div className="h-[1px] bg-[#dadada] w-full" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] bg-white px-[12px]">
                <span
                  className="text-[12px] font-semibold text-[#e5383b]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  +{remainingCount} more
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-[12px] mt-[16px]">
            {order.status === 'delivered' ? (
              <button
                onClick={(e) => handleActionClick(e, () => onDownloadInvoice?.(order.id))}
                className="flex-1 bg-[#e5383b] text-white py-[12px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
              >
                <span
                  className="text-[13px] font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Download Invoice
                </span>
              </button>
            ) : order.status === 'shipped' ? (
              <button
                onClick={handleTrackClick}
                className="flex-1 bg-[#e5383b] text-white py-[12px] rounded-[8px] hover:bg-[#c82d30] transition-colors flex items-center justify-center gap-[8px]"
              >
                <span
                  className="text-[13px] font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  View Delivery Details
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleTrackClick}
                  className="flex-1 bg-[#e5383b] text-white py-[12px] rounded-[8px] hover:bg-[#c82d30] transition-colors flex items-center justify-center gap-[8px]"
                >
                  <span
                    className="text-[13px] font-semibold"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Track order
                  </span>
                </button>
                <button
                  onClick={handleTrackClick}
                  className="w-[50px] border border-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors"
                >
                  <TrackIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
