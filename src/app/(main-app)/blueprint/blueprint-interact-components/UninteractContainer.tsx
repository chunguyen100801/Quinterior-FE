import { ReactNode } from 'react';
import { Blueprint } from '../blueprint3D/blueprint';

export default function UninteractContainer({
  bluePrint,
  children,
}: {
  children: ReactNode;
  bluePrint?: Blueprint | null;
}) {
  return (
    <div
      onMouseOver={() => {
        bluePrint?.Viewer2D?.setisViewPortHover(false);
      }}
      onMouseOut={() => {
        bluePrint?.Viewer2D?.setisViewPortHover(true);
      }}
    >
      {children}
    </div>
  );
}
