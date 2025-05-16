import { useState } from "react";
import axios from "axios";
import { UserSchema } from "../../schemas/zodSchemas";
import { z } from "zod";
import NavigateToHome from "../../components/usefulFunctions";

// Infer the User type from the Zod schema
type User = z.infer<typeof UserSchema>;

export default function CreateUser() {
  const [user, setUser] = useState<User>({
    userId: 0,
    firstName: "",
    lastName: "",
    userName: "",
    userType: "user", // default user type
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = UserSchema.safeParse(user);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.errors) {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({}); // clear old errors

    try {
      const response = await axios.post("http://localhost:8080/api/users", user);
      alert("User added successfully!");
      console.log(response.data);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrors({ api: err.response.data.error });
      } else {
        setErrors({ api: "An unexpected error occurred" });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto outline bg-slate-100/20 shadow-gray-300 shadow-md rounded"
    >
      <h2 className="text-xl mb-4 font-semibold">Add New User</h2>

      {errors.api && <p className="text-red-600 mb-2">{errors.api}</p>}

      <label className="block mb-2">First Name:</label>
      <input
        name="firstName"
        value={user.firstName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.firstName && (
        <p className="text-red-600 mb-4">{errors.firstName}</p>
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
        <p className="text-red-600 mb-4">{errors.lastName}</p>
      )}

      <label className="block mb-2">Username:</label>
      <input
        name="userName"
        value={user.userName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.userName && (
        <p className="text-red-600 mb-4">{errors.userName}</p>
      )}

      <label className="block mb-2">User Type:</label>
      <select
        name="userType"
        value={user.userType}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded bg-lime-300/20 *:text-black"
        required
      >
        <option value="system">system</option>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>
      {errors.userType && (
        <p className="text-red-600 mb-4">{errors.userType}</p>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <input
          type="submit"
          value="Add User"
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700"
        />
        <NavigateToHome text="Return Home" />
      </div>
    </form>
  );
}
