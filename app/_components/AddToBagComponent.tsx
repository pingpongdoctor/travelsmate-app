'use client';
import { FormEvent, useEffect, useContext } from 'react';
import ButtonComponent from './ButtonComponent';
import ListComponent from './ListComponent';
import { useState } from 'react';
import { addProductToCart } from '../_lib/addProductToCart';
import { notify } from './ReactToastifyProvider';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserProfileFromClientSide } from '../_lib/getUserProfileFromClientSide';
import { User } from '@prisma/client';
import { generateProductInstockList } from '../_lib/generateProductInstockList';
import { globalStatesContext } from './GlobalStatesContext';
import { useRouter } from 'next/navigation';
interface Props {
  productSlug: string;
  productInstock: number;
}

export default function AddToBagComponent({
  productSlug,
  productInstock,
}: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<Omit<User, 'auth0Id'> | null>(
    null
  );
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const { setIsNewProductAddedToCart } = useContext(globalStatesContext);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      getUserProfileFromClientSide().then(
        (userData: Omit<User, 'auth0Id'> | undefined) => {
          if (userData) {
            setUserProfile(userData);
          }
        }
      );
    }
  }, [user]);

  const handleUpdateQuantity = function (value: number) {
    setQuantity(value);
  };

  const handleSubmitProductForUser = async function (
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (!userProfile) {
      notify('info', 'Please log in to write a review', 'login-info');
      return;
    }

    if (!productSlug) {
      console.log('Missed required values');
      return;
    }

    try {
      setIsDisable(true);
      const isSuccess = await addProductToCart(productSlug, quantity);

      if (isSuccess) {
        notify(
          'success',
          'Product has been added to your cart',
          'add-product-to-cart-success'
        );
        setIsNewProductAddedToCart(true);
      }
    } catch (e: any) {
      console.log(
        'Error submiting products for the current user' + ' ' + e.message
      );
    } finally {
      setIsDisable(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitProductForUser}
      className="flex flex-col gap-52"
    >
      <ListComponent
        selectedValue={quantity}
        listComponentChangeEventHandler={handleUpdateQuantity}
        listData={generateProductInstockList(productInstock)}
      />
      <ButtonComponent isDisabled={isDisable} buttonName="Add to bag" animate />
    </form>
  );
}
