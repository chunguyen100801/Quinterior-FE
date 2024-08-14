import { ProjectInfo } from 'src/types/projects.type';
import WorkSpaceCard from './WorkSpaceCard';

export default async function WorkSpaceBoad({
  projects,
}: {
  projects?: ProjectInfo[];
}) {
  return (
    <>
      <div
        className=" relative w-[90%] flex-1 rounded-xl p-[3rem] outline outline-2 outline-white/60 "
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fill,minmax(350px, 1fr)',
        }}
      >
        {projects?.map((project) => (
          <WorkSpaceCard project={project} key={project.id}></WorkSpaceCard>
        ))}
      </div>
    </>
  );
}
