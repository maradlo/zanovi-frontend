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
    state: "",
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
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const productId in cartItems) {
        for (const condition in cartItems[productId]) {
          if (
            cartItems[productId][condition] &&
            cartItems[productId][condition].quantity > 0
          ) {
            const product = products.find(
              (product) => product._id === productId
            );
            if (product) {
              const itemInfo = structuredClone(product);
              itemInfo.condition = condition;
              itemInfo.price =
                condition === "new"
                  ? product.warehouse.price.new
                  : product.warehouse.price.used;
              itemInfo.quantity = cartItems[productId][condition].quantity;
              if (!itemInfo.image || itemInfo.image.length === 0) {
                delete itemInfo.image;
              }
              orderItems.push(itemInfo);
            }
          }
        }
      }

      console.log("Cart Items:", cartItems);
      console.log("Order Items:", orderItems);

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          try {
            const responseStripe = await axios.post(
              `${backendUrl}/api/order/stripe`,
              orderData,
              {
                headers: {
                  token,
                  "Content-Type": "application/json",
                  origin: window.location.origin,
                },
              }
            );
            console.log("Stripe Response:", responseStripe.data);
            if (responseStripe.data.success) {
              const { session_url } = responseStripe.data;
              window.location.replace(session_url);
              toast.success(responseStripe.data.message);
            } else {
              toast.error(
                responseStripe.data.message || "Payment processing failed"
              );
            }
          } catch (error) {
            console.error("Stripe Error:", error.response?.data || error);
            toast.error(error.response?.data?.message || error.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- Left Side ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
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
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Štáť"
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
