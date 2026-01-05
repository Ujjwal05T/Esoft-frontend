import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e5383b] to-[#8c2424] flex items-center justify-center p-4">
      <div className="max-w-[440px] w-full mx-auto text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="text-white font-bold text-[72px] leading-tight">
            ETNA
          </div>
          <div className="text-white font-bold text-[32px] tracking-wider">
            SPARES
          </div>
          <p className="text-white/80 text-[16px] mt-4">
            Staff Management System
          </p>
        </div>

        {/* Description */}
        <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-8 mb-8">
          <h1 className="text-white text-[24px] font-bold mb-4">
            Welcome to ETNA Spares
          </h1>
          <p className="text-white/90 text-[14px] leading-relaxed">
            A comprehensive vehicle management system designed for workshop staff to manage vehicle inventory, track inquiries, handle job cards, and process vehicle documentation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full h-[56px] bg-white text-[#e5383b] rounded-[12px] font-bold text-[16px] flex items-center justify-center hover:bg-white/90 transition-all shadow-lg"
          >
            Sign In to Dashboard
          </Link>

          <Link
            href="/register"
            className="block w-full h-[56px] bg-transparent border-2 border-white text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center hover:bg-white/10 transition-all"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-white/60 text-[12px]">
            © 2026 ETNA Spares. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
