import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

//create or update an userproduct record (if update, we add more product quantity to the current quantity)
export const POST = withApiAuthRequired(async (req: Request, context) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: 'user is not found on Auth0 cloud database',
      },
      { status: 400 }
    );
  }

  const { productQuantity }: { productQuantity: number } = await req.json();

  const productSlug = context.params?.slug as string | undefined;

  if (!productSlug || !productQuantity) {
    return NextResponse.json(
      { message: 'Missed required data' },
      { status: 400 }
    );
  }

  try {
    //get user
    const auth0Id: string = session.user.sub;
    const userData = await prisma.user.findUnique({ where: { auth0Id } });

    if (!userData) {
      return NextResponse.json(
        { message: 'user is not found in app database' },
        { status: 400 }
      );
    }

    //get product
    const product: {
      id: number;
    } | null = await prisma.product.findUnique({
      where: { sanitySlug: productSlug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'product not found' },
        {
          status: 201,
        }
      );
    }

    await prisma.usersProducts.upsert({
      where: {
        userId_productId: {
          userId: userData.id,
          productId: product.id,
        },
      },
      create: {
        productQuantity,
        user: {
          connect: { id: userData.id },
        },
        product: {
          connect: {
            id: product.id,
          },
        },
      },
      update: {
        productQuantity: { increment: productQuantity }, //add more product
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'successful ' },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.log('Internal server error' + e);
    return NextResponse.json(
      {
        message:
          'Internal server error' + (e as Error).name + (e as Error).message,
      },
      { status: 500 }
    );
  }
});

// update the value of the productQuantity field of an userproduct record with a new value
export const PUT = withApiAuthRequired(async (req: Request, context) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: 'user is not found on Auth0 cloud database',
      },
      { status: 400 }
    );
  }

  const productSlug = context.params?.slug as string | undefined;

  const { productQuantity } = await req.json();

  if (!productSlug || !productQuantity) {
    return NextResponse.json(
      { message: 'Missed required params' },
      { status: 400 }
    );
  }

  try {
    //get user
    const auth0Id: string = session.user.sub;
    const userData = await prisma.user.findUnique({ where: { auth0Id } });

    if (!userData) {
      return NextResponse.json(
        { message: 'user is not found in app database' },
        { status: 400 }
      );
    }

    //get product
    const product: {
      id: number;
    } | null = await prisma.product.findUnique({
      where: { sanitySlug: productSlug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'product not found' },
        {
          status: 201,
        }
      );
    }

    //update userproduct record
    await prisma.usersProducts.update({
      where: {
        userId_productId: {
          userId: userData.id,
          productId: product.id,
        },
      },
      data: {
        productQuantity: Number(productQuantity),
      },
    });

    return NextResponse.json(
      { message: 'successful ' },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.log('Internal server error' + e);
    return NextResponse.json(
      {
        message:
          'Internal server error' + (e as Error).name + (e as Error).message,
      },
      { status: 500 }
    );
  }
});
