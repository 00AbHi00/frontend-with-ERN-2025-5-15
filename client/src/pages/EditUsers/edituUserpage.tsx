import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
};

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`);
        const userData = response.data || null;
        setUser(userData);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/users/${id}`, user);
      alert("User updated successfully!");
      navigate("/"); // Redirect to homepage or user list
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update user.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>

      <label className="block mb-2">First Name:</label>
      <input
        name="firstName"
        value={user.firstName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-2">Last Name:</label>
      <input
        name="lastName"
        value={user.lastName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-2">Username:</label>
      <input
        name="userName"
        value={user.userName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-2">User Type:</label>
      <input
        name="userType"
        value={user.userType}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update User
      </button>
    </form>
  );
}
