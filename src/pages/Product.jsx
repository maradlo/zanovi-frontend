import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown for Markdown rendering
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (optional)

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("used");

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);

      // Set default condition selection based on availability
      if (product.warehouse) {
        if (product.warehouse.price.used > 0) {
          setSelectedCondition("used");
        } else if (product.warehouse.price.new > 0) {
          setSelectedCondition("new");
        } else {
          setSelectedCondition(""); // No available product
        }
      }
    } else {
      setProductData(null);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(productData._id, selectedCondition);
  };

  return productData && selectedCondition ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image &&
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto"
              src={image || assets.default_image}
              alt=""
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {selectedCondition === "new"
              ? productData.warehouse.price.new
              : productData.warehouse.price.used}
            {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <div className="flex gap-2">
              {productData.warehouse.price.used > 0 && (
                <button
                  className={`border py-2 px-4 bg-gray-100 ${
                    selectedCondition === "used" ? "border-orange-500" : ""
                  }`}
                  onClick={() => setSelectedCondition("used")}
                >
                  Použitý
                </button>
              )}
              {productData.warehouse.price.new > 0 && (
                <button
                  className={`border py-2 px-4 bg-gray-100 ${
                    selectedCondition === "new" ? "border-orange-500" : ""
                  }`}
                  onClick={() => setSelectedCondition("new")}
                >
                  Nový
                </button>
              )}
            </div>
          </div>
          <div className="mt-5">
            <p className="font-bold">Dostupnosť:</p>
            {selectedCondition === "used" && (
              <p>
                Použité - Na predajni:{" "}
                {productData.warehouse.quantityInStore.used} ks, V sklade:{" "}
                {productData.warehouse.quantityInStock.used} ks
              </p>
            )}
            {selectedCondition === "new" && (
              <p>
                Nové - Na predajni: {productData.warehouse.quantityInStore.new}{" "}
                ks, V sklade: {productData.warehouse.quantityInStock.new} ks
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-5"
          >
            PRIDAŤ DO KOŠÍKA
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% originálny výrobok.</p>
            <p>Tento produkt je k dispozícii na dobierku.</p>
            <p>Jednoduché vrátenie a výmena tovaru do 14 dní.</p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Popis produktu</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {productData.description2 ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {productData.description2}
            </ReactMarkdown>
          ) : (
            <p>Ďalší popis nie je k dispozícii</p>
          )}
        </div>
      </div>
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="text-center py-20">
      <h2>Product not found or unavailable</h2>
    </div>
  );
};

export default Product;
