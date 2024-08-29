import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  // Get the total cart amount including all conditions (new and used)
  const cartSubtotal = getCartAmount();

  // Calculate the total cost including the delivery fee
  const totalCost = cartSubtotal + (cartSubtotal > 0 ? delivery_fee : 0);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"KOŠÍK"} text2={"CELKOVO"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Medzisúčet</p>
          <p>
            {currency} {cartSubtotal.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Poplatok za dopravu</p>
          <p>
            {currency} {delivery_fee.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Celkovo</b>
          <b>
            {currency} {totalCost.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
