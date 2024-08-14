import React, { InputHTMLAttributes, KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: number;
  onInputChange?: (value: number) => void;
}

function InputNumber({
  min,
  max,
  step,
  value,
  className,
  disabled,
  onInputChange,
  ...props
}: Props) {
  // const [localValue, setLocalValue] = useState(value || 1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (_value: number) => {
    const minNum = Number(min);
    const maxNum = Number(max);
    let value = _value;
    if (!inputRef.current) return;

    if (_value < 1) {
      inputRef.current.value = '';
    } else if (_value > maxNum) {
      if (!inputRef.current) return;
      inputRef.current.value = maxNum.toString();
    }
    value = Number(inputRef.current.value) || minNum;
    // if (value < minNum) {
    //   if (!inputRef.current) return;
    //   inputRef.current.value = '';
    // }
    // if (!isNaN(minNum) && value < minNum) {
    //   value = minNum;
    // } else if (!isNaN(maxNum) && value > maxNum) {
    //   value = maxNum;
    // }
    // setLocalValue(value);
    onInputChange && onInputChange(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.which || e.keyCode;
    if (
      charCode === 189 ||
      charCode === 109 ||
      charCode === 190 ||
      charCode === 110 ||
      charCode === 101
    ) {
      e.preventDefault();
    }
  };

  const handleInputBlur = () => {
    if (!inputRef.current || inputRef.current.value === '') {
      if (!inputRef.current) return;
      inputRef.current.value = '1';
    }
  };

  return (
    <input
      ref={inputRef}
      type="number"
      {...props}
      // value={localValue}
      defaultValue={value || Number(min) || 1}
      min={min}
      step={step}
      max={max}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onChange={(e) => handleInputChange(Number(e.target.value))}
      onBlur={handleInputBlur}
      className={twMerge(
        'flex w-20 items-center justify-center border-1 border-solid bg-transparent pl-4 text-center transition-opacity',
        disabled && 'border-gray-400',
        className
      )}
    />
  );
}

export default InputNumber;
