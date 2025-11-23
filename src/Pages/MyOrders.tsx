// src/Pages/MyOrders.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
interface OrderItem {
  itemId: string;
  title: string;
  amount: number;
  quantity: number;
  image?: string;
  category?: string;
  type?: string;
  items?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: string;
}

function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/orders/${user._id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Orders data:', data); // Debug log
          setOrders(data);

        } else {
          const error = await response.json();
          console.error('Error fetching orders:', error.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your orders</h2>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-kfc-red text-white px-6 py-2 rounded-full font-medium hover:bg-kfc-red-dark transition-colors"
            >
              Start Ordering
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kfc-red mx-auto"></div>
            <p className="mt-4">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section>
      <Header></Header>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Your orders will appear here</p>
              <a
                href="/menu"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Start Ordering
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          Order #{order._id.toString().substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-gray-600">{order.deliveryAddress}</p>
                      <p className="text-gray-600">Phone: {order.phoneNumber}</p>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between py-2">
                            <div>
                              <p className="font-medium">{item.title || 'Unnamed Item'}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                              ₹{item.amount ? item.amount.toFixed(2) : '0.00'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
                      <p className="text-lg font-medium">Total</p>
                      <p className="text-xl font-bold">₹{order.total ? order.total.toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MyOrders;