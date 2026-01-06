import Image from 'next/image';

interface VehicleCardProps {
  plateNumber: string;
  year: number;
  make: string;
  model: string;
  specs: string;
  services: string[];
  additionalServices?: number;
}

export default function VehicleCard({
  plateNumber,
  year,
  make,
  model,
  specs,
  services,
  additionalServices = 0,
}: VehicleCardProps) {
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
                alt={`${make} ${model}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Plate Number Badge */}
          <div className="absolute right-[12px] top-[12px] bg-white h-[33px] px-[10px] rounded-[7px] flex items-center justify-center">
            <p className="font-bold text-[12px] text-red-600 text-center tracking-[-0.41px]">
              {plateNumber}
            </p>
          </div>
        </div>

        {/* Bottom Section: Vehicle Info and Services */}
        <div className="px-[16px] pb-[16px] pt-[8px]">
          {/* Vehicle Name */}
          <h3 className="font-semibold text-[17px] text-[#e5383b] mb-[4px] leading-tight">
            {year} {make} {model}
          </h3>

          {/* Specs */}
          <p className="font-normal text-[12px] text-[#99a2b6] mb-[12px]">
            {specs}
          </p>

          {/* Service Tags */}
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
        </div>
      </div>
    </div>
  );
}
