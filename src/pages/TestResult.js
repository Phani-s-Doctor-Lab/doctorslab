// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const LETTERHEAD_URL = "/images/DOCTORS LAB LETTER HEAD - Copy.png"; // Update path as needed

// function ReagentUsageForm({ inventory, usageList, setUsageList }) {
//   const [filters, setFilters] = useState(usageList.map(() => ''));

//   const addUsageRow = () => {
//     setUsageList([...usageList, { itemId: '', quantity: '' }]);
//     setFilters([...filters, '']);
//   };

//   const removeUsageRow = (index) => {
//     setUsageList(usageList.filter((_, i) => i !== index));
//     setFilters(filters.filter((_, i) => i !== index));
//   };

//   const handleItemChange = (index, itemId) => {
//     const newUsageList = [...usageList];
//     newUsageList[index].itemId = itemId;
//     if (!newUsageList[index].quantity) newUsageList[index].quantity = '';
//     setUsageList(newUsageList);
//   };

//   const handleQuantityChange = (index, quantity) => {
//     if (quantity === '' || /^\d+$/.test(quantity)) {
//       const newUsageList = [...usageList];
//       newUsageList[index].quantity = quantity;
//       setUsageList(newUsageList);
//     }
//   };

//   const handleFilterChange = (index, filterText) => {
//     const newFilters = [...filters];
//     newFilters[index] = filterText;
//     setFilters(newFilters);
//   };

//   return (
//     <div className="space-y-6">
//       {usageList.map((usage, i) => {
//         const lowerFilter = filters[i]?.toLowerCase() || '';
//         const filteredInventory = inventory.filter(item => {
//           const notAlreadySelected = usageList.every(
//             (u, idx) => idx === i || u.itemId !== item.id
//           );
//           return notAlreadySelected && item.item.toLowerCase().includes(lowerFilter);
//         });

//         const currentSelected = inventory.find(item => item.id === usage.itemId);
//         if (currentSelected && !filteredInventory.includes(currentSelected)) {
//           filteredInventory.unshift(currentSelected);
//         }

//         return (
//           <div key={i} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded shadow">
//             <div className="col-span-5">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Reagent</label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Search reagent..."
//                 value={filters[i] || ''}
//                 onChange={e => handleFilterChange(i, e.target.value)}
//                 onBlur={e => {
//                   const name = e.target.value.trim();
//                   const item = inventory.find(inv => inv.item === name);
//                   if (item) handleItemChange(i, item.id);
//                 }}
//                 list={`inventory-list-${i}`}
//               />
//               <datalist id={`inventory-list-${i}`}>
//                 {filteredInventory.map(item => (
//                   <option key={item.id} value={item.item} data-id={item.id} />
//                 ))}
//               </datalist>
//             </div>

//             <div className="col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Used</label>
//               <input
//                 type="number"
//                 min="0"
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., 5"
//                 value={usage.quantity}
//                 onChange={e => handleQuantityChange(i, e.target.value)}
//                 disabled={!usage.itemId}
//               />
//             </div>

