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
