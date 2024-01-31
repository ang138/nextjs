// pages/products/index.tsx cart
import { jwtDecode } from "jwt-decode";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import React from "react";

const CartPage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    
      const token = localStorage.getItem('token');
  
      if (!token) {
        router.push('/product/login');
      } else {
        const fetchData = async () => {
          try {
            const response = await fetch("http://localhost:8000/cart/showcart");
            if (response.ok) {
              const data = await response.json();
              setProducts(data);
            } else {
              console.error(
                "Error fetching data from API. Status:",
                response.status
              );
            }
          } catch (error) {
            console.error("Error fetching data from API", error);
          }
        };
    
        fetchData();
      }
    }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, amount: newQuantity } : product
      )
    );
  };

  return (
    <div>
      <h1>Cart</h1>
      {products.map((product) => (
        <div key={product.id} className="card">
          <p>productId: {product.productId}</p>
          <p>quantity: {product.quantity}</p>
          <p>Price: {product.price}</p>
          <p>
            Quantity: {product.amount}
            {/* Button to decrease quantity */}
            <button onClick={() => handleQuantityChange(product.id, product.amount - 1)}>
              Decrease
            </button>
            {/* Button to increase quantity */}
            <button onClick={() => handleQuantityChange(product.id, product.amount + 1)}>
              Increase
            </button>
          </p>
          {/* ... (other product details) */}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default CartPage;
