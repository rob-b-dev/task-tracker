import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    // Flex column layout to make footer stick to bottom
    // Main element takes full viewport height
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-y-auto snap-y snap-proximity">
        <div className="content-container">
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  );
}
