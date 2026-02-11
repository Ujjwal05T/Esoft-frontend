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
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchQuote() {
      try {
        setLoading(true);
        const result = await getQuoteById(parseInt(quoteId));
        if (result.success && result.data) {
          setQuote(result.data);
          // Pre-select all available items
          const availableIds = new Set(
            result.data.items
              .filter((i) => i.availability === 'in_stock')
              .map((i) => i.id)
          );
          setSelectedItems(availableIds);
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
  const isExpired = quote?.expiresAt
    ? new Date(quote.expiresAt) < new Date()
    : false;
  const isAccepted = quote?.status === 'approved';

  const availableItems =
    quote?.items.filter((i) => i.availability === 'in_stock') || [];
  const unavailableItems =
    quote?.items.filter((i) => i.availability !== 'in_stock') || [];

  const partsSubtotal =
    quote?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
  const additionalCharges = quote
    ? quote.packingCharges + quote.forwardingCharges + quote.shippingCharges
    : 0;
  const grandTotal = quote?.totalAmount || 0;

  // Latest estimated delivery across all items
  const deliveryByDate = quote?.items.reduce<string | null>((max, item) => {
    if (!item.estimatedDelivery) return max;
    if (!max || new Date(item.estimatedDelivery) > new Date(max))
      return item.estimatedDelivery;
    return max;
  }, null);

  // "Expires in X hours / Y days" countdown
  const getExpiresInText = () => {
    if (!quote?.expiresAt) return null;
    const diff = new Date(quote.expiresAt).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours < 24 ? `${hours} hours` : `${Math.floor(hours / 24)} days`;
  };

  // ── Helpers ─────────────────────────────────────────────────
  const formatPrice = (price: number) => `Rs. ${Math.round(price)}`;

  const formatShortDate = (date: string) =>
    new Date(date)
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .toLowerCase();

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

  const toggleItem = (itemId: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#f5f5f5] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5383b] mx-auto mb-4"></div>
          <p style={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>
            Loading quote details...
          </p>
        </div>
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────
  if (!quote) {
    return (
      <div className="bg-[#f5f5f5] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center px-4">
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#333',
              fontFamily: "'Inter', sans-serif",
              marginBottom: 8,
            }}
          >
            Quote Not Found
          </h2>
          <p
            style={{
              color: '#666',
              fontFamily: "'Inter', sans-serif",
              marginBottom: 24,
            }}
          >
            The quote you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: '#e5383b',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Sidebar (desktop) */}
      <Sidebar />

      <div className="md:pl-[240px] lg:pl-[280px]">
        <div
          style={{ maxWidth: 440, margin: '0 auto' }}
          className="md:max-w-none md:mx-0"
        >
          {/* ───── Mobile Header ───── */}
          <div
            className="md:hidden"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
              backgroundColor: '#fff',
              paddingBottom: 16,
              paddingTop: 10,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <button
                  onClick={() => router.back()}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  <Image
                    src="/assets/icons/arrow-back.svg"
                    alt="Back"
                    width={23}
                    height={18}
                  />
                </button>
                <h1
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 24,
                    color: '#e5383b',
                    lineHeight: '36px',
                    margin: 0,
                  }}
                >
                  Quote Details
                </h1>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Image
                  src="/assets/icons/search.svg"
                  alt="Search"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* ───── Desktop Header ───── */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 32px 8px',
            }}
          >
            <button
              onClick={() => router.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                color: '#e5383b',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <Image
                src="/assets/icons/arrow-back.svg"
                alt="Back"
                width={24}
                height={24}
              />
              Back
            </button>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 22,
                color: '#e5383b',
                margin: 0,
              }}
            >
              Quote Details
            </h1>
            <div style={{ width: 96 }} />
          </div>

          {/* ───── Page Body ───── */}
          <div
            style={{
              paddingTop: 0,
              paddingBottom: isExpired ? 80 : 80,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: '#f5f5f5',
            }}
            className="md:px-[24px] lg:px-[32px] md:pb-[24px]"
          >
            {/* ════════════════════════════════════════
                QUOTE INFO CARD (shared header)
                ════════════════════════════════════════ */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #d3d3d3',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Top row: vehicle info + status badge */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left: vehicle + quote info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#4c4c4c',
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      {quote.vehicleName}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 17,
                        color: '#e5383b',
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      {quote.plateNumber}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#e8353b',
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      {quote.quoteNumber}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: '#828282',
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      {isExpired
                        ? `expired: ${formatShortDate(quote.expiresAt!)}`
                        : `Submitted: ${formatShortDate(quote.createdAt)}`}
                    </p>
                  </div>
                </div>

                {/* Right: status badge + expires text */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <StatusBadge status={getBadgeStatus()} />
                  {!isExpired && quote.expiresAt && getExpiresInText() && (
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: '#000',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: '15px',
                        letterSpacing: '-0.41px',
                      }}
                    >
                      Expires in{' '}
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#e5383b',
                        }}
                      >
                        {getExpiresInText()}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#dadada' }} />

              {/* ════════════ EXPIRED BOTTOM SECTION ════════════ */}
              {isExpired && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 28,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: 11,
                      color: '#e5383b',
                      margin: 0,
                      flex: 1,
                      lineHeight: 'normal',
                    }}
                  >
                    The quote is expired. Kindly re-request for current
                    availability and prices
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      flexShrink: 0,
                      width: 75,
                      color: '#a8a8a8',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: 11,
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      Grand Total
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      {formatPrice(grandTotal)}
                    </p>
                  </div>
                </div>
              )}

              {/* ════════════ ACTIVE BOTTOM SECTION (financial summary) ════════════ */}
              {!isExpired && (
                <>
                  {/* Row 1: Delivery by + Parts Subtotal */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: 11,
                          color: '#000',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        Delivery by:
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#e5383b',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        {formatShortDate(deliveryByDate || quote.createdAt)}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: 11,
                          color: '#000',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        Parts Subtotal
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#e5383b',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        {formatPrice(partsSubtotal)}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Additional Charges + Grand Total */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: 11,
                          color: '#000',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        Additional Charges (Shipping and Labor)
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#e5383b',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        {formatPrice(additionalCharges)}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        width: 75,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: 11,
                          color: '#000',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        Grand Total
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#e5383b',
                          margin: 0,
                          lineHeight: 'normal',
                        }}
                      >
                        {formatPrice(grandTotal)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ════════════════════════════════════════
                ITEMS LIST
                ════════════════════════════════════════ */}
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              {/* ── ACTIVE STATE: items with checkboxes ── */}
              {!isExpired && (
                <>
                  {/* Available items */}
                  {availableItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        padding: '13px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: 19,
                          height: 18,
                          borderRadius: 5,
                          border: '1px solid #e5383b',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: selectedItems.has(item.id)
                            ? '#e5383b'
                            : 'transparent',
                        }}
                      >
                        {selectedItems.has(item.id) && (
                          <svg
                            width="12"
                            height="9"
                            viewBox="0 0 12 9"
                            fill="none"
                          >
                            <path
                              d="M1 4L4.5 7.5L11 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Item content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                          }}
                        >
                          {/* Brand + Availability badges */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            {item.brand ? (
                              <div
                                style={{
                                  backgroundColor: '#e4e4e4',
                                  borderRadius: 7,
                                  padding: '4px 12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: '#000',
                                    lineHeight: '15px',
                                    letterSpacing: '-0.41px',
                                  }}
                                >
                                  {item.brand}
                                </span>
                              </div>
                            ) : (
                              <span />
                            )}
                            <div
                              style={{
                                backgroundColor: '#289d27',
                                borderRadius: 7,
                                padding: '4px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 500,
                                  fontSize: 12,
                                  color: '#fff',
                                  lineHeight: '15px',
                                  letterSpacing: '-0.41px',
                                }}
                              >
                                Available
                              </span>
                            </div>
                          </div>

                          {/* Part name + price */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            <span style={{ color: '#323232' }}>
                              {item.partName}
                            </span>
                            <span style={{ color: '#000', whiteSpace: 'nowrap' }}>
                              {formatPrice(item.unitPrice)}
                            </span>
                          </div>

                          {/* Delivery date + quantity */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                color: '#939393',
                                lineHeight: 'normal',
                              }}
                            >
                              Exp. Delivery{' '}
                              {formatDeliveryDate(item.estimatedDelivery)}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                color: '#828282',
                                lineHeight: 'normal',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.quantity} of {item.quantity} pcs
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Unavailable items */}
                  {unavailableItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        padding: '13px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Checkbox (disabled style) */}
                      <div
                        style={{
                          width: 19,
                          height: 18,
                          borderRadius: 5,
                          border: '1px solid #b1a7a6',
                          flexShrink: 0,
                        }}
                      />

                      {/* Item content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                          }}
                        >
                          {/* Part name + Unavailable badge */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: 14,
                                color: '#323232',
                              }}
                            >
                              {item.partName}
                            </span>
                            <div
                              style={{
                                backgroundColor: '#e5383b',
                                borderRadius: 7,
                                padding: '4px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 500,
                                  fontSize: 12,
                                  color: '#fff',
                                  lineHeight: '15px',
                                  letterSpacing: '-0.41px',
                                }}
                              >
                                Unavailable
                              </span>
                            </div>
                          </div>

                          {/* Delivery date + quantity */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                color: '#000',
                                lineHeight: 'normal',
                              }}
                            >
                              Exp. Arrival by{' '}
                              {formatDeliveryDate(item.estimatedDelivery)}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                color: '#828282',
                                lineHeight: 'normal',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              0 of {item.quantity} pcs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ── EXPIRED STATE: items with grayed style ── */}
              {isExpired &&
                quote.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      padding: '13px 11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Checkbox (disabled) */}
                    <div
                      style={{
                        width: 19,
                        height: 18,
                        borderRadius: 5,
                        border: '1px solid #e5383b',
                        flexShrink: 0,
                      }}
                    />

                    {/* Item content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        {/* Brand badge + quantity */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          {item.brand ? (
                            <div
                              style={{
                                backgroundColor: '#e4e4e4',
                                borderRadius: 7,
                                padding: '4px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 500,
                                  fontSize: 12,
                                  color: '#000',
                                  lineHeight: '15px',
                                  letterSpacing: '-0.41px',
                                }}
                              >
                                {item.brand}
                              </span>
                            </div>
                          ) : (
                            <span />
                          )}
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: 12,
                              color: '#828282',
                              lineHeight: 'normal',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.quantity} of {item.quantity} pcs
                          </span>
                        </div>

                        {/* Part name + price (grayed) */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          <span style={{ color: '#323232' }}>
                            {item.partName}
                          </span>
                          <span
                            style={{
                              color: '#b1a7a6',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
              BOTTOM FIXED CTA BUTTONS
              ════════════════════════════════════════ */}
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              bottom: 80,
              // top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              maxWidth: 440,
              margin: '0 auto',
            }}
          >
            {/* Fade gradient */}
            <div
              style={{
                height: 30,
                background:
                  'linear-gradient(to bottom, rgba(245,245,245,0), rgba(255,255,255,1))',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                backgroundColor: '#fff',
                padding: '0 16px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 13,
                height: 65,
              }}
            >
              {isExpired ? (
                /* RE-REQUEST button */
                <button
                  onClick={() => console.log('Re-request quote:', quote.id)}
                  style={{
                    width: 385,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: '#e5383b',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01px',
                    }}
                  >
                    RE-REQUEST
                  </span>
                </button>
              ) : (
                <>
                  {/* APPROVE AND PAY button */}
                  <button
                    disabled={isAccepted}
                    onClick={() =>
                      console.log('Approve and pay:', quote.id)
                    }
                    style={{
                      width: 197,
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: isAccepted ? '#828282' : '#e5383b',
                      border: isAccepted
                        ? '1px solid #828282'
                        : '1px solid #e5383b',
                      cursor: isAccepted ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01px',
                      }}
                    >
                      {isAccepted ? 'ORDER PLACED' : 'APPROVE AND PAY'}
                    </span>
                  </button>

                  {/* DECLINE button */}
                  {!isAccepted && (
                    <button
                      onClick={() =>
                        console.log('Decline:', quote.id)
                      }
                      style={{
                        width: 197,
                        height: 56,
                        borderRadius: 8,
                        backgroundColor: 'transparent',
                        border: '1px solid #000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: 13,
                          color: '#e5383b',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01px',
                        }}
                      >
                        DECLINE
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop CTAs */}
          <div
            className="hidden md:flex"
            style={{
              padding: '0 32px 24px',
              gap: 13,
              justifyContent: 'center',
            }}
          >
            {isExpired ? (
              <button
                onClick={() => console.log('Re-request quote:', quote.id)}
                style={{
                  width: 385,
                  height: 56,
                  borderRadius: 8,
                  backgroundColor: '#e5383b',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01px',
                }}
              >
                RE-REQUEST
              </button>
            ) : (
              <>
                <button
                  disabled={isAccepted}
                  onClick={() => console.log('Approve and pay:', quote.id)}
                  style={{
                    width: 197,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: isAccepted ? '#828282' : '#e5383b',
                    border: isAccepted
                      ? '1px solid #828282'
                      : '1px solid #e5383b',
                    cursor: isAccepted ? 'not-allowed' : 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01px',
                  }}
                >
                  {isAccepted ? 'ORDER PLACED' : 'APPROVE AND PAY'}
                </button>
                {!isAccepted && (
                  <button
                    onClick={() => console.log('Decline:', quote.id)}
                    style={{
                      width: 197,
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: 'transparent',
                      border: '1px solid #000',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#e5383b',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01px',
                    }}
                  >
                    DECLINE
                  </button>
                )}
              </>
            )}
          </div>

          {/* Bottom nav */}
          <NavigationBar role="owner" />
        </div>
      </div>
    </div>
  );
}
