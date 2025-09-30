import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ViewPackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState(null);

  const userName =
    localStorage.getItem("userName") ||
    sessionStorage.getItem("userName") ||
    "";

  useEffect(() => {
    async function fetchPackage() {
      try {
        const resp = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await resp.json();
        if (resp.ok) {
          setPackageData(data);
        } else {
          alert("Failed to load package details");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [id]);

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  const toggleTestExpand = (testId) => {
    setExpandedTestId(expandedTestId === testId ? null : testId);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 text-gray-900"
      style={{
        fontFamily: "'Public Sans', sans-serif",
        "--brand-color": "#008080",
        "--background-color": "#f7f9fc",
        "--surface-color": "#fff",
        "--text-primary": "#111",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3",
      }}
    >
      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar and overlay */}
        <div
          className={`md:relative fixed md:h-full h-screen inset-y-0 left-0 z-30 w-64 bg-white border-r border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            aria-hidden="true"
          />
        )}

        <main className="flex-grow bg-[#f0f4f7] overflow-auto p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <button
              className="md:hidden p-2 -ml-2 text-[var(--text-primary)]"
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
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
              Package Details
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

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 rounded-full border-gray-300 border-t-[var(--brand-color)] animate-spin"></div>
            </div>
          ) : !packageData ? (
            <p className="text-center text-gray-700">Package not found.</p>
          ) : (
            <div className="mx-auto bg-white rounded-lg shadow p-6 max-w-4xl">
              <h2 className="text-3xl font-bold mb-6">{packageData.name}</h2>

              <div className="space-y-4">
                <p>
                  <strong>Price:</strong> ₹{packageData.price || "—"}
                </p>
                <p>
                  <strong>Turnaround Time:</strong>{" "}
                  {packageData.turnaroundTime || "—"} hours
                </p>
                <p>
                  <strong>Status:</strong> {packageData.status || "—"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(packageData.createdAt).toLocaleString() || "—"}
                </p>
                {packageData.updatedAt && (
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(packageData.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Tests in Package</h3>
                {packageData.tests && packageData.tests.length > 0 ? (
                  <ul className="list-none list-inside space-y-2">
                    {packageData.tests.map((test, i) => {
                      const testId = test.id || i;
                      const expanded = expandedTestId === testId;

                      return (
                        <li
                          key={testId}
                          className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
                          onClick={() => toggleTestExpand(testId)}
                          aria-expanded={expanded}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>
                              {test.testName} - ₹{test.price || "—"}{" "}
                              {test.turnaroundTime
                                ? `(${test.turnaroundTime})`
                                : ""}
                            </span>
                            <span className="ml-2 text-[var(--brand-color)] select-none">
                              {expanded ? "▼" : "►"}
                            </span>
                          </div>
                          {expanded && (
                            <div className="mt-2 p-3 bg-gray-50 rounded shadow space-y-2 text-sm">
                              <p>
                                <strong>Description:</strong>{" "}
                                {test.description || "—"}
                              </p>
                              <p>
                                <strong>Category:</strong>{" "}
                                {test.category || "—"}
                              </p>
                              <p>
                                <strong>Status:</strong> {test.status || "—"}
                              </p>
                              <p>
                                <strong>Specimen Type:</strong>{" "}
                                {test.specimenType || "—"}
                              </p>
                              <p>
                                <strong>Methodology:</strong>{" "}
                                {test.methodology || "—"}
                              </p>
                              <p>
                                <strong>CPT Code:</strong> {test.cptCode || "—"}
                              </p>
                              <p>
                                <strong>LOINC Code:</strong>{" "}
                                {test.loincCode || "—"}
                              </p>
                              <p>
                                <strong>Instructions:</strong>{" "}
                                {test.instructions || "—"}
                              </p>
                              {test.parameters &&
                                test.parameters.length > 0 && (
                                  <>
                                    <h4 className="font-semibold mt-4">
                                      Parameters:
                                    </h4>
                                    {test.parameters.map((param, idx) => (
                                      <div key={idx} className="pl-4">
                                        <p>
                                          <strong>Name:</strong> {param.name}
                                        </p>
                                        <p>
                                          <strong>Unit:</strong> {param.unit}
                                        </p>
                                        {param.referenceRanges && (
                                          <>
                                            <p>
                                              <strong>Reference Ranges:</strong>
                                            </p>
                                            <ul className="list-disc list-inside ml-6">
                                              {param.referenceRanges.map(
                                                (r, idx2) => (
                                                  <li key={idx2}>
                                                    {r.group}: {r.range}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </>
                                )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-700">
                    No tests found in this package.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => navigate("/tests")}
                  className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
