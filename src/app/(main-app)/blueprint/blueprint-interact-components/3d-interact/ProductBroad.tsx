import { AssetItemType, ModelData } from 'src/types/asset.type';
import ProductCard from './ProductCard';

export default function ProductBroad({
  assetList,
  loadModel,
}: {
  assetList: (AssetItemType | undefined)[];
  loadModel: (modelData: ModelData, name: string) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fill,minmax(10rem, 1fr)',
      }}
    >
      {assetList.map(
        (asset) =>
          asset && (
            <ProductCard
              key={asset.id}
              loadModel={loadModel}
              asset={asset}
            ></ProductCard>
          )
      )}
    </div>
  );
}
