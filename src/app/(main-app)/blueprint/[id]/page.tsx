export const revalidate = 0;
import { getSpecificProjects } from '@/app/apis/projects.api';
import LoadingScreen from '@/components/LoadingScreen';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
const BluePrint = dynamic(() => import('../Blueprint'), {
  ssr: false,
  loading: () => <LoadingScreen></LoadingScreen>,
});
export default async function Page({ params }: { params: { id: string } }) {
  const projectData = await getSpecificProjects(params.id);
  if (!projectData) redirect('/floor-plans');
  return <BluePrint projectData={projectData}></BluePrint>;
}
