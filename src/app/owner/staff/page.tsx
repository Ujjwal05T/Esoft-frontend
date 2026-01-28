'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import StaffCard, { StaffMember } from '@/components/dashboard/StaffCard';
import AddStaffOverlay, { StaffFormData } from '@/components/overlays/AddStaffOverlay';
import EditStaffOverlay, { EditStaffFormData } from '@/components/overlays/EditStaffOverlay';
import ViewStaffOverlay, { ViewStaffData } from '@/components/overlays/ViewStaffOverlay';
import {
  getStaff,
  createStaff,
  createStaffWithPhoto,
  updateStaff,
  activateStaff,
  deactivateStaff,
  deleteStaff,
  updateStaffPermissions,
  WorkshopStaffResponse,
  CreateStaffData,
  UpdateStaffData,
  uploadStaffPhoto,
} from '@/services/api';

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
    isActive: true,
  },
  {
    id: '2',
    name: 'Rizwaan Sheikh',
    role: 'Junior Mechanic',
    phone: '9889674593',
    avatar: '/assets/images/staff-2.png',
    address: '123 Main Street',
    isActive: true,
  },
  {
    id: '3',
    name: 'Rohan Singh',
    role: 'Junior Trainee',
    phone: '9889674593',
    avatar: '/assets/images/staff-3.png',
    address: '456 Park Avenue',
    isActive: true,
  },
  {
    id: '4',
    name: 'Dev',
    role: 'Electrical component specialist',
    phone: '9889674593',
    avatar: '/assets/images/staff-4.png',
    address: '789 Tech Road',
    isActive: true,
  },
  {
    id: '5',
    name: 'Anil Kumar',
    role: 'Workshop Manager',
    phone: '9889674593',
    avatar: '/assets/images/staff-5.png',
    address: '321 Business Blvd',
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
  
  // API data states
  const [staffList, setStaffList] = useState<WorkshopStaffResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff data from API
  const fetchStaffData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getStaff();
      if (response.success && response.data) {
        setStaffList(response.data.staff);
      } else {
        setError(response.error || 'Failed to fetch staff data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // Filter staff based on active tab and search query
  const filteredStaff = staffList.filter(staff => {
    const matchesTab = activeTab === 'active' ? staff.isActive : !staff.isActive;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.phoneNumber.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  // Convert API response to ExtendedStaffMember format for StaffCard
  const mapToStaffMember = (staff: WorkshopStaffResponse): ExtendedStaffMember => ({
    id: String(staff.id),
    name: staff.name,
    role: staff.role,
    phone: staff.phoneNumber,
    avatar: staff.photoUrl || '/assets/images/default-avatar.png',
    address: staff.address || '',
    isActive: staff.isActive,
  });

  const handleToggleExpand = (staffId: string) => {
    setExpandedCardId(expandedCardId === staffId ? null : staffId);
  };

  const handleEditStaff = (staffId: string) => {
    const staff = staffList.find(s => String(s.id) === staffId);
    if (staff) {
      setSelectedStaff({
        id: String(staff.id),
        name: staff.name,
        contactNumber: staff.phoneNumber,
        address: staff.address || '',
        role: staff.role,
        photo: staff.photoUrl || null,
        isActive: staff.isActive,
        permissions: {
          vehicleApprovals: staff.permissions.vehicleApprovals,
          inquiryApprovals: staff.permissions.inquiryApprovals,
          generateEstimates: staff.permissions.generateEstimates,
          createJobCard: staff.permissions.createJobCard,
          disputeApprovals: staff.permissions.disputeApprovals,
          quoteApprovalsPayments: staff.permissions.quoteApprovalsPayments,
        },
      });
      setShowEditStaffOverlay(true);
    }
  };

  const handleViewStaff = (staffId: string) => {
    const staff = staffList.find(s => String(s.id) === staffId);
    if (staff) {
      setViewStaffData({
        id: String(staff.id),
        name: staff.name,
        role: staff.role,
        phone: staff.phoneNumber,
        photo: staff.photoUrl || null,
      });
      setShowViewStaffOverlay(true);
    }
  };

  const handleAddStaff = () => {
    setShowAddStaffOverlay(true);
  };

  const handleStaffSubmit = async (staffData: StaffFormData) => {
    console.log('New staff data:', staffData);
    
    const createData: CreateStaffData = {
      name: staffData.name,
      phoneNumber: staffData.contactNumber,
      role: staffData.role,
      address: staffData.address,
      jobCategories: staffData.jobCategories,
      canApproveVehicles: staffData.permissions.vehicleApprovals,
      canApproveInquiries: staffData.permissions.inquiryApprovals,
      canGenerateEstimates: staffData.permissions.generateEstimates,
      canCreateJobCard: staffData.permissions.createJobCard,
      canApproveDisputes: staffData.permissions.disputeApprovals,
      canApproveQuotesPayments: staffData.permissions.quoteApprovalsPayments,
    };
    
    // Use createStaffWithPhoto if there's a photo, otherwise use regular createStaff
    const response = staffData.photoFile 
      ? await createStaffWithPhoto(createData, staffData.photoFile)
      : await createStaff(createData);
      
    if (response.success) {
      setShowAddStaffOverlay(false);
      fetchStaffData(); // Refresh the list
    } else {
      console.error('Failed to create staff:', response.error);
    }
  };

  const handleStaffUpdate = async (staffData: EditStaffFormData) => {
    console.log('Updated staff data:', staffData);
    
    const updateData: UpdateStaffData = {
      name: staffData.name,
      phoneNumber: staffData.contactNumber,
      address: staffData.address,
      role: staffData.role,
      canApproveVehicles: staffData.permissions.vehicleApprovals,
      canApproveInquiries: staffData.permissions.inquiryApprovals,
      canGenerateEstimates: staffData.permissions.generateEstimates,
      canCreateJobCard: staffData.permissions.createJobCard,
      canApproveDisputes: staffData.permissions.disputeApprovals,
      canApproveQuotesPayments: staffData.permissions.quoteApprovalsPayments,
    };
    
    const response = await updateStaff(parseInt(staffData.id), updateData);
    
    if (response.success) {
      // If there's a photo to upload, do it after successful update
      if (staffData.photoFile) {
        await uploadStaffPhoto(parseInt(staffData.id), staffData.photoFile);
      }
      
      setShowEditStaffOverlay(false);
      fetchStaffData(); // Refresh the list
    } else {
      console.error('Failed to update staff:', response.error);
    }
  };

  const handleToggleStaffActive = async (staffId: string, isActive: boolean) => {
    console.log('Toggle staff active:', staffId, isActive);
    
    const id = parseInt(staffId);
    const response = isActive 
      ? await activateStaff(id)
      : await deactivateStaff(id);
      
    if (response.success) {
      fetchStaffData(); // Refresh the list
    } else {
      console.error('Failed to toggle staff status:', response.error);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    console.log('Delete staff:', staffId);
    
    const response = await deleteStaff(parseInt(staffId));
    if (response.success) {
      fetchStaffData(); // Refresh the list
    } else {
      console.error('Failed to delete staff:', response.error);
    }
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
            {isLoading ? (
              // Loading state
              <div className="flex flex-col items-center justify-center py-[60px]">
                <div className="w-[40px] h-[40px] border-4 border-[#e5383b] border-t-transparent rounded-full animate-spin mb-[16px]" />
                <p className="text-[#666] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Loading staff...
                </p>
              </div>
            ) : error ? (
              // Error state
              <div className="flex flex-col items-center justify-center py-[60px]">
                <p className="text-[#e5383b] text-[14px] mb-[8px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {error}
                </p>
                <button 
                  onClick={fetchStaffData}
                  className="text-[#e5383b] underline text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Try again
                </button>
              </div>
            ) : filteredStaff.length > 0 ? (
              <div className="flex flex-col gap-[12px]">
                {filteredStaff.map((staff) => {
                  const mappedStaff = mapToStaffMember(staff);
                  return (
                    <StaffCard
                      key={mappedStaff.id}
                      staff={mappedStaff}
                      isExpanded={expandedCardId === mappedStaff.id}
                      onToggleExpand={() => handleToggleExpand(mappedStaff.id)}
                      onEdit={() => handleEditStaff(mappedStaff.id)}
                      onView={() => handleViewStaff(mappedStaff.id)}
                    />
                  );
                })}
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
