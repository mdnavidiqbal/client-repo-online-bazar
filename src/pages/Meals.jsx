import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Filter, Search, SortAsc, SortDesc, ChefHat } from 'lucide-react'
import MealCard from '../components/MealCard'
import axios from '../utils/axiosConfig'
import toast from 'react-hot-toast'

const Meals = () => {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchMeals()
  }, [currentPage, sortBy, sortOrder])

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/meals', {
        params: {
          page: currentPage,
          limit: 10,
          sortBy,
          sortOrder
        }
      })
      setMeals(response.data.meals)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load meals')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const filteredMeals = meals.filter(meal =>
    meal.foodName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.chefName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
        sortBy === field
          ? 'border-primary bg-primary text-white'
          : 'border-gray-300 hover:border-primary'
      }`}
    >
      <span>{label}</span>
      {sortBy === field && (
        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
      )}
    </button>
  )

  return (
    <>
      <Helmet>
        <title>Meals - LocalChefBazaar</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <ChefHat className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Explore Delicious Meals</h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Discover homemade meals crafted by passionate local chefs. Fresh ingredients, authentic recipes.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search meals, chefs, or ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Sort Buttons */}
              <div className="flex flex-wrap gap-2">
                <SortButton field="createdAt" label="Newest" />
                <SortButton field="price" label="Price" />
                <SortButton field="rating" label="Rating" />
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary">
                  <Filter size={16} />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading delicious meals...</p>
            </div>
          ) : (
            <>
              {/* Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredMeals.length > 0 ? (
                  filteredMeals.map((meal, index) => (
                    <motion.div
                      key={meal._id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <MealCard meal={meal} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No meals found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'border border-gray-300 hover:border-primary'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    {totalPages > 5 && (
                      <span className="px-2">...</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Meals