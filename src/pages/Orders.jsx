import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { token } }
        );
        console.log(response.data.orders);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-10">
      <h2 className="text-2xl font-bold mb-6">Vaše objednávky</h2>
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">
                  Objednávka #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">€{order.amount.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    order.status === "Delivered"
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Condition: {item.condition}
                    </p>
                    <p className="text-sm">
                      {item.quantity} x €{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="font-medium">Shipping Address:</p>
              <p className="text-sm text-gray-600">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-sm text-gray-600">{order.address.street}</p>
              <p className="text-sm text-gray-600">
                {order.address.city}, {order.address.country}{" "}
                {order.address.zipcode}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order.address.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
