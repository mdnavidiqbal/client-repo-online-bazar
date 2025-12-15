import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { User, Mail, MapPin, ChefHat, Shield, Edit, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.image)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || ''
    }
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await axios.put('/api/users/profile', {
        ...data,
        image: profileImage
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      // Update local user context if needed
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleBecomeChef = async () => {
    try {
      await axios.post('/api/requests', {
        requestType: 'chef'
      })
      toast.success('Chef request submitted! Admin will review it.')
    } catch (error) {
      toast.error('Failed to submit request')
    }
  }

  const handleBecomeAdmin = async () => {
    try {
      await axios.post('/api/requests', {
        requestType: 'admin'
      })
      toast.success('Admin request submitted!')
    } catch (error) {
      toast.error('Failed to submit request')
    }
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Dashboard</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="relative mb-6">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profileImage || 'https://i.ibb.co/7WZjKx9/avatar-default.png'}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'chef' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user?.role?.toUpperCase()}
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
                  user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status?.toUpperCase()}
                </div>
                
                {user?.chefId && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <ChefHat className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Chef ID: {user.chefId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Edit size={18} />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          {...register('name', { required: 'Name is required' })}
                          type="text"
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email}
                          className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          {...register('address', { required: 'Address is required' })}
                          rows="3"
                          className="input-field pl-10 resize-none"
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary px-6 py-2"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">{user?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{user?.email}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">{user?.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="font-semibold">{user?.role?.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className={`font-semibold ${
                          user?.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {user?.status?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Request Buttons */}
              {!isEditing && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Role Management</h3>
                  <div className="flex flex-wrap gap-4">
                    {user?.role !== 'chef' && user?.role !== 'admin' && (
                      <button
                        onClick={handleBecomeChef}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <ChefHat size={18} />
                        <span>Become a Chef</span>
                      </button>
                    )}
                    
                    {user?.role !== 'admin' && (
                      <button
                        onClick={handleBecomeAdmin}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Shield size={18} />
                        <span>Become an Admin</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile