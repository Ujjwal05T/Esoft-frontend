'use client';

import React, { useState, useEffect } from 'react';
import CameraScannerOverlay from './CameraScannerOverlay';
import VehicleCard from '@/components/dashboard/VehicleCard';
import Image from 'next/image';
import { createVehicle, gateInVehicle, type CreateVehicleData, type VehicleResponse } from '@/services/api';


interface AddVehicleOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest?: (data: VehicleRequestFormData) => void;
  onScanNumber?: () => void;
  onScanRCCard?: () => void;
  onAddManually?: () => void;
}

export interface VehicleRequestFormData {
  plateNumber: string;
  ownerName: string;
  contactNumber: string;
  odometerReading: string;
  observations: string;
  audioBlob?: Blob;
  // Manual entry fields
  brand?: string;
  model?: string;
  year?: string;
  variant?: string;
  chassisNumber?: string;
}

// Mock vehicle data (in real app, this would come from API based on plate number)
interface VehicleData {
  plateNumber: string;
  year: number;
  make: string;
  model: string;
  specs: string;
}

// Mock data for dropdowns
const brandOptions = [
  { id: '1', name: 'Toyota' },
  { id: '2', name: 'Honda' },
  { id: '3', name: 'Hyundai' },
  { id: '4', name: 'Maruti Suzuki' },
  { id: '5', name: 'Tata' },
  { id: '6', name: 'Mahindra' },
  { id: '7', name: 'Kia' },
];

const modelOptions: Record<string, { id: string; name: string }[]> = {
  'Toyota': [
    { id: '1', name: 'Innova' },
    { id: '2', name: 'Innova Crysta' },
    { id: '3', name: 'Fortuner' },
    { id: '4', name: 'Glanza' },
  ],
  'Honda': [
    { id: '1', name: 'City' },
    { id: '2', name: 'Amaze' },
    { id: '3', name: 'Elevate' },
  ],
  'Hyundai': [
    { id: '1', name: 'Creta' },
    { id: '2', name: 'Venue' },
    { id: '3', name: 'i20' },
  ],
  'Maruti Suzuki': [
    { id: '1', name: 'Swift' },
    { id: '2', name: 'Baleno' },
    { id: '3', name: 'Brezza' },
  ],
  'Tata': [
    { id: '1', name: 'Nexon' },
    { id: '2', name: 'Punch' },
    { id: '3', name: 'Harrier' },
  ],
  'Mahindra': [
    { id: '1', name: 'XUV500' },
    { id: '2', name: 'Thar' },
    { id: '3', name: 'Scorpio' },
  ],
  'Kia': [
    { id: '1', name: 'Seltos' },
    { id: '2', name: 'Sonet' },
    { id: '3', name: 'Carens' },
  ],
};

const yearOptions = Array.from({ length: 15 }, (_, i) => ({
  id: String(2024 - i),
  name: String(2024 - i),
}));

const variantOptions = [
  { id: '1', name: 'Crysta CX' },
  { id: '2', name: 'Crysta VX' },
  { id: '3', name: 'Crysta ZX' },
  { id: '4', name: 'Base' },
  { id: '5', name: 'Mid' },
  { id: '6', name: 'Top' },
];

