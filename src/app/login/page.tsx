'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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

    // Simulate login
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check for owner credentials
      if (email === 'owner@etna.com' && password === 'owner123') {
        window.location.href = '/owner/dashboard';
      } else {
        // Default to staff dashboard
        window.location.href = '/staff/dashboard';
      }
    }, 1500);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
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

          <div className="mt-6 text-center">
            <p className="text-[#99a2b6] text-[14px]">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-[#e5383b] font-semibold hover:text-[#c62f32]"
              >
                Register Now
              </Link>
            </p>
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
                setEmail('staff@etna.com');
                setPassword('staff123');
              }}
              className="w-full bg-white rounded-[8px] p-3 text-left hover:bg-[#e8ebf2] transition border border-[#d4d9e3]"
            >
              <p className="text-[12px] font-medium text-[#2b2b2b]"> Staff Login</p>
              <p className="text-[11px] text-[#99a2b6]">staff@etna.com / staff123</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('owner@etna.com');
                setPassword('owner123');
              }}
              className="w-full bg-white rounded-[8px] p-3 text-left hover:bg-[#e8ebf2] transition border border-[#d4d9e3]"
            >
              <p className="text-[12px] font-medium text-[#2b2b2b]"> Owner Login</p>
              <p className="text-[11px] text-[#99a2b6]">owner@etna.com / owner123</p>
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
