import { redirect } from 'next/navigation';
import { getAllOrdersOnServerSide } from '../_lib/getAllOrdersOnServerSide';
import { getUserProfileFromServer } from '../_lib/getUserProfileFromServer';
import HistoryOrderListComponent from '../_components/HistoryOrderListComponent';
import { addImgUrlsAndDescriptionToOrders } from '../_lib/addImgUrlsToOrders';

//force page to be dynamically rendered (SSR page)
//next.js renders pages statically by default so whenever we use dynamic functions like next.js header(), we need to force it rendered dynamically. Otherwise, it will throw erros.
export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage() {
  const userData = await getUserProfileFromServer();

  if (!userData) {
    redirect('/api/auth/login');
  }

  const ordersWithoutDetailedProducts: Order[] =
    await getAllOrdersOnServerSide();

  const ordersWithDetailedProducts: Order[] =
    await addImgUrlsAndDescriptionToOrders(ordersWithoutDetailedProducts);

  if (ordersWithDetailedProducts.length > 0) {
    return (
      <div className="px-4 md:px-8 lg:px-12 xl:mx-auto xl:max-w-7xl">
        <h2 className="mb-4">Order history</h2>
        <p className="mb-8">
          Check the status of recent orders, manage returns, and discover
          similar products.
        </p>
        <HistoryOrderListComponent
          ordersWithDetailedProducts={ordersWithDetailedProducts}
        />
      </div>
    );
  } else {
    return <h3 className="h-[60vh]">You have not had any orders yet</h3>;
  }
}
