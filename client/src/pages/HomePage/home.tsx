import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Space, Table, type TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import { type User } from "../../schemas/userSchema";


const columns: TableColumnsType<User> = [
  {
    title: "ID",
    dataIndex: "userId",
    key: "userId",
    sorter: (a, b) => a.userId - b.userId,
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    filters: [
      { text: "Abhishek", value: "Abhishek" },
      { text: "John", value: "John" },
    ],
    onFilter: (value, record) => record.firstName.includes(value as string),
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: "Username",
    dataIndex: "userName",
    key: "userName",
    sorter: (a, b) => a.userName.localeCompare(b.userName),
  },
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
    filters: [
      { text: "Admin", value: "admin" },
      { text: "System", value: "system" },
      { text: "User", value: "user" },
    ],
    onFilter: (value, record) => record.userType === value,
    sorter: (a, b) => a.userType.localeCompare(b.userType),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button type="primary" onClick  ={() => handleDelete(record.userId)}> Delete </Button>
         <Link to={`/edit/user/${record.userId}`}>
          <Button type="dashed">Edit</Button>
        </Link>
        <Link to={`/user/${record.userId}`}>
          <Button type="dashed">Visit</Button>
        </Link>
      </Space>
    ),
  },
];

const handleDelete = async (userId: number) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/users/${userId}`
    );
    if (response.status === 200) {
      alert("User deleted successfully.");
      
      // Refreshing the page
      window.location.reload();

    } else {
      alert("Failed to delete user.");
    }
  
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting user.");
  }
};



export default function HomePage() {
  const [usersList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:8080/api/users");
        setUserList(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchApi();
  }, []);

  return (
    <>
      <Link to='/create/user' className="block bg-green-900 p-3 m-3 text-gray-100">
        Create New user ➕
      </Link>
      <Table
        className="max-w-screen p-0 m-0"
        rowClassName={(record) => (record.userType === "admin" ? "bg-yellow-200" : "")}
        rowHoverable={false}
        columns={columns}
        dataSource={usersList}
        rowKey="userId"
        locale={{ emptyText: "No users available" }}
      />
    </>
  );
}
