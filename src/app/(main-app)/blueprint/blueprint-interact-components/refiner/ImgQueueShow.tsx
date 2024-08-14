import { PoolingImgQueue } from '@/app/apis/workspace.api';
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Frown } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'sonner';
import { QUEUESTATUS } from 'src/types/workspace.type';
import { QueueTask } from './RefineForm';

const mapStatus: Record<QUEUESTATUS, string> = {
  COMPLETE: 'Compelete generate',
  FAILED: 'Fail',
  PENDING: 'Generating...',
  QUEUE: 'Queueing...',
  PROMPT_NOT_INTERIOR: 'Prompt not related to interior!',
  IMAGE_NOT_INTERIOR: 'Image not related to interior!',
};
export default function ImgQueueShow({
  queueTask,
  setQueueTask,
  setLockGenerate,
}: {
  queueTask: QueueTask;
  setQueueTask: Dispatch<SetStateAction<QueueTask>>;
  setLockGenerate: Dispatch<SetStateAction<boolean>>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useQuery({
    queryKey: [queueTask.id],
    queryFn: () => PoolingImgQueue(queueTask.id!),
    refetchInterval: (query) => {
      if (query.state.dataUpdateCount < 20) {
        return 3000;
      } else {
        setQueueTask({
          id: 'unknow',
          isQueueing: false,
          status: 'FAILED',
        });
        toast.error('Take too long generate!', {
          closeButton: true,
          duration: Infinity,
        });
        setLockGenerate(false);
        return false;
      }
    },
    refetchIntervalInBackground: true,
    enabled: queueTask.isQueueing,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.status === 'COMPLETE') {
      setQueueTask((prevTask) => ({
        ...prevTask,
        isQueueing: false,
        status: 'COMPLETE',
      }));
      setLockGenerate(false);
    }
    if (data?.status === 'PENDING') {
      setQueueTask((prevTask) => ({
        ...prevTask,
        status: 'PENDING',
      }));
    }

    if (data?.status === 'FAILED') {
      setQueueTask((prevTask) => ({
        ...prevTask,
        isQueueing: false,
        status: data.status,
      }));
      setLockGenerate(false);
    }
    if (data?.status == 'PROMPT_NOT_INTERIOR') {
      setQueueTask((prevTask) => ({
        ...prevTask,
        isQueueing: false,
        status: data.status,
      }));
      setLockGenerate(false);
    }

    if (data?.status == 'IMAGE_NOT_INTERIOR') {
      setQueueTask((prevTask) => ({
        ...prevTask,
        isQueueing: false,
        status: data.status,
      }));
      setLockGenerate(false);
    }
  }, [data, setLockGenerate, setQueueTask]);

  console.log(data);
  return (
    queueTask.id && (
      <div className=" h-full w-full rounded-lg p-2 outline outline-2 outline-foreground-50 ">
        <div className="relative flex h-full  items-center justify-center overflow-hidden rounded-lg  ">
          {data?.url && (
            <Image
              src={data?.url}
              alt="Captured image"
              fill
              className="  object-contain  "
              onClick={() => {
                onOpen();
              }}
              // onLoad={}
            ></Image>
          )}
          {queueTask.isQueueing && (
            <div className=" flex flex-col gap-3">
              <Spinner size="md"></Spinner>
              {mapStatus[queueTask.status]}
            </div>
          )}

          {queueTask.status == 'FAILED' && (
            <div className="flex flex-col items-center justify-center gap-2 text-danger/60">
              <Frown size={50}></Frown>
              <span>Something went wrong, retry!</span>
            </div>
          )}
          {queueTask.status == 'PROMPT_NOT_INTERIOR' && (
            <div className="flex flex-col items-center justify-center gap-2 text-danger/60">
              <Frown size={50}></Frown>
              <span>Prompt is not related to interior!</span>
            </div>
          )}

          {queueTask.status == 'IMAGE_NOT_INTERIOR' && (
            <span className=" absolute bottom-4 left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-background p-1 px-2 text-warning/60">
              The generated image might not related to interior!
            </span>
          )}
        </div>
        {data && data.url && (
          <Modal
            size="5xl"
            // style={{ width: `calc(${aspectRatio} * 85vh)` }}
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={true}
          >
            <ModalContent>
              {() => (
                <>
                  <ModalBody className="flex items-center justify-center">
                    <div className=" h-[85vh]">
                      <Image
                        src={data.url!}
                        alt="Captured image"
                        fill
                        className="  object-contain  "
                      ></Image>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
    )
  );
}
