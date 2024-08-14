'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { TabIndex } from './ManagePackage';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';

const tabs = ['Package upload', 'Details', 'Media'];

interface Props {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

function HeaderTabs({ activeTab, setActiveTab }: Props) {
  const [lineDimensions, setLineDimensions] = useState({
    width: 0,
    left: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    formState: { errors },
  } = useFormContext<ManagePackageFormSchemaType>();

  const errorKeys = Object.keys(errors);

  const checkTabValid = (tabIndex: TabIndex) => {
    if (tabIndex === TabIndex.PackageUpload) {
      return !(
        errors.categoryIds ||
        errors.background ||
        errors.model ||
        errors.modelData?.modelType
      );
    } else if (tabIndex === TabIndex.Details) {
      return !(
        errors.description ||
        errors.price ||
        errors.modelData?.width ||
        errors.modelData?.height ||
        errors.modelData?.depth ||
        errors.quantity
      );
    } else {
      return !(errors.images || errors.thumbnail);
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      setLineDimensions({
        width: buttonRef.current.clientWidth,
        left: 0,
      });
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-[24px]">
        {tabs.map((tab, index) => {
          const isValidTab = checkTabValid(index);
          return (
            <button
              type="button"
              ref={index === 0 ? buttonRef : null}
              key={index}
              className={twMerge(
                `flex items-center gap-[6px] pb-3 pt-4 text-base font-medium text-default-600 transition-opacity hover:opacity-80`,
                index === activeTab && 'text-white'
              )}
              onClick={(e) => {
                const width = e.currentTarget.clientWidth;
                const left = e.currentTarget.offsetLeft - 232; // 232 is the size of the left sidebar + padding

                if (e.currentTarget.clientWidth) {
                  setActiveTab(index);
                  setLineDimensions({
                    width,
                    left,
                  });
                }
              }}
            >
              {tab}
              <div className="h-[20px] w-[20px]">
                {errorKeys.length > 0 && isValidTab && (
                  <Image
                    src="/circle-check.svg"
                    width={20}
                    height={20}
                    alt="Warning icon"
                  />
                )}

                {errorKeys.length > 0 && !isValidTab && (
                  <Image
                    src="/warning.svg"
                    width={20}
                    height={20}
                    alt="Warning icon"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <motion.div
        style={{
          width: `${lineDimensions.width}px`,
          transform: `translateX(${lineDimensions.left}px)`,
          transition: 'all 0.3s ease',
        }}
        className="h-[2px] bg-white"
      />
    </>
  );
}

export default HeaderTabs;
