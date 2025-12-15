import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Package, CheckCircle, XCircle, Truck, Clock, User, MapPin, CreditCard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

const OrderRequests = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, accepted, delivered, cancelled

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders/chef-orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus })
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ))
      toast.success(`Order ${newStatus} successfully`)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.orderStatus === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'delivered': return <Truck className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getNextAction = (order) => {
    switch (order.orderStatus) {
      case 'pending':
        return ['Accept', 'accepted']
      case 'accepted':
        return ['Deliver', 'delivered']
      default:
        return null
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    accepted: orders.filter(o => o.orderStatus === 'accepted').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    revenue: orders
      .filter(o => o.orderStatus === 'delivered')
      .reduce((sum, o) => sum + o.totalPrice, 0)
  }

  return (
    <>
      <Helmet>
        <title>Order Requests - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Requests</h1>
          <p className="text-gray-600">Manage customer orders for your meals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Orders</p>
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
              <p className="text-gray-600 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue}</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All Orders ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending ({stats.pending})</span>
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Accepted ({stats.accepted})</span>
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivered ({stats.delivered})</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600">No orders match your filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const nextAction = getNextAction(order)
                    
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={order.mealImage || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'}
                              alt={order.mealName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium">{order.mealName}</div>
                              <div className="text-sm text-gray-500">
                                Qty: {order.quantity} • Ordered: {new Date(order.orderTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">{order.userName}</div>
                              <div className="text-sm text-gray-500">{order.userEmail}</div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            {order.userAddress.substring(0, 30)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">${order.totalPrice}</div>
                          <div className="text-sm text-gray-500">
                            ${order.price} × {order.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="ml-1 capitalize">{order.orderStatus}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {nextAction && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, nextAction[1])}
                                className={`px-3 py-1 rounded text-sm ${
                                  nextAction[0] === 'Accept' 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {nextAction[0]}
                              </button>
                            )}
                            
                            {order.orderStatus === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            )}
                            
                            <button className="px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-50">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Timeline */}
        {filteredOrders.length > 0 && filter === 'pending' && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Pending Order Timeline</h2>
            <div className="space-y-4">
              {filteredOrders.slice(0, 3).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.mealImage}
                      alt={order.mealName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{order.mealName}</h3>
                      <p className="text-sm text-gray-600">{order.userName}</p>
                      <p className="text-sm text-gray-500">
                        Ordered {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">${order.totalPrice}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'accepted')}
                        className="btn-primary px-4 py-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderRequests