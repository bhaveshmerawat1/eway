// "use client";
// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import users from "../utils/appData.json";

// interface AuthContextType {
//   user: any;
//   token: string | null;
//   isGuest: boolean;
//   login: (userId: string, password: string) => Promise<void>;
//   logout: () => void;
//   continueAsGuest: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isGuest, setIsGuest] = useState(false);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       setToken(savedToken);
//     }
//   }, []);

//   const login = async (userId: string, password: string) => {
//     const foundUser = users.users.find(
//       (u) => u.userId === userId && u.password === password
//     );

//     if (!foundUser) {
//       throw new Error("Invalid credentials");
//     }

//     setUser(foundUser);
//     setToken("dummy-token-" + foundUser.id);
//     setIsGuest(false);
//     localStorage.setItem("token", "dummy-token-" + foundUser.id);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setIsGuest(false);
//     localStorage.removeItem("token");
//   };

//   const continueAsGuest = () => {
//     setUser(null);
//     setToken(null);
//     setIsGuest(true);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isGuest, login, logout, continueAsGuest }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
