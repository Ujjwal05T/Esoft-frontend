'use client';

import React, { useEffect } from 'react';
import { OrderItemApiResponse } from '@/services/api';

interface RaiseDisputeDialogProps {
  item: OrderItemApiResponse;
  isDelivered: boolean;
  deliveryDateStr: string; // formatted date string
  onClose: () => void;
  onRaiseDispute: (item: OrderItemApiResponse) => void;
}

// Floating-label read-only field matching Figma Text fields
function InfoField({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  const borderColor = active ? '#e5383b' : '#dadada';
  const labelColor = active ? '#e5383b' : '#9e9e9e';

  return (
    <div className="relative w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        className="h-[53px] flex items-center px-[16px] rounded-[6.5px] w-full"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <p className="text-[14px] font-medium text-black leading-normal w-full truncate">
          {value || '–'}
        </p>
      </div>
      {/* Floating label */}
      <div
        className="absolute left-[12px] top-[-8px] bg-white px-[2px] flex items-center"
      >
        <p
          className="text-[10px] leading-normal"
          style={{ fontFamily: "'Poppins', sans-serif", color: labelColor }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default function RaiseDisputeDialog({
  item,
  isDelivered,
  deliveryDateStr,
  onClose,
  onRaiseDispute,
}: RaiseDisputeDialogProps) {
  // Close on backdrop click / Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      {/* Bottom sheet */}
      <div
        className="bg-white w-full max-w-[500px] md:max-w-[420px] rounded-t-[16px] flex flex-col gap-[25px] items-center pb-[32px] pt-[16px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Drag handle */}
        <div className="bg-[#d9d9d9] h-[4px] rounded-[23px] w-[172px] shrink-0" />

        {/* Part name */}
        <div className="w-full px-[16px]">
          <p className="text-[16px] font-bold text-[#323232] leading-normal">
            {item.partName}
          </p>
        </div>

        {/* 2-column grid of fields */}
        <div
          className="grid grid-cols-2 gap-x-[16px] gap-y-[16px] px-[16px] w-full"
        >
          {/* Price */}
          <InfoField
            label="Price"
            value={`Rs ${item.unitPrice.toLocaleString('en-IN')}`}
            active={isDelivered}
          />

          {/* Quantity */}
          <InfoField
            label="Quantity"
            value={String(item.quantity)}
            active={isDelivered}
          />

          {/* Brand */}
          <InfoField
            label="Brand."
            value={item.brand || 'OEM'}
            active={isDelivered}
          />

          {/* Delivery date */}
          <InfoField
            label={isDelivered ? 'Delivered on' : 'Delivery by'}
            value={deliveryDateStr || '–'}
            active={isDelivered}
          />

          {/* Raise Dispute button — full width, spans both columns */}
          {isDelivered ? (
            <button
              onClick={() => onRaiseDispute(item)}
              className="col-span-2 h-[56px] rounded-[8px] uppercase text-[15px] tracking-[-0.01px] transition-colors hover:bg-[#fff5f5]"
              style={{
                fontFamily: "'Inter', sans-serif",
                border: '1px solid #e5383b',
                color: '#e5383b',
                letterSpacing: '-0.01px',
              }}
            >
              Raise dispute
            </button>
          ) : (
            <div
              className="col-span-2 h-[56px] rounded-[8px] flex items-center justify-center"
              style={{ border: '1px solid #dadada' }}
            >
              <p
                className="uppercase text-[15px] text-[#dadada]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.01px',
                }}
              >
                Raise dispute
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
