import "../globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
      <main className="min-h-screen bg-background text-foreground">
        <Header/>
        
        {children} 
        <Footer/>
    </main>
  );    
}