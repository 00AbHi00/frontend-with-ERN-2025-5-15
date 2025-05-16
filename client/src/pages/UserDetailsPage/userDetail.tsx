import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { type User } from "../../schemas/userSchema";

export default function UserDetail() {
  const { id } = useParams(); // dynamic user ID from URL
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${id}`);

      if (response.status === 200 && response.data) {
        setUser(response.data);
      } else {
        // User not found or no data
        setUser(null);
      }
    } catch (e) {
      console.error("User fetch error:", e);
      setUser(null); // on error, also clear user to avoid infinite loading
    }
  };

  fetchUser();
}, [id]);

if (user === null) {
  return <div className="p-4 text-red-500">User not found.</div>;
}

if (!user) {
  return <div className="p-4 text-gray-500">Loading user...</div>;
}

return (
  <div className="p-4">
    <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
    <p>Username: {user.userName}</p>
    <p>User Type: {user.userType}</p>
    <p>User ID: {user.userId}</p>
  </div>
);


}
