import { AiOutlineCalendar, AiOutlinePartition } from "react-icons/ai";
import { BsJournalBookmark } from "react-icons/bs";
import { RiNumbersLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Card } from "../dashboard/Card";
import { Events } from "../dashboard/Events";
import { Stats } from "./Stats";

export const DashboardView = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-screen-2xl w-full">
        <div className="md:row-span-4 p-5 bg-base-300 rounded-xl flex flex-col justify-center">
          <Stats />
        </div>
        <Link to={"/lesson-plan"}>
          <Card text="Plan lekcji" background="bg-gradient-to-r from-primary to-accent">
            <RiNumbersLine size={70} />
          </Card>
        </Link>
        <Link to={"/grades"}>
          <Card
            text="Oceny"
            background="bg-gradient-to-r from-primary to-accent"
          >
            <BsJournalBookmark size={70} />
          </Card>
        </Link>
        <Link to='/frequency'>
          <Card
            text="Frekwencja"
            background="bg-gradient-to-r from-primary to-secondary"
          >
            <AiOutlineCalendar size={70} />
          </Card>
        </Link>
        <Link to={"/messages"}>
          <Card
            text="Wiadomości"
            background="bg-gradient-to-r from-primary to-secondary"
          >
            <AiOutlinePartition size={70} />
          </Card>
        </Link>

        <div className="p-10 mt-2 row-span-2 md:col-span-2 bg-base-300 rounded-xl flex flex-col items-center min-h-[480px]">
          <Events />
        </div>
      </div>
    </div>
  );
};
