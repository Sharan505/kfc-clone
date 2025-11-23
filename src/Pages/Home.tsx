import Footer from '../Components/Footer';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const categories = [
        {
            id: 1,
            title: 'EPIC BUCKET OF THE DAY',
            description: 'Delicious chicken burgers with our secret recipe',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/wAKmOMcpTm0yfspLrl20B/a49799960b22ba96b733f54971d96825/KFC-category-EPIC-Bucket-1_All-in-one-bucket-delivery_-28th-JAN_1.jpg?fm=webp&fit=fill',
            alt: 'Burgers',
            type: 'special'
        },
        {
            id: 2,
            title: 'VARIETY BUCKET',
            description: 'Share the joy with our bucket meals',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/5iYMlSgO8gr09Rjbn185qs/8f330ee5eb94ba4eff4f4552e361218d/KFC-Variety-Bucket.jpg?fm=webp&fit=fill',
            alt: 'Bucket Meals',
            type: 'normal'
        },
        {
            id: 3,
            title: 'SNACKS',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/5VQAImh8fghx8cYtmjRBxu/050c6b65545546ecca314321a5dddc15/CAT89?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 4,
            title: 'GOLD EDITION',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/4AcPJzGNNxfXiF1rWvlydj/2a8548a717ff678fbfb0d881b7367ba8/KFC-Gold-Burger-White-Category-23MAY_4.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 5,
            title: 'BOX MEALS',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/7zQ4a4xD9BW9Qyl03WlTqR/bbcea04b544b8700ea7fe7834d85feb7/KFC-Box-Meals.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 6,
            title: 'VEG',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/169o6qKazOgakFLMKkHUGY/d9d657af816a140bdaf3f5a7d64e3ef7/KFC-Veg.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 7,
            title: 'CHICKEN BUCKETS',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/2A4wJjZ8ZvCyj7RSxI3iTk/f403b8ceb2f120bf7ef36d5a913ddf6f/KFC-White-Chicken-Bucket.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 8,
            title: 'BURGERS',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/3NdeHBtjjYPHMAoOTpEZ0w/d6c6fadd15bcfa8f6bc969aa02207f0c/KFC-Burger.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 9,
            title: 'RICE BOWLZ',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/7tEmaFwdTOKmVNf724nD21/cb386eac4c508bce817d3daa22a1d3b6/KFC-rice-bowl.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },
        {
            id: 10,
            title: 'BEVERAGE & DESSERTS',
            description: 'Perfect bites for your cravings',
            imageUrl: 'https://images.ctfassets.net/wtodlh47qxpt/1cS5c1DDcmYuwT0g2edC3f/48712d8b753b8cb6c6abd662398fec70/KFC-Beverages.jpg?fm=webp&fit=fill',
            alt: 'Snacks',
            type: 'normal'
        },

    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <HeroSection />

            {/* Menu Categories */}
            <section className="py-12 bg-gray-50 font-oswald">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-oswald mb-12">BROWSE MENU CATEGORIES</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => { navigate("/menu") }}
                                className={`bg-white rounded-lg shadow-md overflow-hidden${category.type === 'special' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'} hover:shadow-lg transition-shadow duration-300`}
                            >
                                <img
                                    src={category.imageUrl}
                                    alt={category.alt}
                                    className="w-full object-cover"
                                />
                                <div className={`p-6 ${category.type === 'special' ? 'text-2xl' : 'text-xl'}`}>
                                    <h3 className={` font-semibold mb-2 ${category.type === 'special' ? 'text-3xl' : 'text-xl'}`}>{category.title}</h3>
                                    <p className="text-gray-600 mb-4">{category.description}</p>
                                    <button className="text-red-600 font-medium hover:text-red-700 transition-colors duration-200">
                                        View All
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;