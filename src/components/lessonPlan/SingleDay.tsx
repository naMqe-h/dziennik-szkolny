import { useEffect, useState } from "react";
import { singleHoursFromLessonPlan } from "../../utils/interfaces";
import { SingleHour } from "./SingleHour";

// interface singleHoursFromLessonPlan2 extends singleHoursFromLessonPlan {
//   teachingClassName? : string | undefined
// }

interface SingleDayProps {
  lessons: singleHoursFromLessonPlan[] | undefined;
  dayOfWeek: string;
}

export const SingleDay: React.FC<SingleDayProps> = ({ lessons, dayOfWeek }) => {
  const [sortedLessons, setSortedLessons] = useState<singleHoursFromLessonPlan[]>([]);
  const [jsx, setJsx] = useState<any[]>();

  useEffect(() => {
    let tempArray: any = [];
    // eslint-disable-next-line
    lessons?.map((item) => {
      tempArray[item.hour - 1] = item;
    });
    setSortedLessons(tempArray);
  }, [lessons]);

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < 11; i++) {
      temp.push(
        <SingleHour
          key={i}
          isEmpty={!sortedLessons[i]}
          lesson={sortedLessons[i]}
        />
      );
    }
    setJsx(temp);
  }, [sortedLessons]);
  return (
    <tr>
      <th className="text-primary-focus !static">{dayOfWeek}</th>
      {jsx}
    </tr>
  );
};
