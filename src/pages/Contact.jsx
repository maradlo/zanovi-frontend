import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"KONTAKTUJE"} text2={"NÁS"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">ZANOVI</p>
          <p className=" text-gray-500">
            Nitra, <br /> Promenáda, SK
          </p>
          <p
            onClick={() => (window.location = "tel:+421902226357")}
            className="text-gray-500 cursor-pointer"
          >
            Tel: +421 902 226 357
          </p>
          <p
            onClick={() => (window.location = "mailto:zanovi@zanovi.sk")}
            className="text-gray-500 cursor-pointer"
          >
            Email: zanovi@zanovi.sk
          </p>
          {/* <p className="font-semibold text-xl text-gray-600">
            Kariéra v Zanovi
          </p>
          <p className=" text-gray-500">
            Získajte viac informácií o našich tímoch a voľných pracovných
            miestach.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Preskúmať pracovné miesta
          </button> */}
        </div>
      </div>

      {/* <NewsletterBox /> */}
    </div>
  );
};

export default Contact;
