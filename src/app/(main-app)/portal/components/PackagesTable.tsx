'use client';
import { Key, useCallback, useMemo, useState } from 'react';
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
import { AssetItemType } from 'src/types/asset.type';
import { ELimit, HttpStatusCode } from 'src/constants/enum';
import { formatPriceSV, timestampToDateString } from '@/utils/utils-client';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import TableTopContent from './TableTopContent';
import TableBottomContent from './TableBottomContent';
import { MetaType } from 'src/types/utils.type';
import ModalConfirm from 'src/components/ModalConfirm';
import { deleteAsset } from '@/app/apis/asset.api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  data: AssetItemType[];
  meta: MetaType;
}

type ColumnKeyType = AssetItemType & { actions: string };

export type ColumnType = {
  name: string;
  uid: keyof ColumnKeyType;
  visible: boolean;
};

const initColumns: ColumnType[] = [
  {
    name: 'Id',
    uid: 'id',
    visible: true,
  },
  {
    name: 'Name',
    uid: 'name',
    visible: true,
  },
  // {
  //   name: 'Quantity',
  //   uid: 'quantity',
  //   visible: true,
  // },
  {
    name: 'Background',
    uid: 'background',
    visible: false,
  },
  // {
  //   name: 'Price',
  //   uid: 'price',
  //   visible: true,
  // },
  {
    name: 'Avg Rating',
    uid: 'avgRating',
    visible: true,
  },
  {
    name: 'Total Rating',
    uid: 'totalRating',
    visible: true,
  },
  {
    name: 'Created At',
    uid: 'createdAt',
    visible: false,
  },
  {
    name: 'Updated At',
    uid: 'updatedAt',
    visible: false,
  },
  {
    name: 'Actions',
    uid: 'actions',
    visible: true,
  },
];

export default function PackagesTable({ data, meta }: Props) {
  const router = useRouter();

  const queryParams = useAssetQueryParams({
    take: ELimit.FIVE,
    order: '',
  });
  const [columns, setColumns] = useState<ColumnType[]>(initColumns);
  const [packageDeleteId, setPackageDeleteId] = useState<number | null>(null);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);

  const visibleColumns = useMemo(() => {
    return columns.filter((column) => column.visible);
  }, [columns]);

  const handleClickDelete = (packageId: number) => {
    setPackageDeleteId(packageId);
    setIsOpenModalConfirmDelete(true);
  };

  const renderCell = useCallback((item: AssetItemType, columnKey: Key) => {
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
            <DropdownMenu>
              <DropdownItem href={`/portal/view/${item.id}`}>View</DropdownItem>
              <DropdownItem href={`/portal/edit/${item.id}`}>Edit</DropdownItem>
              <DropdownItem onClick={() => handleClickDelete(item.id)}>
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
            item[columnKey as keyof AssetItemType] as string
          )}
        </div>
      );
    } else if (columnKey === 'price') {
      return (
        <div>{formatPriceSV(+item[columnKey as keyof AssetItemType])}</div>
      );
    }

    return <div>{item[columnKey as keyof AssetItemType] as string}</div>;
  }, []);

  const handleDeletePackage = async () => {
    try {
      if (!packageDeleteId) return;
      const res = await deleteAsset(packageDeleteId);
      if (res?.statusCode === HttpStatusCode.OK) {
        toast.success(res?.message);
        router.refresh();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message ?? 'An error occurred');
    }
  };

  return (
    <>
      <Table
        aria-label="Packages Table"
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
            columns={columns}
            visibleColumns={visibleColumns}
            setColumns={setColumns}
            itemCount={meta?.itemCount || 0}
            queryParams={queryParams}
          />
        }
        topContentPlacement="outside"
        radius="sm"
      >
        <TableHeader columns={visibleColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No assets found'} items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalConfirm
        isOpen={isOpenModalConfirmDelete}
        onClose={() => setIsOpenModalConfirmDelete(false)}
        title="Delete package"
        message="Are you sure you want to delete this package?"
        onSubmit={handleDeletePackage}
      />
    </>
  );
}
