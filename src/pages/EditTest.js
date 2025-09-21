// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import YesNoSwitch from "../components/YesNoSwitch";

// export default function EditTestPage() {
//   const { id } = useParams(); // testId from route
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     testName: "",
//     description: "",
//     category: "",
//     price: "",
//     turnaroundTime: "",
//     specimenType: "",
//     methodology: "",
//     cptCode: "",
//     loincCode: "",
//     instructions: "",
//     status: "",
//   });

//   const [parameters, setParameters] = useState([
//     { name: "", unit: "", referenceRanges: [] },
//   ]);

//   const [loading, setLoading] = useState(true);

//   // Fetch test details
//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/tests/${id}`);
//         const data = await res.json();
//         if (res.ok) {
//           setFormData({
//             testName: data.testName,
//             description: data.description,
//             category: data.category,
//             price: data.price,
//             turnaroundTime: data.turnaroundTime,
//             specimenType: data.specimenType,
//             methodology: data.methodology,
//             cptCode: data.cptCode,
//             loincCode: data.loincCode,
//             instructions: data.instructions || "",
//             status: data.status,
//           });
//           setParameters(data.parameters || []);
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

//   // Handle field change
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Update parameter values
//   const handleParameterChange = (index, field, value) => {
//     const updated = [...parameters];
//     updated[index][field] = value;
//     setParameters(updated);
//   };

//   // Add parameter
//   const addParameter = () => {
//     setParameters([...parameters, { name: "", unit: "", referenceRanges: [] }]);
//   };

//   // Add reference range inside a parameter
//   const addReferenceRange = (index) => {
//     const updated = [...parameters];
//     if (!updated[index].referenceRanges) {
//       updated[index].referenceRanges = [];
//     }
//     updated[index].referenceRanges.push({ group: "", range: "" });
//     setParameters(updated);
//   };

//   // Submit edited test
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       price: Number(formData.price),
//       parameters,
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/tests/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert("Test updated successfully!");
//         navigate("/tests");
//       } else {
//         alert("Error: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error updating test:", error);
//       alert("Something went wrong while updating the test.");
//     }
//   };

//   if (loading) {
//     return <div className="p-10">Loading test details...</div>;
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
//         <h1 className="text-xl font-bold">Edit Test</h1>
//       </header>

//       <div className="relative flex min-h-screen">
//         <Sidebar />
//         <main className="flex-1 px-40 py-10">
//           <div className="mx-auto max-w-3xl">
//             <h1 className="text-3xl font-bold mb-6">Edit {formData.testName}</h1>

//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* Basic Info */}
//               <div>
//                 <label className="block text-sm font-medium">Test Name</label>
//                 <input
//                   type="text"
//                   value={formData.testName}
//                   onChange={(e) => handleChange("testName", e.target.value)}
//                   className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Description</label>
//                 <textarea
//                   rows="3"
//                   value={formData.description}
//                   onChange={(e) =>
//                     handleChange("description", e.target.value)
//                   }
//                   className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
//                 />
//               </div>

//               {/* Status */}
//             <div className="flex items-center justify-between">
//             <label className="block text-sm font-medium">Status</label>
//             <YesNoSwitch
//                 checked={formData.status === "active"}
//                 onChange={(newChecked) =>
//                 handleChange("status", newChecked ? "active" : "inactive")
//                 }
//             />
//             </div>

//               {/* Category & Price */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium">Category</label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleChange("category", e.target.value)}
//                     className="form-select w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   >
//                     <option>Hematology</option>
//                     <option>Biochemistry</option>
//                     <option>Microbiology</option>
//                     <option>Pathology</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Price</label>
//                   <input
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) => handleChange("price", e.target.value)}
//                     className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Parameters */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Parameters</h3>
//                 {parameters.map((param, index) => (
//                   <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
//                       <input
//                         type="text"
//                         placeholder="Parameter Name"
//                         value={param.name}
//                         onChange={(e) =>
//                           handleParameterChange(index, "name", e.target.value)
//                         }
//                         className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                       />
//                       <input
//                         type="text"
//                         placeholder="Units"
//                         value={param.unit}
//                         onChange={(e) =>
//                           handleParameterChange(index, "unit", e.target.value)
//                         }
//                         className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                       />
//                     </div>

