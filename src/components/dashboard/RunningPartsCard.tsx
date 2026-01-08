'use client'
import React from 'react';
import Image from 'next/image';

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  partNo: string;
  compatibility: string;
  image: string;
}

interface RunningPartsCardProps {
  title?: string;
  products?: ProductItem[];
  onCreateRequest?: (productId: string) => void;
}

const defaultProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Oil filter',
    brand: 'Toyota Genuine Parts',
    partNo: '14325354',
    compatibility: 'Compatible Cars: Fortuner, Hilux',
    image: '/assets/images/oil-filter.png',
  },
  {
    id: '2',
    name: 'Oil filter',
    brand: 'Toyota Genuine Parts',
    partNo: '14325355',
    compatibility: 'Compatible Cars: Fortuner, Hilux',
    image: '/assets/images/oil-filter.png',
  },
  {
    id: '3',
    name: 'Air filter',
    brand: 'Toyota Genuine Parts',
    partNo: '14325356',
    compatibility: 'Compatible Cars: Fortuner, Hilux',
    image: '/assets/images/oil-filter.png',
  },
];

export default function RunningPartsCard({
  title = 'Running Parts for Your Workshop',
  products = defaultProducts,
  onCreateRequest,
}: RunningPartsCardProps) {
  return (
    <div className="w-full bg-[#e5383b] rounded-[16px] overflow-hidden pb-[16px]">
      {/* Header */}
      <div className="px-[16px] pt-[16px] pb-[14px]">
        <h3 className="text-white text-[22px] font-bold leading-[1.2] tracking-tight">
          {title.split(' ').slice(0, 3).join(' ')}{' '}
          <br />
          <span className="text-white">{title.split(' ').slice(3).join(' ')}</span>
        </h3>
      </div>

      {/* Product Cards - Horizontal Scroll */}
      <div className="flex  overflow-x-auto  gap-[10px] px-[10px] pb-[12px] no-scrollbar snap-x snap-mandatory">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[300px] py-[6px] px-[12px] max-w-[300px] shrink-0 snap-center bg-white rounded-[12px] p-[10px] flex gap-[10px] overflow-hidden"
          >
            {/* Product Image */}
            <div className="w-[100px] h-[100px] bg-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={90}
                height={90}
                className="object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 my-[2px] min-w-0 flex flex-col">
              <div className="flex items-start justify-between mb-[2px]">
                <h4 className="text-[#1a1a1a] text-[18px] font-bold">
                  {product.name}
                </h4>
                <button className="text-[#828282] hover:text-[#666666] p-[4px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              <p className="text-[#e5383b] text-[14px] font-semibold mb-[2px]">
                {product.brand}
              </p>

              <p className="text-[#828282] text-[13px] leading-[1.3] mb-[2px]">
                Part No - {product.partNo}
              </p>

              <p className="text-[#828282] text-[12px] leading-[1.3] mb-[8px] line-clamp-2">
                {product.compatibility}
              </p>

              {/* Create Request Button */}
              <button
                onClick={() => onCreateRequest?.(product.id)}
                className="text-[#e5383b] text-[14px] font-bold tracking-wide hover:underline text-left mt-auto"
              >
                CREATE REQUEST
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

