'use client';
import { addNewWorkPlace } from '@/app/apis/projects.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
// Define Zod schema for form validation
const newWorkSpaceschema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(40, { message: 'Name is too long' }),
});
export type NewWorkSpaceType = z.infer<typeof newWorkSpaceschema>;
export default function AddWorkSpace() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewWorkSpaceType>({
    resolver: zodResolver(newWorkSpaceschema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const onSubmit = async (data: NewWorkSpaceType) => {
    const toastId = toast.loading('Loading...');
    try {
      const response = await addNewWorkPlace(data);
      if (response)
        toast.success('New floor plan created!', {
          id: toastId,
        });
      setIsOpen(false);
    } catch (error) {
      toast.error('Fail to create new floor plan!', {
        id: toastId,
      });
      setIsOpen(false);
    }
  };

  return (
    <Popover
      placement="right"
      showArrow
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button
          color="primary"
          className="w-min-fit h-[3rem] font-bold"
          startContent={<PlusIcon size={25} />}
        >
          NEW PROJECT
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] rounded-lg">
        {(titleProps) => (
          <div className="w-full px-1 py-2">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Add New Project
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 flex w-full  gap-2"
            >
              <Input
                {...register('name')}
                label="Name"
                placeholder="Enter project name"
                size="sm"
                variant="bordered"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message as string}
                className=" w-[20rem]"
              />
              <Button type="submit" color="primary" className="mt-2">
                Submit
              </Button>
            </form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
