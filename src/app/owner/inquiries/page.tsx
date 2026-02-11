'use client';

import React, { useState, useEffect } from 'react';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import InquiryCard, { Inquiry } from '@/components/dashboard/InquiryCard';
import DisputeCard, { Dispute } from '@/components/dashboard/DisputeCard';
import QuoteCard, { Quote } from '@/components/dashboard/QuoteCard';
import FiltersOverlay from '@/components/overlays/FiltersOverlay';
import { useRouter } from 'next/navigation';
import { getQuotesByWorkshopOwnerId, getInquiriesByWorkshopOwnerId, getStoredUser, type QuoteApiResponse, type InquiryResponse } from '@/services/api';

// Mock Data for Inquiries
const mockInquiries: Inquiry[] = [
  {
    id: 'INQ-2024-001',
    vehicleName: 'Toyota Corolla',
    numberPlate: 'CAB-1234',
    placedDate: '2024-01-15',
    status: 'open',
    inquiryBy: 'John Smith',
    jobCategory: 'Engine Repair',
    items: [
      {
        id: 'item-1',
        itemName: 'Engine Oil Filter',
        preferredBrand: 'Toyota Genuine',
        notes: 'Original part preferred',
        quantity: 2,
      },
      {
        id: 'item-2',
        itemName: 'Spark Plugs',
        preferredBrand: 'NGK',
        quantity: 4,
      },
      {
        id: 'item-3',
        itemName: 'Air Filter',
        preferredBrand: 'Denso',
        quantity: 1,
      },
    ],
    media: [],
  },
  {
    id: 'INQ-2024-002',
    vehicleName: 'Honda Civic',
    numberPlate: 'WP-5678',
    placedDate: '2024-01-14',
    status: 'requested',
    inquiryBy: 'Sarah Johnson',
    jobCategory: 'Brake Service',
    items: [
      {
        id: 'item-4',
        itemName: 'Brake Pads - Front',
        preferredBrand: 'Brembo',
        quantity: 1,
      },
      {
        id: 'item-5',
        itemName: 'Brake Disc - Front',
        preferredBrand: 'Brembo',
        quantity: 2,
      },
    ],
    media: [],
  },
  {
    id: 'INQ-2024-003',
    vehicleName: 'Nissan Sunny',
    numberPlate: 'NC-9012',
    placedDate: '2024-01-12',
    closedDate: '2024-01-14',
    status: 'closed',
    inquiryBy: 'Mike Brown',
    jobCategory: 'AC Repair',
    items: [
      {
        id: 'item-6',
        itemName: 'AC Compressor',
        preferredBrand: 'Denso',
        quantity: 1,
      },
    ],
    media: [],
  },
  {
    id: 'INQ-2024-004',
    vehicleName: 'Suzuki Swift',
    numberPlate: 'SP-3456',
    placedDate: '2024-01-10',
    declinedDate: '2024-01-11',
    status: 'declined',
    inquiryBy: 'Emily Davis',
    jobCategory: 'Transmission',
    items: [
      {
        id: 'item-7',
        itemName: 'Clutch Plate',
        preferredBrand: 'Exedy',
        quantity: 1,
      },
      {
        id: 'item-8',
        itemName: 'Pressure Plate',
        preferredBrand: 'Exedy',
        quantity: 1,
      },
    ],
    media: [],
  },
  {
    id: 'INQ-2024-005',
    vehicleName: 'Mazda 3',
    numberPlate: 'KL-7890',
    placedDate: '2024-01-09',
    status: 'approved',
    inquiryBy: 'David Wilson',
    jobCategory: 'Suspension',
    items: [
      {
        id: 'item-9',
        itemName: 'Front Shock Absorber',
        preferredBrand: 'KYB',
        quantity: 2,
      },
      {
        id: 'item-10',
        itemName: 'Coil Spring',
        preferredBrand: 'Eibach',
        quantity: 2,
      },
      {
        id: 'item-11',
        itemName: 'Stabilizer Link',
        quantity: 2,
      },
      {
        id: 'item-12',
        itemName: 'Control Arm Bushing',
        quantity: 4,
      },
    ],
    media: [],
  },
];

