'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import AccordionSection from '@/components/ui/AccordionSection';

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

// Edit/Pencil Icon
const EditIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Floating Label Input Component
interface FloatingInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
  editable?: boolean;
}

const FloatingInput = ({ label, value, onChange, required, multiline, editable = false }: FloatingInputProps) => (
  <div className="relative">
    <label
      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {label}{required && '*'}
    </label>
    <div
      className={`border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] transition-colors ${
        value ? 'border-[#d3d3d3]' : 'border-[#d3d3d3]'
      }`}
    >
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!editable}
          className="w-full outline-none text-[15px] text-black resize-none min-h-[60px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!editable}
          className="w-full outline-none text-[15px] text-black"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      )}
    </div>
  </div>
);

// Mock profile data
const mockProfileData = {
  name: 'Shubham Jain',
  avatar: '/assets/images/profile-avatar.jpg',
  personalInfo: {
    ownerName: 'Shubham Jain',
    contactNumber: '9888001109',
  },
  workshopDetails: {
    workshopName: 'AutoCare Garage',
    gstNumber: '345675678665',
    tradeLicense: '1HFH7988DH',
    aadhaarNumber: '9337-8987-9898',
    address: '16-A Basant Vihar Colony, Near Satya Sai Square, Indore (M.P) - 452010, Indore, Madhya Pradesh 452010, India',
  },
};

export default function MyProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [workshopDetailsOpen, setWorkshopDetailsOpen] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState(mockProfileData);

  // Update personal info
  const updatePersonalInfo = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Update workshop details
  const updateWorkshopDetails = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      workshopDetails: {
        ...prev.workshopDetails,
        [field]: value,
      },
    }));
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
          <div className="sticky top-0 bg-white z-50 px-[16px] py-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[16px]">
              <button onClick={() => router.back()} className="shrink-0">
                <BackArrowIcon />
              </button>
              <h1
                className="text-[#e5383b] font-semibold text-[20px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                My Profile
              </h1>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="shrink-0"
            >
              <EditIcon />
            </button>
          </div>

          {/* Main Content */}
          <div className="px-[16px] pb-[120px]">
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center py-[32px]">
              <div className="relative w-[108px] h-[108px] rounded-full overflow-hidden bg-[#f5f5f5] mb-[12px]">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Fallback initials */}
                <div className="absolute inset-0 flex items-center justify-center text-[32px] font-semibold text-[#828282]">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <p
                className="text-[16px] font-medium text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {profileData.name}
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="flex flex-col gap-[16px]">
              {/* Personal Information */}
              <AccordionSection
                title="Personal information"
                isOpen={personalInfoOpen}
                onToggle={() => setPersonalInfoOpen(!personalInfoOpen)}
              >
                <FloatingInput
                  label="Owner Name"
                  value={profileData.personalInfo.ownerName}
                  onChange={(value) => updatePersonalInfo('ownerName', value)}
                  required
                  editable={isEditing}
                />
                <FloatingInput
                  label="Contact Number"
                  value={profileData.personalInfo.contactNumber}
                  onChange={(value) => updatePersonalInfo('contactNumber', value)}
                  required
                  editable={isEditing}
                />
              </AccordionSection>

              {/* Workshop Details */}
              <AccordionSection
                title="Workshop details"
                isOpen={workshopDetailsOpen}
                onToggle={() => setWorkshopDetailsOpen(!workshopDetailsOpen)}
              >
                <FloatingInput
                  label="Workshop Name"
                  value={profileData.workshopDetails.workshopName}
                  onChange={(value) => updateWorkshopDetails('workshopName', value)}
                  editable={isEditing}
                />
                <FloatingInput
                  label="GST Number"
                  value={profileData.workshopDetails.gstNumber}
                  onChange={(value) => updateWorkshopDetails('gstNumber', value)}
                  editable={isEditing}
                />
                <FloatingInput
                  label="Trade License"
                  value={profileData.workshopDetails.tradeLicense}
                  onChange={(value) => updateWorkshopDetails('tradeLicense', value)}
                  editable={isEditing}
                />
                <FloatingInput
                  label="Aadhaar Number"
                  value={profileData.workshopDetails.aadhaarNumber}
                  onChange={(value) => updateWorkshopDetails('aadhaarNumber', value)}
                  editable={isEditing}
                />
                <FloatingInput
                  label="Address"
                  value={profileData.workshopDetails.address}
                  onChange={(value) => updateWorkshopDetails('address', value)}
                  multiline
                  editable={isEditing}
                />
              </AccordionSection>

              {/* Support Button */}
              <button
                className="w-full h-[48px] border border-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors mt-[8px]"
              >
                <span
                  className="text-[#e5383b] font-normal text-[15px] uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  SUPPORT
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
