import { Stats } from "./dashboard/Stats";
import { Events } from "../dashboard/Events";
import { Card } from "../dashboard/Card";
import { BsFillPeopleFill, BsJournalBookmark } from "react-icons/bs";
import { BiMessageDots } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Graphs } from "./dashboard/Graphs";

export const DashboardView = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-screen-2xl w-full">
        <div className="md:row-span-4 p-5 bg-base-300 rounded-xl flex flex-col justify-center">
          <Stats />
        </div>
        <Link to={"/students"}>
          <Card 
            text="Uczniowie"
            background="bg-gradient-to-r from-primary to-accent"
          >
            <BsFillPeopleFill size={70} />
          </Card>
        </Link>
        <Link to={"/classes"}>
          <Card
            text="Klasy"
            background="bg-gradient-to-r from-primary to-accent"
          >
            <BsJournalBookmark size={70} />
          </Card>
        </Link>
        <Link to='/messages'>
          <Card
            text="WIADOMOŚCI"
            background="bg-gradient-to-r from-primary to-secondary"
          >
            <BiMessageDots size={70} />
          </Card>
        </Link>
        <Link to={"/teachers"}>
          <Card
            text="Nauczyciele"
            background="bg-gradient-to-r from-primary to-secondary"
          >
            <FaChalkboardTeacher size={70} />
          </Card>
        </Link>

        <div className="p-10 mt-2 row-span-2 md:col-span-2 bg-base-300 rounded-xl flex flex-col items-center min-h-[480px]">
          <Events />
        </div>
        <div className="md:col-span-3 rounded-xl bg-base-300">
          <Graphs />
        </div>
      </div>
     
    </div>
  );
};
