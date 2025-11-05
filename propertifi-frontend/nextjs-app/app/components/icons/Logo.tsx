import * as React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "full" | "icon";
}

export function Logo({ variant = "full", className, ...props }: LogoProps) {
  if (variant === "icon") {
    // Icon-only version (P letter in a shield/house shape)
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        {/* House/Shield background */}
        <path
          d="M20 2L4 12v16c0 6.627 7.163 10 16 10s16-3.373 16-10V12L20 2z"
          className="fill-primary-600"
        />
        {/* Letter P */}
        <path
          d="M16 14h6c2.21 0 4 1.79 4 4s-1.79 4-4 4h-2v4h-4V14zm4 6c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4h2z"
          className="fill-white"
        />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Icon part */}
      <path
        d="M20 2L4 12v16c0 6.627 7.163 10 16 10s16-3.373 16-10V12L20 2z"
        className="fill-primary-600"
      />
      <path
        d="M16 14h6c2.21 0 4 1.79 4 4s-1.79 4-4 4h-2v4h-4V14zm4 6c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4h2z"
        className="fill-white"
      />

      {/* Text "Propertifi" */}
      <text
        x="45"
        y="28"
        className="fill-slate-900 font-heading font-bold"
        style={{ fontSize: "24px" }}
      >
        Propertifi
      </text>
    </svg>
  );
}
