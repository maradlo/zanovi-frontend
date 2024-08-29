import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, name, price, image, condition }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden">
        {image && image.length > 0 && (
          <img
            className="hover:scale-110 transition ease-in-out"
            src={image[0]}
            alt={name}
          />
        )}
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">{name}</p>
        <p className="text-xl font-bold mt-2">{price} €</p>
      </div>
    </Link>
  );
};

export default ProductItem;
