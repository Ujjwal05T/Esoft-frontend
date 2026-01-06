'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';

// Mock vehicle data
const vehicles = [
  {
    id: '1',
    plateNumber: 'MP O9 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['General Service', 'Headlight Change'],
    additionalServices: 2,
    status: 'Active',
  },
  {
    id: '2',
    plateNumber: 'MH 12 AB 5678',
    year: 2020,
    make: 'Tata',
    model: 'Nexon',
    specs: '1.5L XZ+ AT/Petrol',
    services: ['Brake System', 'Engine Service'],
    additionalServices: 1,
    status: 'Active',
  },
  {
    id: '3',
    plateNumber: 'DL 01 XY 9012',
    year: 2019,
    make: 'Mahindra',
    model: 'XUV500',
    specs: '2.2L W11 MT/Diesel',
    services: ['AC Repair', 'Suspension'],
    additionalServices: 0,
    status: 'Active',
  },
  {
    id: '4',
    plateNumber: 'KA 03 MN 3456',
    year: 2021,
    make: 'Hyundai',
    model: 'Creta',
    specs: '1.5L SX AT/Petrol',
    services: ['Oil Change', 'Tire Rotation'],
    additionalServices: 3,
    status: 'Active',
  },
  {
    id: '5',
    plateNumber: 'TN 09 PQ 7890',
    year: 2017,
    make: 'Maruti',
    model: 'Swift',
    specs: '1.2L VXI MT/Petrol',
    services: ['Battery Check'],
    additionalServices: 0,
    status: 'Inactive',
  },
];

export default function VehiclesPage() {
  return (
    <div className="bg-white relative min-h-screen w-full max-w-[440px] mx-auto">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="pt-[70px] pb-[117px] px-[16px]">
        <div className="flex flex-col gap-[24px] w-full py-[16px]">
          {/* Search and Filter Section */}
          

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 gap-[20px] w-full">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="block cursor-pointer hover:opacity-90 transition-opacity"
              >
                <VehicleCard
                  plateNumber={vehicle.plateNumber}
                  year={vehicle.year}
                  make={vehicle.make}
                  model={vehicle.model}
                  specs={vehicle.specs}
                  services={vehicle.services}
                  additionalServices={vehicle.additionalServices}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        navigationOptions={[
          {
            label: 'Add new vehicle',
            onClick: () => console.log('Add new vehicle'),
          },
        ]}
      />

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  );
}
