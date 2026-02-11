'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import AddVehicleOverlay from '@/components/overlays/AddVehicleOverlay';
import FiltersOverlay from '@/components/overlays/FiltersOverlay';
import { getVehicles, getCurrentVehicles, type VehicleResponse, type VehicleVisitResponse } from '@/services/api';

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

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | 'requested'>('all');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [vehicles, setVehicles] = useState<DisplayVehicle[]>([]);
  const [requestedVehicles, setRequestedVehicles] = useState<DisplayVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for addVehicle query parameter
  useEffect(() => {
    if (searchParams?.get('addVehicle') === 'true') {
      setShowAddVehicle(true);
    }
  }, [searchParams]);

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all vehicles
      const vehiclesResult = await getVehicles();
      
      if (vehiclesResult.success && vehiclesResult.data) {
        const allVehicles: DisplayVehicle[] = vehiclesResult.data.vehicles.map((v: VehicleResponse) => ({
          id: String(v.id),
          plateNumber: v.plateNumber,
          year: v.year || undefined,
          brand: v.brand || undefined,
          model: v.model || undefined,
          variant: v.variant || undefined,
          specs: v.specs || v.variant || undefined,
          status: v.status as 'Active' | 'Inactive' | 'Requested',
        }));
        
        // Separate vehicles by status
        // Only show Active vehicles in the main list (exclude Inactive/gated out vehicles)
        setVehicles(allVehicles.filter(v => v.status === 'Active'));
        setRequestedVehicles(allVehicles.filter(v => v.status === 'Requested'));
      }

    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Filter vehicles based on active tab
  const displayVehicles = activeTab === 'all' 
    ? vehicles 
    : requestedVehicles;

  const handleSubmitRequest = () => {
    // Refresh vehicle list after adding
    fetchVehicles();
  };

  const handleCloseAddVehicle = () => {
    setShowAddVehicle(false);
    // Refresh vehicles in case a new one was added
    fetchVehicles();
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
                    onClick={() => setActiveTab('requested')}
                    className={`px-[16px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                      activeTab === 'requested'
                        ? 'bg-[#e5383b] text-white shadow-sm'
                        : 'text-[#4c4c4c] hover:text-[#1a1a1a]'
                    }`}
                  >
                    Requested ({requestedVehicles.length})
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
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-[40px]">
                  <div className="flex flex-col items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] border-4 border-[#e5383b] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[14px] text-[#666]">Loading vehicles...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex items-center justify-center py-[40px]">
                  <div className="flex flex-col items-center gap-[12px]">
                    <p className="text-[16px] text-[#e5383b] font-medium">{error}</p>
                    <button 
                      onClick={fetchVehicles}
                      className="px-[20px] py-[10px] bg-[#e5383b] text-white rounded-[8px] text-[14px] font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {!isLoading && !error && displayVehicles.length === 0 && (
                <div className="flex items-center justify-center py-[40px]">
                  <div className="flex flex-col items-center gap-[12px]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 17H22L20.595 9.81C20.5164 9.35162 20.2816 8.9373 19.9312 8.63643C19.5809 8.33557 19.1372 8.16742 18.675 8.159H5.325C4.86276 8.16742 4.41909 8.33557 4.06878 8.63643C3.71847 8.9373 3.48358 9.35162 3.405 9.81L2 17H5M19 17V17.5C19 18.163 18.7366 18.7989 18.2678 19.2678C17.7989 19.7366 17.163 20 16.5 20C15.837 20 15.2011 19.7366 14.7322 19.2678C14.2634 18.7989 14 18.163 14 17.5V17M19 17H14M5 17V17.5C5 18.163 5.26339 18.7989 5.73223 19.2678C6.20107 19.7366 6.83696 20 7.5 20C8.16304 20 8.79893 19.7366 9.26777 19.2678C9.73661 18.7989 10 18.163 10 17.5V17M5 17H10M10 17H14" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-[16px] text-[#666] font-medium">
                      {activeTab === 'all' ? 'No vehicles found' : 'No requested vehicles'}
                    </p>
                    <p className="text-[14px] text-[#999]">
                      {activeTab === 'all' ? 'Add your first vehicle to get started' : 'Staff-added vehicles will appear here'}
                    </p>
                    {activeTab === 'all' && (
                      <button 
                        onClick={() => setShowAddVehicle(true)}
                        className="mt-[8px] px-[20px] py-[10px] bg-[#e5383b] text-white rounded-[8px] text-[14px] font-medium"
                      >
                        Add Vehicle
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicles Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
              {!isLoading && !error && displayVehicles.length > 0 && (
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
                        specs={vehicle.specs || vehicle.variant || ''}
                        services={[]}
                        additionalServices={0}
                        variant={vehicle.status === 'Requested' ? 'scan' : 'default'}
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


