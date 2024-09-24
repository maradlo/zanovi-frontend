import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, name, price, image, condition }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="block text-gray-700 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden">
        {image && image.length > 0 && <img src={image[0]} alt={name} />}
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">{name}</p>
        <p className="text-xl font-bold mt-2">{price} €</p>
      </div>
    </Link>
  );
};

export default ProductItem;
