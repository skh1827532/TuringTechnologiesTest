import React, { useState, useCallback } from "react";

import AppContext from "./AppContext";

const AppProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");

  const [data, setData] = useState([]);
  async function login(username, password, callback) {
    try {
      const response = await fetch(
        "https://frontend-test-api.aircall.dev/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Login failed with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem("access-token", data.access_token);

      scheduleTokenRefresh();
      callback();
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  }

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(
        "https://frontend-test-api.aircall.dev/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem("access-token", data.access_token);
      scheduleTokenRefresh();
    } catch (error) {
      console.error("Error during token refresh:", error.message);
    }
  }, [accessToken]);

  const scheduleTokenRefresh = () => {
    setTimeout(refreshToken, 540000);
  };

  async function fetchCalls(myAccessToken, offset = 0, limit = 10) {
    try {
      const response = await fetch(
        `https://frontend-test-api.aircall.dev/calls?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${myAccessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch calls with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error during fetching calls:", error.message);
      throw error;
    }
  }

  return (
    <AppContext.Provider
      value={{
        accessToken,
        login,
        data,
        setData,
        fetchCalls,
        scheduleTokenRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
