// pages/product/[pid].tsx cart
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;
  const userId = params?.uid;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8000/cart/showcart/${userId}`,{
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const userCart = await response.json();

      return {
        props: {
          userCart,
        },
      };
    } else {
      console.error("Error fetching data from API");
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching data from API", error);

    return {
      notFound: true,
    };
  }
};

const handleQuantityChange = (productId: number, newQuantity: number) => {
  
};

interface TokenPayload {
  id: number;
  email: string;
  exp: number; // Expiration timestamp
  // Add other properties as needed
}

interface ProfileProps {
  initialToken: TokenPayload | null;
}


const UserCartPage: NextPage<{ userCart: any }> = ({ userCart }, { initialToken }: ProfileProps) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(initialToken);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/product/login');
    } else {
      try {
        const decodedToken = jwtDecode(token) as TokenPayload;

        // Check if the token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTimestamp) {
          console.error('Token has expired');
          localStorage.removeItem('token');
          router.push('/product/login');
        } else {
          setDecodedToken(decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/product/login');
      }
    }
  }, []);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!userCart || userCart.length === 0) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      {userCart.map((cartItem: any) => (
        <div key={cartItem.productId}>
          <p>Product ID: {cartItem.productId}</p>
          <p>Quantity: {cartItem.quantity}</p>
          <p>Price: {cartItem.price}</p>
          <p>Quantity: {cartItem.quantity}</p>
          <p>
            <button onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1)}>
              ลด
            </button>
            <button onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}>
              เพิ่ม
            </button>
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default UserCartPage;
