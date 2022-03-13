import axios from "axios";
import logger from "./logger";
import {toast} from 'react-toastify'

axios.defaults.baseURL = process.env.REACT_APP_API_URL
//console.log("axios.defaults.baseURL",process.env,axios.defaults.baseURL)
axios.interceptors.response.use(null,error=>{
    const expectedError =   error.response && 
                            error.response.status >= 400 && 
                            error.response.status < 500
    if (!expectedError)
    {
      console.log('Logging the error',error)
        logger.log(error)
      toast.error("an unexpected error happend"); 
    }
    return Promise.reject(error)
  })

  function setJwt(jwt){
    axios.defaults.headers.common['x-auth-token'] = jwt
  }

  const axiosHtttp = {
      get :axios.get,
      post :axios.post,
      put :axios.put,
      delete :axios.delete,
      setJwt
  }
  export default axiosHtttp;