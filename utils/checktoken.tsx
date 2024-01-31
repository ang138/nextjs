import { jwtDecode } from "jwt-decode";
import router, { useRouter } from "next/router";
import { useState } from "react";

interface TokenPayload {
    id: number;
    email: string;
    exp: number; // Expiration timestamp
    // Add other properties as needed
  }
  
  interface ProfileProps {
    initialToken: TokenPayload | null;
  }

// utils/auth.js
export const checkToken = ({ initialToken }: ProfileProps) => {
    const router = useRouter();
    const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(initialToken);

    
    const token = localStorage.getItem('token');
    

    if (!token) {
    //   router.push('/product/login');
      return null;
    } else {
      try {
        const decodedToken = jwtDecode(token) as TokenPayload;

        // Check if the token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTimestamp) {
          console.error('Token has expired');
          localStorage.removeItem('token');
          router.push('/product/login');
          return null;
        } else {
          setDecodedToken(decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/product/login');
        return null;
      }
    }
}