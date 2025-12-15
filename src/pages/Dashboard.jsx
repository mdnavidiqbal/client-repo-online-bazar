import { useState, useEffect } from 'react'
// import { Helmet } from 'react-helmet-async'
// import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  User, ShoppingBag, Star, Heart, ChefHat, 
  Settings, Package, Users, BarChart, Bell,
  Home, LogOut, Grid
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Profile from '../components/dashboard/Profile'
import MyOrders from '../components/dashboard/MyOrders'
import MyReviews from '../components/dashboard/MyReviews'
import FavoriteMeals from '../components/dashboard/FavoriteMeals'
import CreateMeal from '../components/dashboard/CreateMeal'
import MyMeals from '../components/dashboard/MyMeals'
import OrderRequests from '../components/dashboard/OrderRequests'
import ManageUsers from '../components/dashboard/ManageUsers.jsx'
import ManageRequests from '../components/dashboard/ManageRequests'
import PlatformStats from '../components/dashboard/PlatformStats'
import { Link, Route, Routes, useLocation } from 'react-router'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // User dashboard links
  const userLinks = [
    { icon: <User size={20} />, label: 'My Profile', path: 'profile' },
    { icon: <ShoppingBag size={20} />, label: 'My Orders', path: 'orders' },
    { icon: <Star size={20} />, label: 'My Reviews', path: 'reviews' },
    { icon: <Heart size={20} />, label: 'Favorite Meals', path: 'favorites' }
  ]

  // Chef dashboard links
  const chefLinks = [
    { icon: <ChefHat size={20} />, label: 'Create Meal', path: 'create-meal' },
    { icon: <Package size={20} />, label: 'My Meals', path: 'my-meals' },
    { icon: <Bell size={20} />, label: 'Order Requests', path: 'order-requests' }
  ]

  // Admin dashboard links
  const adminLinks = [
    { icon: <Users size={20} />, label: 'Manage Users', path: 'manage-users' },
    { icon: <Settings size={20} />, label: 'Manage Requests', path: 'manage-requests' },
    { icon: <BarChart size={20} />, label: 'Platform Stats', path: 'stats' }
  ]

  const getDashboardLinks = () => {
    const links = [...userLinks]
    if (user?.role === 'chef' || user?.role === 'admin') {
      links.push(...chefLinks)
    }
    if (user?.role === 'admin') {
      links.push(...adminLinks)
    }
    return links
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - LocalChefBazaar</title>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <Grid size={24} />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <Link to="/" className="p-2 rounded-lg bg-gray-100">
              <Home size={24} />
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className={`lg:w-64 ${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                {/* User Info */}
                <div className="flex items-center space-x-4 mb-8 pb-6 border-b">
                  <img
                    src={user?.image || 'https://i.ibb.co/7WZjKx9/avatar-default.png'}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{user?.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user?.role === 'chef' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {getDashboardLinks().map((link) => {
                    const isActive = location.pathname.includes(link.path)
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 mt-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <Routes>
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<MyOrders />} />
                  <Route path="reviews" element={<MyReviews />} />
                  <Route path="favorites" element={<FavoriteMeals />} />
                  <Route path="create-meal" element={<CreateMeal />} />
                  <Route path="my-meals" element={<MyMeals />} />
                  <Route path="order-requests" element={<OrderRequests />} />
                  <Route path="manage-users" element={<ManageUsers />} />
                  <Route path="manage-requests" element={<ManageRequests />} />
                  <Route path="stats" element={<PlatformStats />} />
                  <Route index element={<Profile />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard