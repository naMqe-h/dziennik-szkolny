import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SingleDay } from "../components/lessonPlan/SingleDay";
import { MobileLessonPlan } from "../components/singleClass/lessonPlan/mobileLessonPlan/MobileLessonPlan";
import useMediaQuery from "../hooks/useMediaQuery";
import { RootState } from "../redux/store";
import {singleClassLessonPlan } from "../utils/interfaces";


export const LessonPlan = () => {
  const [singleUserLessonPlan, setSingleUserLessonPlan] = useState<singleClassLessonPlan>();
  const userType = useSelector((state: RootState) => state.userType.userType);
  const teacherData = useSelector((state: RootState) => state.teacher.data);
  const studentData = useSelector((state: RootState) => state.student.data);
  const allLessonPlans = useSelector(
    (state: RootState) => state.schoolData.schoolData?.lessonPlans
  );
  const isMobile = useMediaQuery("(max-width:480px)");
  const showMobileLessonPlan = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    if (userType === "teachers") {
      if (teacherData?.workingHours) {
        let tempLessonPlan: singleClassLessonPlan = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        };

        teacherData?.workingHours.forEach((item) => {
          tempLessonPlan[item.dayOfWeek][+item.hour - 1] = {
            teacher: teacherData.email,
            subject: teacherData.subject,
            hour: item.hour,
            teachingClassName: item.className,
          };
        });

        setSingleUserLessonPlan(tempLessonPlan);
      }
    } else if (userType === "students") {
      if (allLessonPlans && studentData) {
        setSingleUserLessonPlan(allLessonPlans[studentData?.class]);
      }
    }
  }, [teacherData, allLessonPlans, studentData, userType]);

  return (
    <div className="w-full overflow-x-auto lessonPlanScrollbar self-baseline px-12 pt-6">
      <Link to="/" className="flex items-center mb-2 gap-2">
        <BsFillArrowLeftCircleFill
          className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
        />
        {!isMobile && "Powrót na stronę główną"}
      </Link>
      {!isMobile ? (
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
              lessons={singleUserLessonPlan?.monday}
            />
            <SingleDay
              dayOfWeek="Wtorek"
              lessons={singleUserLessonPlan?.tuesday}
            />
            <SingleDay
              dayOfWeek="Środa"
              lessons={singleUserLessonPlan?.wednesday}
            />
            <SingleDay
              dayOfWeek="Czwartek"
              lessons={singleUserLessonPlan?.thursday}
            />
            <SingleDay
              dayOfWeek="Piątek"
              lessons={singleUserLessonPlan?.friday}
            />
          </tbody>
        </table>
      ) : (
        <MobileLessonPlan
          singleClass={undefined}
          singleTaecherData={singleUserLessonPlan}
        />
      )}
    </div>
  );
};
