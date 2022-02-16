import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  daysOfWeek,
  SingleClassData,
  singleClassLessonPlan,
} from "../../../../utils/interfaces";
import { getDayOfTheWeek } from "../../../../utils/utils";
import { SingleMobileHour } from "./SingleMobileHour";
interface MobileLessonPlanProps {
  singleClass: SingleClassData | undefined;
}
export const MobileLessonPlan: React.FC<MobileLessonPlanProps> = ({
  singleClass,
}) => {
  const [singleClassLessonPlan, setSingleClassLessonPlan] =
    useState<singleClassLessonPlan>({});
  const [currentDay, setCurrentDay] = useState<daysOfWeek>(
    getDayOfTheWeek(new Date().getDay())
  );
  const [mappedHours, setMappedHours] = useState<JSX.Element[]>([]);
  const allLessonPlans = useSelector(
    (state: RootState) => state.schoolData.schoolData?.lessonPlans
  );
  useEffect(() => {
    if (!isEmpty(singleClassLessonPlan)) {
      const dayPlan = singleClassLessonPlan[currentDay];
      const temp: JSX.Element[] = [];
      const lastHour = dayPlan.reduce((prev, current) =>
        prev.hour > current.hour ? prev : current
      );
      for (let i = 0; i < lastHour.hour; i++) {
        temp.push(
          <SingleMobileHour
            isEmpty={!dayPlan.some((x) => x.hour === i + 1)}
            lesson={dayPlan[i]}
            index={i}
            key={i}
          />
        );
      }
      setMappedHours(temp);
      //   console.table(dayPlan);
    }
  }, [currentDay, singleClassLessonPlan]);
  useEffect(() => {
    if (singleClass && allLessonPlans) {
      setSingleClassLessonPlan(
        allLessonPlans[singleClass.name] as singleClassLessonPlan
      );
    }
  }, [allLessonPlans, singleClass]);
  return (
    <div className="container flex flex-col items-center px-2">
      <select
        name="DaySelect"
        className="select-primary select w-full"
        value={currentDay}
        onChange={(e) => setCurrentDay(e.target.value as daysOfWeek)}
      >
        <option value="monday">Poniedziałek</option>
        <option value="tuesday">Wtorek</option>
        <option value="wednesday">Środa</option>
        <option value="thursday">Czwartek</option>
        <option value="friday">Piątek</option>
      </select>
      <div className="w-fit flex flex-col items-center justify-center mt-4 p-4">
        {mappedHours}
      </div>
    </div>
  );
};