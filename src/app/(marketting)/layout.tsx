import Footer from '@/components/Footer';
import NavBar from './components/nav-bar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar></NavBar>

      <div>{children}</div>

      <Footer></Footer>
    </div>
  );
}
