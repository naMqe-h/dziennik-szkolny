import { Stats } from "./dashboard/Stats";
import { Events } from "../dashboard/Events";
import { Card } from "../dashboard/Card";
import { RiNumbersLine } from "react-icons/ri";
import { BsJournalBookmark } from "react-icons/bs";
import { AiOutlineCalendar, AiOutlinePartition } from "react-icons/ai";
import { Link } from "react-router-dom";

export const DashboardView = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-screen-2xl w-full">
        <div className="md:row-span-4 p-5 bg-base-200 rounded-xl flex flex-col justify-center">
          <Stats />
        </div>
        <Link to={"/students"}>
          <Card text="Uczniowie">
            <RiNumbersLine size={70} />
          </Card>
        </Link>
        <Link to={"/classes"}>
          <Card
            text="Klasy"
            background="radial-gradient(circle, rgba(109,58,156,1) 0%, rgba(33,33,33,1) 100%)"
          >
            <BsJournalBookmark size={70} />
          </Card>
        </Link>
        <Card
          text="Plany Lekcji"
          background="radial-gradient(circle, rgba(81,168,0,1) 0%, rgba(33,33,33,1) 100%)"
        >
          <AiOutlineCalendar size={70} />
        </Card>
        <Link to={"/teachers"}>
          <Card
            text="Nauczyciele"
            background="radial-gradient(circle, rgba(226,98,124,1) 9%, rgba(204,91,114,1) 37%, rgba(33,33,33,1) 100%)"
          >
            <AiOutlinePartition size={70} />
          </Card>
        </Link>

        <div className="p-10 mt-2 row-span-2 md:col-span-2 bg-base-200 rounded-xl flex flex-col items-center min-h-[480px]">
          <Events />
        </div>
      </div>
    </div>
  );
};
