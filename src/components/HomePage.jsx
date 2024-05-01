import React, { useEffect, useState, useCallback, useContext } from "react";
import CallsTable from "./CallsTable";
import { Pagination, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import TTLogo from "../assets/Logo.png";
import "../App.css";

const HomePage = () => {
  const { data, accessToken, fetchCalls, scheduleTokenRefresh } = useContext(
    AppContext
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("All");
  const handleFilterChange = (filterName) => {
    setFilter(filterName);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    let token = localStorage.getItem("access-token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const offset = (currentPage - 1) * itemsPerPage;

      fetchCalls(accessToken, offset, itemsPerPage);
    }

    if (localStorage.getItem("access-token")) {
      const offset = (currentPage - 1) * itemsPerPage;

      fetchCalls(localStorage.getItem("access-token"), offset, itemsPerPage);
    }
  }, [accessToken, currentPage, itemsPerPage]);

  useEffect(() => {
    return () => {
      clearTimeout(scheduleTokenRefresh);
    };
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = data.totalCount
    ? Math.ceil(data.totalCount / itemsPerPage)
    : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100vw",
          paddingRight: "2rem",
          paddingLeft: "2rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid #dee2e6",
        }}
      >
        <div>
          <img src={TTLogo} style={{ width: "300px" }} alt="image Not Found" />
        </div>
        <div>
          <Button
            variant="primary"
            style={{ width: "10vw" }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>

      <div style={{ width: "90vw", marginTop: "30px" }}>
        <h2>Turing Technologies Frontend Test</h2>
        <div
          className="filtered-results"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ margin: "10px" }}>Filter By:</div>
          <div>
            <DropdownButton
              id="dropdown-basic-button"
              title={` ${filter}`}
              className="custom-dropdown" // Added a class for more specific styling
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                color: "#007bff",
              }} // Inline styles for immediate changes
            >
              <Dropdown.Item onClick={() => handleFilterChange("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("Archived")}>
                Archived
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("UnArchive")}>
                UnArchived
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>

      {data.nodes && data.nodes.length > 0 && <CallsTable calls={data.nodes} />}
      {totalPages > 1 && (
        <CenteredPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const CenteredPagination = ({ totalPages, currentPage, onPageChange }) => {
  let startPage, endPage;
  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i
  );

  const buttonStyle = {
    border: "none",
    backgroundColor: "transparent",
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={buttonStyle}
      />
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
          style={buttonStyle}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={buttonStyle}
      />
    </Pagination>
  );
};

export default HomePage;

// import React, { useEffect, useState, useContext } from "react";
// import { Pagination, Button, Dropdown, DropdownButton } from "react-bootstrap";
// import CallsTable from "./CallsTable";
// import { useNavigate } from "react-router-dom";
// import AppContext from "../context/AppContext";
// import TTLogo from "../assets/Logo.png";

// const HomePage = () => {
//   const { data, accessToken, fetchCalls, scheduleTokenRefresh } = useContext(
//     AppContext
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filter, setFilter] = useState("All"); // State to manage filter
//   const navigate = useNavigate();

//   useEffect(() => {
//     let token = localStorage.getItem("access-token");
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (accessToken) {
//       const offset = (currentPage - 1) * itemsPerPage;
//       fetchCalls(accessToken, offset, itemsPerPage);
//     }

//     if (localStorage.getItem("access-token")) {
//       const offset = (currentPage - 1) * itemsPerPage;

//       fetchCalls(localStorage.getItem("access-token"), offset, itemsPerPage);
//     }
//   }, [accessToken, currentPage, itemsPerPage, filter, fetchCalls]);

//   useEffect(() => {
//     return () => {
//       clearTimeout(scheduleTokenRefresh);
//     };
//   }, [scheduleTokenRefresh]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleFilterChange = (filterType) => {
//     setFilter(filterType);
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   const filteredCalls = React.useMemo(() => {
//     return data.nodes
//       ? data.nodes.filter((call) => {
//           if (filter === "Archived") return call.is_archived;
//           if (filter === "UnArchive") return !call.is_archived;
//           return true; // All calls
//         })
//       : [];
//   }, [data.nodes, filter]);

//   const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           width: "100vw",
//           paddingRight: "2rem",
//           paddingLeft: "2rem",
//           paddingTop: "1rem",
//           paddingBottom: "1rem",
//           borderBottom: "2px solid #dee2e6",
//         }}
//       >
//         <div>
//           <img src={TTLogo} style={{ width: "300px" }} alt="Logo Not Found" />
//         </div>
//         <div>
//           <Button
//             variant="primary"
//             style={{ width: "10vw" }}
//             onClick={handleLogout}
//           >
//             Log out
//           </Button>
//         </div>
//       </div>
//       <div style={{ width: "90vw", marginTop: "30px" }}>
//         <h2>Turing Technologies Frontend Test</h2>
//         <div className="filtered-results">
//           <DropdownButton id="dropdown-basic-button" title="Filter Calls">
//             <Dropdown.Item onClick={() => handleFilterChange("All")}>
//               All
//             </Dropdown.Item>
//             <Dropdown.Item onClick={() => handleFilterChange("Archived")}>
//               Archived
//             </Dropdown.Item>
//             <Dropdown.Item onClick={() => handleFilterChange("UnArchive")}>
//               UnArchived
//             </Dropdown.Item>
//           </DropdownButton>
//         </div>
//       </div>
//       {filteredCalls.length > 0 && (
//         <CallsTable
//           calls={filteredCalls.slice(
//             (currentPage - 1) * itemsPerPage,
//             currentPage * itemsPerPage
//           )}
//         />
//       )}
//       {totalPages > 1 && (
//         <CenteredPagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       )}
//     </div>
//   );
// };

// const CenteredPagination = ({ totalPages, currentPage, onPageChange }) => {
//   let startPage, endPage;
//   if (totalPages <= 5) {
//     startPage = 1;
//     endPage = totalPages;
//   } else {
//     if (currentPage <= 3) {
//       startPage = 1;
//       endPage = 5;
//     } else if (currentPage + 2 >= totalPages) {
//       startPage = totalPages - 4;
//       endPage = totalPages;
//     } else {
//       startPage = currentPage - 2;
//       endPage = currentPage + 2;
//     }
//   }

//   const pages = [...Array(endPage + 1 - startPage).keys()].map(
//     (i) => startPage + i
//   );

//   const buttonStyle = {
//     border: "none",
//     backgroundColor: "transparent",
//   };

//   return (
//     <Pagination className="justify-content-center">
//       <Pagination.Prev
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         style={buttonStyle}
//       />
//       {pages.map((page) => (
//         <Pagination.Item
//           key={page}
//           active={page === currentPage}
//           onClick={() => onPageChange(page)}
//           style={buttonStyle}
//         >
//           {page}
//         </Pagination.Item>
//       ))}
//       <Pagination.Next
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         style={buttonStyle}
//       />
//     </Pagination>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState, useContext } from "react";
// import { Pagination, Button, Dropdown, DropdownButton } from "react-bootstrap";
// import CallsTable from "./CallsTable";
// import { useNavigate } from "react-router-dom";
// import AppContext from "../context/AppContext";
// import TTLogo from "../assets/Logo.png";

// const HomePage = () => {
//   const { data, accessToken, fetchCalls, scheduleTokenRefresh } = useContext(
//     AppContext
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("access-token");
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const offset = (currentPage - 1) * itemsPerPage;
//     fetchCalls(
//       accessToken || localStorage.getItem("access-token"),
//       offset,
//       itemsPerPage
//     );
//   }, [accessToken, currentPage, itemsPerPage, fetchCalls]);

//   useEffect(() => {
//     return () => {
//       clearTimeout(scheduleTokenRefresh);
//     };
//   }, [scheduleTokenRefresh]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleFilterChange = (filterType) => {
//     setFilter(filterType);
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   const filteredCalls = React.useMemo(() => {
//     return data.nodes
//       ? data.nodes.filter((call) => {
//           if (filter === "Archived") return call.is_archived;
//           if (filter === "UnArchive") return !call.is_archived;
//           return true; // All calls
//         })
//       : [];
//   }, [data.nodes, filter]);

//   const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           width: "100vw",
//           paddingRight: "2rem",
//           paddingLeft: "2rem",
//           paddingTop: "1rem",
//           paddingBottom: "1rem",
//           borderBottom: "2px solid #dee2e6",
//         }}
//       >
//         <div>
//           <img src={TTLogo} style={{ width: "300px" }} alt="Logo Not Found" />
//         </div>
//         <div>
//           <Button
//             variant="primary"
//             style={{ width: "10vw" }}
//             onClick={handleLogout}
//           >
//             Log out
//           </Button>
//         </div>
//       </div>
//       <div style={{ width: "90vw", marginTop: "30px" }}>
//         <h2>Turing Technologies Frontend Test</h2>
//         <DropdownButton
//           id="dropdown-basic-button"
//           title={`Filter Calls: ${filter}`}
//         >
//           <Dropdown.Item onClick={() => handleFilterChange("All")}>
//             All
//           </Dropdown.Item>
//           <Dropdown.Item onClick={() => handleFilterChange("Archived")}>
//             Archived
//           </Dropdown.Item>
//           <Dropdown.Item onClick={() => handleFilterChange("UnArchive")}>
//             UnArchived
//           </Dropdown.Item>
//         </DropdownButton>
//       </div>
//       {filteredCalls.length > 0 ? (
//         <CallsTable
//           calls={filteredCalls.slice(
//             (currentPage - 1) * itemsPerPage,
//             currentPage * itemsPerPage
//           )}
//         />
//       ) : (
//         <p>No calls to display.</p>
//       )}
//       {totalPages > 1 && (
//         <CenteredPagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       )}
//     </div>
//   );
// };

// const CenteredPagination = ({ totalPages, currentPage, onPageChange }) => {
//   let startPage, endPage;
//   if (totalPages <= 5) {
//     startPage = 1;
//     endPage = totalPages;
//   } else {
//     if (currentPage <= 3) {
//       startPage = 1;
//       endPage = 5;
//     } else if (currentPage + 2 >= totalPages) {
//       startPage = totalPages - 4;
//       endPage = totalPages;
//     } else {
//       startPage = currentPage - 2;
//       endPage = currentPage + 2;
//     }
//   }

//   const pages = Array.from(
//     { length: endPage + 1 - startPage },
//     (_, i) => startPage + i
//   );

//   const buttonStyle = {
//     border: "none",
//     backgroundColor: "transparent",
//   };

//   return (
//     <Pagination className="justify-content-center">
//       <Pagination.Prev
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         style={buttonStyle}
//       />
//       {pages.map((page) => (
//         <Pagination.Item
//           key={page}
//           active={page === currentPage}
//           onClick={() => onPageChange(page)}
//           style={buttonStyle}
//         >
//           {page}
//         </Pagination.Item>
//       ))}
//       <Pagination.Next
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         style={buttonStyle}
//       />
//     </Pagination>
//   );
// };

// export default HomePage;
