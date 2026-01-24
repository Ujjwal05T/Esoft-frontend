'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import StaffCard, { StaffMember } from '@/components/dashboard/StaffCard';
import AddStaffOverlay, { StaffFormData } from '@/components/overlays/AddStaffOverlay';
import EditStaffOverlay, { EditStaffFormData } from '@/components/overlays/EditStaffOverlay';
import ViewStaffOverlay, { ViewStaffData } from '@/components/overlays/ViewStaffOverlay';

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

// Extended StaffMember for page with extra fields
interface ExtendedStaffMember extends StaffMember {
  address: string;
  aadhaarNumber: string;
  isActive: boolean;
}

// Mock staff data
const mockStaffData: ExtendedStaffMember[] = [
  {
    id: '1',
    name: 'Sohan Shah',
    role: 'Senior Mechanic',
    phone: '9889674593',
    avatar: '/assets/images/staff-1.png',
    address: 'MJ Colony',
    aadhaarNumber: '1234-5678-9012',
    isActive: true,
  },
  {
    id: '2',
    name: 'Rizwaan Sheikh',
    role: 'Junior Mechanic',
    phone: '9889674593',
    avatar: '/assets/images/staff-2.png',
    address: '123 Main Street',
    aadhaarNumber: '2345-6789-0123',
    isActive: true,
  },
  {
    id: '3',
    name: 'Rohan Singh',
    role: 'Junior Trainee',
    phone: '9889674593',
    avatar: '/assets/images/staff-3.png',
    address: '456 Park Avenue',
    aadhaarNumber: '3456-7890-1234',
    isActive: true,
  },
  {
    id: '4',
    name: 'Dev',
    role: 'Electrical component specialist',
    phone: '9889674593',
    avatar: '/assets/images/staff-4.png',
    address: '789 Tech Road',
    aadhaarNumber: '4567-8901-2345',
    isActive: true,
  },
  {
    id: '5',
    name: 'Anil Kumar',
    role: 'Workshop Manager',
    phone: '9889674593',
    avatar: '/assets/images/staff-5.png',
    address: '321 Business Blvd',
    aadhaarNumber: '5678-9012-3456',
    isActive: false,
  },
];

