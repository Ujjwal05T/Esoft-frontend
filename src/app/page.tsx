import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#f5f3f4] to-white border-b border-[#171717]/5">
        <div className="max-w-[440px] md:max-w-[1200px] mx-auto px-[16px] md:px-[48px] pt-[40px] md:pt-[80px] pb-[60px] md:pb-[100px]">
          <div className="flex flex-col md:flex-row md:items-center gap-[32px] md:gap-[100px]">
            {/* Left Side - Logo & Headline */}
            <div className="flex-1">
              <Image
                src="/assets/logos/etna-logo.svg"
                alt="ETNA SPARES"
                width={80}
                height={80}
                className="mb-[24px] md:mb-[40px] md:w-[240px] md:h-[240px]"
              />
              <h1 className="text-[#171717] text-[20px] md:text-[42px] font-black leading-[1.1] tracking-[-1.28px] md:tracking-[-2.24px] mb-[16px] md:mb-[24px]">
                Streamline Your Workshop Operations
              </h1>
            </div>

            {/* Right Side - Description & CTA */}
            <div className="flex-1">
              <p className="text-[#171717]/70 text-[18px] md:text-[20px] leading-[1.6] mb-[24px] md:mb-[32px]">
                Manage vehicles, track inquiries, process job cards, and handle documentation—all in one powerful platform built for workshop staff.
              </p>

              {/* Feature Highlights */}
              <div className="mb-[32px] md:mb-[48px] text-lg space-y-[16px] md:space-y-[20px]">
                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] rounded-full bg-[#e5383b]/10 flex items-center justify-center flex-shrink-0 mt-[2px] md:mt-[4px]">
                    <div className="w-[12px] h-[12px] md:w-[12px] md:h-[12px] rounded-full bg-[#e5383b]"></div>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[18px] md:text-[18px] mb-[4px] md:mb-[6px]">Real-time Vehicle Tracking</h3>
                    <p className="text-[#171717]/60 text-[15px] md:text-[15px] leading-[1.5]">Monitor all assigned vehicles and their status instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] rounded-full bg-[#2294f2]/10 flex items-center justify-center flex-shrink-0 mt-[2px] md:mt-[4px]">
                    <div className="w-[12px] h-[12px] md:w-[12px] md:h-[12px] rounded-full bg-[#2294f2]"></div>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[18px] md:text-[18px] mb-[4px] md:mb-[6px]">Streamlined Parts Inquiries</h3>
                    <p className="text-[#171717]/60 text-[15px] md:text-[15px] leading-[1.5]">Request and approve parts with seamless workflow</p>
                  </div>
                </div>

                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] rounded-full bg-[#f24822]/10 flex items-center justify-center flex-shrink-0 mt-[2px] md:mt-[4px]">
                    <div className="w-[12px] h-[12px] md:w-[12px] md:h-[12px] rounded-full bg-[#f24822]"></div>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[18px] md:text-[18px] mb-[4px] md:mb-[6px]">Efficient Job Management</h3>
                    <p className="text-[#171717]/60 text-[15px] md:text-[15px] leading-[1.5]">Process job cards and documentation effortlessly</p>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[440px] md:max-w-[1200px] mx-auto px-[16px] md:px-[48px] py-[48px] md:py-[100px]">
        <h2 className="text-[28px] md:text-[42px] font-black text-[#171717] mb-[24px] md:mb-[48px] tracking-[-1.12px] md:tracking-[-1.68px] text-center md:text-left">
          Powerful Features for Your Workshop
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-[16px] md:gap-[24px]">
          {/* Vehicle Management Card */}
          <div className="bg-[#f24822] h-[180px] md:h-[280px] overflow-clip relative rounded-[9px] md:rounded-[12px] hover:scale-105 transition-transform cursor-pointer shadow-lg">
            <div className="absolute left-[16px] md:left-[24px] top-[20px] md:top-[32px]">
              <p className="font-semibold text-[#f5f3f4] text-[18px] md:text-[22px] tracking-[-0.72px] md:tracking-[-0.88px] mb-[8px] md:mb-[12px]">
                Vehicle Management
              </p>
              <p className="text-white/90 text-[13px] md:text-[15px] leading-[1.5] max-w-[200px] md:max-w-[240px]">
                Track and manage your entire vehicle inventory with real-time updates
              </p>
            </div>
            <div className="absolute right-[16px] md:right-[24px] w-[36px] md:w-[48px] h-[36px] md:h-[48px] bottom-[16px] md:bottom-[24px]">
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="Go"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute h-[140px] md:h-[200px] right-0 mix-blend-color-burn top-[40px] md:top-[50px] w-[160px] md:w-[220px]">
              <Image
                src="/assets/vectors/vehicle-vector.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Inquiry Tracking Card */}
          <div className="bg-[#2294f2] h-[180px] md:h-[280px] overflow-clip relative rounded-[9px] md:rounded-[12px] hover:scale-105 transition-transform cursor-pointer shadow-lg">
            <div className="absolute left-[16px] md:left-[24px] top-[20px] md:top-[32px]">
              <p className="font-semibold text-[#f5f3f4] text-[18px] md:text-[22px] tracking-[-0.72px] md:tracking-[-0.88px] mb-[8px] md:mb-[12px]">
                Inquiry Tracking
              </p>
              <p className="text-white/90 text-[13px] md:text-[15px] leading-[1.5] max-w-[200px] md:max-w-[240px]">
                Monitor and approve parts inquiries efficiently with streamlined workflow
              </p>
            </div>
            <div className="absolute right-[16px] md:right-[24px] w-[36px] md:w-[48px] h-[36px] md:h-[48px] bottom-[16px] md:bottom-[24px]">
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="Go"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute right-0 mix-blend-overlay w-[120px] md:w-[160px] h-[120px] md:h-[160px] top-[60px] md:top-[90px]">
              <Image
                src="/assets/vectors/inquiry-vector.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Job Cards Card */}
          <div className="bg-gradient-to-b from-[#e5383b] to-[#bb282b] h-[180px] md:h-[280px] overflow-clip relative rounded-[9px] md:rounded-[12px] hover:scale-105 transition-transform cursor-pointer shadow-lg">
            <div className="absolute left-[16px] md:left-[24px] top-[20px] md:top-[32px] z-10">
              <p className="font-black leading-[1.2] text-[28px] md:text-[38px] text-white tracking-[-1.12px] md:tracking-[-1.52px] max-w-[220px] md:max-w-[280px]">
                Job Card Processing
              </p>
            </div>
            <div className="absolute left-[16px] md:left-[24px] top-[120px] md:top-[180px] w-[36px] md:w-[48px] h-[36px] md:h-[48px] z-10">
              <Image
                src="/assets/icons/arrow-diagonal.svg"
                alt="Add"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-[#f5f3f4] py-[48px] md:py-[100px]">
        <div className="max-w-[440px] md:max-w-[1200px] mx-auto px-[16px] md:px-[48px]">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-[40px] md:gap-[80px] md:items-center">
            <div>
              <h2 className="text-[28px] md:text-[42px] font-black text-[#171717] mb-[16px] md:mb-[24px] tracking-[-1.12px] md:tracking-[-1.68px]">
                Why Choose ETNA Spares?
              </h2>
              <p className="text-[#171717]/70 text-[15px] md:text-[18px] leading-[1.6] mb-[24px] md:mb-[32px]">
                Built specifically for workshop staff, our platform simplifies complex workflows and improves team collaboration.
              </p>

              <div className="space-y-[20px] md:space-y-[24px]">
                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-[6px] bg-[#e5383b] flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <svg className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[16px] md:text-[18px] mb-[4px]">Intuitive Interface</h3>
                    <p className="text-[#171717]/60 text-[14px] md:text-[15px]">Easy to learn and use, no technical expertise required</p>
                  </div>
                </div>

                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-[6px] bg-[#2294f2] flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <svg className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[16px] md:text-[18px] mb-[4px]">Secure & Reliable</h3>
                    <p className="text-[#171717]/60 text-[14px] md:text-[15px]">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>

                <div className="flex items-start gap-[12px] md:gap-[16px]">
                  <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-[6px] bg-[#f24822] flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <svg className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#171717] font-bold text-[16px] md:text-[18px] mb-[4px]">24/7 Support</h3>
                    <p className="text-[#171717]/60 text-[14px] md:text-[15px]">Get help whenever you need it from our dedicated team</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] md:rounded-[16px] p-[32px] md:p-[48px] shadow-xl">
              <h3 className="text-[24px] md:text-[32px] font-black text-[#171717] mb-[12px] md:mb-[16px] tracking-[-0.96px] md:tracking-[-1.28px]">
                Ready to Get Started?
              </h3>
              <p className="text-[#171717]/70 text-[14px] md:text-[16px] mb-[24px] md:mb-[32px] leading-[1.6]">
                Join your team and start managing workshop operations more efficiently today.
              </p>

              <div className="space-y-[12px] md:space-y-[16px]">
                <Link
                  href="/login"
                  className="block w-full h-[56px] md:h-[64px] bg-gradient-to-b from-[#e5383b] to-[#bb282b] text-white rounded-[9px] md:rounded-[12px] font-bold text-[16px] md:text-[18px] flex items-center justify-center hover:opacity-90 transition-all shadow-md"
                >
                  Sign In to Dashboard
                </Link>
                <Link
                  href="/register"
                  className="block w-full h-[56px] md:h-[64px] bg-white border-2 border-[#e5383b] text-[#e5383b] rounded-[9px] md:rounded-[12px] font-bold text-[16px] md:text-[18px] flex items-center justify-center hover:bg-[#e5383b]/5 transition-all"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-[32px] md:py-[40px]">
        <div className="max-w-[440px] md:max-w-[1200px] mx-auto px-[16px] md:px-[48px]">
          <div className="text-center">
            <p className="text-[#171717]/40 text-[12px] md:text-[14px]">
              © 2026 ETNA Spares. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
