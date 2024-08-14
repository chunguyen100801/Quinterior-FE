'use client';
import { Button, Input, Spinner } from '@nextui-org/react';
import React, { useLayoutEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddressSection from './AddressSection';
import { AddressType } from 'src/types/address.type';
import { useAppSelector } from '@/app/store/hooks';
import { useRouter } from 'next/navigation';
import { formatPriceSV } from '@/utils/utils-client';
import {
  Controller,
  FieldErrors,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { OrderFormSchema, orderFormSchema } from '@/utils/rules/order.rule';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HttpStatusCode, PaymentType } from 'src/constants/enum';
import { createOrder } from '@/app/apis/order.api';
import { UnprocessableEntityErrorResponseType } from 'src/types/utils.type';
import { twMerge } from 'tailwind-merge';

interface Props {
  addresses?: AddressType[] | null;
}

function PaymentForm({ addresses }: Props) {
  const router = useRouter();
  const { data } = useAppSelector((state) => state.payment);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAddress =
    Array.isArray(addresses) && addresses.length > 0
      ? addresses.find((item) => item.isDefault) ?? addresses[0]
      : null;

  const products =
    data?.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })) ?? [];

  const totalPrice =
    data?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ??
    0;

  const { handleSubmit, formState, ...methods } = useForm<OrderFormSchema>({
    defaultValues: {
      note: '',
      addressId: defaultAddress?.id,
      products,
      paymentType: PaymentType.TRANSFER,
    },
    resolver: zodResolver(orderFormSchema),
  });

  const { errors } = formState;

  useLayoutEffect(() => {
    if (!data || data.length === 0) {
      router.push('/marketplace/cart');
    }
  }, [data]);

  const onInvalid = (errors: FieldErrors<OrderFormSchema>) => {
    Object.keys(errors).forEach((key) => {
      if (key === 'note') return;
      toast.error(
        errors?.[key as keyof OrderFormSchema]?.message ?? 'An error occurred'
      );
    });
  };

  const onValid = async (data: OrderFormSchema) => {
    setIsLoading(true);
    try {
      const res = await createOrder(data);

      console.log('res', res);

      if (res?.statusCode === HttpStatusCode.Created) {
        if (res.data.url?.finalVnpUrl) {
          router.push(res.data.url.finalVnpUrl);
        } else {
          toast.error('An error occurred while processing payment');
        }
      } else if (
        res?.statusCode === HttpStatusCode.UnprocessableEntity &&
        res.data
      ) {
        const errors =
          res.data as unknown as UnprocessableEntityErrorResponseType[];

        errors.forEach((error) => {
          methods.setError(error.field as keyof OrderFormSchema, {
            type: 'server',
            message: error.message,
          });
        });
      } else {
        toast.error(res?.message ?? 'An error occurred');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(onValid, onInvalid);

  return (
    <FormProvider
      {...methods}
      handleSubmit={handleSubmit}
      formState={formState}
    >
      <form onSubmit={onSubmit}>
        <AddressSection data={addresses} />
        <div className="mb-4 bg-[#151517] p-6">
          <div className="grid grid-cols-12 border-b border-divider py-4">
            <div className="col-span-8">
              <h4 className="font-medium text-white">Product</h4>
            </div>
            <div className="col-span-1">
              <h4 className="text-center font-medium text-white">Price</h4>
            </div>
            <div className="col-span-1">
              <h4 className="text-center font-medium text-white">Quantity</h4>
            </div>
            <div className="col-span-2">
              <h4 className="text-right font-medium text-white">Total</h4>
            </div>
          </div>

          <div className="mb-8">
            {data &&
              data.map((item) => (
                <ProductItem key={item.productId} data={item} />
              ))}
          </div>
          <h5 className="text-right text-[18px] text-white">
            Total price:{' '}
            <span className="ml-6 text-blue-400">
              {formatPriceSV(totalPrice)}
            </span>
          </h5>
        </div>

        <div className="mb-4 bg-[#151517] p-6">
          <div className="flex items-start gap-4">
            <p className="mt-2">Message: </p>
            <div className="flex-1">
              <Controller
                control={methods.control}
                name="note"
                render={({ field }) => (
                  <Input
                    {...field}
                    onValueChange={field.onChange}
                    radius="sm"
                    placeholder="Note to seller"
                  />
                )}
              />
              <p className="ml-2 min-h-[20px] text-sm text-red-400">
                {errors.note?.message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <Button
              color="primary"
              className={twMerge(
                'rounded-[4px] font-medium',
                isLoading && 'opacity-50'
              )}
              type="submit"
              size="lg"
              disabled={isLoading}
            >
              Checkout
              {isLoading && <Spinner size="sm" color="white" />}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default PaymentForm;
