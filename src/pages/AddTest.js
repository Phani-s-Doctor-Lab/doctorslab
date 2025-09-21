// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function AddTestPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isFromPatientForm = location.state?.fromPatientForm;
//   const isFromPatientTestManager = location.state?.fromPatientTestManager;
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
//   });

//   const [parameters, setParameters] = useState([
//     { name: "", unit: "", referenceRange: [] },
//   ]);

//   // Handle field change
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Add parameter row
//   const addParameter = () => {
//     setParameters([...parameters, { name: "", unit: "", referenceRange: [] }]);
//   };

//   // Update parameter values
//   const handleParameterChange = (index, field, value) => {
//     const updated = [...parameters];
//     updated[index][field] = value;
//     setParameters(updated);
//   };

//   const handleDone = (newlyAddedTest) => {
//     if (isFromPatientForm) {
//       // return to patient-form with new test and previous form state
//       navigate("/patient-form", {
//         state: {
//           ...location.state, // preserves all previous patient form state
//           newlyAddedTest, // or whatever your new test is called
//         }
//       });
//     } else if (isFromPatientTestManager) {
//       // return to patient-test-manager with new test and previous form state
//       navigate("/patients", {
//         state: {
//           ...location.state, // preserves all previous patient test manager state
//           newlyAddedTest, // or whatever your new test is called
//         }
//       });
//     } else {
//       // Don't redirect; maybe show a success message or navigate elsewhere
//       // Example: back to all-tests page
//       navigate("/tests");
//     }
//   }

//   const handleCancel = () => {
//     if (isFromPatientForm) {
//       navigate("/patient-form", { state: { ...location.state } });
//     } else if (isFromPatientTestManager) {
//       navigate("/patients", { state: { ...location.state } });
//     } else {
//       navigate("/tests");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       price: Number(formData.price), // ensure number
//       parameters,
//       status: "active",
//     };

//     try {
//       const response = await fetch("http://localhost:5000/tests", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         handleDone(data.testId);
//         // Reset form
//         setFormData({
//           testName: "",
//           description: "",
//           category: "",
//           price: "",
//           turnaroundTime: "",
//           specimenType: "",
//           methodology: "",
//           cptCode: "",
//           loincCode: "",
//         });
//         setParameters([{ name: "", unit: "", referenceRange: "" }]);
//       } else {
//         alert("Error: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       alert("Something went wrong while adding the test.");
//     }
//   };

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
//       <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl font-bold">Pathology Services</h1>
//         </div>
//       </header>

//       <div className="relative flex min-h-screen">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main */}
//         <main className="flex-1 px-40 py-10">
//           <div className="mx-auto max-w-3xl">
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-primary-900">
//                 Add New Test
//               </h1>
//               <p className="text-gray-500 mt-1">
//                 Fill in the details below to add a new test to the system.
//               </p>
//             </div>

//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* Basic Info */}
//               <div>
//                 <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                   Test Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.testName}
//                   onChange={(e) => handleChange("testName", e.target.value)}
//                   placeholder="e.g., Complete Blood Count"
//                   className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                   Description
//                 </label>
//                 <textarea
//                   rows="3"
//                   value={formData.description}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                   placeholder="Provide a brief description of the test..."
//                   className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     Category
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleChange("category", e.target.value)}
//                     className="form-select w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                     required
//                   >
//                     <option value="">Select category</option>
//                     <option>Hematology</option>
//                     <option>Biochemistry</option>
//                     <option>Microbiology</option>
//                     <option>Pathology</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) => handleChange("price", e.target.value)}
//                     placeholder="e.g., 500"
//                     className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     Turnaround Time
//                   </label>
//                   <select
//                     value={formData.turnaroundTime}
//                     onChange={(e) =>
//                       handleChange("turnaroundTime", e.target.value)
//                     }
//                     className="form-select w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   >
//                     <option value="">Select time</option>
//                     <option>24 Hours</option>
//                     <option>48 Hours</option>
//                     <option>72 Hours</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                     Specimen Type
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.specimenType}
//                     onChange={(e) =>
//                       handleChange("specimenType", e.target.value)
//                     }
//                     placeholder="e.g., Blood, Urine"
//                     className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-primary-900 pb-1.5">
//                   Methodology
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.methodology}
//                   onChange={(e) => handleChange("methodology", e.target.value)}
//                   placeholder="e.g., Microscopy, Colorimetric"
//                   className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
//                 />
//               </div>

//               {/* Parameters Section */}
//             <div>
//             <h3 className="text-lg font-semibold text-primary-900 mb-3">
//                 Parameters
//             </h3>
//             {parameters.map((param, index) => (
//                 <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
//                 {/* Parameter Basic Info */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
//                     <input
//                     type="text"
//                     placeholder="Parameter Name"
//                     value={param.name}
//                     onChange={(e) =>
//                         handleParameterChange(index, "name", e.target.value)
//                     }
//                     className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                     />
//                     <input
//                     type="text"
//                     placeholder="Units"
//                     value={param.unit}
//                     onChange={(e) =>
//                         handleParameterChange(index, "unit", e.target.value)
//                     }
//                     className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                     />
//                 </div>

