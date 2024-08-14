import GenerateForm, {
  SDXLFormShemaType,
} from '@/app/(main-app)/generate-your-ideas/component/GenerateForm';
import { generateImgToImg } from '@/app/apis/workspace.api';
import { mappingRange } from '@/utils/utils-client';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { QUEUESTATUS } from 'src/types/workspace.type';
import {
  CREATIVITY_CONTROLNET_RANGE,
  NUMSINFER_RANGE,
} from '../../blueprint3D/model/constance';
import ImgQueueShow from './ImgQueueShow';
import { ImgContext } from './refineSidePanel';

export type QueueTask = {
  id: string | undefined;
  isQueueing: boolean;
  status: QUEUESTATUS;
};

export default function RefineForm() {
  const { blob, projectData } = useContext(ImgContext);
  const [queueTask, setQueueTask] = useState<QueueTask>({
    id: undefined,
    isQueueing: false,
    status: 'PENDING',
  });
  const [lockGenerate, setLockGenerate] = useState<boolean>(false);

  const onFormSubmit = async (data: SDXLFormShemaType) => {
    setLockGenerate(true);
    if (!projectData || !blob) return;
    const toastId = toast.loading('Loading...');
    const formData = new FormData();

    formData.append('prompt', data.prompt);

    formData.append('image', blob);
    formData.append('workspaceId', projectData.id.toString());
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
        CREATIVITY_CONTROLNET_RANGE[1],
        CREATIVITY_CONTROLNET_RANGE[0]
      ).toString()
    );
    formData.append('negativePrompt2', data.negativePrompt);

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
    blob && (
      <>
        <span
          className=" 
      text-2xl font-extrabold"
        >
          Photo Refiner
        </span>
        {queueTask.id && (
          <div className=" h-[16rem]">
            <ImgQueueShow
              queueTask={queueTask}
              setQueueTask={setQueueTask}
              setLockGenerate={setLockGenerate}
            ></ImgQueueShow>
          </div>
        )}

        <GenerateForm
          lockGenerate={lockGenerate}
          onFormSubmit={onFormSubmit}
        ></GenerateForm>
      </>
    )
  );
}
