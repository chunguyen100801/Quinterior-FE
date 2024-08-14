'use client';
import Image from 'next/image';
import {
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_FILE_TYPES } from 'src/constants/file.rule';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  files?: File[];
  onChangeFiles?: (files: File[]) => void;
  isShowPreview?: boolean;
  urls?: string[];
}

const InputFile = forwardRef<HTMLInputElement, Props>(function InputFileComp(
  { onChangeFiles, isShowPreview, urls, ...props },
  ref
) {
  const [files, setFiles] = useState<File[]>(props?.files || []);
  const [previewImages, setPreviewImages] = useState<string[]>(urls ?? []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      onChangeFiles && onChangeFiles(acceptedFiles);
      setFiles(acceptedFiles);
    },
    [onChangeFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    if (isShowPreview && files.length > 0) {
      const images = files
        .filter((file) => ACCEPTED_FILE_TYPES.includes(file.type))
        .map((file) => URL.createObjectURL(file));
      setPreviewImages(images);
    }

    return () => {
      if (isShowPreview && files.length > 0) {
        previewImages.forEach((image) => URL.revokeObjectURL(image));
        setPreviewImages([]);
      }
    };
  }, [files, isShowPreview]);

  return (
    <div
      {...getRootProps()}
      className="relative flex min-h-[200px] flex-col items-center justify-center gap-[16px] rounded-md border border-white px-[28px] py-[24px]"
    >
      <input {...getInputProps()} {...props} ref={ref} type="file" hidden />

      {isShowPreview && previewImages.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-3 bg-background">
          {previewImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              width={150}
              height={150}
              alt={`Preview image ${index}`}
              className="h-[150px] w-[150px] object-cover"
            />
          ))}
        </div>
      ) : (
        <>
          <Image src="/upload.svg" width={83} height={55} alt="Upload" />

          <div className="text-default-500">
            <span className="cursor-pointer font-medium text-white">
              Browse
            </span>{' '}
            or drag a file here
          </div>
          {files.length > 0 && (
            <p className="mt-[4px] text-sm text-white">{files?.[0]?.name}</p>
          )}
        </>
      )}
    </div>
  );
});

export default InputFile;
