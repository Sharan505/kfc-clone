import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import { AuthProvider } from './Contexts/AuthContext';
import { CartProvider } from './Contexts/CartContext';
import MyOrders from "./Pages/MyOrders"
import Checkout from './Pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;