'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Slider } from '@nextui-org/react';
import { isEmpty } from 'lodash';
import { Minus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryStringValueToObject } from '@/utils/utils-client';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';

const MAX_PRICE = 10000000; // 10,000,000 VND

const PriceFormSchema = z
  .object({
    price_min: z.string(),
    price_max: z.string(),
  })
  .refine((data) => +data.price_min >= 0, {
    message: 'Min price should be greater than or equal to 0',
    path: ['price_min'],
  })
  .refine((data) => +data.price_max <= MAX_PRICE, {
    message: `Max price should be less than or equal to ${MAX_PRICE}`,
    path: ['price_max'],
  })
  .refine(
    (data) => {
      return Number(data.price_min) <= Number(data.price_max);
    },
    {
      message: 'Min price should be less than max price',
      path: ['price_min'],
    }
  );

type PriceFormSchemaType = z.infer<typeof PriceFormSchema>;

interface Props {
  onSearchSubmit: (data: PriceFormSchemaType) => void;
}

function PriceController({ onSearchSubmit }: Props) {
  const queryParams = useAssetQueryParams();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PriceFormSchemaType>({
    defaultValues: {
      price_min: '0',
      price_max: String(MAX_PRICE),
    },
    resolver: zodResolver(PriceFormSchema),
  });

  const { price_min, price_max } = watch();

  useEffect(() => {
    if (queryParams.price) {
      const priceObj = queryStringValueToObject(queryParams.price);

      setValue('price_min', priceObj['gte']);
      setValue('price_max', priceObj['lte']);
    } else {
      setValue('price_min', '0');
      setValue('price_max', String(MAX_PRICE));
    }
  }, [queryParams.price, setValue]);

  const onSubmit = handleSubmit(onSearchSubmit);

  return (
    <>
      <form className="mt-3 flex flex-col gap-4" onSubmit={onSubmit}>
        <Slider
          aria-label="Price range"
          value={[+price_min, +price_max]}
          step={1000}
          minValue={0}
          maxValue={MAX_PRICE}
          formatOptions={{ style: 'currency', currency: 'USD' }}
          onChange={(value) => {
            if (typeof value === 'number') return;
            setValue('price_min', value[0].toString());
            setValue('price_max', value[1].toString());
          }}
        />
        <div className="flex h-[34px] items-center justify-between">
          <div className="flex h-full items-center gap-3">
            <div className="flex h-full flex-1 items-center overflow-hidden rounded-sm border border-white transition-colors focus-within:border-[#3d77c2] hover:border-[#3d77c2]">
              <span className="px-2 text-sm">₫</span>
              <input
                aria-label="Price min"
                {...register('price_min')}
                type="number"
                className="h-full w-full border-none bg-transparent pr-2 text-xs text-white outline-none"
              />
            </div>
            <Minus size={12} color="#fff" />
            <div className="flex h-full flex-1 items-center overflow-hidden rounded-sm border border-white transition-colors focus-within:border-[#3d77c2] hover:border-[#3d77c2]">
              <span className="px-2 text-sm">₫</span>
              <input
                aria-label="Price max"
                {...register('price_max')}
                type="number"
                className="h-full w-full border-none bg-transparent pr-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          isIconOnly
          color="primary"
          radius="none"
          aria-label="Search price"
          className="h-[36px] w-full min-w-[36px] rounded-sm px-4 text-white"
        >
          Apply
        </Button>
      </form>
      {!isEmpty(errors) && (
        <p className="mt-2 text-xs text-[#F31260]">
          {errors.price_min?.message || errors.price_max?.message}
        </p>
      )}
    </>
  );
}

export default PriceController;
