import axios from "axios"

export const getExchange = async (): Promise<any> => {
    const google = await axios.get('https://www.google.com')
    console.log(google.status)
    return google.status
}

