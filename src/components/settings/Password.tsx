import { useEffect, useState } from "react"
import { useValidateInputs } from "../../hooks/useValidateInputs";


interface passwordProps {
    save: (password: string) => React.ReactText | undefined
}

export const Password: React.FC<passwordProps> = ({save}) => {
    
    const [formData, setFormData] = useState({
        passwords:{
            password: '',
            repeatedPassword: ''
        }
    });
    const [validated, setValidated] = useState<Boolean>(false);

    const { validateData, inputErrors, errors } = useValidateInputs();

    useEffect(() => {
      if(validated){
          if(errors) return
          save(formData.passwords.password);
      }
    }, [validated, errors])
    


    const handleChange = (name: string, value: string) => {
        setFormData((prevState: any) => {
            return {
              passwords:{
                ...prevState.passwords,
                [name]: value,
              } 
            };
          }); 
      };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setValidated(false);
        validateData(formData);
        setValidated(true);
    }
    
    
    return (
        <div>
             <form className="form-control p-10 m-5">
                <span className="card-title">Zmiana hasła</span>
                <div className="divider" />
                <div className="form-control">
                    <label className="label w-full">
                        <span className="label-text w-full">Hasło</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.passwords.password}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className={`input max-w-md ${inputErrors.password.error ? 'border-red-500' : ''}`}
                        placeholder="Hasło"
                    />

                    <div className="divider" />

                    <label className="label w-full">
                        <span className="label-text w-full">Powtórz hasło</span>
                    </label>
                    <input
                        type="password"
                        name="repeatedPassword"
                        value={formData.passwords.repeatedPassword}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className={`input max-w-md ${inputErrors.repeatedPassword.error ? 'border-red-500' : ''}`}
                        placeholder="Powtórz hasło"
                    />
                     <div className="md:col-span-2 flex items-center justify-center mt-10">
                        <button
                        className="btn-primary btn mt-4 self-end"
                        onClick={(e) => handleSubmit(e)}>
                            Zapisz
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}