// Mock Data for Disputes
const mockDisputes: Dispute[] = [
  {
    id: 'DSP-2024-001',
    vehicleName: 'Toyota Corolla',
    plateNumber: 'CAB-1234',
    receivedDate: '2024-01-16',
    status: 'open',
    disputeRaised: 'Wrong part delivered, received aftermarket instead of genuine',
    showVehicleInfo: true,
    action: 'accept',
  },
  {
    id: 'DSP-2024-002',
    vehicleName: 'Honda Civic',
    plateNumber: 'WP-5678',
    openedDate: '2024-01-14',
    status: 'open',
    disputeRaised: 'Part does not fit vehicle specifications',
    resolutionStatus: 'Under Review',
    showVehicleInfo: true,
    action: 'chat',
    newMessages: 3,
    media: [
      { id: 'media-1', type: 'image', url: '/images/part1.jpg' },
      { id: 'media-2', type: 'image', url: '/images/part2.jpg' },
      { id: 'media-3', type: 'audio', url: '/audio/voice.mp3', duration: 45 },
    ],
  },
  {
    id: 'DSP-2024-003',
    vehicleName: 'Nissan Sunny',
    plateNumber: 'NC-9012',
    receivedDate: '2024-01-10',
    closedDate: '2024-01-15',
    status: 'closed',
    disputeRaised: 'Damaged brake pads on delivery',
    resolutionStatus: 'Refund Processed',
    showVehicleInfo: true,
    action: 'chat',
  },
  {
    id: 'DSP-2024-004',
    vehicleName: 'Suzuki Swift',
    plateNumber: 'SP-3456',
    receivedDate: '2024-01-08',
    status: 'declined',
    disputeRaised: 'Price difference dispute - charged more than quoted',
    showVehicleInfo: true,
    action: 'edit',
  },
  {
    id: 'DSP-2024-005',
    vehicleName: 'Mazda 3',
    plateNumber: 'KL-7890',
    receivedDate: '2024-01-17',
    status: 'open',
    disputeRaised: 'Late delivery - exceeded promised timeline by 5 days',
    showVehicleInfo: true,
    action: 'accept',
    newNotifications: 2,
  },
];

