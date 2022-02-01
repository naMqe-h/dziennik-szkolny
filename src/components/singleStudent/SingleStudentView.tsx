import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { SingleStudentDataFromFirebase } from "../../utils/interfaces";

export const SingleStudentView = () => {
  const { email } = useParams();
  const state = useSelector((state: RootState) => state.principal);
  const [student, setStudent] = useState<
    SingleStudentDataFromFirebase | undefined
  >(undefined);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const domain = state.schoolData?.information.domain;
    const queryEmail = `${email}@${domain}`;

    //!State Ucznia
    setStudent(state.schoolData?.students[queryEmail]);
  }, [email, state.schoolData?.information.domain, state.schoolData?.students]);

  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-5 max-w-screen-2xl w-full rounded-box md:border bg-base-200">
          <div className="col-span-2 flex flex-col justify-center items-center">
            {/* With placeholder */}
            <div className="avatar placeholder flex flex-col justify-center items-center">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-32 h-32 mb-8">
                <span className="text-3xl">
                  {student?.firstName[0]}
                  {student?.lastName[0]}
                </span>
              </div>

              <div className="text-xl flex flex-col justify-center items-center">
                <span>
                  {student?.firstName} {student?.lastName}
                </span>
                <Link to={`/class/${student?.class}/info`} className="mt-2">
                  <span className="text-accent">{student?.class}</span>{" "}
                </Link>
              </div>
            </div>
            {/* without placeholder */}
            {/* <div className="avatar flex flex-col justify-center items-center">
                <div className="mb-8 rounded-full w-32 h-32">
                  <img src="https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="Avatar Tailwind CSS Component"
                  />
                </div>
                <div className="text-lg">
                  {student?.firstName} {student?.lastName}
                </div>
              </div> */}
          </div>

          <div className="col-span-3 bg-base-300 md:rounded-tr-2xl rounded-br-2xl rounded-bl-2xl md:rounded-bl-none min-h-[600px]">
            {edit ? (<form className="form-control p-10 m-5">
              <span className="card-title">Edycja Ucznia</span>
              <div className="divider" />
              <div className="form-control grid grid-cols-1 md:grid-cols-2">
                <label className="label w-full">
                  <span className="label-text w-full">Imię</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  // value={formData.firstName}
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="input max-w-96"
                  // disabled={userType !== "principals" ? true : false}
                  placeholder="Imię"
                />

                <div className="divider md:col-span-2" />

                <label className="label w-full">
                  <span className="label-text w-full">Nazwisko</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  // value={formData.lastName}
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="input max-w-96"
                  // disabled={userType !== "principals" ? true : false}
                  placeholder="Nazwisko"
                />

                <div className="divider md:col-span-2" />

                <label className="label">
                  <span className="label-text">Płeć</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  name="gender"
                  // value={formData.gender}
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                >
                  {/* {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))} */}
                </select>

                <div className="divider md:col-span-2" />

                <label className="label">
                  <span className="label-text">Pesel</span>
                </label>
                <input
                  type="number"
                  name="pesel"
                  // value={formData.pesel}
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="input "
                  placeholder="Pesel"
                />

                <div className="divider md:col-span-2" />

                <label className="label">
                  <span className="label-text">Data Urodzenia</span>
                </label>
                <input
                  type="date"
                  name="birth"
                  // value={formData.birth}
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="input"
                  placeholder={new Date().toLocaleDateString()}
                />

                <div className="md:col-span-2 flex items-center justify-center mt-10">
                <button
                    className="btn-error btn mt-4 mx-2 self-end text-white"
                    onClick={() => setEdit(!edit)}
                  >
                    Anuluj
                  </button>
                  <button
                    className="btn-primary btn mt-4 mx-2 self-end text-white"
                    // onClick={(e) => handleSubmit(e)}
                  >
                    Zapisz
                  </button>
                </div>
              </div>
            </form> ):(
              <div>
                <button className="btn btn-info" onClick={() => setEdit(!edit)}>
                  Edytuj
                </button>
              </div>
            ) }
            

          </div>
        </div>
      </div>
    </div>
  );
};
