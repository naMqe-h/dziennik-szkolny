import { useState } from "react";
import { Teacher as teacherInterface } from "../../utils/interfaces";
import { toast } from "react-toastify";

export const Teacher = () => {
  const [teacher, setTeacher] = useState<teacherInterface>({
    firstName: "",
    lastName: "",
    gender: "Mężczyzna",
    subject: "Matematyka",
    email: "",
    password: "",
  });

  const genders = ["Kobieta", "Mężczyzna", "Inna"];
  const subjects = [
    "Matematyka",
    "Angielski",
    "Język Polski",
    "WF",
    "Historia",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setTeacher((prevState) => {
      return {
        ...prevState,
        [id]: value,
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
    console.log(teacher);
  };

  return (
    <form className="form-control w-96 mt-12 p-10 card bg-base-200">
      <label className="label">
        <span className="label-text">Imię</span>
      </label>
      <input
        className="input"
        type="text"
        placeholder="Imię"
        id="firstName"
        onChange={(e) => handleChange(e)}
      />

      <label className="label">
        <span className="label-text">Naziwsko</span>
      </label>
      <input
        className="input"
        type="text"
        placeholder="Naziwsko"
        id="lastName"
        onChange={(e) => handleChange(e)}
      />

      <label className="label">
        <span className="label-text">Płeć</span>
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        id="gender"
        onChange={(e) => handleChange(e)}
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
        id="gender"
        onChange={(e) => handleChange(e)}
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

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
