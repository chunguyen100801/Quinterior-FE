import { createCategory, updateCategory } from '@/app/apis/category.api';
import {
  CategoryFormSchema,
  categoryFormSchema,
} from '@/utils/rules/category.rule';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { HttpStatusCode } from 'src/constants/enum';
import { CategoryItem } from 'src/types/category.type';
import { UnprocessableEntityErrorResponseType } from 'src/types/utils.type';
import { twMerge } from 'tailwind-merge';

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  VIEW = 'VIEW',
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  data?: CategoryItem | null;
}

type FormData = CategoryFormSchema;

function ModalManageCategories({ isOpen, onClose, type, data }: Props) {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      id: data?.id,
      name: data?.name ?? '',
      description: data?.description ?? '',
    },
    resolver: zodResolver(categoryFormSchema),
  });

  const id = watch('id');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setValue('id', data.id);
      setValue('name', data.name);
      setValue('description', data.description);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  const titleMapping = (type: ModalType) => {
    switch (type) {
      case ModalType.CREATE:
        return 'Create a category';
      case ModalType.UPDATE:
        return 'Update category';
      case ModalType.VIEW:
        return 'View category';
      default:
        return '';
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (type === ModalType.VIEW || isLoading) return;
    const payload = {
      name: data.name,
      description: data.description,
    };

    try {
      setIsLoading(true);
      let res;
      if (type === ModalType.CREATE) {
        res = await createCategory(payload);
      } else if (type === ModalType.UPDATE && id) {
        res = await updateCategory(id, payload);
      }

      if (
        res &&
        [HttpStatusCode.Created, HttpStatusCode.OK].includes(res.statusCode)
      ) {
        toast.success(res.message);
        router.refresh();
        onClose();
      } else if (
        res &&
        res.statusCode === HttpStatusCode.UnprocessableEntity &&
        res.data
      ) {
        const errors = res.data as UnprocessableEntityErrorResponseType[];

        errors.forEach((error) => {
          setError(error.field as keyof FormData, {
            type: 'server',
            message: error.message,
          });
        });
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="2xl"
        aria-label="Modal for managing categories"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                {titleMapping(type)}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-12 gap-4">
                  {type !== ModalType.CREATE && (
                    <div className="col-span-12">
                      <h3 className="mb-[8px] text-base font-medium text-white">
                        Id
                      </h3>
                      <Input
                        value={String(id)}
                        placeholder="Id"
                        className="text-white"
                        disabled
                      />
                      <p className="min-h-[20px] text-sm text-red-400"></p>
                    </div>
                  )}

                  <div className="col-span-12">
                    <h3 className="mb-[8px] text-base font-medium text-white">
                      Name
                    </h3>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          onValueChange={field.onChange}
                          placeholder="Name"
                          className="text-white"
                        />
                      )}
                    />

                    <p className="min-h-[20px] text-sm text-red-400">
                      {errors.name?.message}
                    </p>
                  </div>

                  <div className="col-span-12">
                    <h3 className="mb-[8px] text-base font-medium text-white">
                      Description
                    </h3>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Input
                          {...field}
                          onValueChange={field.onChange}
                          placeholder="Description"
                          className="text-white"
                        />
                      )}
                    />

                    <p className="min-h-[20px] text-sm text-red-400">
                      {errors.description?.message}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="danger"
                  variant="flat"
                  disabled={isLoading}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  className={twMerge(
                    'font-medium text-white',
                    isLoading && 'cursor-not-allowed opacity-80'
                  )}
                  type="submit"
                  disabled={isLoading}
                >
                  Submit
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalManageCategories;
