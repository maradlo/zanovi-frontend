import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [address, setAddress] = useState({
    name: "",
    lastName: "",
    street: "",
    city: "",
    country: "",
    phone: "",
    zip: "",
  });

  const handleEmailChange = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/update-email`,
        { email },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Email updated successfully.");
        setEmail(""); // Reset the email input field
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update email.");
      console.log(error);
    }
  };

  const handlePasswordChange = async () => {
    if (!password || !newPassword) {
      toast.error("Please enter your current and new passwords.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/update-password`,
        { password, newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Password updated successfully.");
        setPassword(""); // Reset the current password input field
        setNewPassword(""); // Reset the new password input field
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update password.");
      console.log(error);
    }
  };

  const handleAddressChange = async () => {
    const { name, lastName, street, city, country, phone, zip } = address;

    if (!name || !lastName || !street || !city || !country || !phone || !zip) {
      toast.error("Please fill out all address fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/update-address`,
        address,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Address updated successfully.");
        setAddress({
          name: "",
          lastName: "",
          street: "",
          city: "",
          country: "",
          phone: "",
          zip: "",
        }); // Reset the address input fields
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update address.");
      console.log(error);
    }
  };

  return (
    <div className="profile-page">
      <h2 className="text-2xl font-bold mb-4">Profil</h2>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nový email
        </label>
        <input
          type="email"
          className="border px-4 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleEmailChange}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
        >
          Zmeniť email
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Aktuálne heslo
        </label>
        <input
          type="password"
          className="border px-4 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nové heslo
        </label>
        <input
          type="password"
          className="border px-4 py-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordChange}
          className="mt-4 py-2 px-4 bg-green-500 text-white rounded-md"
        >
          Zmeniť heslo
        </button>
      </div>

      <h3 className="text-xl font-bold mb-4">Adresa</h3>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Meno
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.name}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Priezvisko
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.lastName}
          onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Ulica
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Mesto
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Krajina
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Telefón
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          PSČ
        </label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
        />
        <button
          onClick={handleAddressChange}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
        >
          Zmeniť adresu
        </button>
      </div>
    </div>
  );
};

export default Profile;
