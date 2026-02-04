'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import StatusBadge from '@/components/ui/StatusBadge';
import { getQuoteById, type QuoteApiResponse } from '@/services/api';

export default function QuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<QuoteApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        setLoading(true);
        const result = await getQuoteById(parseInt(quoteId));
        if (result.success && result.data) {
          setQuote(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setLoading(false);
      }
    }
    if (quoteId) fetchQuote();
  }, [quoteId]);

  // ── Derived state ──────────────────────────────────────────
  const isExpired = quote?.expiresAt ? new Date(quote.expiresAt) < new Date() : false;
  const isAccepted = quote?.status === 'approved';

  const partsSubtotal = quote?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
  const additionalCharges = quote
    ? quote.packingCharges + quote.forwardingCharges + quote.shippingCharges
    : 0;

  // Latest estimated delivery across all items
  const deliveryByDate = quote?.items.reduce<string | null>((max, item) => {
    if (!item.estimatedDelivery) return max;
    if (!max || new Date(item.estimatedDelivery) > new Date(max)) return item.estimatedDelivery;
    return max;
  }, null);

  // "Expires in X hours / Y days" countdown (only while still active)
  const getExpiresInText = () => {
    if (!quote?.expiresAt) return null;
    const diff = new Date(quote.expiresAt).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours < 24 ? `${hours} hours` : `${Math.floor(hours / 24)} days`;
  };

  // Which charge types are non-zero (for the breakdown label)
  const chargesLabels: string[] = [];
  if (quote?.shippingCharges) chargesLabels.push('Shipping');
  if (quote?.packingCharges) chargesLabels.push('Packaging');
  if (quote?.forwardingCharges) chargesLabels.push('Forwarding');

  // ── Helpers ─────────────────────────────────────────────────
  const formatPrice = (price: number) => `Rs. ${Math.round(price)}`;

  const formatShortDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).toLowerCase();

  const formatDeliveryDate = (date: string | null) => {
    if (!date) return '-';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const getBadgeStatus = () => {
    if (isExpired) return 'expired' as const;
    if (quote?.status === 'approved') return 'accepted' as const;
    if (quote?.status === 'rejected') return 'declined' as const;
    return 'pending_review' as const;
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#f5f3f4] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5383b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote details...</p>
        </div>
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────
  if (!quote) {
    return (
      <div className="bg-[#f5f3f4] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quote Not Found</h2>
          <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#e5383b] text-white px-6 py-2 rounded-lg hover:bg-[#d32f2f] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="bg-[#f5f3f4] relative min-h-screen w-full overflow-x-hidden">
      {/* Sidebar (desktop) */}
      <Sidebar />

      <div className="md:pl-[240px] lg:pl-[280px]">
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0 bg-white md:bg-[#f5f3f4]">

          {/* Mobile header */}
          <div className="md:hidden sticky top-0 w-full bg-white h-[55px] z-50 shadow-sm">
            <div className="h-[15px] bg-white" />
            <div className="h-[24px] flex items-start justify-between px-[16px]">
              <button onClick={() => router.back()} className="w-[24px] h-[24px] flex items-center justify-center">
                <Image src="/assets/icons/arrow-back.svg" alt="Back" width={24} height={24} />
              </button>
              <h1 className="font-semibold text-[19px] text-[#E5383B] tracking-[-0.64px]">Quote Details</h1>
              <button className="w-[24px] h-[24px] flex items-center justify-center">
                <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} />
              </button>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between px-[24px] lg:px-[32px] pt-[24px] pb-[8px]">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[#e5383b] hover:opacity-80 transition">
              <Image src="/assets/icons/arrow-back.svg" alt="Back" width={24} height={24} />
              <span className="font-semibold text-[16px]">Back</span>
            </button>
            <h1 className="font-semibold text-[22px] text-[#E5383B]">Quote Details</h1>
            <div className="w-24" />
          </div>

          {/* Page body */}
          <div className="pt-[0px] pb-[117px] md:pb-[24px] px-[16px] md:px-[24px] lg:px-[32px] bg-[#f5f3f4]">
            <div className="flex flex-col gap-[16px] py-[16px]">

              {/* ── Header card: vehicle info + status ── */}
              <div className="bg-white rounded-[12px] p-[16px]">
                <div className="flex items-start justify-between mb-[4px]">
                  <div>
                    <p className="font-semibold text-[14px] text-[#4c4c4c]">{quote.vehicleName}</p>
                    <p className="font-bold text-[17px] text-[#e5383b]">{quote.plateNumber}</p>
                  </div>
                  <StatusBadge status={getBadgeStatus()} />
                </div>

                <p className="font-bold text-[14px] text-[#e5383b] mt-[4px]">{quote.quoteNumber}</p>

                {isExpired ? (
                  <p className="font-medium text-[12px] text-[#828282] mt-[2px]">
                    expired: {formatShortDate(quote.expiresAt!)}
                  </p>
                ) : (
                  <>
                    <p className="font-medium text-[12px] text-[#828282] mt-[2px]">
                      Submitted: {formatShortDate(quote.createdAt)}
                    </p>
                    {quote.expiresAt && getExpiresInText() && (
                      <p className="font-medium text-[12px] text-[#e5383b] mt-[2px]">
                        Expires in <span className="font-bold">{getExpiresInText()}</span>
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* ════════════════════════════════════════════════════
                  EXPIRED STATE
                  ════════════════════════════════════════════════════ */}
              {isExpired && (
                <>
                  {/* Warning banner + Grand Total label */}
                  <div className="bg-white rounded-[12px] p-[16px]">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-[13px] text-[#e5383b] flex-1 mr-[12px]">
                        The quote is expired. Kindly re-request for current
                      </p>
                      <div className="text-right shrink-0">
                        <p className="font-medium text-[12px] text-[#828282]">Grand Total</p>
                      </div>
                    </div>
                  </div>

                  {/* Expired items — no prices, just name + qty + description + brand */}
                  <div className="bg-white rounded-[12px] overflow-hidden">
                    {quote.items.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <div className="h-px bg-[#f0f0f0] mx-[16px]" />}
                        <div className="px-[16px] py-[14px]">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-[15px] text-[#2b2b2b]">
                                {item.partName} <span className="text-[#828282]">x {item.quantity}</span>
                              </p>
                              {item.description && (
                                <p className="font-medium text-[13px] text-[#828282] mt-[2px]">{item.description}</p>
                              )}
                            </div>
                            {item.brand && (
                              <span className="px-[10px] py-[3px] rounded-[6px] border border-[#828282] text-[12px] font-medium text-[#828282] shrink-0 ml-[8px]">
                                {item.brand}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Re-request CTA */}
                  <button
                    className="w-full bg-[#e5383b] text-white h-[52px] rounded-[10px] font-semibold text-[15px] hover:bg-[#c82d30] transition"
                    onClick={() => console.log('Re-request quote:', quote.id)}
                  >
                    RE-REQUEST
                  </button>
                </>
              )}

              {/* ════════════════════════════════════════════════════
                  ACTIVE STATE
                  ════════════════════════════════════════════════════ */}
              {!isExpired && (
                <>
                  {/* Summary card: delivery / subtotal / charges / grand total */}
                  <div className="bg-white rounded-[12px] p-[16px]">
                    <div className="flex items-start justify-between mb-[12px]">
                      <div>
                        <p className="font-medium text-[12px] text-[#828282]">Delivery by:</p>
                        <p className="font-bold text-[14px] text-[#e5383b]">{formatShortDate(deliveryByDate || quote.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[12px] text-[#828282]">Parts Subtotal</p>
                        <p className="font-bold text-[16px] text-[#2b2b2b]">{formatPrice(partsSubtotal)}</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-[12px] text-[#828282]">Additional Charges (Shipping and Labor)</p>
                        <p className="font-bold text-[14px] text-[#e5383b]">{formatPrice(additionalCharges)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[12px] text-[#828282]">Grand Total</p>
                        <p className="font-bold text-[18px] text-[#2b2b2b]">{formatPrice(quote.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="bg-white rounded-[12px] overflow-hidden">
                    {quote.items.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <div className="h-px bg-[#f0f0f0] mx-[16px]" />}
                        <div className="px-[16px] py-[14px]">
                          {/* Brand badge + availability badge */}
                          <div className="flex items-center justify-between mb-[6px]">
                            {item.brand ? (
                              <span className="px-[10px] py-[3px] rounded-[6px] bg-[#2b2b2b] text-[12px] font-medium text-white">
                                {item.brand}
                              </span>
                            ) : <span />}
                            <span
                              className={`px-[10px] py-[3px] rounded-[6px] text-[12px] font-medium text-white ${
                                item.availability === 'in_stock' ? 'bg-[#289d27]' : 'bg-[#e5383b]'
                              }`}
                            >
                              {item.availability === 'in_stock' ? 'Available' : 'Unavailable'}
                            </span>
                          </div>

                          {/* Part name + unit price */}
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-[15px] text-[#2b2b2b]">{item.partName}</p>
                            <p className="font-bold text-[15px] text-[#2b2b2b]">{formatPrice(item.unitPrice)}</p>
                          </div>

                          {/* Expected delivery + quantity */}
                          <div className="flex items-center justify-between mt-[4px]">
                            <p className="font-medium text-[12px] text-[#828282]">
                              Exp. Delivery {formatDeliveryDate(item.estimatedDelivery)}
                            </p>
                            <p className="font-medium text-[12px] text-[#828282]">
                              {item.quantity} of {item.quantity} pcs
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Charges breakdown (only if any charges exist) */}
                  {additionalCharges > 0 && (
                    <div className="bg-white rounded-[12px] p-[16px]">
                      <p className="font-semibold text-[15px] text-[#2b2b2b] mb-[8px]">Additional Charges</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[13px] text-[#828282]">{chargesLabels.join(', ')}</p>
                        <p className="font-bold text-[15px] text-[#2b2b2b]">{formatPrice(additionalCharges)}</p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-[12px]">
                    <button
                      disabled={isAccepted}
                      onClick={() => console.log('Approve and pay:', quote.id)}
                      className={`flex-1 h-[52px] rounded-[10px] font-semibold text-[15px] transition ${
                        isAccepted
                          ? 'bg-[#828282] text-white cursor-not-allowed'
                          : 'bg-[#e5383b] text-white hover:bg-[#c82d30]'
                      }`}
                    >
                      {isAccepted ? 'ORDER PLACED' : 'APPROVE AND PAY'}
                    </button>

                    {!isAccepted && (
                      <button
                        onClick={() => console.log('Decline:', quote.id)}
                        className="flex-1 h-[52px] rounded-[10px] border border-[#e5383b] text-[#e5383b] font-semibold text-[15px] hover:bg-[#fef5f5] transition"
                      >
                        DECLINE
                      </button>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Bottom nav */}
          <NavigationBar role="owner" />
        </div>
      </div>
    </div>
  );
}
