import { useEffect, useState, useRef, useCallback } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Cart from "../Components/Cart";
import Toast from "../Components/Toast";
import OffersSection from "../Components/OffersSection";
import { useCart } from '../Contexts/CartContext';

export interface MenuItem {
    _id: string;
    category: string;
    title: string;
    image: string;
    type: string;
    items: string;
    amount: number;
}

export interface Offers {
    _id: string;
    title: string;
    desc: string;
    valid_till: string;
    terms: string[];
    image: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

const API_URL = 'http://localhost:5000/api';

async function getMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

async function getOffers(): Promise<Offers[]> {
    try {
        const response = await fetch(`${API_URL}/offers`);
        if (!response.ok) throw new Error('Failed to fetch offers');
        return await response.json();
    } catch (error) {
        console.error('Error fetching offers:', error);
        return [];
    }
}

function Menu() {
    const { cartItems, addToCart, updateQuantity, getCartCount } = useCart();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuCategories, setMenuCategories] = useState<string[]>([]);
    const [offers, setOffers] = useState<Offers[]>([]);
    const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const cartItemCount = getCartCount();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const data = await getMenuItems();
                setMenuItems(data);
                if (data.length > 0 && !activeCategory) {
                    setActiveCategory(data[0].category);
                }
                setError('');
            } catch (err) {
                const error = err as Error;
                console.error('Error loading menu items:', error);
                setError(error.message || 'Failed to load menu items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const fetchOffers = async () => {
            try {
                const data = await getOffers();
                setOffers(data);
                setError('');
            } catch (err) {
                const error = err as Error;
                console.error('Error loading offers:', error);
                setError(error.message || 'Failed to load offers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
        fetchOffers();
    }, []);

    // Group items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    // Update menu categories when menu items change
    useEffect(() => {
        const newCategories = Object.keys(menuByCategory);
        setMenuCategories(newCategories);
        if (newCategories.length > 0 && !activeCategory) {
            setActiveCategory(newCategories[0]);
        }
    }, [menuItems]);

    // Handle category click
    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        const element = categoryRefs.current[category];
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // Handle scroll to update active category
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            let currentCategory = null;

            for (const category in categoryRefs.current) {
                const element = categoryRefs.current[category];
                if (element && element.offsetTop <= scrollPosition) {
                    currentCategory = category;
                } else {
                    break;
                }
            }

            if (currentCategory && currentCategory !== activeCategory) {
                setActiveCategory(currentCategory);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeCategory]);

    const addItemsToCart = useCallback((item: MenuItem) => {
        addToCart({
            _id: item._id,
            title: item.title,
            amount: item.amount,
            image: item.image,
            category: item.category,
            type: item.type,
            items: item.items
        });
        setShowToast(true);
    }, [addToCart]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-grow">
                <Cart
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                />
                <Toast
                    message="Item added to cart!"
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />
                <section className="py-12 bg-gray-50 font-oswald">
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className="grid grid-cols-12">
                            {/* Categories Sidebar - Sticky */}
                            <div className="col-span-3 w-64 p-4 h-screen sticky top-28 overflow-y-auto">
                                <div className="sticky top-0 pb-4">
                                    <img
                                        className="-translate-x-4 mb-4"
                                        src="https://online.kfc.co.in/static/media/Stripes_OffersIcon.891e24c1.svg"
                                        alt="Menu Categories"
                                    />
                                    <h2 className="text-4xl font-bold font-oswald mb-8">KFC MENU</h2>
                                </div>
                                <div className="space-y-2">
                                    {/* <button className={`text-left w-full px-4 py-3 rounded-lg transition-colors ${activeCategory === 'offers'
                                        ? 'bg-red-600 text-white font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`} onClick={() => handleCategoryClick('offers')}>DEALS & OFFERS</button> */}
                                    {menuCategories.map((category: string) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryClick(category)}
                                            className={`text-left w-full px-4 py-3 rounded-lg transition-colors ${activeCategory === category
                                                ? 'bg-red-600 text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="col-span-9">
                                <div className="flex-1 p-8">
                                    <OffersSection offers={offers} />
                                    {menuCategories.map((category: string) => (
                                        <div
                                            key={category}
                                            ref={(el) => {
                                                categoryRefs.current[category] = el;
                                                return undefined;
                                            }
                                            }
                                            className="mb-16"
                                        >
                                            <div className="mb-8">
                                                <h2 className="text-4xl font-bold mb-2">{category}</h2>
                                                <div className="h-1 w-20 bg-red-600"></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {menuByCategory[category].map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                                                    >
                                                        <div className="relative h-48">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Veg'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <div className="p-6 font-sans flex flex-col">
                                                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                                            <p className="text-gray-600 text-sm mb-4">{item.items}</p>
                                                            <div className="flex justify-between items-center">

                                                                <p className='font-semibold'>₹{item.amount}</p>
                                                                {!cartItems.some(cartItem => cartItem._id === item._id) ? (
                                                                    <button
                                                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                                                                        onClick={() => addItemsToCart(item)}
                                                                    >
                                                                        Add to Cart
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                                                                            onClick={() => updateQuantity(item._id, (cartItems.find(ci => ci._id === item._id)?.quantity || 1) - 1)}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span>{cartItems.find(ci => ci._id === item._id)?.quantity || 0}</span>
                                                                        <button
                                                                            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                                                                            onClick={() => updateQuantity(item._id, (cartItems.find(ci => ci._id === item._id)?.quantity || 0) + 1)}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Menu;