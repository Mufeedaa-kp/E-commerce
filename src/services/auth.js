import api from "./api";

const auth = {
  
  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      
      return {
        success: true,
        user: res.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },


  register: async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return {
        success: true,
        user: res.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },


  logout: async () => {
    await api.post("/auth/logout");
  },

  
  getCurrentUser: async () => {
    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch {
      return null;
    }
  },
};

export default auth;