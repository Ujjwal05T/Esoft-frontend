'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate registration
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Redirect to login
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3f4] to-white flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[440px] mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-[#e5383b] font-bold text-[48px] leading-tight">
              ETNA
            </div>
            <div className="text-[#e5383b] font-bold text-[20px] tracking-wider">
              SPARES
            </div>
          </div>
          <p className="text-[#99a2b6] text-[14px] mt-2">
            Staff Management System
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-[16px] shadow-lg p-8">
          <h1 className="text-[28px] font-bold text-[#2b2b2b] mb-2">
            Create Account
          </h1>
          <p className="text-[#99a2b6] text-[14px] mb-8">
            Join ETNA Spares team today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(value) => handleChange('fullName', value)}
              error={errors.fullName}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              }
            />

            <AuthInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              }
            />

            <AuthInput
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              error={errors.phone}
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
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              }
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              }
            />

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-[#d4d9e3] text-[#e5383b] focus:ring-[#e5383b] focus:ring-2"
              />
              <label htmlFor="terms" className="text-[#2b2b2b] text-[14px]">
                I agree to the{' '}
                <Link href="/terms" className="text-[#2294f2] hover:text-[#1c7acc] font-medium">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#2294f2] hover:text-[#1c7acc] font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <AuthButton type="submit" loading={loading}>
              Create Account
            </AuthButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#99a2b6] text-[14px]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-[#e5383b] font-semibold hover:text-[#c62f32]"
              >
                Sign In
              </Link>
            </p>
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
