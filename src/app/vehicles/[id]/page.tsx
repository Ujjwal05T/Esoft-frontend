'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NavigationBar from '@/components/dashboard/NavigationBar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import InquiryCard, { type Inquiry } from '@/components/dashboard/InquiryCard';
import DisputeCard, { type Dispute } from '@/components/dashboard/DisputeCard';

// Mock vehicle data - same as in vehicles page
const vehicleData: { [key: string]: any } = {
  '1': {
    id: '1',
    plateNumber: 'MP O9 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['General Service', 'Headlight Change'],
    additionalServices: 2,
    status: 'Active',
    basicInfo: {
      makeYear: 'Mar 2025',
      regYear: 'Mar 2025',
      chassisNo: 'JNKCV54E06M721114',
      fuel: 'Petrol (BSVI)',
      transmission: 'Manual',
      variant: 'ZX',
      ownerName: 'Mr. Dev Patel',
      contactNumber: '+91-78692 82962',
      odometerReading: '40,000Km',
    },
    observations: 'Audible squealing when braked applied',
    jobs: [
      {
        id: 'job-1',
        title: 'Brake System',
        assignedTo: 'Rizwan',
        date: '11 Dec 2025',
        issue: 'Issue with brake pad',
        images: 2,
        videos: 1,
        additionalMedia: 2,
      },
    ],
    inquiries: [
      {
        id: 'ET/INQ/24-25/01255',
        placedDate: '5 dec 2025',
        status: 'approved' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Brake Parts',
        items: [
          {
            id: 'item-1',
            itemName: 'Brake Pad Set (Front)',
            preferredBrand: 'OEM',
            notes: 'chdiujdiwkspwodl[wfkiodfk',
            quantity: 1,
          },
          {
            id: 'item-2',
            itemName: 'Brake Pad Set (Rear)',
            preferredBrand: 'After Market',
            notes: 'chdiujdiwkspwodl[wfkiodfk',
            quantity: 1,
          },
        ],
        media: [
          { id: 'm1', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'm2', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'm3', type: 'audio' as const, url: '/audio.mp3', duration: 5 },
        ],
      },
      {
        id: 'ET/INQ/24-25/01256',
        placedDate: '5 dec 2025',
        status: 'declined' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Brake Parts',
        items: [
          {
            id: 'item-3',
            itemName: 'Brake Thaal',
            preferredBrand: 'After Market',
            notes: 'TVS',
            quantity: 2,
          },
        ],
        media: [
          { id: 'm4', type: 'image' as const, url: '/placeholder.jpg' },
        ],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01255',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        action: 'edit' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01256',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'declined' as const,
        disputeRaised: 'Broken Oil Filter',
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01257',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01258',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        openedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        resolutionStatus: 'Refund initiated',
        action: 'chat' as const,
        newNotifications: 3,
        newMessages: 2,
        showVehicleInfo: true,
        media: [
          { id: 'med-1', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-2', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-3', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-4', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-5', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-6', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-7', type: 'audio' as const, url: '/audio.mp3', duration: 5 },
        ],
      },
      {
        id: 'ET/DISP/24-25/01259',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        closedDate: '5 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Broken Oil Filter',
        resolutionStatus: 'Oil filter replaced',
        showVehicleInfo: true,
      },
    ],
  },
  '2': {
    id: '2',
    plateNumber: 'MH 12 AB 5678',
    year: 2020,
    make: 'Tata',
    model: 'Nexon',
    specs: '1.5L XZ+ AT/Petrol',
    services: ['Brake System', 'Engine Service'],
    additionalServices: 1,
    status: 'Active',
    basicInfo: {
      makeYear: 'Jan 2020',
      regYear: 'Feb 2020',
      chassisNo: 'MA1TA2MK0J6B12345',
      fuel: 'Petrol (BSVI)',
      transmission: 'Automatic',
      variant: 'XZ+',
      ownerName: 'Mr. Rajesh Kumar',
      contactNumber: '+91-98765 43210',
      odometerReading: '25,000Km',
    },
    observations: 'Engine making unusual noise during startup',
    jobs: [
      {
        id: 'job-2',
        title: 'Engine Service',
        assignedTo: 'Amit',
        date: '15 Dec 2025',
        issue: 'Oil change and filter replacement needed',
        images: 3,
        videos: 0,
        additionalMedia: 1,
      },
    ],
    inquiries: [
      {
        id: 'ET/INQ/24-25/01300',
        placedDate: '10 dec 2025',
        status: 'requested' as const,
        inquiryBy: 'Rajesh',
        jobCategory: 'Engine Service',
        items: [
          {
            id: 'item-5',
            itemName: 'Oil Filter',
            preferredBrand: 'Mann Filter',
            notes: 'High efficiency filter required',
            quantity: 1,
          },
          {
            id: 'item-6',
            itemName: 'Engine Oil',
            preferredBrand: 'Castrol',
            notes: '5W-30 grade synthetic',
            quantity: 4,
          },
        ],
        media: [
          { id: 'm5', type: 'image' as const, url: '/placeholder.jpg' },
        ],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01350',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        receivedDate: '12 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Engine Service Overcharge',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01351',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        closedDate: '10 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Air Filter Quality Issue',
        resolutionStatus: 'Replacement provided',
        showVehicleInfo: true,
      },
    ],
  },
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const vehicle = vehicleData[vehicleId];

  const [activeTab, setActiveTab] = useState<'jobcard' | 'inquiry' | 'disputes'>('jobcard');
  const [expandedSections, setExpandedSections] = useState<{
    basicInfo: boolean;
    observations: boolean;
    jobs: boolean;
  }>({
    basicInfo: false,
    observations: false,
    jobs: true, // Jobs expanded by default
  });
  const [expandedInquiries, setExpandedInquiries] = useState<{
    [key: string]: boolean;
  }>({});

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  const toggleSection = (section: 'basicInfo' | 'observations' | 'jobs') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleInquiry = (inquiryId: string) => {
    setExpandedInquiries((prev) => ({
      ...prev,
      [inquiryId]: !prev[inquiryId],
    }));
  };

  return (
    <>
      {/* Mobile-only message for larger screens */}
      <div className="hidden md:flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f24822] to-[#2294f2]">
        <div className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-[#f24822]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Mobile Only</h1>
          <p className="text-lg text-gray-600">This site can only be viewed on mobile devices</p>
        </div>
      </div>

      {/* Main content - only visible on mobile */}
      <div className="md:hidden bg-[#f5f3f4] relative min-h-screen w-full max-w-[440px] mx-auto">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white h-[70px] z-50 shadow-sm">
        {/* Status Bar */}
        <div className="h-[25px] bg-white" />
        {/* Navigation Bar */}
        <div className="h-[36px] flex items-start justify-between px-[16px]">
          <button
            onClick={() => router.back()}
            className="w-[24px] h-[24px] flex items-center justify-center"
          >
            <Image
            src="/assets/icons/arrow-back.svg"
            alt="Back"
            width={24}
            height={24}
            />
          </button>

          <h1 className="font-semibold text-[19px] text-[#E5383B] tracking-[-0.64px]">
            Vehicle Details
          </h1>

          <button className="w-[24px] h-[24px] flex items-center justify-center">
            <Image
              src="/assets/icons/search.svg"
              alt="Search"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[70px] pb-[117px] px-[16px]">
        <div className="flex flex-col gap-[16px] w-full py-[16px]">
          {/* Vehicle Card */}
          <VehicleCard
            plateNumber={vehicle.plateNumber}
            year={vehicle.year}
            make={vehicle.make}
            model={vehicle.model}
            specs={vehicle.specs}
            services={vehicle.services}
            additionalServices={vehicle.additionalServices}
          />

          {/* Tab Navigation */}
          <div className="flex items-center bg-[#e5e5e5]">
            <button
              onClick={() => setActiveTab('jobcard')}
              className={`flex-1 h-[36px] rounded-l-[7px] font-medium text-[13px] transition-colors ${
                activeTab === 'jobcard'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Job card
            </button>
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`flex-1 h-[36px] font-medium text-[13px] transition-colors ${
                activeTab === 'inquiry'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Inquiry
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`flex-1 h-[36px] rounded-r-[7px] font-medium text-[13px] transition-colors ${
                activeTab === 'disputes'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Disputes
            </button>
          </div>

          {/* Expandable Sections - Only show for Job card tab */}
          {activeTab === 'jobcard' && (
            <div className="flex flex-col gap-[12px]">
              {/* Basic Info Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Basic Info
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.basicInfo ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.basicInfo && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5]">
                    <div className="grid grid-cols-3 gap-[16px] pt-[16px]">
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Make Year</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.makeYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Reg. Year</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.regYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Chassis No.</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.chassisNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Fuel</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.fuel}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Transmission</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.transmission}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Variant</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.variant}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Owner Name</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.ownerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Contact Number</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.contactNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Odometer</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.odometerReading}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Observations Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('observations')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Observations
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.observations ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.observations && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5]">
                    <p className="text-[13px] text-[#525252] pt-[16px]">
                      {vehicle.observations}
                    </p>
                  </div>
                )}
              </div>

              {/* Jobs Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('jobs')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Jobs
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.jobs ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.jobs && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5] pt-[16px]">
                    {vehicle.jobs.map((job: any) => (
                      <div key={job.id} className="bg-[#f5f3f4] rounded-[12px] p-[14px]">
                        <h4 className="font-semibold text-[14px] text-[#2b2b2b] mb-[8px]">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-[8px] mb-[8px]">
                          <p className="text-[11px] text-[#99a2b6]">
                            Assigned To: <span className="text-[#2b2b2b]">{job.assignedTo}</span>
                          </p>
                          <span className="text-[#99a2b6]">•</span>
                          <p className="text-[11px] text-[#99a2b6]">{job.date}</p>
                        </div>
                        <p className="text-[12px] text-[#525252] mb-[12px]">{job.issue}</p>

                        {/* Media */}
                        <div className="flex gap-[8px] items-center">
                          {Array.from({ length: job.images }).map((_, idx) => (
                            <div
                              key={`img-${idx}`}
                              className="w-[58px] h-[58px] bg-[#d4d9e3] rounded-[8px] flex items-center justify-center"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                                  fill="#99a2b6"
                                />
                              </svg>
                            </div>
                          ))}
                          {job.additionalMedia > 0 && (
                            <div className="w-[58px] h-[58px] bg-[#d4d9e3] rounded-[8px] flex items-center justify-center">
                              <p className="text-[12px] font-medium text-[#525252]">
                                +{job.additionalMedia}
                              </p>
                            </div>
                          )}
                          {job.videos > 0 && (
                            <div className="w-[58px] h-[58px] bg-[#d4d9e3] rounded-[8px] flex items-center justify-center">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M8 5v14l11-7z" fill="#99a2b6" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inquiry Tab Content */}
          {activeTab === 'inquiry' && (
            <div className="flex flex-col gap-[12px]">
              {vehicle.inquiries && vehicle.inquiries.length > 0 ? (
                vehicle.inquiries.map((inquiry: Inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    isExpanded={expandedInquiries[inquiry.id] || false}
                    onToggle={() => toggleInquiry(inquiry.id)}
                    onEdit={(id) => console.log('Edit inquiry:', id)}
                    onDelete={(id) => console.log('Delete inquiry:', id)}
                    onReRequest={(id) => console.log('Re-request inquiry:', id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    No inquiries found for this vehicle
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Disputes Tab Content */}
          {activeTab === 'disputes' && (
            <div className="flex flex-col gap-[12px]">
              {vehicle.disputes && vehicle.disputes.length > 0 ? (
                vehicle.disputes.map((dispute: Dispute) => (
                  <DisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    onEdit={(id) => console.log('Edit dispute:', id)}
                    onAccept={(id) => console.log('Accept dispute:', id)}
                    onView={(id) => console.log('View dispute details:', id)}
                    onChat={(id) => console.log('Open chat for dispute:', id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    No disputes found for this vehicle
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        navigationOptions={[
          {
            label: 'Raise Dispute',
            onClick: () => console.log('Raise Dispute'),
          },
          {
            label: 'Request Part',
            onClick: () => console.log('Request Part'),
          },
        ]}
      />

      {/* Navigation Bar */}
      <NavigationBar />
      </div>
    </>
  );
}
