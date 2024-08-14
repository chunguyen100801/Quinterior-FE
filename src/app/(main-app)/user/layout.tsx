import { validateRequest } from '@/lucia-auth/lucia';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import Footer from '../../../components/Footer';
import Header from '../marketplace/components/Header';
import Sidebar from './components/SideBar';

export const metadata: Metadata = {
  title: 'QUINTERIOR',
  description: '',
};

async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/auth');
  }

  return (
    <div>
      <Header />
      <div className="container_custom">
        <div className="mb-8 mt-4 flex justify-between">
          <div className="w-[18%]">
            <Sidebar />
          </div>
          <div className="w-[81%]">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
