'use client';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Eraser, Grab, Pencil, Ruler, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { ModeString } from '../../blueprint3D/2d/mode-system/modeManager';
import { Blueprint } from '../../blueprint3D/blueprint';
import {
  MeasurementUnits,
  defaultStore,
} from '../../blueprint3D/model/constance';

const measurementUnits = [
  { value: 'cm', label: 'Centimeter' },
  { value: 'm', label: 'Meter' },
  { value: 'mm', label: 'Millimeter' },
  { value: 'dm', label: 'Decimeter' },
  { value: 'inch', label: 'Inch' },
  { value: 'feet', label: 'Feet' },
];
type mode = 'Move' | 'Draw' | 'Delete' | 'Edit';
export default function ModifyPanel({ bluePrint }: { bluePrint: Blueprint }) {
  const modeIcon = {
    Move: <Grab size={20} />,
    Draw: <Pencil />,
    Delete: <Eraser size={20} />,
    Edit: <Settings2 size={20} />,
  };
  const [measumentUnit, setMeasmentUnit] = useState<MeasurementUnits>(
    defaultStore.MeasurementUnit
  );

  const [selectedKeys, setSelectedKeys] = useState<mode>('Move');
  const [isSnap, setIsSnap] = useState(defaultStore.snapToGrid);
  const [snapTolerance, setSnapTolerance] = useState<number>(
    defaultStore.gridSpacing_snapTolerance
  );
  const [baseMeasurementUnit, setBaseMeasurementUnit] =
    useState<MeasurementUnits>(defaultStore.MeasurementUnit);
  return (
    <>
      <div className=" absolute  bottom-0  left-[50%]  flex  h-fit   w-full translate-x-[-50%] translate-y-[-50%] scale-90 items-center space-x-2 rounded-xl font-extrabold">
        <Dropdown className=" rounded-md bg-background   ">
          <DropdownTrigger>
            <Button variant="bordered" className=" min-w-fit font-semibold">
              {modeIcon[selectedKeys]}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(key) => {
              const text = (key as Set<mode>).values().next().value as string;
              const modeString = text.toLowerCase() + 'Mode';
              if (bluePrint) {
                bluePrint.externalEvenDispatch.dispatchEvent({
                  type: 'changeMode-externalInteract',
                  mode: modeString as ModeString,
                });
              }
              return setSelectedKeys(text as mode);
            }}
          >
            <DropdownItem key="Draw" startContent={modeIcon.Draw}>
              Draw
            </DropdownItem>
            <DropdownItem key="Move" startContent={modeIcon.Move}>
              Move
            </DropdownItem>
            <DropdownItem key="Delete" startContent={modeIcon.Delete}>
              Delete
            </DropdownItem>
            <DropdownItem key="Edit" startContent={modeIcon.Edit}>
              Edit Properties
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Divider orientation="vertical" className="h-7"></Divider>
        <Input
          variant="bordered"
          step={5}
          type="number"
          className=" w-[10rem]"
          label="Snap torlerant"
          defaultValue={snapTolerance.toString()}
          labelPlacement="inside"
          onChange={(e) => {
            const parseNum = parseFloat(e.target.value);
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'gridSpacing_snapTolerance-change',
              value: parseNum,
            });
            setSnapTolerance(parseNum);
          }}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span>
                <Ruler></Ruler>
              </span>
            </div>
          }
          endContent={
            <div className="flex items-center">
              <label className="sr-only" htmlFor="measure-unit">
                Currency
              </label>
              <select
                className="border-0 bg-transparent text-small text-default-400 outline-none"
                id="measure-unit"
                name="measure-unit"
                defaultValue={baseMeasurementUnit}
                onChange={(e) => {
                  bluePrint.externalEvenDispatch.dispatchEvent({
                    type: 'BaseSnapUnit-change',
                    value: e.target.value as MeasurementUnits,
                  });
                  setBaseMeasurementUnit(e.target.value as MeasurementUnits);
                }}
              >
                <option>cm</option>
                <option>dm</option>
                <option>m</option>
                <option>mm</option>
                <option>inch</option>
                <option>feet</option>
              </select>
            </div>
          }
        />
        <Divider orientation="vertical" className="h-7"></Divider>
        <Select
          label="Measurement Unit"
          variant="bordered"
          placeholder="Select a unit"
          selectedKeys={[measumentUnit]}
          className=" w-[12rem] rounded-sm"
          onChange={(e) => {
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'MeasurementUnit-change',
              value: e.target.value as MeasurementUnits,
            });
            setMeasmentUnit(e.target.value as MeasurementUnits);
          }}
        >
          {measurementUnits.map((unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              {unit.label}
            </SelectItem>
          ))}
        </Select>
        <Divider orientation="vertical" className="h-7"></Divider>
        <Checkbox
          isSelected={isSnap}
          onValueChange={(val) => {
            setIsSnap(val);
            bluePrint.externalEvenDispatch.dispatchEvent({
              type: 'snapToGrid-change',
              value: val,
            });
          }}
        >
          <span className="text-small"> Snap to grid </span>
        </Checkbox>
      </div>
    </>
  );
}
