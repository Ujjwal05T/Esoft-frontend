'use client';

import React from 'react';
// Import components you want to test here
// import NavigationBar from '@/components/dashboard/NavigationBar';
// import StatusCard from '@/components/dashboard/StatusCard';
// import VehicleCard from '@/components/dashboard/VehicleCard';
// import AddVehicleCard from '@/components/dashboard/AddVehicleCard';
// import RaisePartsCard from '@/components/dashboard/RaisePartsCard';
// import JobsCard from '@/components/dashboard/JobsCard';

export default function ComponentPlayground() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#171717] mb-2">
          🎨 Component Playground
        </h1>
        <p className="text-[#171717]/60">
          Test and preview components in isolation
        </p>
      </div>

      {/* Testing Area */}
      <div className="border-4 border-dashed border-[#e5383b] rounded-lg p-8 bg-white min-h-[600px]">
        <p className="text-[#171717]/40 text-center">
          Add components here to test them
        </p>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#171717] mb-4">
          📝 How to Use
        </h2>
        <ol className="space-y-3 text-[#171717]/70">
          <li className="flex gap-3">
            <span className="font-bold text-[#e5383b]">1.</span>
            <span>Uncomment the component imports at the top of this file</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#e5383b]">2.</span>
            <span>Add your component inside the bordered testing area</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#e5383b]">3.</span>
            <span>Save the file and see your component render</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#e5383b]">4.</span>
            <span>Test different props, data, and configurations</span>
          </li>
        </ol>

        <div className="mt-6 p-4 bg-[#f5f3f4] rounded-lg">
          <p className="text-sm font-semibold text-[#171717] mb-2">💡 Quick Example:</p>
          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
{`// Uncomment imports at top:
// import StatusCard from '@/components/dashboard/StatusCard';

// Then add in testing area:
<StatusCard 
  title="Vehicles Assigned" 
  value="5" 
  bgColor="bg-[#f24822]"
  vectorSrc="/assets/vectors/vehicle-vector.svg"
  vectorClassName="absolute h-[130px] right-0 mix-blend-color-burn top-[25px] w-[147px]"
  href="/staff/vehicles"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
