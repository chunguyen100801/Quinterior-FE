'use client';
import { revalidateProjectID } from '@/app/apis/projects.api';
import { deleteWorkspace } from '@/app/apis/workspace.api';
import {
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from '@nextui-org/react';
import { CircleEllipsis, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProjectInfo } from 'src/types/projects.type';

export default function WorkSpaceCard({ project }: { project: ProjectInfo }) {
  const handleCardClick = async () => {
    await revalidateProjectID(project.id);

    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/blueprint/${project.id}`;
  };

  const handleDelete = async () => {
    const res = await deleteWorkspace(project.id);
    if (res?.error) {
      toast.error('Something went wrong, cant delete workspace!');
    }
    toast.success(`Deleted workspace: ${project.name}`);
  };
  const [client, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!client) return null;
  return (
    <Card
      isPressable
      className="isolate h-[15rem] transition-transform  hover:scale-[1.03]"
      shadow="md"
      onPress={() => {
        handleCardClick();
      }}
    >
      <CardHeader className="to-bg-500 absolute z-10  items-center justify-between bg-gradient-to-b from-primary from-50% to-primary/80 to-100%">
        <div className="ml-3 flex flex-col ">
          <h4 className="text-xl font-extrabold uppercase first-line:text-white">
            {project.name}
          </h4>
          <p className="text-tiny font-medium uppercase text-white/60">
            created:{' '}
            <span className="lowercase">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
        <div className=" flex items-center justify-center ">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="solid" color="primary" size="sm">
                <CircleEllipsis size={25} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={
                  <TrashIcon className={cn('text-danger', 'text-semibold')} />
                }
                onClick={handleDelete}
              >
                <span> Delete Workspace</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      {project.image && (
        <Image
          alt="Card background"
          fill
          className="z-0 object-cover "
          src={project.image}
        />
      )}
    </Card>
  );
}
