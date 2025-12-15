import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, User, Clock, CheckCircle, XCircle, ChefHat, Shield, AlertCircle } from 'lucide-react'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

const ManageRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, approved, rejected

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/requests')
      setRequests(response.data)
    } catch (error) {
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId, requestType, userEmail) => {
    try {
      await axios.patch(`/api/requests/${requestId}/approve`, {
        requestType,
        userEmail
      })
      setRequests(requests.map(req => 
        req._id === requestId 
          ? { ...req, requestStatus: 'approved' } 
          : req
      ))
      toast.success('Request approved successfully')
    } catch (error) {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await axios.patch(`/api/requests/${requestId}/reject`)
      setRequests(requests.map(req => 
        req._id === requestId 
          ? { ...req, requestStatus: 'rejected' } 
          : req
      ))
      toast.success('Request rejected')
    } catch (error) {
      toast.error('Failed to reject request')
    }
  }

  const filteredRequests = requests.filter(req => req.requestStatus === filter)

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.requestStatus === 'pending').length,
    approved: requests.filter(r => r.requestStatus === 'approved').length,
    rejected: requests.filter(r => r.requestStatus === 'rejected').length,
    chefRequests: requests.filter(r => r.requestType === 'chef').length,
    adminRequests: requests.filter(r => r.requestType === 'admin').length
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'chef': return <ChefHat className="w-5 h-5" />
      case 'admin': return <Shield className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Helmet>
        <title>Manage Requests - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Requests</h1>
          <p className="text-gray-600">Approve or reject user role change requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Chef Requests</p>
              <p className="text-2xl font-bold text-blue-600">{stats.chefRequests}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Admin Requests</p>
              <p className="text-2xl font-bold text-red-600">{stats.adminRequests}</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending ({stats.pending})</span>
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approved ({stats.approved})</span>
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <XCircle className="w-4 h-4" />
            <span>Rejected ({stats.rejected})</span>
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No requests found</h3>
              <p className="text-gray-600">No requests match your filter</p>
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
                      Request Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{request.userName}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-4 h-4 mr-2" />
                              {request.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center px-3 py-2 rounded-lg ${
                          request.requestType === 'chef' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getRequestTypeIcon(request.requestType)}
                          <span className="ml-2 font-semibold capitalize">
                            {request.requestType} Request
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(request.requestStatus)}`}>
                          {getStatusIcon(request.requestStatus)}
                          <span className="ml-1 capitalize">{request.requestStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(request.requestTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          request.currentRole === 'user' 
                            ? 'bg-green-100 text-green-800'
                            : request.currentRole === 'chef'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.currentRole}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {request.requestStatus === 'pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request._id, request.requestType, request.userEmail)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">
                            {request.requestStatus === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Request Details Modal Placeholder */}
        {filter === 'pending' && filteredRequests.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Pending Request Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-4">Chef Request Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>User must be active (not marked as fraud)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unique Chef ID will be generated automatically</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>User will be able to create and manage meals</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-4">Admin Request Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>User must have been active for at least 30 days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>User must have a clean record (no fraud history)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Full system access will be granted</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ManageRequests