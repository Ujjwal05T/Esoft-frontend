import React from 'react';
import Image from 'next/image';

interface StatusCardProps {
  title: string;
  value: string | number | React.ReactNode;
  bgColor: string;
  vectorSrc?: string;
  vectorClassName?: string;
  href?: string;
}

export default function StatusCard({
  title,
  value,
  bgColor,
  vectorSrc,
  vectorClassName,
  href,
}: StatusCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? { href, className: 'block cursor-pointer' } : {};

  return (
    <CardWrapper {...cardProps}>
      <div
        className="h-[155px] overflow-clip relative rounded-[9px] w-full"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute flex items-center justify-center left-[10px] top-[25px]">
          <p className="font-semibold leading-normal text-[#f5f3f4] text-[16px] text-left tracking-[-0.64px]">
            {title}
          </p>
        </div>
        <div className="absolute flex h-[66px] items-center justify-center left-[7px] top-[77px]">
          <p className="font-extrabold leading-normal text-[#f5f3f4] text-[65px] text-left tracking-[-2.6px]">
            {value}
          </p>
        </div>
        {/* Background Vector - positioned to overflow 20% on the right */}
        {vectorSrc && (
          <div className={`${vectorClassName}`} style={{left: '70px'}}>
            <Image
              src={vectorSrc}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        )}
        {/* Arrow Icon */}
        <div className="absolute right-[10px] w-[32px] h-[32px] bottom-[10px]">
          <Image
            src="/assets/icons/arrow-right.svg"
            alt="Go"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </CardWrapper>
  );
}
