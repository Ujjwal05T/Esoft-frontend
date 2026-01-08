import React from 'react';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import StatusCard from '@/components/dashboard/StatusCard';
import AddVehicleCard from '@/components/dashboard/AddVehicleCard';
import RaisePartsCard from '@/components/dashboard/RaisePartsCard';
import JobsCard from '@/components/dashboard/JobsCard';

export default function Dashboard() {
  return (
    <div className="bg-white relative min-h-screen w-full overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px]">
        {/* Inner container for mobile centering */}
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0">
          {/* Header */}
          <Header />

          {/* Main Content Container */}
          <div className="pt-[50px] md:pt-[24px] pb-[117px] md:pb-[24px] px-[16px] md:px-[24px] lg:px-[32px]">
            <div className="flex flex-col gap-[24px] w-full py-[16px]">
              {/* Status Cards Row - 2 columns on all screens */}
              <div className="grid grid-cols-2 gap-[10px] w-full">
                <StatusCard
                  title="Vehicles Assigned"
                  value="5"
                  bgColor="#f24822"
                  vectorSrc="/assets/vectors/vehicle-vector.svg"
                  vectorClassName="absolute h-[130px] right-0 mix-blend-color-burn top-[25px] w-[147px]"
                  href="/staff/vehicles"
                />
                <StatusCard
                  title="Approved Inquiry"
                  value={
                    <span>
                      <span className="text-[65px]">8</span>
                      <span className="text-[32px]">/12</span>
                    </span>
                  }
                  bgColor="#2294f2"
                  vectorSrc="/assets/vectors/inquiry-vector.svg"
                  vectorClassName="absolute right-0 mix-blend-overlay w-[109px] h-[109px] top-[46px]"
                  href="/staff/inquiries"
                />
              </div>

              {/* Add New Vehicle Card */}
              <AddVehicleCard />

              {/* Raise Parts Inquiry Card */}
              <RaisePartsCard text1='Raise Parts' text2='Inquiry' />

              {/* Jobs Card */}
              <JobsCard jobCount={5} />
            </div>
          </div>

          {/* Navigation Bar */}
          <NavigationBar />
        </div>
      </div>
    </div>
  );
}
