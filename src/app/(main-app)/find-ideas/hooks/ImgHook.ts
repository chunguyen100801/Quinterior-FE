import { useEffect, useRef, useState } from 'react';

export function useAspectRatio(initialAspect: number = 16 / 9) {
  const [aspect, setAspect] = useState<number>(initialAspect);
  const divContainerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = width / aspect;
  const handleResize = () => {
    if (divContainerRef.current) {
      setWidth(divContainerRef.current.clientWidth);
    }
  };
  useEffect(() => {
    if (divContainerRef.current) {
      setWidth(divContainerRef.current.clientWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    aspect,
    setAspect,
    divContainerRef,
    width,
    height,
    handleResize,
  };
}
