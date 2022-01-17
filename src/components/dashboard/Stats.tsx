import { AiFillInfoCircle } from "react-icons/ai";
import { BsJournalBookmark } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";

export const Stats = () => {
  return (
    <div className="stats grid-flow-row shadow w-full">
      <div className="stat">
        <div className="stat-figure te">
          <AiFillInfoCircle size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba klas</div>
        <div className="stat-value">5</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary items-center">
          <BsJournalBookmark size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba uczniów</div>
        <div className="stat-value">250</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <GiTeacher size={35} className="text-primary" />
        </div>
        <div className="stat-title">Liczba nauczycieli</div>
        <div className="stat-value">48</div>
      </div>
    </div>
  );
};
