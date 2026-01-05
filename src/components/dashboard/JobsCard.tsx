import React from 'react';
import VehicleCard from './VehicleCard';

interface JobsCardProps {
  jobCount: number;
}

export default function JobsCard({ jobCount }: JobsCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#e5383b] to-[#8c2424] h-[404px] overflow-clip relative rounded-[17px] w-full">
      {/* Large Number Background */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[58px] flex items-center justify-center">
        <p
          className="font-semibold text-[180px] leading-[77px] text-center tracking-[-1px] blur-[0.3px]"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 30.576%, rgba(202, 50, 52, 1) 89.329%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {jobCount}
        </p>
      </div>

      {/* Text Label */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[77px] flex items-center justify-center">
        <div className="font-black text-[28px] leading-[36px] text-[#f0f0f0] text-center tracking-[-1px]">
          <p className="mb-0">Jobs</p>
          <p>Card Open</p>
        </div>
      </div>

      {/* Vehicle Card */}
      <div className="absolute left-[16px] right-[16px] top-[158px]">
        <VehicleCard
          plateNumber="MP O9 CY 1321"
          year={2018}
          make="Toyota"
          model="Crysta"
          specs="2.4L ZX MT/Diesel"
          services={['General Service', 'Headlight Change']}
          additionalServices={2}
        />
      </div>
    </div>
  );
}
