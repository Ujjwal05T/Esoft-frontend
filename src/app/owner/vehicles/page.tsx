'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import AddVehicleOverlay from '@/components/overlays/AddVehicleOverlay';
import FiltersOverlay from '@/components/overlays/FiltersOverlay';

// Static dummy vehicle data
interface DummyVehicle {
  id: string;
  plateNumber: string;
  year?: number;
  brand?: string;
  model?: string;
  variant?: string;
  status: 'Active' | 'InService';
}

const dummyVehicles: DummyVehicle[] = [
  {
    id: '1',
    plateNumber: 'MP 09 GL 5656',
    year: 2018,
    brand: 'Toyota',
    model: 'Innova Crysta',
    variant: '2.4L ZX MT/Diesel',
    status: 'Active',
  },
  {
    id: '2',
    plateNumber: 'MH 12 AB 1234',
    year: 2020,
    brand: 'Honda',
    model: 'City',
    variant: '1.5L V CVT/Petrol',
    status: 'InService',
  },
  {
    id: '3',
    plateNumber: 'DL 05 XY 9999',
    year: 2022,
    brand: 'Hyundai',
    model: 'Creta',
    variant: '1.5L SX/Diesel',
    status: 'Active',
  },
  {
    id: '4',
    plateNumber: 'KA 01 MN 4567',
    year: 2019,
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: '1.2L ZXi/Petrol',
    status: 'Active',
  },
];

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [vehicles] = useState<DummyVehicle[]>(dummyVehicles);

  // Filter vehicles based on active tab
  // For now, 'requests' tab shows vehicles with 'InService' status
  const displayVehicles = activeTab === 'all' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === 'InService');

  const handleSubmitRequest = () => {
    // With static data, no need to refresh
    console.log('Vehicle added (using static dummy data)');
  };

  const handleCloseAddVehicle = () => {
    setShowAddVehicle(false);
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
            <div className="flex flex-col gap-[24px] w-full py-[13px]">
              {/* Filter Section */}
              <div className="flex items-center justify-between ">
                {/* Toggle Switch */}
                <div className="bg-[#e5e5e5]  rounded-[12px] flex items-center ">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                      activeTab === 'all'
                        ? 'bg-[#e5383b] text-white shadow-sm'
                        : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                    }`}
                  >
                    All Vehicles ({vehicles.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                      activeTab === 'requests'
                        ? 'bg-[#e5383b] text-white shadow-sm'
                        : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                    }`}
                  >
                    Vehicle Request
                  </button>
                </div>

                {/* Filter Button */}
                <button 
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-[6px] px-[16px] py-[8px] border border-[#e5383b] rounded-[8px] text-[#e5383b] text-[14px] font-medium hover:bg-[#fff5f5] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 11L4 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11L12 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5L4 3L2 5" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11L12 13L10 11" stroke="#E5383B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Filter
                </button>
              </div>
              
              {/* Empty State - only shown when no vehicles in static data */}
              {displayVehicles.length === 0 && (
                <div className="flex items-center justify-center py-[40px]">
                  <div className="flex flex-col items-center gap-[12px]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 17H22L20.595 9.81C20.5164 9.35162 20.2816 8.9373 19.9312 8.63643C19.5809 8.33557 19.1372 8.16742 18.675 8.159H5.325C4.86276 8.16742 4.41909 8.33557 4.06878 8.63643C3.71847 8.9373 3.48358 9.35162 3.405 9.81L2 17H5M19 17V17.5C19 18.163 18.7366 18.7989 18.2678 19.2678C17.7989 19.7366 17.163 20 16.5 20C15.837 20 15.2011 19.7366 14.7322 19.2678C14.2634 18.7989 14 18.163 14 17.5V17M19 17H14M5 17V17.5C5 18.163 5.26339 18.7989 5.73223 19.2678C6.20107 19.7366 6.83696 20 7.5 20C8.16304 20 8.79893 19.7366 9.26777 19.2678C9.73661 18.7989 10 18.163 10 17.5V17M5 17H10M10 17H14" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-[16px] text-[#666] font-medium">No vehicles found</p>
                    <p className="text-[14px] text-[#999]">Add your first vehicle to get started</p>
                    <button 
                      onClick={() => setShowAddVehicle(true)}
                      className="mt-[8px] px-[20px] py-[10px] bg-[#e5383b] text-white rounded-[8px] text-[14px] font-medium"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </div>
              )}

              {/* Vehicles Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
              {displayVehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] w-full">
                  {displayVehicles.map((vehicle) => (
                    <Link
                      key={vehicle.id}
                      href={`/owner/vehicles/${vehicle.id}`}
                      className="block cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <VehicleCard
                        plateNumber={vehicle.plateNumber}
                        year={vehicle.year || undefined}
                        make={vehicle.brand || 'Unknown'}
                        model={vehicle.model || 'Unknown'}
                        specs={vehicle.variant || ''}
                        services={[]}
                        additionalServices={0}
                        variant={vehicle.status === 'InService' ? 'scan' : 'default'}
                      />
                    </Link>
                  ))}
                </div>
              )}
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
          <NavigationBar role='owner' />
        </div>
      </div>

      {/* Add Vehicle Overlay */}
      <AddVehicleOverlay
        isOpen={showAddVehicle}
        onClose={handleCloseAddVehicle}
        onSubmitRequest={handleSubmitRequest}
      />

      {/* Filters Overlay */}
      <FiltersOverlay
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
          // TODO: Apply filters to vehicle list
        }}
      />
    </div>
  );
}

