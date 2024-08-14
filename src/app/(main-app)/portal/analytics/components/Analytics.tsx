'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartData, registerables } from 'chart.js';

import { Select, SelectItem } from '@nextui-org/react';
import _ from 'lodash';
import { getRevenueByYear } from '@/app/apis/order.api';
import { toast } from 'sonner';
import { AnnualRevenue } from 'src/types/revenue.type';

type ChartDataType = ChartData<'bar', number[], string>;

Chart.register(...registerables);
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function Analytics() {
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => _.range(currentYear, 2010, -1).map((item) => String(item)),
    []
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [transferChartData, setTransferChartData] = useState<ChartDataType>();
  const [productChartData, setProductChartData] = useState<ChartDataType>();

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
      },
    },
    color: '#fff',
  };

  const generateChartData = (data: AnnualRevenue[]) => {
    const total = data.reduce(
      (acc, item) => {
        acc.totalTransfers.push(item.totalTransfer);
        acc.totalProducts.push(item.totalProduct);
        return acc;
      },
      {
        totalTransfers: [],
        totalProducts: [],
      } as {
        totalTransfers: number[];
        totalProducts: number[];
      }
    );

    const transferChart: ChartDataType = {
      labels: MONTHS,
      datasets: [
        {
          label: 'Total Transfer',
          data: total.totalTransfers,
          backgroundColor: '#8259D4',
          borderColor: '#201E30',
          borderWidth: 1,
        },
      ],
    };

    const productChart: ChartDataType = {
      labels: MONTHS,
      datasets: [
        {
          label: 'Total Products',
          data: total.totalProducts,
          backgroundColor: '#F25F33',
          borderColor: '#27231A',
          borderWidth: 1,
        },
      ],
    };

    setTransferChartData(transferChart);
    setProductChartData(productChart);
  };

  const fetchRevenueByYear = async () => {
    try {
      const res = await getRevenueByYear(selectedYear);
      if (res && res.data) {
        generateChartData(res.data);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchRevenueByYear();
  }, [selectedYear]);

  return (
    <>
      <div className="mb-8 w-[180px]">
        <Select
          label="Select a year"
          classNames={{
            value: 'font-medium',
            popoverContent: 'rounded-[4px]',
          }}
          radius="sm"
          selectedKeys={[selectedYear]}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <SelectItem key={year}>{year}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex gap-10">
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-medium text-white">Total Transfer</h2>
          </div>

          {transferChartData && (
            <Bar data={transferChartData} options={options} />
          )}
        </div>

        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-medium text-white">Total Products</h2>
          </div>

          {productChartData && (
            <Bar data={productChartData} options={options} />
          )}
        </div>
      </div>
    </>
  );
}

export default Analytics;
