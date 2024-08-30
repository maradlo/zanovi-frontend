import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {}
  };

  const statusTranslations = {
    "Order Placed": "Objednávka vytvorená",
    Packing: "Balenie objednávky",
    Shipped: "Odoslaná",
    "Out for delivery": "Na doručenie",
    Delivered: "Doručená",
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  console.log(orderData);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MOJE"} text2={"OBJEDNÁVKY"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {item.price}
                    {currency}
                  </p>
                  <p>Počet: {item.quantity}</p>
                  <p>Stav: {item.condition === "used" ? "Použitý" : "Nový"}</p>
                </div>
                <p className="mt-1">
                  Dátum:{" "}
                  <span className=" text-gray-400">
                    {new Date(item.date).toLocaleDateString("sk-SK", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="mt-1">
                  Platba:{" "}
                  <span className=" text-gray-400">
                    {item.paymentMethod === "COD"
                      ? "Dobierka"
                      : item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">
                  {statusTranslations[item.status] || item.status}
                </p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Sledovať objednávku
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
