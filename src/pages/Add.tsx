import { useParams } from "react-router-dom";

export const Add = () => {
  const { type } = useParams();
  console.log(type);

  return <div className="">{type}</div>;
};
