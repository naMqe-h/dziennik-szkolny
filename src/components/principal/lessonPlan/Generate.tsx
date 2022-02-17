import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SingleDay } from "../../lessonPlan/SingleDay";
import {
  SingleClassData,
  SubjectData,
  singleClassLessonPlan,
} from "../../../utils/interfaces";
import { useGeneratePlan } from "../../../hooks/useGeneratePlan";
import { toast } from "react-toastify";

interface SubjectDataWithShortName extends SubjectData {
  shortName: string;
}

interface SubejctsInputsValues {
  [key: string]: any;
}

export const Generate = () => {
  const { generatePlan, savePlan, deletePlan } = useGeneratePlan();

  const [isPlanNew, setIsPlanNew] = useState<boolean>(false);

  // pojedyńcza wybrana klasa
  const [selectClassValue, setSelectClassValue] = useState<string>("");
  const [singleClassInfo, setSingleClassInfo] = useState<SingleClassData>();
  const [singleClassSubjects, setSingleClassSubjects] = useState<
    SubjectDataWithShortName[]
  >([]);
  const [singleClassLessonPlan, setSingleClassLessonPlan] =
    useState<singleClassLessonPlan>();

  //tablica z nazwami przedmiotów z wybranej klasy
  const [subjectNames, setSubjectNames] = useState<string[]>([]);

  //tablica z informacjami o wszystkich klasach
  const [allClassesArray, setAllClassesArray] = useState<SingleClassData[]>();

  // wartośći inputów od przedmiotów
  const [subejctsInputsValues, setSubejctsInputsValues] =
    useState<SubejctsInputsValues>({});
  const [sumSubjectsInputsValues, setSumSubjectsInputsValues] =
    useState<number>(0);

  // redux
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  useEffect(() => {
    let tempArray = [];
    if (schoolData?.classes) {
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(schoolData?.classes)) {
        tempArray.push(value);
      }
      setSelectClassValue(tempArray[0]?.name);
      // setSelectClassValue('1b');
      setAllClassesArray(tempArray);
    }
  }, [schoolData]);

  useEffect(() => {
    let tempArray: string[] = [];
    //tu zrobic pobieranie planu danej klasy
    if (schoolData?.lessonPlans) {
      setSingleClassLessonPlan(undefined);
      for (const [key, value] of Object.entries(schoolData.lessonPlans)) {
        if (key === selectClassValue) {
          setSingleClassLessonPlan(value);
          //ustawiasz ze plan juz ustniał - state
        }
      }
    }

    //tu zapisujemy informacje o wybranej w selectie klasie
    if (schoolData?.classes) {
      for (const [key, value] of Object.entries(schoolData?.classes)) {
        if (key === selectClassValue) {
          //zbieranie nazw przedmiotów danej klasy
          value.subjects.forEach((item) => {
            tempArray.push(item.name);
          });
          setSingleClassInfo(value);
          setSubjectNames(tempArray);
        }
      }
    }
  }, [selectClassValue, schoolData?.classes, schoolData?.lessonPlans]);

  useEffect(() => {
    let tempArray = [];
    // przypisujemy informacje o przedmiotach dla danej klasy
    if (schoolData?.subjects) {
      for (const [key, value] of Object.entries(schoolData.subjects)) {
        if (subjectNames.includes(key)) {
          tempArray.push({ ...value, shortName: key });
        }
      }
      setSingleClassSubjects(tempArray);
    }
  }, [singleClassInfo, subjectNames, schoolData?.subjects]);

  useEffect(() => {
    let tempState = {};
    if (singleClassSubjects.length > 0) {
      singleClassSubjects.forEach((item) => {
        tempState = {
          ...tempState,
          GodzinaWychowawcza: 1,
          [item.shortName]: 0,
        };
      });
      setSubejctsInputsValues(tempState);
    }
  }, [singleClassSubjects]);

  useEffect(() => {
    if (Object.values(subejctsInputsValues).length > 0) {
      let tempHours: number = Object.values(subejctsInputsValues).reduce(
        (a, b) => a + b
      );
      setSumSubjectsInputsValues(tempHours);
    }
  }, [subejctsInputsValues]);

  const handleGenerate = () => {
    setIsPlanNew(true);
    if (sumSubjectsInputsValues > 40) {
      toast.error("Maksymalna ilość godzin lekcyjnych w tygodniu wynosi 40", {
        autoClose: 3000,
      });
    } else {
      const plan = generatePlan(subejctsInputsValues, singleClassInfo);
      setSingleClassLessonPlan(plan);
    }
  };

  const handleDelete = () => {
    setIsPlanNew(false);
    setSingleClassLessonPlan(undefined);
    if (singleClassInfo) {
      deletePlan(singleClassInfo?.name, singleClassInfo);
    }
  };

  const handleSave = () => {
    setIsPlanNew(false);
    savePlan(selectClassValue, singleClassInfo as SingleClassData);
  };

  const handleAddSubjectValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: SubjectDataWithShortName
  ) => {
    setSubejctsInputsValues((prev) => ({
      ...prev,
      [item.shortName]: +e.target.value,
    }));
  };
  return (
    <div className="mx-auto flex gap-2 pt-12 mr-8 ">
      <div className="flex-none w-72 p-4">
        <h1 className="text-xl font-bold text-center text-primary">
          Wybierz klasę:
        </h1>
        <select
          value={selectClassValue}
          onChange={(e) => setSelectClassValue(e.currentTarget.value)}
          className="select select-bordered w-full max-w-xs mt-4"
        >
          {allClassesArray?.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="divider"></div>

        <div className="max-h-[450px] overflow-auto px-5 lesson lessonPlanScrollbar">
          <h1 className="text-xl font-bold text-center text-primary">
            Liczba godzin:{" "}
            <span
              className={`${sumSubjectsInputsValues >= 40 && "text-error"}`}
            >
              {sumSubjectsInputsValues}/40
            </span>
          </h1>
          {singleClassSubjects.map((item) => (
            <div key={item.name} className="form-control">
              <label className="label">
                <span className="label-text">{item.name}</span>
              </label>
              <input
                min={0}
                max={40}
                value={subejctsInputsValues?.[item.shortName] || 0}
                onChange={(e) => handleAddSubjectValue(e, item)}
                type="number"
                placeholder="3"
                className="input input-bordered"
              />
            </div>
          ))}
        </div>
        {!singleClassLessonPlan ? (
          <button
            className="btn btn-outline btn-primary w-full mt-4"
            onClick={handleGenerate}
          >
            Generuj plan
          </button>
        ) : (
          <button
            className="btn btn-outline btn-error w-full mt-4"
            onClick={handleDelete}
          >
            Usuń plan
          </button>
        )}
        {isPlanNew && (
          <button
            className="btn btn-success btn-outline w-full mt-4"
            onClick={handleSave}
          >
            Zatwierdź
          </button>
        )}
      </div>
      <div className="flex-1 w-full overflow-x-auto lessonPlanScrollbar self-baseline">
        <table className="table w-full border-2 border-base-200">
          <thead>
            <tr className="text-primary-focus text-center">
              <th></th>
              <th className="text-lg">
                8<sup>00</sup>-8<sup>45</sup>
              </th>
              <th className="text-lg">
                8<sup>50</sup>-9<sup>35</sup>
              </th>
              <th className="text-lg">
                9<sup>45</sup>-10<sup>30</sup>
              </th>
              <th className="text-lg">
                10<sup>40</sup>-11<sup>25</sup>
              </th>
              <th className="text-lg">
                11<sup>40</sup>-12<sup>25</sup>
              </th>
              <th className="text-lg">
                12<sup>35</sup>-13<sup>20</sup>
              </th>
              <th className="text-lg">
                13<sup>30</sup>-14<sup>15</sup>
              </th>
              <th className="text-lg">
                14<sup>20</sup>-15<sup>05</sup>
              </th>
              <th className="text-lg">
                15<sup>10</sup>-15<sup>55</sup>
              </th>
              <th className="text-lg">
                16<sup>00</sup>-16<sup>45</sup>
              </th>
              <th className="text-lg">
                16<sup>50</sup>-17<sup>35</sup>
              </th>
            </tr>
          </thead>
          <tbody>
            <SingleDay
              dayOfWeek="Poniedziałek"
              lessons={singleClassLessonPlan?.monday}
            />
            <SingleDay
              dayOfWeek="Wtorek"
              lessons={singleClassLessonPlan?.tuesday}
            />
            <SingleDay
              dayOfWeek="Środa"
              lessons={singleClassLessonPlan?.wednesday}
            />
            <SingleDay
              dayOfWeek="Czwartek"
              lessons={singleClassLessonPlan?.thursday}
            />
            <SingleDay
              dayOfWeek="Piątek"
              lessons={singleClassLessonPlan?.friday}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};
