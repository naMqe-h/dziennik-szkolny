import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  SingleTeacherData,
  ClassesDataFromFirebase,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { useAddDocument } from "../../hooks/useAddDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";

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
  const { addDocument } = useAddDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const schoolData = useSelector((state: RootState) => state.user?.schoolData);
  const [teachers, setTeachers] = useState<SingleTeacherData[]>([]);

  const domain = schoolData?.information?.domain;

  const [classCredential, setClassCredential] =
    useState<classCredentials>(defaultState);
  useEffect(() => {
    if (schoolData?.teachers) {
      const teachersData = Object.values(
        schoolData?.teachers
      ) as SingleTeacherData[];

      setTeachers(
        teachersData.filter((teacher) => teacher.classTeacher.length === 0)
      );
    }
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
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isAdding) return;
    if (classCredential.name.length === 0) {
      return toast.error("Podaj nazwę klasy", { autoClose: 2000 });
    }
    if (schoolData?.classes) {
      const classes = Object.keys(schoolData?.classes);
      if (classes) {
        if (classes.some((x) => x === classCredential.name)) {
          return toast.error("Podana klasa już istenije", { autoClose: 2000 });
        }
      }
    }
    if (classCredential.profile.length === 0) {
      return toast.error("Podaj Profil", { autoClose: 2000 });
    }
    if (classCredential.classTeacher.length === 0) {
      return toast.error("Wybierz wychowawcę", { autoClose: 2000 });
    }
    setIsAdding(true);
    const { name, profile, classTeacher } = classCredential;
    const fullName = name + "-" + profile;

    const objWrapper: ClassesDataFromFirebase = {
      [name]: { ...classCredential, fullName, subjects: [], students: [] },
    };
    // update firebase
    addDocument(domain as string, "classes", objWrapper);
    addDocument(domain as string, "teachers", {
      [classTeacher]: {
        classTeacher: name,
      },
    });

    updateCounter(domain as string, "classesCount", 'increment');

    // reset form
    clearForm();
    setIsAdding(false);
    return toast.success("Udało ci się dodać klasę 😀", { autoClose: 2000 });
  };

  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <label className="label">
        <span className="label-text">Nazwa klasy</span>
      </label>
      <input
        className="input"
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
        className="input"
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
        className="select select-bordered w-full max-w-xs"
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
