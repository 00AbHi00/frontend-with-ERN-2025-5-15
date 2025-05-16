import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function NavigateToHome({text="Return to Home"}:{text:string}) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/"); // navigate to homepage
  };

  return (
    <Button onClick={goHome}>{text}</Button>
  );
}
