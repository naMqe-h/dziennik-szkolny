import { SingleHour } from "./SingleHour"

interface SingleDayProps {
    day: string
}

export const SingleDay: React.FC<SingleDayProps> = ({ day }) => {
    return (
        <tr>
            <th className="text-primary-focus">{day}</th> 
            <SingleHour />
            <SingleHour />
            <SingleHour />
            <SingleHour />
            <SingleHour />
            <SingleHour />
            <SingleHour />
            <SingleHour />
        </tr>
    )
}