
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default AppLayout;
