import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

// House icon - Single Family Home
export function HouseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Building icon - Multi-Family
export function BuildingIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Apartment icon - HOA/COA
export function ApartmentIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 21h18M3 7v1a3 3 0 003 3h0a3 3 0 003-3V7m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M3 7h18m-9 4v4m0 0h4m-4 0H9m3 0v6"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="1"
        className="stroke-current"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Commercial icon - Commercial Properties
export function CommercialIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 21h18M4 21V8l8-5 8 5v13M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
