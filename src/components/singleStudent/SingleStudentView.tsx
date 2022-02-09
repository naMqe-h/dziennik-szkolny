import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../../loader/Loader";
import { RootState } from "../../redux/store";
import {
  genderType,
  SingleClassData,
  SingleStudentDataFromFirebase,
  StudentsDataFromFirebase,
} from "../../utils/interfaces";
import { validatePesel } from "../../utils/utils";

// react icons
import { HiOutlineMail } from "react-icons/hi";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { FaBirthdayCake } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useValidateInputs } from "../../hooks/useValidateInputs";

export const SingleStudentView = () => {
  const { email } = useParams();
  const userType = useSelector((state: RootState) => state.userType.userType);
  const { setDocument } = useSetDocument();

  // ? Potem zmienić zeby dzialal tez dla nauczyciela
  const [student, setStudent] = useState<
    SingleStudentDataFromFirebase | undefined
  >(undefined);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState<SingleStudentDataFromFirebase>();
  const [validated, setValidated] = useState<Boolean>(false);


  // ? Potem zmienić zeby dzialal tez dla nauczyciela
  const userAuth = useSelector((state: RootState) => state.principal.user);
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const { validateData, inputErrors, errors } = useValidateInputs();

  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const domain = userAuth?.displayName?.split("~")[0];

  useEffect(() => {
    if(validated){
      if(errors) return;
      if (formData && student) {
        if (schoolData?.classes) {
          const oldClassDataStudents =
            schoolData?.classes[student.class].students;
          const newOldClassStudents = oldClassDataStudents?.filter(
            (x) => x !== student.email
          );
          const oldClassObject: SingleClassData = {
            ...schoolData?.classes[student.class],
            students: newOldClassStudents as string[],
          };
          const oldNewClassDataStudents = [
            ...schoolData.classes[formData.class].students,
          ];
          oldNewClassDataStudents.push(student.email);
          const newClassObject: SingleClassData = {
            ...schoolData.classes[formData.class],
            students: oldNewClassDataStudents as string[],
          };
          setDocument(domain as string, "classes", {
            [student.class]: oldClassObject,
          });
          setDocument(domain as string, "classes", {
            [formData.class]: newClassObject,
          });
        }

        let tempData: StudentsDataFromFirebase = {
          [student.email]: {
            ...(student as SingleStudentDataFromFirebase),
            ...formData,
          },
        };
        setDocument(domain as string, "students", tempData);
        setEdit(!edit);
        toast.success("Dane zapisane poprawnie.", { autoClose: 2000 });
      }
    }
    setValidated(false);
  }, [validated, errors]);

  useEffect(() => {
    const queryEmail = `${email}@${domain}`;

    //!State Ucznia
    setStudent(schoolData?.students[queryEmail]);
    // eslint-disable-next-line
  }, [email, schoolData?.students]);

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleChange = (name: string, value: string) => {
    if (student) {
      if (name === "pesel") {
        setFormData((prev: any) => {
          return { ...prev, [name]: String(value) };
        });
      } else {
        setFormData((prev: any) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      }
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!userAuth || !userType) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    }
    if (formData === student)
      return toast.error("Żadne dane się nie zmieniły", { autoClose: 2000 });
    if(formData){
      setValidated(false);
      validateData(formData);
      setValidated(true);
    }
  };

  if (!student) return <div>Nie znaleziono ucznia</div>;
  if (!formData) return <Loader />;
  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="max-w-screen-2xl w-full rounded-box md:border bg-base-200">
          <div className="flex flex-col justify-center items-center p-10">
            <div className="avatar placeholder flex flex-col justify-center items-center">
              {/* With placeholder */}
              <div className="bg-neutral-focus text-neutral-content rounded-full w-32 h-32 mb-8">
                <span className="text-3xl">
                  {student?.firstName[0]}
                  {student?.lastName[0]}
                </span>
              </div>
              {/* without placeholder */}
              {/* <div className="avatar flex flex-col justify-center items-center">
                <div className="mb-8 rounded-full w-32 h-32">
                  <img src="https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div> */}

              <div className="text-xl flex flex-col justify-center items-center">
                <span>
                  {student?.firstName + " "} {student?.lastName}
                </span>
                <Link to={`/class/${student?.class}/info`} className="mt-2">
                  <span className="text-accent">{student?.class}</span>{" "}
                </Link>
              </div>
              <div className="pt-5">
                <button className="btn btn-info m-2" onClick={() => undefined}>
                  Wiadomość
                </button>
                {userType === "principals" && (
                  <button
                    className={`btn ${
                      !edit ? "btn-warning" : "btn-error"
                    } m-2 transition duration-200`}
                    onClick={() => setEdit(!edit)}
                  >
                    {!edit ? "Edytuj" : "Anuluj"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-base-300 rounded-b-2xl">
            {!edit ? (
              <div className="p-10 flex flex-col h-full items-center justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center text-xl p-5">
                    <HiOutlineMail className="mr-2 text-primary" />
                    {student?.email}
                  </div>
                  <div className="flex items-center text-xl p-5">
                    <FaBirthdayCake className="mr-2 text-primary" />
                    {student?.birth}
                  </div>
                  <div className="flex items-center text-xl p-5">
                    {student?.gender !== "Kobieta" ? (
                      <CgGenderMale className="mr-2 text-primary" />
                    ) : (
                      <CgGenderFemale className="mr-2 text-primary" />
                    )}
                    {student?.gender}
                  </div>
                  <div className="flex items-center text-xl p-5">
                    <AiFillInfoCircle className="mr-2 text-primary" />
                    {student?.pesel}
                  </div>
                </div>
              </div>
            ) : (
              <form className="form-control p-10">
                <span className="card-title">Edycja Ucznia</span>
                <div className="divider" />
                <div className="form-control grid grid-cols-1 md:grid-cols-2">
                  <label className="label w-full">
                    <span className="label-text w-full">Imię</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className={`input max-w-96 ${inputErrors.firstName.error ? 'border-red-500' :''}`}
                    placeholder="Imię"
                  />

                  <div className="divider md:col-span-2" />

                  <label className="label w-full">
                    <span className="label-text w-full">Nazwisko</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className={`input max-w-96 ${inputErrors.lastName.error ? 'border-red-500' :''}`}
                    placeholder="Nazwisko"
                  />

                  <div className="divider md:col-span-2" />

                  <label className="label">
                    <span className="label-text">Klasa</span>
                  </label>
                  <select
                    className={`select select-bordered w-full max-w-xs ${inputErrors.class.error ? 'border-red-500' :''}`}
                    name="class"
                    value={formData.class}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  >
                    {schoolData &&
                      Object.keys(schoolData.classes).map((sClass) => (
                        <option key={sClass} value={sClass}>
                          {sClass}
                        </option>
                      ))}
                  </select>

                  <div className="divider md:col-span-2" />

                  <label className="label">
                    <span className="label-text">Płeć</span>
                  </label>
                  <select
                    className={`select select-bordered w-full max-w-xs ${inputErrors.gender.error ? 'border-red-500' :''}`}
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>

                  <div className="divider md:col-span-2" />

                  <label className="label">
                    <span className="label-text">Pesel</span>
                  </label>
                  <input
                    type="number"
                    name="pesel"
                    value={formData.pesel}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className={`input ${inputErrors.pesel.error ? 'border-red-500' :''}`}
                    placeholder="Pesel"
                  />

                  <div className="divider md:col-span-2" />

                  <label className="label">
                    <span className="label-text">Data Urodzenia</span>
                  </label>
                  <input
                    type="date"
                    name="birth"
                    value={formData.birth}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className={`input ${inputErrors.birth.error ? 'border-red-500' :''}`}
                    placeholder={new Date().toLocaleDateString()}
                  />

                  <div className="md:col-span-2 flex items-center justify-center mt-10">
                    <button
                      className="btn-primary btn mt-4 self-end"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