// Arrow Right Icon
const ArrowRightIcon = ({ color = '#828282' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Back Arrow Icon
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// QR Scan Icon
const QRScanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="7" y="7" width="4" height="4" rx="1" fill="white" />
    <rect x="13" y="7" width="4" height="4" rx="1" fill="white" />
    <rect x="7" y="13" width="4" height="4" rx="1" fill="white" />
    <path d="M13 13H17V17H15V15H13V13Z" fill="white" />
  </svg>
);

// Diagonal Arrow Icon (for card buttons)
const DiagonalArrowIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="none" />
    <path
      d="M11 21L21 11M21 11H13M21 11V19"
      stroke="white"
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
      d="M7 10L12 15L17 10"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Microphone Icon
const MicrophoneIcon = ({ color = '#E5383B' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 12.5C11.38 12.5 12.5 11.38 12.5 10V5C12.5 3.62 11.38 2.5 10 2.5C8.62 2.5 7.5 3.62 7.5 5V10C7.5 11.38 8.62 12.5 10 12.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.167 8.333V10C4.167 13.222 6.778 15.833 10 15.833C13.222 15.833 15.833 13.222 15.833 10V8.333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 15.833V17.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AddVehicleOverlay({
  isOpen,
  onClose,
  onSubmitRequest,
  onScanNumber,
  onScanRCCard,
  onAddManually,
}: AddVehicleOverlayProps) {
  // View state: 'search' | 'manual' | 'form' | 'gatein' | 'success'
  const [currentView, setCurrentView] = useState<'search' | 'manual' | 'form' | 'gatein' | 'success'>('search');
  
  // Search view state
  const [plateNumber, setPlateNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'plate' | 'rc'>('plate');
  const [isScanning, setIsScanning] = useState(false);
  
  // Manual entry view state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [hasAttemptedManualSubmit, setHasAttemptedManualSubmit] = useState(false);
  
  // Form view state (owner details) - Updated per Figma design
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [registrationName, setRegistrationName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [isGstVerified, setIsGstVerified] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Gate In view state
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [gateInDateTime, setGateInDateTime] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [fuelLevel, setFuelLevel] = useState(0); // 0-100 percentage
  const [problemShared, setProblemShared] = useState('');
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [hasAttemptedGateIn, setHasAttemptedGateIn] = useState(false);

  // API integration state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [createdVehicleId, setCreatedVehicleId] = useState<number | null>(null);

  // Get available models based on selected brand
  const availableModels = selectedBrand ? (modelOptions[selectedBrand] || []) : [];

  // Mock function to fetch vehicle data (in real app, this would be an API call)
  const fetchVehicleData = (plate: string): VehicleData => {
    return {
      plateNumber: plate,
      year: 2018,
      make: 'Toyota',
      model: 'Crysta',
      specs: '2.4L ZX MT/Diesel',
    };
  };

  const handleSubmitPlateNumber = () => {
    if (plateNumber.trim()) {
      const data = fetchVehicleData(plateNumber.trim());
      setVehicleData(data);
      setCurrentView('form');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitPlateNumber();
    }
  };

  const handleScanNumber = () => {
    setScanMode('plate');
    setShowCameraScanner(true);
    onScanNumber?.();
  };

  const handleScanRCCard = () => {
    setScanMode('rc');
    setShowCameraScanner(true);
    onScanRCCard?.();
  };

  const handleCameraCapture = (imageSrc: string) => {
    console.log(`Captured ${scanMode} image, using dummy data...`);
    setShowCameraScanner(false);
    
    // Simulate scanning delay with dummy data
    setIsScanning(true);
    
    setTimeout(() => {
      // Use static dummy data for scanned result
      const dummyPlateNumber = 'MP 09 GL 5656';
      setPlateNumber(dummyPlateNumber);
      
      // If RC card scan, also fill in other dummy details
      if (scanMode === 'rc') {
        setSelectedBrand('Toyota');
        setSelectedModel('Innova Crysta');
        setSelectedYear('2018');
        setSelectedVariant('Crysta ZX');
        setChassisNumber('MHFAB1234567890');
        setOwnerName('John Doe');
      }
      
      // Create vehicle data and go to form
      const data: VehicleData = {
        plateNumber: dummyPlateNumber,
        year: 2018,
        make: 'Toyota',
        model: 'Crysta',
        specs: '2.4L ZX MT/Diesel',
      };
      setVehicleData(data);
      setCurrentView('form');
      setIsScanning(false);
    }, 1500); // Simulate 1.5s processing delay
  };

  const handleAddManually = () => {
    setCurrentView('manual');
    onAddManually?.();
  };

  const handleManualNext = () => {
    setHasAttemptedManualSubmit(true);
    
    // Validate required fields
    if (!selectedBrand || !selectedModel || !selectedYear || !vehicleNumber.trim()) {
      return;
    }
    
    // Create vehicle data from manual entry
    const data: VehicleData = {
      plateNumber: vehicleNumber.trim(),
      year: parseInt(selectedYear),
      make: selectedBrand,
      model: selectedModel,
      specs: selectedVariant || 'Standard',
    };
    setVehicleData(data);
    setCurrentView('form');
  };

  const handleBack = () => {
    if (currentView === 'gatein') {
      // Go back to form view
      setCurrentView('form');
      // Reset Gate In form
      setDriverName('');
      setDriverContact('');
      setGateInDateTime('');
      setOdometerReading('');
      setFuelLevel(0);
      setProblemShared('');
      setVehicleImages([]);
      setHasAttemptedGateIn(false);
    } else if (currentView === 'form') {
      // Go back to manual if we came from there, otherwise search
      if (selectedBrand && selectedModel) {
        setCurrentView('manual');
      } else {
        setCurrentView('search');
      }
      setVehicleData(null);
      setRegistrationName('');
      setOwnerName('');
      setContactNumber('');
      setEmail('');
      setGstNumber('');
      setIsGstVerified(false);
      setInsuranceProvider('');
      setHasAttemptedSubmit(false);
    } else if (currentView === 'manual') {
      setCurrentView('search');
      // Reset manual form
      setSelectedBrand('');
      setSelectedModel('');
      setSelectedYear('');
      setSelectedVariant('');
      setVehicleNumber('');
      setChassisNumber('');
      setHasAttemptedManualSubmit(false);
    } else {
      onClose();
    }
  };

  const handleEditPlateNumber = () => {
    setCurrentView('search');
    setVehicleData(null);
    // Reset manual form if needed
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedVariant('');
    setVehicleNumber('');
    setChassisNumber('');
  };

  const closeAllDropdowns = () => {
    setShowBrandDropdown(false);
    setShowModelDropdown(false);
    setShowYearDropdown(false);
    setShowVariantDropdown(false);
    setShowInsuranceDropdown(false);
  };

  const handleVerifyGst = () => {
    // In a real app, this would call an API to verify the GST number
    if (gstNumber.trim()) {
      setIsGstVerified(true);
    }
  };

  const handleSendRequest = async () => {
    setHasAttemptedSubmit(true);
    setApiError(null);

    // Validate required fields
    if (!registrationName.trim() || !ownerName.trim() || !contactNumber.trim()) {
      return;
    }

    if (!vehicleData) {
      return;
    }

    setIsLoading(true);

    try {
      // Create vehicle via API
      const vehiclePayload: CreateVehicleData = {
        plateNumber: vehicleData.plateNumber,
        brand: selectedBrand || vehicleData.make || undefined,
        model: selectedModel || vehicleData.model || undefined,
        year: selectedYear ? parseInt(selectedYear) : vehicleData.year || undefined,
        variant: selectedVariant || undefined,
        chassisNumber: chassisNumber || undefined,
        specs: vehicleData.specs || undefined,
        registrationName: registrationName,
        ownerName: ownerName,
        contactNumber: contactNumber,
        email: email || undefined,
        gstNumber: gstNumber || undefined,
        insuranceProvider: insuranceProvider || undefined,
      };

      const result = await createVehicle(vehiclePayload);

      if (!result.success) {
        setApiError(result.error || 'Failed to create vehicle');
        setIsLoading(false);
        return;
      }

      // Store created vehicle ID for gate in
      setCreatedVehicleId(result.data!.id);

      // Call the parent callback if provided
      if (onSubmitRequest) {
        onSubmitRequest({
          plateNumber: vehicleData.plateNumber,
          ownerName,
          contactNumber,
          odometerReading: '',
          observations: '',
          brand: selectedBrand || undefined,
          model: selectedModel || undefined,
          year: selectedYear || undefined,
          variant: selectedVariant || undefined,
          chassisNumber: chassisNumber || undefined,
        });
      }
      
      // Navigate to Gate In view (next step)
      setCurrentView('gatein');
      // Pre-fill driver contact with owner's contact number
      setDriverContact(contactNumber);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGateIn = async () => {
    setHasAttemptedGateIn(true);
    setApiError(null);

    // Validate required fields for Gate In
    if (!driverName.trim() || !driverContact.trim()) {
      return;
    }

    if (!createdVehicleId) {
      setApiError('Vehicle not created. Please go back and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Gate In API
      const gateInResult = await gateInVehicle({
        vehicleId: createdVehicleId,
        gateInDateTime: gateInDateTime || new Date().toISOString(),
        gateInDriverName: driverName,
        gateInDriverContact: driverContact,
        gateInOdometerReading: odometerReading || undefined,
        gateInFuelLevel: fuelLevel > 0 ? fuelLevel : undefined,
        gateInProblemShared: problemShared || undefined,
      });

      if (!gateInResult.success) {
        setApiError(gateInResult.error || 'Failed to gate in vehicle');
        setIsLoading(false);
        return;
      }

      // Show success view
      setCurrentView('success');
    } catch (error) {
      console.error('Error during gate in:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto close after success
  useEffect(() => {
    if (currentView === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentView, onClose]);

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('search');
      setPlateNumber('');
      setShowCameraScanner(false);
      setVehicleData(null);
      setRegistrationName('');
      setOwnerName('');
      setContactNumber('');
      setEmail('');
      setGstNumber('');
      setIsGstVerified(false);
      setInsuranceProvider('');
      setHasAttemptedSubmit(false);
      // Reset manual form
      setSelectedBrand('');
      setSelectedModel('');
      setSelectedYear('');
      setSelectedVariant('');
      setVehicleNumber('');
      setChassisNumber('');
      setHasAttemptedManualSubmit(false);
      // Reset Gate In form
      setDriverName('');
      setDriverContact('');
      setGateInDateTime('');
      setOdometerReading('');
      setFuelLevel(0);
      setProblemShared('');
      setVehicleImages([]);
      setHasAttemptedGateIn(false);
      closeAllDropdowns();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[51] flex items-end justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div
          className="relative w-full max-w-[500px] bg-white rounded-t-[16px] max-h-[90vh] overflow-y-auto"
          style={{
            boxShadow: '0 -4px 19.2px rgba(229, 56, 59, 0.2)',
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-[12px] pb-[8px]">
            <div className="w-[172px] h-[4px] bg-[#d9d9d9] rounded-[23px]" />
          </div>

          {currentView === 'search' ? (
            /* ========== SEARCH VIEW ========== */
            <div className="px-[18px] pb-[32px]">
              {/* Title */}
              <h2
                className="font-black text-[32px] text-[rgba(0,0,0,0.25)] mb-[31px] leading-[36px] tracking-[-1.28px] pt-[20px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Add by Car Number<br />Plate
              </h2>

              {/* Plate Number Input Row */}
              <div className="flex gap-[10px] mb-[31px]">
                <div
                  className={`flex-1 min-w-0 flex items-center border rounded-[10px] px-[10px] py-[12px] transition-colors bg-[#f5f3f4] ${
                    isFocused || plateNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                  }`}
                >
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={handleKeyPress}
                    placeholder="MP 09 GL 5656"
                    className={`flex-1 min-w-0 outline-none font-bold text-[16px] bg-transparent placeholder:text-[#c4c4c4] ${
                      plateNumber ? 'text-[#e5383b]' : 'text-black'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    onClick={handleSubmitPlateNumber}
                    className={`w-[32px] h-[32px] ${plateNumber ? 'bg-[#e5383b]' : 'bg-[#828282]'} text-white rounded-full flex items-center justify-center hover:opacity-90 transition-colors ml-[8px] shrink-0`}
                  >
                    <ArrowRightIcon color="#ffffff" />
                  </button>
                </div>

                <button
                  onClick={handleScanNumber}
                  className="flex items-center justify-center gap-[4px] sm:gap-[6px] bg-[#e5383b] text-white px-[8px] sm:px-[12px] py-[10px] rounded-[10px] hover:bg-[#c82d30] transition-colors shrink-0"
                >
                  <QRScanIcon />
                  <span
                    className="font-normal text-[14px] sm:text-[17px] whitespace-nowrap hidden sm:inline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Scan Number
                  </span>
                </button>
              </div>

              {/* Scan RC Card Option */}
              <button
                onClick={handleScanRCCard}
                className="w-full bg-[#e5383b] rounded-[13px] p-[20px] flex items-end justify-between min-h-[155px] hover:bg-[#d43235] transition-colors relative overflow-hidden mb-[31px]"
              >
                <div className="flex flex-col items-start z-10">
                  <h3
                    className="font-bold text-[28px] sm:text-[32px] text-white leading-[1.1] text-left mb-[16px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Scan RC<br />Card
                  </h3>
                  <DiagonalArrowIcon />
                </div>
                <div className="absolute -right-px top-[30px] w-[200px] h-[140px]">
                  <div className="absolute inset-0 flex items-center justify-center opacity-90">
                    <Image
                    src="/assets/images/rc-card.png"
                    alt="Scan RC Card"
                    width={280}
                    height={200}
                    />
                  </div>
                </div>
              </button>

              {/* Add Vehicle Manually Option */}
              <button
                onClick={handleAddManually}
                className="w-full bg-[#e5383b] rounded-[13px] p-[20px] flex items-end justify-between min-h-[155px] hover:bg-[#d43235] transition-colors relative overflow-hidden"
              >
                <div className="flex flex-col items-start z-10">
                  <h3
                    className="font-bold text-[28px] sm:text-[32px] text-white leading-[1.1] text-left mb-[16px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Add Vehicle<br />Manually
                  </h3>
                  <DiagonalArrowIcon />
                </div>
                <div className="absolute right-[-90px] -top-px w-[280px] h-[200px]">
                  <div className="absolute inset-0 flex items-center justify-center opacity-90">
                    <Image
                    src="/assets/images/car-suv.png"
                    alt="Add Vehicle Manually"
                    width={280}
                    height={200}
                    />
                  </div>
                </div>
              </button>
            </div>
          ) : currentView === 'manual' ? (
            /* ========== MANUAL ENTRY VIEW ========== */
            <div className="px-[20px] pb-[24px]">
              {/* Header */}
              <div className="flex items-center gap-[12px] pb-[16px]">
                <button onClick={handleBack} className="p-[4px]">
                  <BackArrowIcon />
                </button>
                <h2
                  className="font-bold text-[22px] text-black"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Add Vehicle Details
                </h2>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-[16px]">
                {/* Brand Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowBrandDropdown(!showBrandDropdown);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      hasAttemptedManualSubmit && !selectedBrand
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : selectedBrand
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {selectedBrand && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Brand
                      </label>
                    )}
                    <span
                      className={`text-[15px] ${selectedBrand ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedBrand || 'Brand'}
                    </span>
                    <ChevronDownIcon className={showBrandDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showBrandDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {brandOptions.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => {
                            setSelectedBrand(brand.name);
                            setSelectedModel(''); // Reset model when brand changes
                            setShowBrandDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span
                            className="text-[14px] text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {brand.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {hasAttemptedManualSubmit && !selectedBrand && (
                    <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Please select a brand
                    </p>
                  )}
                </div>

                {/* Model Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowModelDropdown(!showModelDropdown);
                    }}
                    disabled={!selectedBrand}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      hasAttemptedManualSubmit && !selectedModel
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : selectedModel
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    } ${!selectedBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {selectedModel && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Model
                      </label>
                    )}
                    <span
                      className={`text-[15px] ${selectedModel ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedModel || 'Model'}
                    </span>
                    <ChevronDownIcon className={showModelDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showModelDropdown && availableModels.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {availableModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.name);
                            setShowModelDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span
                            className="text-[14px] text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {model.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {hasAttemptedManualSubmit && !selectedModel && (
                    <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Please select a model
                    </p>
                  )}
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowYearDropdown(!showYearDropdown);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      hasAttemptedManualSubmit && !selectedYear
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : selectedYear
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {selectedYear && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Year
                      </label>
                    )}
                    <span
                      className={`text-[15px] ${selectedYear ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedYear || 'Year'}
                    </span>
                    <ChevronDownIcon className={showYearDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showYearDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {yearOptions.map((year) => (
                        <button
                          key={year.id}
                          onClick={() => {
                            setSelectedYear(year.name);
                            setShowYearDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span
                            className="text-[14px] text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {year.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {hasAttemptedManualSubmit && !selectedYear && (
                    <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Please select a year
                    </p>
                  )}
                </div>

                {/* Variant Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowVariantDropdown(!showVariantDropdown);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      selectedVariant ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {selectedVariant && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Variant
                      </label>
                    )}
                    <span
                      className={`text-[15px] ${selectedVariant ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedVariant || 'Select Variant'}
                    </span>
                    <ChevronDownIcon className={showVariantDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showVariantDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {variantOptions.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariant(variant.name);
                            setShowVariantDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span
                            className="text-[14px] text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {variant.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Number Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      hasAttemptedManualSubmit && !vehicleNumber.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : vehicleNumber
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {vehicleNumber && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Vehicle No
                      </label>
                    )}
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder={vehicleNumber ? '' : 'Vehicle Number'}
                      className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedManualSubmit && !vehicleNumber.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedManualSubmit && !vehicleNumber.trim() && (
                    <p className="text-[12px] text-[#e5383b] mt-[4px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Please enter vehicle number
                    </p>
                  )}
                </div>

                {/* Chassis Number Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      chassisNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {chassisNumber && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Chassis No
                      </label>
                    )}
                    <input
                      type="text"
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                      placeholder={chassisNumber ? '' : 'Chassis Number'}
                      className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleManualNext}
                  className={`w-full h-[52px] rounded-[8px] flex items-center justify-center transition-colors mt-[8px] ${
                    selectedBrand && selectedModel && selectedYear && vehicleNumber.trim()
                      ? 'bg-[#e5383b] hover:bg-[#c82d30]'
                      : 'bg-[#d3d3d3]'
                  }`}
                >
                  <span
                    className="text-white font-semibold text-[16px] uppercase tracking-[1px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Next
                  </span>
                </button>
              </div>
            </div>
          ) : /* ========== GATE IN VIEW ========== */
          currentView === 'gatein' ? (
            <div className="px-[16px] pb-[24px]">
              {/* Header */}
              <div className="flex items-center gap-[16px] pb-[24px]">
                <button onClick={handleBack} className="shrink-0">
                  <BackArrowIcon />
                </button>
                <h2
                  className="font-semibold text-[24px] text-black flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Gate In
                </h2>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-[16px]">
                {/* Driver's Name Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      hasAttemptedGateIn && !driverName.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : driverName
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {driverName && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Drivers Name
                      </label>
                    )}
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder={driverName ? '' : 'Drivers Name'}
                      className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedGateIn && !driverName.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedGateIn && !driverName.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter driver&apos;s name
                    </p>
                  )}
                </div>

                {/* Driver's Contact Number Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      hasAttemptedGateIn && !driverContact.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : driverContact
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {driverContact && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Drivers Contact Number
                      </label>
                    )}
                    <input
                      type="tel"
                      value={driverContact}
                      onChange={(e) => setDriverContact(e.target.value)}
                      placeholder={driverContact ? '' : 'Drivers Contact Number'}
                      className={`w-full outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedGateIn && !driverContact.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedGateIn && !driverContact.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter driver&apos;s contact number
                    </p>
                  )}
                </div>

                {/* Gate In Date and Time */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      gateInDateTime ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {gateInDateTime && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Gate In Date and time
                      </label>
                    )}
                    <input
                      type="text"
                      value={gateInDateTime || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                      onChange={(e) => setGateInDateTime(e.target.value)}
                      placeholder="Gate In Date and time"
                      className="flex-1 outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <ChevronDownIcon />
                  </div>
                </div>

                {/* Odometer Reading Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      odometerReading ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {odometerReading && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Odometer Reading
                      </label>
                    )}
                    <input
                      type="text"
                      value={odometerReading}
                      onChange={(e) => setOdometerReading(e.target.value)}
                      placeholder={odometerReading ? '' : 'Odometer Reading'}
                      className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Fuel Reading Gauge */}
                <div className="relative">
                  <div className="border border-[#d3d3d3] rounded-[8px] px-[12px] py-[20px]">
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Fuel Reading
                    </label>
                    <div className="flex items-center gap-0 relative">
                      {/* Orange fuel indicator - width based on fuel level */}
                      <div 
                        className="h-[53px] bg-[#ffad2a] rounded-[6.5px] transition-all duration-200"
                        style={{ width: `${Math.max(31, (fuelLevel / 100) * 318 + 31)}px` }}
                      />
                      {/* Black divider line */}
                      <div className="w-[6px] h-[33px] bg-black rounded-[6.5px] -ml-[2px]" />
                      {/* Gray remaining track */}
                      <div 
                        className="h-[53px] bg-[#f0f0f0] rounded-[6.5px] flex-1"
                        style={{ marginLeft: '-2px' }}
                      />
                      {/* Invisible slider overlay */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={fuelLevel}
                        onChange={(e) => setFuelLevel(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Problem Shared with Record Button */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[10px] transition-colors flex items-center justify-between ${
                      problemShared ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <input
                      type="text"
                      value={problemShared}
                      onChange={(e) => setProblemShared(e.target.value)}
                      placeholder="Problem Shared"
                      className="flex-1 outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      className="flex items-center gap-[6px] bg-white border border-[#e5383b] px-[12px] py-[6px] rounded-[6px] text-[#e5383b] hover:bg-[#fff5f5] transition-colors"
                    >
                      <MicrophoneIcon color="#e5383b" />
                      <span
                        className="text-[14px] font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Record
                      </span>
                    </button>
                  </div>
                </div>

                {/* Vehicle Images Upload */}
                <div className="flex gap-[12px] overflow-x-auto pb-[8px]">
                  {vehicleImages.map((img, index) => (
                    <div key={index} className="relative shrink-0 w-[100px] h-[80px] rounded-[8px] overflow-hidden">
                      <Image
                        src={img}
                        alt={`Vehicle ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setVehicleImages(vehicleImages.filter((_, i) => i !== index))}
                        className="absolute bottom-[4px] right-[4px] w-[24px] h-[24px] bg-[#e5383b] rounded-[4px] flex items-center justify-center"
                      >
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3.5H11M4.5 6V10.5M7.5 6V10.5M2 3.5L2.5 11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H8.5C9.05228 12.5 9.5 12.0523 9.5 11.5L10 3.5M4 3.5V2C4 1.44772 4.44772 1 5 1H7C7.55228 1 8 1.44772 8 2V3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  {/* Add Image Button */}
                  <button
                    onClick={() => {
                      // In a real app, this would open file picker
                      // For demo, we'll add a placeholder image
                      setVehicleImages([...vehicleImages, '/assets/images/car-suv.png']);
                    }}
                    className="shrink-0 w-[100px] h-[80px] border-2 border-dashed border-[#d3d3d3] rounded-[8px] flex items-center justify-center hover:border-[#e5383b] transition-colors"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8V24M8 16H24" stroke="#E5383B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Gate In Button */}
                <div className="pt-[16px] shadow-[0px_0px_30px_0px_white]">
                  <button
                    onClick={handleGateIn}
                    disabled={!driverName.trim() || !driverContact.trim()}
                    className={`w-full h-[56px] rounded-[8px] flex items-center justify-center transition-colors ${
                      driverName.trim() && driverContact.trim()
                        ? 'bg-[#e5383b] hover:bg-[#c82d30]'
                        : 'bg-[#c3c3c3] cursor-not-allowed'
                    }`}
                  >
                    <span
                      className="text-white font-normal text-[15px] uppercase tracking-[-0.01px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      GATE IN
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ):(
            /* ========== FORM VIEW (Owner Details) ========== */
            <div className="px-[16px] pb-[24px]">
              {/* Header */}
              <div className="flex items-center gap-[16px] pb-[24px]">
                <button onClick={handleBack} className="shrink-0">
                  <BackArrowIcon />
                </button>
                <h2
                  className="font-semibold text-[24px] text-black flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Add New Vehicle
                </h2>
              </div>

              {/* Vehicle Card */}
              {vehicleData && (
                <div className="mb-[24px]">
                  <VehicleCard
                    plateNumber={vehicleData.plateNumber}
                    year={vehicleData.year}
                    make={vehicleData.make}
                    model={vehicleData.model}
                    specs={vehicleData.specs}
                    variant="default"
                  />
                </div>
              )}

              {/* Form Fields */}
              <div className="flex flex-col gap-[16px]">
                {/* Registration Name Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      hasAttemptedSubmit && !registrationName.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : registrationName
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {registrationName && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Registration Name
                      </label>
                    )}
                    <input
                      type="text"
                      value={registrationName}
                      onChange={(e) => setRegistrationName(e.target.value)}
                      placeholder={registrationName ? '' : 'Registration Name'}
                      className={`flex-1 outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedSubmit && !registrationName.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedSubmit && !registrationName.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter registration name
                    </p>
                  )}
                </div>

                {/* Owner Name Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      hasAttemptedSubmit && !ownerName.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : ownerName
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {ownerName && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Owner Name
                      </label>
                    )}
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder={ownerName ? '' : 'Owner Name'}
                      className={`flex-1 outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedSubmit && !ownerName.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedSubmit && !ownerName.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter owner name
                    </p>
                  )}
                </div>

                {/* Contact Number Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      hasAttemptedSubmit && !contactNumber.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : contactNumber
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {contactNumber && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Contact Number
                      </label>
                    )}
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder={contactNumber ? '' : 'Contact Number'}
                      className={`flex-1 outline-none text-[15px] text-black placeholder:text-[#828282] ${
                        hasAttemptedSubmit && !contactNumber.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedSubmit && !contactNumber.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter contact number
                    </p>
                  )}
                </div>

                {/* Email Id Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      email ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {email && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Email Id
                      </label>
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={email ? '' : 'Email Id'}
                      className="flex-1 outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* GST NO. Input with Verify Button */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[10px] transition-colors flex items-center justify-between ${
                      gstNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {gstNumber && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        GST NO.
                      </label>
                    )}
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value.toUpperCase());
                        setIsGstVerified(false); // Reset verification when GST number changes
                      }}
                      placeholder={gstNumber ? '' : 'GST NO.'}
                      className="flex-1 outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    {isGstVerified ? (
                      <span
                        className="px-[16px] text-[14px] py-[3px] font-semibold text-[#e5383b]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        VERIFIED
                      </span>
                    ) : (
                      <button
                        onClick={handleVerifyGst}
                        className="bg-[#e5383b] text-white px-[20px] py-[3px] rounded-[6px] hover:bg-[#c82d30] transition-colors"
                      >
                        <span
                          className="text-[14px] font-medium "
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Verify
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Insurance Provider Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setShowInsuranceDropdown(!showInsuranceDropdown);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      insuranceProvider ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {insuranceProvider && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Insurance Provider
                      </label>
                    )}
                    <span
                      className={`text-[15px] ${insuranceProvider ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {insuranceProvider || 'Insurance Provider'}
                    </span>
                    <ChevronDownIcon className={showInsuranceDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showInsuranceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {['ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'New India Assurance', 'United India Insurance', 'National Insurance'].map((provider) => (
                        <button
                          key={provider}
                          onClick={() => {
                            setInsuranceProvider(provider);
                            setShowInsuranceDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span
                            className="text-[14px] text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {provider}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Proceed to Gate In Button */}
                <div className="pt-[16px] shadow-[0px_0px_30px_0px_white]">
                  <button
                    onClick={handleSendRequest}
                    disabled={!registrationName.trim() || !ownerName.trim() || !contactNumber.trim()}
                    className={`w-full h-[56px] rounded-[8px] flex items-center justify-center transition-colors ${
                      registrationName.trim() && ownerName.trim() && contactNumber.trim()
                        ? 'bg-[#e5383b] hover:bg-[#c82d30]'
                        : 'bg-[#c3c3c3] cursor-not-allowed'
                    }`}
                  >
                    <span
                      className="text-white font-normal text-[15px] uppercase tracking-[-0.01px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      PROCEED TO GATE IN
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {}

          {/* ========== SUCCESS VIEW (inside overlay) ========== */}
          {currentView === 'success' && (
            <div 
              className="absolute inset-0 bg-[#e5383b] rounded-t-[16px] flex items-center justify-center"
              style={{
                animation: 'successFadeIn 0.3s ease-out forwards',
              }}
            >
              {/* Checkmark Icon */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  className="mb-[24px] w-[61px] h-[61px] bg-white rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    animation: 'successBounce 0.5s ease-out 0.1s forwards',
                    opacity: 0,
                    transform: 'scale(0)',
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 16L14 22L24 10"
                      stroke="#e5383b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                
                {/* Message Text */}
                <p
                  className="text-white text-[20px] font-medium tracking-[1px] text-center"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    animation: 'successTextFade 0.3s ease-out 0.2s forwards',
                    opacity: 0,
                  }}
                >
                  REQUEST SENT
                </p>
              </div>
            </div>
          )}

          {/* CSS Keyframe Animations */}
          <style>{`
            @keyframes successFadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes successBounce {
              0% {
                opacity: 0;
                transform: scale(0);
              }
              60% {
                opacity: 1;
                transform: scale(1.1);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes successTextFade {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Camera Scanner Overlay */}
      <CameraScannerOverlay
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
    
