import { Slider } from '@nextui-org/react';
import { useState } from 'react';
import { Blueprint } from '../../blueprint3D/blueprint';

export default function FOVOption({ bluePrint }: { bluePrint: Blueprint }) {
  const [fov, setFov] = useState<number | number[]>(75);

  const onFovChange = (value: number | number[]) => {
    setFov(value);
    bluePrint.externalEvenDispatch.dispatchEvent({
      type: 'change-cam-FOV',
      FOV: value,
    });
  };
  return (
    <div className="flex flex-col ">
      <Slider
        value={fov}
        onChange={onFovChange}
        color="primary"
        size="md"
        label="FOV:"
        step={5}
        showSteps={true}
        minValue={10}
        maxValue={120}
        marks={[
          {
            value: 10,
            label: '10',
          },
          {
            value: 40,
            label: '40',
          },
          {
            value: 55,
            label: '55',
          },
          {
            value: 75,
            label: '75',
          },
          {
            value: 120,
            label: '120',
          },
        ]}
        className="text-md max-w-md font-bold"
      />
    </div>
  );
}
