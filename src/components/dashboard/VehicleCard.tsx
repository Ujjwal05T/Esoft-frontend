import React from 'react';
import Image from 'next/image';

interface VehicleCardProps {
  plateNumber: string;
  year: number;
  make: string;
  model: string;
  specs: string;
  services: string[];
  additionalServices?: number;
}

export default function VehicleCard({
  plateNumber,
  year,
  make,
  model,
  specs,
  services,
  additionalServices = 0,
}: VehicleCardProps) {
  return (
    <div className="bg-white h-[228px] rounded-[17px] w-full relative max-w-[408px]">
      {/* Vehicle Image */}
      <div className="absolute left-0 top-[8px] h-[109px] w-[216px] p-[10px]">
        <div className="w-full h-full relative rounded overflow-hidden">
          <Image
            src="/assets/images/toyota-crysta.png"
            alt={`${make} ${model}`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Plate Number */}
      <div className="absolute right-[12px] top-[11px] bg-[#d4d9e3] h-[33px] px-[10px] rounded-[7px] flex items-center justify-center">
        <p className="font-bold text-[12px] text-black text-center tracking-[-0.41px]">
          {plateNumber}
        </p>
      </div>

      {/* Vehicle Info */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[122px] w-[334px]">
        <div className="flex flex-col">
          <p className="font-semibold text-[15px] text-black mb-0">
            {year} {make} {model}
          </p>
          <p className="font-normal text-[12px] text-[#99a2b6]">{specs}</p>
        </div>
      </div>

      {/* Service Tags */}
      <div className="absolute left-[11px] top-[177px] flex gap-[5px] items-center">
        {services.slice(0, 2).map((service, index) => (
          <div
            key={index}
            className="bg-[#f0f0f0] h-[36px] px-[12px] rounded-[7px] flex items-center justify-center"
          >
            <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px] whitespace-nowrap">
              {service}
            </p>
          </div>
        ))}
        {additionalServices > 0 && (
          <div className="bg-[#f0f0f0] h-[36px] w-[46px] rounded-[7px] flex items-center justify-center">
            <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px]">
              +{additionalServices}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
