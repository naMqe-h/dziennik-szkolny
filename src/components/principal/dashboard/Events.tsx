import { useState, useEffect } from "react";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import Moment from "react-moment";
import moment from "moment";
import { Event } from "../../../utils/interfaces";

export const Events: React.FC = () => {
  const eventsInitial: Event[] = [
    { id: 1, name: "Ustalić plan", date: "18.01.2022", done: false },
    { id: 2, name: "Spotkanie", date: "18.01.2022", done: false },
    { id: 3, name: "Zadzwonic do urzędu", date: "18.01.2022", done: false },
    { id: 4, name: "Zamówić komputery", date: "18.01.2022", done: true },
  ];

  useEffect(() => {
    setEvents([]);
  }, []);
  const [date, setDate] = useState<moment.Moment>(moment());
  const [events, setEvents] = useState<Event[]>(eventsInitial);

  const handleDateChange = (step: number) => {
    //Poprawiłem tutaj date - Mateusz
    setDate(moment(date).add(step, "days"));
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: Event
  ) => {};

  return (
    <div className="w-full max-w-screen-lg">
      <div className="flex justify-between mb-6">
        <div
          className="cursor-pointer hover:text-[#F28C18] ease-in duration-200"
          onClick={() => handleDateChange(-1)}
        >
          <ImArrowLeft size={40} />
        </div>
        <div className="text-xl">
          <span>Zadania na: </span>
          <Moment format="DD.MM.YYYY" date={date} />
        </div>
        <div
          className="cursor-pointer hover:text-[#F28C18] ease-in duration-200"
          onClick={() => handleDateChange(1)}
        >
          <ImArrowRight size={40} />
        </div>
      </div>

      <div>
        {events
          .filter((event) => event.date === date.format("DD.MM.YYYY"))
          .map((ev) => (
            <div key={ev.id}>
              <div className="p-1 m-1 card">
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text text-lg">{ev.name}</span>
                    <input
                      type="checkbox"
                      defaultChecked={ev.done}
                      className="checkbox checkbox-accent"
                      onChange={(e) => handleCheckbox(e, ev)}
                    />
                  </label>
                </div>
              </div>
              <div className="divider" />
            </div>
          ))}
      </div>
    </div>
  );
};
