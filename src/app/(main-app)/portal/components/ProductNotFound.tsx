import { FrownIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function ProductNotFound() {
  return (
    <main className="flex h-[500px] flex-col items-center justify-center gap-2">
      <FrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested asset.</p>
      <Link
        href="/portal"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}

export default ProductNotFound;
