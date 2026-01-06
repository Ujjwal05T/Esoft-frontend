import React from 'react';

// All possible status types across the application
export type StatusType =
  | 'open'
  | 'closed'
  | 'declined'
  | 'requested'
  | 'in_process'
  | 'shipped'
  | 'delivered'
  | 'pending_review'
  | 'accepted'
  | 'approved';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

// Status configuration based on Figma design
const statusConfigs: Record<StatusType, { bgColor: string; label: string }> = {
  open: {
    bgColor: '#ff6600',
    label: 'Open',
  },
  closed: {
    bgColor: '#289d27',
    label: 'Closed',
  },
  declined: {
    bgColor: '#e5383b',
    label: 'Declined',
  },
  requested: {
    bgColor: '#ffad2a',
    label: 'Requested',
  },
  in_process: {
    bgColor: '#ff6600',
    label: 'In Process',
  },
  shipped: {
    bgColor: '#0090ff',
    label: 'Shipped',
  },
  delivered: {
    bgColor: '#289d27',
    label: 'Delivered',
  },
  pending_review: {
    bgColor: '#ffad2a',
    label: 'Pending Review',
  },
  accepted: {
    bgColor: '#289d27',
    label: 'Accepted',
  },
  approved: {
    bgColor: '#289d27',
    label: 'Approved',
  },
};

/**
 * StatusBadge Component
 * 
 * A reusable status badge component following the Figma design system.
 * 
 * Design specs:
 * - Border radius: 7px
 * - Padding: 12px horizontal, 4px vertical
 * - Font: Inter Medium, 12px
 * - Text: white, centered
 * - Letter spacing: -0.41px
 * - Line height: 15px
 * 
 * @example
 * <StatusBadge status="open" />
 * <StatusBadge status="declined" label="Custom Label" />
 */
export default function StatusBadge({
  status,
  label,
  className = '',
}: StatusBadgeProps) {
  const config = statusConfigs[status];
  const displayLabel = label || config.label;
  const bgColor = config.bgColor;

  return (
    <div
      className={`inline-flex items-center justify-center px-[12px] py-[4px] rounded-[7px] overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        borderColor: bgColor,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <span
        className="font-medium text-[12px] text-white text-center whitespace-nowrap"
        style={{
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-0.41px',
          lineHeight: '15px',
        }}
      >
        {displayLabel}
      </span>
    </div>
  );
}

/**
 * Helper function to get status configuration
 * Useful when you need the raw config values
 */
export function getStatusConfig(status: StatusType) {
  return statusConfigs[status];
}

/**
 * Helper to convert various status string formats to StatusType
 */
export function normalizeStatus(status: string): StatusType {
  const normalized = status
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_') as StatusType;
  
  // Map common aliases
  const aliases: Record<string, StatusType> = {
    'inprocess': 'in_process',
    'in-process': 'in_process',
    'pendingreview': 'pending_review',
    'pending-review': 'pending_review',
  };

  return aliases[normalized] || normalized;
}