export default function MyStaffPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStaffOverlay, setShowAddStaffOverlay] = useState(false);
  const [showEditStaffOverlay, setShowEditStaffOverlay] = useState(false);
  const [showViewStaffOverlay, setShowViewStaffOverlay] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<EditStaffFormData | null>(null);
  const [viewStaffData, setViewStaffData] = useState<ViewStaffData | null>(null);

  // Filter staff based on active tab and search query
  const filteredStaff = mockStaffData.filter(staff => {
    const matchesTab = activeTab === 'active' ? staff.isActive : !staff.isActive;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleToggleExpand = (staffId: string) => {
    setExpandedCardId(expandedCardId === staffId ? null : staffId);
  };

  const handleEditStaff = (staffId: string) => {
    const staff = mockStaffData.find(s => s.id === staffId);
    if (staff) {
      setSelectedStaff({
        id: staff.id,
        name: staff.name,
        contactNumber: staff.phone,
        address: staff.address,
        aadhaarNumber: staff.aadhaarNumber,
        role: staff.role,
        photo: staff.avatar,
        isActive: staff.isActive,
        permissions: {
          vehicleApprovals: false,
          inquiryApprovals: false,
          generateEstimates: false,
          createJobCard: false,
          disputeApprovals: false,
          quoteApprovalsPayments: false,
        },
      });
      setShowEditStaffOverlay(true);
    }
  };

  const handleViewStaff = (staffId: string) => {
    const staff = mockStaffData.find(s => s.id === staffId);
    if (staff) {
      setViewStaffData({
        id: staff.id,
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        photo: staff.avatar,
      });
      setShowViewStaffOverlay(true);
    }
  };

  const handleAddStaff = () => {
    setShowAddStaffOverlay(true);
  };

  const handleStaffSubmit = (staffData: StaffFormData) => {
    console.log('New staff data:', staffData);
    // TODO: Add staff to the list or send to API
  };

  const handleStaffUpdate = (staffData: EditStaffFormData) => {
    console.log('Updated staff data:', staffData);
    // TODO: Update staff in the list or send to API
  };

  const handleToggleStaffActive = (staffId: string, isActive: boolean) => {
    console.log('Toggle staff active:', staffId, isActive);
    // TODO: Update staff active status
  };

  const handleDeleteStaff = (staffId: string) => {
    console.log('Delete staff:', staffId);
    // TODO: Delete staff from the list or send to API
  };

  return (
    <div className="bg-[#f2f2f2] relative min-h-screen w-full overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px]">
        {/* Inner container for mobile centering */}
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0">
          
          {/* Header */}
          <div className="sticky top-0 bg-white z-50 px-[16px] py-[16px]">
            {searchVisible ? (
              // Search mode header
              <div className="flex items-center gap-[12px]">
                <button onClick={() => {
                  setSearchVisible(false);
                  setSearchQuery('');
                }} className="shrink-0">
                  <BackArrowIcon />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff..."
                  autoFocus
                  className="flex-1 h-[40px] bg-[#f5f5f5] rounded-[8px] px-[16px] outline-none text-[15px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            ) : (
              // Normal header
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[16px]">
                  <button onClick={() => router.back()} className="shrink-0">
                    <BackArrowIcon />
                  </button>
                  <h1
                    className="text-[#e5383b] font-semibold text-[24px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    My Staff
                  </h1>
                </div>
                <button 
                  onClick={() => setSearchVisible(true)}
                  className="shrink-0"
                >
                  <SearchIcon />
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex mt-[16px]">
              <div className="bg-[#e5e5e5] rounded-[8px] flex items-center">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-[20px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                    activeTab === 'active'
                      ? 'bg-[#e5383b] text-white'
                      : 'text-[#4c4c4c]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`px-[20px] py-[8px] text-[14px] font-medium rounded-[8px] transition-all ${
                    activeTab === 'inactive'
                      ? 'bg-[#e5383b] text-white'
                      : 'text-[#4c4c4c]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-[16px] pb-[180px] pt-[16px]">
            {/* Staff List */}
            {filteredStaff.length > 0 ? (
              <div className="flex flex-col gap-[12px]">
                {filteredStaff.map((staff) => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    isExpanded={expandedCardId === staff.id}
                    onToggleExpand={() => handleToggleExpand(staff.id)}
                    onEdit={() => handleEditStaff(staff.id)}
                    onView={() => handleViewStaff(staff.id)}
                  />
                ))}
              </div>
            ) : (
              // Empty state
              <div className="flex flex-col items-center justify-center py-[60px]">
                <div className="w-[80px] h-[80px] bg-[#f5f5f5] rounded-full flex items-center justify-center mb-[16px]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p
                  className="text-[16px] font-medium text-[#666666]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  No {activeTab} staff found
                </p>
                <p
                  className="text-[14px] text-[#999999] mt-[4px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {activeTab === 'active' ? 'Add staff members to get started' : 'No inactive staff members'}
                </p>
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton
            navigationOptions={[
              {
                label: 'Add new staff',
                onClick: handleAddStaff,
              },
            ]}
          />

          {/* Navigation Bar */}
          <NavigationBar role='owner' />
        </div>
      </div>

      {/* Add Staff Overlay */}
      <AddStaffOverlay
        isOpen={showAddStaffOverlay}
        onClose={() => setShowAddStaffOverlay(false)}
        onSubmit={handleStaffSubmit}
      />

      {/* Edit Staff Overlay */}
      <EditStaffOverlay
        isOpen={showEditStaffOverlay}
        onClose={() => setShowEditStaffOverlay(false)}
        onUpdate={handleStaffUpdate}
        onToggleActive={handleToggleStaffActive}
        onDelete={handleDeleteStaff}
        staffData={selectedStaff}
      />

      {/* View Staff Overlay */}
      <ViewStaffOverlay
        isOpen={showViewStaffOverlay}
        onClose={() => setShowViewStaffOverlay(false)}
        staffData={viewStaffData}
      />
    </div>
  );
}
