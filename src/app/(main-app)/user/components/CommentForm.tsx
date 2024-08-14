import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from '@nextui-org/react';
import { Star } from 'lucide-react';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { CommentType } from 'src/constants/enum';
import { ReviewDataList } from 'src/types/review.type';

interface Props {
  commentType: string;
  orderItemId: number;
  handleReplyClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<ReviewDataList, ReviewDataList>;
  index: number;
}

export default function CommentForm({
  commentType,
  handleReplyClick, // index,
  orderItemId,
  control,
  index,
}: Props) {
  const [hoverRating, setHoverRating] = useState(1);

  return (
    <>
      <Card
        className={`my-3 bg-transparent ${
          commentType == CommentType.REPLY ? 'ml-10' : ''
        }`}
        radius="sm"
      >
        <CardHeader className="justify-between px-4">
          <div className="flex gap-5">
            <div className="flex items-center ">
              <h4 className="font-medium leading-none">
                {commentType != CommentType.REPLY
                  ? 'Your review:'
                  : 'Reply from publisher'}{' '}
              </h4>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-0 pb-4 text-small">
          {commentType == CommentType.REPLY ? (
            <></>
          ) : (
            <div className="mb-4 mt-0 flex items-center gap-2">
              <div>Star rating: </div>
              <Controller
                name={`items.${index}.rating`}
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        strokeWidth={0.75}
                        key={i}
                        size={20}
                        fill={
                          i < hoverRating
                            ? '#effb09'
                            : i < field.value
                              ? '#effb09'
                              : 'transparent'
                        }
                        onClick={() => {
                          field.onChange(i + 1);
                          setHoverRating(i + 1);
                        }}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(field.value)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </>
                )}
              />
            </div>
          )}

          <Controller
            name={`items.${index}.comment`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Textarea
                variant="bordered"
                label="Review"
                placeholder="Write your review here..."
                className="mt-2"
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name={`items.${index}.orderItemId`}
            control={control}
            defaultValue={orderItemId}
            render={({ field }) => (
              <input hidden {...field} value={orderItemId} />
            )}
          />

          <div className="mt-2 flex justify-end">
            {commentType == CommentType.REPLY ? (
              <Button
                color="primary"
                variant="light"
                onClick={handleReplyClick}
              >
                Cancel
              </Button>
            ) : (
              <></>
            )}

            {/* <Button color="primary" className="ml-2">
              Post
            </Button> */}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
