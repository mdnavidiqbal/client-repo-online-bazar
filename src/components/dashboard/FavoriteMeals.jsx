import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Heart, Trash2, Clock, ChefHat, DollarSign, Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const FavoriteMeals = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/favorites')
      setFavorites(response.data)
    } catch (error) {
      toast.error('Failed to load favorite meals')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}`)
      setFavorites(favorites.filter(f => f._id !== favoriteId))
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to remove from favorites')
    }
  }

  const handleRemoveAll = async () => {
    try {
      await axios.delete('/api/favorites')
      setFavorites([])
      toast.success('All favorites removed')
    } catch (error) {
      toast.error('Failed to remove all favorites')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      <Helmet>
        <title>Favorite Meals - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Favorite Meals</h1>
              <p className="text-gray-600">Your saved meals for quick ordering</p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handleRemoveAll}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                <Trash2 size={18} />
                <span>Remove All</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Favorites</p>
                <p className="text-3xl font-bold">{favorites.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Unique Chefs</p>
                <p className="text-3xl font-bold">
                  {[...new Set(favorites.map(f => f.chefId))].length}
                </p>
              </div>
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Value</p>
                <p className="text-3xl font-bold">
                  ${favorites.reduce((sum, f) => sum + f.price, 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Favorites Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading favorite meals...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorite meals yet</h3>
              <p className="text-gray-600 mb-6">Start adding meals to your favorites!</p>
              <Link to="/meals" className="btn-primary">
                Browse Meals
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chef
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {favorites.map((favorite) => (
                    <tr key={favorite._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={favorite.mealImage || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'}
                            alt={favorite.mealName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="font-medium">{favorite.mealName}</div>
                            <div className="text-sm text-gray-500">ID: {favorite.mealId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <ChefHat className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{favorite.chefName}</div>
                            <div className="text-sm text-gray-500">{favorite.chefId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {favorite.price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(favorite.addedTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/meals/${favorite.mealId}`}
                            className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                          >
                            Order Now
                          </Link>
                          <button
                            onClick={() => handleRemove(favorite._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Remove from favorites"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Order</h3>
              <p className="mb-6">Order all your favorite meals with one click!</p>
              <button className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
                Order All ({favorites.length} meals)
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Most Added Chef</h3>
              {(() => {
                const chefCount = {}
                favorites.forEach(f => {
                  chefCount[f.chefName] = (chefCount[f.chefName] || 0) + 1
                })
                const topChef = Object.entries(chefCount).sort((a, b) => b[1] - a[1])[0]
                
                return topChef ? (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <ChefHat className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">{topChef[0]}</h4>
                        <p className="text-gray-600">{topChef[1]} meals in favorites</p>
                      </div>
                    </div>
                    <Link 
                      to={`/chef/${favorites.find(f => f.chefName === topChef[0])?.chefId}`}
                      className="text-primary hover:underline"
                    >
                      View Chef Profile →
                    </Link>
                  </>
                ) : null
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default FavoriteMeals