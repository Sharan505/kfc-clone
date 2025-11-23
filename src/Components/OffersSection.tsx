import { useState } from 'react';
import type { Offers } from "../Pages/Menu";

interface OffersSectionProps {
    offers: Offers[];
}

const OfferModal = ({ offer, onClose }: { offer: Offers | null, onClose: () => void }) => {
    if (!offer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-64 pt-8 object-scale-down"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=Offer+Image';
                        }}
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full py-2 px-3 hover:bg-opacity-70 transition-colors"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
                    <p className="text-gray-700 mb-6 font-sans">{offer.desc}</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6 font-sans">
                        <p className="text-sm font-medium text-gray-500 mb-2">Valid till: {new Date(offer.valid_till).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}</p>
                        <p className="text-sm text-gray-500">Please review the conditions below</p>
                    </div>

                    <div className="space-y-4 font-sans">
                        <h3 className="font-semibold text-lg">Terms & Conditions</h3>
                        <ul className="space-y-2">
                            {offer.terms.map((term, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-red-600 mr-2 mt-1">•</span>
                                    <span className="text-gray-700">{term}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
    const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);

    if (!offers || offers.length === 0) {
        return <div className="text-center py-8 text-gray-500">No offers available at the moment.</div>;
    }

    const offersSection = (
        <div className="space-y-8 mb-12" id='deals'>
            <div className="mb-8">
                <h2 className="text-4xl font-bold mb-2">DEALS & OFFERS</h2>
                <div className="h-1 w-20 bg-red-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div
                        key={offer._id}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="relative">
                            <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Offer+Image';
                                }}
                            />
                            <div className="p-4 flex flex-col justify-end">
                                <h3 className="text-xl text-center font-bold">{offer.title}</h3>
                                <p className="text-sm text-center mt-4 font-sans">{offer.desc}</p>
                                <button
                                    onClick={() => setSelectedOffer(offer)}
                                    className="mt-4 px-6 py-2 font-sans underline text-gray-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            {selectedOffer && (
                <OfferModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                />
            )}
            {offersSection}
        </>
    );
};

export default OffersSection;