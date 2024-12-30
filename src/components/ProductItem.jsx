import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const ProductItem = ({
  id,
  name,
  price,
  image,
  condition,
  category,
  subcategory,
  subcategory2,
}) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer group"
      to={`/product/${id}`}
    >
      <div className="relative w-[210px] h-[210px] mx-auto overflow-hidden">
        <img
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          src={image[0] || assets.default_image}
          alt={name}
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-base font-bold mt-1">{price} €</p>
        <p>Kategória: {category}</p>
        <p>Podkategória: {subcategory}</p>
        {subcategory2 && <p>Model: {subcategory2}</p>}
      </div>
    </Link>
  );
};

export default ProductItem;
