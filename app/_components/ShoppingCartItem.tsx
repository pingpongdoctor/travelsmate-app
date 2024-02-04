'use client';
import Image from 'next/image';
import { solidBlureDataUrl } from '../utils/utils';
import { SanityDocument } from 'next-sanity';
import ChangeItemQuatityComponent from './ChangeItemQuatityComponent';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface Props {
  product: ProductWithImgUrl & SanityDocument & { productQuantity: number };
}

export default function ShoppingCartItem({ product }: Props) {
  return (
    <div className="flex gap-6 last:mb-0">
      <Image
        src={product.imgUrl}
        placeholder="blur"
        blurDataURL={solidBlureDataUrl}
        priority
        alt="product-img-shopping-cart"
        width={300}
        height={300}
        className="object-fit aspect-[1/1.2] w-48 rounded-md object-cover object-center transition-all hover:opacity-90"
      />

      <div className="grow">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex justify-between sm:block">
            <p className="text-nowrap">{product.title}</p>
            <XMarkIcon className="block h-6 text-gray-400 sm:hidden" />
          </div>
          <p className="block sm:hidden">${product.price}</p>
          <ChangeItemQuatityComponent product={product} />
        </div>
        <p className="hidden text-gray-900 sm:block">${product.price}</p>
      </div>
    </div>
  );
}
