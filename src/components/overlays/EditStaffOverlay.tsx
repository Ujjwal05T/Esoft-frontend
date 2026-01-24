'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface EditStaffOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (staffData: EditStaffFormData) => void;
  onToggleActive?: (staffId: string, isActive: boolean) => void;
  onDelete?: (staffId: string) => void;
  staffData: EditStaffFormData | null;
}

export interface EditStaffFormData {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  aadhaarNumber: string;
  role: string;
  photo: string | null;
  isActive: boolean;
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Trash Icon for confirmation dialog
const TrashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#e5383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

export default function EditStaffOverlay({
  isOpen,
  onClose,
  onUpdate,
  onToggleActive,
  onDelete,
  staffData,
}: EditStaffOverlayProps) {
  // Form state
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Permissions state
  const [permissions, setPermissions] = useState<StaffPermissions>({
    vehicleApprovals: false,
    inquiryApprovals: false,
    generateEstimates: false,
    createJobCard: false,
    disputeApprovals: false,
    quoteApprovalsPayments: false,
  });

  // UI state
  const [showPermissions, setShowPermissions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'inactive' | 'active' | 'delete'>('inactive');
  
  // File input ref for photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with staff data
  useEffect(() => {
    if (isOpen && staffData) {
      setName(staffData.name);
      setContactNumber(staffData.contactNumber);
      setAddress(staffData.address);
      setAadhaarNumber(staffData.aadhaarNumber);
      setRole(staffData.role);
      setPhoto(staffData.photo);
      setIsActive(staffData.isActive);
      setPermissions(staffData.permissions);
    }
  }, [isOpen, staffData]);

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setShowPermissions(false);
      setShowConfirmDialog(false);
    }
  }, [isOpen]);

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
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

  // Check if form has changes
  const hasChanges = staffData && (
    name !== staffData.name ||
    contactNumber !== staffData.contactNumber ||
    address !== staffData.address ||
    aadhaarNumber !== staffData.aadhaarNumber ||
    role !== staffData.role ||
    photo !== staffData.photo
  );

  // Handle update
  const handleUpdate = () => {
    if (!staffData) return;

    const updatedData: EditStaffFormData = {
      ...staffData,
      name,
      contactNumber,
      address,
      aadhaarNumber,
      role,
      photo,
      isActive,
      permissions,
    };

    onUpdate?.(updatedData);
    onClose();
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    if (!staffData) return;

    if (confirmAction === 'delete') {
      onDelete?.(staffData.id);
    } else {
      onToggleActive?.(staffData.id, confirmAction === 'active');
    }
    setShowConfirmDialog(false);
    onClose();
  };

  // Update permission
  const updatePermission = (key: keyof StaffPermissions, value: boolean) => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen || !staffData) return null;

  // Confirmation Dialog
  if (showConfirmDialog) {
    return (
      <div className="fixed inset-0 z-[52] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowConfirmDialog(false)}
        />

        {/* Dialog */}
        <div className="relative bg-white rounded-[16px] p-[24px] mx-[24px] max-w-[360px] w-full shadow-xl border-2 border-[#e5383b]">
          {/* Icon */}
          <div className="flex justify-center mb-[16px]">
            <div className="w-[56px] h-[56px] bg-[#fff5f5] rounded-full flex items-center justify-center">
              <TrashIcon />
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-center font-bold text-[18px] text-black mb-[8px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {confirmAction === 'delete' ? 'DELETE STAFF' : confirmAction === 'inactive' ? 'MARK AS INACTIVE' : 'MARK AS ACTIVE'}
          </h3>

          {/* Message */}
          <p
            className="text-center text-[14px] text-[#666] mb-[24px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {confirmAction === 'delete' 
              ? `Are you sure you want to delete ${name}?`
              : `Are you sure you want to mark ${name} ${confirmAction === 'inactive' ? 'Inactive' : 'Active'}?`
            }
          </p>

          {/* Buttons */}
          <div className="flex gap-[12px]">
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 h-[48px] border border-[#d3d3d3] rounded-[8px] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
            >
              <span
                className="text-[#333] font-medium text-[15px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cancel
              </span>
            </button>
            <button
              onClick={handleConfirmAction}
              className="flex-1 h-[48px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
            >
              <span
                className="text-white font-medium text-[15px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Yes
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  // Main Edit Staff Form
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
            Staff Details
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
              <div className="absolute inset-0 flex items-center justify-center bg-[#e5e5e5]">
                <span className="text-[48px] font-semibold text-[#999]">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
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
              <CameraIcon />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-[16px]">
            {/* Name Input */}
            <div className="relative">
              <label
                className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black focus:border-[#e5383b] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Contact Number Input */}
            <div className="relative">
              <label
                className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black focus:border-[#e5383b] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Address Input */}
            <div className="relative">
              <label
                className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black focus:border-[#e5383b] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Aadhaar Number Input */}
            <div className="relative">
              <label
                className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                className="w-full border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black focus:border-[#e5383b] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Role Input */}
            <div className="relative">
              <label
                className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px] outline-none text-[15px] text-black focus:border-[#e5383b] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-[24px] flex flex-col gap-[12px]">
            {/* Update Details Button */}
            <button
              onClick={handleUpdate}
              disabled={!hasChanges}
              className={`w-full h-[56px] rounded-[8px] flex items-center justify-center transition-colors ${
                hasChanges
                  ? 'bg-[#e5383b] hover:bg-[#c82d30]'
                  : 'bg-[#d3d3d3] cursor-not-allowed'
              }`}
            >
              <span
                className="text-white font-medium text-[15px] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                UPDATE DETAILS
              </span>
            </button>

            {/* Mark as Active/Inactive Button */}
            <button
              onClick={() => {
                setConfirmAction(isActive ? 'inactive' : 'active');
                setShowConfirmDialog(true);
              }}
              className="w-full h-[48px] border border-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors"
            >
              <span
                className="text-[#e5383b] font-medium text-[15px] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isActive ? 'MARK AS INACTIVE' : 'MARK AS ACTIVE'}
              </span>
            </button>

            {/* Delete Staff Button - only for inactive staff */}
            {!isActive && (
              <button
                onClick={() => {
                  setConfirmAction('delete');
                  setShowConfirmDialog(true);
                }}
                className="w-full h-[48px] border border-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#fff5f5] transition-colors"
              >
                <span
                  className="text-[#e5383b] font-medium text-[15px] uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  DELETE STAFF
                </span>
              </button>
            )}

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
