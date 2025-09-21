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
//         "--brand-color": "#008080",
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

export default function ViewTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      try {
        const resp = await fetch(`http://localhost:5000/tests/${id}`);
        const data = await resp.json();
        if (resp.ok) {
          setTest(data);
        } else {
          alert("Failed to load test details");
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
      className="flex flex-col min-h-screen bg-gray-100 text-gray-900"
      style={{
        fontFamily: "'Public Sans', sans-serif",
        "--brand-color": "#008080",
        "--background-color": "#f7f9fc",
        "--surface-color": "#fff",
        "--text-primary": "#111",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3"
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-3">
          {/* Hamburger */}
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
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:shadow-none`}
        >
          <Sidebar />
        </aside>

        {/* Overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 md:ml-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 rounded-full border-gray-300 border-t-[var(--brand-color)] animate-spin"></div>
            </div>
          ) : !test ? (
            <p className="text-center text-gray-700">Test not found.</p>
          ) : (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-3xl font-bold mb-6">{test.testName}</h2>

              {/* Basic Info */}
              <div className="space-y-4">
                <p><strong>Description:</strong> {test.description || "—"}</p>
                <p><strong>Category:</strong> {test.category || "—"}</p>
                <p><strong>Price:</strong> ₹{test.price || "—"}</p>
                <p><strong>Status:</strong> {test.status || "—"}</p>
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
