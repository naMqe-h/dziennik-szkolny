import { useState } from "react"
import axios from "axios"
import { toast } from 'react-toastify'

export default function useFetch() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getData = async (url : string) => {
        setData([])
        setLoading(true)

        try {
            const response = await axios.get(url)
            if(response.data?.error) {
                toast.error(response.data.error, { autoClose: 3000 })
                setLoading(false)
            } else {
                setData(response.data)
                setLoading(false)
            }
        } catch (err) {
            toast.error('Could not fetch data', { autoClose: 3000 })
            setLoading(false)
        }

        
    }

    return {data, loading, getData, setData}
}