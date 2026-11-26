interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inverted';
  showText?: boolean;
}

export function TechifyMark({
  className = 'w-5 h-5',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Architectural T silhouette with chamfered tech bar and notched stem */}
      <path
        d="M5 6.5C5 5.67157 5.67157 5 6.5 5H27L24.2 10.2H18.75V25.2C18.75 26.1941 17.9441 27 16.95 27H13.5V10.2H5V6.5Z"
        fill="currentColor"
      />
      <path
        d="M19.8 11.4L24.4 11.4L20.8 17.2H19.8V11.4Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  );
}

export function BrandLogo({
  size = 'md',
  variant = 'default',
  showText = true,
}: BrandLogoProps) {
  const boxClass =
    size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : size === 'sm'
        ? 'w-9 h-9 rounded-xl'
        : 'w-10 h-10 rounded-xl';
  const iconClass =
    size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-5 h-5' : 'w-5 h-5';
  const textClass =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';

  const containerColors =
    variant === 'inverted'
      ? 'bg-white dark:bg-white text-[#0F766E] dark:text-[#0F766E] shadow-sm'
      : 'bg-[#0F766E] text-white shadow-sm shadow-teal-900/10';

  const labelColor = variant === 'inverted' ? 'text-white' : 'text-slate-900';

  return (
    <div className="inline-flex items-center gap-2.5 shrink-0 select-none">
      <div className={`${boxClass} ${containerColors} flex items-center justify-center`}>
        <TechifyMark className={iconClass} />
      </div>
      {showText && (
        <span
          className={`${textClass} font-display font-bold tracking-tight ${labelColor} whitespace-nowrap`}
        >
          Techify
        </span>
      )}
    </div>
  );
}
