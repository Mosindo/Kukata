import Navbar from "../../../components/Navbar";
import Header from "../components/Header";
import BarberNavbar from "../components/BarberNavbar";
import Services from "../components/Services";

export default function BarberServices() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <Navbar />
        <Header />
        <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
          <div className="bg-white w-[100%] rounded p-3 shadow">
            <BarberNavbar />
            <Services />
          </div>
        </div>
      </main>
    </main>
  );
}
