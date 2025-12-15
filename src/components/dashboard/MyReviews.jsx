import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Star, Edit, Trash2, Calendar, MessageSquare } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const MyReviews = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingReview, setEditingReview] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/reviews/my-reviews')
      setReviews(response.data)
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId) => {
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
        await axios.delete(`/api/reviews/${reviewId}`)
        setReviews(reviews.filter(r => r._id !== reviewId))
        toast.success('Review deleted successfully')
      } catch (error) {
        toast.error('Failed to delete review')
      }
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review._id)
    setEditForm({
      rating: review.rating,
      comment: review.comment
    })
  }

  const handleUpdate = async (reviewId) => {
    try {
      await axios.put(`/api/reviews/${reviewId}`, editForm)
      setReviews(reviews.map(r => 
        r._id === reviewId 
          ? { ...r, ...editForm } 
          : r
      ))
      setEditingReview(null)
      toast.success('Review updated successfully')
    } catch (error) {
      toast.error('Failed to update review')
    }
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setEditForm({ rating: 5, comment: '' })
  }

  const StarRating = ({ rating, editable = false, onChange }) => {
    const stars = [1, 2, 3, 4, 5]
    
    return (
      <div className="flex">
        {stars.map((star) => (
          <button
            key={star}
            type={editable ? "button" : "div"}
            onClick={editable ? () => onChange(star) : undefined}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } ${editable ? 'cursor-pointer hover:scale-110' : ''}`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Reviews - Dashboard</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-gray-600">Manage your reviews for ordered meals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
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
                <p className="text-gray-600">Last Review</p>
                <p className="text-lg font-bold">
                  {reviews.length > 0 
                    ? new Date(reviews[0].date).toLocaleDateString()
                    : 'No reviews yet'
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading your reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-600">Start reviewing your ordered meals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Review Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.reviewerImage || user?.image}
                        alt={review.reviewerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{review.reviewerName}</h4>
                        <p className="text-sm text-gray-500">{review.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Meal Info */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-lg mb-2">{review.mealName}</h5>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Rating */}
                  {editingReview === review._id ? (
                    <div className="mb-4">
                      <StarRating
                        rating={editForm.rating}
                        editable={true}
                        onChange={(rating) => setEditForm({...editForm, rating})}
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <StarRating rating={review.rating} />
                      <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                  )}

                  {/* Comment */}
                  {editingReview === review._id ? (
                    <div className="mb-4">
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                  )}
                </div>

                {/* Actions */}
                {editingReview === review._id && (
                  <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(review._id)}
                      className="btn-primary px-4 py-2"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Review Guidelines</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <Star className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <span>Be honest about your dining experience</span>
            </li>
            <li className="flex items-start">
              <Star className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <span>Focus on the food quality and service</span>
            </li>
            <li className="flex items-start">
              <Star className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <span>Keep reviews respectful and constructive</span>
            </li>
            <li className="flex items-start">
              <Star className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <span>Include both positive aspects and areas for improvement</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default MyReviews