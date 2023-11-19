'use client'
import React from 'react';
import { UserProvider } from '../context';

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
        <UserProvider>
            <body >{children}</body>
        </UserProvider>
      
    </html>
  )
}
