interface IconProps {
  size?: number;
  color?: string;
}

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconBox({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function IconMail({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconLock({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconEye({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.4 18.4 0 0 1 4.2-5.1M9.9 4.2A9.9 9.9 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-2.2 3.1M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export function IconUsers({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 6.5c1.4.3 2.5 1.6 2.5 3.1 0 1.5-1.1 2.8-2.5 3.1" />
      <path d="M18 14.2c2 .5 3.5 2.3 3.5 4.4" />
    </svg>
  );
}

export function IconLogout({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconEdit({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export function IconTrash({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconSearch({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function IconPlus({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconAlertTriangle({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export function IconArrowLeft({ size, color }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function IconSpinner({ size = 18, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color, animation: "spin 0.7s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
