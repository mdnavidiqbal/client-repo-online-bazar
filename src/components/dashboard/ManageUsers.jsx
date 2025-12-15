import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, UserCheck, UserX, Shield, ChefHat, Mail, Calendar, Search } from 'lucide-react'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleMakeFraud = async (userId, userName) => {
    const result = await Swal.fire({
      title: `Mark ${userName} as Fraud?`,
      text: "This user will be restricted from placing orders",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as fraud!'
    })

    if (result.isConfirmed) {
      try {
        await axios.patch(`/api/users/${userId}/status`, { status: 'fraud' })
        setUsers(users.map(user => 
          user._id === userId ? { ...user, status: 'fraud' } : user
        ))
        toast.success('User marked as fraud')
      } catch (error) {
        toast.error('Failed to update user status')
      }
    }
  }

  const handleMakeActive = async (userId, userName) => {
    try {
      await axios.patch(`/api/users/${userId}/status`, { status: 'active' })
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ))
      toast.success(`${userName} is now active`)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole })
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ))
      toast.success(`Role changed to ${newRole}`)
    } catch (error) {
      toast.error('Failed to change role')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.chefId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === 'user').length,
    chefs: users.filter(u => u.role === 'chef').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length,
    fraud: users.filter(u => u.status === 'fraud').length
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'chef': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'fraud': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Users - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
          <p className="text-gray-600">Manage all users on the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Customers</p>
              <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Chefs</p>
              <p className="text-2xl font-bold text-blue-600">{stats.chefs}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Admins</p>
              <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Fraud</p>
              <p className="text-2xl font-bold text-red-600">{stats.fraud}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or chef ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-4 py-2 rounded-lg ${roleFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All Users
              </button>
              <button
                onClick={() => setRoleFilter('user')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${roleFilter === 'user' ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>
              <button
                onClick={() => setRoleFilter('chef')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${roleFilter === 'chef' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Chefs</span>
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${roleFilter === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Shield className="w-4 h-4" />
                <span>Admins</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="font-medium">{user.name}</div>
                            {user.chefId && (
                              <div className="text-sm text-gray-500">Chef ID: {user.chefId}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.address.substring(0, 20)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getRoleBadge(user.role)}`}>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {user.role === 'chef' && <ChefHat className="w-3 h-3 mr-1" />}
                            {user.role === 'user' && <Users className="w-3 h-3 mr-1" />}
                            {user.role}
                          </span>
                          
                          {user.role !== 'admin' && (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="block w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="user">Customer</option>
                              <option value="chef">Chef</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusBadge(user.status)}`}>
                          {user.status === 'active' && <UserCheck className="w-3 h-3 mr-1" />}
                          {user.status === 'fraud' && <UserX className="w-3 h-3 mr-1" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.role !== 'admin' && user.status === 'active' ? (
                            <button
                              onClick={() => handleMakeFraud(user._id, user.name)}
                              className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                            >
                              Make Fraud
                            </button>
                          ) : user.status === 'fraud' ? (
                            <button
                              onClick={() => handleMakeActive(user._id, user.name)}
                              className="px-3 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                            >
                              Make Active
                            </button>
                          ) : null}
                          
                          <button className="px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-50">
                            View Details
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
      </div>
    </>
  )
}

export default ManageUsers