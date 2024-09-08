import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Buyback = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    estimatedPrice: 0,
    productClass: "S+",
  });
  const [addedProducts, setAddedProducts] = useState([]);

  const classOptions = [
    { label: "S+", multiplier: 0.6 },
    { label: "A", multiplier: 0.5 },
    { label: "B", multiplier: 0.4 },
    { label: "C", multiplier: 0.3 },
    { label: "D", multiplier: 0.2 },
  ];

  useEffect(() => {
    // Fetch all products on component mount
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        setProducts(response.data.products || []);

        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Set(response.data.products.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Chyba pri načítávaní produktov:", error);
        toast.error("Nepodarilo sa načítať produkty");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Filter products based on selected category
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleProductNameChange = (value) => {
    setNewProduct({ ...newProduct, name: value });

    if (value.trim() !== "") {
      // Filter products based on the name input
      const filtered = products.filter(
        (product) =>
          product.category === selectedCategory &&
          product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      // Show all products if input is empty
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductSelect = (product) => {
    const classMultiplier =
      classOptions.find((cls) => cls.label.startsWith(newProduct.productClass))
        ?.multiplier || 0.6;

    const priceToUse =
      product.warehouse.price.used > 0
        ? product.warehouse.price.used
        : product.warehouse.price.new;
    const estimatedPrice = priceToUse * classMultiplier;

    setNewProduct({
      ...newProduct,
      name: product.name,
      estimatedPrice: estimatedPrice.toFixed(2),
    });
  };

  const handleClassChange = (e) => {
    setNewProduct({ ...newProduct, productClass: e.target.value });
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.category) {
      setAddedProducts([...addedProducts, newProduct]);
      setNewProduct({
        name: "",
        category: selectedCategory,
        estimatedPrice: 0,
        productClass: "S+",
      });
      toast.success("Produkt bol pridaný do výkupu");
    } else {
      toast.error("Prosím vyplňte všetky polia výkupu");
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = addedProducts.filter((_, i) => i !== index);
    setAddedProducts(updatedProducts);
  };

  const calculateTotalPrice = () => {
    return addedProducts
      .reduce((total, product) => total + parseFloat(product.estimatedPrice), 0)
      .toFixed(2);
  };

  return (
    <div className="buyback">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"Výkup"} text2={"Elektroniky a Hier"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <div className="md:w-3/4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>Kategória</label>
            <select
              value={newProduct.category}
              onChange={(e) => {
                setNewProduct({ ...newProduct, category: e.target.value });
                setSelectedCategory(e.target.value);
              }}
              className="border px-4 py-2"
            >
              <option value="">Vyberte kategóriu</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Display additional inputs and product list only after category is selected */}
          {selectedCategory && (
            <>
              <div className="flex flex-col gap-2">
                <label>Názov produktu</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => handleProductNameChange(e.target.value)}
                  className="border px-4 py-2"
                />
              </div>

              {/* Class selection for Mobily */}
              {selectedCategory.toLowerCase() === "mobily" && (
                <div className="flex flex-col gap-2">
                  <label>Trieda</label>
                  <select
                    value={newProduct.productClass}
                    onChange={handleClassChange}
                    className="border px-4 py-2"
                  >
                    {classOptions.map((cls) => (
                      <option key={cls.label} value={cls.label}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product.image.length > 0 ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-200 mb-2">
                        Žiadna fotka
                      </div>
                    )}
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Odhadovaná cena:{" "}
                      {(
                        (product.warehouse.price.used > 0
                          ? product.warehouse.price.used
                          : product.warehouse.price.new) *
                        (classOptions.find((cls) =>
                          cls.label.startsWith(newProduct.productClass)
                        )?.multiplier || 0.6)
                      ).toFixed(2)}{" "}
                      €
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={addProduct}
                  className="py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                  Pridať produkt do výkupu
                </button>
              </div>

              {/* Display added products below the button */}
              <div className="mt-4">
                {addedProducts.length > 0 && (
                  <>
                    <ul className="list-disc ml-5">
                      {addedProducts.map((product, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {product.name} - {product.estimatedPrice} €
                          </span>
                          <button
                            onClick={() => removeProduct(index)}
                            className="ml-2 text-red-500"
                          >
                            Odstrániť
                          </button>
                        </li>
                      ))}
                    </ul>
                    {/* Display total price */}
                    <div className="mt-4 font-bold">
                      Celková cena: {calculateTotalPrice()} €
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Explanation text for classes */}
          {selectedCategory.toLowerCase() === "mobily" && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Triedy pre Mobily:</p>
              <ul className="list-disc ml-5 text-sm text-gray-600">
                <li>
                  <b>S+</b>: Čisto nový, nepoužitý produkt v originál balení s
                  fóliou.
                </li>
                <li>
                  <b>A</b>: Produkt bez akýchkoľvek známok používania, v 100%
                  stave, plne funkčný.
                </li>
                <li>
                  <b>B</b>: Používaný produkt bez akýchkoľvek známok používania,
                  plne funkčný.
                </li>
                <li>
                  <b>C</b>: Produkt s viditeľnými známkami používania, no plne
                  funkčný.
                </li>
                <li>
                  <b>D</b>: Produkt mechanicky poškodený alebo nefunkčný.
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="md:w-1/4">
          <img className="w-full" src={assets.zanovi_buyback} alt="Buyback" />
        </div>
      </div>

      {/* Informative text */}
      <div className="text-sm text-gray-600 mt-10">
        <p>
          Tento odhad ceny je iba informatívny. Finálna cena bude stanovená
          technikom v našej predajni.
        </p>
      </div>
    </div>
  );
};

export default Buyback;
