import { motion } from 'framer-motion'
import { ArrowRight, ChefHat, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Taste the Love of{' '}
              <span className="text-accent">Home Cooking</span>
            </h1>
            
            <p className="text-xl mb-8 text-gray-100">
              Discover authentic homemade meals crafted by passionate local chefs. 
              Fresh ingredients, traditional recipes, and love in every bite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/meals" className="btn-primary bg-white text-dark hover:bg-gray-100 inline-flex items-center justify-center">
                Order Now <ArrowRight className="ml-2" />
              </Link>
              <Link to="/register" className="btn-secondary border-2 border-white bg-transparent hover:bg-white hover:text-dark inline-flex items-center justify-center">
                Become a Chef
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-sm">Local Chefs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8</div>
                <div className="text-sm">Average Rating</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/20 p-6 rounded-xl">
                  <ChefHat className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="font-bold text-center mb-2">Local Chefs</h3>
                  <p className="text-sm text-center">Authentic home recipes</p>
                </div>
                <div className="bg-white/20 p-6 rounded-xl">
                  <Star className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="font-bold text-center mb-2">Top Rated</h3>
                  <p className="text-sm text-center">4.8+ average rating</p>
                </div>
                <div className="bg-white/20 p-6 rounded-xl">
                  <Clock className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="font-bold text-center mb-2">Fast Delivery</h3>
                  <p className="text-sm text-center">30-45 minutes</p>
                </div>
                <div className="bg-white/20 p-6 rounded-xl">
                  <ChefHat className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="font-bold text-center mb-2">Fresh Meals</h3>
                  <p className="text-sm text-center">Made to order</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold">Spicy Chicken Biryani</h4>
                    <p className="text-sm text-gray-200">By Chef Rahim</p>
                  </div>
                  <div className="text-2xl font-bold">$12.99</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="ml-1">4.9 (120 reviews)</span>
                  </div>
                  <span>🔥 25 ordered today</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
    </section>
  )
}

export default HeroSection