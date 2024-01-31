// Dropdown.tsx
import React, { useState, ChangeEvent, useEffect } from "react";
import { Image } from "@nextui-org/react";

const Dropdown: React.FC = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/product/type");
        if (response.ok) {
          const data = await response.json();
          setTypes(data);
        } else {
          console.error("Error fetching data from API");
        }
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (selectedOption) {
        try {
          const response = await fetch(
            `http://localhost:8000/product/producttype/${selectedOption}`
          );
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error("Error fetching product data from API");
          }
        } catch (error) {
          console.error("Error fetching product data from API", error);
        }
      }
    };

    fetchProductData();
  }, [selectedOption]);

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown">Select a type:</label>
      <select
        id="dropdown"
        value={selectedOption || ""}
        onChange={handleSelect}
      >
        <option value="" disabled>
          Select a Type
        </option>
        {types.map((type: any) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {selectedOption && (
        <div>
          <p>Selected type ID: {selectedOption}</p>
          {/* Display product data here */}
          <ul>
            {products.map((type: any) => (
              <li key={type.id}>
                {type.name}
                <ul>
                  {type.products.map((product: any) => (
                    <li key={product.id}>
                      <p>Name: {product.name}</p>
                      <p>Detail: {product.detail}</p>
                      <p>Price: {product.price}</p>
                      {/* Display product images */}
                      {product.product_images &&
                        product.product_images.length > 0 && (
                          <div>
                            <h3>Images:</h3>
                            {product.product_images.map((image: any) => (
                              <div key={image.id}>
                                <Image
                                  src={`/assets/images/${image.filename}`}
                                  alt="krapao"
                                  width={200}
                                  height={200}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
