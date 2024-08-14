import { capitalizeFirstLetter } from '@/utils/utils-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ObjectModify,
  ObjectModifyManager,
  objectValue,
} from '../../blueprint3D/helper/objectModifyManager';
export default function SelectedForm({
  selectedItem,
  objectModifyManager,
}: {
  selectedItem: ObjectModify;
  objectModifyManager: ObjectModifyManager;
}) {
  const values: Record<string, objectValue['value']> = {};
  Object.entries(selectedItem.modifyInfo).forEach(([key, value]) => {
    values[key] = value.value;
  });
  type inferType = z.infer<typeof selectedItem.zod>;
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors },
  } = useForm<inferType>({
    resolver: zodResolver(selectedItem.zod),
    values,
  });
  const onLoginSubmit = async (data: inferType) => {
    // console.log(
    //   objectModifyManager.selectedRefFloolplanObject,
    //   'wwwwwwwwwwwwwwwwwwwwwwwwww'
    // );
    // if (!objectModifyManager.selectedRefFloolplanObject) {
    //   setError('root.objectError', {
    //     message: 'Cant find this object',
    //   });
    // }
    objectModifyManager.applyObject(data);
  };
  const displaySelect = (
    label: string,
    display: objectValue['display'],
    value: objectValue['value'],
    register: UseFormRegister<{
      [x: string]: unknown;
    }>,
    errors: FieldErrors<{
      [x: string]: unknown;
    }>
  ) => {
    if (display == 'show') {
      return (
        <span className=" text-medium">
          {capitalizeFirstLetter(label)}: {value}
        </span>
      );
    }
    if (display == 'text-box') {
      return (
        <Input
          variant="bordered"
          label={capitalizeFirstLetter(label)}
          isInvalid={errors[label] ? true : false}
          defaultValue={value as string}
          errorMessage={errors[label]?.message as string}
          {...register(label)}
        />
      );
    }

    if (display == 'number-input') {
      return (
        <Input
          variant="bordered"
          label={capitalizeFirstLetter(label)}
          type="number"
          defaultValue={value as string}
          isInvalid={errors[label] ? true : false}
          errorMessage={errors[label]?.message as string}
          {...register(label, { valueAsNumber: true })}
        />
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onLoginSubmit)}
      className=" flex flex-col gap-5 "
    >
      {Object.entries(selectedItem.modifyInfo).map((el) => {
        return (
          <div key={el[0]}>
            <div>
              {displaySelect(
                el[0],
                el[1].display,
                el[1].value,
                register,
                errors
              )}
            </div>
          </div>
        );
      })}
      {/* <AlertError>{errors?.root?.objectError.message}</AlertError> */}
      <div className=" flex w-full items-center justify-center">
        <Button
          variant="solid"
          color="primary"
          className="w-[30%]"
          type="submit"
        >
          Change
        </Button>
      </div>
    </form>
  );
}
