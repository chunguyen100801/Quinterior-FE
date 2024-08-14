import React from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';

import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
const MontserratFont = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quinterior',
  description: 'Generated quick pesonalize interiors',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background text-foreground dark ">
      <body className={`${MontserratFont.className} h-full`}>
        <Providers>
          {children}
          <Toaster
            richColors={true}
            position="bottom-right"
            visibleToasts={10}
            duration={2500}
            // closeButton={true}
            theme="system"
          />
        </Providers>
      </body>
    </html>
  );
}
