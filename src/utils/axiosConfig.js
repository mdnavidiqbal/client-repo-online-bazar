import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      toast.error('You are not authorized to perform this action.')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance