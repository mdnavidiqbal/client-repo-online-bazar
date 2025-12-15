import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Package, Clock, CheckCircle, XCircle, CreditCard, Truck, Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders/my-orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (orderId) => {
    try {
      // Implement payment logic here
      toast.success('Payment successful!')
      fetchOrders() // Refresh orders
    } catch (error) {
      toast.error('Payment failed')
    }
  }

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
      case 'delivered': return <Package className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your food orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.orderStatus === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Delivered</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.orderStatus === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Cancelled</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.orderStatus === 'cancelled').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-600">Start ordering delicious meals!</p>
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
                    <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
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
                              Qty: {order.quantity} × ${order.price}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.chefName}</div>
                        <div className="text-sm text-gray-500">{order.chefId}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${order.totalPrice}
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
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(order.orderTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePayment(order._id)}
                            disabled={order.paymentStatus === 'paid' || order.orderStatus !== 'accepted'}
                            className={`px-3 py-1 rounded text-sm ${
                              order.paymentStatus === 'paid' || order.orderStatus !== 'accepted'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            Pay
                          </button>
                          <button
                            className="px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-50"
                            onClick={() => {/* View details */}}
                          >
                            View
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

        {/* Order Timeline */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {orders.slice(0, 3).map((order, index) => (
                <div key={order._id} className="relative flex items-start mb-8">
                  <div className={`z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{order.mealName}</h3>
                      <span className="text-gray-500 text-sm">
                        {new Date(order.orderTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-gray-600">Chef: {order.chefName}</span>
                      <span className="text-gray-600">Total: ${order.totalPrice}</span>
                    </div>
                    <p className="text-gray-500">
                      Delivery to: {order.userAddress}
                    </p>
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

export default MyOrders