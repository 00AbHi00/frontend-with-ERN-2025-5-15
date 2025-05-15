import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
};

export default function UserDetail() {
  const { id } = useParams(); // dynamic user ID from URL
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api");
        const userData = response.data.users[id as string];
        setUser(userData);
      } catch (e) {
        console.error("User fetch error:", e);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
      <p>Username: {user.userName}</p>
      <p>User Type: {user.userType}</p>
      <p>User ID: {user.userId}</p>
    </div>
  );
}
