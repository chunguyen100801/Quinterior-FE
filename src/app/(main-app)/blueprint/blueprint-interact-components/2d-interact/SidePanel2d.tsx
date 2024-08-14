import { Button } from '@nextui-org/react';
import { FolderInput, FolderOutput, RotateCcw, SaveAll } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Project } from 'src/types/projects.type';
import { Blueprint } from '../../blueprint3D/blueprint';
import { SavedFloorPlan } from '../../blueprint3D/model/floorplanModel';
import ModifyPanel from './ModifyPanel';
import SelectedPanel from './SelectedPanel';
export default function SidePanel2d({
  bluePrint,
  projectData,
}: {
  bluePrint: Blueprint;
  projectData: Project;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            if (!e.target || typeof e.target.result != 'string') {
              throw Error;
            }
            const json: SavedFloorPlan = JSON.parse(e.target.result);
            console.log(json, 'alloo');
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'load-floorplan',
              externalFloorplan: json,
            });
          } catch (err) {
            toast.error('Error parsing JSON file');
          }
        };

        reader.readAsText(file);
      } else {
        toast.error('Please select a valid JSON file');
      }
    }
  };

  return (
    <div className=" text-2xl font-extrabold ">
      <div className=" flex w-full  items-center justify-center gap-2">
        <Button
          variant="flat"
          className=" flex-1 font-bold"
          startContent={<SaveAll size={20} />}
          color="primary"
          onClick={() => {
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'save-floorplan',
              id: projectData.id,
            });
          }}
        >
          Save
        </Button>

        <Button
          variant="flat"
          className="flex-1 font-bold"
          startContent={<FolderInput size={20} />}
          color="primary"
          onClick={handleButtonClick}
        >
          Import
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="flat"
          className=" flex-1 font-bold"
          startContent={<FolderOutput size={20} />}
          color="primary"
          onClick={() => {
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'export-floorplan',
              name: projectData.name,
            });
          }}
        >
          Export
        </Button>

        {/* <Button
          variant="flat"
          className="flex-1 font-bold"
          startContent={<FolderOutput size={20} />}
          color="primary"
          onClick={() => {
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'load-floorplan',
            });
          }}
        >
          load floorplan
        </Button> */}
        <Button
          variant="flat"
          className=" flex-1 font-bold"
          startContent={<RotateCcw size={20} />}
          color="primary"
          onClick={() => {
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'reset-floorplan',
            });
          }}
        >
          Reset
        </Button>
      </div>
      <SelectedPanel bluePrint={bluePrint}></SelectedPanel>
      <ModifyPanel bluePrint={bluePrint}></ModifyPanel>
    </div>
  );
}
