import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  role: number;
  exp: number;
}

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  role?: number;
}

const UserProfilePage: NextPage<{ userProfile: UserProfile }> = ({ userProfile }) => {
  const router = useRouter();
  const [payloadData, setPayloadData] = useState<JwtPayload | null>(null);
  const [userProfileData, setUserProfile] = useState<UserProfile | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      let decodedToken: JwtPayload | null = null;

      if (!token) {
        router.push('/product/login');
        return;
      }

      try {
        decodedToken = jwtDecode(token) as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTimestamp) {
          console.error('Token has expired');
          localStorage.removeItem('token');
          router.push('/product/login');
          return;
        }

        setPayloadData(decodedToken);

        if (router.query.id && decodedToken.id !== Number(router.query.id)) {
          console.error('Mismatch between router.query.id and decodedToken.id');
          router.push('/product/login');
          return;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/product/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/auth/${decodedToken.id}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userProfileData = await response.json();
          console.log('User Profile Response:', userProfileData);

          setUserProfile(userProfileData);
        } else {
          const errorData = await response.json();
          console.error('Error fetching user profile:', errorData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchData();
  }, [router.query.id]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!userProfileData) {
    return <div>User not found</div>;
  }

  const user = userProfileData;

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/product/login');
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Id: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};


export default UserProfilePage;
