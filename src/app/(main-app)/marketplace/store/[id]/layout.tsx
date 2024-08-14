import React, { Suspense } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense> {children}</Suspense>
    </div>
  );
}

export default Layout;
