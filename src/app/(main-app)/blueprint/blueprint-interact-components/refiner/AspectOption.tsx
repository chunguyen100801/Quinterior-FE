import { convertRatioToNumbers } from '@/utils/utils-client';
import { Button, ButtonGroup } from '@nextui-org/react';
import { useState } from 'react';
import { Blueprint } from '../../blueprint3D/blueprint';
export type AspectType =
  | '16:9'
  | '9:16'
  | '4:3'
  | '3:4'
  | '1:1'
  | '5:6'
  | '2:1';
export default function AspectOption({ bluePrint }: { bluePrint: Blueprint }) {
  const [aspect, setAspect] = useState<AspectType>('16:9');

  const changeAspect = (aspect: AspectType) => {
    setAspect(aspect);
    bluePrint.externalEvenDispatch.dispatchEvent({
      type: 'change-cam-aspect',
      aspect: convertRatioToNumbers(aspect),
    });
  };

  return (
    <div className=" flex flex-col gap-1">
      <span className=" text-md font-bold">Aspect Ratio: </span>
      <ButtonGroup className=" scale-85  ">
        <Button
          color="primary"
          variant={aspect == '16:9' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('16:9');
          }}
        >
          16:9
        </Button>

        <Button
          color="primary"
          variant={aspect == '9:16' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('9:16');
          }}
        >
          9:16
        </Button>

        <Button
          color="primary"
          variant={aspect == '4:3' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('4:3');
          }}
        >
          4:3
        </Button>

        <Button
          color="primary"
          variant={aspect == '3:4' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('3:4');
          }}
        >
          3:4
        </Button>

        <Button
          color="primary"
          variant={aspect == '1:1' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('1:1');
          }}
        >
          1:1
        </Button>

        <Button
          color="primary"
          variant={aspect == '5:6' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('5:6');
          }}
        >
          5:6
        </Button>

        <Button
          color="primary"
          variant={aspect == '2:1' ? 'solid' : 'flat'}
          className="font-extrabold"
          onClick={() => {
            changeAspect('2:1');
          }}
        >
          2:1
        </Button>
      </ButtonGroup>
    </div>
  );
}
