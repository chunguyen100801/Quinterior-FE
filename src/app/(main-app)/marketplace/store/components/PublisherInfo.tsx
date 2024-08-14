import { UserInFo } from '@/lucia-auth/auth-actions';
import { Avatar, Button, Divider } from '@nextui-org/react';
import { MessageSquareMore, Pencil } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { PublisherInfoType } from '../../../../../types/publisher.type';
import '../../assets/components/styles.css';
import { formatNumberToAbbreviation } from '../../assets/components/utils';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export default async function PublisherInfo({
  publisherInfo,
  userInfo,
}: {
  publisherInfo: PublisherInfoType;
  userInfo: UserInFo | null | undefined;
}) {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  return (
    <div>
      <div className="publisher rounded-lg px-4 py-3 lg:my-4 lg:flex ">
        <div className="flex min-w-fit max-w-0.5">
          <div className="">
            <Link href={''}>
              <Avatar
                src={publisherInfo?.logo}
                className="h-20 w-20 text-large"
              />
            </Link>
          </div>
          <div className="ml-4 items-center space-y-2">
            <div className="min-w-fit text-lg font-medium text-white">
              {publisherInfo?.name || 'Store'}
            </div>
            <div>
              {publisherInfo?.id &&
              (userInfo?.id as unknown as number) !== publisherInfo?.userId ? (
                <Button
                  className=" rounded-lg text-base"
                  size="md"
                  color="primary"
                  variant="ghost"
                >
                  <MessageSquareMore size={18} strokeWidth={0.75} /> Chat
                </Button>
              ) : (
                <Link href="/portal/profile">
                  <Button
                    className=" rounded-lg px-2 text-base"
                    size="md"
                    color="primary"
                    variant="ghost"
                  >
                    <Pencil size={18} strokeWidth={0.75} /> Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Divider orientation="vertical" className="mx-6 hidden lg:block" />
          </div>
        </div>
        <div className="my-4 flex flex-col justify-between space-y-3 tracking-wider md:space-y-2 lg:my-2">
          <div className="items-center space-y-3 md:flex md:space-x-10 md:space-y-0">
            <div className="flex">
              Products:
              <div className=" ml-2 text-blue-400">
                {formatNumberToAbbreviation(publisherInfo?.totalProduct) || 0}
              </div>
            </div>
            {/* <div className="flex">
              Total sales:
              <div className="ml-2 text-blue-400">
                {formatNumberToAbbreviation(publisherInfo?.totalSold) || 0}
              </div>
            </div> */}
            <div className="flex">
              Joined:
              <div className="ml-2 text-blue-400">
                {moment(publisherInfo?.createdAt)
                  .locale('vi')
                  .format('DD-MM-YYYY') || 0}
              </div>
            </div>
          </div>
          <div className="items-center ">
            <div className="flex">
              Address:
              <div className="ml-2 text-blue-400">
                {publisherInfo?.address || ''}
              </div>{' '}
            </div>
          </div>
        </div>
      </div>
      {publisherInfo?.description && (
        <div className="publisher my-8 rounded-lg px-8 py-5 ">
          <div
            className="space-y-4  text-sm tracking-widest"
            dangerouslySetInnerHTML={{
              __html: purify.sanitize(publisherInfo.description),
            }}
          />
        </div>
      )}
    </div>
  );
}
