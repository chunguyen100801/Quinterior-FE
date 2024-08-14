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
  Textarea,
} from '@nextui-org/react';
import { Pencil, Star } from 'lucide-react';
import { OrderItemsType } from 'src/types/order.type';
import { ReviewPostSchemaType } from 'src/types/review.type';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserInFo } from '@/lucia-auth/auth-actions';
import { editReview } from '@/app/apis/review.api';

interface Props {
  orderItem: OrderItemsType;
  user: UserInFo | undefined;
}

export default function EditComment({ orderItem, user }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [rating, setRating] = useState(orderItem.review.rating);
  const [hoverRating, setHoverRating] = useState(1);
  const [comment, setComment] = useState(orderItem.review.comment);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const onCloseModal = () => {
    onClose();
  };

  const { handleSubmit } = useForm();

  const onSubmitEdit = async () => {
    if (isLoading) return;
    if (!comment) {
      toast.error('Please enter a comment');
      return;
    }

    const toastId = toast.loading('Loading...');
    setIsLoading(true);

    const body: ReviewPostSchemaType = {
      rating,
      comment,
      orderItemId: orderItem.id,
      creatorId: String(user?.id),
    };

    try {
      const response = await editReview(orderItem.review.id, body);

      if (response?.error) {
        toast.error('Edited failed!', {
          id: toastId,
        });
      } else {
        toast.success('Edited successfully!', {
          id: toastId,
        });
      }
      onCloseModal();
      router.refresh();
      return;
    } catch (error) {
      toast.error('An unexpected error occurred!', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        variant="light"
        radius="sm"
        type="button"
        className=" text-sky-400"
      >
        <Pencil size={16} /> Edit Review
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'py-6',
          backdrop: 'bg-[#292f46]/50 backdrop-opacity-40',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'border-b-[1px] border-[#292f46]',
          footer: 'border-t-[1px] border-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
      >
        <form>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  <Pencil size={20} /> Edit this review!
                </ModalHeader>
                <ModalBody>
                  <div className="mb-2 mt-0 flex items-center gap-2">
                    <div>Star rating: </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        strokeWidth={0.75}
                        key={i}
                        size={20}
                        fill={
                          i < hoverRating
                            ? '#effb09'
                            : i < rating
                              ? '#effb09'
                              : 'transparent'
                        }
                        onClick={() => handleStarClick(i)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(rating)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                  <Textarea
                    variant="bordered"
                    label="Review"
                    placeholder="Write your review here..."
                    defaultValue={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
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
                    type="submit"
                    value="editReview"
                    isDisabled={isLoading}
                    onClick={handleSubmit(onSubmitEdit)}
                  >
                    Update
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
