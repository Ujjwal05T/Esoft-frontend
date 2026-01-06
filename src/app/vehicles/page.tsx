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
    <>
      {/* Mobile-only message for larger screens */}
      <div className="hidden md:flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f24822] to-[#2294f2]">
        <div className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-[#f24822]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Mobile Only</h1>
          <p className="text-lg text-gray-600">This site can only be viewed on mobile devices</p>
        </div>
      </div>

      {/* Main content - only visible on mobile */}
      <div className="md:hidden bg-white relative min-h-screen w-full max-w-[440px] mx-auto">
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
    </>
  );
}
