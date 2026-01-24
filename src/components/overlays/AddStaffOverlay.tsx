'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface AddStaffOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (staffData: StaffFormData) => void;
}

export interface StaffFormData {
  name: string;
  role: string;
  jobCategories: string[];
  contactNumber: string;
  address: string;
  photo: string | null;
  permissions: StaffPermissions;
}

export interface StaffPermissions {
  vehicleApprovals: boolean;
  inquiryApprovals: boolean;
  generateEstimates: boolean;
  createJobCard: boolean;
  disputeApprovals: boolean;
  quoteApprovalsPayments: boolean;
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

// Camera Icon
const CameraIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron Down Icon
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#E5383B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Close/X Icon for tags
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Job categories data
const jobCategories = [
  { id: 'all', name: 'All Services', icon: '/assets/images/categories/all-services.png' },
  { id: 'engine', name: 'Engine', icon: '/assets/images/categories/engine.png' },
  { id: 'brake', name: 'Brake System', icon: '/assets/images/categories/brake.png' },
  { id: 'denting', name: 'Denting/Painting', icon: '/assets/images/categories/denting.png' },
  { id: 'ac', name: 'AC', icon: '/assets/images/categories/ac.png' },
  { id: 'electrical', name: 'Electrical', icon: '/assets/images/categories/electrical.png' },
  { id: 'transmission', name: 'Transmission', icon: '/assets/images/categories/transmission.png' },
  { id: 'suspension', name: 'Suspension', icon: '/assets/images/categories/suspension.png' },
];

// Toggle Switch Component
const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  activeColor = '#e5383b' 
}: { 
  enabled: boolean; 
  onChange: (value: boolean) => void;
  activeColor?: string;
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-[52px] h-[28px] rounded-full transition-colors ${
      enabled ? '' : 'bg-[#e5e5e5]'
    }`}
    style={{ backgroundColor: enabled ? activeColor : undefined }}
  >
    <div
      className={`absolute top-[2px] w-[24px] h-[24px] bg-white rounded-full shadow transition-transform ${
        enabled ? 'translate-x-[26px]' : 'translate-x-[2px]'
      }`}
    />
  </button>
);

export default function AddStaffOverlay({
  isOpen,
  onClose,
  onSubmit,
}: AddStaffOverlayProps) {
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
  // UI state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  
  // File input ref for photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Permissions state
  const [permissions, setPermissions] = useState<StaffPermissions>({
    vehicleApprovals: false,
    inquiryApprovals: false,
    generateEstimates: false,
    createJobCard: false,
    disputeApprovals: false,
    quoteApprovalsPayments: false,
  });

  // Check if form is valid
  const isFormValid = name.trim() !== '' && role.trim() !== '';

  // Reset form when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setRole('');
      setSelectedCategories([]);
      setContactNumber('');
      setAddress('');
      setPhoto(null);
      setShowCategoryDropdown(false);
      setShowPermissions(false);
      setPermissions({
        vehicleApprovals: false,
        inquiryApprovals: false,
        generateEstimates: false,
        createJobCard: false,
        disputeApprovals: false,
        quoteApprovalsPayments: false,
      });
    }
  }, [isOpen]);

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      if (selectedCategories.includes('all')) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['all']);
      }
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.filter(c => c !== 'all');
        if (newCategories.includes(categoryId)) {
          return newCategories.filter(c => c !== categoryId);
        } else {
          return [...newCategories, categoryId];
        }
      });
    }
  };

  // Remove category tag
  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== categoryId));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid) return;

    const staffData: StaffFormData = {
      name,
      role,
      jobCategories: selectedCategories,
      contactNumber,
      address,
      photo,
      permissions,
    };

    onSubmit?.(staffData);
    onClose();
  };

  // Update permission
  const updatePermission = (key: keyof StaffPermissions, value: boolean) => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  // Permissions View
  if (showPermissions) {
    return (
      <div className="fixed inset-0 z-[51] flex items-end justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowPermissions(false)}
        />

        {/* Bottom Sheet */}
        <div
          className="relative w-full max-w-[500px] bg-white rounded-t-[16px] max-h-[90vh] overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 -4px 19.2px rgba(229, 56, 59, 0.2)',
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-[12px] pb-[8px]">
            <div className="w-[172px] h-[4px] bg-[#d9d9d9] rounded-[23px]" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-[16px] px-[16px] pb-[20px]">
            <button onClick={() => setShowPermissions(false)} className="shrink-0">
              <BackArrowIcon />
            </button>
            <h2
              className="font-semibold text-[24px] text-black flex-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Permissions
            </h2>
          </div>

          {/* Permissions List */}
          <div className="flex-1 overflow-y-auto px-[16px] pb-[40px]">
            <div className="flex flex-col gap-[24px]">
              {/* Vehicle Approvals */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.vehicleApprovals ? 'text-[#e5383b] font-medium' : 'text-[#333]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Vehicle Approvals
                </span>
                <ToggleSwitch
                  enabled={permissions.vehicleApprovals}
                  onChange={(value) => updatePermission('vehicleApprovals', value)}
                />
              </div>

              {/* Inquiry Approvals */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.inquiryApprovals ? 'text-[#e5383b] font-medium' : 'text-[#333]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Inquiry Approvals
                </span>
                <ToggleSwitch
                  enabled={permissions.inquiryApprovals}
                  onChange={(value) => updatePermission('inquiryApprovals', value)}
                />
              </div>

              {/* Generate Estimates */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.generateEstimates ? 'text-[#e5383b] font-medium' : 'text-[#828282]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Generate Estimates
                </span>
                <ToggleSwitch
                  enabled={permissions.generateEstimates}
                  onChange={(value) => updatePermission('generateEstimates', value)}
                />
              </div>

              {/* Create Job Card */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.createJobCard ? 'text-[#e5383b] font-medium' : 'text-[#333]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Create Job Card
                </span>
                <ToggleSwitch
                  enabled={permissions.createJobCard}
                  onChange={(value) => updatePermission('createJobCard', value)}
                />
              </div>

              {/* Dispute Approvals */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.disputeApprovals ? 'text-[#e5383b] font-medium' : 'text-[#828282]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Dispute Approvals
                </span>
                <ToggleSwitch
                  enabled={permissions.disputeApprovals}
                  onChange={(value) => updatePermission('disputeApprovals', value)}
                />
              </div>

              {/* Quote Approvals/Payments */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] ${permissions.quoteApprovalsPayments ? 'text-[#e5383b] font-medium' : 'text-[#828282]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Quote Approvals/Payments
                </span>
                <ToggleSwitch
                  enabled={permissions.quoteApprovalsPayments}
                  onChange={(value) => updatePermission('quoteApprovalsPayments', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Add Staff Form
  return (
    <div className="fixed inset-0 z-[51] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[500px] bg-white rounded-t-[16px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 -4px 19.2px rgba(229, 56, 59, 0.2)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[172px] h-[4px] bg-[#d9d9d9] rounded-[23px]" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-[16px] px-[16px] pb-[20px]">
          <button onClick={onClose} className="shrink-0">
            <BackArrowIcon />
          </button>
          <h2
            className="font-semibold text-[24px] text-black flex-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Add Staff
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[24px]">
          {/* Photo Upload Section */}
          <div 
            className="relative w-full h-[180px] bg-[#f5f5f5] rounded-[12px] mb-[24px] overflow-hidden cursor-pointer"
            onClick={triggerPhotoUpload}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            {photo ? (
              <Image
                src={photo}
                alt="Staff photo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[48px] h-[48px] flex items-center justify-center">
                  <CameraIcon />
                </div>
              </div>
            )}
            {/* Camera button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerPhotoUpload();
              }}
              className="absolute bottom-[12px] right-[12px] w-[36px] h-[36px] bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-[16px]">
            {/* Name Input */}
            <div className="relative">
              {name && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Name
                </label>
              )}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className={`w-full border rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black placeholder:text-[#828282] transition-colors ${
                  name ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Role Input */}
            <div className="relative">
              {role && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Role
                </label>
              )}
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                className={`w-full border rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black placeholder:text-[#828282] transition-colors ${
                  role ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Job Category Dropdown */}
            <div className="relative">
              {selectedCategories.length > 0 && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Job Category
                </label>
              )}
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                  selectedCategories.length > 0 ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
              >
                <div className="flex flex-wrap gap-[8px] flex-1">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(catId => {
                      const category = jobCategories.find(c => c.id === catId);
                      return (
                        <span
                          key={catId}
                          className="flex items-center gap-[4px] bg-[#f5f5f5] rounded-[4px] px-[8px] py-[4px] text-[13px] text-black"
                        >
                          {category?.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCategory(catId);
                            }}
                          >
                            <CloseIcon />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[15px] text-[#828282]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Job Category
                    </span>
                  )}
                </div>
                <ChevronDownIcon className={showCategoryDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              {/* Category Grid Dropdown */}
              {showCategoryDropdown && (
                <div className="mt-[8px] border border-[#d3d3d3] rounded-[8px] p-[12px] bg-white shadow-lg">
                  <div className="grid grid-cols-3 gap-[8px]">
                    {jobCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex flex-col items-center p-[12px] rounded-[8px] transition-colors ${
                          selectedCategories.includes(category.id)
                            ? 'bg-[#fff5f5] border-2 border-[#e5383b]'
                            : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
                        }`}
                      >
                        <div className="w-[40px] h-[40px] relative mb-[8px]">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#333] text-center">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Number Input */}
            <div className="relative">
              {contactNumber && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Contact Number
                </label>
              )}
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Contact Number"
                className={`w-full border rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black placeholder:text-[#828282] transition-colors ${
                  contactNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Address Input */}
            <div className="relative">
              {address && (
                <label
                  className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Address
                </label>
              )}
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className={`w-full border rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black placeholder:text-[#828282] transition-colors ${
                  address ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-[24px] flex flex-col gap-[12px]">
            {/* Add Staff Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full h-[56px] rounded-[8px] flex items-center justify-center transition-colors ${
                isFormValid
                  ? 'bg-[#e5383b] hover:bg-[#c82d30]'
                  : 'bg-[#d3d3d3] cursor-not-allowed'
              }`}
            >
              <span
                className="text-white font-medium text-[15px] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ADD STAFF
              </span>
            </button>

            {/* Manage Permissions Link */}
            <button
              onClick={() => setShowPermissions(true)}
              className="w-full py-[12px]"
            >
              <span
                className="text-[#e5383b] font-medium text-[15px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                MANAGE PERMISSIONS
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
