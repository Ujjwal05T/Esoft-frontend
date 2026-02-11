import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AddVehicleCard() {
  return (
    <Link href="/owner/vehicles?addVehicle=true" className="block">
      <div className="h-[155px] overflow-clip relative rounded-[9px] w-full bg-gradient-to-b from-[#e5383b] to-[#bb282b] cursor-pointer hover:opacity-90 transition-opacity">
        {/* Background Car Silhouette */}
        <div className="absolute inset-0 overflow-hidden rounded-[9px]">
          <Image
            src="/assets/images/car-silhouette.png"
            alt=""
            fill
            className="object-cover object-center"
            style={{ transform: 'scale(1.88) translateY(-17%) translateX(38%)' }}
          />
        </div>

        {/* Content */}
        <div className="absolute flex items-center justify-center left-[11px] top-[21px] z-10">
          <p className="font-black leading-[36px] text-[30px] text-white tracking-[-1.28px] w-[169px]">
            Add a New Vehicle
          </p>
        </div>

        {/* Icon */}
        <div className="absolute left-[11px] top-[103px] w-[32px] h-[32px] z-10">
          <Image
            src="/assets/icons/arrow-diagonal.svg"
            alt="Add"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
}
