import { useEffect, useState } from "react";
import {
  genderType,
  TeachersDataFromFirebase,
  TeacherData as teacherInterface,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { generateEmail,generatePassword } from "../../utils/utils"; 
import {  useDispatch, useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { useAddDocument } from "../../hooks/useAddDocument";
import { addNewTeacher, } from "../../redux/userSlice";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";

export const Teacher = () => {
  const { updateCounter } = useUpdateInfoCounter()
  const { addDocument } = useAddDocument()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [teacher, setTeacher] = useState<teacherInterface>({
    firstName: "",
    lastName: "",
    gender: "Mężczyzna",
    subject: "Matematyka",
    email: "",
    password:"",
  });
  const [canBeGenerated, setCanBeGenerated] = useState<boolean>(false);
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const subjects = [
    "Matematyka",
    "Angielski",
    "Język Polski",
    "WF",
    "Historia",
  ];

  useEffect(() => {
    if(teacher.firstName.length>=3&&teacher.lastName.length>=3){
      setCanBeGenerated(true);
    }
  }, [teacher.firstName,teacher.lastName]);


  const generateEmailAndPassword  = (e: React.SyntheticEvent) =>{
    e.preventDefault();
    const newPassword =generatePassword();
    const newEmail = generateEmail(teacher.firstName,teacher.lastName,user.schoolData?.information.domain as string);
    setTeacher((prev) => {
      return { ...prev,email:newEmail,password:newPassword};
    });
  }

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
    if (teacher.firstName.length === 0 && teacher.lastName.length === 0) {
      return toast.error("Podaj wszystkie dane", { autoClose: 2000 });
    }

    if (teacher.firstName.length === 0) {
      return toast.error("Podaj Imię", { autoClose: 2000 });
    }
    if (teacher.lastName.length === 0) {
      return toast.error("Podaj Nazwisko", { autoClose: 2000 });
    }
    //TODO DODAĆ SPRAWDZANIE CZY TAKI EMAIL ISTNIEJE JUŻ
    // const newObj:single
    if(user.schoolData){
      const objForRTK:TeachersDataFromFirebase = {
        ...user.schoolData.teachers,
        [teacher.email]: { ...teacher, classTeacher: "" },
      }
      const objForFirebase:TeachersDataFromFirebase = {
        [teacher.email]: { ...teacher, classTeacher: "" }
      }
      addDocument(user.schoolData?.information.domain as string,'teachers',objForFirebase);
      updateCounter(user.schoolData.information.domain, 'teachersCount')
      dispatch(addNewTeacher(objForRTK))
    }
    
    return toast.success("Udało ci się dodać nauczyciela 😀", { autoClose: 2000 });
  };
  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Imię</span>
          </label>
          <input
            className="input"
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
            className="input"
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
          <span className="label-text font-bold"> Hasło</span>
        <input
          className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
          type="text"
          name="Password"
          disabled={true}
          defaultValue={teacher.password}
        />
          </label>
          <button className={`btn ${canBeGenerated ? 'btn-secondary' : 'btn-disabled'} mt-2`} onClick={generateEmailAndPassword}>Generuj</button>
      </label>
      </fieldset>
      <div className="flex items-center justify-end w-full">
        <button
          className={`btn ${teacher.password===""&&teacher.email==="" ? 'btn-disabled':'btn-primary'} mt-4 self-end`}
          onClick={(e) => handleSubmit(e)}
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};

