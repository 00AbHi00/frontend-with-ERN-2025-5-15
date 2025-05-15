import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
};

type UsersData = {
  users: {
    [key: string]: User;
  };
};

export default function HomePage() {
  const [usersList, setUserList] = useState<UsersData | null>(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api");
        setUserList(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchApi();
  }, []);

  return (
    <div className="bg-red-400 p-4">
      {usersList &&
        Object.entries(usersList.users).map(([key, user]) => (
          <Link to={`/user/${key}`} key={key}>
            <div className="p-2 bg-white rounded mb-2 cursor-pointer hover:bg-gray-200">
              {user.firstName} {user.lastName} ({user.userType})
            </div>
            
          </Link>
        ))}
    </div>
  );
}
