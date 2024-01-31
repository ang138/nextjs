// pages/products/index.tsx
import { useState, useEffect } from "react";
// import { Card, Image } from "@nextui-org/react";
import Dropdown from "./dropdown";
import Link from "next/link";
import Image from "next/image";

// const krapao = './public/krapao.jpg';
const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/product/all");
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
  }, []);

  const addToCart = async (productId: number) => {
    try {
      // Replace '123' with the actual userId
      const userId = "1";

      const response = await fetch(
        `http://localhost:8000/cart/${productId}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
            price,
            status: 1,
            userId,
          }), // Assuming quantity is 1, adjust as needed
        }
      );

      if (response.ok) {
        const cartItems = await response.json();
        setCart(cartItems);
      } else {
        console.error(
          "Error adding product to cart through API. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error adding product to cart through API", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold bg-blue-500">
      Hello world!
    </h1>
      <h1>Products</h1>
      <Link href="/product/signup">
        <button>Register</button>
      </Link>
      <Link href="/product/login">
        <button>Login</button>
      </Link>
      <br />
      <br />
      <Link href="/product/cart">
        <button>ตะกร้าสินค้า</button>
      </Link>
      <hr />
      <Dropdown />
      {products.map((product) => (
        <div key={product.id} className="card">
          <h2>{product.name}</h2>
          <p>Description: {product.detail}</p>
          <form>
            <label>
              Price:
              <input
                type="number"
                value={product.price}
                onChange={(e) => setPrice(e.target.value)}
              readOnly/>
            </label>
          </form>

          {/* <p>Price: {product.price}</p> */}
          {product.product_images && product.product_images.length > 0 && (
            <div>
              <h3>Images:</h3>
              {product.product_images.map((image: any) => (
                <div key={image.id}>
                  {/* <p>Original Name: {image.filename}</p>
                  <p>Path: {image.filename}</p> */}
                  <Image src={`/assets/images/${image.filename}`} alt="krapao" width={200} height={200} />
                  {/* <Image src={image.path} alt="krapao" width={200} height={200} /> */}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
