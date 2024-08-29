import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Reservations = () => {
  const [formData, setFormData] = useState({
    dateTime: "",
    duration: "",
    persons: 1,
    console: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/reservations/add",
        formData
      );
      if (response.data.success) {
        toast.success("Rezervácia bola úspešne odoslaná!");
        setFormData({
          dateTime: "",
          duration: "",
          persons: 1,
          console: "",
          notes: "",
        });
      } else {
        toast.error("Nepodarilo sa odoslať rezerváciu.");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast.error("Chyba pri odosielaní rezervácie.");
    }
  };

  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"REZERVÁCIA"} text2={"KONZOL"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.hero_img}
          alt="Zanovi Gaming"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Vytvorte si rezerváciu na hranie vašej obľúbenej konzolovej hry v
            našom hernom centre. Vyplňte formulár nižšie a my sa postaráme o
            všetko ostatné.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2">Dátum a čas:</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-gray-300 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Trvanie (v hodinách):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-gray-300 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Počet osôb:</label>
              <input
                type="number"
                name="persons"
                value={formData.persons}
                onChange={handleInputChange}
                required
                min="1"
                className="px-3 py-2 border border-gray-300 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Vyberte konzolu:</label>
              <select
                name="console"
                value={formData.console}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-gray-300 w-full"
              >
                <option value="" disabled>
                  Vyberte konzolu
                </option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="Xbox Series X">Xbox Series X</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                {/* Add more console options as needed */}
              </select>
            </div>
            <div>
              <label className="block mb-2">Špeciálne ožiadavky:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 w-full"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Odoslať rezerváciu
            </button>
          </form>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"PREČO"} text2={"SI NÁS VYBRAŤ"} />
      </div>

      <div className="flex justify-center flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Zabezpečenie kvality:</b>
          <p className=" text-gray-600">
            Naše konzoly sú pravidelne kontrolované a udržiavané, aby vám
            poskytli najlepší herný zážitok.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Pohodlie:</b>
          <p className=" text-gray-600">
            Rezervujte si čas hrania v našom pohodlnom a priestrannom hernom
            centre.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
