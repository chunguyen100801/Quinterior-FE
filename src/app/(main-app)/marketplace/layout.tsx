export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Footer from '../../../components/Footer';
import Header from './components/Header';

export const metadata: Metadata = {
  title: '3D Collection',
  description:
    'Immerse yourself in our collection of cutting-edge 3D interior models. Elevate your design projects with realistic and customizable representations. Explore now for a new dimension in interior creativity.',
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Suspense>{children}</Suspense>
      <Footer />
    </div>
  );
}

export default Layout;
