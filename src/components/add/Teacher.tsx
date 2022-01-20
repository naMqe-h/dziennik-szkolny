import { useEffect, useState } from "react";
import {
  genderType,
  TeacherData as teacherInterface,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { useGeneratePassword } from "../../hooks/useGeneratePassword";

export const Teacher = () => {
  const { password, generatePassword } = useGeneratePassword();
  const [teacher, setTeacher] = useState<teacherInterface>({
    firstName: "",
    lastName: "",
    gender: "Mężczyzna",
    subject: "Matematyka",
    email: "",
    password: password,
  });
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const subjects = [
    "Matematyka",
    "Angielski",
    "Język Polski",
    "WF",
    "Historia",
  ];
  useEffect(() => {
    if (password.length === 0) {
      generatePassword();
    } else {
      setTeacher((prev) => {
        return { ...prev, password };
      });
    }
    // eslint-disable-next-line
  }, [password]);
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
            name="firstName"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className="input w-full"
          type="text"
          name="email"
          onChange={(e) => handleChange(e)}
          placeholder="Email"
        />
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
      <div className="form-control">
        <label className="label flex justify-center">
          <span className="label-text font-bold">Unique Teacher Password</span>
        </label>
        <input
          className="input-info input input-disabled  !bg-secondary justify-center items-center w-full"
          type="text"
          name="Password"
          disabled={true}
          defaultValue={teacher.password}
        />
      </div>
      <div className="flex items-center justify-end w-full">
        <button
          className="btn btn-primary mt-4 self-end"
          onClick={(e) => handleSubmit(e)}
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};
