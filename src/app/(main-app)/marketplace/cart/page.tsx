export const dynamic = 'force-dynamic';
import { getCart, getSimilarCartItems } from '@/app/apis/cart.api';
import { validateRequest } from '@/lucia-auth/lucia';
import { redirect } from 'next/navigation';
import Cart from './components/Cart';

async function Page() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth');
  }

  const [cart, similarAssets] = await Promise.all([
    getCart(),
    getSimilarCartItems({ page: 1, take: 4 }),
  ]);

  return (
    <div className="container_custom py-[40px]">
      {cart && cart.length > 0 ? (
        <Cart similarItems={similarAssets || []} data={cart} />
      ) : (
        <div className="px-4 pb-20 text-white">Empty cart...</div>
      )}
    </div>
  );
}

export default Page;
