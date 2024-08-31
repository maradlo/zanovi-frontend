import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        {
          email,
        }
      );
      if (response.data.success) {
        toast.success("New password sent to your email");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Zabudnuté heslo</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <p className="prata-regular text-xl">
        Zadajte váš email pre zaslanie nového hesla
      </p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        Odoslať nové heslo
      </button>
    </form>
  );
};

export default ForgotPassword;
