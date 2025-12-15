import { ChefHat, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-8 h-8" />
              <span className="text-2xl font-bold">LocalChefBazaar</span>
            </div>
            <p className="text-gray-300 mb-6">
              Connecting food lovers with local home chefs. Fresh, homemade meals delivered to your door.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-primary" />
                <span>123 Food Street, Culinary City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary" />
                <span>support@localchefbazaar.com</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-6">Working Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="block hover:text-primary transition-colors">About Us</a>
              <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="block hover:text-primary transition-colors">Become a Chef</a>
              <a href="#" className="block hover:text-primary transition-colors">FAQs</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} LocalChefBazaar. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with ❤️ for food lovers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer