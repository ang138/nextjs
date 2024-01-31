// // pages/profile.js
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';


// const Profile = () => {
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = Cookies.get('token');
  
//     if (!token) {
//       router.push('/product/login');
//     } else {
//       setLoading(true);
//       fetch('http://localhost:8000/auth/user/1', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch user data');
//           }
//           return response.json();
//         })
//         .then((data) => setUserData(data))
//         .catch((error) => setError(error.message))
//         .finally(() => setLoading(false));
//     }
//   }, []);

//   return (
//     <div>
//       <h1>User Profile</h1>
  
//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
  
//       {userData && (
//         <div>
//           <p>Email: {userData.email}</p>
//           {/* Display other profile information as needed */}
//         </div>
//       )}
//     </div>
//   );
// };


