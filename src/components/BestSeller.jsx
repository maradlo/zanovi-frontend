import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"NAJPREDÁVANEJŠIE"} text2={"PRODUKTY"} />
        <p className="w-3/4 m-auto text-md sm:text-md text-gray-600">
          Objavte našu najpredávanejšiu elektroniku
        </p>
        <p className="w-3/4 m-auto mt-4 text-xs sm:text-sm md:text-base text-gray-600">
          Preskúmajte najžiadanejšiu elektroniku, o ktorej naši zákazníci
          básnia. Od najnovších smartfónov a herných konzol až po výkonné
          notebooky a nevyhnutné príslušenstvo - naše bestsellery predstavujú
          špičkovú elektroniku, ktorá je lídrom na trhu. Ide o gadgety, ktoré v
          sebe spájajú inovácie, kvalitu a hodnotu, vďaka čomu sú najlepším
          výberom pre technologických nadšencov.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={
              item.warehouse.price.used
                ? item.warehouse.price.used
                : item.warehouse.price.new
            }
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
