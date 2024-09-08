import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 h-[50vh] sm:h-[50vh]">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-4 sm:py-2">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">NAŠE BESTSELLERY</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Najnovšie prírastky
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">
              NAKUPUJTE TERAZ
            </p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img
        className="w-full sm:w-1/2 object-cover h-full"
        src={assets.hero_img}
        alt=""
      />
    </div>
  );
};

export default Hero;
