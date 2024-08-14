'use client';
import { TabIndex } from './ManagePackage';
import PackageDetailsTab from './PackageDetailsTab';
import PackageMediaTab from './PackageMediaTab';
import PackageUploadTab from './PackageUploadTab';

interface Props {
  activeTab: number;
}

function TabsContent({ activeTab }: Props) {
  return (
    <div className="px-[24px] pb-[60px] pt-[32px]">
      <div className="flex justify-center">
        <div className="w-[680px] px-[24px]">
          {activeTab === TabIndex.PackageUpload && <PackageUploadTab />}

          {activeTab === TabIndex.Details && <PackageDetailsTab />}

          {activeTab === TabIndex.Media && <PackageMediaTab />}
        </div>
      </div>
    </div>
  );
}

export default TabsContent;
