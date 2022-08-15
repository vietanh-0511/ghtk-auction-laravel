import { createContext, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { Toast } from "primereact/toast";
import { createUser } from "../apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const toast = useRef(null);
  const navigate = useNavigate();
  const login = (data) => {
    window.axiosApiInstance.post("/auth/login", data).then((res) => {
      const _user = res.data.data;
      if (res.data.status !== true) {
        toast.current.show({
          severity: "error",
          summary: "Notification",
          detail: res.data.message || "Login Fail",
          life: 5000,
        });
      } else {
        setUser(_user);
        setToken(res.data.access_token);
        toast.current.show({
          severity: "success",
          summary: "Notification",
          detail: res.data.message,
          life: 5000,
        });
        if (_user.role === "admin")
          navigate("/admin/dashboard", { replace: true });
        if (_user.role === "user") navigate("/user/auction", { replace: true });
      }
    });
  };

  const logout = async () => {
  const res = await window.axiosApiInstance.post("/auth/logout").then((res) => {
      toast.current.show({
        severity: "success",
        summary: "Notification",
        detail: res.data.message || "Sign out successful",
        life: 2000,
      })
    })
    setUser(null);
    setToken(null);
    navigate("/", { replace: true });
    return res
  };

  const register = (data) => {
    window.axiosApiInstance.post("/auth/register", data).then((res) => {
      if (res.data.status !== true) {
        toast.current.show({
          severity: "error",
          summary: "Notification",
          detail: res.data.message || "Register Fail",
          life: 5000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Notification",
          detail: res.data.message,
          life: 5000,
        });
      }
      if (res.data.status === true) navigate("/login", { replace: true });
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      register,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      <Toast ref={toast} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
