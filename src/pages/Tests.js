import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      className="relative flex min-h-screen bg-[var(--background-color)]"
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
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[var(--border-color)] shadow-lg h-screen flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 lg:ml-28">
        {/* Header */}
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

          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[var(--brand-color)]"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              />
            </svg>
            Pathology Services
          </h1>
        </header>

        {/* Card Wrapper */}
        <div className="mx-auto w-full max-w-screen-lg rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
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
  );
};

export default Tests;
