import axios from "axios";
import AuthStore from "../stores/AuthStore";

export async function loginUser(data) {
  try {
    const res = await axios.post("/auth/login", data);
    const { token, user } = res.data;

    AuthStore.update((s) => {
      s.token = token;
      s.user = user;
    });
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
}

export async function checkToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const res = await axios.get("/auth", {
      headers: {
        "x-access-token": token,
      },
    });
    const { user } = res.data;

    AuthStore.update((s) => {
      s.token = token;
      s.user = user;
    });

    return user;
  } catch (err) {
    console.log("error checking token", err);
    return false;
  }
}

export function logoutUser() {
  AuthStore.update((s) => {
    s.token = null;
    s.user = null;
  });
}
