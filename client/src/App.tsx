import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/home";
import UserDetail from "./pages/UserDetailsPage/userDetail";
import EditUsersPage from "./pages/EditUsers/edituUserpage";
import CreateUser from "./pages/CreateUser/create";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/edit/user/:id" element={<EditUsersPage />} /> 
        <Route path="/create/user" element={<CreateUser />} /> 
      
      </Routes>
    </Router>
  );
}