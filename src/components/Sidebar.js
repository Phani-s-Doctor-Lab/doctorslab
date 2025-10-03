import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear user data stored in localStorage
    localStorage.clear(); // Clears all keys in localStorage (or use removeItem for specific keys)

    // Clear user data in sessionStorage as well
    sessionStorage.clear(); // Clears all keys in sessionStorage (or use removeItem)

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div
      className="h-full"
      style={{
        "--primary-color": "#649ccd",
        "--primary-light": "#d1e1f0",
        "--text-primary": "#111827",
        "--text-secondary": "#6b7280",
        "--background-color": "#d1e1f0",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      <aside className="w-full md:w-64 h-full flex-shrink-0 sidebar p-4 flex flex-col justify-between bg-white border-r border-[var(--border-color)]">
        <div className="flex flex-col gap-8">
          <div>
            {/* Logo and Title */}
            <div className="flex items-center gap-2 px-3">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Phani's Doctor Laboratories
              </h1>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/dashboard"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <svg
                data-icon="House"
                viewBox="0 0 256 256"
                className="w-6 h-6"
                fill="currentColor"
              >
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
              <span>Dashboard</span>
            </p>
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/patients"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/patients")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="currentColor"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 2,
                }}
              >
                <path d="M9.731,14.075c-1.387,0.252 -2.676,0.921 -3.687,1.932c-1.309,1.309 -2.044,3.084 -2.044,4.935l0,4.039c0,1.657 1.343,3 3,3c4.184,-0 13.816,-0 18,-0c1.657,-0 3,-1.343 3,-3l0,-4.039c0,-1.851 -0.735,-3.626 -2.044,-4.935c-1.011,-1.011 -2.3,-1.68 -3.687,-1.932c0.468,-0.939 0.731,-1.997 0.731,-3.117c0,-3.863 -3.137,-7 -7,-7c-3.863,0 -7,3.137 -7,7c0,1.12 0.263,2.178 0.731,3.117Zm11.169,1.88c-1.262,1.239 -2.993,2.003 -4.9,2.003c-1.907,0 -3.638,-0.764 -4.9,-2.003c-0.04,0.005 -0.08,0.007 -0.12,0.007c-1.321,0 -2.588,0.525 -3.521,1.459c-0.934,0.934 -1.459,2.201 -1.459,3.521c0,0 0,4.039 0,4.039c0,0.552 0.448,1 1,1l18,-0c0.552,-0 1,-0.448 1,-1c-0,-0 0,-4.039 0,-4.039c0,-1.32 -0.525,-2.587 -1.459,-3.521c-0.933,-0.934 -2.2,-1.459 -3.521,-1.459c-0.04,0 -0.08,-0.002 -0.12,-0.007Zm-4.9,-9.997c2.76,0 5,2.241 5,5c0,2.76 -2.24,5 -5,5c-2.76,0 -5,-2.24 -5,-5c0,-2.759 2.24,-5 5,-5Z" />
                <path d="M20,20.008l-1,-0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1l1,-0l0,1c-0,0.552 0.448,1 1,1c0.552,-0 1,-0.448 1,-1l0,-1l1,-0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-1,-0l0,-1c-0,-0.552 -0.448,-1 -1,-1c-0.552,-0 -1,0.448 -1,1l0,1Z" />
              </svg>

              <span>Patients</span>
            </p>
            {/* Add Test */}
            {location.pathname === "/patient-form" && (
              <p className="sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active">
                <svg
                  data-icon="Add"
                  viewBox="0 0 52 52"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    d="M43,9C33.6-0.3,18.4-0.3,9,9c-9.3,9.4-9.3,24.6,0,34c9.4,9.4,24.6,9.4,33.9,0C52.3,33.6,52.3,18.4,43,9z
                          M42,28c0,0.6-0.4,1-1,1H30c-0.5,0-1,0.5-1,1v11c0,0.5-0.5,1-1,1h-4c-0.6,0-1-0.4-1-1V30c0-0.6-0.4-1-1-1H11c-0.6,0-1-0.4-1-1v-4
                          c0-0.5,0.5-1,1-1h11c0.6,0,1-0.4,1-1V11c0-0.5,0.5-1,1-1h4c0.5,0,1,0.4,1,1v11c0,0.6,0.4,1,1,1h11c0.5,0,1,0.5,1,1V28z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Add Patient</span>
              </p>
            )}
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer  ${
                location.pathname === "/inventory"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/inventory")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fillRule: "evenodd", clipRule: "evenodd" }}
              >
                <g clipPath="url(#clip0)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 0C1.55228 0 2 0.447715 2 1V8H5C4.44772 8 4 7.55228 4 7V5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V7C10 7.55228 9.55228 8 9 8H13C12.4477 8 12 7.55228 12 7V3C12 2.44772 12.4477 2 13 2H19C19.5523 2 20 2.44772 20 3V7C20 7.55228 19.5523 8 19 8H22V1C22 0.447715 22.4477 0 23 0C23.5523 0 24 0.447715 24 1V23C24 23.5523 23.5523 24 23 24C22.4477 24 22 23.5523 22 23V22H2V23C2 23.5523 1.55228 24 1 24C0.447715 24 0 23.5523 0 23V1C0 0.447715 0.447715 0 1 0ZM22 20H19C19.5523 20 20 19.5523 20 19V15C20 14.4477 19.5523 14 19 14H14C13.4477 14 13 14.4477 13 15V19C13 19.5523 13.4477 20 14 20H10C10.5523 20 11 19.5523 11 19V13C11 12.4477 10.5523 12 10 12H5C4.44772 12 4 12.4477 4 13V19C4 19.5523 4.44772 20 5 20H2V10H22V20Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Inventory</span>
            </p>

            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/tests"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/tests")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 490 490"
                fill="currentColor"
                style={{ enableBackground: "new 0 0 490 490" }}
              >
                <g>
                  <g>
                    <g>
                      <path
                        d="M357.071,87.929l-85-85c-1.912-1.912-4.47-2.904-7.071-2.905V0H10C4.477,0,0,4.477,0,10v470c0,5.523,4.477,10,10,10h340
          c5.523,0,10-4.477,10-10V95h-0.024C359.975,92.399,358.983,89.841,357.071,87.929z M275,34.142L325.858,85H275V34.142z M340,470
          H20V20h235v75c0,5.523,4.477,10,10,10h75V470z"
                      />
                      <path
                        d="M470,235v155h-15V120h-0.012c0-1.302-0.242-2.609-0.757-3.846l-25-60C427.678,52.427,424.037,50,420,50
          s-7.678,2.427-9.231,6.154l-25,60c-0.515,1.237-0.757,2.544-0.757,3.846H385v360c0,5.523,4.477,10,10,10h50
          c5.523,0,10-4.477,10-10v-70h25c5.523,0,10-4.477,10-10V235H470z M420,86l10,24h-20L420,86z M435,470h-30v-60h30V470z M435,390
          h-30V130h30V390z"
                      />
                      <path
                        d="M125,135H75c-5.523,0-10,4.477-10,10v50c0,5.523,4.477,10,10,10h50c5.523,0,10-4.477,10-10v-50
          C135,139.477,130.523,135,125,135z M115,185H85v-30h30V185z"
                      />
                      <path
                        d="M125,245H75c-5.523,0-10,4.477-10,10v50c0,5.523,4.477,10,10,10h50c5.523,0,10-4.477,10-10v-50
          C135,249.477,130.523,245,125,245z M115,295H85v-30h30V295z"
                      />
                      <path
                        d="M125,355H75c-5.523,0-10,4.477-10,10v50c0,5.523,4.477,10,10,10h50c5.523,0,10-4.477,10-10v-50
          C135,359.477,130.523,355,125,355z M115,405H85v-30h30V405z"
                      />
                      <rect x="150" y="140" width="50" height="20" />
                      <rect x="150" y="180" width="135" height="20" />
                      <rect x="150" y="250" width="50" height="20" />
                      <rect x="150" y="290" width="135" height="20" />
                      <rect x="150" y="360" width="50" height="20" />
                      <rect x="150" y="400" width="135" height="20" />
                    </g>
                  </g>
                </g>
              </svg>

              <span>Tests</span>
            </p>
            {/* Add Test */}
            {location.pathname === "/add-test" && (
              <p className="sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active">
                <svg
                  data-icon="Add"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    d="M12 4v16m8-8H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Add Test</span>
              </p>
            )}
            {/* View Test */}
            {location.pathname.startsWith("/view-test/") && (
              <p className="sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active">
                <svg
                  data-icon="View"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={5}
                  className="w-6 h-6"
                >
                  <path d="M53.79,33.1a.51.51,0,0,0,0-.4C52.83,30.89,45.29,17.17,32,16.84S11,30.61,9.92,32.65a.48.48,0,0,0,0,.48C11.1,35.06,19.35,48.05,29.68,49,41.07,50,50.31,42,53.79,33.1Z" />
                  <circle cx="31.7" cy="32.76" r="6.91" />
                </svg>
                <span>View Test</span>
              </p>
            )}
            {/* View Package */}
            {location.pathname.startsWith("/view-package/") && (
              <p className="sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active">
                <svg
                  data-icon="View"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={5}
                  className="w-6 h-6"
                >
                  <path d="M53.79,33.1a.51.51,0,0,0,0-.4C52.83,30.89,45.29,17.17,32,16.84S11,30.61,9.92,32.65a.48.48,0,0,0,0,.48C11.1,35.06,19.35,48.05,29.68,49,41.07,50,50.31,42,53.79,33.1Z" />
                  <circle cx="31.7" cy="32.76" r="6.91" />
                </svg>
                <span>View Package</span>
              </p>
            )}
            {/* Edit Test */}
            {location.pathname.startsWith("/edit-test/") && (
              <p className="sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active">
                <svg
                  data-icon="Edit"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    d="M21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4h6a1,1,0,0,0,0-2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM6,12.76V17a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29l6.92-6.93h0L21.71,8a1,1,0,0,0,0-1.42L17.47,2.29a1,1,0,0,0-1.42,0L13.23,5.12h0L6.29,12.05A1,1,0,0,0,6,12.76ZM16.76,4.41l2.83,2.83L18.17,8.66,15.34,5.83ZM8,13.17l5.93-5.93,2.83,2.83L10.83,16H8Z"
                    stroke="currentColor"
                  />
                </svg>
                <span>Edit Test</span>
              </p>
            )}
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/staff"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/staff")}
            >
              <svg
                data-icon="Users"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clip-rule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
              <span>Staff</span>
            </p>
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/reports"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/reports")}
            >
              <svg
                data-icon="Chart"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.5 14H15v-1H2V0H1v13.5l.5.5zM3 11.5v-8l.5-.5h2l.5.5v8l-.5.5h-2l-.5-.5zm2-.5V4H4v7h1zm6-9.5v10l.5.5h2l.5-.5v-10l-.5-.5h-2l-.5.5zm2 .5v9h-1V2h1zm-6 9.5v-6l.5-.5h2l.5.5v6l-.5.5h-2l-.5-.5zm2-.5V6H8v5h1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Statistics</span>
            </p>
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${
                location.pathname === "/settings"
                  ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active"
                  : ""
              }`}
              onClick={() => navigate("/settings")}
            >
              <svg
                data-icon="Gear"
                viewBox="0 0 256 256"
                className="w-6 h-6"
                fill="currentColor"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
              <span>Settings</span>
            </p>
          </nav>
        </div>
        <div className="px-3">
          <a
            className="sidebar-link cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span>Logout</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
