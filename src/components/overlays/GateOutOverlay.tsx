'use client';

import React, { useState, useEffect } from 'react';
import VehicleCard from '@/components/dashboard/VehicleCard';
import { gateOutVehicle, getActiveVehicleVisit } from '@/services/api';

interface GateOutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: GateOutData) => void;
  vehicleId?: number; // Vehicle ID to get active visit
  visitId?: number; // Direct visit ID if known
  vehicleData?: {
    plateNumber: string;
    year: number;
    make: string;
    model: string;
    specs: string;
    imageUrl?: string;
  };
}

interface GateOutData {
  driverName: string;
  driverContact: string;
  gateOutDateTime: string;
  odometerReading: string;
  fuelLevel: number;
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

export default function GateOutOverlay({
  isOpen,
  onClose,
  onComplete,
  vehicleId,
  visitId: propVisitId,
  vehicleData,
}: GateOutOverlayProps) {
  // Form state
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [gateOutDateTime, setGateOutDateTime] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [fuelLevel, setFuelLevel] = useState(0);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeVisitId, setActiveVisitId] = useState<number | null>(propVisitId || null);

  // Default vehicle data for demo
  const defaultVehicle = {
    plateNumber: 'MP 09 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    imageUrl: '/assets/images/car-suv.png',
  };

  const vehicle = vehicleData || defaultVehicle;

  // Reset form when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setDriverName('');
      setDriverContact('');
      setGateOutDateTime('');
      setOdometerReading('');
      setFuelLevel(0);
      setHasAttemptedSubmit(false);
      setShowSuccess(false);
      setApiError(null);
      setActiveVisitId(propVisitId || null);
    }
  }, [isOpen, propVisitId]);

  // Fetch active visit if vehicleId provided
  useEffect(() => {
    if (isOpen && vehicleId && !propVisitId) {
      const fetchActiveVisit = async () => {
        const result = await getActiveVehicleVisit(vehicleId);
        if (result.success && result.data) {
          setActiveVisitId(result.data.id);
          // Pre-fill driver info from gate in
          if (result.data.gateInDriverName) {
            setDriverName(result.data.gateInDriverName);
          }
          if (result.data.gateInDriverContact) {
            setDriverContact(result.data.gateInDriverContact);
          }
        }
      };
      fetchActiveVisit();
    }
  }, [isOpen, vehicleId, propVisitId]);

  // Handle complete action
  const handleComplete = async () => {
    setHasAttemptedSubmit(true);
    setApiError(null);

    if (!driverName.trim() || !driverContact.trim()) {
      return;
    }

    if (!activeVisitId) {
      setApiError('No active visit found for this vehicle.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Gate Out API
      const result = await gateOutVehicle(activeVisitId, {
        gateOutDriverName: driverName,
        gateOutDriverContact: driverContact,
        gateOutDateTime: gateOutDateTime || undefined,
        gateOutOdometerReading: odometerReading || undefined,
        gateOutFuelLevel: fuelLevel > 0 ? fuelLevel : undefined,
      });

      if (!result.success) {
        setApiError(result.error || 'Failed to complete gate out');
        setIsLoading(false);
        return;
      }

      if (onComplete) {
        onComplete({
          driverName,
          driverContact,
          gateOutDateTime: gateOutDateTime || new Date().toISOString(),
          odometerReading,
          fuelLevel,
        });
      }

      setShowSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error during gate out:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

          {showSuccess ? (
            /* ========== SUCCESS VIEW ========== */
            <div 
              className="absolute inset-0 bg-[#e5383b] rounded-t-[16px] flex items-center justify-center"
              style={{
                animation: 'successFadeIn 0.3s ease-out forwards',
              }}
            >
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
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="#e5383b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  className="text-white font-bold text-[20px] uppercase tracking-[2px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    animation: 'successTextFadeIn 0.3s ease-out 0.3s forwards',
                    opacity: 0,
                  }}
                >
                  GATE OUT COMPLETE
                </p>
              </div>
            </div>
          ) : (
            /* ========== GATE OUT FORM ========== */
            <div className="px-[16px] pb-[24px]">
              {/* Header */}
              <div className="flex items-center gap-[16px] pb-[24px]">
                <button onClick={onClose} className="shrink-0">
                  <BackArrowIcon />
                </button>
                <h2
                  className="font-semibold text-[24px] text-black flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Gate Out
                </h2>
              </div>

              {/* Vehicle Card */}
              <div className="mb-[24px]">
                <VehicleCard
                  plateNumber={vehicle.plateNumber}
                  year={vehicle.year}
                  make={vehicle.make}
                  model={vehicle.model}
                  specs={vehicle.specs}
                  variant="default"
                />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-[16px]">
                {/* Driver's Name Input */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      hasAttemptedSubmit && !driverName.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : driverName
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {driverName && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
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
                        hasAttemptedSubmit && !driverName.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedSubmit && !driverName.trim() && (
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
                      hasAttemptedSubmit && !driverContact.trim()
                        ? 'border-[#e5383b] bg-[#ffe0e0]'
                        : driverContact
                        ? 'border-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {driverContact && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
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
                        hasAttemptedSubmit && !driverContact.trim() ? 'bg-transparent' : ''
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {hasAttemptedSubmit && !driverContact.trim() && (
                    <p
                      className="text-[12px] text-[#e5383b] mt-[4px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Please enter driver&apos;s contact number
                    </p>
                  )}
                </div>

                {/* Gate Out Date and Time */}
                <div className="relative">
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors flex items-center justify-between ${
                      gateOutDateTime ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    {gateOutDateTime && (
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Gate Out Date and time
                      </label>
                    )}
                    <input
                      type="text"
                      value={gateOutDateTime || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                      onChange={(e) => setGateOutDateTime(e.target.value)}
                      placeholder="Gate Out Date and time"
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
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
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

                {/* Complete Button */}
                <div className="pt-[16px] shadow-[0px_0px_30px_0px_white]">
                  <button
                    onClick={handleComplete}
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
                      COMPLETE
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes successTextFadeIn {
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
    </>
  );
}
