'use client';

import React, { useState } from 'react';
import VehicleCard from '@/components/dashboard/VehicleCard';
import StaffCard from '@/components/dashboard/StaffCard';

interface ViewStaffOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  staffData: ViewStaffData | null;
}

export interface ViewStaffData {
  id: string;
  name: string;
  role: string;
  phone: string;
  photo: string | null;
}

// Back Arrow Icon
const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19L8 12L15 5"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Search Icon
const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21L16.65 16.65"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filter Icon
const FilterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"
      stroke="#e5383b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Mock vehicle data for staff
const mockStaffVehicles = [
  {
    plateNumber: 'MP 09 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['General Service'],
    additionalServices: 0,
  },
  {
    plateNumber: 'MP 09 CY 1322',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['Brake System'],
    additionalServices: 1,
  },
  {
    plateNumber: 'MP 09 CY 1323',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['Engine Service'],
    additionalServices: 0,
  },
];

// Mock job data for staff
interface JobData {
  id: string;
  vehicleName: string;
  vehicleNumber: string;
  inquiryNumber: string;
  placedDate: string;
  inquiryBy: string;
  jobCategory: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

const mockStaffJobs: JobData[] = [
  {
    id: '1',
    vehicleName: 'Toyota Crysta',
    vehicleNumber: 'MP09-GP4567',
    inquiryNumber: 'ET/INQ/24-25/01255',
    placedDate: '5 dec 2025',
    inquiryBy: 'Sohan',
    jobCategory: 'Brake Parts',
    status: 'Open',
  },
  {
    id: '2',
    vehicleName: 'Toyota Crysta',
    vehicleNumber: 'MP09-GP4567',
    inquiryNumber: 'ET/INQ/24-25/01255',
    placedDate: '5 dec 2025',
    inquiryBy: 'Sohan',
    jobCategory: 'Brake Parts',
    status: 'Open',
  },
  {
    id: '3',
    vehicleName: 'Toyota Crysta',
    vehicleNumber: 'MP09-GP4567',
    inquiryNumber: 'ET/INQ/24-25/01255',
    placedDate: '5 dec 2025',
    inquiryBy: 'Sohan',
    jobCategory: 'Brake Parts',
    status: 'Open',
  },
];

// Job Card Component
const JobCard = ({ job }: { job: JobData }) => (
  <div className="bg-white rounded-[12px] p-[16px] shadow-sm">
    {/* Header Row */}
    <div className="flex items-start justify-between mb-[8px]">
      <div>
        <p
          className="text-[14px] text-[#333] font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {job.vehicleName}
        </p>
        <p
          className="text-[16px] text-[#e5383b] font-bold"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {job.vehicleNumber}
        </p>
      </div>
      <span
        className={`px-[12px] py-[4px] rounded-[4px] text-[12px] font-medium ${
          job.status === 'Open'
            ? 'bg-[#e5383b] text-white'
            : job.status === 'In Progress'
            ? 'bg-[#ffa500] text-white'
            : 'bg-[#28a745] text-white'
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {job.status}
      </span>
    </div>

    {/* Inquiry Info */}
    <p
      className="text-[14px] text-[#e5383b] font-medium mb-[2px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {job.inquiryNumber}
    </p>
    <p
      className="text-[12px] text-[#828282] mb-[12px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Placed: {job.placedDate}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <p
        className="text-[12px] text-[#333]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Inquiry by: <span className="text-[#e5383b]">{job.inquiryBy}</span>
      </p>
      <p
        className="text-[12px] text-[#333]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Job Category: <span className="text-[#e5383b]">{job.jobCategory}</span>
      </p>
    </div>
  </div>
);

export default function ViewStaffOverlay({
  isOpen,
  onClose,
  staffData,
}: ViewStaffOverlayProps) {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'jobs'>('vehicles');

  if (!isOpen || !staffData) return null;

  // Convert staffData to StaffMember format for StaffCard
  const staffMember = {
    id: staffData.id,
    name: staffData.name,
    role: staffData.role,
    phone: staffData.phone,
    avatar: staffData.photo || '',
  };

  return (
    <div className="fixed inset-0 z-[51] flex flex-col bg-[#f2f2f2]">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-[16px] py-[16px]">
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex items-center gap-[16px]">
            <button onClick={onClose} className="shrink-0">
              <BackArrowIcon />
            </button>
            <h1
              className="text-[#e5383b] font-semibold text-[24px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              My Staff
            </h1>
          </div>
          <button className="shrink-0">
            <SearchIcon />
          </button>
        </div>

        {/* Staff Card - Unexpanded, no actions */}
        <StaffCard
          staff={staffMember}
          isExpanded={false}
          showActions={false}
        />
      </div>

      {/* Tabs and Filter */}
      <div className="bg-white px-[16px] py-[12px] flex items-center justify-between border-b border-[#e5e5e5]">
        {/* Tabs */}
        <div className="flex items-center bg-[#e5e5e5] rounded-[8px]">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-[20px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
              activeTab === 'vehicles'
                ? 'bg-[#e5383b] text-white'
                : 'bg-[#e5e5e5] text-[#4c4c4c]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-[20px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
              activeTab === 'jobs'
                ? 'bg-[#e5383b] text-white'
                : 'bg-[#e5e5e5] text-[#4c4c4c]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Jobs
          </button>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-[6px] px-[12px] py-[8px] border border-[#e5e5e5] rounded-[8px]">
          <FilterIcon />
          <span
            className="text-[14px] text-[#e5383b] font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Filter
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[16px] py-[16px]">
        {activeTab === 'vehicles' ? (
          // Vehicles List
          <div className="flex flex-col gap-[12px]">
            {mockStaffVehicles.map((vehicle, index) => (
              <VehicleCard
                key={index}
                plateNumber={vehicle.plateNumber}
                year={vehicle.year}
                make={vehicle.make}
                model={vehicle.model}
                specs={vehicle.specs}
                services={vehicle.services}
                additionalServices={vehicle.additionalServices}
              />
            ))}
          </div>
        ) : (
          // Jobs List
          <div className="flex flex-col gap-[12px]">
            {mockStaffJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
