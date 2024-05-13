import { client } from '@/sanity/lib/client';
import { PRODUCT_QUERY } from '@/sanity/lib/queries';
import { SanityDocument } from 'next-sanity';
import { builder } from '../utils/imageBuilder';

export async function addImgUrlsAndDescriptionToOrders(
  orders: Order[]
): Promise<Order[]> {
  try {
    const ordersWithProductImgUrls = await Promise.all(
      [...orders].map(async (order) => {
        for (let i = 0; i < order.purchasedProducts.length; i++) {
          const sanityProduct: SanityProduct & SanityDocument =
            await client.fetch<SanityProduct & SanityDocument>(PRODUCT_QUERY, {
              slug: order.purchasedProducts[i].sanitySlug,
            });

          //if there is not sanity product or image found, set the imgUrl field undefined
          if (!sanityProduct?.images[0] || !sanityProduct?.detail) {
            console.log(
              'image not found for' +
                order.purchasedProducts[i].titleAtTheOrderTime
            );
            order.purchasedProducts[i].imgUrl = undefined;
            continue;
          }

          //add image url
          order.purchasedProducts[i].detail = sanityProduct.detail;
          order.purchasedProducts[i].imgUrl = builder
            .image(sanityProduct.images[0])
            .quality(80)
            .url();
        }

        return order;
      })
    );

    return ordersWithProductImgUrls as Order[];
  } catch (e: any) {
    console.log('Error in addImgUrlsAndDescriptionToOrders' + e);
    return [];
  }
}
