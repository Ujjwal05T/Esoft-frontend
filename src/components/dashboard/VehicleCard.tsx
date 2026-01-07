import Image from 'next/image';

interface VehicleCardProps {
  plateNumber: string;
  year: number;
  make: string;
  model: string;
  specs: string;
  services?: string[];
  additionalServices?: number;
  variant?: 'default' | 'compact' | 'scan' | 'approve-big';
  addedBy?: string;
  onApprove?: () => void;
  onView?: () => void;
}

export default function VehicleCard({
  plateNumber,
  year,
  make,
  model,
  specs,
  services = [],
  additionalServices = 0,
  variant = 'default',
  addedBy,
  onApprove,
  onView,
}: VehicleCardProps) {
  const vehicleName = `${year} ${make} ${model}`;

  // Scan page variant (with approval buttons) - matches Figma "approve small" design
  if (variant === 'scan') {
    return (
      <div className="rounded-[17px] w-full relative max-w-[408px] overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col">
          {/* Top Section: Image and Plate Number */}
          <div className="relative h-[140px] w-full">
            {/* Vehicle Image */}
            <div className="absolute inset-0 pr-[110px] pl-[10px] py-[10px]">
              <div className="relative w-full h-full">
                <Image
                  src="/assets/images/toyota-crysta.png"
                  alt={vehicleName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Plate Number Badge */}
            <div className="absolute right-[12px] top-[12px] bg-[#d4d9e3] h-[33px] px-[10px] rounded-[7px] flex items-center justify-center">
              <p className="font-bold text-[12px] text-black tracking-[-0.41px]">
                {plateNumber}
              </p>
            </div>
          </div>

          {/* Content section */}
          <div className="px-[16px] pb-[8px] pt-[8px]">
            {/* Added by text */}
            {addedBy && (
              <p className="font-normal text-[12px] text-[#e5383b] mb-[4px]">
                Added by {addedBy}
              </p>
            )}

            {/* Vehicle info */}
            <h3 className="font-semibold text-[17px] text-[#161a1d] leading-tight mb-[2px]">
              {vehicleName}
            </h3>
            <p className="font-normal text-[12px] text-[#99a2b6] mb-[12px]">
              {specs}
            </p>
          </div>
          {/* Action buttons */}
            <div className="flex">
              <button
                onClick={onApprove}
                className="flex-1 bg-[#161a1d] h-[48px] rounded-bl-[7px] flex items-center justify-center hover:opacity-90 transition"
              >
                <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={onView}
                className="flex-1 bg-[#f0f0f0] h-[48px] rounded-br-[7px] flex items-center justify-center hover:bg-[#e5e5e5] transition"
              >
                <svg className="w-[20px] h-[20px] text-[#161a1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
        </div>
      </div>
    );
  }



  // Approve big variant
  if (variant === 'approve-big') {
    return (
      <div className="rounded-[17px] w-full relative max-w-[366px] overflow-hidden" style={{ background: 'linear-gradient(12deg, white 45%, #b2b9c8 96%)' }}>
        <div className="flex flex-col p-[12px]">
          <div className="flex gap-[12px] items-start mb-[8px]">
            <div className="relative h-[80px] w-[100px] flex-shrink-0">
              <Image
                src="/assets/images/toyota-crysta.png"
                alt={vehicleName}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              {addedBy && (
                <p className="font-normal text-[11px] text-[#e5383b] mb-[4px]">
                  Added by {addedBy}
                </p>
              )}
              <h3 className="font-semibold text-[17px] text-[#161a1d] leading-tight mb-[4px]">
                {vehicleName}
              </h3>
              <p className="font-normal text-[11px] text-[#161a1d]">
                {specs}
              </p>
            </div>
            <div className="bg-white h-[33px] px-[10px] rounded-[7px] flex items-center justify-center">
              <p className="font-bold text-[12px] text-[#e5383b] tracking-[-0.41px]">
                {plateNumber}
              </p>
            </div>
          </div>

          <div className="flex gap-[8px]">
            <button
              onClick={onApprove}
              className="flex-1 bg-[#161a1d] h-[48px] rounded-[7px] flex items-center justify-center hover:opacity-90 transition"
            >
              <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={onView}
              className="flex-1 bg-[#f0f0f0] h-[48px] rounded-[7px] flex items-center justify-center hover:bg-[#e5e5e5] transition"
            >
              <svg className="w-[20px] h-[20px] text-[#161a1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="rounded-[17px] w-full relative max-w-[408px] overflow-hidden" style={{ background: 'linear-gradient(10deg, white 0%, #d4d9e3 100%)' }}>
        <div className="flex flex-col p-[12px] gap-[8px]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-[17px] text-[#e5383b] leading-tight mb-[4px]">
                {vehicleName}
              </h3>
              <p className="font-normal text-[12px] text-[#99a2b6]">
                {specs}
              </p>
            </div>
            <div className="bg-white h-[33px] px-[10px] rounded-[7px] flex items-center justify-center ml-[12px]">
              <p className="font-bold text-[12px] text-red-600 tracking-[-0.41px]">
                {plateNumber}
              </p>
            </div>
          </div>

          {/* Service Tags */}
          {services.length > 0 && (
            <div className="flex gap-[8px] items-center flex-wrap">
              {services.slice(0, 2).map((service, index) => (
                <div
                  key={index}
                  className="bg-[#f0f0f0] h-[32px] px-[12px] rounded-[7px] flex items-center justify-center"
                >
                  <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px] whitespace-nowrap">
                    {service}
                  </p>
                </div>
              ))}
              {additionalServices > 0 && (
                <div className="bg-[#f0f0f0] h-[32px] w-[46px] rounded-[7px] flex items-center justify-center">
                  <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px]">
                    +{additionalServices}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }



  // Default variant (full card with services)
  return (
    <div className="rounded-[17px] w-full relative max-w-[408px] overflow-hidden shadow-sm" style={{ background: 'linear-gradient(10deg, white 0%, #d4d9e3 100%)' }}>
      <div className="flex flex-col">
        {/* Top Section: Image and Plate Number */}
        <div className="relative h-[140px] w-full">
          {/* Vehicle Image */}
          <div className="absolute inset-0 pr-[110px] pl-[10px] py-[10px]">
            <div className="relative w-full h-full">
              <Image
                src="/assets/images/toyota-crysta.png"
                alt={vehicleName}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Plate Number Badge */}
          <div className="absolute right-[12px] top-[12px] bg-white h-[33px] px-[10px] rounded-[7px] flex items-center justify-center">
            <p className="font-bold text-[12px] text-red-600 tracking-[-0.41px]">
              {plateNumber}
            </p>
          </div>
        </div>

        {/* Bottom Section: Vehicle Info and Services */}
        <div className="px-[16px] pb-[16px] pt-[8px]">
          {/* Vehicle Name */}
          <h3 className="font-semibold text-[17px] text-[#e5383b] mb-[4px] leading-tight">
            {vehicleName}
          </h3>

          {/* Specs */}
          <p className="font-normal text-[12px] text-[#99a2b6] mb-[12px]">
            {specs}
          </p>

          {/* Service Tags */}
          {services.length > 0 && (
            <div className="flex gap-[8px] items-center flex-wrap">
              {services.slice(0, 2).map((service, index) => (
                <div
                  key={index}
                  className="bg-[#f0f0f0] h-[32px] px-[12px] rounded-[7px] flex items-center justify-center"
                >
                  <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px] whitespace-nowrap">
                    {service}
                  </p>
                </div>
              ))}
              {additionalServices > 0 && (
                <div className="bg-[#f0f0f0] h-[32px] w-[46px] rounded-[7px] flex items-center justify-center">
                  <p className="font-medium text-[11px] text-[#525252] text-center tracking-[-0.41px]">
                    +{additionalServices}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
