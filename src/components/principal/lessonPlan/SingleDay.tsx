import { useEffect, useState } from "react";
import { singleHoursFromLessonPlan, daysOfWeek } from "../../../utils/interfaces"
import { SingleHour } from "./SingleHour"
interface SingleDayProps {
    lessons: singleHoursFromLessonPlan[] | undefined
    dayOfWeek: daysOfWeek
}

export const SingleDay: React.FC<SingleDayProps> = ({ lessons, dayOfWeek }) => {
    const [sortedLessons, setSortedLessons] = useState<singleHoursFromLessonPlan[] | undefined[]>([])

    useEffect(() => {
        let tempArray: any = []
        // eslint-disable-next-line
        lessons?.map(item => {
            tempArray[item.hour - 1] = item
        })
        setSortedLessons(tempArray)
    }, [lessons])

    useEffect(() => {
        for(let i = 0; i < 8; i++) {
            if(!sortedLessons[i]) {
                sortedLessons[i] = undefined
            }
        }
    }, [sortedLessons])

    return (
        <tr>
            <th className="text-primary-focus">{dayOfWeek}</th> 
            {sortedLessons?.map((lesson,index) => (
                <SingleHour key={index} isEmpty={lesson === undefined} lesson={lesson} />
            ))}
        </tr>
    )
}