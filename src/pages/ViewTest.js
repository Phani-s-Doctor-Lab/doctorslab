import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ViewTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`http://localhost:5000/tests/${id}`);
        const data = await res.json();
        console.log("Fetched test data:", data);
        if (res.ok) {
          setTest(data);
        } else {
          alert("Failed to load test details");
        }
      } catch (error) {
        console.error("Error loading test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading test details...</div>;
  }

  if (!test) {
    return <div className="p-10">Test not found.</div>;
  }

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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
        <h1 className="text-xl font-bold">View Test</h1>
      </header>

      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-40 py-10">
          <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-3xl font-bold mb-6">{test.testName}</h1>

            {/* Basic Info */}
            <div className="space-y-4">
              <p><strong>Description:</strong> {test.description || "--"}</p>
              <p><strong>Category:</strong> {test.category}</p>
              <p><strong>Price:</strong> ₹{test.price}</p>
              <p><strong>Status:</strong> {test.status}</p>
              <p><strong>Turnaround Time:</strong> {test.turnaroundTime || "--"}</p>
              <p><strong>Specimen Type:</strong> {test.specimenType || "--"}</p>
              <p><strong>Methodology:</strong> {test.methodology || "--"}</p>
              <p><strong>CPT Code:</strong> {test.cptCode || "--"}</p>
              <p><strong>LOINC Code:</strong> {test.loincCode || "--"}</p>
              <p><strong>Instructions:</strong> {test.instructions || "--"}</p>
            </div>

            {/* Parameters */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Parameters</h2>
              {test.parameters && test.parameters.length > 0 ? (
                test.parameters.map((param, index) => (
                  <div key={index} className="mb-4 border rounded-lg p-4 bg-gray-50">
                    <p><strong>Name:</strong> {param.name}</p>
                    <p><strong>Unit:</strong> {param.unit}</p>
                    <div className="mt-2">
                      <strong>Reference Ranges:</strong>
                      <ul className="list-disc ml-6">
                        {param.referenceRanges?.map((range, rIndex) => (
                          <li key={rIndex}>
                            {range.group}: {range.range}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No parameters defined.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/tests")}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => navigate(`/edit-test/${id}`)}
                className="rounded-full bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-opacity-90"
              >
                Edit Test
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
