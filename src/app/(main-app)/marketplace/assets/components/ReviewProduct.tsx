'use client';
import { getReviewByProduct } from '@/app/apis/review.api';
import { UserInFo } from '@/lucia-auth/auth-actions';
import { Divider, Pagination, Spinner } from '@nextui-org/react';
import { NotebookPen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ELimit } from 'src/constants/enum';
import { AssetItemType } from 'src/types/asset.type';
import { ReviewListConfig, ReviewType } from 'src/types/review.type';
import Comment from './Comment';

interface Props {
  assetDetailData: AssetItemType;
  userInfo: UserInFo | null | undefined;
}

export default function ReviewProduct({ assetDetailData, userInfo }: Props) {
  const [reviewList, setReviewList] = useState<ReviewType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [pagecount, setPagecount] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const takeItem = ELimit.FIFTEEN;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          productId: assetDetailData?.id,
          page: page.toString(),
          take: takeItem,
        } as ReviewListConfig;

        const result = await getReviewByProduct(queryParams);
        if (result && 'data' in result && 'meta' in result) {
          setReviewList(result.data);
          setPagecount(result.meta.pageCount);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assetDetailData?.id, page, takeItem]);

  const handlePageChange = (page: number) => {
    setPage(page);
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({
        behavior: 'instant',
      });
    }
  };

  return (
    <div className="product-description min-h-[10rem] justify-between rounded-lg  py-3 sm:my-4">
      <div className="mb-8 ml-4 mt-2 text-lg font-bold" ref={scrollRef}>
        Product Reviews
      </div>
      {loading ? (
        <div className="flex h-40 w-full items-center justify-center">
          <Spinner size="lg" label="Loading..." color="default" />
        </div>
      ) : reviewList.length > 0 ? (
        <>
          <div className="ml-4 mr-4">
            {reviewList.map((review, index) => (
              <div key={review.id}>
                <Comment review={review} userInfo={userInfo || null} />
                {index < reviewList.length - 1 && <Divider className="my-8" />}
              </div>
            ))}
          </div>
          {pagecount > 1 ? (
            <>
              <Divider className="my-8" />
              <div className="my-[40px] flex justify-center">
                <Pagination
                  page={Number(page || 1)}
                  size="lg"
                  isCompact
                  showControls
                  total={pagecount}
                  initialPage={1}
                  onChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="my-[80px]"></div>
          )}
        </>
      ) : (
        <div className="mb-4 flex h-40 flex-col items-center justify-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
            <NotebookPen size={48} strokeWidth={0.75} />
          </div>
          <div> {'No reviews yet'}</div>
        </div>
      )}
    </div>
  );
}
