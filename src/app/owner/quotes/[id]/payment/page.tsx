'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  getQuoteById,
  createPaymentOrder,
  verifyPayment,
  type QuoteApiResponse,
} from '@/services/api';

// Razorpay type declarations
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  config?: {
    display?: {
      blocks?: Record<string, { instruments: Array<{ method: string }> }>;
      sequence?: string[];
      preferences?: { show_default_blocks?: boolean };
    };
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<QuoteApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

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

  // Format price
  const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;

  // Compute additional charges
  const additionalCharges = quote
    ? (quote.packingCharges || 0) +
      (quote.forwardingCharges || 0) +
      (quote.shippingCharges || 0)
    : 0;

  // Compute parts subtotal
  const partsSubtotal = quote
    ? quote.totalAmount - additionalCharges
    : 0;

  // Get expires label
  const getExpiresLabel = () => {
    if (!quote?.expiresAt) return null;
    const expiresAt = new Date(quote.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHours <= 24) return `${diffHours} hours`;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).toLowerCase();
  };

  // Razorpay payment handler
  const handlePay = useCallback(
    async (method?: string) => {
      if (!quote || paymentLoading) return;

      try {
        setPaymentLoading(true);

        // 1. Create Razorpay order
        const orderResult = await createPaymentOrder(quote.id);
        if (!orderResult.success || !orderResult.data) {
          alert('Failed to create payment order. Please try again.');
          setPaymentLoading(false);
          return;
        }

        const { orderId, amount, currency, keyId } = orderResult.data;

        // 2. Open Razorpay checkout
        if (typeof window.Razorpay === 'undefined') {
          alert('Payment gateway is loading. Please try again in a moment.');
          setPaymentLoading(false);
          return;
        }

        const options: RazorpayOptions = {
          key: keyId,
          amount,
          currency,
          name: 'ETNA Parts',
          description: `Payment for ${quote.quoteNumber}`,
          order_id: orderId,
          handler: async (response: RazorpayResponse) => {
            try {
              const verifyResult = await verifyPayment({
                quoteId: quote.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyResult.success) {
                alert('Payment successful! Your order has been placed.');
                router.push(`/owner/quotes/${quote.id}`);
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch {
              alert('Error verifying payment. Please contact support.');
            } finally {
              setPaymentLoading(false);
            }
          },
          prefill: {
            name: quote.workshopName || '',
          },
          theme: {
            color: '#e5383b',
          },
          modal: {
            ondismiss: () => {
              setPaymentLoading(false);
            },
          },
        };

        // If a specific method is selected, configure Razorpay to show only that method
        if (method === 'card') {
          options.config = {
            display: {
              blocks: {
                card: { instruments: [{ method: 'card' }] },
              },
              sequence: ['block.card'],
              preferences: { show_default_blocks: false },
            },
          };
        } else if (method === 'netbanking') {
          options.config = {
            display: {
              blocks: {
                netbanking: { instruments: [{ method: 'netbanking' }] },
              },
              sequence: ['block.netbanking'],
              preferences: { show_default_blocks: false },
            },
          };
        } else if (method === 'upi') {
          options.config = {
            display: {
              blocks: {
                upi: { instruments: [{ method: 'upi' }] },
              },
              sequence: ['block.upi'],
              preferences: { show_default_blocks: false },
            },
          };
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch {
        alert('Something went wrong. Please try again.');
        setPaymentLoading(false);
      }
    },
    [quote, paymentLoading, router]
  );

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #eee', borderTopColor: '#e5383b', margin: '0 auto 16px' }} />
          <p style={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>Quote not found</p>
      </div>
    );
  }

  const expiresLabel = getExpiresLabel();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div style={{ backgroundColor: '#f5f5f5', position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
        <Sidebar />

        <div className="md:pl-[240px] lg:pl-[280px]">
          <div style={{ maxWidth: 440, margin: '0 auto' }} className="md:max-w-none md:mx-0">

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
                marginBottom:13
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => router.back()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    <Image src="/assets/icons/arrow-back.svg" alt="Back" width={23} height={18} />
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
                    Payment
                  </h1>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} />
                </button>
              </div>
            </div>

            {/* ───── Desktop Header ───── */}
            <div
              className="hidden md:flex"
              style={{ alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 8px' }}
            >
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                  color: '#e5383b', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16,
                }}
              >
                <Image src="/assets/icons/arrow-back.svg" alt="Back" width={24} height={24} />
                Back
              </button>
              <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 22, color: '#e5383b', margin: 0 }}>
                Payment
              </h1>
              <div style={{ width: 96 }} />
            </div>

            {/* ───── Page Body ───── */}
            <div
              style={{ paddingBottom: 120, paddingLeft: 16, paddingRight: 16, backgroundColor: '#f5f5f5' }}
              className="md:px-[24px] lg:px-[32px] md:pb-[24px]"
            >
              {/* ════════════════════════════════════════
                  QUOTE SUMMARY CARD
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
                {/* Top row: vehicle info + status / expires */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Vehicle */}
                    {quote.vehicleName && (
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: '#4c4c4c', margin: 0, lineHeight: 'normal' }}>
                          {quote.vehicleName}
                        </p>
                        {quote.plateNumber && (
                          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 17, color: '#e5383b', margin: 0, lineHeight: 'normal' }}>
                            {quote.plateNumber}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Quote number + date */}
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#e8353b', margin: 0, lineHeight: 'normal' }}>
                        {quote.quoteNumber}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 12, color: '#828282', margin: 0, lineHeight: 'normal' }}>
                        Submitted: {formatDate(quote.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: status + expires */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                    <StatusBadge status={
                      quote.status === 'approved' ? 'approved' :
                      quote.status === 'rejected' ? 'declined' :
                      'pending_review'
                    } />
                    {expiresLabel && expiresLabel !== 'Expired' && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 12, color: '#000', margin: 0, textAlign: 'center', letterSpacing: '-0.41px' }}>
                        Expires in{' '}
                        <span style={{ fontWeight: 700, color: '#e5383b' }}>{expiresLabel}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: '#dadada' }} />

                {/* Delivery + Parts Subtotal row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11, color: '#000', margin: 0, lineHeight: 'normal' }}>
                      Delivery by:
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#e5383b', margin: 0, lineHeight: 'normal' }}>
                      {quote.expiresAt ? formatDate(quote.expiresAt) : '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11, color: '#000', margin: 0, lineHeight: 'normal' }}>
                      Parts Subtotal
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#e5383b', margin: 0, lineHeight: 'normal' }}>
                      {formatPrice(partsSubtotal)}
                    </p>
                  </div>
                </div>

                {/* Additional Charges + Grand Total row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11, color: '#000', margin: 0, lineHeight: 'normal' }}>
                      Additional Charges (Shipping and Labor)
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#e5383b', margin: 0, lineHeight: 'normal' }}>
                      {formatPrice(additionalCharges)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 75 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11, color: '#000', margin: 0, lineHeight: 'normal' }}>
                      Grand Total
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#e5383b', margin: 0, lineHeight: 'normal' }}>
                      {formatPrice(quote.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════
                  SELECT PAYMENT METHOD
                  ════════════════════════════════════════ */}
              <div
                style={{
                  marginTop: 16,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#000',
                    margin: 0,
                    letterSpacing: '-0.01px',
                    lineHeight: '18px',
                  }}
                >
                  Select Payment Method
                </h2>

                {/* Payment Method Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* ── Credit / Debit Card ── */}
                  <button
                    onClick={() => {
                      setSelectedMethod('card');
                      handlePay('card');
                    }}
                    disabled={paymentLoading}
                    style={{
                      backgroundColor: selectedMethod === 'card' ? '#ffe8e8' : '#f3f3f3',
                      borderRadius: 16,
                      padding: '17px 20px',
                      height: 92,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      border: selectedMethod === 'card' ? '2px solid #e5383b' : '2px solid transparent',
                      cursor: paymentLoading ? 'not-allowed' : 'pointer',
                      opacity: paymentLoading ? 0.6 : 1,
                      width: '100%',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Credit card icon */}
                    <div
                      style={{
                        width: 43,
                        height: 43,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image src={'/assets/icons/Credit-Card.png'} width={36} height={34} alt={'Credit Card'}/>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#737373',
                        letterSpacing: '-0.01px',
                        lineHeight: '18px',
                        textAlign: 'center',
                      }}
                    >
                      CREDIT/DEBIT CARD
                    </span>
                  </button>

                  {/* ── Net Banking ── */}
                  <button
                    onClick={() => {
                      setSelectedMethod('netbanking');
                      handlePay('netbanking');
                    }}
                    disabled={paymentLoading}
                    style={{
                      backgroundColor: selectedMethod === 'netbanking' ? '#ffe8e8' : '#f3f3f3',
                      borderRadius: 16,
                      padding: '17px 20px',
                      height: 92,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      border: selectedMethod === 'netbanking' ? '2px solid #e5383b' : '2px solid transparent',
                      cursor: paymentLoading ? 'not-allowed' : 'pointer',
                      opacity: paymentLoading ? 0.6 : 1,
                      width: '100%',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Bank icon */}
                    <div
                      style={{
                        width: 45,
                        height: 45,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                       <Image src={'/assets/icons/Bank.svg'} width={36} height={34} alt={'Net Banking'}/>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#737373',
                        letterSpacing: '-0.01px',
                        lineHeight: '18px',
                        textAlign: 'center',
                      }}
                    >
                      NET BANKING
                    </span>
                  </button>

                  {/* ── UPI ── */}
                  <button
                    onClick={() => {
                      setSelectedMethod('upi');
                      handlePay('upi');
                    }}
                    disabled={paymentLoading}
                    style={{
                      backgroundColor: selectedMethod === 'upi' ? '#ffe8e8' : '#f3f3f3',
                      borderRadius: 16,
                      padding: '17px 20px',
                      height: 92,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: selectedMethod === 'upi' ? '2px solid #e5383b' : '2px solid transparent',
                      cursor: paymentLoading ? 'not-allowed' : 'pointer',
                      opacity: paymentLoading ? 0.6 : 1,
                      width: '100%',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* UPI logo text */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       <Image src={'/assets/icons/upi.svg'} width={66} height={34} alt={'Credit Card'}/>
                    </div>

                    {/* Payment app logos */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* PhonePe */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 18,
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: -7,
                          position: 'relative',
                          zIndex: 3,
                          border: '2px solid #f3f3f3',
                        }}
                      >
                         <Image src={'/assets/icons/phonepe.svg'} width={36} height={34} alt={'Credit Card'}/>
                      </div>
                      {/* Google Pay */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 24,
                          backgroundColor: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: -7,
                          position: 'relative',
                          zIndex: 2,
                          border: '2px solid #f3f3f3',
                        }}
                      >
                         <Image src={'/assets/icons/gpay.svg'} width={36} height={34} alt={'Credit Card'}/>
                      </div>
                      {/* Paytm */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 16,
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 1,
                          border: '2px solid #f3f3f3',
                        }}
                      >
                         <Image src={'/assets/icons/paytm.svg'} width={36} height={34} alt={'Credit Card'}/>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Processing indicator */}
              {paymentLoading && (
                <div
                  style={{
                    marginTop: 16,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    className="animate-spin"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid #eee',
                      borderTopColor: '#e5383b',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#666',
                      margin: 0,
                    }}
                  >
                    Opening payment gateway...
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Bar */}
            <NavigationBar role="owner" />
          </div>
        </div>
      </div>
    </>
  );
}
