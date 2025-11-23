import {Phone} from 'lucide-react'
function Footer() {
    {/* Footer */ }
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">KFC Food</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Menu</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Full Nutrition Guide</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Food Quality</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms and Conditions</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Disclaimer</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="flex items-center space-x-2 mb-2">
                            <Phone className="h-5 w-5 text-red-500" />
                            <span>1800-208-2244</span>
                        </div>
                        <p className="text-gray-400">10:00 AM - 6:00 PM, Mon-Sat</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p> {new Date().getFullYear()} KFC. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;