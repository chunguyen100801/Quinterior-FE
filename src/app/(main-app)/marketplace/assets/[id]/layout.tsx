import React, { Suspense } from 'react';
import SlideShowSkeleton from '../components/SlideShowSkeleton';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<SlideShowSkeleton />}> {children}</Suspense>
    </div>
  );
}

export default Layout;
