import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const condition in cartItems[itemId]) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            tempData.push({
              _id: itemId,
              condition,
              quantity: cartItems[itemId][condition].quantity,
              price: cartItems[itemId][condition].price,
              name: product.name,
              image: product.image[0], // Assuming you want the first image
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handlePlaceOrder = () => {
    // Check if cartItems has at least one valid item
    const hasItems = Object.values(cartItems).some((conditions) =>
      Object.values(conditions).some((item) => item.quantity > 0)
    );

    if (hasItems) {
      navigate("/place-order");
    } else {
      toast.error("Košík je prázdny");
    }
  };

  return (
    <div className="border-t pt-14">
      <div className=" text-2xl mb-3">
        <Title text1={"VÁŠ"} text2={"KOŠÍK"} />
      </div>

      <div>
        {cartData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
          >
            <div className=" flex items-start gap-6">
              {item.image ? (
                <img
                  className="w-16 sm:w-20"
                  src={item.image}
                  alt={item.name}
                />
              ) : (
                <p>Fotka nie je k dispozícií</p>
              )}
              <div>
                <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                    {item.condition === "new" ? "Nové" : "Použité"}
                  </p>
                </div>
              </div>
            </div>
            <input
              onChange={(e) =>
                e.target.value === "" || e.target.value === "0"
                  ? null
                  : updateQuantity(
                      item._id,
                      item.condition,
                      Number(e.target.value)
                    )
              }
              className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              type="number"
              min={1}
              defaultValue={item.quantity}
            />
            <img
              onClick={() => updateQuantity(item._id, item.condition, 0)}
              className="w-4 mr-4 sm:w-5 cursor-pointer"
              src={assets.bin_icon}
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className=" w-full text-end">
            <button
              onClick={() => handlePlaceOrder()}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PREJSŤ K POKLADNI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
