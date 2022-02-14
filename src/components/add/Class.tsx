import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  SingleTeacherData,
  ClassesDataFromFirebase,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
import { useValidateInputs } from "../../hooks/useValidateInputs";

type classCredentials = {
  name: string;
  profile: string;
  classTeacher: string;
};
const defaultState: classCredentials = {
  name: "",
  profile: "",
  classTeacher: "",
};

export const Class = () => {
  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const [teachers, setTeachers] = useState<SingleTeacherData[]>([]);
  const [validated, setValidated] = useState<Boolean>(false);

  const domain = schoolData?.information?.domain;

  const [classCredential, setClassCredential] =
    useState<classCredentials>(defaultState);

  const { validateData, inputErrors, errors } = useValidateInputs();
  

  useEffect(() => {
    if (schoolData?.teachers) {
      const teachersData = Object.values(
        schoolData?.teachers
      ) as SingleTeacherData[];

      setTeachers(
        teachersData.filter((teacher) => teacher.classTeacher.length === 0)
      );
    }
    // eslint-disable-next-line
  }, [schoolData?.classes]);




  function clearForm() {
    setClassCredential(defaultState);
  }

  const handleChange = (name: string, value: string) => {
    setClassCredential((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if(validated){
      if (isAdding || errors) return;
      setIsAdding(true);
      const { name, profile, classTeacher } = classCredential;
      const fullName = name + " - " + profile;

      const objWrapper: ClassesDataFromFirebase = {
        [name.replaceAll(/\s/g, "")]: {
          ...classCredential,
          name: classCredential.name.replaceAll(/\s/g, ""),
          fullName,
          subjects: [{ name: "GodzinaWychowawcza", teacher: classTeacher }],
          students: [],
          schedule: []
        },
      };
      // update firebase
      setDocument(domain as string, "classes", objWrapper);
      setDocument(domain as string, "teachers", {
        [classTeacher]: {
          classTeacher: name,
        },
      });

      updateCounter(domain as string, "classesCount", "increment");

      // reset form
      clearForm();
      setIsAdding(false);
      toast.success("Udało ci się dodać klasę 😀", { autoClose: 2000 });
    }
    setValidated(false);
  }, [validated, errors]);
  

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidated(false);
    validateData(classCredential);
    setValidated(true);
  };

  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <label className="label">
        <span className="label-text">Nazwa klasy</span>
      </label>
      <input
        className={`input ${inputErrors.name.error ? "border-red-500" : ""}`}
        type="text"
        placeholder="Nazwa klasy"
        name="name"
        value={classCredential.name}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <label className="label">
        <span className="label-text">Profil</span>
      </label>
      <input
        className={`input ${inputErrors.profile.error ? "border-red-500" : ""}`}
        type="text"
        placeholder="Profil (Mat-fiz)"
        name="profile"
        value={classCredential.profile}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />

      <label className="label">
        <span className="label-text">Wychowawca</span>
      </label>
      <select
        className={`select select-bordered w-full max-w-xs ${
          inputErrors.classTeacher.error ? "border-red-500" : ""
        }`}
        name="classTeacher"
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        value={classCredential.classTeacher}
      >
        <option></option>
        {teachers ? (
          teachers.map((teacher, id) => (
            <option
              key={teacher.firstName + id.toString()}
              value={teacher.email}
            >
              {teacher.firstName + " " + teacher.lastName}
            </option>
          ))
        ) : (
          <option></option>
        )}
      </select>
      <div className="flex items-center justify-center w-full">
        <button
          className="btn btn-primary mt-4 self-end"
          onClick={(e) => handleSubmit(e)}
        >
          Stwórz
        </button>
      </div>
    </form>
  );
};