//             <div className="col-span-4 flex items-end space-x-4">
//               {usageList.length > 1 && (
//                 <div className="col-span-1">
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600"
//                     onClick={() => removeUsageRow(i)}
//                     title="Remove this row"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               )}
//               <div className="col-span-2">
//                 <button
//                   type="button"
//                   className="w-full px-4 py-2 bg-blue-600 text-xs text-white rounded hover:bg-blue-700"
//                   onClick={addUsageRow}
//                   disabled={
//                     !usageList.length ||
//                     !usageList[usageList.length - 1].itemId ||
//                     !usageList[usageList.length - 1].quantity
//                   }
//                 >
//                   Add Another
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default function EnterTestResult() {
//   const { patientId, testId } = useParams();
//   const [patient, setPatient] = useState(null);
//   const [test, setTest] = useState(null);
//   const [values, setValues] = useState({});
//   const [inventory, setInventory] = useState([]);
//   const [usedItems, setUsedItems] = useState({}); // { itemId: quantityUsed }
//   const [usageList, setUsageList] = useState([{ itemId: '', quantity: '' }]);
//   const [signatures, setSignatures] = useState([]);
//   const [selectedSignatureId, setSelectedSignatureId] = useState(null);
//   const [selectedSignatureName, setSelectedSignatureName] = useState("");
//   const [includeSignature, setIncludeSignature] = useState(true);
//   const [showSignatureDialog, setShowSignatureDialog] = useState(false);
//   const [interpretation, setInterpretation] = useState("");
//   const [includeLetterhead, setIncludeLetterhead] = useState(true);

//   // 🔹 New preview state
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const passedState = location.state || {};

//   console.log("passedState", passedState);

//   const testGroupFromState = passedState.testGroupOnSelectedDate;

//   console.log("testGroupFromState", testGroupFromState);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const pRes = await fetch(`http://localhost:5000/patients/${patientId}`);
//         const { patient } = await pRes.json();
//         const tRes = await fetch(`http://localhost:5000/tests/${testId}`);
//         const test = await tRes.json();
//         const rRes = await fetch(
//           `http://localhost:5000/patients/${patientId}/tests/${testId}/results`
//         );
//         const rData = await rRes.json();

//         setPatient(patient);
//         setTest(test);
//         setValues(rData.results || {});
//         setInterpretation(rData.interpretation || "");
//       } catch (error) {
//         alert("Failed to load data");
//       }
//     }
//     fetchData();
//   }, [patientId, testId]);

//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         let res = await fetch("http://localhost:5000/inventory");
//         let data = await res.json();
//         setInventory(data.inventory || []);
//       } catch {
//         alert("Failed to fetch inventory");
//       }
//     }
//     fetchInventory();
//   }, []);

//   useEffect(() => {
//     async function fetchSignatures() {
//       try {
//         const res = await fetch("http://localhost:5000/signatures");
//         const data = await res.json();
//         setSignatures(data.signatures || []);
//         if (data.signatures && data.signatures.length > 0) {
//           setSelectedSignatureId(data.signatures[0].id);
//           setSelectedSignatureName(data.signatures[0].name);
//         }
//       } catch {
//         // ignore
//       }
//     }
//     fetchSignatures();
//   }, []);

//   useEffect(() => {
//     const usageObj = {};
//     usageList.forEach(({ itemId, quantity }) => {
//       if(itemId && quantity) usageObj[itemId] = quantity;
//     });
//     setUsedItems(usageObj);
//   }, [usageList]);

//   const handleChange = (param, val) => {
//     setValues((prev) => ({ ...prev, [param]: val }));
//   };

//   // 🔹 Generate PDF (preview OR download)
//   const generatePDFWithAutoTable = (signatureName, preview = false) => {
//     if (!patient || !test) {
//       alert("Patient or Test data not loaded");
//       return;
//     }

//     const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     const marginX = 15;
//     const margin2X = pageWidth - 85;
//     const lineSpacing = 6;

//     // prepare table
//     const tableHeaders = ["Parameter", "Result", "Unit", "Reference Range(s)", "Method"];
//     const tableData = test.parameters.map((param) => [
//       param.name || "--",
//       values[param.name] || "--",
//       param.unit || "--",
//       param.referenceRanges?.length
//         ? param.referenceRanges.map((r) => `${r.group}: ${r.range}`).join("\n")
//         : "--",
//       test.methodology || "--",
//     ]);

//     autoTable(doc, {
//       head: [tableHeaders],
//       body: tableData,
//       theme: "plain",
//       styles: { fontSize: 9, cellPadding: 3 },
//       headStyles: { lineWidth: 0 },
//       margin: { top: 95, left: marginX, right: marginX, bottom: 40 },
//       showHead: "everyPage",

//       willDrawPage: () => {
//         if (includeLetterhead && LETTERHEAD_URL) {
//           doc.addImage(LETTERHEAD_URL, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
//         }

//         let cursorY = 60;
//         doc.setTextColor(0, 0, 0);
//         doc.setFontSize(12);

//         doc.text(`Patient Name: ${patient.name}`, marginX, cursorY);
//         cursorY += lineSpacing;
//         doc.text(`Age/Sex: ${patient.age} / ${patient.gender}`, marginX, cursorY);
//         doc.text(`ID: ${patient.patientId}`, margin2X, cursorY);
//         cursorY += lineSpacing;
//         doc.text(`Address: ${patient.address}`, marginX, cursorY);
//         doc.text(`Sample Type: ${test.specimenType}`, margin2X, cursorY);
//         cursorY += lineSpacing;
//         doc.text(`Ref. By Doctor: ${patient.doctor}`, marginX, cursorY);
//         doc.text(
//           `Report Date: ${new Date().toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           })}`,
//           margin2X,
//           cursorY
//         );
//         cursorY += lineSpacing * 2;
//         doc.setFont("helvetica", "bold");
//         doc.text(test.testName + " Report", pageWidth / 2, cursorY, { align: "center" });
//       },
//     });

//     // Signature
//     let finalY = doc.lastAutoTable.finalY || pageHeight - 60;

//     if (interpretation && interpretation.trim()) {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(11);
//       doc.text("Interpretation:", marginX, finalY + 12);
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       const interpLines = doc.splitTextToSize(interpretation, pageWidth - 2 * marginX);
//       doc.text(interpLines, marginX, finalY + 18);
//       finalY += 16 + interpLines.length * 6;
//     }

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(10);
//     doc.text("Signature", pageWidth - marginX, finalY + 20, { align: "right" });

//     if (signatureName) {
//       doc.setFont("cursive", "normal");
//       doc.setFontSize(12);
//       doc.text(signatureName, pageWidth - marginX, finalY + 25, { align: "right" });
//     }

//     // Page numbers
//     const totalPages = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= totalPages; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
//     }

//     if (preview) {
//       const blobUrl = doc.output("bloburl");
//       setPreviewUrl(blobUrl);
//       setShowPreview(true);
//     } else {
//       const filename = `${patient.name || "Report"}_${test.testName}${signatureName ? "_signed" : ""}.pdf`;
//       doc.save(filename);
//     }
//   };

//   async function saveUsedReagents() {
//     const filteredUsage = usageList.filter(u => u.itemId && u.quantity);
//     if(filteredUsage.length === 0) {
//       alert('Please enter usage for at least one reagent.');
//       return;
//     }
//     // Validate quantities do not exceed available stock
//     for(const usage of filteredUsage) {
//       const invItem = inventory.find(i => i.id === usage.itemId);
//       const available = invItem ? invItem.batches.reduce((a, b) => a + Number(b.quantity || 0), 0) : 0;
//       if(Number(usage.quantity) > available) {
//         alert(`Usage for ${invItem.item} exceeds available stock.`);
//         return;
//       }
//     }
//     // Proceed to API call (similar to your saveInventory function)
//     try {
//       const res = await fetch(`http://localhost:5000/inventory/deduct-usage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ usage: filteredUsage, testId, patientId })
//       });
//       if(res.ok) {
//         alert('Inventory updated successfully.');
//         setUsageList([{ itemId: '', quantity: '' }]);
//         // refetch inventory to update UI
//         const invRes = await fetch('http://localhost:5000/inventory');
//         const invData = await invRes.json();
//         setInventory(invData.inventory || []);
//       } else {
//         alert('Failed to update inventory.');
//       }
//     } catch(error) {
//       alert('Error updating inventory.');
//       console.error(error);
//     }
//   }

//   if (!patient || !test) return <div>Loading...</div>;

//   return (
//     <div className="flex min-h-screen bg-gray-50"
//     style={{
//         "--brand-color": "#008080",
//         "--background-color": "#f7f9fc",
//         "--surface-color": "#ffffff",
//         "--text-primary": "#111518",
//         "--text-secondary": "#637988",
//         "--border-color": "#D3D3D3",
//         fontFamily: '"Public Sans", sans-serif',
//       }}>
//       <Sidebar />
//       <main className="flex-1 p-8 max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Enter & Generate Test Report</h1>

//         {/* Patient & Test Info Form */}
//         <div className="bg-white rounded shadow p-6 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Patient & Test Info</h2>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div><b>Patient ID:</b> {patient?.patientId}</div>
//             <div><b>Patient Name:</b> {patient?.name}</div>
//             <div><b>Age/Sex:</b> {patient?.age} / {patient?.gender}</div>
//             <div><b>Address:</b> {patient?.address}</div>
//             <div><b>Contact:</b> {patient?.contact}</div>
//             <div><b>Doctor:</b> {patient?.doctor}</div>
//             <div><b>Collection Date:</b> {patient?.date}</div>
//             <div><b>Test Name:</b> {test?.testName}</div>
//             <div><b>Sample Type:</b> {test?.specimenType}</div>
//           </div>

//           <form className="space-y-4">
//             {test?.parameters.map((param, idx) => (
//               <div key={param.name || idx} className="flex gap-4 items-center">
//                 <div className="w-2/5">{param.name}</div>
//                 <input
//                   type="text"
//                   value={values[param.name] || ""}
//                   className="border px-3 py-1 rounded w-1/3"
//                   onChange={(e) => handleChange(param.name, e.target.value)}
//                 />
//                 <div className="w-1/6 text-gray-600">{param.unit || "--"}</div>
//                 <div className="w-1/3 text-gray-500">
//                   {param.referenceRanges?.length
//                     ? param.referenceRanges.map((r, i) => (
//                         <div key={i}>{r.group}: {r.range}</div>
//                       ))
//                     : "--"}
//                 </div>
//               </div>
//             ))}
//             <div className="my-4">
//               <label className="block font-semibold mb-1">Interpretation / Comment</label>
//               <textarea
//                 className="border rounded w-full px-3 py-2"
//                 rows={3}
//                 value={interpretation}
//                 onChange={e => setInterpretation(e.target.value)}
//                 placeholder="Enter clinical interpretation or comments..."
//               />
//             </div>
//           </form>

//           <div className="flex justify-end">
//             <button
//               className="mt-6 px-6 py-2 rounded bg-[var(--brand-color)] text-white font-bold"
//               onClick={async () => {
//                 try {
//                   const res = await fetch(
//                     `http://localhost:5000/patients/${patientId}/tests/${testId}/results`,
//                     {
//                       method: "PUT",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ results: values, interpretation }),
//                     }
//                   );
//                   if (res.ok) alert("Results saved successfully.");
//                   else alert("Failed to save results.");
//                 } catch {
//                   alert("Error saving results.");
//                 }
//               }}
//             >
//               Save Results
//             </button>
//           </div>
//           <div className="my-8 max-w-4xl mx-auto p-6 border rounded bg-white">
//             <h3 className="text-xl font-semibold mb-4">Record Used Reagents and Consumables</h3>
//             <ReagentUsageForm
//               inventory={inventory}
//               usageList={usageList}
//               setUsageList={setUsageList}
//             />

//             <button
//               onClick={saveUsedReagents}
//               className="mt-4 px-6 py-2 bg-[var(--brand-color)] text-white rounded"
//             >
//               Save Usage
//             </button>
//           </div>
//         </div>

//         {/* Download PDF Button */}
//         <div className="flex justify-between">
//           <button
//             onClick={() => navigate("/patients", { state: { patientId, fromResults: true } })}
//             className="px-6 py-2 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
//           >
//             Back
//           </button>
//           <button
//             className="px-6 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 mb-4"
//             onClick={() => setShowSignatureDialog(true)}
//           >
//             Download PDF
//           </button>
//         </div>

//         {/* Signature Selection Modal */}
//         {showSignatureDialog && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//             <div className="bg-white p-6 rounded shadow max-w-sm w-full">
//               <h3 className="text-lg font-semibold mb-4">Include Signature Name in Report?</h3>
//               <div className="mb-4 flex gap-4">
//                 <label className="inline-flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     checked={includeSignature}
//                     onChange={() => {
//                       setIncludeSignature(true);
//                       const firstSig = signatures[0];
//                       setSelectedSignatureId(firstSig?.id || null);
//                       setSelectedSignatureName(firstSig?.name || "");
//                     }}
//                   />
//                   <span>Yes</span>
//                 </label>
//                 <label className="inline-flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     checked={!includeSignature}
//                     onChange={() => {
//                       setIncludeSignature(false);
//                       setSelectedSignatureId(null);
//                       setSelectedSignatureName("");
//                     }}
//                   />
//                   <span>No</span>
//                 </label>
//               </div>

//               <div className="mb-4 flex gap-4">
//                 <label className="inline-flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={includeLetterhead}
//                     onChange={e => setIncludeLetterhead(e.target.checked)}
//                   />
//                   <span>Include Letterhead Background</span>
//                 </label>
//               </div>

//               {includeSignature && (
//                 <select
//                   className="w-full border rounded p-2 mb-4"
//                   value={selectedSignatureId || ""}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setSelectedSignatureId(id);
//                     const sig = signatures.find((s) => s.id === id);
//                     setSelectedSignatureName(sig?.name || "");
//                   }}
//                 >
//                   {signatures.map((sig) => (
//                     <option key={sig.id} value={sig.id}>{sig.name}</option>
//                   ))}
//                 </select>
//               )}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowSignatureDialog(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-primary"
//                   disabled={includeSignature && !selectedSignatureId}
//                   onClick={() => {
//                     setShowSignatureDialog(false);
//                     generatePDFWithAutoTable(
//                       includeSignature ? selectedSignatureName : "",
//                       true, // ✅ preview instead of immediate download
//                       interpretation,
//                       includeLetterhead
//                     );
//                   }}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PDF Preview Modal */}
//         {showPreview && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//             <div className="bg-white rounded shadow-lg max-w-4xl w-full h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <h2 className="text-lg font-semibold">Report Preview</h2>
//                 <button
//                   className="text-red-600 font-bold"
//                   onClick={() => setShowPreview(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 {previewUrl && (
//                   <iframe
//                     src={previewUrl}
//                     title="PDF Preview"
//                     className="w-full h-full"
//                   />
//                 )}
//               </div>
//               <div className="flex justify-end p-4 border-t space-x-4">
//                 <button
//                   className="px-4 py-2 rounded bg-gray-500 text-white"
//                   onClick={() => setShowPreview(false)}
//                 >
//                   Close
//                 </button>
//                 <button
//                   className="px-4 py-2 rounded bg-green-600 text-white"
//                   onClick={() => {
//                     if ( !testGroupFromState?.paymentInfo?.cleared ) {
//                       alert("Payment not cleared yet.");
//                       return;
//                     }
//                     generatePDFWithAutoTable(
//                       includeSignature ? selectedSignatureName : "",
//                       false, // ✅ trigger actual download
//                       interpretation,
//                       includeLetterhead
//                     )
//                   }}
//                 >
//                   Download
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LETTERHEAD_URL = "/images/DOCTORS LAB LETTER HEAD - Copy.png"; // Update as appropriate

function ReagentUsageForm({ inventory, usageList, setUsageList }) {
  const [filters, setFilters] = useState(usageList.map(() => ""));

  const addUsageRow = () => {
    setUsageList([...usageList, { itemId: "", quantity: "" }]);
    setFilters([...filters, ""]);
  };

  const removeUsageRow = (index) => {
    setUsageList(usageList.filter((_, i) => i !== index));
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, itemId) => {
    const newUsage = [...usageList];
    newUsage[index].itemId = itemId;
    if (!newUsage[index].quantity) newUsage[index].quantity = "";
    setUsageList(newUsage);
  };

  const handleQuantityChange = (index, value) => {
    if (value === "" || /^[0-9]*$/.test(value)) {
      const newUsage = [...usageList];
      newUsage[index].quantity = value;
      setUsageList(newUsage);
    }
  };

  const handleFilterChange = (index, value) => {
    const newFilters = [...filters];
    newFilters[index] = value;
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      {usageList.map((usage, idx) => {
        const lowerFilter = filters[idx]?.toLowerCase() || "";
        const filteredInventory = inventory.filter(
          (item) =>
            item.item.toLowerCase().includes(lowerFilter) &&
            usageList.every((u, i) => i === idx || u.itemId !== item.id)
        );

        const selectedItem = inventory.find((inv) => inv.id === usage.itemId);
        if (selectedItem && !filteredInventory.includes(selectedItem)) {
          filteredInventory.unshift(selectedItem);
        }

        return (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded shadow">
            <div className="col-span-5">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Search reagent"
                value={filters[idx] || ""}
                list={`inventory-list-${idx}`}
                onChange={(e) => handleFilterChange(idx, e.target.value)}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  const found = inventory.find((i) => i.item === val);
                  if (found) handleItemChange(idx, found.id);
                }}
              />
              <datalist id={`inventory-list-${idx}`}>
                {filteredInventory.map((item) => (
                  <option key={item.id} value={item.item} />
                ))}
              </datalist>
            </div>
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Quantity"
                value={usage.quantity}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled={!usage.itemId}
                onChange={(e) => handleQuantityChange(idx, e.target.value)}
              />
            </div>
            <div className="col-span-3"></div>
            <div className="col-span-1 flex space-x-1">
              {usageList.length > 1 && (
                <button
                  className="text-red-600 bg-red-100 rounded px-2"
                  onClick={() => removeUsageRow(idx)}
                  title="Remove"
                >
                  ×
                </button>
              )}
              {idx === usageList.length - 1 && (
                <button
                  className="text-blue-600 bg-blue-100 rounded px-2"
                  onClick={addUsageRow}
                  disabled={
                    !usage.itemId || !usage.quantity
                  }
                  title="Add"
                >
                  +
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EnterTestResult() {
  const { patientId, testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [patient, setPatient] = useState(null);
  const [test, setTest] = useState(null);
  const [values, setValues] = useState({});
  const [inventory, setInventory] = useState([]);
  const [usageList, setUsageList] = useState([{ itemId: "", quantity: "" }]);
  const [signatures, setSignatures] = useState([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [selectedSignatureName, setSelectedSignatureName] = useState("");
  const [includeSignature, setIncludeSignature] = useState(true);
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [interpretation, setInterpretation] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const passedState = location.state || {};
  const testGroupFromState = passedState.testGroupOnSelectedDate;
  // Fetch data on load
  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const pRes = await fetch(`http://localhost:5000/patients/${patientId}`);
        const pData = await pRes.json();
        const tRes = await fetch(`http://localhost:5000/tests/${testId}`);
        const tData = await tRes.json();
        const rRes = await fetch(`http://localhost:5000/patients/${patientId}/tests/${testId}/results`);
        const rData = await rRes.json();
        setPatient(pData.patient);
        setTest(tData);
        setValues(rData.results || {});
        setInterpretation(rData.interpretation || "");
      } catch {
        alert("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [patientId, testId]);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch("http://localhost:5000/inventory");
        const data = await res.json();
        setInventory(data.inventory || []);
      } catch { }
    }
    fetchInventory();
  }, []);

  useEffect(() => {
    async function fetchSignatures() {
      try {
        const res = await fetch("http://localhost:5000/signatures");
        const data = await res.json();
        setSignatures(data.signatures || []);
        if (data.signatures.length) {
          setSelectedSignatureId(data.signatures[0].id);
          setSelectedSignatureName(data.signatures[0].name);
        }
      } catch { }
    }
    fetchSignatures();
  }, []);

  // Update usage map for backend
  useEffect(() => {
    const usageMap = {};
    usageList.forEach((usage) => {
      if (usage.itemId && usage.quantity) usageMap[usage.itemId] = usage.quantity;
    });
  }, [usageList]);

  const handleValueChange = (param, val) => {
    setValues((v) => ({ ...v, [param]: val }));
  };

  // PDF Generation - uses jsPDF + autotable
  const generatePDFWithAutoTable = (signatureName, preview = false) => {
    if (!patient || !test) {
      alert("Patient or Test data not loaded");
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 15;
    const margin2X = pageWidth - 85;
    const lineSpacing = 6;

    // prepare table
    const tableHeaders = ["Parameter", "Result", "Unit", "Reference Range(s)", "Method"];
    const tableData = test.parameters.map((param) => [
      param.name || "--",
      values[param.name] || "--",
      param.unit || "--",
      param.referenceRanges?.length
        ? param.referenceRanges.map((r) => `${r.group}: ${r.range}`).join("\n")
        : "--",
      test.methodology || "--",
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { lineWidth: 0 },
      margin: { top: 95, left: marginX, right: marginX, bottom: 40 },
      showHead: "everyPage",

      willDrawPage: () => {
        if (includeLetterhead && LETTERHEAD_URL) {
          doc.addImage(LETTERHEAD_URL, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
        }

        let cursorY = 60;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`Patient Name: ${patient.name}`, marginX, cursorY);
        cursorY += lineSpacing;
        doc.text(`Age/Sex: ${patient.age} / ${patient.gender}`, marginX, cursorY);
        doc.text(`ID: ${patient.patientId}`, margin2X, cursorY);
        cursorY += lineSpacing;
        doc.text(`Address: ${patient.address}`, marginX, cursorY);
        doc.text(`Sample Type: ${test.specimenType}`, margin2X, cursorY);
        cursorY += lineSpacing;
        doc.text(`Ref. By Doctor: ${patient.doctor}`, marginX, cursorY);
        doc.text(
          `Report Date: ${new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}`,
          margin2X,
          cursorY
        );
        cursorY += lineSpacing * 2;
        doc.setFont("helvetica", "bold");
        doc.text(test.testName + " Report", pageWidth / 2, cursorY, { align: "center" });
      },
    });

    // Signature
    let finalY = doc.lastAutoTable.finalY || pageHeight - 60;

    if (interpretation && interpretation.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Interpretation:", marginX, finalY + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const interpLines = doc.splitTextToSize(interpretation, pageWidth - 2 * marginX);
      doc.text(interpLines, marginX, finalY + 18);
      finalY += 16 + interpLines.length * 6;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Signature", pageWidth - marginX, finalY + 20, { align: "right" });

    if (signatureName) {
      doc.setFont("cursive", "normal");
      doc.setFontSize(12);
      doc.text(signatureName, pageWidth - marginX, finalY + 25, { align: "right" });
    }

    // Page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
    }

    if (preview) {
      const blobUrl = doc.output("bloburl");
      setPreviewUrl(blobUrl);
      setShowPreview(true);
    } else {
      const filename = `${patient.name || "Report"}_${test.testName}${signatureName ? "_signed" : ""}.pdf`;
      doc.save(filename);
    }
  };


  async function saveUsedReagents() {
    const filteredUsage = usageList.filter(u => u.itemId && u.quantity);
    if (filteredUsage.length === 0) {
      alert('Please enter usage for at least one reagent.');
      return;
    }
    // Validate quantities do not exceed available stock
    for (const usage of filteredUsage) {
      const invItem = inventory.find(i => i.id === usage.itemId);
      const available = invItem ? invItem.batches.reduce((a, b) => a + Number(b.quantity || 0), 0) : 0;
      if (Number(usage.quantity) > available) {
        alert(`Usage for ${invItem.item} exceeds available stock.`);
        return;
      }
    }
    // Proceed to API call (similar to your saveInventory function)
    try {
      const res = await fetch(`http://localhost:5000/inventory/deduct-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usage: filteredUsage, testId, patientId })
      });
      if (res.ok) {
        alert('Inventory updated successfully.');
        setUsageList([{ itemId: '', quantity: '' }]);
        // refetch inventory to update UI
        const invRes = await fetch('http://localhost:5000/inventory');
        const invData = await invRes.json();
        setInventory(invData.inventory || []);
      } else {
        alert('Failed to update inventory.');
      }
    } catch (error) {
      alert('Error updating inventory.');
      console.error(error);
    }
  }

  // ...All other functions including save usage, submit results, etc.

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!patient || !test) return <div className="p-10">No data available</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar and overlay */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-white w-64 shadow-lg border-r border-gray-200 transform transition duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0`}>
        <Sidebar onLogout={() => alert("Logout")} />
      </div>
      {/* overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black opacity-25 md:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow p-4 flex items-center gap-4">
          <button aria-label="Toggle Sidebar" className="md:hidden p-2 rounded-md hover:bg-gray-200" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Enter Test Result</h1>
        </header>

        {/* Main content */}
        <main className="flex-grow overflow-auto p-6">
          {/* Patient & Test Info */}
          <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
            <h2 className="text-3xl mb-6 font-bold">{test.testName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><strong>Patient Name:</strong> {patient.name}</div>
              <div><strong>Age / Sex:</strong> {patient.age} / {patient.gender}</div>
              <div><strong>Patient ID:</strong> {patient.patientId}</div>
              <div><strong>Doctor:</strong> {patient.doctor}</div>
              <div><strong>Contact:</strong> {patient.contact}</div>
              <div><strong>Sample Collection:</strong> {patient.date} {patient.time}</div>
              <div><strong>Test Category:</strong> {test.category}</div>
            </div>

            {/* Parameters Form */}
            <form className="mt-6 space-y-4">
              {test.parameters.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="flex-grow font-medium">{p.name} ({p.unit || "Unit"})</label>
                  <input
                    type="text"
                    value={values[p.name] || ""}
                    onChange={e => handleValueChange(p.name, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2"
                  />
                </div>
              ))}

              {/* Interpretation */}
              <div>
                <label className="block mb-2 font-semibold">Interpretation</label>
                <textarea
                  value={interpretation}
                  onChange={e => setInterpretation(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Enter interpretation or comments here"
                />
              </div>

              {/* Save Results Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch(`http://localhost:5000/patients/${patientId}/tests/${testId}/results`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ results: values, interpretation }),
                      });
                      if (res.ok) alert("Results saved successfully.");
                      else alert("Failed to save results.");
                    } catch {
                      alert("Error saving results.");
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Results
                </button>
              </div>
            </form>
          </div>

          {/* Reagent Usage */}
          <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Record Reagent Usage</h2>
            <ReagentUsageForm inventory={inventory} usageList={usageList} setUsageList={setUsageList} />
            <button
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
              onClick={saveUsedReagents} // Implement saveUsageFunction to make API call for usage saving
            >
              Save Usage
            </button>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate("/patients", { state: { patientId, fromResults: true } })}
              className="px-6 py-2 rounded bg-gray-500 text-white font-bold hover:bg-gray-600"
            >
              Back
            </button>
            <button
              className="px-6 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 mb-4"
              onClick={() => setShowSignatureDialog(true)}
            >
              Download PDF
            </button>
          </div>

          {/* Signature Selection Modal */}
          {showSignatureDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Include Signature Name in Report?</h3>
                <div className="mb-4 flex gap-4">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={includeSignature}
                      onChange={() => {
                        setIncludeSignature(true);
                        const firstSig = signatures[0];
                        setSelectedSignatureId(firstSig?.id || null);
                        setSelectedSignatureName(firstSig?.name || "");
                      }}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={!includeSignature}
                      onChange={() => {
                        setIncludeSignature(false);
                        setSelectedSignatureId(null);
                        setSelectedSignatureName("");
                      }}
                    />
                    <span>No</span>
                  </label>
                </div>

                <div className="mb-4 flex gap-4">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeLetterhead}
                      onChange={e => setIncludeLetterhead(e.target.checked)}
                    />
                    <span>Include Letterhead Background</span>
                  </label>
                </div>

                {includeSignature && (
                  <select
                    className="w-full border rounded p-2 mb-4"
                    value={selectedSignatureId || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedSignatureId(id);
                      const sig = signatures.find((s) => s.id === id);
                      setSelectedSignatureName(sig?.name || "");
                    }}
                  >
                    {signatures.map((sig) => (
                      <option key={sig.id} value={sig.id}>{sig.name}</option>
                    ))}
                  </select>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowSignatureDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={includeSignature && !selectedSignatureId}
                    onClick={() => {
                      setShowSignatureDialog(false);
                      generatePDFWithAutoTable(
                        includeSignature ? selectedSignatureName : "",
                        true, // ✅ preview instead of immediate download
                        interpretation,
                        includeLetterhead
                      );
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
          {showPreview && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded shadow-lg max-w-4xl w-full h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold">Report Preview</h2>
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => setShowPreview(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {previewUrl && (
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="flex justify-end p-4 border-t space-x-4">
                  <button
                    className="px-4 py-2 rounded bg-gray-500 text-white"
                    onClick={() => setShowPreview(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-green-600 text-white"
                    onClick={() => {
                      if (!testGroupFromState?.paymentInfo?.cleared) {
                        alert("Payment not cleared yet.");
                        return;
                      }
                      generatePDFWithAutoTable(
                        includeSignature ? selectedSignatureName : "",
                        false, // ✅ trigger actual download
                        interpretation,
                        includeLetterhead
                      )
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
