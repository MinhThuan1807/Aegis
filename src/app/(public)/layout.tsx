import "../globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="min-h-screen bg-background text-foreground">
        <Header/>
        
        {children} 
        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
        <Footer/>
    </main>
  );    
}