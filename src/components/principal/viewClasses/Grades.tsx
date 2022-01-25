export const Grades = () => {
    return (
        <div className="overflow-x-auto">
            <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                    1. Pawlik Mirosław
                </div> 
                <div className="collapse-content"> 
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Nazwa przedmiotu</th> 
                                <th>Nauczyciel</th> 
                                <th>Oceny</th> 
                                <th>Średnia ocen</th>
                            </tr>
                        </thead> 
                        <tbody>
                            <tr>
                                <th>Matematyka</th> 
                                <td>Ktos test</td> 
                                <td>5 4 5 6 3</td>
                                <td className="text-success">4.90</td>
                            </tr>
                            <tr>
                                <th>Matematyka</th> 
                                <td>Ktos test</td> 
                                <td>5 4 5 6 3</td>
                                <td className="text-success">4.90</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}