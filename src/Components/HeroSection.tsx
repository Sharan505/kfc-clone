import { useNavigate } from "react-router-dom";
function HeroSection() {
    const navigate = useNavigate();
    return (
        <section className="relative bg-red-600 text-white font-oswald">
            <div className="max-w-7xl flex gap-5 flex-col items-center justify-start mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <img className='w-40' src="https://www.nicepng.com/png/full/873-8731002_about-kfc.png" alt="" />
                <div className="text-center">
                    <p className="text-xl font-bold md:text-4xl">IT'S FINGER LICKIN' GOOD</p>
                </div>
            </div>
            <div className='w-screen bg-zinc-800 py-4 flex justify-center items-center gap-5'>
                <p className="text-white font-bold text-lg">LET'S ORDER FOR DELIVERY, PICK UP, OR DINE-IN</p>
                <button onClick={() => { navigate("/menu") }} className="bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold py-2 px-8 rounded-full text-lg">
                    ORDER NOW
                </button>
            </div>
        </section>
    )
}

export default HeroSection;