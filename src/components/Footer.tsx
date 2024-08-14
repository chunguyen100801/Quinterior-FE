import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="border-t border-divider bg-background/70 pb-[40px] pt-[60px]">
      <div className="container_custom">
        <div className="mb-[40px] flex items-center gap-2">
          <Image src="/logo.svg" width={30} height={30} alt="Footer logo" />
          <h2 className="text-xl font-bold text-white">Quinterior</h2>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h3 className="text-[18px] font-medium text-white">Team members</h3>
            <ul className="mt-2 flex flex-col gap-1">
              <li className="text-sm text-white">Nguyễn Văn Tài</li>
              <li className="text-sm text-white">Huỳnh Minh Quang</li>
              <li className="text-sm text-white">Đỗ Minh Quân</li>
              <li className="text-sm text-white">Nguyễn Tấn Chữ</li>
              <li className="text-sm text-white">Nguyễn Minh Phát</li>
            </ul>
          </div>

          <div className="col-span-3">
            <h3 className="text-[18px] font-medium text-white">Discover</h3>
            <ul className="mt-2 flex flex-col gap-1">
              <Link
                href="/generate-your-ideas"
                className="text-sm text-white hover:opacity-80"
              >
                Generate Ideas
              </Link>
              <Link
                href="/find-ideas"
                className="text-sm text-white hover:opacity-80"
              >
                Find You Ideas
              </Link>
              <Link
                href="/floor-plans"
                className="text-sm text-white hover:opacity-80"
              >
                Floor Plan
              </Link>
              <Link
                href="/marketplace"
                className="text-sm text-white hover:opacity-80"
              >
                3D Collection
              </Link>
            </ul>
          </div>
        </div>

        <p className="mt-[40px] text-center text-xs text-[#bdbdbd]">
          Copyright © 2024 Quinterior
        </p>
      </div>
    </footer>
  );
}

export default Footer;
