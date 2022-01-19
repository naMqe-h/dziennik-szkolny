import { useState, useEffect } from "react";
import { ImArrowLeft, ImArrowRight, ImCross } from "react-icons/im";
import Moment from "react-moment";
import moment from "moment";
import { Event } from "../../../utils/interfaces";
import { AnimatePresence, motion } from "framer-motion";

export const Events: React.FC = () => {
  const eventsInitial: Event[] = [
    { id: 1, name: "Ustalić plan", date: "19.01.2022", done: false },
    { id: 2, name: "Spotkanie", date: "19.01.2022", done: false },
    { id: 3, name: "Zadzwonic do urzędu", date: "19.01.2022", done: false },
    { id: 4, name: "Zamówić komputery", date: "19.01.2022", done: true },
    { id: 5, name: "Zrobic cos", date: "18.01.2022", done: false },
    { id: 6, name: "Zjesc sniadanie", date: "18.01.2022", done: false },
    {
      id: 7,
      name: "Zadzwonic do nauczycielki",
      date: "18.01.2022",
      done: false,
    },
    { id: 8, name: "Zamówić książki", date: "18.01.2022", done: true },
  ];

  // useEffect(() => {
  //   setEvents([]);
  // }, []);
  const [date, setDate] = useState<moment.Moment>(moment());
  const [events, setEvents] = useState<Event[]>(eventsInitial);

  const handleDateChange = (step: number) => {
    //Poprawiłem tutaj date - Mateusz
    setDate(moment(date).add(step, "days"));
  };

  const onDelete = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="w-full max-w-screen-lg">
      <div className="flex justify-between mb-6">
        <div
          className="cursor-pointer hover:text-primary ease-in duration-200"
          onClick={() => handleDateChange(-1)}
        >
          <ImArrowLeft size={40} />
        </div>
        <div className="text-xl">
          <span>Zadania na: </span>
          <Moment format="DD.MM.YYYY" date={date} />
        </div>
        <div
          className="cursor-pointer hover:text-primary ease-in duration-200"
          onClick={() => handleDateChange(1)}
        >
          <ImArrowRight size={40} />
        </div>
      </div>

      <div>
        <AnimatePresence>
          {events
            .filter((event) => event.date === date.format("DD.MM.YYYY"))
            .map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ duration: ev.id * 0.2 }}
              >
                <div className="p-1 m-1 card flex-row items-center justify-between">
                  <span className="text-lg">{ev.name}</span>
                  <div
                    className="cursor-pointer hover:text-error ease-in duration-200"
                    onClick={() => onDelete(ev.id)}
                  >
                    <ImCross size={20} />
                  </div>
                </div>
                <div className="divider" />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
