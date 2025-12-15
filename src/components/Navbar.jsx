import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChefHat, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Meals', path: '/meals' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : [])
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">LocalChefBazaar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-dark hover:text-primary font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.image || 'https://i.ibb.co/7WZjKx9/avatar-default.png'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-dark hover:text-primary font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-2 text-dark hover:text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 py-3">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="btn-secondary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar