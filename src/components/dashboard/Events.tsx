import { useState, useEffect } from "react";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import Moment from "react-moment";
import moment from "moment";
import { scheduleItemsArray } from "../../utils/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Events: React.FC = () => {
  
  // selectors
  const userType = useSelector((state: RootState) => state.userType.userType);
  const userData: any = useSelector((state: RootState) => {
    if(userType === 'principals'){
      return state.principal.data
    } else if(userType === 'teachers'){
      return state.teacher.data
    } else {
      return state.student.data
    }
  })
  const classes = useSelector((state: RootState) => state.schoolData.schoolData?.classes)

  // states
  const [events, setEvents] = useState<scheduleItemsArray>([]);
  const [date, setDate] = useState<moment.Moment>(moment());
  const [todayEvents, setTodayEvents] = useState<scheduleItemsArray | undefined>(undefined);


  useEffect(() => {
    if(classes){
      if(userType === 'principals'){
        return
      } else if(userType === 'teachers'){
        // const teachedClasses = userData?.teachedClasses;
        // const teachedClassesScheduleArray = [];
  
        // for(let val of teachedClasses){
        //   teachedClassesScheduleArray.push(...Object.values(classes).filter((classObj) => classObj.name === val)[0].schedule.filter((item) => item.teacher === userData.email));
        //   }
        // setEvents(teachedClassesScheduleArray);
      } else {
        setEvents(Object.values(classes).filter((classObj) => classObj.name ===  userData.class)[0].schedule);
      }
    }
  }, [])
  

  useEffect(() => {
    setTodayEvents(events.filter((ev) => {
      let dateFrom = moment(Number(ev.dateFrom.replaceAll(/\s/g, "")))
      let dateTo = moment(Number(ev.dateTo.replaceAll(/\s/g, "")))

      if(date.isBetween(dateFrom, dateTo) || date.isSame(dateFrom, "day") || date.isSame(dateTo, "day")){
        return ev;
      }
    }));
    
  }, [date, events]);

  useEffect(() => {
    console.log(todayEvents);
  }, [todayEvents])
  

  

  const handleDateChange = (step: number) => {
    setDate(moment(date).add(step, "days"));
  };

  const eventAnimate = {
    hidden: {
      opacity: 0,
      x: -200,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
    },
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
        <div className="text-xl text-center">
          <span>Terminarz </span>
          <Moment format="DD.MM.YYYY" date={date} />
        </div>
        <div
          className="cursor-pointer hover:text-primary ease-in duration-200"
          onClick={() => handleDateChange(1)}
        >
          <ImArrowRight size={40} />
        </div>
      </div>
      <AnimatePresence>
        <motion.div>
          {todayEvents?.length ? (
            todayEvents.map((ev, id) => (
              <motion.div
                key={ev.name + id}
                variants={eventAnimate}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: id * 0.25 }}
              >
                <div className="p-1 m-1 card text-center">
                  <span className="text-lg">{ev.name}</span>
                </div>
                <div className="divider" />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="card p-1 m-1 text-center"
              variants={eventAnimate}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ transition: 0.25 }}
            >
              <span className="text-lg">Brak zadań</span>
              <div className="divider" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