//                     <h4 className="text-sm font-semibold mb-2">
//                       Reference Ranges
//                     </h4>
//                     {param.referenceRanges?.map((range, rIndex) => (
//                       <div key={rIndex} className="grid grid-cols-2 gap-4 mb-2">
//                         <input
//                           type="text"
//                           placeholder="Group (e.g., Adults)"
//                           value={range.group}
//                           onChange={(e) => {
//                             const updated = [...parameters];
//                             updated[index].referenceRanges[rIndex].group =
//                               e.target.value;
//                             setParameters(updated);
//                           }}
//                           className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Range (e.g., 11–35)"
//                           value={range.range}
//                           onChange={(e) => {
//                             const updated = [...parameters];
//                             updated[index].referenceRanges[rIndex].range =
//                               e.target.value;
//                             setParameters(updated);
//                           }}
//                           className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                         />
//                       </div>
//                     ))}

//                     <button
//                       type="button"
//                       onClick={() => addReferenceRange(index)}
//                       className="mt-2 text-xs text-primary-700 hover:underline"
//                     >
//                       + Add Reference Range
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   onClick={addParameter}
//                   className="mt-4 flex items-center gap-2 rounded-full border border-primary-300 px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
//                 >
//                   + Add Parameter
//                 </button>
//               </div>

//               {/* Codes */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     CPT Code
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.cptCode}
//                     onChange={(e) => handleChange("cptCode", e.target.value)}
//                     placeholder="Enter CPT code"
//                     className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     LOINC Code
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.loincCode}
//                     onChange={(e) => handleChange("loincCode", e.target.value)}
//                     placeholder="Enter LOINC code"
//                     className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Instructions */}
//               <div>
//                 <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                   Instructions
//                 </label>
//                 <textarea
//                   rows="3"
//                   value={formData.instructions}
//                   onChange={(e) => handleChange("instructions", e.target.value)}
//                   placeholder="e.g., Patient should fast for 8 hours before test"
//                   className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
//                 />
//               </div>

//               {/* Save / Cancel */}
//               <div className="flex justify-end gap-3 pt-6">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/tests")}
//                   className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="rounded-full bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-opacity-90"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import YesNoSwitch from "../components/YesNoSwitch";

// Loading Spinner Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-3 border-gray-300 border-t-[var(--brand-color)]`}></div>
    </div>
  );
};

// Loading Overlay Component
const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
      <LoadingSpinner />
      <span className="text-gray-700">{message}</span>
    </div>
  </div>
);

