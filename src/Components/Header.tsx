import { ShoppingBag, Menu, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';

interface HeaderProps {
    cartItemCount?: number;
    onCartClick?: () => void;
}

function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <img 
                        onClick={() => navigate('/')} 
                        className='w-32 cursor-pointer' 
                        src="https://images.seeklogo.com/logo-png/32/2/kfc-logo-png_seeklogo-322044.png" 
                        alt="KFC Logo" 
                    />
                    
                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <button 
                            onClick={() => navigate('/menu')}
                            className="text-gray-900 hover:text-red-600 px-3 py-2 font-bold"
                        >
                            MENU
                        </button>
                        <button 
                            onClick={() => navigate('/menu')}
                            className="text-gray-900 hover:text-red-600 px-3 py-2 font-bold"
                        >
                            DEALS
                        </button>
                    </nav>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                                >
                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <User size={18} />
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/my-orders');
                                                setIsProfileOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Orders
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors font-medium flex items-center space-x-2"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </button>
                        )}

                        <button 
                            className="p-2 text-gray-600 hover:text-red-600 relative"
                            onClick={onCartClick}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                        </button>

                        <button className="md:hidden p-2 text-gray-600 hover:text-red-600">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;