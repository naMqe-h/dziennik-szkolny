import { FirebaseError } from "firebase/app";
import { deleteField, FirestoreErrorCode } from "firebase/firestore";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../../hooks/useUpdateInfoCounter";
import { RootState } from "../../../redux/store";
import { SingleStudentDataFromFirebase } from "../../../utils/interfaces";
import { ModalOptionsStudent } from "../StudentsView";

interface RemoveStudentModal {
  ModalOptions: ModalOptionsStudent;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsStudent>>;
}
export const RemoveStudentModal: React.FC<RemoveStudentModal> = ({
  ModalOptions,
  setModalOptions,
}) => {
  const state = useSelector((state: RootState) => state.principal);
  const { updateCounter } = useUpdateInfoCounter();
  const { setDocument } = useSetDocument();
  async function removeStudent(
    removedStudent: Omit<SingleStudentDataFromFirebase, "password">
  ) {
    try {
      nProgress.start();
      if (state.schoolData) {
        const { domain } = state.schoolData.information;
        const studentsClass = state.schoolData?.classes[removedStudent.class];
        const newStudentsList = studentsClass?.students.filter(
          (x) => x !== removedStudent.email
        );
        const newClassObject = { ...studentsClass, students: newStudentsList };
        setDocument(domain, "students", {
          [removedStudent.email]: deleteField(),
        });
        setDocument(domain, "classes", {
          [removedStudent.class]: newClassObject,
        });
        updateCounter(domain, "studentsCount", "decrement");
        nProgress.done();
        setModalOptions({ isOpen: false, removedStudent: null });
        toast.success("Udało ci się usunąć ucznia", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Wystąpił błąd przy usuwaniu ucznia", { autoClose: 2000 });
      nProgress.done();
    }
  }
  return (
    <div className={`modal ${ModalOptions.isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="text-2xl text-center">
          {`Czy napewno chcesz usunąć tego ucznia ${ModalOptions.removedStudent?.firstName} ${ModalOptions.removedStudent?.lastName} ?`}
        </h2>
        <span className=" text-error select-none text text-center justify-center flex mt-4">
          Usuniętego ucznia nie da się przywrócić!
        </span>
        <div className="modal-action">
          <button
            className={`btn btn-primary`}
            onClick={() => {
              removeStudent(
                ModalOptions.removedStudent as Omit<
                  SingleStudentDataFromFirebase,
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
                  removedStudent: null,
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
