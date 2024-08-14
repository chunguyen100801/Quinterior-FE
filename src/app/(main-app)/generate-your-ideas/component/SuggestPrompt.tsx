import { Snippet } from '@nextui-org/react';

export default function SuggestPrompt({ prompt }: { prompt: string }) {
  return (
    <div className=" cursor-pointer p-2 font-light">
      <Snippet symbol="" variant="bordered" className="w-full">
        <span className="line-clamp-4 text-wrap">{prompt}</span>
      </Snippet>
    </div>
  );
}
