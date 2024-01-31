// pages/product/[pid].tsx
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  try {
    const response = await fetch(`http://localhost:8000/auth/profile`);

    if (response.ok) {
      const userProfile = await response.json();

      return {
        props: {
          userProfile,
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

const handleQuantityChange = (productId: number, newQuantity: number) => {};

interface TokenPayload {
  id: number;
  email: string;
  exp: number; // Expiration timestamp
  // Add other properties as needed
}

interface ProfileProps {
  initialToken: TokenPayload | null;
}

const ProfilePage: NextPage<{ userProfile: any }> = ({ userProfile }, { initialToken }: ProfileProps) => {
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

          // Check if router.query.id is not equal to decodedToken.id
          if (router.query.id && decodedToken.id !== Number(router.query.id)) {
            console.error('Mismatch between router.query.id and decodedToken.id');
            router.push('/product/login');
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/product/login');
      }
    }
  }, [router.query.id]); // Use router.query.id as a dependency

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  }

  const user = userProfile;

  const handleLogout = () => {
    // Clear the authentication token (JWT) from localStorage
    localStorage.removeItem('token');
    router.push('/product/login');
  };


  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
