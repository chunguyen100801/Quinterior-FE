'use client';
import { Chip, Divider } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Blueprint, EventData } from '../../blueprint3D/blueprint';
import {
  EditEvents,
  ObjectModify,
} from '../../blueprint3D/helper/objectModifyManager';
import SelectedForm from './SelectedForm';

export default function SelectedPanel({ bluePrint }: { bluePrint: Blueprint }) {
  const setItem = (event: EventData<EditEvents, 'newItemSelect'>) => {
    setSelectedItem({
      itemType: event.itemType,
      modifyInfo: event.modifyInfo,
      zod: event.zod,
    });
  };

  const [selectedItem, setSelectedItem] = useState<ObjectModify | null>();
  useEffect(() => {
    bluePrint.ObjectModifyManager.evenDispatch.addEventListener(
      'newItemSelect',
      setItem
    );
    return () => {
      bluePrint.ObjectModifyManager.evenDispatch.removeEventListener(
        'newItemSelect',
        setItem
      );
    };
  }, [bluePrint.ObjectModifyManager.evenDispatch]);

  return (
    // <UninteractContainer bluePrint={bluePrint}>
    //   <div
    //     className={cn(
    //       ' absolute bottom-3   right-[calc(-20vw-0.375rem)]  transition-all ',
    //       {
    //         'right-[0.75rem]': isOpen,
    //       }
    //     )}
    //   >
    //     <div
    //       onClick={hideTab}
    //       className={cn(
    //         '  absolute left-[-4rem] top-[50%]  flex h-[3rem]   w-[3rem] translate-y-[-50%] items-center justify-center rounded-full bg-background opacity-40  transition-all  duration-75 hover:opacity-hover hover:outline hover:outline-primary'
    //       )}
    //     >
    //       <ArrowLeft
    //         className={cn(' transition-all ', { 'rotate-180': isOpen })}
    //       />
    //     </div>
    <div className=" w-full overflow-y-auto rounded-xl bg-background font-bold first-letter:flex">
      <div className="flex w-full flex-col gap-2 p-5">
        <div className=" w-full">
          <span className=" flex items-center  justify-between font-extrabold ">
            <span className=" text-lg">Selected Object: </span>
            {selectedItem && (
              <Chip color="primary" variant="solid" className=" font-extrabold">
                {selectedItem?.itemType}
              </Chip>
            )}
          </span>
        </div>
        <Divider orientation="horizontal" className="w-full"></Divider>

        {selectedItem && (
          <SelectedForm
            selectedItem={selectedItem}
            objectModifyManager={bluePrint.ObjectModifyManager}
          ></SelectedForm>
        )}
      </div>
    </div>
    //   </div>
    // </UninteractContainer>
  );
}
