import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
        <p className=" font-semibold">Zásady férového výkupu</p>
        <p className=" text-gray-400">
          Ponúkame férový prístup pri vykupovaní produktov
        </p>
      </div>
      <div>
        <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
        <p className=" font-semibold">14 dní na vrátenie tovaru</p>
        <p className=" text-gray-400">
          Poskytujeme politiku bezplatného vrátenia do 14 dní
        </p>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => (window.location = "mailto:zanovi@zanovi.sk")}
      >
        <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
        <p className=" font-semibold">Najlepšia zákaznícka podpora</p>
        <p className=" text-gray-400">
          Kontaktujte nás s čímkoľvek, radi pomôžeme
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;
