import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { 
  ChefHat, Upload, Plus, X, DollarSign, 
  Clock, Award, MapPin, List 
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

const CreateMeal = () => {
  const { user } = useAuth()
  const [ingredients, setIngredients] = useState([''])
  const [mealImage, setMealImage] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      foodName: '',
      price: '',
      estimatedDeliveryTime: '30 minutes',
      chefExperience: '',
      deliveryArea: ''
    }
  })

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMealImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '')
    
    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    if (!mealImage) {
      toast.error('Please upload a meal image')
      return
    }

    const mealData = {
      ...data,
      ingredients: filteredIngredients,
      foodImage: mealImage,
      chefName: user.name,
      chefId: user.chefId || user._id,
      userEmail: user.email,
      rating: 0, // New meals start with 0 rating
      isAvailable: true
    }

    setLoading(true)
    try {
      await axios.post('/api/meals', mealData)
      toast.success('Meal created successfully!')
      reset()
      setIngredients([''])
      setMealImage(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create meal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Meal - Dashboard</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Meal</h1>
          <p className="text-gray-600">Add your delicious homemade meal to the marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <ChefHat className="w-6 h-6 mr-3 text-primary" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meal Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Meal Name *</label>
                <input
                  {...register('foodName', { required: 'Meal name is required' })}
                  type="text"
                  placeholder="e.g., Spicy Chicken Biryani"
                  className="input-field"
                />
                {errors.foodName && (
                  <p className="mt-1 text-sm text-red-600">{errors.foodName.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Price ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be at least $1' },
                      pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price format' }
                    })}
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="12.99"
                    className="input-field pl-10"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Delivery Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    {...register('estimatedDeliveryTime', { required: 'Delivery time is required' })}
                    className="input-field pl-10"
                  >
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
                {errors.estimatedDeliveryTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedDeliveryTime.message}</p>
                )}
              </div>

              {/* Delivery Area */}
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Area *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('deliveryArea', { required: 'Delivery area is required' })}
                    type="text"
                    placeholder="e.g., Dhaka, Mirpur"
                    className="input-field pl-10"
                  />
                </div>
                {errors.deliveryArea && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryArea.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Meal Image *</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
              {mealImage ? (
                <div className="relative">
                  <img
                    src={mealImage}
                    alt="Meal preview"
                    className="w-64 h-64 mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setMealImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mb-6">PNG, JPG, GIF up to 5MB</p>
                  <label className="btn-primary cursor-pointer inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Ingredients Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <List className="w-6 h-6 mr-3 text-primary" />
              Ingredients *
            </h2>
            
            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1} (e.g., Chicken, Rice, Spices)`}
                    className="input-field flex-1"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center space-x-2 text-primary hover:text-primary/80"
              >
                <Plus size={20} />
                <span>Add Another Ingredient</span>
              </button>
            </div>
          </div>

          {/* Chef Experience Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-primary" />
              Chef Experience
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Cooking Experience *</label>
              <textarea
                {...register('chefExperience', { required: 'Experience description is required' })}
                rows="4"
                placeholder="Describe your cooking experience, specialties, and background..."
                className="input-field resize-none"
              />
              {errors.chefExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.chefExperience.message}</p>
              )}
            </div>
          </div>

          {/* Chef Info (Read-only) */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Chef Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Chef Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chef ID</p>
                <p className="font-medium">{user?.chefId || 'Not assigned yet'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset()
                setIngredients([''])
                setMealImage(null)
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg font-semibold"
            >
              {loading ? 'Creating Meal...' : 'Create Meal'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateMeal