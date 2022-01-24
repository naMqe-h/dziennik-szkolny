import { useEffect, useState } from "react";
import {
  SchoolSubjectsDataFromFirebase,
  SubjectData,
} from "../../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import { addNewSubject } from "../../redux/userSlice";
import { useAddDocument } from "../../hooks/useAddDocument";
type OptionsType = { value: string; label: string }[];
interface SubjectDataForm extends Omit<SubjectData, "teachers"> {
  teachers: OptionsType;
}
export const Subject: React.FC = () => {
  const { addDocument } = useAddDocument();
  const dispatch = useDispatch();
  const teachers = useSelector((state: RootState) =>
    state.user.schoolData?.teachers !== undefined
      ? state.user.schoolData.teachers
      : {}
  );
  const schoolData = useSelector((state: RootState) => state.user.schoolData);
  const [subjectData, setSubjectData] = useState<SubjectDataForm>({
    includedAvg: true,
    name: "",
    teachers: [],
  });
  const [options, setOptions] = useState<OptionsType>([]);
  useEffect(() => {
    if (Object.keys(teachers).length !== 0) {
      const temp = Object.values(teachers).map((x) => {
        return {
          value: `${x.firstName} ${x.lastName}`,
          label: `${x.firstName} ${x.lastName}`,
          disabled: false,
        };
      });
      setOptions((prev) => {
        return [...prev, ...temp];
      });
    }
  }, [teachers]);
  function handleSelectChange(currentSelected: OptionsType) {
    setSubjectData((prev) => {
      return { ...prev, teachers: currentSelected };
    });
  }
  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if (subjectData.name.length === 0)
      return toast.error("Podaj nazwe przedmiotu", { autoClose: 2000 });
    //Najpierw sprawdzam opcje gdy dyrektor wybrał brak nauczyciela
    const nameWithoutWhitespace = subjectData.name.replaceAll(/\s+/g, "");

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
    const teachers = Object.values(subjectData.teachers).map((x) => x.value);
    const wrapperObj: SubjectData = {
      name: subjectData.name,
      teachers: teachers,
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
    dispatch(addNewSubject({ [nameWithoutWhitespace]: wrapperObj }));
    toast.success("Udało ci się dodać przedmiot", { autoClose: 2000 });
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
          <label className="label">
            <span className="label-text">Wybierz Nauczycieli</span>
          </label>

          <MultiSelect
            options={options}
            labelledBy="Select"
            hasSelectAll={false}
            onChange={handleSelectChange}
            value={subjectData.teachers}
            className={`text-black transition-opacity `}
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
