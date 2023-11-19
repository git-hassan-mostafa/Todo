import React from 'react'

export default function Circule() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <defs>
                <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#d1a8ec" />
                    <stop offset="1" stopColor="#2d2b52" />
                </linearGradient>
            </defs>
            <path id="Circle" d="M15.375,5.8A9.573,9.573,0,1,1,8.6,8.6a9.537,9.537,0,0,1,6.773-2.8m0-2.423a12,12,0,1,0,12,12,12,12,0,0,0-12-12Z" transform="translate(-3.375 -3.375)" fill="url(#linear-gradient)" />
            <rect x="11" y="6" width="2" height="12" fill="url(#linear-gradient)" />
            <rect x="6" y="11" width="12" height="2" fill="url(#linear-gradient)" />
        </svg>


    )
}
