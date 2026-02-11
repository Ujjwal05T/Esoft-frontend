'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getInquiryById, type InquiryResponse, updateInquiryStatus } from '@/services/api';
import StatusBadge from '@/components/ui/StatusBadge';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import EditInquiryItemOverlay from '@/components/overlays/EditInquiryItemOverlay';

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params?.id as string;

  const [inquiry, setInquiry] = useState<InquiryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showEditOverlay, setShowEditOverlay] = useState(false);

  useEffect(() => {
    async function fetchInquiry() {
      try {
        setLoading(true);
        const result = await getInquiryById(parseInt(inquiryId));
        if (result.success && result.data) {
          setInquiry(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch inquiry:', error);
      } finally {
        setLoading(false);
      }
    }

    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId]);

  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setShowEditOverlay(true);
  };

  const selectedItem = inquiry?.items.find((item) => item.id === selectedItemId);

  // Status helpers
  const status = inquiry?.status?.toLowerCase() || '';
  const isOpen = status === 'open';
  const isRequested = status === 'requested';
  const isDeclined = status === 'declined';
  const isClosed = status === 'closed';

  // Date formatting
  const formatDate = (dateStr: string) => {
    return new Date(dateStr)
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .toLowerCase();
  };

  // Get the date label based on status
  const getDateLabel = () => {
    if (isDeclined && inquiry?.declinedDate) {
      return `Declined: ${formatDate(inquiry.declinedDate)}`;
    }
    if (isClosed && inquiry?.closedDate) {
      return `Closed: ${formatDate(inquiry.closedDate)}`;
    }
    return `Placed: ${formatDate(inquiry?.placedDate || '')}`;
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#f5f5f5] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5383b] mx-auto mb-4"></div>
          <p style={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>
            Loading inquiry details...
          </p>
        </div>
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────
  if (!inquiry) {
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
            Inquiry Not Found
          </h2>
          <p
            style={{
              color: '#666',
              fontFamily: "'Inter', sans-serif",
              marginBottom: 24,
            }}
          >
            The inquiry you&apos;re looking for doesn&apos;t exist.
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
                  Inquiry Details
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
              Inquiry Details
            </h1>
            <div style={{ width: 96 }} />
          </div>

          {/* ───── Page Body ───── */}
          <div
            style={{
              paddingTop: 0,
              paddingBottom: 160,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: '#f5f5f5',
            }}
            className="md:px-[24px] lg:px-[32px] md:pb-[24px]"
          >
            {/* ════════════════════════════════════════
                INQUIRY INFO CARD
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
                {/* Left: vehicle + inquiry info */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {inquiry.vehicleName && (
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
                        {inquiry.vehicleName}
                      </p>
                      {inquiry.numberPlate && (
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
                          {inquiry.numberPlate}
                        </p>
                      )}
                    </div>
                  )}
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
                      {inquiry.inquiryNumber}
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
                      {getDateLabel()}
                    </p>
                  </div>
                </div>

                {/* Right: status badge */}
                <div style={{ flexShrink: 0 }}>
                  <StatusBadge
                    status={inquiry.status.toLowerCase() as any}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#dadada' }} />

              {/* Inquiry by + Job Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#000' }}>Inquiry by: </span>
                  <span style={{ color: '#e5383b' }}>
                    {inquiry.requestedByName || 'Owner'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#000' }}>Job Category: </span>
                  <span style={{ color: '#e5383b' }}>
                    {inquiry.jobCategory}
                  </span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════
                INQUIRY ITEMS LIST
                ════════════════════════════════════════ */}
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              {inquiry.items.map((item) => {
                // Determine brand badge style
                const isOEM =
                  item.preferredBrand?.toUpperCase() === 'OEM - ORIGINAL BRANDS';
                const brandLabel = isOEM ? 'OEM' : 'AM';
                const brandBgColor = isOEM ? '#e4e4e4' : '#f3f3f3';
                const brandTextColor = isOEM ? '#000' : '#e5383b';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
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
                    {/* Item content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        {/* Part name with quantity */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#323232',
                              margin: 0,
                              lineHeight: 'normal',
                            }}
                          >
                            {item.partName}
                            {item.quantity > 1
                              ? ` x ${item.quantity}`
                              : ''}
                          </p>
                        </div>

                        {/* Remark + Brand badge */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#969696',
                              margin: 0,
                              lineHeight: 'normal',
                              flex: 1,
                              minWidth: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.remark || item.preferredBrand || '-'}
                          </p>
                          <div
                            style={{
                              backgroundColor: brandBgColor,
                              borderRadius: 7,
                              padding: '4px 26px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 23,
                              flexShrink: 0,
                              marginLeft: 10,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                color: brandTextColor,
                                lineHeight: '15px',
                                letterSpacing: '-0.41px',
                                textAlign: 'center',
                              }}
                            >
                              {brandLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════════════════════════════════════════
              BOTTOM FIXED CTA BUTTONS (Mobile)
              ════════════════════════════════════════ */}
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              bottom: 80,
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
                gap: 11,
                height: 65,
              }}
            >
              {/* ── Open status: RE REQUEST + CANCEL REQUEST ── */}
              {isOpen && (
                <>
                  <button
                    onClick={() =>
                      console.log('Re-request inquiry:', inquiry.id)
                    }
                    style={{
                      width: 197,
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: '#e5383b',
                      border: '1px solid #e5383b',
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
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01px',
                        lineHeight: '18px',
                      }}
                    >
                      RE REQUEST
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      console.log('Cancel request:', inquiry.id)
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
                        lineHeight: '18px',
                      }}
                    >
                      CANCEL REQUEST
                    </span>
                  </button>
                </>
              )}

              {/* ── Requested status: APPROVE AND SEND + DECLINE ── */}
              {isRequested && (
                <>
                  <button
                    onClick={() =>
                      console.log('Approve and send:', inquiry.id)
                    }
                    style={{
                      width: 197,
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: '#e5383b',
                      border: '1px solid #e5383b',
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
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01px',
                        lineHeight: '18px',
                      }}
                    >
                      APPROVE AND SEND
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      console.log('Decline:', inquiry.id)
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
                        lineHeight: '18px',
                      }}
                    >
                      DECLINE
                    </span>
                  </button>
                </>
              )}

              {/* ── Declined status: RE REQUEST (full-width) ── */}
              {isDeclined && (
                <button
                  onClick={() =>
                    console.log('Re-request inquiry:', inquiry.id)
                  }
                  style={{
                    width: '100%',
                    maxWidth: 408,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: '#e5383b',
                    border: '1px solid #e5383b',
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
                    RE REQUEST
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ── Desktop CTAs ── */}
          <div
            className="hidden md:flex"
            style={{
              padding: '0 32px 24px',
              gap: 11,
              justifyContent: 'center',
            }}
          >
            {isOpen && (
              <>
                <button
                  onClick={() =>
                    console.log('Re-request inquiry:', inquiry.id)
                  }
                  style={{
                    width: 197,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: '#e5383b',
                    border: '1px solid #e5383b',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01px',
                  }}
                >
                  RE REQUEST
                </button>
                <button
                  onClick={() =>
                    console.log('Cancel request:', inquiry.id)
                  }
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
                  CANCEL REQUEST
                </button>
              </>
            )}
            {isRequested && (
              <>
                <button
                  onClick={() =>
                    console.log('Approve and send:', inquiry.id)
                  }
                  style={{
                    width: 197,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: '#e5383b',
                    border: '1px solid #e5383b',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01px',
                  }}
                >
                  APPROVE AND SEND
                </button>
                <button
                  onClick={() =>
                    console.log('Decline:', inquiry.id)
                  }
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
              </>
            )}
            {isDeclined && (
              <button
                onClick={() =>
                  console.log('Re-request inquiry:', inquiry.id)
                }
                style={{
                  width: '100%',
                  maxWidth: 408,
                  height: 56,
                  borderRadius: 8,
                  backgroundColor: '#e5383b',
                  border: '1px solid #e5383b',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01px',
                }}
              >
                RE REQUEST
              </button>
            )}
          </div>

          {/* ───── Navigation Bar ───── */}
          <NavigationBar role="owner" />
        </div>
      </div>

      {/* Edit Inquiry Item Overlay */}
      {selectedItem && (
        <EditInquiryItemOverlay
          isOpen={showEditOverlay}
          onClose={() => {
            setShowEditOverlay(false);
            setSelectedItemId(null);
          }}
          item={selectedItem}
          onSave={(updatedItem: Partial<InquiryResponse>) => {
            console.log('Updated item:', updatedItem);
            // TODO: Update the item via API
            setShowEditOverlay(false);
            setSelectedItemId(null);
          }}
        />
      )}
    </div>
  );
}
