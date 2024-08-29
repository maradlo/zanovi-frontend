import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Buyback = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]); // Initialize products state
  const [conditionOptions, setConditionOptions] = useState([
    { value: "new", label: "Nové" },
    { value: "used", label: "Použité" },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    productClass: "",
    condition: "used",
    estimatedPrice: 0,
  });

  const classOptions = [
    { value: "A", label: "Trieda A (brand new)", percentage: 0.6 },
    { value: "B", label: "Trieda B (used without issues)", percentage: 0.5 },
    { value: "C", label: "Trieda C (scratches etc.)", percentage: 0.35 },
  ];

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        setCategories(response.data.categories || []); // Ensure categories is always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory.toLowerCase() === "mobily") {
      setConditionOptions(classOptions); // Set condition options to class options for "Mobily"
      setNewProduct({ ...newProduct, productClass: "", condition: "" }); // Reset class and condition
    } else {
      setConditionOptions([
        { value: "new", label: "Nové" },
        { value: "used", label: "Použité" },
      ]);
      setNewProduct({ ...newProduct, productClass: "", condition: "used" }); // Reset class and set default condition for non-Mobily categories
    }
  }, [selectedCategory]);

  const handleProductNameChange = async (value) => {
    setNewProduct({ ...newProduct, name: value });

    try {
      const response = await axios.get(
        `${backendUrl}/api/product/search?query=${value}`
      );
      setFilteredProducts(response.data.products || []); // Ensure filteredProducts is always an array
    } catch (error) {
      if (value.length === 0) {
        return;
      }
      console.error("Error fetching product suggestions:", error);
      toast.error("Failed to fetch product suggestions");
    }
  };

  const handleProductSelect = async (value) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.name === value
    );
    if (
      selectedProduct &&
      selectedProduct.warehouse &&
      selectedProduct.warehouse.price
    ) {
      let estimatedPrice = 0;

      if (selectedCategory.toLowerCase() === "mobily") {
        const classPercentage =
          classOptions.find((cls) => cls.value === newProduct.productClass)
            ?.percentage || 0.6; // Default to 60% if class not found
        estimatedPrice = selectedProduct.warehouse.price.new * classPercentage;
      } else {
        if (newProduct.condition === "new") {
          estimatedPrice = selectedProduct.warehouse.price.new * 0.8; // 80% of the new price
        } else {
          estimatedPrice = selectedProduct.warehouse.price.used * 0.6; // 60% of the used price
        }
      }

      setNewProduct({
        ...newProduct,
        name: selectedProduct.name,
        estimatedPrice: estimatedPrice.toFixed(2), // Round to 2 decimal places
      });
    } else {
      setNewProduct({ ...newProduct, name: value, estimatedPrice: 0 });
    }
  };

  const handleConditionChange = (e) => {
    const conditionValue = e.target.value;
    setNewProduct({ ...newProduct, condition: conditionValue });
    handleProductSelect(newProduct.name); // Recalculate price when condition changes
  };

  const handleClassChange = (e) => {
    const classValue = e.target.value;
    setNewProduct({ ...newProduct, productClass: classValue });
    handleProductSelect(newProduct.name); // Recalculate price when class changes
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.category) {
      setProducts([...products, newProduct]);
      setNewProduct({
        name: "",
        category: "",
        productClass: "",
        condition: "used",
        estimatedPrice: 0,
      });
      setFilteredProducts([]);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const calculateFinalPrice = () => {
    return products.reduce(
      (total, product) => total + parseFloat(product.estimatedPrice),
      0
    );
  };

  const handleBuybackSubmit = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/buyback`, {
        products,
      });
      if (response.data.success) {
        toast.success(
          "Your buyback request has been submitted. The price may vary based on technician inspection."
        );
        setProducts([]); // Clear the products list after submission
      } else {
        toast.error("Failed to submit buyback request.");
      }
    } catch (error) {
      console.error("Error submitting buyback:", error);
      toast.error("Error submitting buyback request.");
    }
  };

  return (
    <div className="buyback">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"Odkúpenie"} text2={"Techniky"} />
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
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory.toLowerCase() === "mobily" && (
            <div className="flex flex-col gap-2">
              <label>Třída</label>
              <select
                value={newProduct.productClass}
                onChange={handleClassChange} // Handle class change
                className="border px-4 py-2"
              >
                <option value="">Vyberte třídu</option>
                {classOptions.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label>Názov produktu</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => handleProductNameChange(e.target.value)}
              onBlur={(e) => handleProductSelect(e.target.value)} // Fetch price on product selection
              className="border px-4 py-2"
              list="productSuggestions"
            />
            <datalist id="productSuggestions">
              {filteredProducts
                .filter((product) =>
                  selectedCategory === "Mobily"
                    ? product.category === "Mobily"
                    : product.category !== "Mobily"
                )
                .map((product) => (
                  <option key={product._id} value={product.name}>
                    {product.name}
                  </option>
                ))}
            </datalist>
          </div>

          {selectedCategory}
          {selectedCategory !== "Mobily" && (
            <div className="flex flex-col gap-2">
              <label>Stav</label>
              <select
                value={newProduct.condition}
                onChange={handleConditionChange} // Handle condition change
                className="border px-4 py-2"
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label>Odhadovaná cena (€)</label>
            <input
              type="number"
              value={newProduct.estimatedPrice}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  estimatedPrice: parseFloat(e.target.value),
                })
              }
              className="border px-4 py-2"
            />
          </div>
          <button
            onClick={addProduct}
            className="py-2 px-4 bg-blue-500 text-white rounded-md"
          >
            Pridať produkt
          </button>
        </div>
        <div className="md:w-1/4">
          <img className="w-full" src={assets.zanovi_buyback} alt="Buyback" />
        </div>
      </div>

      <div className="my-10">
        <Title text1={"Vaša"} text2={"Ponuka"} />
        {products.length === 0 ? (
          <p>Nemáte pridané žiadne produkty.</p>
        ) : (
          <ul className="list-disc ml-5">
            {products.map((product, index) => (
              <li key={index}>
                {product.name} - {product.category}{" "}
                {product.productClass && `(${product.productClass})`} -{" "}
                {product.condition === "new" ? "Nové" : "Použité"} -{" "}
                {product.estimatedPrice}€
                <button
                  onClick={() => removeProduct(index)}
                  className="ml-2 text-red-500"
                >
                  Odstrániť
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 font-bold">
          Celková odhadovaná cena: {calculateFinalPrice()}€
        </p>
        <p className="mt-2 text-gray-600">
          Táto cena je len orientačná a môže sa líšiť na základe kontroly
          technikom. Ak máte záujem o odkúpenie, navštívte našu predajňu.
          Odkúpenie cez kuriéra bude dostupné čoskoro.
        </p>
      </div>
    </div>
  );
};

export default Buyback;
