import { useEffect, useState } from "react";
import {
  SchoolSubjectsDataFromFirebase,
  SubjectData,
} from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useAddDocument } from "../../hooks/useAddDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
type OptionsType = { value: string; label: string }[];
interface SubjectDataForm extends Omit<SubjectData, "teachers"> {
  teachers: OptionsType;
}
const defaultState: SubjectDataForm = {
  includedAvg: true,
  name: "",
  teachers: [],
};
export const Subject: React.FC = () => {
  const { addDocument } = useAddDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const schoolData = useSelector((state: RootState) => state.user.schoolData);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [subjectData, setSubjectData] = useState<SubjectDataForm>(defaultState);
  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    const nameWithoutWhitespace = subjectData.name.replaceAll(/\s+/g, "");
    if (isAdding) return;
    if (subjectData.name.length === 0)
      return toast.error("Podaj nazwe przedmiotu", { autoClose: 2000 });
    if (schoolData?.subjects) {
      if (
        Object.keys(schoolData?.subjects).some(
          (x) =>
            x.toLowerCase().replaceAll(/\s+/g, "") ===
            nameWithoutWhitespace.toLowerCase()
        )
      ) {
        return toast.error("Podaj nazwa przedmiotu jest już zajęta", {
          autoClose: 2000,
        });
      }
    }

    if (schoolData?.subjects) {
      if (
        Object.keys(
          schoolData?.subjects as SchoolSubjectsDataFromFirebase
        ).some((x) => x === nameWithoutWhitespace)
      ) {
        return toast.error("Podany przedmiot już istnieje", {
          autoClose: 2000,
        });
      }
    }
    setIsAdding(true);
    const wrapperObj: SubjectData = {
      name: subjectData.name,
      teachers: [],
      includedAvg: subjectData.includedAvg,
    };
    const objForFirebase: SchoolSubjectsDataFromFirebase = {
      [nameWithoutWhitespace]: wrapperObj,
    };
    addDocument(
      schoolData?.information.domain as string,
      "subjects",
      objForFirebase
    );
    clearForm();
    updateCounter(
      schoolData?.information.domain as string,
      "subjectsCount",
      "increment"
    );
    toast.success("Udało ci się dodać przedmiot", { autoClose: 2000 });
    setIsAdding(false);
  }
  function clearForm() {
    setSubjectData(defaultState);
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;
    if (name === "includedAvg") {
      setSubjectData((prev) => {
        return { ...prev, includedAvg: checked };
      });
    } else {
      setSubjectData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  }
  return (
    <div className="mt-12 flex items-center justify-center">
      <form
        className="form-control  flex flex-col rounded-2xl  bg-base-200 p-14"
        action="none"
      >
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Nazwa przedmiotu</span>
          </label>
          <input
            type="text"
            name="name"
            className="input"
            autoComplete="name"
            value={subjectData.name}
            placeholder="Name"
            onChange={handleChange}
          />
        </div>
        <div className="form-control mb-4">
          <div className="flex justify-center items-center gap-4">
            <span className="label-text">Liczone do Średniej</span>
            <input
              type="checkbox"
              name="includedAvg"
              className="checkbox"
              onChange={handleChange}
              checked={subjectData.includedAvg}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-full">
          <button
            className="btn-primary text-white btn w-[40%]"
            onClick={(e) => validateData(e)}
          >
            Dodaj
          </button>
        </div>
        <button />
      </form>
    </div>
  );
};
