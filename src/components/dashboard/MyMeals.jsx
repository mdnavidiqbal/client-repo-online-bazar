import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Edit, Trash2, Eye, ChefHat, DollarSign, Star, Package, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const MyMeals = () => {
  const { user } = useAuth()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMeal, setEditingMeal] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/meals/my-meals')
      setMeals(response.data)
    } catch (error) {
      toast.error('Failed to load meals')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (mealId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/meals/${mealId}`)
        setMeals(meals.filter(m => m._id !== mealId))
        toast.success('Meal deleted successfully')
      } catch (error) {
        toast.error('Failed to delete meal')
      }
    }
  }

  const handleEdit = (meal) => {
    setEditingMeal(meal._id)
    setEditForm({
      foodName: meal.foodName,
      price: meal.price,
      ingredients: meal.ingredients.join(', '),
      deliveryArea: meal.deliveryArea,
      estimatedDeliveryTime: meal.estimatedDeliveryTime,
      chefExperience: meal.chefExperience
    })
  }

  const handleUpdate = async (mealId) => {
    try {
      const updatedData = {
        ...editForm,
        ingredients: editForm.ingredients.split(',').map(i => i.trim())
      }
      
      await axios.put(`/api/meals/${mealId}`, updatedData)
      setMeals(meals.map(m => 
        m._id === mealId ? { ...m, ...updatedData } : m
      ))
      setEditingMeal(null)
      toast.success('Meal updated successfully')
    } catch (error) {
      toast.error('Failed to update meal')
    }
  }

  const toggleAvailability = async (mealId, currentStatus) => {
    try {
      await axios.patch(`/api/meals/${mealId}/availability`, {
        isAvailable: !currentStatus
      })
      setMeals(meals.map(m => 
        m._id === mealId ? { ...m, isAvailable: !currentStatus } : m
      ))
      toast.success(`Meal ${!currentStatus ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  return (
    <>
      <Helmet>
        <title>My Meals - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Meals</h1>
              <p className="text-gray-600">Manage your homemade meals</p>
            </div>
            <Link 
              to="/dashboard/create-meal" 
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Meal</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Meals</p>
                <p className="text-3xl font-bold">{meals.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active</p>
                <p className="text-3xl font-bold">
                  {meals.filter(m => m.isAvailable).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold">
                  {meals.length > 0 
                    ? (meals.reduce((sum, m) => sum + m.rating, 0) / meals.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold">
                  {meals.reduce((sum, m) => sum + (m.orderCount || 0), 0)}
                </p>
              </div>
              <ChefHat className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading your meals...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No meals yet</h3>
            <p className="text-gray-600 mb-6">Create your first homemade meal!</p>
            <Link to="/dashboard/create-meal" className="btn-primary">
              Create Your First Meal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div key={meal._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Meal Image */}
                <div className="relative">
                  <img
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => toggleAvailability(meal._id, meal.isAvailable)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        meal.isAvailable
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {meal.isAvailable ? 'Active' : 'Inactive'}
                    </button>
                    <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold">
                      ${meal.price}
                    </span>
                  </div>
                </div>

                {/* Meal Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{meal.foodName}</h3>
                      <p className="text-gray-600">By {meal.chefName}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{meal.rating}</span>
                    </div>
                  </div>

                  {/* Editing Form */}
                  {editingMeal === meal._id ? (
                    <div className="space-y-4 mb-4">
                      <input
                        type="text"
                        value={editForm.foodName}
                        onChange={(e) => setEditForm({...editForm, foodName: e.target.value})}
                        className="input-field"
                        placeholder="Meal Name"
                      />
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        className="input-field"
                        placeholder="Price"
                      />
                      <textarea
                        value={editForm.ingredients}
                        onChange={(e) => setEditForm({...editForm, ingredients: e.target.value})}
                        rows="2"
                        className="input-field resize-none"
                        placeholder="Ingredients (comma separated)"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Ingredients */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.slice(0, 3).map((ing, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {ing}
                            </span>
                          ))}
                          {meal.ingredients.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              +{meal.ingredients.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <ChefHat className="w-4 h-4 mr-2" />
                          <span>Delivery: {meal.deliveryArea}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>Time: {meal.estimatedDeliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          <span>Orders: {meal.orderCount || 0}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-between">
                    {editingMeal === meal._id ? (
                      <>
                        <button
                          onClick={() => setEditingMeal(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(meal._id)}
                          className="btn-primary px-4 py-2"
                        >
                          Update
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(meal)}
                          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit size={18} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(meal._id)}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyMeals