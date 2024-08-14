import GenerateYourIdeas from './component/GenerateYourIdeas';

export default function page() {
  return (
    <div
      className="relative flex h-fit min-h-[calc(100vh-4.5rem)]
flex-col items-center  justify-center py-[3rem]"
    >
      <GenerateYourIdeas></GenerateYourIdeas>
    </div>
  );
}
