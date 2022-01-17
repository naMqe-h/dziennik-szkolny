import { Stats } from "../components/dashboard/Stats";
import { Events } from "../components/dashboard/Events";
import { RiNumbersFill } from "react-icons/ri";

export const Dashboard = () => {
  return (
    <div className="h-full m-4">
      <div className="grid md:grid-cols-3 gap-2">
        <div className="md:row-span-2 p-5">
          <Stats />
        </div>
        <div className="p-10 flex flex-col items-center content-center bg-secondary rounded-xl">
          <h3 className="mb-2">Oceny</h3>
          <RiNumbersFill size={70} />
        </div>
        <div className="p-10 flex flex-col items-center content-center bg-secondary rounded-xl">
          <h3 className="mb-2">Oceny</h3>
          <RiNumbersFill size={70} />
        </div>
        <div className="p-10 flex flex-col items-center content-center bg-secondary rounded-xl">
          <h3 className="mb-2">Oceny</h3>
          <RiNumbersFill size={70} />
        </div>
        <div className="p-10 flex flex-col items-center content-center bg-secondary rounded-xl">
          <h3 className="mb-2">Oceny</h3>
          <RiNumbersFill size={70} />
        </div>
        <div className="p-10 row-span-2 col-span-3 bg-primary rounded-xl mt-1">
          <Events />
        </div>
      </div>
    </div>
  );
};
