import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  DollarSign, Package, ChefHat, Calendar,
  ShoppingBag, CreditCard, Star, MapPin
} from 'lucide-react'
import axios from '../../utils/axiosConfig'
import toast from 'react-hot-toast'

// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalMeals: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    activeChefs: 0,
    topMeals: [],
    revenueData: [],
    orderData: [],
    userGrowth: []
  })
  
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month') // day, week, month, year

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stats', {
        params: { timeRange }
      })
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  // Revenue chart data
  const revenueChartData = stats.revenueData.map(item => ({
    name: item.date,
    revenue: item.amount
  }))

  // Orders chart data
  const ordersChartData = stats.orderData.map(item => ({
    name: item.date,
    orders: item.count
  }))

  // User growth data
  const userGrowthData = stats.userGrowth.map(item => ({
    name: item.date,
    users: item.count
  }))

  // Pie chart data for order status
  const orderStatusData = [
    { name: 'Delivered', value: stats.deliveredOrders, color: '#10B981' },
    { name: 'Pending', value: stats.pendingOrders, color: '#F59E0B' },
    { name: 'Cancelled', value: Math.max(0, stats.totalOrders - stats.deliveredOrders - stats.pendingOrders), color: '#EF4444' }
  ]

  // Pie chart data for user roles
  const userRoleData = [
    { name: 'Customers', value: stats.totalUsers - stats.activeChefs - 1, color: '#3B82F6' },
    { name: 'Chefs', value: stats.activeChefs, color: '#8B5CF6' },
    { name: 'Admins', value: 1, color: '#EF4444' }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <>
      <Helmet>
        <title>Platform Statistics - Dashboard</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Platform Statistics</h1>
              <p className="text-gray-600">Overview of platform performance and metrics</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('day')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'day' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                This Year
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12.5% from last {timeRange}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8.2% from last {timeRange}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-purple-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15.3% from last {timeRange}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600">Active Chefs</p>
                <p className="text-3xl font-bold">{stats.activeChefs}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ChefHat className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-orange-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5.7% from last {timeRange}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-primary" />
                Revenue Overview
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Total: ${stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Package className="w-6 h-6 mr-3 text-primary" />
                Orders Overview
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>Total: {stats.totalOrders}</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    name="Orders" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <PieChart className="w-6 h-6 mr-3 text-primary" />
              Order Status Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* User Role Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-primary" />
              User Role Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Users']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {userRoleData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Meals Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Star className="w-6 h-6 mr-3 text-primary" />
            Top Performing Meals
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">Meal</th>
                  <th className="px-4 py-3 text-left">Chef</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Orders</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.topMeals.slice(0, 5).map((meal, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <span className="font-medium">{meal.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <ChefHat className="w-4 h-4 mr-2 text-gray-400" />
                        {meal.chef}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">${meal.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{meal.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{meal.orders}</td>
                    <td className="px-4 py-3 font-semibold">${meal.revenue}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {meal.location}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-3 text-green-600" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payments</span>
                <span className="font-semibold">{stats.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Successful</span>
                <span className="font-semibold text-green-600">{Math.round(stats.totalOrders * 0.95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-semibold text-red-600">{Math.round(stats.totalOrders * 0.05)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refunded</span>
                <span className="font-semibold text-yellow-600">{Math.round(stats.totalOrders * 0.02)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              Activity This {timeRange}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Users</span>
                <span className="font-semibold">{Math.round(stats.totalUsers * 0.1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Meals</span>
                <span className="font-semibold">{Math.round(stats.totalMeals * 0.15)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Chefs</span>
                <span className="font-semibold">{Math.round(stats.activeChefs * 0.08)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-semibold">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-3 text-purple-600" />
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Retention</span>
                <span className="font-semibold text-green-600">85.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Rating</span>
                <span className="font-semibold text-yellow-600">4.7/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Success</span>
                <span className="font-semibold text-green-600">98.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlatformStats