'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface FiltersOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterData) => void;
}

interface FilterData {
  // Date filters
  startDate: string;
  endDate: string;
  // Vehicle filters
  brand: string;
  model: string;
  year: string;
  vehicleNumber: string;
  assignedTo: string;
  addedBy: string;
  // Sort filters
  sortBy: 'amount_low_high' | 'amount_high_low' | 'relevance' | null;
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

// Chevron Left/Right Icons for calendar
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L7 10L12 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L13 10L8 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Brand logos data
const brandLogos = [
  { id: 'mahindra', name: 'MAHINDRA', logo: '/assets/logos/mahindra.svg' },
  { id: 'tata', name: 'TATA', logo: '/assets/logos/tata.svg' },
  { id: 'skoda', name: 'SKODA', logo: '/assets/logos/skoda.svg' },
  { id: 'kia', name: 'KIA', logo: '/assets/logos/kia.svg' },
  { id: 'suzuki', name: 'SUZUKI', logo: '/assets/logos/suzuki.svg' },
  { id: 'hyundai', name: 'HYUNDAI', logo: '/assets/logos/hyundai.svg' },
  { id: 'toyota', name: 'TOYOTA', logo: '/assets/logos/toyota.svg' },
  { id: 'mg', name: 'MG', logo: '/assets/logos/mg.svg' },
  { id: 'nissan', name: 'NISSAN', logo: '/assets/logos/nissan.svg' },
  { id: 'renault', name: 'RENAULT', logo: '/assets/logos/renault.svg' },
  { id: 'honda', name: 'HONDA', logo: '/assets/logos/honda.svg' },
  { id: 'ford', name: 'FORD', logo: '/assets/logos/ford.svg' },
];

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function FiltersOverlay({
  isOpen,
  onClose,
  onApply,
}: FiltersOverlayProps) {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'date' | 'vehicle' | 'sort'>('date');

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [selectingField, setSelectingField] = useState<'start' | 'end'>('start');

  // Vehicle filter state
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAssignedToDropdown, setShowAssignedToDropdown] = useState(false);
  const [showAddedByDropdown, setShowAddedByDropdown] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [addedBy, setAddedBy] = useState('');

  // Sort filter state
  const [sortBy, setSortBy] = useState<'amount_low_high' | 'amount_high_low' | 'relevance' | null>(null);

  // Reset all filters
  const handleClearAll = () => {
    setStartDate('');
    setEndDate('');
    setSelectedDates([]);
    setSelectedBrand('');
    setSelectedModel('');
    setYear('');
    setVehicleNumber('');
    setAssignedTo('');
    setAddedBy('');
    setSortBy(null);
  };

  // Apply filters
  const handleApply = () => {
    if (onApply) {
      onApply({
        startDate,
        endDate,
        brand: selectedBrand,
        model: selectedModel,
        year,
        vehicleNumber,
        assignedTo,
        addedBy,
        sortBy,
      });
    }
    onClose();
  };

