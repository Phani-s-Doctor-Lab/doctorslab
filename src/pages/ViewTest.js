// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function ViewTestPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [test, setTest] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/tests/${id}`);
//         const data = await res.json();
//         console.log("Fetched test data:", data);
//         if (res.ok) {
//           setTest(data);
//         } else {
//           alert("Failed to load test details");
//         }
//       } catch (error) {
//         console.error("Error loading test:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTest();
//   }, [id]);

//   if (loading) {
//     return <div className="p-10">Loading test details...</div>;
//   }

//   if (!test) {
//     return <div className="p-10">Test not found.</div>;
//   }

//   return (
//     <div
//       className="flex min-h-screen flex-col bg-gray-100 text-[var(--text-primary)]"
//       style={{
//         "--brand-color": "#649ccd",
//         "--background-color": "#f7f9fc",
//         "--surface-color": "#ffffff",
//         "--text-primary": "#111518",
//         "--text-secondary": "#637988",
//         "--border-color": "#D3D3D3",
//         fontFamily: '"Public Sans", sans-serif',
//       }}
//     >
//       {/* Header */}
//       <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
//         <h1 className="text-xl font-bold">View Test</h1>
//       </header>

//       <div className="relative flex min-h-screen">
//         <Sidebar />
//         <main className="flex-1 px-40 py-10">
//           <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
//             <h1 className="text-3xl font-bold mb-6">{test.testName}</h1>

//             {/* Basic Info */}
//             <div className="space-y-4">
//               <p><strong>Description:</strong> {test.description || "--"}</p>
//               <p><strong>Category:</strong> {test.category}</p>
//               <p><strong>Price:</strong> ₹{test.price}</p>
//               <p><strong>Status:</strong> {test.status}</p>
//               <p><strong>Turnaround Time:</strong> {test.turnaroundTime || "--"}</p>
//               <p><strong>Specimen Type:</strong> {test.specimenType || "--"}</p>
//               <p><strong>Methodology:</strong> {test.methodology || "--"}</p>
//               <p><strong>CPT Code:</strong> {test.cptCode || "--"}</p>
//               <p><strong>LOINC Code:</strong> {test.loincCode || "--"}</p>
//               <p><strong>Instructions:</strong> {test.instructions || "--"}</p>
//             </div>

//             {/* Parameters */}
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold mb-3">Parameters</h2>
//               {test.parameters && test.parameters.length > 0 ? (
//                 test.parameters.map((param, index) => (
//                   <div key={index} className="mb-4 border rounded-lg p-4 bg-gray-50">
//                     <p><strong>Name:</strong> {param.name}</p>
//                     <p><strong>Unit:</strong> {param.unit}</p>
//                     <div className="mt-2">
//                       <strong>Reference Ranges:</strong>
//                       <ul className="list-disc ml-6">
//                         {param.referenceRanges?.map((range, rIndex) => (
//                           <li key={rIndex}>
//                             {range.group}: {range.range}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No parameters defined.</p>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-3 pt-6">
//               <button
//                 type="button"
//                 onClick={() => navigate("/tests")}
//                 className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
//               >
//                 Back
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate(`/edit-test/${id}`)}
//                 className="rounded-full bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-opacity-90"
//               >
//                 Edit Test
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from 'react-toastify';

export default function ViewTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    async function fetchTest() {
      try {
        const resp = await fetch(`${BACKEND_URL}/tests/${id}`);
        const data = await resp.json();
        if (resp.ok) {
          setTest(data);
        } else {
          toast.error(data.error || "Failed to fetch test.");
        }
      } catch (error) {
        console.error("Error fetching test:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, [id]);

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 text-gray-900"
      style={{
        fontFamily: "'Public Sans', sans-serif",
        "--brand-color": "#649ccd",
        "--background-color": "#f7f9fc",
        "--surface-color": "#fff",
        "--text-primary": "#111",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3"
      }}
    >
      {/* Header */}
      {/* <header className="sticky top-0 z-10 bg-white shadow flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-200"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">View Test</h1>
        </div>
      </header> */}

      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar and overlay */}
        <div
          className={`md:relative fixed md:h-full h-screen inset-y-0 left-0 z-30 w-64 bg-white border-r border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

        {/* Main content */}
        <main className="flex-1 bg-[#f0f5fa] overflow-auto p-6">
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 rounded-full border-gray-300 border-t-[var(--brand-color)] animate-spin"></div>
            </div>
          ) : !test ? (
            <p className="text-center text-gray-700">Test not found.</p>
          ) : (
            <div className="mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-3xl font-bold mb-6">{test.testName}</h2>

              {/* Basic Info */}
              <div className="space-y-4">
                <p><strong>Description:</strong> {test.description || "—"}</p>
                <p><strong>Category:</strong> {test.category || "—"}</p>
                <p><strong>Price:</strong> ₹{test.price || "—"}</p>
                {/* <p><strong>Status:</strong> {test.status || "—"}</p> */}
                <p><strong>Turnaround Time:</strong> {test.turnaroundTime || "—"}</p>
                <p><strong>Specimen Type:</strong> {test.specimenType || "—"}</p>
                <p><strong>Methodology:</strong> {test.methodology || "—"}</p>
                <p><strong>CPT Code:</strong> {test.cptCode || "—"}</p>
                <p><strong>LOINC Code:</strong> {test.loincCode || "—"}</p>
                <p><strong>Instructions:</strong> {test.instructions || "—"}</p>
              </div>

              {/* Parameters */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Parameters</h3>
                {test.parameters && test.parameters.length > 0 ? (
                  test.parameters.map((param, i) => (
                    <div key={i} className="border rounded-md p-4 mb-4 bg-gray-50">
                      <p><strong>Name:</strong> {param.name}</p>
                      <p><strong>Unit:</strong> {param.unit}</p>
                      <div className="mt-2">
                        <strong>Reference Ranges:</strong>
                        <ul className="list-disc ml-6">
                          {param.referenceRanges?.map((r, idx) => (
                            <li key={idx}>{r.group}: {r.range}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">No parameters defined.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => navigate("/tests")}
                  className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate(`/edit-test/${id}`)}
                  className="px-6 py-2 rounded-md bg-[var(--brand-color)] text-white hover:bg-green-700"
                >
                  Edit Test
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
