import React, { useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const { setCartItems, backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const clearCart = async () => {
      try {
        // Clear cart in frontend
        setCartItems({});
        localStorage.removeItem("cartItems");

        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Show success message
        toast.success("Payment successful! Thank you for your order.");

        // Redirect to orders page after 3 seconds
        const timer = setTimeout(() => {
          navigate("/orders");
        }, 3000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Error processing order completion");
      }
    };

    clearCart();
  }, [navigate, setCartItems]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. You will be redirected to your orders
          shortly...
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
