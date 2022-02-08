import { singleHoursFromLessonPlan } from '../../utils/interfaces'

interface SingleHourProps {
    isEmpty: boolean
    lesson?: singleHoursFromLessonPlan
}

export const SingleHour: React.FC<SingleHourProps> = ({ lesson, isEmpty }) => {
    return (
        <td className="border-2 border-base-200">
            <div>
                <h1 className="text-lg font-bold">
                    {isEmpty ? '' : lesson?.subject}
                </h1>
                <span className="text-sm text-gray-500">
                    {isEmpty ? '' : lesson?.teacher}
                </span>
            </div>
        </td>
    )
}