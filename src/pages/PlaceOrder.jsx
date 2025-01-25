import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    // Add this to initialize form with saved email
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate cart items
    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create order items array from cart items
      const orderItems = [];
      for (const [productId, conditions] of Object.entries(cartItems)) {
        const product = products.find((p) => p._id === productId);
        if (product) {
          for (const [condition, details] of Object.entries(conditions)) {
            orderItems.push({
              _id: productId,
              name: product.name,
              condition: condition,
              price: details.price,
              quantity: details.quantity,
              image: product.image,
            });
          }
        }
      }

      // Calculate total amount including delivery fee
      const totalAmount = getCartAmount() + delivery_fee;

      // Create order data
      const orderData = {
        userId: token,
        items: orderItems,
        amount: totalAmount,
        address: formData,
        paymentMethod: method,
      };

      if (method === "cod") {
        // Handle COD payment
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems({});
          localStorage.removeItem("cartItems");
          toast.success("Order placed successfully");
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      } else if (method === "stripe") {
        // Create order first
        const orderResponse = await axios.post(
          `${backendUrl}/api/order/place`,
          { ...orderData, paymentMethod: "Stripe" },
          { headers: { token } }
        );

        if (orderResponse.data.success) {
          // Then initialize Stripe payment with the order ID
          await handleStripePayment(orderResponse.data.orderId);
        } else {
          toast.error(orderResponse.data.message);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  const stripeSecretKey =
    import.meta.env.VITE_NODE_ENV === "production"
      ? import.meta.env.VITE_STRIPE_LIVE_SECRET_KEY
      : import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;

  // Add function to fetch and use saved address
  const useSavedAddress = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/address`, {
        headers: { token },
      });

      if (response.data.success && response.data.address) {
        const savedAddress = response.data.address;
        setFormData({
          ...formData,
          firstName: savedAddress.name,
          lastName: savedAddress.lastName,
          street: savedAddress.street,
          city: savedAddress.city,
          country: savedAddress.country,
          phone: savedAddress.phone,
          zipcode: savedAddress.zip,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch saved address");
      console.error("Failed to fetch address:", error);
    }
  };

  const handleStripePayment = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/stripe`,
        {
          orderId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/cart`,
        },
        {
          headers: {
            token,
            Authorization: `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        window.location.href = response.data.url;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to initialize Stripe payment");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- Left Side ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <button
          type="button"
          onClick={useSavedAddress}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mb-4"
        >
          Použiť uloženú adresu
        </button>
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="ADRESA" text2="DUREČENIA" />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Meno"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Priezvisko"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Ulica"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Mesto"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Poštové smerovacie číslo"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Krajina"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Telefónne číslo"
        />
      </div>

      {/* ------------- Right Side ------------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="SPÔSOB" text2="PLATBY" />
          {/* --------------- Payment Method Selection ------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">DOBIERKA</p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              OBJEDNAŤ
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
