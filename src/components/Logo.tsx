import React from 'react';

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    width="360" 
    height="80" 
    viewBox="0 0 360 80" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    {...props}
  >
    <title>Cudowna Doniczka – logo</title>
    <g fill="none" fillRule="evenodd">
      {/* Ikona doniczki */}
      <g transform="translate(16,8)">
        {/* cień */}
        <ellipse cx="48" cy="56" rx="22" ry="6" fill="#D9CBB4" opacity="0.45"/>
        {/* misa */}
        <path d="M26 26h44v16c0 9-9.8 16-22 16S26 51 26 42V26z" fill="#F5EFE6"/>
        {/* krawędź */}
        <ellipse cx="48" cy="26" rx="22" ry="8" fill="#E3D6C3" />
        <ellipse cx="48" cy="26" rx="19" ry="6" fill="#F5EFE6"/>
        {/* łodyga */}
        <path d="M48 14c0 8-1 14-3 20h6c-2-6-3-12-3-20z" fill="#4E8C5A"/>
        {/* liść lewy */}
        <path d="M42 18c-4-4-7-9-7-13 5 0 10 2 13 5-2 4-4 6-6 8z" fill="#78B56A"/>
        {/* liść prawy */}
        <path d="M54 18c4-4 7-9 7-13-5 0-10 2-13 5 2 4 4 6 6 8z" fill="#6BAA63"/>
        {/* delikatne kropki akwarelowe */}
        <circle cx="32" cy="10" r="2" fill="#CFE4C8" opacity="0.7"/>
        <circle cx="64" cy="8" r="1.8" fill="#DDEBCE" opacity="0.8"/>
        <circle cx="70" cy="20" r="1.5" fill="#C4DFC0" opacity="0.8"/>
      </g>

      {/* Napis */}
      <text x="100" y="50"
            fontFamily="'Poppins', 'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="26"
            fontWeight="bold"
            fill="#294431"
            style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: 'scaleY(1.3)' }}>
        Cudowna Doniczka
      </text>
    </g>
  </svg>
);
