import React from 'react';
import Image from 'next/image';

interface EventCardProps {
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  imageSrc?: string;
}

export default function EventCard({
  title = 'Valvoline Mechanic Meet',
  date = '12 December 2025',
  time = '7 PM - 10 PM',
  venue = 'Sayaji Effotel',
  imageSrc = '/assets/images/event-car.png',
}: EventCardProps) {
  return (
    <div className="relative w-full h-[140px] bg-[#e5383b] rounded-[16px] overflow-hidden shadow-sm">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Event"
          fill
          className="object-cover object-center"
        />
        {/* Gradient Overlay - Red at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#e5383b] via-[#e5383b]/70 to-transparent" />
      </div>

      {/* Content - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-[16px] pb-[12px]">
        {/* Title */}
        <h3 className="text-white text-[20px] font-bold leading-[1.2] tracking-tight mb-[3px]">
          {title}
        </h3>

        {/* Event Details */}
        <p className="text-white/90 text-[12px] font-sans leading-[1.4] mb-[2px]">
          {date} • {time} • {venue}
        </p>
      </div>
    </div>
  );
}
