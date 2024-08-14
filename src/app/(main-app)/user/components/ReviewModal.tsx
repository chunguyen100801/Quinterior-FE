'use client';
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
  Divider,
} from '@nextui-org/react';

import { useForm } from 'react-hook-form';
import { Coins } from 'lucide-react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { OrderType } from 'src/types/order.type';
import { formatPriceSV } from '@/utils/utils-client';
import CommentForm from './CommentForm';
import { CommentType } from 'src/constants/enum';
import { ReviewDataList } from 'src/types/review.type';
import { addReview } from '@/app/apis/review.api';
import { UserInFo } from '@/lucia-auth/auth-actions';
import EditComment from './EditComment';

interface Props {
  orderData?: OrderType;
  user: UserInFo | undefined;
}

export default function ReviewModal({ orderData, user }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { handleSubmit, control } = useForm<ReviewDataList>();

  const onSubmit = async (data: ReviewDataList) => {
    if (isLoading) return;

    const emptyComments = data.items.some((item) => !item.comment);
    if (emptyComments) {
      toast.error('Please fill in all comments');
      return;
    }

    const toastId = toast.loading('Loading...');
    setIsLoading(true);

    const reviewPromises = data.items.map((review) => {
      const reviewData = {
        ...review,
        creatorId: String(user?.id),
      };
      return addReview(reviewData);
    });

    try {
      const responses = await Promise.all(reviewPromises);

      const hasError = responses.some(
        (response) => response && 'error' in response
      );
      if (hasError) {
        toast.error('Review failed!', { id: toastId });
      } else {
        toast.success('Review successfully!', { id: toastId });
        router.refresh();
        onClose();
      }
    } catch (error) {
      toast.error('An unexpected error occurred!', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const checkReviewExist = orderData?.orderItems?.some((item) => !item?.review);

  return (
    <div className="w-full items-center justify-center">
      <Button
        onPress={onOpen}
        color="primary"
        variant="ghost"
        radius="sm"
        className=" font-bold md:w-full"
      >
        Review products
      </Button>

      <Modal
        scrollBehavior={'inside'}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'py-6',
          backdrop: 'bg-[#2e3965]/50 backdrop-opacity-40 w-full h-full',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'border-b-[1px] border-[#292f46]',
          footer: 'border-t-[1px] border-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
        placement="top-center"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  Review Products
                </ModalHeader>
                <ModalBody>
                  <div className="flex w-full min-w-min flex-col">
                    {orderData?.orderItems?.map((data, index) => (
                      <div key={index}>
                        <div className="flex w-full justify-between">
                          <div className="flex space-x-2">
                            <Avatar
                              radius="sm"
                              className="h-12 w-12"
                              src={data?.product?.thumbnail || ''}
                            />

                            <div className="flex flex-col text-base">
                              <div className="flex max-w-md  text-gray-50">
                                {data?.product?.name || ''}
                              </div>
                              <div className=" flex text-sm text-slate-200">
                                <Coins
                                  size={16}
                                  strokeWidth={1}
                                  className="mr-2"
                                />
                                {formatPriceSV(Number(data?.price)) || 0}
                              </div>
                            </div>
                          </div>
                          {data?.review && (
                            <div className="flex items-center justify-center">
                              <EditComment orderItem={data} user={user} />
                            </div>
                          )}
                        </div>

                        {!data?.review && (
                          <div className="w-full">
                            <CommentForm
                              commentType={CommentType.REVIEW}
                              orderItemId={data?.id}
                              control={control}
                              index={index as number}
                            />
                          </div>
                        )}
                        {index < orderData?.orderItems?.length - 1 && (
                          <Divider className="my-8" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    {/* <p className="min-h-[20px] text-sm text-red-400">
                      {errors.address?.message}
                    </p> */}
                  </div>
                </ModalBody>
                <ModalFooter>
                  {checkReviewExist && (
                    <>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        isDisabled={isLoading}
                      >
                        Close
                      </Button>
                      <Button
                        color="primary"
                        name="submitAction"
                        value="addReview"
                        type="submit"
                        isDisabled={isLoading}
                      >
                        Post
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
}
