import { useState, useEffect } from "react";
import {
  genderType,
  StudentData,
  StudentsDataFromFirebase,
} from "../../utils/interfaces";
import {
  validatePesel,
  generatePassword,
  generateEmail,
} from "../../utils/utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
import { useValidateInputs } from "../../hooks/useValidateInputs";


const defaultState: StudentData = {
  firstName: "",
  lastName: "",
  gender: "Mężczyzna",
  password: "",
  pesel: "",
  birth: "",
  class: "",
  email: "",
};


export const Student = () => {
  const { updateCounter } = useUpdateInfoCounter();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [canBeGenerated, setCanBeGenerated] = useState<boolean>(false);
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const classes = schoolData?.classes !== undefined ? schoolData.classes : {};
  const domain = schoolData?.information?.domain;
  const classNames: string[] = Object.keys(classes);
  const { setDocument } = useSetDocument();
  const [student, setStudent] = useState<StudentData>(defaultState);
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const [validated, setValidated] = useState<Boolean>(false);


  const { validateData, inputErrors, errors } = useValidateInputs();



  useEffect(() => {
    if (student.firstName.length >= 3 && student.lastName.length >= 3) {
      setCanBeGenerated(true);
    } else{
      setCanBeGenerated(false);
    }
  }, [student.firstName, student.lastName]);

    useEffect(() => {
      if(validated){
        console.log('validated')
        if (isAdding || errors ) return;
      
        setIsAdding(true);
        const objWrapper: StudentsDataFromFirebase = {
          [student.email]: { ...student, grades: {}, profilePicture: '' },
        };
        if (schoolData) {
          const previousStudents = schoolData.classes[student.class].students;
          setDocument(domain as string, "students", objWrapper);
          setDocument(domain as string, "classes", {
            [student.class]: {
              students: [...previousStudents, student.email],
            },
          });
          updateCounter(domain as string, "studentsCount", 'increment');
          clearForm();
          setIsAdding(false);
          toast.success("Udało ci się dodać ucznia 😀", { autoClose: 2000 });
        }
      }
    }, [validated, errors]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudent((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };


  function clearForm() {
    setStudent(defaultState);
  }

 

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    setValidated(false);
    validateData(student);
    setValidated(true);


    
  };

  const generateEmailAndPassword = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newPassword = generatePassword();
    const newEmail = generateEmail(
      student.firstName,
      student.lastName,
      domain as string
    );
    setStudent((prev) => {
      return { ...prev, email: newEmail, password: newPassword };
    });
  };

  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Imię</span>
          </label>
          <input
            className={`input ${inputErrors.firstName.error ? "border-red-500" : ''}`}
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
            className={`input ${inputErrors.lastName.error ? "border-red-500" : ''}`}
            type="text"
            placeholder="Naziwsko"
            name="lastName"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <div className="form-control items-center">
        <label className="label">
          <span className="label-text">Data Urodzenia</span>
        </label>
        <input
          type="date"
          name="birth"
          value={student.birth}
          max={new Date().toISOString().split("T")[0]}
          className={`input ${inputErrors.birth.error ? "border-red-500" : ''}`}
          onChange={(e) => handleChange(e)}
          placeholder={new Date().toLocaleDateString()}
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Pesel</span>
        </label>
        <input
          className={`input w-full ${inputErrors.pesel.error ? "border-red-500" : ''}`}
          type="text"
          name="pesel"
          onChange={(e) => handleChange(e)}
          placeholder="Pesel"
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Płeć</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          name="gender"
          onChange={(e) => handleChange(e)}
          value={student.gender}
        >
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Klasa</span>
        </label>
        <select
          className={`select select-bordered w-full max-w-xs ${inputErrors.class.error ? "border-red-500" : ''}`}
          name="class"
          onChange={(e) => handleChange(e)}
          value={student.class}
        >
          <option></option>
          {classNames &&
            classNames.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
      </div>
      <fieldset className={`border border-solid border-secondary rounded-md p-4 mt-4 ${inputErrors.email.error || inputErrors.password ? "border-red-500" : ''}`}>
        <legend className="text-center font-bold">Generuj Email i Hasło</legend>
        <label className="form-control items-center ">
          <label className="label input-group">
            <span className="label-text font-bold">Email</span>
            <input
              className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
              type="text"
              name="Password"
              disabled={true}
              defaultValue={student.email}
            />
          </label>
          <label className="label input-group">
            <span className="label-text font-bold">Hasło</span>
            <input
              className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
              type="text"
              name="Password"
              disabled={true}
              defaultValue={student.password}
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
            student.email !== "" && student.password !== ""
              ? "btn-primary"
              : "btn-disabled"
          } mt-4 self-end`}
          onClick={(e) => handleSubmit(e)}
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};
