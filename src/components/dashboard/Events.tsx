import { useState, useEffect } from "react";

export const Events: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toLocaleDateString("pl"));

  return (
    <div>
      <h2>Zadania na: {date}</h2>
    </div>
  );
};
