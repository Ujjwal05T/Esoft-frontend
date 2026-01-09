'use client';

import React, { useState, useEffect } from 'react';
import VehicleCard from '../dashboard/VehicleCard';

interface VehicleInfo {
  plateNumber: string;
  year: number;
  make: string;
  model: string;
  specs: string;
  imageUrl?: string;
}

interface EstimationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewEstimate?: (data: EstimationData) => void;
  onGeneratePDF?: (data: EstimationData & { customerName: string; gstNumber: string }) => void;
  vehicleInfo?: VehicleInfo;
}

interface Part {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

interface Labour {
  id: string;
  name: string;
  rate: number;
}

interface Extra {
  id: string;
  description: string;
  rate: number;
}

export interface EstimationData {
  parts: Part[];
  labour: Labour[];
  extras: Extra[];
  partsTotal: number;
  labourTotal: number;
  extrasTotal: number;
  subTotal: number;
  discount: number;
  totalPayable: number;
}

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

// Chevron Icon
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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

// Delete/Trash Icon
const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 5H4.16667H17.5"
      stroke="#E5383B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66675 5V3.33333C6.66675 2.89131 6.84234 2.46738 7.15491 2.15482C7.46747 1.84226 7.89139 1.66667 8.33341 1.66667H11.6667C12.1088 1.66667 12.5327 1.84226 12.8453 2.15482C13.1578 2.46738 13.3334 2.89131 13.3334 3.33333V5M15.8334 5V16.6667C15.8334 17.1087 15.6578 17.5326 15.3453 17.8452C15.0327 18.1577 14.6088 18.3333 14.1667 18.3333H5.83341C5.39139 18.3333 4.96746 18.1577 4.6549 17.8452C4.34234 17.5326 4.16675 17.1087 4.16675 16.6667V5H15.8334Z"
      stroke="#E5383B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 3.33333V12.6667M3.33333 8H12.6667"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Minus Icon
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.33333 8H12.6667"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

 const vehicle =  {id: '1',
    plateNumber: 'MP O9 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    status: 'Active',
    type: 'active',}

export default function EstimationOverlay({
  isOpen,
  onClose,
  onReviewEstimate,
  onGeneratePDF,
  vehicleInfo,
}: EstimationOverlayProps) {
  // Current view state: 'estimate' | 'review' | 'pdf'
  const [currentView, setCurrentView] = useState<'estimate' | 'review' | 'pdf'>('estimate');
  
  // Section expansion state - all collapsed by default when they have data
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  const [isLabourOpen, setIsLabourOpen] = useState(false);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);

  // Review form state
  const [customerName, setCustomerName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [isGstVerified, setIsGstVerified] = useState(false);

  // Parts state - pre-populated with sample data
  const [parts, setParts] = useState<Part[]>([
    { id: '1', name: 'Bosch Oil Filter', quantity: 1, rate: 350 },
    { id: '2', name: 'TVS Lucas Oil Strainer', quantity: 2, rate: 700 },
    { id: '3', name: 'Rane Brake Disk', quantity: 2, rate: 6000 },
    { id: '4', name: 'Air Filter', quantity: 1, rate: 3500 },
  ]);
  const [newPartName, setNewPartName] = useState('');

  // Labour state - pre-populated with sample data
  const [labour, setLabour] = useState<Labour[]>([
    { id: '1', name: 'Brake Disk Replacement', rate: 1000 },
    { id: '2', name: 'Oil Change', rate: 500 },
    { id: '3', name: 'General Inspection', rate: 2000 },
  ]);
  const [newLabourName, setNewLabourName] = useState('');
  const [newLabourRate, setNewLabourRate] = useState('');

  // Extras state - pre-populated with sample data
  const [extras, setExtras] = useState<Extra[]>([
    { id: '1', description: 'Inspection', rate: 1000 },
  ]);
  const [newExtraDescription, setNewExtraDescription] = useState('');
  const [newExtraRate, setNewExtraRate] = useState('');

  // Discount state
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  // Calculate totals
  const partsTotal = parts.reduce((sum, part) => sum + (part.quantity * part.rate), 0);
  const labourTotal = labour.reduce((sum, l) => sum + l.rate, 0);
  const extrasTotal = extras.reduce((sum, e) => sum + e.rate, 0);
  const subTotal = partsTotal + labourTotal + extrasTotal;

  // Calculate discount
  const calculateDiscount = () => {
    if (discountPercent && parseFloat(discountPercent) > 0) {
      return (subTotal * parseFloat(discountPercent)) / 100;
    }
    if (discountAmount && parseFloat(discountAmount) > 0) {
      return parseFloat(discountAmount);
    }
    return 0;
  };

  const discountValue = calculateDiscount();
  const totalPayable = subTotal - discountValue;

  // Check if all sections have data
  const allSectionsFilled = parts.length > 0 && labour.length > 0 && extras.length > 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format currency without decimals for display
  const formatCurrencyShort = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN')}`;
  };

