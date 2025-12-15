// import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ChefHat, Clock, Shield, Truck } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import MealCard from '../components/MealCard'

const Home = () => {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: 'Local Chefs',
      description: 'Authentic home-cooked meals by local culinary experts'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Fresh & Quick',
      description: 'Freshly prepared meals delivered within 30-45 minutes'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '100% Safe',
      description: 'Hygienic preparation and contactless delivery'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Delivery',
      description: 'Free delivery on orders above $15'
    }
  ]

  return (
    <>
      <Helmet>
        <title>LocalChefBazaar - Home Cooked Meals</title>
      </Helmet>
      
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LocalChefBazaar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-background hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Daily Meals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Today's Special Meals</h2>
            <button className="btn-primary">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Meal cards will be populated dynamically */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <MealCard key={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', review: 'Best homemade food ever! The biryani reminded me of my grandmother\'s cooking.' },
              { name: 'Michael Chen', review: 'Convenient, delicious, and affordable. I order almost every day!' },
              { name: 'Emma Wilson', review: 'The chefs are amazing. Every meal feels like it\'s made with love.' }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home