export default function InquiriesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'disputes'| 'quotes'>('inquiries');
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteApiResponse[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryResponse[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [showFiltersOverlay, setShowFiltersOverlay] = useState(false);

  const handleToggleInquiry = (id: string) => {
    setExpandedInquiryId(expandedInquiryId === id ? null : id);
  };

  const handleToggleQuote = (id: string) => {
    setExpandedQuoteId(expandedQuoteId === id ? null : id);
  };

  const handleEditInquiry = (id: string) => {
    console.log('Edit inquiry:', id);
  };

  const handleViewInquiry = (id: string) => {
    // Find the inquiry to get its numeric ID
    const inquiry = inquiries.find(inq => inq.inquiryNumber === id);
    if (inquiry) {
      router.push(`/owner/inquiries/${inquiry.id}`);
    }
  };

  const handleApproveInquiry = (id: string) => {
    console.log('Approve inquiry:', id);
  };

  const handleReRequestInquiry = (id: string) => {
    console.log('Re-request inquiry:', id);
  };

  const handleEditDispute = (id: string) => {
    console.log('Edit dispute:', id);
  };

  const handleAcceptDispute = (id: string) => {
    console.log('Accept dispute:', id);
  };

  const handleViewDispute = (id: string) => {
    console.log('View dispute:', id);
  };

  const handleChatDispute = (id: string) => {
    console.log('Chat dispute:', id);
  };

  // Fetch inquiries from API
  useEffect(() => {
    async function fetchInquiries() {
      try {
        setLoadingInquiries(true);
        const user = getStoredUser();
        if (!user) return;
        const result = await getInquiriesByWorkshopOwnerId(user.id);
        if (result.success && result.data) {
          setInquiries(result.data.inquiries);
        }
      } catch (error) {
        console.error('Failed to fetch inquiries:', error);
      } finally {
        setLoadingInquiries(false);
      }
    }
    fetchInquiries();
  }, []);

  // Fetch quotes from API
  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoadingQuotes(true);
        const user = getStoredUser();
        if (!user) return;
        const result = await getQuotesByWorkshopOwnerId(user.id);
        if (result.success && result.data) {
          setQuotes(result.data.quotes);
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
      } finally {
        setLoadingQuotes(false);
      }
    }
    fetchQuotes();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px] flex-1">
        {/* Inner container for mobile centering */}
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0 flex-1 flex flex-col">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-6 mb-[80px] md:mb-0">
            
            {/* Page Header */}
            <div className="mb-[24px]">
              <h1 
                className="text-[24px] font-bold text-[#1a1a1a]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {activeTab === 'inquiries' ? 'Inquiries' : activeTab === 'quotes' ? 'Quotes' : 'Disputes'}
              </h1>
              <p 
                className="text-[14px] text-[#828282] mt-[4px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {activeTab === 'inquiries' 
                  ? 'Manage and review all your inquiries'
                  : activeTab === 'quotes'
                  ? 'Review and accept quotes from vendors'
                  : 'Handle and resolve your disputes'}
              </p>
            </div>

            {/* Toggle Switch and Filter */}
            <div className="flex items-center justify-between mb-[24px]">
              {/* Toggle Switch */}
              <div className="bg-[#e5e5e5] rounded-[12px] flex items-center">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                    activeTab === 'inquiries'
                      ? 'bg-[#e5383b] text-white shadow-sm'
                      : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                  }`}
                >
                  Inquiries
                </button>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                    activeTab === 'quotes'
                      ? 'bg-[#e5383b] text-white shadow-sm'
                      : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                  }`}
                >
                  Quotes
                </button>
                <button
                  onClick={() => setActiveTab('disputes')}
                  className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                    activeTab === 'disputes'
                      ? 'bg-[#e5383b] text-white shadow-sm'
                      : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                  }`}
                >
                  Disputes
                </button>
              </div>

              {/* Filter Button */}
              <button 
                onClick={() => setShowFiltersOverlay(true)}
                className="flex items-center gap-[6px] px-[16px] py-[8px] border border-[#e5383b] rounded-[8px] text-[#e5383b] text-[14px] font-medium hover:bg-[#fff5f5] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 11L4 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11L12 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 5L4 3L2 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11L12 13L10 11" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Filter
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'inquiries' && (
              /* Inquiries List */
              <div className="flex flex-col gap-[16px]">
                {loadingInquiries ? (
                  <div className="bg-[#f5f5f5] rounded-[12px] p-[16px]">
                    <p className="text-[14px] text-[#99a2b6] text-center">Loading inquiries...</p>
                  </div>
                ) : inquiries.length > 0 ? (
                  inquiries.map((apiInquiry) => {
                    // Map API response to Inquiry type expected by InquiryCard
                    const inquiry: Inquiry = {
                      id: apiInquiry.inquiryNumber, // Use inquiryNumber as the display ID
                      vehicleName: apiInquiry.vehicleName || '',
                      numberPlate: apiInquiry.numberPlate || '',
                      placedDate: new Date(apiInquiry.placedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase(),
                      closedDate: apiInquiry.closedDate ? new Date(apiInquiry.closedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase() : undefined,
                      declinedDate: apiInquiry.declinedDate ? new Date(apiInquiry.declinedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase() : undefined,
                      status: apiInquiry.status.toLowerCase() as Inquiry['status'],
                      inquiryBy: apiInquiry.requestedByName || 'Owner',
                      jobCategory: apiInquiry.jobCategory,
                      items: apiInquiry.items.map(item => ({
                        id: item.id.toString(),
                        itemName: item.partName,
                        preferredBrand: item.preferredBrand,
                        notes: item.remark,
                        quantity: item.quantity,
                        imageUrl: item.image1Url || undefined,
                      })),
                      media: [],
                    };
                    return (
                      <InquiryCard
                        key={inquiry.id}
                        inquiry={inquiry}
                        isExpanded={expandedInquiryId === inquiry.id}
                        onToggle={() => handleToggleInquiry(inquiry.id)}
                        onEdit={handleEditInquiry}
                        onView={handleViewInquiry}
                        onApprove={handleApproveInquiry}
                        onReRequest={handleReRequestInquiry}
                        showNumberPlate={true}
                        action="approve"
                      />
                    );
                  })
                ) : (
                  <div className="bg-[#f5f5f5] rounded-[12px] p-[32px] text-center">
                    <p className="text-[16px] font-medium text-[#2b2b2b] mb-[8px]">No Inquiries Found</p>
                    <p className="text-[14px] text-[#99a2b6]">Your inquiries will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quotes' && (
              /* Quotes List */
              <div className="flex flex-col gap-[16px]">
                {loadingQuotes ? (
                  <div className="bg-white rounded-[12px] p-[16px]">
                    <p className="text-[14px] text-[#99a2b6] text-center">Loading quotes...</p>
                  </div>
                ) : quotes.length > 0 ? (
                  quotes.map((apiQuote) => {
                    const quote: Quote = {
                      id: apiQuote.id.toString(),
                      vehicleName: apiQuote.vehicleName || '',
                      plateNumber: apiQuote.plateNumber || '',
                      quoteId: apiQuote.quoteNumber,
                      submittedDate: new Date(apiQuote.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase(),
                      status: (apiQuote.status === 'approved' ? 'accepted' : 'pending_review') as Quote['status'],
                      estimatedTotal: apiQuote.totalAmount,
                      items: apiQuote.items.map(item => ({
                        id: item.id.toString(),
                        itemName: item.partName,
                        brand: item.brand || undefined,
                        mrp: item.mrp || undefined,
                        price: item.unitPrice,
                        quantity: item.quantity,
                        isAvailable: item.availability === 'in_stock',
                      })),
                    };
                    return (
                      <QuoteCard
                        key={quote.id}
                        quote={quote}
                        isExpanded={expandedQuoteId === quote.id}
                        onToggle={() => handleToggleQuote(quote.id)}
                        showNumberPlate={true}
                        onAccept={(id) => console.log('Accept quote:', id)}
                        onView={(id) => router.push(`/owner/quotes/${id}`)}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white rounded-[12px] p-[16px]">
                    <p className="text-[14px] text-[#99a2b6] text-center">No quotes found</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'disputes' && (
              /* Disputes List */
              <div className="flex flex-col gap-[16px]">
                {/* No disputes found message */}
                <div className="bg-[#f5f5f5] rounded-[12px] p-[32px] text-center">
                  <p className="text-[16px] font-medium text-[#2b2b2b] mb-[8px]">No Disputes Found</p>
                  <p className="text-[14px] text-[#99a2b6]">Your disputes will appear here</p>
                </div>
                {/* Keeping disputes for future use - uncomment below when ready
                {mockDisputes.map((dispute) => (
                  <DisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    onEdit={handleEditDispute}
                    onAccept={handleAcceptDispute}
                    onView={handleViewDispute}
                    onChat={handleChatDispute}
                  />
                ))}
                */}
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <NavigationBar role='owner' />
        </div>
      </div>

      {/* Filters Overlay */}
      <FiltersOverlay
        isOpen={showFiltersOverlay}
        onClose={() => setShowFiltersOverlay(false)}
        onApply={(filters) => {
          console.log('Filters applied:', filters);
          // TODO: Apply filters to inquiries/quotes/disputes
        }}
      />
    </div>
  );
}