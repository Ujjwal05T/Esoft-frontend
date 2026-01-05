import React from 'react';
import Image from 'next/image';

const brandLogos = [
  { name: 'TATA MOTORS', src: '/assets/logos/tata-motors.svg' },
  { name: 'Toyota', src: '/assets/logos/toyota.svg' },
  { name: 'Mahindra', src: '/assets/logos/mahindra.svg' },
  { name: 'LUMAX', src: '/assets/logos/lumax.svg' },
  { name: 'V', src: '/assets/logos/v-logo.svg' },
  { name: 'TWO', src: '/assets/logos/two-logo.svg' },
];

export default function RaisePartsCard() {
  return (
    <div className="relative w-full h-[167px] bg-[#e5383b] rounded-[8px] overflow-clip">
      {/* Title */}
      <div className="absolute left-[16px] top-[11px] z-10">
        <p className="font-bold leading-normal text-[22px] text-white tracking-[-0.88px]">
          Raise Parts<br/>Inquiry
        </p>
      </div>

      {/* Arrow Icon */}
      <div className="absolute right-[12px] top-[11px] w-[32px] h-[32px] z-10">
        <Image
          src="/assets/icons/arrow-parts.svg"
          alt="Arrow"
          fill
          className="object-contain"
        />
      </div>

      {/* Brand Logos */}
      <div className="absolute left-[18px] top-[80px] flex gap-[7px] z-10">
        {brandLogos.map((brand, index) => (
          <div
            key={index}
            className="bg-white w-[65px] h-[65px] rounded-[8px] flex items-center justify-center p-2"
          >
            <div className="relative w-full h-full">
              <Image
                src={brand.src}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
