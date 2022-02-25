import { useEffect, useState } from "react";
import {
  genderType,
  TeachersDataFromFirebase,
  TeacherData as teacherInterface,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { generateEmail, generatePassword } from "../../utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
import { useValidateInputs } from "../../hooks/useValidateInputs";

export const Teacher = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { updateCounter } = useUpdateInfoCounter();
  const { setDocument } = useSetDocument();
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teacher, setTeacher] = useState<teacherInterface>({
    firstName: "",
    lastName: "",
    gender: "Mężczyzna",
    subject: subjects[0],
    email: "",
    password: "",
  });
  function clearForm() {
    setTeacher({
      firstName: "",
      lastName: "",
      gender: "Mężczyzna",
      subject: subjects[0],
      email: "",
      password: "",
    });
  }

  const [canBeGenerated, setCanBeGenerated] = useState<boolean>(false);
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const { validateData, inputErrors, errors } = useValidateInputs();
  const [validated, setValidated] = useState<Boolean>(false);

  useEffect(() => {
    if (teacher.firstName.length >= 3 && teacher.lastName.length >= 3) {
      setCanBeGenerated(true);
    } else {
      setCanBeGenerated(false);
    }
  }, [teacher.firstName, teacher.lastName]);

  useEffect(() => {
    if (schoolData?.subjects) {
      const temp: string[] = Object.values(schoolData.subjects).map(
        (x) => x.name
      );
      setSubjects(temp);
      setTeacher((prev) => {
        return { ...prev, subject: temp[0] };
      });
    }
  }, [schoolData?.subjects]);

  useEffect(() => {
    if (validated) {
      if (isAdding || errors) return;

      //TODO DODAĆ SPRAWDZANIE CZY TAKI EMAIL ISTNIEJE JUŻ
      // const newObj:single
      if (schoolData) {
        setIsAdding(true);
        const objWrapper: TeachersDataFromFirebase = {
          [teacher.email]: {
            ...teacher,
            classTeacher: "",
            teachedClasses: [],
            workingHours: [],
            profilePicture: "",
            isActive: true,
            messages:{sended:[],recived:[]},
          },
        };
        setDocument(
          schoolData?.information.domain as string,
          "teachers",
          objWrapper
        );
        updateCounter(
          schoolData.information.domain,
          "teachersCount",
          "increment"
        );
        //Dodaje tutaj nauczyciela do przedmiotu
        const domain = schoolData.information.domain;
        const { subject, email } = teacher;
        const previousTeachers =
          schoolData.subjects[teacher.subject.replaceAll(/\s/g, "")].teachers;
        setDocument(domain as string, "subjects", {
          [subject.replaceAll(/\s/g, "")]: {
            teachers: [...previousTeachers, email],
          },
        });
        toast.success("Udało ci się dodać nowego nauczyciela", {
          autoClose: 2000,
        });
      }
      clearForm();
      setIsAdding(false);
    }
    //eslint-disable-next-line
  }, [validated, errors]);

  const generateEmailAndPassword = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newPassword = generatePassword();
    const newEmail = generateEmail(
      teacher.firstName,
      teacher.lastName,
      schoolData?.information.domain as string
    );
    setTeacher((prev) => {
      return { ...prev, email: newEmail, password: newPassword };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTeacher((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidated(false);
    validateData(teacher);
    setValidated(true);
  };
  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Imię</span>
          </label>
          <input
            className={`input ${
              inputErrors.firstName.error ? "border-red-500" : ""
            }`}
            type="text"
            placeholder="Imię"
            name="firstName"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Naziwsko</span>
          </label>
          <input
            className={`input ${
              inputErrors.lastName.error ? "border-red-500" : ""
            }`}
            type="text"
            placeholder="Naziwsko"
            name="lastName"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <label className="label">
        <span className="label-text">Płeć</span>
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        name="gender"
        onChange={(e) => handleChange(e)}
        value={teacher.gender}
      >
        {genders.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>

      <label className="label">
        <span className="label-text">Uczony przedmiot</span>
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        name="subject"
        onChange={(e) => handleChange(e)}
        value={teacher.subject}
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <fieldset className="border border-solid border-secondary rounded-md p-4 mt-4">
        <legend className="text-center font-bold">Generuj Email i Hasło</legend>
        <label className="form-control items-center ">
          <label className="label input-group">
            <span className="label-text font-bold">Email</span>
            <input
              className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
              type="text"
              name="Password"
              disabled={true}
              defaultValue={teacher.email}
            />
          </label>
          <label className="label input-group">
            <span className="label-text font-bold">Hasło</span>
            <input
              className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
              type="text"
              name="Password"
              disabled={true}
              defaultValue={teacher.password}
            />
          </label>
          <button
            className={`btn ${
              canBeGenerated ? "btn-secondary" : "btn-disabled"
            } mt-2`}
            onClick={generateEmailAndPassword}
          >
            Generuj
          </button>
        </label>
      </fieldset>
      <div className="flex items-center justify-end w-full">
        <button
          className={`btn ${
            teacher.password === "" && teacher.email === ""
              ? "btn-disabled"
              : "btn-primary"
          } mt-4 self-end`}
          onClick={(e) => handleSubmit(e)}
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};
