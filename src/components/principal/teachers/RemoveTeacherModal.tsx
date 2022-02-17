import { deleteField, arrayRemove } from "firebase/firestore";
import { cloneDeep } from "lodash";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../../hooks/useUpdateInfoCounter";
import { RootState } from "../../../redux/store";
import {
  LessonPlansDataFromFirebase,
  singleClassLessonPlan,
  SingleTeacherData,
} from "../../../utils/interfaces";
import { ModalOptionsTeachers } from "../TeachersView";

interface RemoveTeacherModalProps {
  ModalOptions: ModalOptionsTeachers;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsTeachers>>;
}
export const RemoveTeacherModal: React.FC<RemoveTeacherModalProps> = ({
  ModalOptions,
  setModalOptions,
}) => {
  const principal = useSelector((state: RootState) => state.principal);
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();
  async function RemoveTeacher(
    removedTeacher: Omit<SingleTeacherData, "password">
  ) {
    if (principal.data?.schoolInformation.domain) {
      const { domain } = principal.data?.schoolInformation;
      const email = removedTeacher.email as string;
      try {
        nProgress.start();
        if (schoolData) {
          let allClasses = { ...schoolData.classes };
          const keys = Object.keys(schoolData.classes).filter((x) => {
            return removedTeacher.teachedClasses.some((y) => y === x);
          });
          //?Przy przywracaniu należy wziąć arraya teahcedClasses i dodać spowrotem do fielda danej klasy tego nauczyciela i jego przedmiot
          Object.entries(allClasses).forEach((item) => {
            if (keys.some((y) => y === item[0])) {
              const FilteredArray = item[1].subjects.filter(
                (x) => x.teacher !== removedTeacher.email
              );
              allClasses[item[0]] = { ...item[1], subjects: FilteredArray };
            }
          });
          const newLessonsPlans: LessonPlansDataFromFirebase = cloneDeep(
            schoolData.lessonPlans
          );
          removedTeacher.teachedClasses.forEach((item) => {
            const newLessonPlan: singleClassLessonPlan = {};
            const oldClassLessonPlan = schoolData.lessonPlans[item];
            if (oldClassLessonPlan) {
              Object.entries(oldClassLessonPlan).forEach((values, _n) => {
                const dayOfTheWeek = values[0];
                const hoursArray = values[1];
                newLessonPlan[dayOfTheWeek] = hoursArray.filter(
                  (x) => x.teacher !== removedTeacher.email
                );
              });
            }
            newLessonsPlans[item] = newLessonPlan;
          });
          const removedTeacherData: SingleTeacherData =
            schoolData.teachers[email];
          setDocument(domain, "teachers", {
            [email]: { ...removedTeacherData, isActive: false },
          });
          const subjectName = removedTeacher.subject.replaceAll(/\s/g, "");
          //?Przy przywracaniu trzeba dodać do array znowu
          setDocument(domain, "subjects", {
            [subjectName]: {
              teachers: arrayRemove(removedTeacher.email),
            },
          });
          setDocument(domain, "lessonPlans", newLessonsPlans);
          setDocument(domain, "classes", allClasses);
          if (removedTeacher.classTeacher !== "Brak klasy") {
            setDocument(domain, "classes", {
              [removedTeacher.classTeacher.replaceAll(/\s/g, "")]: {
                classTeacher: "",
              },
            });
          }
          updateCounter(domain, "teachersCount", "decrement");
          nProgress.done();
          setModalOptions({ isOpen: false, removedTeacher: null });
          toast.success("Udało ci się usunąć nauczyciela", { autoClose: 2000 });
        }
      } catch (error) {
        nProgress.done();
        console.log(error);
        toast.error("Wystąpił błąd przy usuwaniu dokumentu", {
          autoClose: 2000,
        });
      }
    }
  }
  return (
    <div className={`modal ${ModalOptions.isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="text-2xl text-center">
          {`Czy napewno chcesz usunąć tego nauczyciela ${ModalOptions.removedTeacher?.firstName} ${ModalOptions.removedTeacher?.lastName} ?`}
        </h2>
        <span className=" text-success select-none text text-center justify-center flex mt-4">
          Usuniętego nauczyciela można przywrócić w dowolnym momencie!
        </span>
        <div className="modal-action">
          <button
            className={`btn btn-primary`}
            onClick={() => {
              RemoveTeacher(
                ModalOptions.removedTeacher as Omit<
                  SingleTeacherData,
                  "password"
                >
              );
            }}
          >
            Usuń
          </button>
          <button
            className="btn"
            onClick={() => {
              setModalOptions(() => {
                return {
                  removedTeacher: null,
                  isOpen: false,
                };
              });
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
