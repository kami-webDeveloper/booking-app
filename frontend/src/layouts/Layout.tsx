import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { Outlet } from "react-router";
import SearchBar from "../components/SearchBar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <div className="container md:px-40 mx-auto flex-1">{<Outlet />}</div>
      <Footer />
    </div>
  );
};

export default Layout;
