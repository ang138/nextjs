import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
// import jwtDecode, { JwtPayload as DecodedJwtPayload } from 'jwt-decode';

interface JwtPayload {
  id: number;
  role: number; 
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [payloadData, setPayloadData] = useState(null);
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          // authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();

        const decodedToken: JwtPayload = jwtDecode(token) as JwtPayload;
        console.log("Decoded Token:", decodedToken);
        const userId = decodedToken?.id;

        console.log("User ID:", userId);

        // Store the token in localStorage
        localStorage.setItem("token", token);

        setUserId(userId);

        // Redirect to the profile page
        if (decodedToken.role == 2) {
          // router.push(`/user/${userId}`);
        } else {
          router.push("/admin/profile");
          // alert('คุณไม่มีสิทธิ');
        }

        console.log(token);
      } else {
        alert;
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const getUser = async () => {
    try {
      const getToken = await localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/auth/user", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        console.log("user", user, getToken);
        setUsers(user);
      } else {
        console.error("Error fetching data from API. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {token && (
        <div>
          <div>Token: {token}</div>
          {payloadData && (
            <div>
              <h3>Payload Data:</h3>
              <pre>{JSON.stringify(payloadData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      <Link href="/product">
        <button>product</button>
      </Link>
      <hr />
      <button onClick={getUser}>Get User</button>
      {users.map((user) => (
        <div key={user.id} className="card">
          <p>ID: {userId}</p>
          {/* <h2>{user.name}</h2> */}
          {/* <p>ID: {user.id}</p> */}
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default LoginPage;
