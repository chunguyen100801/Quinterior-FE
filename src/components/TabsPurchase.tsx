'use client';
import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { purchaseTabs } from 'src/constants/purchase';
import useOrderQueryParams from 'src/hooks/useOrderQueryParams';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';

export default function TabsPurchase() {
  const queryParams = useOrderQueryParams({
    page: '',
    take: '',
    search: '',
  });
  const { handleSearchParams } = useSearchQueryParams();

  return (
    <div className="w-full">
      <Tabs
        variant="underlined"
        size="lg"
        selectedKey={queryParams?.status ?? ''}
        fullWidth
        onSelectionChange={(key) => {
          handleSearchParams(queryParams, [
            {
              key: 'status',
              value: String(key),
            },
            {
              key: 'search',
              value: '',
            },
          ]);
        }}
      >
        {purchaseTabs.map((tab) => (
          <Tab key={tab.keySearch} title={tab.title} />
        ))}
      </Tabs>
    </div>
  );
}
