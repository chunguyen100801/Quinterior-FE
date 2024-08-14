'use client';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

import { addToWorkspace, getWorkspaceList } from '@/app/apis/workspace.api';
import { FolderKanban } from 'lucide-react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { EOrderType } from 'src/constants/enum';
import { ModelData } from 'src/types/asset.type';
import { MetaType } from 'src/types/utils.type';
import { WorkspaceType } from 'src/types/workspace.type';

interface Props {
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  variant?:
    | 'light'
    | 'flat'
    | 'ghost'
    | 'shadow'
    | 'solid'
    | 'bordered'
    | 'faded'
    | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  model: ModelData;
}

export default function AddtoWorkspace({
  color,
  size,
  variant,
  className,
  radius,
  model,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [selected, setSelected] = useState<string[]>([]);

  const [workspaceList, setWorkSpaceList] = useState<WorkspaceType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<MetaType>();
  const take = 10;

  const { handleSubmit, reset } = useForm();

  const onSubmit = async () => {
    if (isLoading) return;

    if (!selected.length) {
      toast.error('Please select at least one workspace!');
      return;
    }

    const toastId = toast.loading('Loading...');
    setIsLoading(true);

    const body = {
      modelData: model,
      workspaceIds: selected.map((item) => parseInt(item)),
    };

    const response = await addToWorkspace(body);

    if (response?.error) {
      toast.error('Adding new address failed!', {
        id: toastId,
      });
    } else {
      toast.success('Added successfully!', {
        id: toastId,
      });
    }
    onCloseModal();
    return;
  };

  const onCloseModal = () => {
    setIsLoading(false);
    setSelected([]);
    reset();
    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const workspaceData = await getWorkspaceList({
          page,
          take,
          order: EOrderType.DESC,
        });

        const data = workspaceData?.data;
        const meta = workspaceData?.meta;

        meta && setMeta(meta);
        data &&
          setWorkSpaceList((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newData = data.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newData];
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, take]);

  const onChangeValue = (value: string[]) => {
    setSelected(value);
  };

  return (
    <div className="w-full items-center justify-center">
      <Button
        onPress={onOpen}
        color={color || 'primary'}
        size={size || 'md'}
        radius={radius || 'sm'}
        variant={variant || 'flat'}
        type="button"
        className={className || 'w-full text-white'}
      >
        Add to Workspace
      </Button>

      <Modal
        scrollBehavior={'inside'}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="xl"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onCloseModal}
        classNames={{
          body: 'py-6',
          backdrop: 'bg-[#2e3965]/50 backdrop-opacity-40 w-full h-full',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'border-b-[1px] border-[#292f46]',
          footer: 'border-t-[1px] border-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
        placement="top-center"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onCloseModal) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  Add To Workspace
                </ModalHeader>
                <ModalBody>
                  <div className="flex w-full min-w-min flex-col">
                    <CheckboxGroup isRequired onValueChange={onChangeValue}>
                      {workspaceList?.map((data, index) => (
                        <div key={index}>
                          <div className="flex w-full justify-between">
                            <div className="flex space-x-2">
                              <Checkbox value={data?.id.toString()}></Checkbox>

                              <div className="flex flex-col text-base">
                                <div className="flex max-w-md font-bold  text-gray-50">
                                  {data?.name || ''}
                                </div>
                                <div className=" flex text-sm text-slate-400">
                                  Create:{' '}
                                  {moment(data?.createdAt)
                                    .locale('vi')
                                    .format('DD-MM-YYYY') || 0}{' '}
                                </div>
                              </div>
                            </div>
                          </div>

                          {meta?.itemCount && index < meta?.itemCount - 1 && (
                            <Divider className="my-8" />
                          )}
                        </div>
                      ))}
                    </CheckboxGroup>
                  </div>
                  {workspaceList.length < 1 && !isLoading && (
                    <div className="my-4 flex h-full flex-col items-center justify-center">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
                        <FolderKanban size={40} strokeWidth={0.75} />
                      </div>
                      <div> {"You don't have any projects yet"}</div>
                    </div>
                  )}
                  {isLoading && page == 1 && (
                    <div className="mt-8 flex h-20 w-full items-center justify-center">
                      <Spinner size="lg" label="Loading..." color="default" />
                    </div>
                  )}
                  {meta?.hasNextPage && (
                    <div className="-my-4 flex w-full items-center justify-center">
                      <Button
                        color="primary"
                        variant="light"
                        onClick={() => setPage((prev) => prev + 1)}
                        isLoading={isLoading}
                      >
                        Load more
                      </Button>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  {workspaceList.length > 0 && (
                    <>
                      {' '}
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onCloseModal}
                        isDisabled={isLoading}
                      >
                        Close
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        isDisabled={isLoading}
                      >
                        Add
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
}
