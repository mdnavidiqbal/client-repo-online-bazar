import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/firebase.config'
import axios from '../utils/axiosConfig'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken()
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data)
        } catch (error) {
          console.error('Error fetching user data:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      
      const response = await axios.post('/api/users/register', {
        ...userData,
        email,
        firebaseUid: userCredential.user.uid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setUser(response.data.user)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      
      const response = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setUser(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      await axios.post('/api/users/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}