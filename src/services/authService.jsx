import http from "./httpServices";
import jwt_decode from "jwt-decode";

http.setJwt(getjwt());

const apiEndpoint = "https://time-management-system-app.herokuapp.com/api/auth";

console.log("auth123 ",apiEndpoint)

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem("token", jwt);
}

export function loginWithJwt(jwt) {
  localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function getjwt() {
  return localStorage.getItem("token");
}
export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
   
    return jwt_decode(jwt);
  } catch (ex) {
    return null;
  }
}

const auth  = {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getjwt,
};

export default auth;