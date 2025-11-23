import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, show }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setIsClosing(false);
            // Small delay to allow the initial render before applying transform
            const mountTimer = setTimeout(() => {
                setIsMounted(true);
            }, 10);
            
            const closeTimer = setTimeout(() => {
                handleClose();
            }, 3000);
            
            return () => {
                clearTimeout(mountTimer);
                clearTimeout(closeTimer);
            };
        } else {
            setIsMounted(false);
        }
    }, [show]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsMounted(false);
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`
            fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50
            transition-all duration-300 ease-in-out transform
            ${!isMounted ? 'translate-y-4 opacity-0' : isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}
        `}>
            <span>{message}</span>
            <button 
                onClick={handleClose}
                className="text-white hover:text-gray-200 text-xl"
            >
                &times;
            </button>
        </div>
    );
};

export default Toast;