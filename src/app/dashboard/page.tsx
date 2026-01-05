import React from 'react';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import StatusCard from '@/components/dashboard/StatusCard';
import AddVehicleCard from '@/components/dashboard/AddVehicleCard';
import RaisePartsCard from '@/components/dashboard/RaisePartsCard';
import JobsCard from '@/components/dashboard/JobsCard';

export default function Dashboard() {
  return (
    <div className="bg-white relative min-h-screen w-full max-w-[440px] mx-auto">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="pt-[121px] pb-[117px] px-[16px]">
        <div className="flex flex-col gap-[24px] w-full py-[16px]">
          {/* Status Cards Row */}
          <div className="flex flex-wrap gap-[20px] items-start w-full">
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
  );
}
