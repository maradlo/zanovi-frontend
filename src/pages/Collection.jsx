import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Extract categories and subcategories from products
  const extractCategories = () => {
    const categorySet = new Set();
    const subCategorySet = new Set();

    products.forEach((product) => {
      categorySet.add(product.category);
      if (product.subCategory) {
        subCategorySet.add(product.subCategory);
      }
    });

    setCategories(Array.from(categorySet));
    setSubCategories(Array.from(subCategorySet));
  };

  const toggleCategory = (e) => {
    if (selectedCategories.includes(e.target.value)) {
      setSelectedCategories((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSelectedCategories((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (selectedSubCategories.includes(e.target.value)) {
      setSelectedSubCategories((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSelectedSubCategories((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.map((product) => {
      const { warehouse, ...restProduct } = product;

      let price = 0;
      let condition = "";

      if (warehouse) {
        // Prioritize used price if available, otherwise take the new price
        if (warehouse.price.used > 0) {
          price = warehouse.price.used;
          condition = "used";
        } else if (warehouse.price.new > 0) {
          price = warehouse.price.new;
          condition = "new";
        }
      }

      return {
        ...restProduct,
        price,
        condition,
      };
    });

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (selectedSubCategories.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        selectedSubCategories.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    extractCategories();
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [selectedCategories, selectedSubCategories, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">KATEGÓRIE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories.map((category, index) => (
              <p className="flex gap-2" key={index}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={category}
                  onChange={toggleCategory}
                />{" "}
                {category}
              </p>
            ))}
          </div>
        </div>
        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">PODKATEGÓRIE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {subCategories.map((subCategory, index) => (
              <p className="flex gap-2" key={index}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={subCategory}
                  onChange={toggleSubCategory}
                />{" "}
                {subCategory}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"VŠETKY"} text2={"PRODUKTY"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Zoradiť podľa: Odporúčané</option>
            <option value="low-high">
              Zoradiť podľa ceny: Od najlacnejšieho
            </option>
            <option value="high-low">
              Zoradiť podľa ceny: Od najdrahšieho
            </option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              condition={item.condition} // Pass the condition as well
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
