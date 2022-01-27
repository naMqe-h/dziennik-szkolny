import { useState } from "react";
import { toast } from "react-toastify";
import { CombinedSchoolInformationFromFirebase, SchoolInformation } from "../../utils/interfaces";


interface schoolProps {
    schoolData: CombinedSchoolInformationFromFirebase;
    save: (data: SchoolInformation) => void | React.ReactText ;
}
type formDataInterface = Pick<SchoolInformation, "name" | "type" | "address" >

export const School:React.FC<schoolProps> = ({schoolData, save}) => {
    const {name, type, address, domain} = schoolData;
    const formSchoolData = {name, type, address} 
    const [formData, setFormData] = useState<formDataInterface>(formSchoolData);



    const schoolTypes = [
        "Szkoła Podstawowa",
        "Szkoła Zawodowa",
        "Technikum",
        "Liceum",
        "Uniwersytet",
      ];

    const handleChange = (name: string, value:string) => {
       if(name === "city" ||
        name === "postCode" ||
        name === "street"){
            let addressObject = { ...formData.address };
            const newObj = { ...addressObject, [name]: value };
            setFormData((prev) => {
            return { ...prev, address: newObj };
          });
        } else {
          setFormData((prev) => {
            return {
              ...prev,
              [name]: value,
            };
          });
        }
    }
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (formData === formSchoolData) 
            return toast.error("Żadne dane się nie zmieniły", { autoClose: 2000 });
        if (formData.name.length === 0 )
            return toast.error("Podaj nazwę szkoły", { autoClose: 2000 });
        if(formData.address.city.length === 0){
            return toast.error("Podaj miasto", {autoClose: 2000})
        }
        if(
            formData.address.postCode.length !== 6 ||
            formData.address.postCode[2] !== "-"
          )
            return toast.error("Podaj poprawny Kod Pocztowy", { autoClose: 2000 });

        if(formData.address.street.length === 0)
            return toast.error("Podaj ulice", {
            autoClose: 2000,
            });

        const data = {...formData, domain}
        save(data);
    }

    return(
        <div>
            <form className="form-control p-10 m-5">
            <span className="card-title">Ustawienia Szkoły</span>
            <div className="divider" />
            <div className="form-control grid grid-cols-1 md:grid-cols-2">
                <label className="label w-full">
                    <span className="label-text w-full">Nazwa szkoły</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className="input max-w-96"
                    placeholder="Nazwa szkoły"
                />

                <div className="divider md:col-span-2" />

                <label className="label">
                    <span className="label-text">Typ szkoły</span>
                </label>
                <select
                className="select select-bordered w-full"
                value={formData.type}
                name="type"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                >
                {schoolTypes.map((type) => (
                    <option key={type} value={type}>
                    {type}
                    </option>
                ))}
                </select>
                <div className="divider md:col-span-2" />
                <span className="card-title text-center md:col-span-2 mt-10">Adres</span>
                <div className="divider md:col-span-2" />

                <label className="label">
                    <span className="label-text">Miasto</span>
                </label>
                <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    className="input"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    placeholder="Miasto"
                />

                <div className="divider md:col-span-2" />

                <label className="label">
                    <span className="label-text">Kod pocztowy</span>
                </label>
                <input
                    type="text"
                    name="postCode"
                    value={formData.address.postCode}
                    className="input"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    placeholder="xx-xxx"
                />

                <div className="divider md:col-span-2" />

                <label className="label">
                    <span className="label-text">Ulica</span>
                </label>
                <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    className="input"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    placeholder="Ulica"
                />
                <div className="md:col-span-2 flex items-center justify-center mt-10">
                    <button
                    className="btn-primary btn mt-4 self-end text-white"
                    onClick={(e) => handleSubmit(e)}
                    >Zapisz</button>
                </div>
          </div>
      </form>
    </div>
    )
}