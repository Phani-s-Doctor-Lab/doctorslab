import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

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
      className="flex min-h-screen flex-col bg-gray-100 text-[var(--text-primary)]"
      style={{
        "--brand-color": "#008080",
        "--background-color": "#f7f9fc",
        "--surface-color": "#ffffff",
        "--text-primary": "#111518",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3",
        fontFamily: '"Public Sans", sans-serif',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <svg
            className="h-8 w-8 text-[var(--brand-color)]"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-xl font-bold">Pathology Services</h1>
        </div>
      </header>

      <div className="relative flex flex-col min-h-screen md:flex-row">
        <Sidebar />

        {/* <main className="min-w-[calc(100vw-25vw)] px-4 py-8 sm:px-6 lg:px-8"> */}
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-screen-lg rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
            <h2 className="mb-6 text-3xl font-bold tracking-tight">
              Tests Available In The Lab
            </h2>

            <div className="mt-10">
              {loading ? (
                <p>Loading tests...</p>
              ) : tests.length === 0 ? (
                <p className="text-gray-500">No tests found.</p>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg border border-[var(--border-color)]">
                  <table className="w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                          Test Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] bg-[var(--surface-color)]">
                      {tests.map((test) => (
                        <tr key={test.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                            <button
                              className="text-[var(--brand-color)] hover:text-teal-600"
                              onClick={() => navigate(`/view-test/${test.id}`)}
                            >
                              {test.testName}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                            {test.description || "--"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                            {test.price ? `₹${test.price}` : "--"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              className="text-[var(--brand-color)] hover:text-teal-600"
                              onClick={() => navigate(`/edit-test/${test.id}`)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/add-test")}
                  className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--border-color)]"
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
