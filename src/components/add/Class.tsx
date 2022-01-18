import { useState } from "react";

type teacherExample = {
  id: string;
  text: string;
};

type classCredentials = {
  name: string;
  classTeacher: string;
};

const teachers: teacherExample[] = [
  { id: "nauczyciel-1", text: "Nauczyciel 1" },
  { id: "nauczyciel-2", text: "Nauczyciel 2" },
  { id: "nauczyciel-3", text: "Nauczyciel 3" },
  { id: "nauczyciel-4", text: "Nauczyciel 4" },
];

export const Class = () => {
  const [classCredential, setClassCredential] = useState<classCredentials>({
    name: "",
    classTeacher: "",
  });

  const handleChange = (id: string, value: string) => {
    setClassCredential((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(classCredential);
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
        id="name"
        onChange={(e) => handleChange(e.target.id, e.target.value)}
      />

      <label className="label">
        <span className="label-text">Wychowawca</span>
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        id="classTeacher"
        onChange={(e) => handleChange(e.target.id, e.target.value)}
      >
        <option></option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.text}>
            {teacher.text}
          </option>
        ))}
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
