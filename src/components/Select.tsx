'use client';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useOutsideClick } from '../hooks/useOutsideClick';

export type TSelectItem = {
  value: string | number;
  label: string;
  onClick?: () => void;
};

interface Props {
  data: TSelectItem[];
  defaultItem?: TSelectItem;
  placeholder?: string;
  wrapperClassName?: string;
  selectMenuClassName?: string;
  selectItemClassName?: string;
}

function Select({
  data,
  defaultItem,
  placeholder,
  wrapperClassName,
  selectMenuClassName,
  selectItemClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TSelectItem | null>(
    defaultItem ?? null
  );

  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false));

  useEffect(() => {
    if (defaultItem) setSelectedItem(defaultItem);
  }, [defaultItem]);

  return (
    <div className="relative">
      <div
        className={twMerge(
          'flex h-[36px] cursor-pointer items-center gap-1 rounded-sm border border-transparent bg-[#242526] px-3 hover:border-gray-400',
          isOpen && 'border-blue-300 hover:border-blue-300',
          wrapperClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-sm text-[#ffffffb8]">
          {selectedItem?.label ?? placeholder}
        </p>
        <ChevronDown
          strokeWidth={3}
          color={isOpen ? '#68a6ed' : '#ffffffb8'}
          size={14}
          className={twMerge(
            'transition-transform duration-400',
            isOpen && 'rotate-180'
          )}
        />
      </div>
      <ul
        ref={dropdownRef}
        className={twMerge(
          'absolute left-0 right-0 top-[calc(100%+6px)] z-10 rounded-sm bg-[#242526]',
          !isOpen && 'hidden',
          selectMenuClassName
        )}
      >
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <li
              onClick={() => {
                item.onClick?.();
                setSelectedItem(item);
                setIsOpen(false);
              }}
              key={item.value}
              className={twMerge(
                'flex h-[30px] cursor-pointer items-center px-3 text-sm font-medium text-[#ffffff88] transition-all duration-200 hover:bg-[#373c3f] hover:text-[#ffffff9d]',
                selectedItem?.value === item.value && 'bg-blue-300 text-white',
                selectItemClassName
              )}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Select;
