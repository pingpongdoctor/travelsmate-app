import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

////get products in shopping cart of the current user
export const GET = withApiAuthRequired(async () => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Please log in' }, { status: 400 });
  }

  try {
    //get current user
    const auth0Id = session.user.sub;
    const user = await prisma.user.findUnique({
      where: { auth0Id },
      include: {
        products: {
          select: {
            product: { select: { sanitySlug: true } },
            productQuantity: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Please log in' }, { status: 400 });
    }

    //get products records containing product slugs and product quantity
    const products: ProductInShoppingCart[] = user.products.map(
      (ele: {
        productQuantity: number;
        product: {
          sanitySlug: string;
        };
      }) => {
        return {
          productSlug: ele.product.sanitySlug,
          productQuantity: ele.productQuantity,
        };
      }
    );

    return NextResponse.json(
      {
        products,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log('Internal server error' + e);
    return NextResponse.json(
      {
        message: 'Internal server error' + ' ' + (e as Error).message,
      },
      { status: 500 }
    );
  }
});
