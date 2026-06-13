import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPinterest 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          
          <div>
            <h3 className="text-xl font-bold text-primary-600 mb-4">
              Babio
            </h3>
            <p className="text-gray-600 text-sm">
              Giving your little one the best start with organic, safe & gentle products.
            </p>
          </div>

          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-primary-600">Products</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary-600">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>

         
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-gray-600 hover:text-primary-600">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-primary-600">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary-600">Terms of Service</Link></li>
            </ul>
          </div>

         
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-primary-600 text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 text-xl">
                <FaPinterest />
              </a>
            </div>
            <p className="text-sm text-gray-600">
              Email: support@babio.com<br />
              Phone: +1 (800) 123-4567
            </p>
          </div>
        </div>

        
        <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
          © {currentYear} Babio Essentials. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;