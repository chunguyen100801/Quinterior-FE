import AuthTab from './components/auth-tab';

export default function App() {
  return (
    <div className=" flex min-h-full w-full  items-center justify-center ">
      <div className=" relative grid w-[80vw] grid-cols-[1fr]  items-center justify-items-center xl:grid-cols-[3fr_2fr]">
        <div className="  hidden flex-col gap-[1rem]  xl:flex ">
          <span className="w-[35rem] text-[4.6rem] font-bold leading-[112%] tracking-[.003rem]">
            Welcome to your personal interior design place
          </span>
          <span className="w-[35rem] text-[1.5rem] font-bold leading-[112%] tracking-[.003rem]">
            To keep connected with us please login with your personal info
          </span>
        </div>

        <div className=" flex flex-col items-center justify-start  ">
          <AuthTab></AuthTab>
        </div>
      </div>
    </div>
  );
}
