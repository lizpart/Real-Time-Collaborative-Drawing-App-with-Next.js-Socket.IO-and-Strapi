import axios from 'axios'

const strapiApiClient = axios.create({
  baseURL: 'http://localhost:1337/api', 
})

export default strapiApiClient

