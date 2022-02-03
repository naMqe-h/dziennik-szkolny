import { useEffect, useState } from "react";
import {
  ErrorObj,
  SchoolSubjectsDataFromFirebase,
  SubjectData,
} from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useSetDocument } from "../../hooks/useSetDocument";
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

type SubjectCredentialsErrors = {
  name: ErrorObj;
  
};
const defaultErrorState:SubjectCredentialsErrors = {
  name: {error:false, text: ''},
};

export const Subject: React.FC = () => {
  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [subjectData, setSubjectData] = useState<SubjectDataForm>(defaultState);
  const [fieldErrors, setFieldErrors] = useState<SubjectCredentialsErrors>(defaultErrorState);

  useEffect(() => {
    Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
  }, [fieldErrors]);

  const validateInputs = (nameWithoutWhitespace: string) => {
    setFieldErrors(defaultErrorState);
    let errors = false;
    // if (teacher.firstName.length === 0) {
    //   setFieldErrors((prev) => (
    //         {...prev, ['firstName']: {'error':true, 'text':"Podaj Imię"}}))
    //     errors = true
    // }
    if (subjectData.name.length === 0){
      setFieldErrors((prev) => (
        {...prev, name: {'error':true, 'text':"Podaj nazwe przedmiotu"}}))
        errors = true
    }
    
    if (schoolData?.subjects) {
      if (
        Object.keys(schoolData?.subjects).some(
          (x) =>
            x.toLowerCase().replaceAll(/\s+/g, "") ===
            nameWithoutWhitespace.toLowerCase()
        )
      ) {
        setFieldErrors((prev) => (
          {...prev, name: {'error':true, 'text':"Podaj nazwa przedmiotu jest już zajęta"}}))
          errors = true
      }
    }

    if (schoolData?.subjects) {
      if (
        Object.keys(
          schoolData?.subjects as SchoolSubjectsDataFromFirebase
        ).some((x) => x === nameWithoutWhitespace)
      ) {
        setFieldErrors((prev) => (
          {...prev, name: {'error':true, 'text':"Podany przedmiot już istnieje"}}))
          errors = true
      }
    }
    
    return errors
  }

  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    const nameWithoutWhitespace = subjectData.name.replaceAll(/\s+/g, "");
    if (isAdding || validateInputs(nameWithoutWhitespace)) return;
    
    setIsAdding(true);
    const wrapperObj: SubjectData = {
      name: subjectData.name,
      teachers: [],
      includedAvg: subjectData.includedAvg,
    };
    const objForFirebase: SchoolSubjectsDataFromFirebase = {
      [nameWithoutWhitespace]: wrapperObj,
    };
    setDocument(
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
            className={`input ${fieldErrors.name.error ? "border-red-500" : ''}`}
            autoComplete="name"
            value={subjectData.name}
            placeholder="Nazwa przedmiotu"
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
