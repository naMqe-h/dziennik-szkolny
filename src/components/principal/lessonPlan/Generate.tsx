import { SingleDay } from "./SingleDay"

export const Generate = () => {
    return (
        <div className="mx-auto flex gap-4 pt-12 mr-8">
            <div className="flex-none w-64 p-4">
                <h1 className="text-xl font-bold text-center text-primary">Wybierz klasę:</h1>
                <select className="select select-bordered w-full max-w-xs mt-4">
                    <option>1a</option> 
                    <option>1b</option> 
                    <option>1c</option> 
                    <option>2a</option>
                </select>
                <div className="divider"></div>
                
                <div> {/*wszystkie przedmioty */}
                    <h1 className="text-xl font-bold text-center text-primary">Liczba godzin</h1>
                    {/* jeden przedmiot */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Matematyka</span>
                        </label> 
                        <input type="number" placeholder="3" className="input input-bordered" />
                    </div>
                    {/* ---------------------- */}
                    {/* jeden przedmiot */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Historia</span>
                        </label> 
                        <input type="number" placeholder="3" className="input input-bordered" />
                    </div>
                    {/* ---------------------- */}
                    {/* jeden przedmiot */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Chemia</span>
                        </label> 
                        <input type="number" placeholder="3" className="input input-bordered" />
                    </div>
                    {/* ---------------------- */}
                    {/* jeden przedmiot */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Biologia</span>
                        </label> 
                        <input type="number" placeholder="3" className="input input-bordered" />
                    </div>
                    {/* ---------------------- */}
                </div>
            </div>
            <div className="flex-1 w-full overflow-x-auto">
                <table className="table w-full border-2 border-base-200">
                    <thead>
                        <tr className="text-primary-focus text-center">
                            <th></th> 
                            <th className="text-lg">8<sup>00</sup>-8<sup>45</sup></th> 
                            <th className="text-lg">8<sup>50</sup>-9<sup>35</sup></th> 
                            <th className="text-lg">9<sup>45</sup>-10<sup>30</sup></th> 
                            <th className="text-lg">10<sup>40</sup>-11<sup>25</sup></th> 
                            <th className="text-lg">11<sup>40</sup>-12<sup>25</sup></th> 
                            <th className="text-lg">12<sup>35</sup>-13<sup>20</sup></th> 
                            <th className="text-lg">13<sup>30</sup>-14<sup>15</sup></th> 
                            <th className="text-lg">14<sup>20</sup>-15<sup>05</sup></th> 
                        </tr>
                    </thead> 
                    <tbody>
                        <SingleDay day='Poniedziałek' />
                        <SingleDay day='Wtorek'/>
                        <SingleDay day='Środa'/>
                        <SingleDay day='Czwartek'/>
                        <SingleDay day='Piątek'/>
                    </tbody>
                </table>
            </div>
        </div>
    )
}