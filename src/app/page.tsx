import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { BorrowInterface } from './components/BorrowInterface';
import { LendInterface } from './components/LendInterface';
import { Markets } from './components/Markets';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
         <Hero />
        <Dashboard />
        <Markets />
        <LendInterface />
        <BorrowInterface />
      </main>
      <Footer />
    </div>
  );
}