'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import StatusBadge from '@/components/ui/StatusBadge';
import RaiseDisputeDialog from '@/components/orders/RaiseDisputeDialog';
import { getOrderById, OrderDetailApiResponse, OrderItemApiResponse } from '@/services/api';
import { OrderStatus } from '@/components/dashboard/OrderCard';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function mapStatus(s: string): OrderStatus {
  switch (s?.toLowerCase()) {
    case 'shipped':  return 'shipped';
    case 'delivered': return 'delivered';
    default: return 'in-process';
  }
}

function mapStatusType(s: OrderStatus) {
  const m: Record<OrderStatus, 'in_process' | 'shipped' | 'delivered'> = {
    'in-process': 'in_process',
    shipped: 'shipped',
    delivered: 'delivered',
  };
  return m[s];
}

// ─── sub-components ────────────────────────────────────────────────────────────

const ImagePlaceholder = () => (
  <div className="w-[60px] h-[60px] bg-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#d3d3d3" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#d3d3d3" />
      <path d="M21 15L16 10L5 21" stroke="#d3d3d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    className={`transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M6 9L12 15L18 9" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
    <path d="M19 8H1M1 8L8 1M1 8L8 15" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v13M7 11l5 5 5-5M20 21H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Info column ───────────────────────────────────────────────────────────────

const InfoColumn = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-[5px]">
    <span
      className="text-[11px] text-[#646464] font-normal"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {label}
    </span>
    <span
      className="text-[11px] font-semibold text-[#e5383b]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {value || '–'}
    </span>
  </div>
);

// ─── Order Summary Card (matches Figma OrderCards "Overview/Shipped") ──────────