//                 {/* Reference Ranges */}
//                 <h4 className="text-sm font-semibold text-primary-800 mb-2">
//                     Reference Ranges
//                 </h4>
//                 {param.referenceRanges?.map((range, rIndex) => (
//                     <div key={rIndex} className="grid grid-cols-2 gap-4 mb-2">
//                     <input
//                         type="text"
//                         placeholder="Group (e.g., Adults)"
//                         value={range.group}
//                         onChange={(e) => {
//                         const updated = [...parameters];
//                         updated[index].referenceRanges[rIndex].group = e.target.value;
//                         setParameters(updated);
//                         }}
//                         className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Range (e.g., 11–35)"
//                         value={range.range}
//                         onChange={(e) => {
//                         const updated = [...parameters];
//                         updated[index].referenceRanges[rIndex].range = e.target.value;
//                         setParameters(updated);
//                         }}
//                         className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
//                     />
//                     </div>
//                 ))}

//                 {/* Add Range Button */}
//                 <button
//                     type="button"
//                     onClick={() => {
//                     const updated = [...parameters];
//                     if (!updated[index].referenceRanges) {
//                         updated[index].referenceRanges = [];
//                     }
//                     updated[index].referenceRanges.push({ group: "", range: "" });
//                     setParameters(updated);
//                     }}
//                     className="mt-2 flex items-center gap-2 rounded-full border border-primary-300 px-3 py-1 text-xs text-primary-700 hover:bg-primary-100"
//                 >
//                     + Add Reference Range
//                 </button>
//                 </div>
//             ))}

//             {/* Add Parameter Button */}
//             <button
//                 type="button"
//                 onClick={addParameter}
//                 className="mt-4 flex items-center gap-2 rounded-full border border-primary-300 px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
//             >
//                 <span className="material-icons-outlined text-base">Add Parameter</span>
//             </button>
//             </div>

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
//                     Instructions
//                 </label>
//                 <textarea
//                     rows="3"
//                     value={formData.instructions}
//                     onChange={(e) => handleChange("instructions", e.target.value)}
//                     placeholder="e.g., Patient should fast for 8 hours before test"
//                     className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3 pt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="rounded-full bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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

export default function AddTestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isFromPatientForm = location.state?.fromPatientForm;
  const isFromPatientTestManager = location.state?.fromPatientTestManager;
  
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
  });

  const [parameters, setParameters] = useState([
    { name: "", unit: "", referenceRange: [] },
  ]);

  const [saving, setSaving] = useState(false);

  // Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add parameter row
  const addParameter = () => {
    setParameters([...parameters, { name: "", unit: "", referenceRange: [] }]);
  };

  // Remove parameter
  const removeParameter = (index) => {
    const updated = parameters.filter((_, i) => i !== index);
    setParameters(updated);
  };

  // Update parameter values
  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  // Add reference range
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

  const handleDone = (newlyAddedTest) => {
    if (isFromPatientForm) {
      navigate("/patient-form", {
        state: {
          ...location.state,
          newlyAddedTest,
        }
      });
    } else if (isFromPatientTestManager) {
      navigate("/patients", {
        state: {
          ...location.state,
          newlyAddedTest,
        }
      });
    } else {
      navigate("/tests");
    }
  };

  const handleCancel = () => {
    if (isFromPatientForm) {
      navigate("/patient-form", { state: { ...location.state } });
    } else if (isFromPatientTestManager) {
      navigate("/patients", { state: { ...location.state } });
    } else {
      navigate("/tests");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      parameters,
      status: "active",
    };

    try {
      const response = await fetch("http://localhost:5000/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Test added successfully!");
        handleDone(data.testId);
        // Reset form
        setFormData({
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
        });
        setParameters([{ name: "", unit: "", referenceRange: [] }]);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Something went wrong while adding the test.");
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
      className="relative flex min-h-screen bg-[var(--background-color)]"
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
      {/* Loading Overlay */}
      {saving && <LoadingOverlay message="Adding test..." />}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="w-full h-full">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-color)] px-4 py-3 shadow-sm lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="lg:hidden p-2 rounded-md hover:bg-gray-200 transition"
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
            <h1 className="text-lg sm:text-xl font-bold">Pathology Services</h1>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Add New Test
              </h1>
              <p className="text-gray-500 mt-1">
                Fill in the details below to add a new test to the system.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-[var(--border-color)]">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Test Name</label>
                    <input
                      type="text"
                      value={formData.testName}
                      onChange={(e) => handleChange("testName", e.target.value)}
                      placeholder="e.g., Complete Blood Count"
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
                      placeholder="Provide a brief description of the test..."
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                        required
                      >
                        <option value="">Select category</option>
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
                        placeholder="e.g., 500"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Turnaround Time</label>
                      <select
                        value={formData.turnaroundTime}
                        onChange={(e) => handleChange("turnaroundTime", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                      >
                        <option value="">Select time</option>
                        <option>24 Hours</option>
                        <option>48 Hours</option>
                        <option>72 Hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Specimen Type</label>
                      <input
                        type="text"
                        value={formData.specimenType}
                        onChange={(e) => handleChange("specimenType", e.target.value)}
                        placeholder="e.g., Blood, Urine"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Methodology</label>
                    <input
                      type="text"
                      value={formData.methodology}
                      onChange={(e) => handleChange("methodology", e.target.value)}
                      placeholder="e.g., Microscopy, Colorimetric"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                    />
                  </div>
                </div>
              </div>

              {/* Parameters Section */}
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
                          onChange={(e) => handleParameterChange(index, "name", e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                        />
                        <input
                          type="text"
                          placeholder="Units"
                          value={param.unit}
                          onChange={(e) => handleParameterChange(index, "unit", e.target.value)}
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
                      rows="3"
                      value={formData.instructions}
                      onChange={(e) => handleChange("instructions", e.target.value)}
                      placeholder="e.g., Patient should fast for 8 hours before test"
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}