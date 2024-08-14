'use client';
import { Key, useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { timestampToDateString } from '@/utils/utils-client';
import { MetaType } from 'src/types/utils.type';
import TableTopContent from './TableTopContent';
import { CategoryItem } from 'src/types/category.type';
import useCategoryQueryParams from 'src/hooks/useCategoryQueryParams';
import TableBottomContent from '../../components/TableBottomContent';
import ModalManageCategories, { ModalType } from './ModalManageCategories';
import ModalConfirm from 'src/components/ModalConfirm';
import { deleteCategory } from '@/app/apis/category.api';
import { HttpStatusCode } from 'src/constants/enum';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  data: CategoryItem[];
  meta: MetaType;
}

type ColumnKeyType = CategoryItem & { actions: string };

export type ColumnType = {
  name: string;
  uid: keyof ColumnKeyType;
};

const initColumns: ColumnType[] = [
  {
    name: 'Id',
    uid: 'id',
  },
  {
    name: 'Name',
    uid: 'name',
  },
  {
    name: 'Description',
    uid: 'description',
  },
  {
    name: 'Created At',
    uid: 'createdAt',
  },
  {
    name: 'Updated At',
    uid: 'updatedAt',
  },
  {
    name: 'Actions',
    uid: 'actions',
  },
];

export default function CategoriesTable({ data, meta }: Props) {
  const queryParams = useCategoryQueryParams();
  const router = useRouter();

  const [viewData, setViewData] = useState<CategoryItem | null>(null);
  const [editData, setEditData] = useState<CategoryItem | null>(null);
  const [deleteData, setDeleteData] = useState<CategoryItem | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const renderCell = useCallback((item: CategoryItem, columnKey: Key) => {
    if (columnKey === 'actions') {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ellipsis-vertical"
                >
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={12} cy={5} r={1} />
                  <circle cx={12} cy={19} r={1} />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="z-[1]">
              <DropdownItem onClick={() => handleOpenViewModal(item)}>
                View
              </DropdownItem>
              <DropdownItem onClick={() => handleOpenEditModal(item)}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => handleOpenDeleteModal(item)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }

    if (columnKey === 'createdAt' || columnKey === 'updatedAt') {
      return (
        <div>
          {timestampToDateString(
            item[columnKey as keyof CategoryItem] as string
          )}
        </div>
      );
    }

    return <div>{item[columnKey as keyof CategoryItem] as string}</div>;
  }, []);

  const handleOpenViewModal = (data: CategoryItem) => {
    setViewData(data);
  };

  const handleCloseViewModal = () => {
    setViewData(null);
  };

  const handleOpenEditModal = (data: CategoryItem) => {
    setEditData(data);
  };

  const handleCloseEditModal = () => {
    setEditData(null);
  };

  const handleOpenDeleteModal = (data: CategoryItem) => {
    setOpenDeleteModal(true);
    setDeleteData(data);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleDeleteCategory = async () => {
    if (!deleteData) return;
    try {
      const res = await deleteCategory(deleteData.id);
      if (res?.statusCode === HttpStatusCode.OK) {
        toast.success(res?.message);
        router.refresh();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <>
      <Table
        aria-label="Categories Table"
        isHeaderSticky
        bottomContent={
          <TableBottomContent meta={meta} queryParams={queryParams} />
        }
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]',
        }}
        selectionMode="none"
        topContent={
          <TableTopContent
            columns={initColumns}
            queryParams={queryParams}
            itemCount={meta?.itemCount || 0}
            handleOpenCreateModal={handleOpenCreateModal}
          />
        }
        topContentPlacement="outside"
        radius="sm"
      >
        <TableHeader columns={initColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No categories found'} items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <ModalManageCategories
        type={ModalType.VIEW}
        data={viewData}
        isOpen={!!viewData}
        onClose={handleCloseViewModal}
      />

      {/* Edit Modal */}
      <ModalManageCategories
        type={ModalType.UPDATE}
        data={editData}
        isOpen={!!editData}
        onClose={handleCloseEditModal}
      />

      {/* Create Modal */}
      <ModalManageCategories
        type={ModalType.CREATE}
        isOpen={openCreateModal}
        onClose={handleCloseCreateModal}
      />

      {/* Confirm Delete Modal */}
      <ModalConfirm
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSubmit={handleDeleteCategory}
      />
    </>
  );
}
