// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5196/api';

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.errors?.[0] || 'An error occurred',
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// ==========================================
// WORKSHOP REGISTRATION (New Flow)
// ==========================================

// Send OTP for phone verification
export async function sendRegistrationOtp(phoneNumber: string) {
  return apiRequest<{ success: boolean; message: string; expiresInSeconds: number }>(
    '/workshop/register/send-otp',
    {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    }
  );
}

// Verify OTP during registration
export async function verifyRegistrationOtp(phoneNumber: string, otp: string) {
  return apiRequest<{ success: boolean; message: string; token: string | null }>(
    '/workshop/register/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    }
  );
}

// Submit workshop registration
export interface WorkshopRegistrationData {
  ownerName: string;
  phoneNumber: string;
  email?: string;
  aadhaarNumber: string;
  workshopName: string;
  address: string;
  landmark?: string;
  pinCode: string;
  city: string;
}

export async function submitWorkshopRegistration(data: WorkshopRegistrationData) {
  return apiRequest<{ success: boolean; message: string; workshopId: number; status: string }>(
    '/workshop/register/submit',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// ==========================================
// EXISTING WORKSHOP OWNER REGISTRATION (Legacy)
// ==========================================

// Workshop Owner Registration
export interface RegisterOwnerData {
  ownerName: string;
  email: string;
  phoneNumber: string;
  password: string;
  workshopName: string;
  address: string;
  city: string;
  tradeLicense: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: number;
    ownerName: string;
    email: string;
    registrationStatus: string;
  };
}

export async function registerOwner(data: RegisterOwnerData) {
  return apiRequest<RegisterResponse>('/workshopowner/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Email Verification
export interface VerifyEmailData {
  email: string;
  otp: string;
}

export async function verifyEmail(data: VerifyEmailData) {
  return apiRequest<{ message: string }>('/workshopowner/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Resend OTP
export async function resendOtp(email: string) {
  return apiRequest<{ message: string }>('/workshopowner/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ETNA Verification - Initiate
export interface InitiateETNAData {
  ownerEmail: string;
  etnaMemberName: string;
  etnaMemberPhone: string;
}

export async function initiateETNAVerification(data: InitiateETNAData) {
  return apiRequest<{ message: string }>('/verification/etna/initiate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ETNA Verification - Complete
export interface CompleteETNAData {
  ownerEmail: string;
  etnaMemberName: string;
  etnaMemberPhone: string;
  etnaOtp: string;
  ownerOtp: string;
}

export interface ETNAVerificationResponse {
  success: boolean;
  message: string;
  nextStep: string;
  registrationStatus: string;
}

export async function completeETNAVerification(data: CompleteETNAData) {
  return apiRequest<ETNAVerificationResponse>('/verification/etna/complete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Photo Upload
export async function uploadOwnerPhoto(email: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/verification/photos/owner?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || data.errors?.[0] || 'Upload failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function uploadWorkshopPhoto(email: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/verification/photos/workshop?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || data.errors?.[0] || 'Upload failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function completePhotoUpload(email: string) {
  return apiRequest<{
    success: boolean;
    message: string;
    registrationStatus: string;
    isActive: boolean;
  }>('/verification/photos/complete', {
    method: 'POST',
    body: JSON.stringify({ ownerEmail: email }),
  });
}

// Login
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    workshopName: string;
    city: string;
    isEmailVerified: boolean;
    isActive: boolean;
    registrationStatus: string;
  };
  message: string;
}

export async function login(data: LoginData) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get Workshop Owner by Email
export async function getOwnerByEmail(email: string) {
  return apiRequest<{
    id: number;
    email: string;
    registrationStatus: string;
  }>(`/workshopowner/by-email/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

// ==========================================
// WORKSHOP STAFF REGISTRATION
// ==========================================

// Get workshops by city (for dropdown)
export interface WorkshopListItem {
  id: number;
  workshopName: string;
  ownerName: string;
  address: string;
  city: string;
}

export async function getWorkshopsByCity(city: string) {
  return apiRequest<WorkshopListItem[]>(`/workshopstaff/workshops/${encodeURIComponent(city)}`, {
    method: 'GET',
  });
}

// Staff Registration
export interface StaffRegisterData {
  name: string;
  city: string;
  workshopOwnerId: number;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface StaffResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  workshopOwnerId: number;
  workshopName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  registrationStatus: string;
}

export async function registerStaff(data: StaffRegisterData) {
  return apiRequest<{ message: string; data: StaffResponse }>('/workshopstaff/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Staff Phone Verification (SMS OTP)
export async function verifyStaffPhone(phoneNumber: string, otp: string) {
  return apiRequest<{ message: string; data: StaffResponse }>('/workshopstaff/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, otp }),
  });
}

// Resend Staff OTP (SMS)
export async function resendStaffOtp(phoneNumber: string) {
  return apiRequest<{ message: string }>('/workshopstaff/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
}

// Check Staff Registration Status
export async function checkStaffStatus(email: string) {
  return apiRequest<StaffResponse>(`/workshopstaff/status/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

// Get Pending Staff Requests (for owner)
export interface PendingStaffRequest {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  requestedAt: string;
}

export async function getPendingStaffRequests(workshopOwnerId: number, token: string) {
  return apiRequest<PendingStaffRequest[]>(`/workshopstaff/pending/${workshopOwnerId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Approve/Reject Staff Request (for owner)
export async function processStaffApproval(
  staffId: number,
  approve: boolean,
  token: string,
  rejectionReason?: string
) {
  return apiRequest<{ message: string; data: StaffResponse }>('/workshopstaff/approve', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      staffId,
      approve,
      rejectionReason,
    }),
  });
}

// ==========================================
// OCR SCANNING (Vehicle Plate & RC Card)
// ==========================================

export interface VehicleOcrData {
  plateNumber: string | null;
  ownerName: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  year: number | null;
  variant: string | null;
  chassisNumber: string | null;
  engineNumber: string | null;
  fuelType: string | null;
  registrationDate: string | null;
  success: boolean;
  errorMessage: string | null;
}

// Scan vehicle number plate
export async function scanVehiclePlate(base64Image: string) {
  return apiRequest<VehicleOcrData>('/ocr/scan-plate', {
    method: 'POST',
    body: JSON.stringify({ base64Image, mode: 'plate' }),
  });
}

// Scan RC (Registration Certificate) card
export async function scanRcCard(base64Image: string) {
  return apiRequest<VehicleOcrData>('/ocr/scan-rc', {
    method: 'POST',
    body: JSON.stringify({ base64Image, mode: 'rc' }),
  });
}

// Generic scan (pass mode as parameter)
export async function scanVehicleImage(base64Image: string, mode: 'plate' | 'rc') {
  return apiRequest<VehicleOcrData>('/ocr/scan', {
    method: 'POST',
    body: JSON.stringify({ base64Image, mode }),
  });
}

// ==========================================
// VEHICLE MANAGEMENT
// ==========================================

export interface CreateVehicleData {
  plateNumber: string;
  brand?: string;
  model?: string;
  year?: number;
  variant?: string;
  chassisNumber?: string;
  ownerName: string;
  contactNumber: string;
  odometerReading?: string;
  observations?: string;
}

export interface VehicleResponse {
  id: number;
  plateNumber: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  variant: string | null;
  chassisNumber: string | null;
  ownerName: string;
  contactNumber: string;
  odometerReading: string | null;
  observations: string | null;
  observationsAudioUrl: string | null;
  workshopOwnerId: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface VehicleListResponse {
  vehicles: VehicleResponse[];
  totalCount: number;
}

// Create a new vehicle
export async function createVehicle(data: CreateVehicleData) {
  return apiRequest<VehicleResponse>('/vehicle', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Create vehicle with audio file
export async function createVehicleWithAudio(data: CreateVehicleData, audioBlob?: Blob) {
  const formData = new FormData();
  
  // Append all vehicle data fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  // Append audio file if provided
  if (audioBlob) {
    formData.append('audioFile', audioBlob, 'observations.webm');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/with-audio`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to create vehicle' };
    }
    
    return { success: true, data: result as VehicleResponse };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Get all vehicles
export async function getVehicles() {
  return apiRequest<VehicleListResponse>('/vehicle', {
    method: 'GET',
  });
}

// Get vehicle by ID
export async function getVehicleById(id: number) {
  return apiRequest<VehicleResponse>(`/vehicle/${id}`, {
    method: 'GET',
  });
}

// Update vehicle
export async function updateVehicle(id: number, data: CreateVehicleData & { status: number }) {
  return apiRequest<VehicleResponse>(`/vehicle/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete vehicle
export async function deleteVehicle(id: number) {
  return apiRequest<{ message: string }>(`/vehicle/${id}`, {
    method: 'DELETE',
  });
}
