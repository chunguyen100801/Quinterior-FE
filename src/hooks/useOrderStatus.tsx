import { updateOrderStatus } from '@/app/apis/order.api';
import { useState } from 'react';
import { toast } from 'sonner';
import { HttpStatusCode, PurchaseStatus } from 'src/constants/enum';

function useOrderStatus() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateOrderStatus = async (
    orderId: number,
    status: PurchaseStatus,
    callback?: () => void
  ) => {
    if (isLoading) return;
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      setIsLoading(true);

      const res = await updateOrderStatus(orderId, { status });

      if (res && 'error' in res) {
        toast.error(res.error, {
          id: toastId,
        });
      } else {
        if (res?.statusCode === HttpStatusCode.OK) {
          toast.success(res.message, {
            id: toastId,
          });
          callback?.();
        } else {
          toast.error(res?.message ?? 'An error occured', {
            id: toastId,
          });
        }
      }
    } catch (error) {
      toast.error((error as Error).message, {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateOrderStatus: handleUpdateOrderStatus,
  };
}

export default useOrderStatus;
