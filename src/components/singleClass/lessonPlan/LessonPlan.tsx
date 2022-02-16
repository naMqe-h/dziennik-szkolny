import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  SingleClassData,
  singleClassLessonPlan,
} from "../../../utils/interfaces";
import { SingleDay } from "../../lessonPlan/SingleDay";

type LessonPlanProps = {
  singleClass: SingleClassData | undefined;
};

export const LessonPlan: React.FC<LessonPlanProps> = ({ singleClass }) => {
  const [singleClassLessonPlan, setSingleClassLessonPlan] =
    useState<singleClassLessonPlan>();
  const allLessonPlans = useSelector(
    (state: RootState) => state.schoolData.schoolData?.lessonPlans
  );

  useEffect(() => {
    if (singleClass && allLessonPlans) {
      setSingleClassLessonPlan(
        allLessonPlans[singleClass.name] as singleClassLessonPlan
      );
    }
  }, [allLessonPlans, singleClass]);

  return (
    <div className="w-full overflow-x-auto lessonPlanScrollbar self-baseline">
      <table className="table w-full border-2 border-base-200">
        <thead>
          <tr className="text-primary-focus text-center">
            <th></th>
            <th className="text-lg">
              8<sup>00</sup>-8<sup>45</sup>
            </th>
            <th className="text-lg">
              8<sup>50</sup>-9<sup>35</sup>
            </th>
            <th className="text-lg">
              9<sup>45</sup>-10<sup>30</sup>
            </th>
            <th className="text-lg">
              10<sup>40</sup>-11<sup>25</sup>
            </th>
            <th className="text-lg">
              11<sup>40</sup>-12<sup>25</sup>
            </th>
            <th className="text-lg">
              12<sup>35</sup>-13<sup>20</sup>
            </th>
            <th className="text-lg">
              13<sup>30</sup>-14<sup>15</sup>
            </th>
            <th className="text-lg">
              14<sup>20</sup>-15<sup>05</sup>
            </th>
            <th className="text-lg">
              15<sup>10</sup>-15<sup>55</sup>
            </th>
            <th className="text-lg">
              16<sup>00</sup>-16<sup>45</sup>
            </th>
            <th className="text-lg">
              16<sup>50</sup>-17<sup>35</sup>
            </th>
          </tr>
        </thead>
        <tbody>
          <SingleDay
            dayOfWeek="Poniedziałek"
            lessons={singleClassLessonPlan?.monday}
          />
          <SingleDay
            dayOfWeek="Wtorek"
            lessons={singleClassLessonPlan?.tuesday}
          />
          <SingleDay
            dayOfWeek="Środa"
            lessons={singleClassLessonPlan?.wednesday}
          />
          <SingleDay
            dayOfWeek="Czwartek"
            lessons={singleClassLessonPlan?.thursday}
          />
          <SingleDay
            dayOfWeek="Piątek"
            lessons={singleClassLessonPlan?.friday}
          />
        </tbody>
      </table>
    </div>
  );
};
