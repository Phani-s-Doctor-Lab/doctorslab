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
    <div className="h-full" style={{
        "--primary-color": "#008080",
        "--primary-light": "#e0f2f1",
        "--text-primary": "#111827",
        "--text-secondary": "#6b7280",
        "--background-color": "#f8f9fa",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}>
      <aside className="w-full md:w-64 h-full flex-shrink-0 sidebar p-4 flex flex-col justify-between bg-white border-r border-[var(--border-color)]">
        <div className="flex flex-col gap-8">
            <div>
                {/* Logo and Title */}
                <div className="flex items-center gap-2 px-3">
                    <svg
                    className="h-8 w-8 text-[var(--primary-color)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                    </svg>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">
                    Pathology Co.
                    </h1>
                </div>
            </div>

          <nav className="flex flex-col gap-2">
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/dashboard" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
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
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/patients" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
              onClick={() => navigate("/patients")}
            >
              <svg
                data-icon="Users"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="w-6 h-6"
              >
                <g>
                  <g>
                    <path
                      d="M180.033,198.373c-18.581,0-33.698,15.117-33.698,33.698c0,18.581,15.117,33.698,33.698,33.698
                            s33.698-15.117,33.698-33.698S198.614,198.373,180.033,198.373z M180.033,248.92c-9.29,0-16.849-7.557-16.849-16.849
                            c0-9.29,7.558-16.849,16.849-16.849s16.849,7.558,16.849,16.849C196.882,241.361,189.324,248.92,180.033,248.92z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M322.32,198.373c-18.581,0-33.698,15.117-33.698,33.698c0,18.581,15.117,33.698,33.698,33.698
                            s33.698-15.117,33.698-33.698S340.901,198.373,322.32,198.373z M322.32,248.92c-9.29,0-16.849-7.557-16.849-16.849
                            c0-9.29,7.558-16.849,16.849-16.849s16.849,7.558,16.849,16.849C339.169,241.361,331.61,248.92,322.32,248.92z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M511.977,197.558c-0.371-11.604-5.238-22.371-13.705-30.313c-8.467-7.944-19.516-12.117-31.125-11.745
                            c-11.604,0.37-22.371,5.237-30.37,13.765L419.823,187.7c-7.265-21.564-18.007-42.069-31.667-60.362
                            c16.002-7.06,27.204-23.068,27.204-41.651c0-25.092-20.414-45.507-45.507-45.507H69.958c-25.092,0-45.507,20.415-45.507,45.507
                            c0,25.093,20.414,45.508,45.507,45.508h299.834c16.896,20.825,29.558,45.16,36.85,70.834l-92.697,100.788
                            c-1.072,1.165-1.793,2.607-2.083,4.162l-6.461,34.733c-0.024,0.125-0.044,0.249-0.061,0.374l-1.966,14.053
                            c-13.378-3.98-28.962-6.159-45.432-6.159c-29.978,0-58.917,8.002-75.519,20.883c-3.676,2.852-4.345,8.144-1.493,11.82
                            c1.66,2.14,4.148,3.26,6.662,3.26c1.804,0,3.622-0.577,5.158-1.768c13.792-10.699,38.772-17.346,65.192-17.346
                            c18.214,0,35.34,2.972,48.466,8.131c0.481,0.25,0.984,0.454,1.503,0.608c5.759,2.394,10.691,5.222,14.519,8.419
                            c3.571,2.982,8.884,2.504,11.866-1.067c2.454-2.94,2.56-7.054,0.531-10.082l2.246-0.289c0.245-0.031,0.489-0.074,0.73-0.127
                            l35.254-7.72c1.69-0.37,3.227-1.252,4.399-2.526l16.059-17.461c-32.957,66.516-101.301,110.258-178.013,110.258
                            c-109.539-0.001-198.656-89.118-198.656-198.658c0-16.941,2.134-33.764,6.343-50c1.167-4.504-1.538-9.102-6.041-10.269
                            c-4.504-1.17-9.102,1.535-10.269,6.041C2.316,219.705,0,237.95,0,256.315c0,118.83,96.675,215.506,215.506,215.506
                            c97.901,0,183.23-65.692,208.28-160.016l76.447-83.121C508.178,220.217,512.348,209.162,511.977,197.558z M69.958,114.345
                            c-15.802,0-28.657-12.858-28.657-28.66s12.856-28.659,28.659-28.659h299.893c15.802,0,28.659,12.856,28.659,28.659
                            c0,15.803-12.856,28.66-28.659,28.66H69.958z M487.888,217.217L366.858,348.81l-32.293,7.072l-1.698,0.218l134.778-143.661
                            c3.183-3.393,3.014-8.725-0.38-11.909s-8.725-3.015-11.908,0.38l-132.993,141.76l5.623-30.23l94.186-102.406
                            c0.064-0.07,0.129-0.137,0.191-0.208l26.758-29.093c4.865-5.185,11.457-8.166,18.563-8.393c7.119-0.219,13.875,2.327,19.06,7.192
                            s8.166,11.457,8.393,18.563C495.365,205.201,492.81,211.97,487.888,217.217z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <circle cx="25.302" cy="174.07" r="8.424" />
                  </g>
                </g>
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
                        <path d="M43,9C33.6-0.3,18.4-0.3,9,9c-9.3,9.4-9.3,24.6,0,34c9.4,9.4,24.6,9.4,33.9,0C52.3,33.6,52.3,18.4,43,9z
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
            <p className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer  ${location.pathname === "/inventory" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`} onClick={() => navigate("/inventory")}>
              <svg
                data-icon="Inventory"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 7h6M9 11h6M9 15h6M9 19h6M9 23h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Inventory</span>
            </p>

            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/tests" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
              onClick={() => navigate("/tests")}
            >
              <svg
                data-icon="Tests"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  d="M6 21v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 8a3 3 0 1 1 6 0v10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M15 8h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
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
                        <path d="M53.79,33.1a.51.51,0,0,0,0-.4C52.83,30.89,45.29,17.17,32,16.84S11,30.61,9.92,32.65a.48.48,0,0,0,0,.48C11.1,35.06,19.35,48.05,29.68,49,41.07,50,50.31,42,53.79,33.1Z"/><circle cx="31.7" cy="32.76" r="6.91"/>
                    </svg>
                    <span>View Test</span>
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
                        <path d="M21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4h6a1,1,0,0,0,0-2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM6,12.76V17a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29l6.92-6.93h0L21.71,8a1,1,0,0,0,0-1.42L17.47,2.29a1,1,0,0,0-1.42,0L13.23,5.12h0L6.29,12.05A1,1,0,0,0,6,12.76ZM16.76,4.41l2.83,2.83L18.17,8.66,15.34,5.83ZM8,13.17l5.93-5.93,2.83,2.83L10.83,16H8Z" stroke="currentColor"
                        />
                    </svg>
                    <span>Edit Test</span>
                </p>
            )}
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/staff" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
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
            <p className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/reports" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
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
              <span>Reports</span>
            </p>
            <p
              className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer ${location.pathname === "/settings" ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-medium active" : ""}`}
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
