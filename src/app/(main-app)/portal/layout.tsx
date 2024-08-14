export const dynamic = 'force-dynamic';
import { UserInFo, getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { getMyStore } from '@/app/apis/publisher.api';
import { PublisherInfoType } from 'src/types/publisher.type';

export const metadata: Metadata = {
  title: 'Portal',
  description: 'Portal for the marketplace.',
};

async function Layout({ children }: { children: React.ReactNode }) {
  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }
  const user = await getUserInFo();
  const storeProfile = await getMyStore();

  return (
    <>
      <Header
        user={user as UserInFo}
        storeProfile={storeProfile as PublisherInfoType}
      />
      <div className="flex h-[calc(100vh-60px)]">
        <Sidebar />
        <main className="h-full flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}

export default Layout;
