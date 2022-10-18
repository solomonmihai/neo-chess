import { Navigate } from "react-router-dom";
import AuthStore from "../stores/AuthStore";

export default function PrivateRoute({ children }) {
  const token = AuthStore.useState((s) => s.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
