import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Zanovi, tu nájdete najnovšie produkty v oblasti elektroniky.
            Ponúkame špičkové značky, najmodernejšie miniaplikácie a
            špecializujeme sa aj na výkup - vymeňte svoje staré zariadenia alebo
            nájdite skvelé ponuky na použitú techniku.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SPOLOČNOSŤ</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Domov</li>
            <li>O nás</li>
            <li>Doručenie</li>
            <li>Zásady ochrany osobných údajov</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SPOJTE SA S NAMI</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+421 902 226 357</li>
            <li>zanovi@zanovi.sk</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2024 Zanovi s.r.o.. Všetky práva vyhradené.
        </p>
      </div>
    </div>
  );
};

export default Footer;
