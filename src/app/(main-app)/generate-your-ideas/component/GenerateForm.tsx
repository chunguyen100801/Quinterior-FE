import { getSuggestPrompt } from '@/app/apis/find-ideas.api';
import AlertError from '@/app/auth/components/alert-error';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Slider, Spinner, Textarea } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { random } from 'lodash';
import { Dices, Lightbulb } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { QUEUESTATUS } from 'src/types/workspace.type';
import { z } from 'zod';
import SuggestPrompt from './SuggestPrompt';
export const SDXLFormShema = z.object({
  prompt: z.string().min(1, { message: 'Emty prompt!' }),
  numInferenceSteps: z
    .number()
    .min(0, 'Number of step cant be lower than 30!')
    .max(100, 'Number of step cant be larger than 50!'),
  guidance: z
    .number()
    .min(0, 'Number of guidance cant be lower than 1!')
    .max(100, 'Number of guidance cant be larger than 12!'),
  seed: z.number().optional(),
  negativePrompt: z.string().min(0),
});
export type SDXLFormShemaType = z.infer<typeof SDXLFormShema>;
export type QueueTask = {
  id: string | undefined;
  isQueueing: boolean;
  status: QUEUESTATUS;
};
export default function GenerateForm({
  lockGenerate,
  onFormSubmit,
  children,
}: {
  lockGenerate: boolean;
  onFormSubmit: (data: SDXLFormShemaType) => Promise<void>;
  children?: ReactNode;
}) {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SDXLFormShemaType>({
    defaultValues: {
      numInferenceSteps: 50,
      guidance: 50,
    },
    resolver: zodResolver(SDXLFormShema), // Hook up zodResolver
  });

  const [promptAI, setPromptAI] = useState<string>('');
  const prompt = watch('prompt');
  const onGeneratePrompt = () => {
    if (prompt != '') {
      setPromptAI(getValues('prompt'));
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['SuggestPrompt', promptAI],
    queryFn: () => getSuggestPrompt(promptAI),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <form
      className="m-auto flex w-full flex-1 flex-col gap-[1rem] font-bold "
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <Controller
        control={control}
        name="prompt"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <Textarea
              labelPlacement="outside"
              placeholder="Guidance on the desired interior design style you wish to achieve"
              type="text"
              label="Prompt"
              value={value}
              ref={ref}
              onBlur={onBlur}
              onChange={onChange}
              isInvalid={errors.prompt ? true : false}
              errorMessage={errors.prompt?.message as string}
              variant="faded"
              endContent={
                prompt ? (
                  <Lightbulb
                    onClick={onGeneratePrompt}
                    className="cursor-pointer"
                  ></Lightbulb>
                ) : (
                  <></>
                )
              }
            ></Textarea>

            {data?.positivePrompts.map((prompt, index) => (
              <SuggestPrompt key={index} prompt={prompt}></SuggestPrompt>
            ))}
          </>
        )}
      />

      <Controller
        control={control}
        name="negativePrompt"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <Textarea
              placeholder="Guidance on things you do not want to see in the image"
              labelPlacement="outside"
              type="text"
              label="Negative Prompt"
              value={value}
              ref={ref}
              onBlur={onBlur}
              onChange={onChange}
              isInvalid={errors.negativePrompt ? true : false}
              errorMessage={errors.negativePrompt?.message as string}
              variant="faded"
            ></Textarea>

            {data && (
              <SuggestPrompt prompt={data.negativePrompt}></SuggestPrompt>
            )}
          </>
        )}
      />
      {isLoading && promptAI && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Spinner size="md"></Spinner>
        </div>
      )}

      <Controller
        control={control}
        name="numInferenceSteps"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Slider
            size="md"
            color="primary"
            label="Image Quality"
            // hideValue={true}
            value={value}
            ref={ref}
            onBlur={onBlur}
            onChange={onChange}
          ></Slider>
        )}
      />

      <Controller
        control={control}
        name="guidance"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Slider
            size="md"
            color="primary"
            label="Creativity"
            // hideValue={true}
            value={value}
            ref={ref}
            onBlur={onBlur}
            onChange={onChange}
          ></Slider>
        )}
      />

      <Controller
        name="seed"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Your lucky number"
            labelPlacement="outside"
            type="number"
            label="Seed"
            value={field.value?.toString()}
            isInvalid={errors.seed ? true : false}
            errorMessage={errors.seed?.message as string}
            variant="bordered"
            onChange={(value) => {
              field.onChange(parseInt(value.target.value));
            }}
            endContent={
              <Dices
                className="cursor-pointer"
                onClick={() => {
                  const randomValue = random(0, 100000000, false);
                  setValue('seed', randomValue, {
                    shouldDirty: true,
                  });
                  // Manually trigger a re-render if necessary
                  field.onChange(randomValue);
                }}
              />
            }
          />
        )}
      />
      {children}
      <AlertError>{errors?.root?.serverError.message}</AlertError>
      {!lockGenerate && (
        <Button
          type="submit"
          className="w-full bg-gradient-to-l from-[#0CC8FF] to-[#9260FF] font-bold"
        >
          Generate
        </Button>
      )}
    </form>
  );
}
