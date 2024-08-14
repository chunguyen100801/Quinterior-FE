import { Button, ButtonGroup } from '@nextui-org/react';
import { FloorPlanMode } from '../../Blueprint';

export default function ModeGroup({
  mode,
  changeMode,
}: {
  mode: FloorPlanMode;
  changeMode: (mode: FloorPlanMode) => void;
}) {
  return (
    <ButtonGroup className=" scale-85  ">
      <Button
        color="primary"
        variant={mode == '2D' ? 'shadow' : 'flat'}
        className="font-extrabold"
        onClick={() => {
          if (mode == '2D') return;
          changeMode('2D');
        }}
      >
        2D
      </Button>
      <Button
        onClick={() => {
          if (mode == '3D') return;
          changeMode('3D');
        }}
        variant={mode == '3D' ? 'shadow' : 'flat'}
        color="primary"
        className="font-extrabold"
      >
        3D
      </Button>
      <Button
        onClick={() => {
          if (mode == 'REFINER') return;
          changeMode('REFINER');
        }}
        variant={mode == 'REFINER' ? 'shadow' : 'flat'}
        color="primary"
        className="font-extrabold"
      >
        REFINER
      </Button>
    </ButtonGroup>
  );
}
