import React, { useState, useCallback } from "react";
import AppContext from "./AppContext";
import Pusher from "pusher-js";

const AppProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [data, setData] = useState({
    nodes: [],
  });
  const [specificCallData, setSpecificCallData] = useState(null);

  const pusher = new Pusher("d44e3d910d38a928e0be", {
    cluster: "eu",

    authEndpoint: "https://frontend-test-api.aircall.dev/pusher/auth",

    auth: {
      headers: {
        Authorization: `Bearer ${
          accessToken || localStorage.getItem("access-token")
        }`,
      },
    },
  });

  const channel = pusher.subscribe("private-aircall");
  channel.bind("update-call", function (updatedCall) {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((call) =>
        call.id === updatedCall.id ? updatedCall : call
      ),
    }));
  });

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
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("auth-token")
            }`,
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
    setTimeout(refreshToken, 540000); // Refresh the token every 9 minutes (540000 ms)
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

  const toggleArchiveStatus = async (callId, isArchived) => {
    try {
      const response = await fetch(
        `https://frontend-test-api.aircall.dev/calls/${callId}/archive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("access-token")
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update archive status: ${response.statusText}`
        );
      }

      const updatedCall = await response.json();
      console.log("New Archived", updatedCall);
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((call) =>
          call.id === callId ? updatedCall : call
        ),
      }));
    } catch (error) {
      console.error("Error during toggle archive status:", error.message);
    }
  };

  const fetchCallDetails = async (callId, givenAuth) => {
    try {
      const response = await fetch(
        `https://frontend-test-api.aircall.dev/calls/${callId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              givenAuth || localStorage.getItem("access-token")
            } `,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch call details with status ${response.status}: ${response.statusText}`
        );
      }

      const callDetails = await response.json();
      setSpecificCallData(callDetails);
    } catch (error) {
      console.error("Error fetching specific call details:", error.message);
      throw error;
    }
  };

  const addNote = async (callId, content) => {
    try {
      const response = await fetch(
        `https://frontend-test-api.aircall.dev/calls/${callId}/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("access-token")
            }`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
      }

      const updatedCall = await response.json();
      // Update the specific call data to reflect the new note
      setSpecificCallData((prev) => ({
        ...prev,
        notes: [updatedCall],
      }));
      // Optionally, refresh call list or specific call details
      fetchCallDetails(
        callId,
        accessToken || localStorage.getItem("access-token")
      );
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };
  return (
    <AppContext.Provider
      value={{
        accessToken,
        login,
        data,
        setData,
        fetchCalls,
        fetchCallDetails,
        specificCallData,
        addNote,
        setSpecificCallData,
        scheduleTokenRefresh,
        toggleArchiveStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
