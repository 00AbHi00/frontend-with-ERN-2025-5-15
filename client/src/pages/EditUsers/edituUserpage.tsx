import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { type User } from "../../schemas/userSchema";
import NavigateToHome from "../../components/usefulFunctions";
import { UserUpdateSchema } from "../../schemas/zodSchemas";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track the state of the user
  // useEffect(() => {
  //   if (user) {
  //     console.log("User :", user);
  //     // perform your logic here
  //   }
  // }, [user]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${id}`
        );
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate user data with Zod schema
    const result = UserUpdateSchema.safeParse({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      userType: user.userType,
    });
    console.log(result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.errors) {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return; // Stop submission if validation fails
    }

    setErrors({}); // Clear previous errors

    try {
      await axios.put(`http://localhost:8080/api/users/${id}`, {
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        userName: user.userName,
        userId: user.userId,
      });
      alert("User updated successfully!");
      // navigate("/"); //From useNavigate react-router-dom
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error(
          "Update failed:",
          error.response.status,
          error.response.data
        );
        alert(
          `Error ${error.response.status}: ${
            error.response.data.error || "Unknown server error"
          }`
        );
      }
      console.error("Update failed:", error);
      alert("Failed to update user.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) {
    return (
      <div className="flex flex-col">
        User not found
        <NavigateToHome text="Navigate to Home" />
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto outline bg-slate-100/20 shadow-gray-300 shadow-md rounded "
    >
      <label className="block mb-2">First Name:</label>
      <input
        name="firstName"
        value={user.firstName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.firstName && (
        <p className="text-red-600 text-sm mb-4">{errors.firstName}</p>
      )}

      <label className="block mb-2">Last Name:</label>
      <input
        name="lastName"
        value={user.lastName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.lastName && (
        <p className="text-red-600 text-sm mb-4">{errors.lastName}</p>
      )}

      <label className="block mb-2">User Name:</label>
      <input
        name="userName"
        value={user.userName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.userName && (
        <p className="text-red-600 text-sm mb-4">{errors.userName}</p>
      )}

      <label className="block mb-2">User Type:</label>
      <select
        name="userType"
        value={user.userType}
        onChange={handleChange}
        className="w-full mb-1 p-2 border rounded bg-lime-300/20 *:text-black"
        required
      >
        <option value="system">system</option>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>
      {errors.userType && (
        <p className="text-red-600 text-sm mb-4">{errors.userType}</p>
      )}
      <div className="flex flex-col gap-3 mt-2 max-w-md min-w-sm">
        <input
          type="submit"
          value={"Update User"}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        />

        <NavigateToHome text="Return Home" />
      </div>
    </form>
  );
}
