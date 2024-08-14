'use client';

import { generateImgToImg } from '@/app/apis/workspace.api';
import { mappingRange, validateImages } from '@/utils/utils-client';
import { Switch } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ImgQueueShow from '../../blueprint/blueprint-interact-components/refiner/ImgQueueShow';
import {
  CREATIVITY_RANGE,
  NUMSINFER_RANGE,
} from '../../blueprint/blueprint3D/model/constance';
import AdditionImageGuide from './AdditionImageGuide';
import GenerateForm, { QueueTask, SDXLFormShemaType } from './GenerateForm';
export default function GenerateYourIdeas() {
  const [queueTask, setQueueTask] = useState<QueueTask>({
    id: 'unknow',
    isQueueing: false,
    status: 'PENDING',
  });
  const [isRefine, setIsRefine] = useState(false);
  const [imageFile, setimageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(() => {
    if (!isRefine) setimageFile(null);
  }, [isRefine]);
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageValidation = validateImages(files, 1);
      if (!imageValidation.isValid) {
        toast.error(imageValidation.errorMessage);
        return;
      }
      try {
        const file = files[0];

        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        setimageFile(file);
        setPreviewImage(URL.createObjectURL(file));
        // const base64String = await fileToBase64(file);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };
  const [lockGenerate, setLockGenerate] = useState<boolean>(false);
  const onFormSubmit = async (data: SDXLFormShemaType) => {
    setLockGenerate(true);
    const toastId = toast.loading('Loading...');

    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append(
      'numInferenceSteps',
      mappingRange(
        data.numInferenceSteps,
        false,
        100,
        0,
        NUMSINFER_RANGE[1],
        NUMSINFER_RANGE[0]
      ).toString()
    );
    if (data.seed) {
      formData.append('seed', data.seed.toString());
    }
    formData.append(
      'guidanceScale',
      mappingRange(
        data.guidance,
        true,
        100,
        0,
        CREATIVITY_RANGE[1],
        CREATIVITY_RANGE[0]
      ).toString()
    );
    formData.append('negativePrompt2', data.negativePrompt);

    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await generateImgToImg(formData);

    if (!response) {
      toast.error('Something went wrong, cant queue task!', {
        id: toastId,
      });
      return;
    }

    toast.success('Queueing for generate... ', {
      id: toastId,
    });
    setQueueTask({
      isQueueing: true,
      id: response.id,
      status: response.status,
    });
  };
  return (
    <div className=" grid h-[75vh] w-[90vw] grid-cols-[5fr_3fr] items-center justify-center gap-10">
      <div className=" grid h-full w-full  items-center ">
        <div className=" flex h-full flex-col gap-4">
          <span
            className=" 
        text-2xl font-extrabold"
          >
            Generate Your Ideas
          </span>
          <ImgQueueShow
            queueTask={queueTask}
            setQueueTask={setQueueTask}
            setLockGenerate={setLockGenerate}
          ></ImgQueueShow>
        </div>
      </div>
      <div className="flex h-full items-center justify-center overflow-y-auto pl-1 pr-5">
        <GenerateForm lockGenerate={lockGenerate} onFormSubmit={onFormSubmit}>
          <div className=" flex items-center  gap-3 ">
            <label className="  text-sm font-bold ">Refine Structure:</label>
            <Switch
              isSelected={isRefine}
              onValueChange={setIsRefine}
              size="sm"
            ></Switch>
          </div>
          {isRefine && (
            <>
              <AdditionImageGuide
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                onFileChange={onFileChange}
                setimageFile={setimageFile}
              ></AdditionImageGuide>
              <span className=" text-sm font-extralight text-foreground/60">
                This only work best with resolution image between 1024px
              </span>
            </>
          )}
        </GenerateForm>
      </div>
    </div>
  );
}
