import {createContext, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  const login = (data) => {
    window.axiosApiInstance.post('/auth/login', data).then(res => {
      // @FIXME: need user.role here
      setUser(res.data.data);
      setToken(res.data.access_token);
      if (user.role === 'admin') {
        navigate("/admin/dashboard", {replace: true});
      }
      if (user.role === 'customer') {
        navigate("/auctions/live", {replace: true});
      }
    })
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/", {replace: true});
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
