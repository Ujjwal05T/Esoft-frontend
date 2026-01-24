'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import Image from 'next/image';
import { login } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phoneNumber?: string; password?: string; api?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { phoneNumber?: string; password?: string } = {};

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call login API
    setLoading(true);
    try {
      const response = await login(phoneNumber, password);
      
      if (response.success && response.data?.user) {
        // Redirect based on role
        if (response.data.user.role === 'owner') {
          router.push('/owner/dashboard');
        } else {
          router.push('/staff/dashboard');
        }
      } else {
        setErrors({ api: response.error || 'Login failed. Please try again.' });
      }
    } catch {
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3f4] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <Image
              src="/assets/logos/etna-logo.svg"
              alt="ETNA SPARES"
              width={132}
              height={72}
              className="object-contain"
            />
          </div>
          <p className="text-[#99a2b6] text-[14px] mt-2">
            Staff Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[16px] shadow-lg p-8">
          <h1 className="text-[28px] font-bold text-[#2b2b2b] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#99a2b6] text-[14px] mb-8">
            Sign in to access your dashboard
          </p>

          {/* API Error Display */}
          {errors.api && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="text-red-600 text-[14px]">{errors.api}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label="Phone Number"
              type="tel"
              placeholder="Enter your 10-digit phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              error={errors.phoneNumber}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              }
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#d4d9e3] text-[#e5383b] focus:ring-[#e5383b] focus:ring-2"
                />
                <span className="text-[#2b2b2b] text-[14px]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[#2294f2] text-[14px] hover:text-[#1c7acc] font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <AuthButton type="submit" loading={loading}>
              Sign In
            </AuthButton>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-[#99a2b6] text-[14px]">
              Don&apos;t have an account?
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/register"
                className="text-[#e5383b] font-semibold hover:text-[#c62f32] text-[14px]"
              >
                Register as Owner
              </Link>
              <span className="text-[#d4d9e3]">|</span>
              <Link
                href="/register-staff"
                className="text-[#2294f2] font-semibold hover:text-[#1c7acc] text-[14px]"
              >
                Join as Staff
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-[#f5f3f4] rounded-[12px] p-4">
          <p className="text-[#2b2b2b] text-[12px] font-semibold mb-3 text-center">
             Demo Credentials
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('9876543210');
                setPassword('staff123');
              }}
              className="w-full bg-white rounded-[8px] p-3 text-left hover:bg-[#e8ebf2] transition border border-[#d4d9e3]"
            >
              <p className="text-[12px] font-medium text-[#2b2b2b]"> Staff Login</p>
              <p className="text-[11px] text-[#99a2b6]">9876543210 / staff123</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('9876543211');
                setPassword('owner123');
              }}
              className="w-full bg-white rounded-[8px] p-3 text-left hover:bg-[#e8ebf2] transition border border-[#d4d9e3]"
            >
              <p className="text-[12px] font-medium text-[#2b2b2b]"> Owner Login</p>
              <p className="text-[11px] text-[#99a2b6]">9876543211 / owner123</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#99a2b6] text-[12px]">
            © 2026 ETNA Spares. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