function OrderSummaryCard({
  order,
  status,
  fallbackVehicleName,
  fallbackPlateNumber,
  fallbackPlacedDate,
}: {
  order: OrderDetailApiResponse;
  status: OrderStatus;
  fallbackVehicleName: string;
  fallbackPlateNumber: string;
  fallbackPlacedDate: string;
}) {
  const isDelivered = status === 'delivered';
  const dateLabel = isDelivered ? 'Delivered at:' : 'Delivery by:';
  const dateValue = formatDate(order.estimatedDeliveryDate);

  // Build vehicle name from brand + model if vehicleName is null
  const apiVehicleName = order.vehicleName
    || [order.vehicleBrand, order.vehicleModel, order.vehicleVariant].filter(Boolean).join(' ')
    || '';
  const vehicleName = apiVehicleName || fallbackVehicleName || '–';
  const plateNumber = order.plateNumber || fallbackPlateNumber || '–';

  // 'Placed at' → use createdAt from detail API, else fallback from card
  const placedDateStr = order.createdAt
    ? formatDate(order.createdAt)
    : fallbackPlacedDate || '–';

  // Real additional charges (packing + forwarding + shipping)
  const additionalCharges = (order.packingCharges ?? 0) + (order.forwardingCharges ?? 0) + (order.shippingCharges ?? 0);
  const grandTotal = order.totalAmount;
  const partsSubtotal = grandTotal - additionalCharges;

  return (
    <div
      className="bg-white border border-[#d3d3d3] rounded-[10px] p-[16px] w-full flex flex-col gap-[14px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Vehicle info + status badge */}
      <div className="flex items-start justify-between gap-[8px]">
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
          <p className="text-[14px] font-semibold text-[#4c4c4c] leading-tight">
            {vehicleName}
          </p>
          <p className="text-[17px] font-bold text-[#e5383b] leading-tight">
            {plateNumber}
          </p>
          <p className="text-[14px] font-bold text-[#e8353b]">{order.orderNumber}</p>
          <p className="text-[12px] font-medium text-[#828282]">
            {isDelivered ? 'Delivered: ' : 'Placed: '}{placedDateStr}
          </p>
        </div>
        <StatusBadge status={mapStatusType(status)} />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#dadada] w-full" />

      {/* Delivery & amounts row 1 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[11px] font-medium text-black">{dateLabel}</p>
          <p className="text-[14px] font-bold text-[#e5383b]">{dateValue}</p>
        </div>
        <div className="flex flex-col gap-[4px] items-end">
          <p className="text-[11px] font-medium text-black">Parts Subtotal</p>
          <p className="text-[14px] font-bold text-[#e5383b]">
            Rs. {partsSubtotal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Amounts row 2 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[11px] font-medium text-black">Additional Charges (Packing + Forwarding + Shipping)</p>
          <p className="text-[14px] font-bold text-[#e5383b]">
            Rs. {additionalCharges.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex flex-col gap-[4px] items-end w-[80px]">
          <p className="text-[11px] font-medium text-black">Grand Total</p>
          <p className="text-[14px] font-bold text-[#e5383b]">
            Rs. {grandTotal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Delivery Details section (matches Figma node 1727-22869) ──────────────────

function DeliveryDetailsSection({ order }: { order: OrderDetailApiResponse }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-[16px] w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Section header */}
      <button
        className="w-full flex items-center justify-between px-[16px] py-[14px]"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-[13px] font-semibold text-black">Delivery Details</span>
        <ChevronIcon open={open} />
      </button>

      {/* Divider */}
      <div className="h-px bg-[#dadada] mx-[16px]" />

      {/* Content */}
      {open && (
        <div className="px-[16px] py-[14px] flex flex-col gap-[20px]">
          {/* Row 1 */}
          <div className="flex items-start justify-between flex-wrap gap-[16px]">
            <InfoColumn label="LR/Tracking No."       value={order.lrNumber           ?? '–'} />
            <InfoColumn label="Bus/Delivery Service"  value={order.deliveryPartnerName ?? '–'} />
            <InfoColumn label="Bus/Delivery Contact No." value={order.workshopPhone    ?? '–'} />
          </div>
          {/* Row 2 */}
          <div className="flex items-start gap-[40px] flex-wrap">
            <InfoColumn label="Delivery Driver Name"       value={order.deliveryDriverName    ?? '–'} />
            <InfoColumn label="Delivery Driver Contact No." value={order.deliveryDriverContact ?? '–'} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Part row (matches Figma ListCards "Order Card") ────────────────────────────────

function PartRow({ item, onClick }: { item: OrderItemApiResponse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-[8px] flex items-center gap-[10px] px-[11px] py-[13px] w-full text-left hover:bg-[#fff5f5] active:bg-[#ffe8e8] transition-colors cursor-pointer"
    >
      <ImagePlaceholder />
      <div className="flex-1 flex flex-col gap-[4px] min-w-0">
        {/* Brand badge */}
        <div className="inline-flex">
          <span
            className="bg-[#e4e4e4] text-black text-[12px] font-medium px-[10px] py-[3px] rounded-[7px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.brand || 'OEM'}
          </span>
        </div>
        {/* Name + quantity */}
        <div className="flex items-center justify-between gap-[8px]">
          <p
            className="text-[14px] font-bold text-[#323232] truncate"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.partName}
          </p>
          <p
            className="text-[14px] font-bold text-black shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.quantity} pcs
          </p>
        </div>
        {/* Part number + price */}
        <div className="flex items-center justify-between gap-[8px]">
          <p
            className="text-[12px] font-medium text-[#939393]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.partNumber || '–'}
          </p>
          <p
            className="text-[12px] font-medium text-[#828282]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ₹{item.unitPrice.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  // Fallback values passed as URL params from the order card
  const fallbackVehicleName = searchParams.get('vehicleName') ?? '';
  const fallbackPlateNumber = searchParams.get('plateNumber') ?? '';
  const fallbackPlacedDate  = searchParams.get('placedDate')  ?? '';

  const [order, setOrder] = useState<OrderDetailApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderItemApiResponse | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (isNaN(id)) {
      setError('Invalid order ID.');
      setLoading(false);
      return;
    }
    getOrderById(id).then(res => {
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.error ?? 'Failed to load order.');
      }
      setLoading(false);
    });
  }, [params.id]);

  const status: OrderStatus = order ? mapStatus(order.status) : 'in-process';

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between overflow-x-hidden">
      <Sidebar />

      <div className="md:pl-[240px] lg:pl-[280px] flex-1">
        <div className="max-w-[500px] md:max-w-none mx-auto md:mx-0 flex-1 flex flex-col">

          {/* ── Header ───────────────────────────────────────────── */}
          <div className="bg-white px-[16px] py-[14px] flex items-center justify-between border-b border-[#e0e0e0] sticky top-0 z-10">
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-[#fff0f0] transition-colors"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
              <h1
                className="text-[22px] font-semibold text-[#e5383b]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Order Details
              </h1>
            </div>
          </div>

          {/* ── Content ──────────────────────────────────────────── */}
          <div className="flex-1 p-[16px] pb-[110px] md:pb-[24px] flex flex-col gap-[10px]">
            {loading ? (
              <div className="bg-white rounded-[12px] p-[32px] text-center">
                <p className="text-[14px] text-[#757575]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Loading order details…
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-[12px] p-[32px] text-center">
                <p className="text-[14px] text-[#e5383b]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {error}
                </p>
              </div>
            ) : order ? (
              <>
                {/* Order Summary */}
                <OrderSummaryCard
                  order={order}
                  status={status}
                  fallbackVehicleName={fallbackVehicleName}
                  fallbackPlateNumber={fallbackPlateNumber}
                  fallbackPlacedDate={fallbackPlacedDate}
                />

                {/* Delivery Details */}
                <DeliveryDetailsSection order={order} />

                {/* Parts header */}
                <p
                  className="text-[13px] font-semibold text-black px-[4px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Ordered Parts:
                </p>

                {/* Parts list */}
                <div className="flex flex-col gap-[5px]">
                  {order.items.length === 0 ? (
                    <div className="bg-white rounded-[8px] p-[24px] text-center">
                      <p className="text-[13px] text-[#9e9e9e]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        No parts found.
                      </p>
                    </div>
                  ) : (
                    order.items.map(item => (
                      <PartRow
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))
                  )}
                </div>

                {/* ── Action Buttons ──────────────────────────────── */}
                <div className="flex gap-[10px] mt-[6px]">
                  {status === 'delivered' ? (
                    <button
                      className="flex-1 bg-[#e5383b] text-white py-[12px] rounded-[6px] hover:bg-[#c82d30] transition-colors flex items-center justify-center gap-[8px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <DownloadIcon />
                      <span className="text-[13px] font-semibold">Download Invoice</span>
                    </button>
                  ) : (
                    <>
                      <button
                        className="flex-1 bg-[#e5383b] text-white py-[12px] rounded-[6px] hover:bg-[#c82d30] transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="text-[13px] font-semibold">Download Invoice</span>
                      </button>
                      <button
                        className="w-[50px] border border-[#e5383b] rounded-[6px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors"
                        aria-label="Track"
                      >
                        {/* track arrow icon */}
                        <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
                          <path d="M1 6.5H19M19 6.5L14 1.5M19 6.5L14 11.5" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>

          <NavigationBar role="owner" />
        </div>
      </div>

      {/* Raise Dispute Bottom Sheet */}
      {selectedItem && order && (
        <RaiseDisputeDialog
          item={selectedItem}
          isDelivered={status === 'delivered'}
          deliveryDateStr={formatDate(order.estimatedDeliveryDate)}
          onClose={() => setSelectedItem(null)}
          onRaiseDispute={(item) => {
            // TODO: call raise dispute API
            console.log('Raise dispute for item:', item.id);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
