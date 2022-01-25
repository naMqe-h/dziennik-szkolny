import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SingleClassData } from "../../../utils/interfaces";

export const ViewClases: React.FC = () => {
  const state = useSelector((state: RootState) => state.user);
  const [classesData, setClassesData] = useState<SingleClassData[]>([]);
  useEffect(() => {
    if (state.schoolData?.classes) {
      const ClassesArray = Object.values(state.schoolData.classes);
      setClassesData(ClassesArray);
    }
  }, [state.schoolData?.classes]);
  console.log(classesData);
  return (
    <div className="bg-base-300 p-8 overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead></thead>
      </table>
    </div>
  );
};
