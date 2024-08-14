import { cn } from '@/utils/utils-client';
import { Button, Divider } from '@nextui-org/react';
import { Camera } from 'lucide-react';
import { createContext, useState } from 'react';
import { Project } from 'src/types/projects.type';
import { Blueprint } from '../../blueprint3D/blueprint';
import AspectOption from './AspectOption';
import FOVOption from './FOVOption';
import Gallery from './Gallery';
import ImgTakeShow from './ImgTakeShow';
import RefineForm from './RefineForm';

interface ImgContextType {
  blob: Blob | undefined;
  updateBlob: ((newValue: Blob) => void) | undefined;
  projectData: Project | undefined;
}
export const ImgContext = createContext<ImgContextType>({
  blob: undefined,
  updateBlob: undefined,
  projectData: undefined,
});
export default function RefineSidePanel({
  bluePrint,
  projectData,
}: {
  projectData: Project;
  bluePrint: Blueprint;
}) {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);

  const updateBlob = (newBlob: Blob) => {
    setBlob(newBlob);
  };
  return (
    <div className=" flex flex-col gap-3 px-3">
      <div className="flex justify-between">
        <span
          className=" 
        text-2xl font-extrabold"
        >
          Camera Photo
        </span>

        <Gallery projectId={projectData.id}></Gallery>
      </div>
      <ImgContext.Provider value={{ blob, updateBlob, projectData }}>
        <ImgTakeShow bluePrint={bluePrint}></ImgTakeShow>
      </ImgContext.Provider>
      <AspectOption bluePrint={bluePrint}></AspectOption>
      <FOVOption bluePrint={bluePrint}></FOVOption>
      <Button
        variant="flat"
        className={cn(' h-[2.5rem] font-bold')}
        startContent={<Camera size={20} />}
        color="primary"
        onClick={() => {
          bluePrint.externalEvenDispatch.dispatchEvent({
            type: 'lock-first-person-camera',
          });
        }}
      >
        Take Photo
      </Button>

      <Divider orientation="horizontal" className="my-3 w-full"></Divider>

      <ImgContext.Provider value={{ blob, updateBlob, projectData }}>
        <RefineForm></RefineForm>
      </ImgContext.Provider>
    </div>
  );
}
