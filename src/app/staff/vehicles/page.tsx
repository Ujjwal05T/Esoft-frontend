'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import AddVehicleOverlay from '@/components/overlays/AddVehicleOverlay';

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
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const handleSubmitRequest = (data: { plateNumber: string; ownerName: string; contactNumber: string; odometerReading: string; observations: string }) => {
    console.log('Vehicle request submitted:', data);
    // In real app, send data to API
    // setShowAddVehicle(false);
  };

  const handleAddManually = () => {
    console.log('Add vehicle manually');
    // Manual form is now handled within the overlay
  };

  return (
    <div className="bg-white relative min-h-screen w-full overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px]">
        {/* Inner container for mobile centering */}
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0">
          {/* Header */}
          <Header />

          {/* Main Content Container */}
          <div className="pt-[50px] md:pt-[24px] pb-[117px] md:pb-[24px] px-[16px] md:px-[24px] lg:px-[32px]">
            <div className="flex flex-col gap-[24px] w-full py-[16px]">
              {/* Search and Filter Section */}
              

              {/* Vehicles Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] w-full">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/staff/vehicles/${vehicle.id}`}
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
                onClick: () => setShowAddVehicle(true),
              },
            ]}
          />

          {/* Navigation Bar */}
          <NavigationBar />
        </div>
      </div>

      {/* Add Vehicle Overlay */}
      <AddVehicleOverlay
        isOpen={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
        onSubmitRequest={handleSubmitRequest}
        onAddManually={handleAddManually}
      />
    </div>
  );
}

