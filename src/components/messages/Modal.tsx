import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useDocument } from "../../hooks/useDocument";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { RootState } from "../../redux/store";
import {
  CombinedPrincipalData,
  messagesStateModalItf,
  singleMessage,
} from "../../utils/interfaces";
import { cloneDeep } from "lodash";
import moment from "moment";
import Select, { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
interface messagesModalItf {
  modalOptions: messagesStateModalItf;
  setModalOptions: React.Dispatch<React.SetStateAction<messagesStateModalItf>>;
  decodingObj?: { [key: string]: string };
}

export const Modal: React.FC<messagesModalItf> = ({
  modalOptions,
  setModalOptions,
  decodingObj,
}) => {
  type selectOption = { value: string; label: string };
  const userType = useSelector((state: RootState) => state.userType.userType);
  const userData = useSelector((state: RootState) => {
    if (userType === "principals") {
      return state.principal.data;
    } else if (userType === "teachers") {
      return state.teacher.data;
    } else {
      return state.student.data;
    }
  });
  const principalUid = useSelector(
    (state: RootState) =>
      state.principal.user?.uid ??
      state.schoolData.schoolData?.information.principalUID
  );
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const domain = schoolData?.information?.domain;
  const initialFormData: singleMessage = {
    date: new Date().toISOString().split("T")[0],
    title: "",
    author: userData?.email ? userData.email : "",
    status: "Seen",
    content: "",
    reciver: [
      modalOptions.reciever !== "principal"
        ? modalOptions.reciever?.email
          ? modalOptions.reciever.email
          : ""
        : "principal",
    ],
  };

  const animatedComponents = makeAnimated();
  const [formData, setFormData] = useState<singleMessage>(initialFormData);
  const [isReciverDirect, setIsReciverDirect] = useState<boolean>(true);
  const [validated, setValidated] = useState(false);
  const [selectOptions, setSelectOptions] = useState<selectOption[]>([]);
  const [principalDoc, setPrincipalDoc] = useState<
    CombinedPrincipalData | undefined
  >(undefined);
  const { validateData, inputErrors, errors } = useValidateInputs();
  const { setDocument } = useSetDocument();
  const { getDocument, document } = useDocument();

  const inputErrorStyles: StylesConfig = {
    control: (styles) => ({...styles, border: '2px solid rgb(239 68 68)'}),
    
    
  }


  useEffect(() => {
    !modalOptions.reciever
      ? setIsReciverDirect(false)
      : setIsReciverDirect(true);
  }, [modalOptions.reciever]);

  useEffect(() => {
    if (!isReciverDirect && decodingObj) {
      const options = Object.entries(decodingObj).map((x) => {
        return { value: x[0], label: x[1] };
      });
      setSelectOptions(options);
    }
  }, [isReciverDirect, decodingObj]);

  useEffect(() => {
    if (principalUid) {
      getDocument("principals", principalUid);
    }
  }, [principalUid, formData]);

  useEffect(() => {
    if (document) {
      setPrincipalDoc(document as CombinedPrincipalData);
    }
  }, [document]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reciver: [
        modalOptions.reciever !== "principal"
          ? modalOptions.reciever?.email
            ? modalOptions.reciever.email
            : ""
          : "principal",
      ],
    }));
  }, [modalOptions]);

  useEffect(() => {
    if (validated) {
      if (errors) return;
      if (!userData) {
        toast.error("brak danych użytkownika", { autoClose: 2000 });
        return;
      }
      if (!domain) {
        toast.error("Brak informacji o domenie szkoły", { autoClose: 2000 });
        return;
      }
      // ustawienie wartosci sended
      const userMessages = userData.messages;
      const newTeachers = cloneDeep(schoolData.teachers);
      const newStudents = cloneDeep(schoolData.students);
      if (userType === "principals") {
        if (!principalUid || !userMessages) {
          toast.error("Brak uid użytkownika lub obiektu wiadomości", {
            autoClose: 2000,
          });
          return;
        }
        const oldPrincipalDocument = cloneDeep(principalDoc);

        const newPrincipalDocument = {
          ...oldPrincipalDocument,
          messages: {
            recived: [...userMessages.recived],
            sended: [
              ...userMessages.sended,
              { ...formData, date: String(moment(new Date()).unix()) },
            ],
          },
        };
        setDocument(userType, principalUid, newPrincipalDocument);
      } else {
        if (!userMessages || !userType) {
          toast.error(
            "Brak obiektu wiadomości lub informacji o domenie szkoły lub typu użytkownika",
            { autoClose: 2000 }
          );
          return;
        }
        if (userType === "teachers") {
          newTeachers[userData.email] = {
            ...newTeachers[userData.email],
            messages: {
              recived: [...userMessages.recived],
              sended: [
                ...userMessages.sended,
                { ...formData, date: String(moment(new Date()).unix()) },
              ],
            },
          };
        } else if (userType === "students") {
          newStudents[userData.email] = {
            ...newStudents[userData.email],
            messages: {
              recived: [...userMessages.recived],
              sended: [
                ...userMessages.sended,
                { ...formData, date: String(moment(new Date()).unix()) },
              ],
            },
          };
        }
      }
      if (isReciverDirect) {
        // ustawienie wartości recived
        if (formData.reciver[0] === "principal") {
          if (!principalDoc || !principalUid) {
            toast.error("Brak obiektu wiadomości dyrektora lub uid");
            return;
          }
          const principalMessages = principalDoc.messages;
          const dbObj = {
            messages: {
              recived: [
                ...principalMessages.recived,
                {
                  ...formData,
                  status: "Unseen",
                  date: String(moment(new Date()).unix()),
                },
              ],
              sended: [...principalMessages.sended],
            },
          };

          setDocument("principals", principalUid, dbObj);
        } else {
          if (!schoolData) {
            toast.error("Brak obiektu danych szkoły lub domeny", {
              autoClose: 2000,
            });
            return;
          }
          const teacherReciever = Object.values(schoolData?.teachers).find(
            (teacher) => teacher.email === formData.reciver[0]
          );

          const studentReciever = Object.values(schoolData?.students).find(
            (student) => student.email === formData.reciver[0]
          );

          if (teacherReciever) {
            const teacherMessages = teacherReciever?.messages;
            if (!teacherMessages) {
              toast.error("Brak obiektu wiadomości użytkownika");
              return;
            }
            const newTeachers = cloneDeep(schoolData.teachers);
            newTeachers[teacherReciever.email] = {
              ...teacherReciever,
              messages: {
                recived: [
                  ...teacherReciever.messages.recived,
                  {
                    ...formData,
                    status: "Unseen",
                    date: String(moment(new Date()).unix()),
                    reciver: [],
                  },
                ],
                sended: [...teacherReciever.messages.sended],
              },
            };
            setDocument(domain, "teachers", newTeachers);
          } else {
            const studentMessages = studentReciever?.messages;
            if (!studentMessages) {
              toast.error("Brak obiektu wiadomości użytkownika");
              return;
            }
            const newStudents = cloneDeep(schoolData.students);
            newStudents[studentReciever.email] = {
              ...studentReciever,
              messages: {
                recived: [
                  ...studentMessages.recived,
                  {
                    ...formData,
                    status: "Unseen",
                    date: String(moment(new Date()).unix()),
                    reciver: [],
                  },
                ],
                sended: [...studentMessages.sended],
              },
            };
            setDocument(domain, "students", newStudents);
          }
        }
      } else {
        const oldPrincipal: Partial<CombinedPrincipalData> = {
          ...principalDoc,
        };
        const recivers = cloneDeep(formData.reciver);
        if (recivers.some((x) => x === principalDoc?.email)) {
          const newPrincipal: Partial<CombinedPrincipalData> = {
            ...oldPrincipal,
            messages: {
              recived: [
                ...(oldPrincipal.messages?.recived as singleMessage[]),
                {
                  ...formData,
                  status: "Unseen",
                  date: String(moment(new Date()).unix()),
                  reciver: [],
                },
              ],
              sended: [...(oldPrincipal.messages?.sended as singleMessage[])],
            },
          };
          setDocument("principals", principalUid as string, newPrincipal);
        }
        const reciversWithoutPrincipal = recivers.filter(
          (x) => x !== principalDoc?.email
        );
        reciversWithoutPrincipal.forEach((item) => {
          if (newTeachers[item]) {
            const oldTeacherData = newTeachers[item];
            newTeachers[item] = {
              ...oldTeacherData,
              messages: {
                recived: [
                  ...(oldTeacherData.messages?.recived as singleMessage[]),
                  {
                    ...formData,
                    status: "Unseen",
                    date: String(moment(new Date()).unix()),
                    reciver: [],
                  },
                ],
                sended: [
                  ...(oldTeacherData.messages?.sended as singleMessage[]),
                ],
              },
            };
          } else if (newStudents[item]) {
            const oldStudentData = newStudents[item];
            newStudents[item] = {
              ...oldStudentData,
              messages: {
                recived: [
                  ...(oldStudentData.messages?.recived as singleMessage[]),
                  {
                    ...formData,
                    status: "Unseen",
                    date: String(moment(new Date()).unix()),
                    reciver: [],
                  },
                ],
                sended: [
                  ...(oldStudentData.messages?.sended as singleMessage[]),
                ],
              },
            };
          }
          setDocument(
            schoolData.information.domain as string,
            "teachers",
            newTeachers
          );
          setDocument(
            schoolData.information.domain as string,
            "students",
            newStudents
          );
        });
      }
      toast.success("Wiadomość została wysłana", { autoClose: 2000 });
      setSelectOptions([]);
      setFormData(initialFormData);
    }
    setValidated(false);
  }, [validated, errors]);

  function handleSelectChange(currentSelected: any) {
    let selectedInputs = currentSelected.map((val: selectOption) => val.value);
    setFormData((prev) => ({
      ...prev,
      reciver: selectedInputs,
    }));
  }

  const handleChange = (name: string, value: string, checked?: Boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setValidated(false);
    validateData(formData);
    setValidated(true);
  };

  return (
    <div className={`modal ${modalOptions.isOpen ? "modal-open" : ""} `}>
      <div className="modal-box flex flex-col items-center gap-2 bg-base-300">
        <AiOutlineClose
          onClick={() =>
            setModalOptions({
              isOpen: false,
              reciever: null,
            })
          }
          size={30}
          className="absolute top-2 right-2 cursor-pointer"
        />
        {isReciverDirect ? (
          <h2 className="mb-3">
            Wyślij wiadomość do{" "}
            {modalOptions.reciever !== "principal"
              ? modalOptions.reciever?.firstName +
                " " +
                modalOptions.reciever?.lastName
              : "Dyrektora"}
          </h2>
        ) : (
          <h2 className="mb-3">Nowa wiadomość</h2>
        )}
        <label htmlFor="title">Tytuł</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          className={`input w-full ${
            inputErrors.title.error ? "border-red-500" : ""
          }`}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {!isReciverDirect && (
          <div className="my-4 flex flex-col items-center gap-2 w-full">
            <h3>Odbiorcy</h3>
            <Select
              className="text-neutral-focus w-3/5"
              closeMenuOnSelect={false}
              components={animatedComponents}
              value={formData.reciver.length !== 0 && formData.reciver[0].length !== 0 ? formData.reciver.map((rec) => ({value: rec, label: rec})) : null}
              styles={inputErrors.reciver.error ? inputErrorStyles : undefined}
              isMulti
              options={selectOptions}
              onChange={handleSelectChange}
            />
          </div>
        )}
        <label htmlFor="content">Treść</label>
        <textarea
          name="content"
          value={formData.content}
          className={`textarea w-full min-h-[10rem] ${
            inputErrors.content.error ? "border-red-500" : ""
          }`}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <button
          onClick={() => handleSubmit()}
          className="btn btn-primary w-44 mt-3"
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};
