'use client';
import React from 'react';
import { Card, CardHeader, CardBody, Avatar, Divider } from '@nextui-org/react';
import { Star } from 'lucide-react';
import ReportComment from './ReportComment';
import { ReviewType } from 'src/types/review.type';
import { UserInFo } from '@/lucia-auth/auth-actions';
import moment from 'moment';

interface Props {
  review: ReviewType;
  userInfo: UserInFo | null | undefined;
}

export default function Comment({ review, userInfo }: Props) {
  return (
    <>
      <Card className="bg-transparent tracking-wider" radius="sm">
        <CardHeader className="mb-2 justify-between px-4">
          <div className="flex gap-5">
            <Avatar
              radius="full"
              size="md"
              src={review?.creator?.avatar || ''}
            />
            <div className="flex flex-col items-start justify-center gap-2">
              <h4 className="font-medium leading-none">
                {review?.creator?.firstName + ' ' + review?.creator?.lastName}
              </h4>
              <div className="flex items-center gap-[1px]">
                {Array.from({
                  length: 5,
                }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review?.rating ? '#effb09' : 'transparent'}
                    strokeWidth={0.75}
                  />
                ))}
                <Divider orientation="vertical" className="mx-2" />
                <div className="text-xs  tracking-widest text-default-500">
                  {moment(review?.createdAt)
                    .locale('vi')
                    .format('HH-MM DD-MM-YYYY') || 0}{' '}
                </div>
              </div>
            </div>
          </div>
          {review?.creatorId !== Number(userInfo?.id || 0) && <ReportComment />}
        </CardHeader>
        <CardBody className="px-4 py-0 pb-4 text-small">
          <p className="ml-[60px]">{review?.comment || ''}</p>
        </CardBody>
      </Card>

      {review.reply && (
        <Card className="my-3 ml-10 bg-transparent" radius="sm">
          <CardHeader className="mb-2 justify-between px-4">
            <div className="flex gap-5">
              <div className="flex items-center ">
                <h4 className="font-medium leading-none">
                  Reply from publisher{' '}
                </h4>
                <Divider orientation="vertical" className="mx-2" />
                <div className="mt-1 text-xs tracking-widest text-default-500">
                  {moment(review?.updatedAt)
                    .locale('vi')
                    .format('HH-MM DD-MM-YYYY') || 0}{' '}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-4 py-0 pb-4 text-small">
            <p>{review?.reply}</p>
          </CardBody>
        </Card>
      )}
    </>
  );
}
