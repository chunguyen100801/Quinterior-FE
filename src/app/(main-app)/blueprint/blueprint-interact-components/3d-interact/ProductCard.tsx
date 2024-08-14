'use client';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import { AssetItemType, ModelData } from 'src/types/asset.type';
export default function ProductCard({
  asset,
  loadModel,
}: {
  asset: AssetItemType;
  loadModel: (modelData: ModelData, name: string) => void;
}) {
  return (
    <Card
      radius="lg"
      className="h-[13rem] border-none"
      isPressable
      onPress={() => {
        loadModel(asset.model, asset.name);
      }}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          fill
          alt={asset.name}
          className="h-[140px] w-full object-cover"
          src={asset.thumbnail}
        />
      </CardBody>
      <CardFooter className=" flex items-center justify-center text-small">
        <p className=" text-default-400 ">{asset.name}</p>
      </CardFooter>
    </Card>
  );
}
