import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "€";
  const delivery_fee = 4.99;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Load cart data from localStorage on app initialization
  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }

    // Check for token in localStorage
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, condition) => {
    if (!condition) {
      toast.error("Vyberte stav produktu");
      return;
    }

    let cartData = structuredClone(cartItems);

    const product = products.find((product) => product._id === itemId);

    if (!product) {
      toast.error("Produkt neexistuje");
      return;
    }

    // Determine the price based on the selected condition
    const price =
      condition === "new"
        ? product.warehouse.price.new
        : product.warehouse.price.used;

    if (cartData[itemId]) {
      if (cartData[itemId][condition]) {
        cartData[itemId][condition].quantity += 1;
      } else {
        cartData[itemId][condition] = { quantity: 1, price };
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][condition] = { quantity: 1, price };
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, condition },
          { headers: { token } }
        );

        toast.success("Produkt bol pridaný do košíka");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item].quantity > 0) {
            totalCount += cartItems[items][item].quantity;
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, condition, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      const confirmed = window.confirm(
        "Naozaj chcete odstrániť tento produkt z košíka?"
      );
      if (!confirmed) {
        return; // Exit the function if the user cancels the action
      }
      delete cartData[itemId][condition];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][condition].quantity = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, condition, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      for (const condition in cartItems[items]) {
        try {
          const item = cartItems[items][condition];
          if (item.quantity > 0) {
            totalAmount += item.price * item.quantity;
          }
        } catch (error) {
          console.log("Error calculating cart amount", error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      console.log("response cart", response.data.cartData);
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
