import { getProjects } from '@/app/apis/projects.api';
import { Suspense } from 'react';
import { ProjectInfo } from 'src/types/projects.type';
import { MetaType } from 'src/types/utils.type';
import WorkSpaceBoad from './components/WorkSpaceBoad';

import { z } from 'zod';
import AddWorkSpace from './components/AddWorkSpace';
import SearchProject from './components/SearchProject';
import WorkSpacePagination from './components/WorkSpacePagination';

const searchParamsSchema = z.object({
  page: z.string().optional().transform(Number),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});
type order = 'asc' | 'desc';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let projects: ProjectInfo[] | undefined = [];
  let meta: MetaType | undefined;
  let search = '';
  let page = 1;
  let order: order = 'asc';
  let res;
  const offsetPage: number = 8;
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
  if (parsedSearchParams.success) {
    page = parsedSearchParams.data.page || 1;
    order = parsedSearchParams.data.order || 'asc';
    search = parsedSearchParams.data.search || '';
    res = await getProjects(order, page, offsetPage, search);
    projects = res?.data;
    meta = res?.meta;
  } else {
    res = await getProjects('asc', 1, offsetPage, search);
    projects = res?.data;
    meta = res?.meta;
  }

  return (
    <div
      className="flex h-fit min-h-[calc(100vh-4.5rem)] flex-col
    items-center justify-center  py-[3rem]"
    >
      <div className=" w-[90%]">
        <div className=" relative  mb-4   flex   items-center justify-between ">
          <AddWorkSpace></AddWorkSpace>

          {meta && meta.pageCount > 1 && (
            <WorkSpacePagination
              total={meta.pageCount}
              page={meta.page}
            ></WorkSpacePagination>
          )}

          <SearchProject></SearchProject>
        </div>
      </div>
      <Suspense fallback={'loading'}>
        <WorkSpaceBoad projects={projects}></WorkSpaceBoad>
      </Suspense>
    </div>
  );
}
