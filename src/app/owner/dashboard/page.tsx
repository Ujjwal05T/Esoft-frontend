'use client'
import React from 'react';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import StatusCard from '@/components/dashboard/StatusCard';
import AddVehicleCard from '@/components/dashboard/AddVehicleCard';
import RaisePartsCard from '@/components/dashboard/RaisePartsCard';
import JobsCard from '@/components/dashboard/JobsCard';
import EventCard from '@/components/dashboard/EventCard';
import RunningPartsCard from '@/components/dashboard/RunningPartsCard';

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
                  title="Orders in Process"
                  value="2"
                  bgColor="#f24822"
                  vectorSrc="/assets/vectors/vehicle-vector.svg"
                  vectorClassName="absolute h-[130px] right-0 mix-blend-color-burn top-[25px] w-[147px]"
                  href="/owner/orders"
                />
                <StatusCard
                  title="Pending Quotes"
                  value="10"
                  bgColor="#2294f2"
                  vectorSrc="/assets/vectors/inquiry-vector.svg"
                  vectorClassName="absolute right-0 mix-blend-overlay w-[109px] h-[109px] top-[46px]"
                  href="/owner/inquiries"
                />
                <StatusCard
                  title="Pending Part Requests"
                  value="8"
                  bgColor="#ffad2a"
                  vectorSrc="/assets/vectors/clock-vector.svg"
                  vectorClassName="absolute h-[130px] right-0 mix-blend-color-burn top-[25px] w-[147px]"
                  href="/owner/inquiries"
                />
                <StatusCard
                  title="Raised Disputes"
                  value="4"
                  bgColor="#e43cd3"
                  vectorSrc="/assets/vectors/question-vector.svg"
                  vectorClassName="absolute h-[130px] right-0 mix-blend-color-burn top-[25px] w-[147px]"
                  href="/owner/inquiries"
                />
              </div>

              {/* Add New Vehicle Card */}
              <AddVehicleCard />

              {/* Pending Vehicle Requests */}
              <JobsCard />

              {/* Valvoline Event Card */}
              <EventCard 
                title="Valvoline Mechanic Meet"
                date="12 December 2025"
                time="7 PM - 10 PM"
                venue="Sayaji Effotel"
              />

              {/* Running Parts Section */}
              <RunningPartsCard />

              {/* Get Instant Quotes Card */}
              <RaisePartsCard text1='Get Instant Quotes' text2='For OEM Spareparts'/>

              <div style={{display: 'flex',justifyContent: 'center',alignItems: 'center',flexDirection: 'row',gap: '20px'}}   >
                <span style={{color: '#E5383B',textAlign: 'center',fontFamily: 'Inter',fontSize: '94px',fontStyle: 'normal',fontWeight: '900',lineHeight: '77px',letterSpacing: '-1px'}}>#1</span>
                <p style={{color: '#E5383B',fontFamily: 'Inter',fontSize: '28px',fontStyle: 'bold',fontWeight: 'bold',lineHeight: '32px',letterSpacing: '-1px'}}>
                  Your One Stop<br />
                  Solution for OEM<br />
                  Spare Parts
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <NavigationBar role='owner'/>
        </div>
      </div>
    </div>
  );
}
    