export default function EditTestPage() {
  const { id } = useParams(); // testId from route
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    category: "",
    price: "",
    turnaroundTime: "",
    specimenType: "",
    methodology: "",
    cptCode: "",
    loincCode: "",
    instructions: "",
    status: "",
  });

  const [parameters, setParameters] = useState([
    { name: "", unit: "", referenceRanges: [] },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch test details
  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/tests/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            testName: data.testName,
            description: data.description,
            category: data.category,
            price: data.price,
            turnaroundTime: data.turnaroundTime,
            specimenType: data.specimenType,
            methodology: data.methodology,
            cptCode: data.cptCode,
            loincCode: data.loincCode,
            instructions: data.instructions || "",
            status: data.status,
          });
          setParameters(data.parameters || []);
        } else {
          alert("Failed to load test details");
        }
      } catch (error) {
        console.error("Error loading test:", error);
        alert("Error loading test details");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update parameter values
  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  // Add parameter
  const addParameter = () => {
    setParameters([...parameters, { name: "", unit: "", referenceRanges: [] }]);
  };

  // Remove parameter
  const removeParameter = (index) => {
    const updated = parameters.filter((_, i) => i !== index);
    setParameters(updated);
  };

  // Add reference range inside a parameter
  const addReferenceRange = (index) => {
    const updated = [...parameters];
    if (!updated[index].referenceRanges) {
      updated[index].referenceRanges = [];
    }
    updated[index].referenceRanges.push({ group: "", range: "" });
    setParameters(updated);
  };

  // Remove reference range
  const removeReferenceRange = (paramIndex, rangeIndex) => {
    const updated = [...parameters];
    updated[paramIndex].referenceRanges.splice(rangeIndex, 1);
    setParameters(updated);
  };

  // Submit edited test
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      parameters,
    };

    try {
      const response = await fetch(`http://localhost:5000/tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Test updated successfully!");
        navigate("/tests");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Something went wrong while updating the test.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className="relative flex flex-col h-screen bg-[var(--background-color)]"
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
        {/* Loading Overlay */}
        {saving && <LoadingOverlay message="Saving changes..." />}

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

          {/* Content Area */}
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="mt-4 text-gray-600">Loading test details...</p>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Edit {formData.testName}</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Basic Info */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-[var(--border-color)]">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Test Name</label>
                        <input
                          type="text"
                          value={formData.testName}
                          onChange={(e) => handleChange("testName", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          rows="3"
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                        />
                      </div>

                      {/* Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <label className="block text-sm font-medium">Status</label>
                        <YesNoSwitch
                          checked={formData.status === "active"}
                          onChange={(newChecked) =>
                            handleChange("status", newChecked ? "active" : "inactive")
                          }
                        />
                      </div>

                      {/* Category & Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                          >
                            <option>Hematology</option>
                            <option>Biochemistry</option>
                            <option>Microbiology</option>
                            <option>Pathology</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Price</label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange("price", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parameters */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-[var(--border-color)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <h3 className="text-lg font-semibold">Parameters</h3>
                      <button
                        type="button"
                        onClick={addParameter}
                        className="flex items-center gap-2 rounded-lg border border-[var(--brand-color)] px-3 py-2 text-sm text-[var(--brand-color)] hover:bg-teal-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Parameter
                      </button>
                    </div>

                    <div className="space-y-4">
                      {parameters.map((param, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                            <h4 className="text-sm font-semibold">Parameter {index + 1}</h4>
                            {parameters.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeParameter(index)}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <input
                              type="text"
                              placeholder="Parameter Name"
                              value={param.name}
                              onChange={(e) =>
                                handleParameterChange(index, "name", e.target.value)
                              }
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                            />
                            <input
                              type="text"
                              placeholder="Units"
                              value={param.unit}
                              onChange={(e) =>
                                handleParameterChange(index, "unit", e.target.value)
                              }
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                            />
                          </div>

                          <div className="mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                              <h5 className="text-sm font-medium">Reference Ranges</h5>
                              <button
                                type="button"
                                onClick={() => addReferenceRange(index)}
                                className="text-xs text-[var(--brand-color)] hover:underline flex items-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Reference Range
                              </button>
                            </div>

                            <div className="space-y-2">
                              {param.referenceRanges?.map((range, rIndex) => (
                                <div key={rIndex} className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    placeholder="Group (e.g., Adults)"
                                    value={range.group}
                                    onChange={(e) => {
                                      const updated = [...parameters];
                                      updated[index].referenceRanges[rIndex].group = e.target.value;
                                      setParameters(updated);
                                    }}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Range (e.g., 11–35)"
                                    value={range.range}
                                    onChange={(e) => {
                                      const updated = [...parameters];
                                      updated[index].referenceRanges[rIndex].range = e.target.value;
                                      setParameters(updated);
                                    }}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeReferenceRange(index, rIndex)}
                                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-[var(--border-color)]">
                    <h2 className="text-lg font-semibold mb-4">Additional Information</h2>

                    <div className="space-y-4">
                      {/* Codes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">CPT Code</label>
                          <input
                            type="text"
                            value={formData.cptCode}
                            onChange={(e) => handleChange("cptCode", e.target.value)}
                            placeholder="Enter CPT code"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">LOINC Code</label>
                          <input
                            type="text"
                            value={formData.loincCode}
                            onChange={(e) => handleChange("loincCode", e.target.value)}
                            placeholder="Enter LOINC code"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                          />
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Instructions</label>
                        <textarea
                          rows="6"
                          value={formData.instructions}
                          onChange={(e) => handleChange("instructions", e.target.value)}
                          placeholder="e.g., Patient should fast for 8 hours before test"
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/tests")}
                      className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 text-base font-bold text-white bg-[var(--brand-color)] rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving && <LoadingSpinner size="small" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}