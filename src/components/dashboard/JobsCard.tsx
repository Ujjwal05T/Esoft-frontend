import React from 'react';
import VehicleCard from './VehicleCard';

interface JobsCardProps {
  jobCount: number;
}

export default function JobsCard({ jobCount }: JobsCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#e5383b] to-[#8c2424] h-[404px] overflow-clip relative rounded-[17px] w-full">
      {/* Large Number Background */}
      <div className="absolute  top-[7px] flex items-center justify-center">
        <p
          className="font-semibold text-[180px] leading-[75px] text-center tracking-[-1px] blur-[0.3px]"
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

      {/* Vehicle Cards - Horizontal Scroll */}
      <div className="absolute left-[16px] right-0 top-[158px] flex overflow-x-auto gap-[12px] pr-[16px] pb-[4px] no-scrollbar snap-x snap-mandatory">
        {[
          {
            plateNumber: 'MP O9 CY 1321',
            year: 2018,
            make: 'Toyota',
            model: 'Crysta',
            specs: '2.4L ZX MT/Diesel',
            services: ['General Service', 'Headlight Change'],
            additionalServices: 2,
          },
          {
            plateNumber: 'MH 12 AB 5678',
            year: 2020,
            make: 'Tata',
            model: 'Nexon',
            specs: '1.5L XZ+ AT/Petrol',
            services: ['Brake System', 'Engine Service'],
            additionalServices: 1,
          },
          {
            plateNumber: 'DL 01 XY 9012',
            year: 2019,
            make: 'Mahindra',
            model: 'XUV500',
            specs: '2.2L W11 MT/Diesel',
            services: ['AC Repair', 'Suspension'],
            additionalServices: 0,
          },
        ].map((vehicle, index) => (
          <div key={index} className="w-full shrink-0 snap-center">
            <VehicleCard
              plateNumber={vehicle.plateNumber}
              year={vehicle.year}
              make={vehicle.make}
              model={vehicle.model}
              specs={vehicle.specs}
              services={vehicle.services}
              additionalServices={vehicle.additionalServices}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