  // Reset when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setShowBrandDropdown(false);
      setShowModelDropdown(false);
      setShowAssignedToDropdown(false);
      setShowAddedByDropdown(false);
    }
  }, [isOpen]);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const dateStr = `${String(day).padStart(2, '0')}/${String(calendarMonth + 1).padStart(2, '0')}/${String(calendarYear).slice(-2)}`;
    
    if (selectingField === 'start') {
      setStartDate(dateStr);
      setSelectingField('end');
    } else {
      setEndDate(dateStr);
      setSelectingField('start');
    }

    // Toggle date selection for visual feedback
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(d => d !== day));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  // Render calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-[40px]" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDates.includes(day);
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-[40px] w-[40px] flex items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
            isSelected
              ? 'bg-[#e5383b] text-white'
              : 'text-[#333] hover:bg-[#f5f5f5]'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
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
              Filters
            </h2>
          </div>

          {/* Tab Navigation with Clear All */}
          <div className="flex items-center gap-[12px] px-[16px] pb-[20px]">
            <div className="bg-[#e5e5e5] rounded-[8px] flex items-center flex-1">
              <button
                onClick={() => setActiveTab('date')}
                className={`flex-1 px-[20px] py-[10px] text-[14px] font-medium rounded-[8px] transition-all ${
                  activeTab === 'date'
                    ? 'bg-[#e5383b] text-white'
                    : 'text-[#4c4c4c]'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setActiveTab('vehicle')}
                className={`flex-1 px-[20px] py-[10px] text-[14px] font-medium rounded-[8px] transition-all ${
                  activeTab === 'vehicle'
                    ? 'bg-[#e5383b] text-white'
                    : 'text-[#4c4c4c]'
                }`}
              >
                Vehicle
              </button>
              <button
                onClick={() => setActiveTab('sort')}
                className={`flex-1 px-[20px] py-[10px] text-[14px] font-medium rounded-[8px] transition-all ${
                  activeTab === 'sort'
                    ? 'bg-[#e5383b] text-white'
                    : 'text-[#4c4c4c]'
                }`}
              >
                Sort
              </button>
            </div>

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="px-[16px] py-[10px] border border-[#e5383b] rounded-[8px] text-[#e5383b] text-[14px] font-medium hover:bg-[#fff5f5] transition-colors whitespace-nowrap"
            >
              CLEAR ALL
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-[16px] pb-[100px]">
            {/* ========== DATE TAB ========== */}
            {activeTab === 'date' && (
              <div className="flex flex-col gap-[20px] py-2">
                {/* Start and End Date Fields */}
                <div className="flex gap-[12px]">
                  {/* Start Date */}
                  <div className="flex-1 relative">
                    <div
                      onClick={() => setSelectingField('start')}
                      className={`border rounded-[8px] px-[16px] py-[14px] cursor-pointer transition-colors ${
                        selectingField === 'start' ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                      }`}
                    >
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        START
                      </label>
                      <span
                        className={`text-[15px] ${startDate ? 'text-black' : 'text-[#828282]'}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {startDate || 'DD/MM/YY'}
                      </span>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex-1 relative">
                    <div
                      onClick={() => setSelectingField('end')}
                      className={`border rounded-[8px] px-[16px] py-[14px] cursor-pointer transition-colors ${
                        selectingField === 'end' ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                      }`}
                    >
                      <label
                        className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        END
                      </label>
                      <span
                        className={`text-[15px] ${endDate ? 'text-black' : 'text-[#828282]'}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {endDate || 'DD/MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar Navigation */}
                <div className="flex items-center justify-between">
                  {/* Year Navigation */}
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setCalendarYear(calendarYear - 1)}
                      className="p-[4px] hover:bg-[#f5f5f5] rounded"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <span className="text-[16px] font-medium text-black min-w-[50px] text-center">
                      {calendarYear}
                    </span>
                    <button
                      onClick={() => setCalendarYear(calendarYear + 1)}
                      className="p-[4px] hover:bg-[#f5f5f5] rounded"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>

                  {/* Month Navigation */}
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setCalendarMonth(calendarMonth === 0 ? 11 : calendarMonth - 1)}
                      className="p-[4px] hover:bg-[#f5f5f5] rounded"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <span className="text-[16px] font-medium text-black min-w-[100px] text-center">
                      {monthNames[calendarMonth]}
                    </span>
                    <button
                      onClick={() => setCalendarMonth(calendarMonth === 11 ? 0 : calendarMonth + 1)}
                      className="p-[4px] hover:bg-[#f5f5f5] rounded"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-[4px]">
                  {dayHeaders.map((day, index) => (
                    <div
                      key={index}
                      className="h-[40px] flex items-center justify-center text-[14px] font-medium text-[#828282]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-[4px]">
                  {renderCalendar()}
                </div>
              </div>
            )}

            {/* ========== VEHICLE TAB ========== */}
            {activeTab === 'vehicle' && (
              <div className="flex flex-col gap-[16px] py-2">
                {/* Brand Dropdown */}
                <div className="relative">
                  {selectedBrand && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Brand
                    </label>
                  )}
                  <button
                    onClick={() => {
                      setShowBrandDropdown(!showBrandDropdown);
                      setShowModelDropdown(false);
                      setShowAssignedToDropdown(false);
                      setShowAddedByDropdown(false);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      selectedBrand ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <span
                      className={`text-[15px] ${selectedBrand ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedBrand || 'Brand'}
                    </span>
                    <ChevronDownIcon className={showBrandDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showBrandDropdown && (
                    <div className="mt-[8px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg overflow-hidden">
                      <div className="grid grid-cols-3 gap-[8px] p-[12px] max-h-[300px] overflow-y-auto">
                        {brandLogos.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => {
                              setSelectedBrand(brand.name);
                              setShowBrandDropdown(false);
                            }}
                            className={`flex flex-col items-center justify-center p-[12px] rounded-[8px] transition-colors ${
                              selectedBrand === brand.name
                                ? 'bg-[#fff5f5] border-2 border-[#e5383b]'
                                : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
                            }`}
                          >
                            <div className="w-[48px] h-[48px] flex items-center justify-center mb-[8px]">
                              <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={40}
                                height={40}
                                className="object-contain"
                                onError={(e) => {
                                  // Fallback to text if logo not found
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-[#333]">{brand.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Model Dropdown */}
                <div className="relative">
                  {selectedModel && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Model
                    </label>
                  )}
                  <button
                    onClick={() => {
                      setShowModelDropdown(!showModelDropdown);
                      setShowBrandDropdown(false);
                      setShowAssignedToDropdown(false);
                      setShowAddedByDropdown(false);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      selectedModel ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <span
                      className={`text-[15px] ${selectedModel ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedModel || 'Model'}
                    </span>
                    <ChevronDownIcon className={showModelDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showModelDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {['Crysta', 'Fortuner', 'Innova', 'Corolla', 'Camry'].map((model) => (
                        <button
                          key={model}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span className="text-[14px] text-black">{model}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Input */}
                <div className="relative">
                  {year && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Year
                    </label>
                  )}
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      year ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Year"
                      className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Vehicle Number Input */}
                <div className="relative">
                  {vehicleNumber && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Vehicle Number
                    </label>
                  )}
                  <div
                    className={`border rounded-[8px] px-[16px] py-[14px] transition-colors ${
                      vehicleNumber ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="Vehicle Number"
                      className="w-full outline-none text-[15px] text-black placeholder:text-[#828282]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Assigned to Dropdown */}
                <div className="relative">
                  {assignedTo && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Assigned to
                    </label>
                  )}
                  <button
                    onClick={() => {
                      setShowAssignedToDropdown(!showAssignedToDropdown);
                      setShowBrandDropdown(false);
                      setShowModelDropdown(false);
                      setShowAddedByDropdown(false);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      assignedTo ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <span
                      className={`text-[15px] ${assignedTo ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {assignedTo || 'Assigned to'}
                    </span>
                    <ChevronDownIcon className={showAssignedToDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showAssignedToDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {['Rizwan', 'Amit', 'Sohan', 'Rajesh'].map((person) => (
                        <button
                          key={person}
                          onClick={() => {
                            setAssignedTo(person);
                            setShowAssignedToDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span className="text-[14px] text-black">{person}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Added by Dropdown */}
                <div className="relative">
                  {addedBy && (
                    <label
                      className="absolute -top-[8px] left-[12px] bg-white px-[4px] text-[10px] text-[#828282] z-10"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Added by
                    </label>
                  )}
                  <button
                    onClick={() => {
                      setShowAddedByDropdown(!showAddedByDropdown);
                      setShowBrandDropdown(false);
                      setShowModelDropdown(false);
                      setShowAssignedToDropdown(false);
                    }}
                    className={`w-full border rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors ${
                      addedBy ? 'border-[#e5383b]' : 'border-[#d3d3d3]'
                    }`}
                  >
                    <span
                      className={`text-[15px] ${addedBy ? 'text-black' : 'text-[#828282]'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {addedBy || 'Added by'}
                    </span>
                    <ChevronDownIcon className={showAddedByDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {showAddedByDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d3d3d3] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {['Admin', 'Manager', 'Staff'].map((person) => (
                        <button
                          key={person}
                          onClick={() => {
                            setAddedBy(person);
                            setShowAddedByDropdown(false);
                          }}
                          className="w-full px-[16px] py-[12px] text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <span className="text-[14px] text-black">{person}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== SORT TAB ========== */}
            {activeTab === 'sort' && (
              <div className="flex flex-col gap-[16px]">
                {/* Amount Low to High */}
                <button
                  onClick={() => setSortBy(sortBy === 'amount_low_high' ? null : 'amount_low_high')}
                  className="flex items-center gap-[12px] py-[8px]"
                >
                  <div
                    className={`w-[24px] h-[24px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                      sortBy === 'amount_low_high'
                        ? 'border-[#e5383b] bg-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {sortBy === 'amount_low_high' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[15px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Amount (Low To High)
                  </span>
                </button>

                {/* Amount High to Low */}
                <button
                  onClick={() => setSortBy(sortBy === 'amount_high_low' ? null : 'amount_high_low')}
                  className="flex items-center gap-[12px] py-[8px]"
                >
                  <div
                    className={`w-[24px] h-[24px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                      sortBy === 'amount_high_low'
                        ? 'border-[#e5383b] bg-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {sortBy === 'amount_high_low' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[15px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Amount (High To Low)
                  </span>
                </button>

                {/* Relevance Default */}
                <button
                  onClick={() => setSortBy(sortBy === 'relevance' ? null : 'relevance')}
                  className="flex items-center gap-[12px] py-[8px]"
                >
                  <div
                    className={`w-[24px] h-[24px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                      sortBy === 'relevance'
                        ? 'border-[#e5383b] bg-[#e5383b]'
                        : 'border-[#d3d3d3]'
                    }`}
                  >
                    {sortBy === 'relevance' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[15px] text-black"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Relevance (Default)
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Apply Button - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-[16px] bg-white shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.1)]">
            <button
              onClick={handleApply}
              className="w-full h-[56px] bg-[#e5383b] rounded-[8px] flex items-center justify-center hover:bg-[#c82d30] transition-colors"
            >
              <span
                className="text-white font-normal text-[15px] uppercase tracking-[-0.01px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                APPLY
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
