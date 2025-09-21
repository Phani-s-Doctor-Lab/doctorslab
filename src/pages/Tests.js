import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  // Fetch tests from backend
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("http://localhost:5000/tests");
        const data = await res.json();
        setTests(data.tests || []);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div
      className="relative flex flex-col h-screen bg-[var(--background-color)]"
      style={{
        "--brand-color": "#008080",
        "--primary-light": "#e0f2f1",
        "--background-color": "#f7f9fc",
        "--surface-color": "#ffffff",
        "--text-primary": "#111518",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      {/* <header className="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-6 py-3 shadow-sm sm:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="md:hidden p-2 rounded-md hover:bg-gray-200 transition"
          >
            <svg
              className="h-6 w-6 text-[var(--text-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Manage Patient Tests</h1>
        </div>
      </header> */}
      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`md:relative fixed md:h-full h-screen inset-y-0 left-0 z-30 w-64 bg-white border-r border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <Sidebar />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-grow bg-[#f0f4f7] overflow-auto p-6">
          <header className="flex items-center justify-between mb-8">
              <button
                className="md:hidden p-2 -ml-2 text-[var(--text-primary)]"
                aria-label="Toggle sidebar"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Test Management
              </h1>

              <div className="flex items-center gap-4">
                <div className="relative group flex items-center">
                  <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.01-6 4.5V20h12v-1.5c0-2.49-2.69-4.5-6-4.5z"
                      />
                    </svg>
                  </span>
                  <div
                    className="absolute right-full mr-2 bottom-1/2 translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50"
                    style={{ minWidth: "5rem" }}
                  >
                    {userName || "No Name"}
                  </div>
                </div>
              </div>
            </header>

          {/* Card Wrapper */}
          <div className="mx-auto w-full rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
            <h2 className="mb-6 text-2xl lg:text-3xl font-bold tracking-tight">
              Tests Available In The Lab
            </h2>

            <div className="mt-6">
              {loading ? (
                // Skeleton Loader
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 w-full rounded-md bg-gray-200"
                    ></div>
                  ))}
                </div>
              ) : tests.length === 0 ? (
                <p className="text-gray-500">No tests found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-[var(--primary-light)] rounded-lg p-4 shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {test.testName}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-3">
                        {test.description || "--"}
                      </p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                        Price: {test.price ? `₹${test.price}` : "--"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                          onClick={() => navigate(`/view-test/${test.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                          onClick={() => navigate(`/edit-test/${test.id}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/add-test")}
                  className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--brand-color)] px-4 py-2 text-sm font-bold text-white hover:bg-teal-900 transition-colors shadow-md"
                >
                  <span className="material-icons text-base">Add Test</span>

                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tests;
