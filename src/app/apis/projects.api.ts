'use server';

import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { Project, ProjectInfo } from 'src/types/projects.type';

import { revalidatePath } from 'next/cache';
import { ImageRespone } from 'src/types/findIdeas.type';
import { ResponseApi, ResponseWithPaging } from 'src/types/utils.type';
import { SavedFloorPlan } from '../(main-app)/blueprint/blueprint3D/model/floorplanModel';
import { NewWorkSpaceType } from '../(main-app)/floor-plans/components/AddWorkSpace';

export const getProjects = async (
  order: 'asc' | 'desc',
  pageNumber: number,
  take: number,
  search: string
) => {
  try {
    const queryString = new URLSearchParams({
      order,
      page: pageNumber.toString(),
      take: take.toString(),
      search,
    });

    const res: ResponseApi<ResponseWithPaging<ProjectInfo[]>> | undefined =
      await serverFetchWithAutoRotation({
        api: `/api/v1/workspaces?${queryString.toString()}`,
        method: 'GET',
      });
    console.log(
      order,
      pageNumber,
      take,
      `/api/v1/workspaces?${queryString.toString()}`
    );
    if (!res || !res.data) return undefined;
    const data = res.data.data;
    const meta = res.data.meta;
    return { data, meta };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const getSpecificProjects = async (id: string) => {
  try {
    const res: ResponseApi<Project> | null = await serverFetchWithAutoRotation({
      api: `/api/v1/workspaces/${id}`,
      method: 'GET',
    });
    if (!res) return undefined;

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const saveFloorPlan = async (id: number, floorPlan: SavedFloorPlan) => {
  await serverFetchWithAutoRotation({
    api: `/api/v1/workspaces/${id}`,
    method: 'PATCH',
    body: {
      data: floorPlan,
    },
  });
};

export const addNewWorkPlace = async (newWorkSpace: NewWorkSpaceType) => {
  const res: ResponseApi<NewWorkSpaceType> | null =
    await serverFetchWithAutoRotation({
      api: `/api/v1/workspaces/`,
      method: 'POST',
      body: {
        data: undefined,
        ...newWorkSpace,
      },
    });
  if (!res) return undefined;
  revalidatePath('/floor-plans');
  return res.data;
};

export const revalidateProjectID = async (id: number) => {
  console.log('asasas', id);
  revalidatePath(`/blueprint/${id}`, 'page');
};

export const getGalleryProjects = async (
  id: number,
  order: 'asc' | 'desc' = 'asc',
  pageNumber: number,
  take: number
) => {
  try {
    const queryString = new URLSearchParams({
      order,
      page: pageNumber.toString(),
      take: take.toString(),
    });

    const res: ResponseApi<ImageRespone> = await serverFetchWithAutoRotation({
      api: `/api/v1/workspaces/${id}/generate-history?${queryString.toString()}`,
      method: 'GET',
    });
    if (!res) return undefined;

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};