  // Parts handlers
  const handleAddPart = () => {
    if (newPartName.trim()) {
      const newPart: Part = {
        id: Date.now().toString(),
        name: newPartName.trim(),
        quantity: 1,
        rate: 0,
      };
      setParts([...parts, newPart]);
      setNewPartName('');
    }
  };

  const handleUpdatePartQuantity = (id: string, delta: number) => {
    setParts(parts.map(part => {
      if (part.id === id) {
        const newQuantity = Math.max(1, part.quantity + delta);
        return { ...part, quantity: newQuantity };
      }
      return part;
    }));
  };

  const handleUpdatePartRate = (id: string, rate: number) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, rate } : part
    ));
  };

  const handleDeletePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  // Labour handlers
  const handleAddLabour = () => {
    if (newLabourName.trim() && newLabourRate) {
      const newLabourItem: Labour = {
        id: Date.now().toString(),
        name: newLabourName.trim(),
        rate: parseFloat(newLabourRate) || 0,
      };
      setLabour([...labour, newLabourItem]);
      setNewLabourName('');
      setNewLabourRate('');
    }
  };

  const handleDeleteLabour = (id: string) => {
    setLabour(labour.filter(l => l.id !== id));
  };

  // Extras handlers
  const handleAddExtra = () => {
    if (newExtraDescription.trim() && newExtraRate) {
      const newExtraItem: Extra = {
        id: Date.now().toString(),
        description: newExtraDescription.trim(),
        rate: parseFloat(newExtraRate) || 0,
      };
      setExtras([...extras, newExtraItem]);
      setNewExtraDescription('');
      setNewExtraRate('');
    }
  };

  const handleDeleteExtra = (id: string) => {
    setExtras(extras.filter(e => e.id !== id));
  };

  // Handle review estimate - navigate to review view
  const handleReviewEstimate = () => {
    const data: EstimationData = {
      parts,
      labour,
      extras,
      partsTotal,
      labourTotal,
      extrasTotal,
      subTotal,
      discount: discountValue,
      totalPayable,
    };
    onReviewEstimate?.(data);
    setCurrentView('review');
  };

  // Handle back from review
  const handleBackFromReview = () => {
    setCurrentView('estimate');
  };

  // Handle GST verification
  const handleVerifyGst = () => {
    // In real app, this would call an API to verify GST
    if (gstNumber.trim()) {
      setIsGstVerified(true);
    }
  };

  // Handle generate PDF
  const handleGeneratePDF = () => {
    const data = {
      parts,
      labour,
      extras,
      partsTotal,
      labourTotal,
      extrasTotal,
      subTotal,
      discount: discountValue,
      totalPayable,
      customerName,
      gstNumber,
    };
    onGeneratePDF?.(data);
    setCurrentView('pdf');
  };

  // Handle back from PDF view
  const handleBackFromPDF = () => {
    setCurrentView('review');
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    console.log('Download PDF');
    // In real app, this would download the generated PDF
  };

  // Handle share PDF
  const handleSharePDF = () => {
    console.log('Share PDF');
    // In real app, this would open share options
  };

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setIsPartsOpen(false);
      setIsLabourOpen(false);
      setIsExtrasOpen(false);
      setParts([
        { id: '1', name: 'Bosch Oil Filter', quantity: 1, rate: 350 },
        { id: '2', name: 'TVS Lucas Oil Strainer', quantity: 2, rate: 700 },
        { id: '3', name: 'Rane Brake Disk', quantity: 2, rate: 6000 },
        { id: '4', name: 'Air Filter', quantity: 1, rate: 3500 },
      ]);
      setLabour([
        { id: '1', name: 'Brake Disk Replacement', rate: 1000 },
        { id: '2', name: 'Oil Change', rate: 500 },
        { id: '3', name: 'General Inspection', rate: 2000 },
      ]);
      setExtras([
        { id: '1', description: 'Inspection', rate: 1000 },
      ]);
      setNewPartName('');
      setNewLabourName('');
      setNewLabourRate('');
      setNewExtraDescription('');
      setNewExtraRate('');
      setDiscountPercent('');
      setDiscountAmount('');
      // Reset review form state
      setCurrentView('estimate');
      setCustomerName('');
      setGstNumber('');
      setIsGstVerified(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
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

        {/* Content */}
        <div className="px-[16px] pb-[24px]">
          {/* Header */}
          <div className="flex items-center gap-[16px] py-[16px]">
            <button 
              onClick={
                currentView === 'pdf' 
                  ? handleBackFromPDF 
                  : currentView === 'review' 
                    ? handleBackFromReview 
                    : onClose
              } 
              className="p-[4px] hover:opacity-70 transition-opacity"
            >
              <BackArrowIcon />
            </button>
            <h2
              className="font-semibold text-[24px] text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Estimate
            </h2>
          </div>

          {currentView === 'estimate' ? (
            <>
              {/* Sections Container */}
          <div className="flex flex-col gap-[12px]">
            {/* ========== PARTS SECTION ========== */}
            <div className="border border-[#e0e0e0] rounded-[8px] overflow-hidden">
              {/* Parts Header */}
              <button
                onClick={() => setIsPartsOpen(!isPartsOpen)}
                className="w-full flex items-center justify-between px-[16px] py-[16px] bg-[#F0F0F0] hover:bg-[#f9f9f9] transition-colors"
              >
                <span
                  className="font-medium text-[16px] text-black"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Parts {partsTotal > 0 && `- ${formatCurrency(partsTotal)}`}
                </span>
                <ChevronIcon isOpen={isPartsOpen} />
              </button>

              {/* Parts Content */}
              {isPartsOpen && (
                <div className="px-[16px] pb-[16px] border-t border-[#e0e0e0]">
                  {/* Column Headers */}
                  <div className="flex items-center justify-between py-[12px] text-[13px] text-[#757575]">
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>Part Name</span>
                    <div className="flex items-center gap-[16px]">
                      <span className="w-[80px] text-center" style={{ fontFamily: "'Inter', sans-serif" }}>QTY</span>
                      <span className="w-[70px] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>Rate ( Rs)</span>
                    </div>
                  </div>

                  {/* Parts List */}
                  <div className="flex flex-col gap-[12px]">
                    {parts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between gap-[8px]">
                        {/* Part Name with Delete */}
                        <div className="flex items-center gap-[8px] flex-1 min-w-0">
                          {parts.length > 1 && (
                            <button
                              onClick={() => handleDeletePart(part.id)}
                              className="shrink-0 hover:opacity-70 transition-opacity"
                            >
                              <TrashIcon />
                            </button>
                          )}
                          <input
                            type="text"
                            value={part.name}
                            onChange={(e) => {
                              setParts(parts.map(p => 
                                p.id === part.id ? { ...p, name: e.target.value } : p
                              ));
                            }}
                            className="flex-1 min-w-0 px-[12px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black outline-none border border-transparent focus:border-[#e5383b] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-[4px] shrink-0">
                          <button
                            onClick={() => handleUpdatePartQuantity(part.id, -1)}
                            className="w-[32px] h-[32px] bg-[#e5383b] rounded-[4px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
                          >
                            <MinusIcon />
                          </button>
                          <span
                            className="w-[32px] text-center text-[14px] font-medium text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {part.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdatePartQuantity(part.id, 1)}
                            className="w-[32px] h-[32px] bg-[#e5383b] rounded-[4px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
                          >
                            <PlusIcon />
                          </button>
                        </div>

                        {/* Rate Input */}
                        <input
                          type="number"
                          value={part.rate || ''}
                          onChange={(e) => handleUpdatePartRate(part.id, parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-[70px] px-[8px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black text-right outline-none border border-transparent focus:border-[#e5383b] transition-colors shrink-0"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add Part Button */}
                  <button
                    onClick={() => {
                      const newPart: Part = {
                        id: Date.now().toString(),
                        name: '',
                        quantity: 1,
                        rate: 0,
                      };
                      setParts([...parts, newPart]);
                    }}
                    className="mt-[16px] flex items-center gap-[6px] bg-[#e5383b] text-white px-[16px] py-[10px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
                  >
                    <PlusIcon />
                    <span
                      className="text-[14px] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Add parts
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ========== LABOUR SECTION ========== */}
            <div className="border border-[#e0e0e0] rounded-[8px] overflow-hidden">
              {/* Labour Header */}
              <button
                onClick={() => setIsLabourOpen(!isLabourOpen)}
                className="w-full flex items-center justify-between px-[16px] py-[16px] bg-[#F0F0F0] hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="flex items-center gap-[12px] flex-1">
                  <span
                    className="font-medium text-[16px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Labour {labourTotal > 0 && `- ${formatCurrency(labourTotal)}`}
                  </span>
                </div>
                {!isLabourOpen && labour.length === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLabourOpen(true);
                    }}
                    className="flex items-center gap-[6px] bg-[#e5383b] text-white px-[12px] py-[8px] rounded-[8px] hover:bg-[#c82d30] transition-colors mr-[8px]"
                  >
                    <PlusIcon />
                    <span
                      className="text-[13px] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Add
                    </span>
                  </button>
                )}
                <ChevronIcon isOpen={isLabourOpen} />
              </button>

              {/* Labour Content */}
              {isLabourOpen && (
                <div className="px-[16px] pb-[16px] border-t border-[#e0e0e0]">
                  {/* Column Headers */}
                  <div className="flex items-center justify-between py-[12px] text-[13px] text-[#757575]">
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>Labour Type</span>
                    <span className="w-[70px] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>Rate ( Rs)</span>
                  </div>

                  {/* Labour List */}
                  {labour.length > 0 && (
                    <div className="flex flex-col gap-[12px] mb-[12px]">
                      {labour.map((l) => (
                        <div key={l.id} className="flex items-center justify-between gap-[8px]">
                          <div className="flex items-center gap-[8px] flex-1 min-w-0">
                            <button
                              onClick={() => handleDeleteLabour(l.id)}
                              className="shrink-0 hover:opacity-70 transition-opacity"
                            >
                              <TrashIcon />
                            </button>
                            <input
                              type="text"
                              value={l.name}
                              onChange={(e) => {
                                setLabour(labour.map(item => 
                                  item.id === l.id ? { ...item, name: e.target.value } : item
                                ));
                              }}
                              className="flex-1 min-w-0 px-[12px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black outline-none border border-transparent focus:border-[#e5383b] transition-colors"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>
                          <input
                            type="number"
                            value={l.rate || ''}
                            onChange={(e) => {
                              setLabour(labour.map(item => 
                                item.id === l.id ? { ...item, rate: parseFloat(e.target.value) || 0 } : item
                              ));
                            }}
                            placeholder="Rs."
                            className="w-[70px] px-[8px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black text-right outline-none border border-transparent focus:border-[#e5383b] transition-colors shrink-0"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Labour Input Row */}
                  <div className="flex items-center justify-between gap-[8px]">
                    <input
                      type="text"
                      value={newLabourName}
                      onChange={(e) => setNewLabourName(e.target.value)}
                      placeholder="Labour Name"
                      className="flex-1 min-w-0 px-[12px] py-[10px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <input
                      type="number"
                      value={newLabourRate}
                      onChange={(e) => setNewLabourRate(e.target.value)}
                      placeholder="Rs."
                      className="w-[70px] px-[8px] py-[10px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black text-right outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Add Labour Button */}
                  <button
                    onClick={handleAddLabour}
                    className="mt-[16px] flex items-center gap-[6px] bg-[#e5383b] text-white px-[16px] py-[10px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
                  >
                    <PlusIcon />
                    <span
                      className="text-[14px] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Add
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ========== EXTRAS SECTION ========== */}
            <div className="border border-[#e0e0e0] rounded-[8px] overflow-hidden">
              {/* Extras Header */}
              <button
                onClick={() => setIsExtrasOpen(!isExtrasOpen)}
                className="w-full flex items-center justify-between px-[16px] py-[16px] bg-[#F0F0F0] hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="flex items-center gap-[12px] flex-1">
                  <span
                    className="font-medium text-[16px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Extras {extrasTotal > 0 && `- ${formatCurrency(extrasTotal)}`}
                  </span>
                </div>
                {!isExtrasOpen && extras.length === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExtrasOpen(true);
                    }}
                    className="flex items-center gap-[6px] bg-[#e5383b] text-white px-[12px] py-[8px] rounded-[8px] hover:bg-[#c82d30] transition-colors mr-[8px]"
                  >
                    <PlusIcon />
                    <span
                      className="text-[13px] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Add
                    </span>
                  </button>
                )}
                <ChevronIcon isOpen={isExtrasOpen} />
              </button>

              {/* Extras Content */}
              {isExtrasOpen && (
                <div className="px-[16px] pb-[16px] border-t border-[#e0e0e0]">
                  {/* Column Headers */}
                  <div className="flex items-center justify-between py-[12px] text-[13px] text-[#757575]">
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>Description</span>
                    <span className="w-[70px] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>Rate ( Rs)</span>
                  </div>

                  {/* Extras List */}
                  {extras.length > 0 && (
                    <div className="flex flex-col gap-[12px] mb-[12px]">
                      {extras.map((e) => (
                        <div key={e.id} className="flex items-center justify-between gap-[8px]">
                          <div className="flex items-center gap-[8px] flex-1 min-w-0">
                            <button
                              onClick={() => handleDeleteExtra(e.id)}
                              className="shrink-0 hover:opacity-70 transition-opacity"
                            >
                              <TrashIcon />
                            </button>
                            <input
                              type="text"
                              value={e.description}
                              onChange={(ev) => {
                                setExtras(extras.map(item => 
                                  item.id === e.id ? { ...item, description: ev.target.value } : item
                                ));
                              }}
                              className="flex-1 min-w-0 px-[12px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black outline-none border border-transparent focus:border-[#e5383b] transition-colors"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>
                          <input
                            type="number"
                            value={e.rate || ''}
                            onChange={(ev) => {
                              setExtras(extras.map(item => 
                                item.id === e.id ? { ...item, rate: parseFloat(ev.target.value) || 0 } : item
                              ));
                            }}
                            placeholder="Rs."
                            className="w-[70px] px-[8px] py-[10px] bg-[#f5f5f5] rounded-[8px] text-[14px] text-black text-right outline-none border border-transparent focus:border-[#e5383b] transition-colors shrink-0"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Extra Input Row */}
                  <div className="flex items-center justify-between gap-[8px]">
                    <input
                      type="text"
                      value={newExtraDescription}
                      onChange={(e) => setNewExtraDescription(e.target.value)}
                      placeholder="Description"
                      className="flex-1 min-w-0 px-[12px] py-[10px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <input
                      type="number"
                      value={newExtraRate}
                      onChange={(e) => setNewExtraRate(e.target.value)}
                      placeholder="Rs."
                      className="w-[70px] px-[8px] py-[10px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black text-right outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Add Extra Button */}
                  <button
                    onClick={handleAddExtra}
                    className="mt-[16px] flex items-center gap-[6px] bg-[#e5383b] text-white px-[16px] py-[10px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
                  >
                    <PlusIcon />
                    <span
                      className="text-[14px] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Add
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Totals Section - Shows when all sections have data */}
          {allSectionsFilled && (
            <div className="mt-[16px] flex flex-col gap-[12px]">
              {/* Sub Total */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[14px] text-[#757575]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sub Total
                </span>
                <span
                  className="text-[18px] font-medium text-black"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {formatCurrencyShort(subTotal)}
                </span>
              </div>

              {/* Discounts */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[14px] text-[#757575]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Discounts
                </span>
                <div className="flex items-center gap-[8px]">
                  <input
                    type="text"
                    value={discountPercent}
                    onChange={(e) => {
                      setDiscountPercent(e.target.value);
                      if (e.target.value) setDiscountAmount('');
                    }}
                    placeholder="20 %"
                    className="w-[70px] px-[12px] py-[8px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black text-center outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <span
                    className="text-[14px] text-[#757575]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    OR
                  </span>
                  <input
                    type="text"
                    value={discountAmount}
                    onChange={(e) => {
                      setDiscountAmount(e.target.value);
                      if (e.target.value) setDiscountPercent('');
                    }}
                    placeholder={`Rs ${Math.round(subTotal * 0.2).toLocaleString('en-IN')}`}
                    className="w-[90px] px-[12px] py-[8px] bg-white border border-[#d3d3d3] rounded-[8px] text-[14px] text-black text-center outline-none focus:border-[#e5383b] transition-colors placeholder:text-[#9e9e9e]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Total Payable */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[14px] text-[#757575]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Total Payable
                </span>
                <span
                  className="text-[20px] font-semibold text-[#e5383b]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {formatCurrencyShort(totalPayable)}
                </span>
              </div>
            </div>
          )}

          {/* Review Estimate CTA */}
          <div className="mt-[24px]">
            <button
              onClick={handleReviewEstimate}
              className="w-full bg-[#e5383b] text-white py-[18px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
            >
              <span
                className="text-[15px] font-normal uppercase tracking-[-0.01px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Review Estimate
              </span>
            </button>
        </div>
            </>
          ) : currentView === 'review' ? (
            /* ========== REVIEW VIEW ========== */
            <div className="flex flex-col gap-[24px]">
              {/* Vehicle Card */}
              
              <VehicleCard
                  plateNumber={vehicle.plateNumber}
                  year={vehicle.year}
                  make={vehicle.make}
                  model={vehicle.model}
                  specs={vehicle.specs}
                />

              {/* Customer/Company Name Input */}
              <div className="relative border border-[#d3d3d3] rounded-[8px] px-[16px] py-[14px]">
                {customerName && (
                  <label
                    className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Customer/Company Name
                  </label>
                )}
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={customerName ? '' : 'Customer/Company Name'}
                  className="w-full outline-none  text-[15px] text-black placeholder:text-[#828282]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* GST NO. Input */}
              <div className="relative">
                {gstNumber && (
                  <label
                    className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[11px] text-[#828282] z-10"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    GST NO.
                  </label>
                )}
                <div className="border border-[#d3d3d3] rounded-[8px] overflow-hidden flex items-center">
                  <div className="flex-1 px-[16px] py-[14px]">
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value);
                        setIsGstVerified(false);
                      }}
                      placeholder={gstNumber ? '' : 'GST NO.'}
                      className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  {isGstVerified ? (
                    <span
                      className="px-[16px] text-[14px] font-semibold text-[#e5383b]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      VERIFIED
                    </span>
                  ) : (
                    <button
                      onClick={handleVerifyGst}
                      className="bg-[#e5383b] text-white px-[20px] py-[8px] m-[4px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
                    >
                      <span
                        className="text-[14px] font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Verify
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[14px] text-[#757575] uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Part
                  </span>
                  <span
                    className="text-[14px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Rs.{partsTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[14px] text-[#757575] uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Labour
                  </span>
                  <span
                    className="text-[14px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Rs.{labourTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[14px] text-[#757575] uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Extras
                  </span>
                  <span
                    className="text-[14px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Rs.{extrasTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[14px] text-[#757575] uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Discount
                  </span>
                  <span
                    className="text-[14px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Rs.{discountValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-[8px]">
                  <span
                    className="text-[14px] font-bold text-black uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Grand Total
                  </span>
                  <span
                    className="text-[20px] font-bold text-[#e5383b]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Rs. {totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Generate PDF Button */}
              <div className="mt-[8px]">
                <button
                  onClick={handleGeneratePDF}
                  className="w-full bg-[#e5383b] text-white py-[18px] rounded-[8px] hover:bg-[#c82d30] transition-colors"
                >
                  <span
                    className="text-[15px] font-normal uppercase tracking-[-0.01px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Generate PDF
                  </span>
                </button>
              </div>
            </div>
          ) : currentView === 'pdf' ? (
            /* ========== PDF VIEW ========== */
            <div className="flex flex-col gap-[24px]">
              {/* PDF Preview */}
              <div className="flex justify-center">
                <div className="bg-[#f5f5f5] rounded-[8px] p-[16px] w-full max-w-[320px]">
                  {/* PDF Document Preview Placeholder */}
                  <div className="bg-white rounded-[4px] shadow-md aspect-[0.7] flex flex-col overflow-hidden">
                    {/* PDF Header */}
                    <div className="p-[12px] border-b border-[#e0e0e0]">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-semibold text-[#e5383b]">National Car Service</p>
                          <p className="text-[6px] text-[#757575]">Chopda Bazar, Dewas</p>
                        </div>
                        <div className="w-[30px] h-[20px] bg-gradient-to-r from-[#0077b6] to-[#e5383b] rounded-[2px]" />
                      </div>
                      <p className="text-[12px] font-bold text-[#0077b6] text-center mt-[8px]">JOB ESTIMATE</p>
                    </div>
                    
                    {/* PDF Content Placeholder */}
                    <div className="flex-1 p-[12px]">
                      <div className="space-y-[6px]">
                        {/* Vehicle Info Row */}
                        <div className="flex justify-between text-[5px]">
                          <span className="text-[#757575]">Vehicle:</span>
                          <span className="font-medium">{vehicleInfo ? `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}` : 'Toyota Innova Crysta'}</span>
                        </div>
                        <div className="flex justify-between text-[5px]">
                          <span className="text-[#757575]">Variant:</span>
                          <span className="font-medium">{vehicleInfo?.specs || '2.4L ZX MT/Diesel'}</span>
                        </div>
                        
                        {/* Customer Info */}
                        <div className="mt-[8px] pt-[4px] border-t border-[#e0e0e0]">
                          <p className="text-[5px] text-[#757575]">Bill To:</p>
                          <p className="text-[6px] font-medium">{customerName || 'Customer Name'}</p>
                          <p className="text-[5px] text-[#757575]">GST: {gstNumber || 'N/A'}</p>
                        </div>
                        
                        {/* Table Header */}
                        <div className="mt-[8px] bg-[#f5f5f5] p-[4px] flex text-[5px] font-semibold">
                          <span className="w-[10px]">#</span>
                          <span className="flex-1">Description</span>
                          <span className="w-[30px] text-right">Rate</span>
                        </div>
                        
                        {/* Table Rows Placeholder */}
                        <div className="space-y-[2px]">
                          {parts.slice(0, 3).map((part, idx) => (
                            <div key={part.id} className="flex text-[5px] py-[2px] border-b border-[#f0f0f0]">
                              <span className="w-[10px]">{idx + 1}</span>
                              <span className="flex-1 truncate">{part.name}</span>
                              <span className="w-[30px] text-right">₹{part.rate * part.quantity}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Totals */}
                        <div className="mt-[8px] pt-[4px] border-t border-[#e0e0e0] space-y-[2px]">
                          <div className="flex justify-between text-[5px]">
                            <span>Sub Total</span>
                            <span>₹{subTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[5px]">
                            <span>Discount</span>
                            <span>₹{discountValue.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[6px] font-bold text-[#e5383b]">
                            <span>Total</span>
                            <span>₹{totalPayable.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download and Share Buttons */}
              <div className="flex gap-[16px]">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-[#e5383b] text-white py-[16px] rounded-[8px] hover:bg-[#c82d30] transition-colors flex items-center justify-center gap-[8px]"
                >
                  {/* Download Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span
                    className="text-[15px] font-medium"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Download
                  </span>
                </button>

                <button
                  onClick={handleSharePDF}
                  className="flex-1 bg-[#e5383b] text-white py-[16px] rounded-[8px] hover:bg-[#c82d30] transition-colors flex items-center justify-center gap-[8px]"
                >
                  {/* Share Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6L12 2L8 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span
                    className="text-[15px] font-medium"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Share
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
