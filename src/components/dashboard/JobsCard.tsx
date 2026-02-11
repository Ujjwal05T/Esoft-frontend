'use client';

import React, { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import { getVehicles, type VehicleResponse } from '@/services/api';

interface DisplayVehicle {
  id: string;
  plateNumber: string;
  year?: number;
  brand?: string;
  model?: string;
  variant?: string;
  specs?: string;
  status: 'Active' | 'Inactive' | 'Requested';
}

export default function JobsCard() {
  const [vehicles, setVehicles] = useState<DisplayVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setIsLoading(true);
        const result = await getVehicles();
        
        if (result.success && result.data) {
          const allVehicles: DisplayVehicle[] = result.data.vehicles.map((v: VehicleResponse) => ({
            id: String(v.id),
            plateNumber: v.plateNumber,
            year: v.year || undefined,
            brand: v.brand || undefined,
            model: v.model || undefined,
            variant: v.variant || undefined,
            specs: v.specs || v.variant || undefined,
            status: v.status as 'Active' | 'Inactive' | 'Requested',
          }));
          
          // Show all vehicles
          setVehicles(allVehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  const jobCount = vehicles.length;

  return (
    <div className="bg-gradient-to-b from-[#e5383b] to-[#8c2424] h-[404px] overflow-clip relative rounded-[17px] w-full">
      {/* Large Number Background */}
      <div className="absolute top-[47px] flex items-center justify-center">
        <p
          className="font-semibold text-[180px] leading-[135px] text-center tracking-[-1px] blur-[0.3px]"
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
      <div className="absolute left-1/2 -translate-x-1/3 top-[77px] flex items-center justify-center">
        <div className="font-black text-[28px] leading-[36px] text-[#f0f0f0] text-center tracking-[-1px]">
          <p className="mb-0">Jobs</p>
          <p>Card Open</p>
        </div>
      </div>

      {/* Vehicle Cards - Horizontal Scroll */}
      <div className="absolute left-[16px] right-0 top-[158px] flex overflow-x-auto gap-[12px] pr-[16px] pb-[4px] no-scrollbar snap-x snap-mandatory">
        {isLoading ? (
          <div className="w-full flex items-center justify-center py-[40px]">
            <p className="text-white text-[14px]">Loading vehicles...</p>
          </div>
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-full shrink-0 snap-center">
              <VehicleCard
                plateNumber={vehicle.plateNumber}
                year={vehicle.year}
                make={vehicle.brand || 'Unknown'}
                model={vehicle.model || 'Unknown'}
                specs={vehicle.specs || vehicle.variant || ''}
                services={[]}
                additionalServices={0}
                variant="default"
              />
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center py-[40px]">
            <p className="text-white text-[14px]">No requested vehicles</p>
          </div>
        )}
      </div>
    </div>
  );
}
