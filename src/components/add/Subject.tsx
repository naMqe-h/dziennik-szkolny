import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { setUserData } from "../../redux/userSlice";
// import { validateEmail } from "../../utils/utils";
import { SubjectData } from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import Select from "react-select/dist/declarations/src/Select";
// import { ActionMeta, Options } from "react-select";
export const Subject:React.FC = () =>{
    const teachers = useSelector((state: RootState) => state.user.schoolData?.teachers!==undefined ? state.user.schoolData.teachers : {});
    const [subjectData,setSubjectData] = useState<SubjectData>({
        includedAvg:true,
        name:"",
        teachers:[]
    })
    const [,setOptions] = useState<{value:string,label:string}[]>([])
    useEffect(() => {
        const temp=Object.values(teachers).map(x=>{
            return {value:`${x.firstName} ${x.lastName}`,label:`${x.firstName} ${x.lastName}`}
        })
        setOptions(temp)
    }, [teachers]);
    // function handleSelectOptions(option: readonly Options[], actionMeta: ActionMeta<Option>){
        
    // }
    function validateData(e: React.SyntheticEvent) {
        e.preventDefault();
      }
      function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) {
        const { name, value } = e.target;
        setSubjectData((prev) => {
          return { ...prev, [name]: value };
        })
      }
    return(
        <div className="mt-12 flex items-center justify-center">
        <form className="form-control card bg-base-200 p-14" action="none">
          <label className="input-group my-4">
            <span className="bg-primary">Email</span>
            <input
              type="text"
              name="name"
              className="input"
              autoComplete="name"
              value={subjectData.name}
              placeholder="Name"
              onChange={handleChange}
            />
          </label>
          <label className="input-group my-4">
            <span className="bg-primary">Wybierz Nauczycieli</span>
           {/*  <Select options={options} onChange={handleChangeSelect} /> */}
          </label>
          <div className="flex items-center justify-center w-full">
            <button
              className="btn-primary text-white btn w-[40%]"
              onClick={(e) => validateData(e)}
            >
              Zaloguj
            </button>
          </div>
          <button/>
          </form>
          </div>
    )
}