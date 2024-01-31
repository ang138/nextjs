import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import Link from "next/link";

// Define a type for your token payload
interface TokenPayload {
  id: number;
  email: string;
  role: number;
  exp: number; // Expiration timestamp
  // Add other properties as needed
}

interface ProfileProps {
  initialToken: TokenPayload | null;
}

const Profile = ({ initialToken }: ProfileProps) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(initialToken);

  const handleLogout = () => {
    // Clear the authentication token (JWT) from localStorage
    localStorage.removeItem('token');
    router.push('/product/login');
  };

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

  return (
    <div>
      <h1>User Profile</h1>
      {decodedToken && (
        <div>
          <p>Id: {decodedToken.id}</p>
          <p>Email: {decodedToken.email}</p>
          <p>Role: {decodedToken.role}</p>
        </div>
      )}
      <Link href="/product/cart">
        <button>ตะกร้าสินค้า</button>
      </Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;