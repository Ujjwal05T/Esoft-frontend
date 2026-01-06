import React from 'react';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import StatusCard from '@/components/dashboard/StatusCard';
import AddVehicleCard from '@/components/dashboard/AddVehicleCard';
import RaisePartsCard from '@/components/dashboard/RaisePartsCard';
import JobsCard from '@/components/dashboard/JobsCard';

export default function Dashboard() {
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
      <div className="md:hidden bg-white relative min-h-screen w-full max-w-[440px] mx-auto">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="pt-[70px] pb-[117px] px-[16px]">
        <div className="flex flex-col gap-[24px] w-full py-[16px]">
          {/* Status Cards Row */}
          <div className="flex flex-wrap gap-[10px] items-start w-full">
            <StatusCard
              title="Vehicles Assigned"
              value="5"
              bgColor="bg-[#f24822]"
              vectorSrc="/assets/vectors/vehicle-vector.svg"
              vectorClassName="absolute h-[130px] left-[113px] mix-blend-color-burn top-[25px] w-[147px]"
              href="/vehicles"
            />
            <StatusCard
              title="Approved Inquiry"
              value={
                <span>
                  <span className="text-[65px]">8</span>
                  <span className="text-[32px]">/12</span>
                </span>
              }
              bgColor="bg-[#2294f2]"
              vectorSrc="/assets/vectors/inquiry-vector.svg"
              vectorClassName="absolute left-[116px] mix-blend-overlay w-[109px] h-[109px] top-[46px]"
              href="/inquiries"
            />
          </div>

          {/* Add New Vehicle Card */}
          <AddVehicleCard />

          {/* Raise Parts Inquiry Card */}
          <RaisePartsCard />

          {/* Jobs Card */}
          <JobsCard jobCount={5} />
        </div>
      </div>

      {/* Navigation Bar */}
      <NavigationBar />
      </div>
    </>
  );
}
