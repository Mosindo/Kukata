import BarberNavbar from "../components/BarberNavbar";
import Services from "../components/Services";

export default function BarberServices() {
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <BarberNavbar />
        <Services />
      </div>
    </>
  );
}
