import Footer from 'src/components/Footer';
import Header from './components/Header';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
