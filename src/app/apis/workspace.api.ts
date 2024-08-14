'use server';

import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { revalidatePath } from 'next/cache';
import { ModelData } from 'src/types/asset.type';
import { ResponseApi, ResponseWithPaging } from 'src/types/utils.type';
import { TaskQueueImage, WorkspaceType } from 'src/types/workspace.type';

export const getWorkspaceList = async ({
  page,
  take,
  order,
}: {
  page: number;
  take: number;
  order: string;
}) => {
  try {
    const res: ResponseApi<ResponseWithPaging<WorkspaceType[]>> =
      await serverFetchWithAutoRotation({
        api: `/api/v1/workspaces?page=${page}&take=${take}&order=${order}`,
        method: 'GET',
      });
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      //   return {
      //     error: error.message,
      //   };
    }
  }
};

// add item to workspace
export const addToWorkspace = async (body: {
  modelData: ModelData;
  workspaceIds: number[];
}) => {
  try {
    const res = await serverFetchWithAutoRotation({
      api: '/api/v1/workspaces/interior',
      method: 'POST',
      body,
    });
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }
};

// add item to workspace
export const deleteWorkspace = async (id: number) => {
  try {
    const res = await serverFetchWithAutoRotation({
      api: `/api/v1/workspaces/${id}`,
      method: 'DELETE',
    });
    revalidatePath('/floor-plans');
    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }
};

// generate img
export const generateImgToImg = async (formData: FormData) => {
  try {
    const res: ResponseApi<TaskQueueImage> = await serverFetchWithAutoRotation({
      api: '/api/v1/images/generate',
      method: 'POST',
      body: formData,
    });
    console.log(res);
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return null;
    }
  }
};

export const PoolingImgQueue = async (taskId: string) => {
  try {
    const res: ResponseApi<TaskQueueImage> = await serverFetchWithAutoRotation({
      api: `/api/v1/images/generate/${taskId}`,
      method: 'GET',
    });
    console.log(res);
    return res ? res.data : undefined;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Something went wrong, queueing fail!');
    }
  }
};
