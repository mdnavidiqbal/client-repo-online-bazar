import { motion } from 'framer-motion'
import { Star, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MealCard = ({ meal }) => {
  const { user } = useAuth()
  
  const handleSeeDetails = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="meal-card"
    >
      <div className="relative">
        <img 
          src={meal?.image || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'} 
          alt={meal?.name || 'Meal'}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${meal?.price || '12.99'}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">{meal?.name || 'Spicy Chicken Biryani'}</h3>
        <p className="text-gray-600 mb-3">By Chef {meal?.chef || 'Rahim'}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{meal?.rating || '4.5'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="ml-1 text-sm">{meal?.time || '30 min'}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="ml-1 text-sm">{meal?.area || 'Dhaka'}</span>
          </div>
        </div>
        
        <Link 
          to={user ? `/meals/${meal?.id || '1'}` : '/login'}
          onClick={!user ? handleSeeDetails : null}
        >
          <button className="btn-primary w-full">
            See Details
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export default MealCard