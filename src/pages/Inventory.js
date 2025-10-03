// import React, { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";

// const unitOptions = ["units", "pcs", "ml", "mg", "g", "l"];

// const InventoryModal = ({ visible, onClose, onSubmit, initialData }) => {
//   const isEdit = !!initialData?.id;
//   const [form, setForm] = useState(() => ({
//     item: "",
//     unit: "units",
//     quantity: 0,
//     purchaseDate: "",
//     amount: 0,
//     expiryDate: "",
//     repurchaseDate: "",
//     status: "In Stock",
//     batches: [],
//     ...initialData,
//   }));

//   useEffect(() => {
//     setForm(form => ({
//       item: "",
//       unit: "units",
//       quantity: 0,
//       purchaseDate: "",
//       amount: 0,
//       expiryDate: "",
//       repurchaseDate: "",
//       status: "In Stock",
//       batches: [],
//       ...initialData,
//     }));
//   }, [initialData]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//   }

//   function handleBatchChange(index, field, value) {
//     setForm(f => {
//       const newBatches = [...(f.batches || [])];
//       let lowStockThreshold = newBatches[index]?.lowStockThreshold;
//       if (field === "quantity") {
//         const qtyNum = Number(value);
//         lowStockThreshold = isNaN(qtyNum) ? 0 : Math.ceil(qtyNum * 0.2);
//       }
//       newBatches[index] = { ...newBatches[index], [field]: value, lowStockThreshold };
//       return { ...f, batches: newBatches };
//     });
//   }

//   function addBatch() {
//     setForm(f => ({
//       ...f,
//       batches: [...(f.batches || []), { quantity: 0, unit: f.unit || "units", purchaseDate: "", amount: 0, expiryDate: "", lowStockThreshold: 0 }]
//     }));
//   }

//   function removeBatch(index) {
//     setForm(f => {
//       const newBatches = [...(f.batches || [])];
//       newBatches.splice(index, 1);
//       return { ...f, batches: newBatches };
//     });
//   }

//   function handleSubmit() {
//     if (!isEdit) {
//       // Add mode validations
//       if (!form.item || !form.purchaseDate || form.amount == null || !form.expiryDate || form.quantity == null || !form.unit) {
//         alert("Please fill all required fields for item.");
//         return;
//       }
//       // Auto create batches from main inputs with low stock threshold
//       const lowStockThreshold = Math.ceil(Number(form.quantity) * 0.2);
//       form.batches = [{
//         quantity: form.quantity,
//         unit: form.unit,
//         purchaseDate: form.purchaseDate,
//         amount: form.amount,
//         expiryDate: form.expiryDate,
//         lowStockThreshold,
//       }];
//     }
//     if (isEdit && form.batches && form.batches.length > 0) {
//       form.unit = form.batches[0].unit || "units";
//     }
//     if (isEdit) {
//       // Edit mode validations
//       if (!form.item) {
//         alert("Please fill item name.");
//         return;
//       }
//       if (!form.batches || form.batches.length === 0) {
//         alert("Please add at least one batch.");
//         return;
//       }
//       for (const b of form.batches) {
//         if (b.quantity == null || !b.unit || !b.purchaseDate || b.amount == null || !b.expiryDate) {
//           console.log(b);
//           alert("Please fill all batch details.");
//           return;
//         }
//       }
//     }
//     onSubmit(form);
//   }

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
//       <div className="bg-white rounded p-6 w-max max-h-[90vh] overflow-y-auto shadow-lg min-w-[400px]">
//         <h3 className="text-xl font-semibold mb-4">{isEdit ? "Edit Item" : "Add New Item"}</h3>
//         <form onSubmit={e => e.preventDefault()} className="space-y-3">
//           <div>
//             <label htmlFor="item" className="block font-medium mb-1">Item Name</label>
//             <input
//               id="item"
//               name="item"
//               value={form.item}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {!isEdit && <>
//             <div>
//               <label className="block font-medium mb-1">Quantity/Volume</label>
//               <div className="flex gap-2">
//                 <input
//                   name="quantity"
//                   type="number"
//                   value={form.quantity}
//                   onChange={handleChange}
//                   className="w-32 border rounded px-3 py-2"
//                   required
//                   min={0}
//                 />
//                 <select name="unit" value={form.unit} onChange={handleChange} className="border rounded px-3 py-2">
//                   {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
//                 </select>
//               </div>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Purchase Date</label>
//               <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Amount</label>
//               <input name="amount" type="number" value={form.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" required min={0} />
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Expiry Date</label>
//               <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
//             </div>
//           </>}

//           <div>
//             <label className="block font-medium mb-1">Status</label>
//             <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
//               <option>In Stock</option>
//               <option>Low Stock</option>
//               <option>Expired</option>
//             </select>
//           </div>

//           {isEdit && (
//             <div>
//               <label className="block font-semibold mb-2">Batches</label>
//               <button type="button" onClick={addBatch} className="mb-4 text-sm text-blue-600 hover:underline">+ Add Batch</button>
//               {(form.batches || []).map((batch, idx) => (
//                 <div key={idx} className="border rounded px-3 py-2 mb-3">
//                   <div className="flex gap-2 mb-1">
//                     <div className="flex-grow">
//                       <label>Quantity/Volume</label>
//                       <div className="flex gap-2 mt-1">
//                         <input
//                           type="number"
//                           value={batch.quantity}
//                           onChange={e => handleBatchChange(idx, "quantity", e.target.value)}
//                           className="w-24 border rounded px-2 py-1"
//                           min={0}
//                         />
//                         <select
//                           value={batch.unit || "units"}
//                           onChange={e => handleBatchChange(idx, "unit", e.target.value)}
//                           className="border rounded px-2 py-1"
//                         >
//                           {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
//                         </select>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => removeBatch(idx)} className="text-red-600 font-bold px-2 py-1 self-end h-8">×</button>
//                   </div>

//                   <div>
//                     <label>Purchase Date</label>
//                     <input
//                       type="date"
//                       value={batch.purchaseDate}
//                       onChange={e => handleBatchChange(idx, "purchaseDate", e.target.value)}
//                       className="w-full border rounded px-2 py-1 mb-1"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label>Amount</label>
//                     <input
//                       type="number"
//                       value={batch.amount}
//                       onChange={e => handleBatchChange(idx, "amount", e.target.value)}
//                       className="w-full border rounded px-2 py-1 mb-1"
//                       min={0}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label>Expiry Date</label>
//                     <input
//                       type="date"
//                       value={batch.expiryDate}
//                       onChange={e => handleBatchChange(idx, "expiryDate", e.target.value)}
//                       className="w-full border rounded px-2 py-1"
//                       required
//                     />
//                   </div>

//                   <small className="text-xs text-gray-500 mt-1 block">
//                     Low Stock Threshold: {batch.lowStockThreshold || Math.ceil((batch.quantity || 0) * 0.2)} {batch.unit}
//                   </small>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-6 flex justify-end gap-3">
//             <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
//             <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded bg-[var(--brand-color)] text-white hover:bg-[var(--primary-color-hover)]">
//               {isEdit ? "Save" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const AddBatchModal = ({ visible, onClose, onSubmit, item }) => {
//   const [batch, setBatch] = useState({
//     quantity: 0,
//     unit: "units",
//     purchaseDate: "",
//     amount: 0,
//     expiryDate: "",
//     lowStockThreshold: 0,
//   });

//   useEffect(() => {
//     if (!visible) setBatch({
//       quantity: 0,
//       unit: "units",
//       purchaseDate: "",
//       amount: 0,
//       expiryDate: "",
//       lowStockThreshold: 0,
//     });
//   }, [visible]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setBatch(prev => {
//       const newBatch = { ...prev, [name]: value };
//       if(name === "quantity") {
//         const qtyNum = Number(value);
//         newBatch.lowStockThreshold = isNaN(qtyNum) ? 0 : Math.ceil(qtyNum * 0.2);
//       }
//       return newBatch;
//     });
//   }

//   function submit() {
//     if (!batch.quantity || !batch.unit || !batch.purchaseDate || !batch.amount || !batch.expiryDate) {
//       alert("Please fill all batch details");
//       return;
//     }
//     onSubmit(batch);
//   }

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//       <div className="bg-white p-6 rounded shadow-lg w-80">
//         <h3 className="text-xl font-semibold mb-4">Add Batch - {item?.item}</h3>
//         <label>Quantity/Volume</label>
//         <div className="flex gap-2 mb-2 mt-1">
//           <input name="quantity" type="number" value={batch.quantity} onChange={handleChange} className="w-24 border rounded px-3 py-2" />
//           <select name="unit" value={batch.unit} onChange={handleChange} className="border rounded px-3 py-2">
//             {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
//           </select>
//         </div>

//         <label>Purchase Date</label>
//         <input type="date" name="purchaseDate" value={batch.purchaseDate} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" />

//         <label>Amount</label>
//         <input type="number" name="amount" value={batch.amount} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" />

//         <label>Expiry Date</label>
//         <input type="date" name="expiryDate" value={batch.expiryDate} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-4" />

//         <small className="text-xs text-gray-500 mb-3 block">
//           Low Stock Threshold: {batch.lowStockThreshold} {batch.unit}
//         </small>

//         <div className="flex justify-end gap-3">
//           <button onClick={onClose} className="btn-secondary">Cancel</button>
//           <button onClick={submit} className="btn-primary">Add</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// const StockTable = ({ onEdit, onAddBatch, onRefresh }) => {
//   const [inventory, setInventory] = useState([]);
//   const [search, setSearch] = useState("");
//   const [expanded, setExpanded] = useState({});
//   const [refresh, setRefresh] = useState(0);
//   const [editingBatch, setEditingBatch] = useState({ itemId: null, batchIdx: null });
//   const [editingValue, setEditingValue] = useState("");

//   useEffect(() => {
//     fetchItems();
//   }, [refresh]);

//   async function fetchItems() {
//     try {
//       const res = await fetch("http://localhost:5000/inventory");
//       const { inventory } = await res.json();
//       setInventory(inventory);
//     } catch {
//       alert("Error fetching inventory");
//     }
//   }

//   function toggleExpand(id) {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   }

//   // Inline Batch Quantity Edit Save
//   async function saveBatchUpdate(item, batchIdx) {
//     const newQty = Number(editingValue);
//     if (isNaN(newQty) || newQty < 0) {
//       alert("Enter valid quantity.");
//       return;
//     }
//     // API expects: item id, batchIdx, new quantity
//     try {
//       const updateRes = await fetch(`http://localhost:5000/inventory/${item.id}/batch/${batchIdx}/quantity`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ quantity: newQty }),
//       });
//       if (updateRes.ok) {
//         alert("Batch quantity updated");
//         setEditingBatch({ itemId: null, batchIdx: null });
//         setEditingValue("");
//         setRefresh((r) => r + 1); // reload inventory
//         if (onRefresh) onRefresh();
//       } else {
//         alert("Failed to update batch");
//       }
//     } catch {
//       alert("Error updating batch");
//     }
//   }

//   const filtered = inventory.filter(
//     (itm) =>
//       itm.item.toLowerCase().includes(search.toLowerCase()) ||
//       itm.category?.toLowerCase().includes(search.toLowerCase())
//   );

//   function totalQuantity(item) {
//     if (!item.batches || item.batches.length === 0) return item.quantity || 0;
//     return item.batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
//   }

//   function earliestExpiry(item) {
//     if (!item.batches || item.batches.length === 0) return item.expiryDate || "";
//     const dates = item.batches.map((b) => b.expiryDate).filter(Boolean);
//     return dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : "";
//   }

//   function anyBatchLowStock(item) {
//     if (!item.batches || item.batches.length === 0) return false;
//     const totalStock = item.batches.reduce((sum, b) => sum + Number(b.quantity), 0);
//     const aggregateThreshold = item.batches
//       .filter(b => Number(b.quantity) > 0)
//       .reduce((sum, b) => sum + Number(b.lowStockThreshold || Math.ceil(Number(b.quantity) * 0.2)), 0);
//     return totalStock <= aggregateThreshold;
//   }

//   function isItemExpired(item) {
//     if (!item.batches) return false;
//     const today = new Date();
//     return item.batches.some(batch => {
//       if (!batch.expiryDate) return false;
//       return new Date(batch.expiryDate) < today;
//     });
//   }

//   function getStockStatus(item) {
//     if (isItemExpired(item)) return "Expired";

//     if (!item.batches || item.batches.length === 0) return "Out of Stock";

//     const totalStock = item.batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
//     if (totalStock === 0) return "Out of Stock";

//     const aggregateThreshold = item.batches
//       .filter(b => Number(b.quantity) > 0)
//       .reduce((sum, b) => sum + Number(b.lowStockThreshold || Math.ceil(Number(b.quantity) * 0.2)), 0);

//     return totalStock <= aggregateThreshold ? "Low Stock" : "In Stock";
//   }

//   return (
//     <section>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Reagents and Supplies</h2>
//         <div className="relative w-full max-w-sm">
//           <input
//             className="form-input w-full rounded-full border-gray-700 border bg-white h-12 pl-10 pr-4 text-base"
//             placeholder="Search reagents & supplies"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
//             <svg
//               fill="currentColor"
//               height="20"
//               width="20"
//               viewBox="0 0 256 256"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
//             </svg>
//           </div>
//         </div>
//       </div>
//       <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Item</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Quantity</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Purchase Date</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Repurchase Date</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Expiry Date</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Status</th>
//               <th className="px-6 py-3 text-center font-medium text-gray-600 tracking-wider">Details</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-300">
//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-center py-6 text-gray-500">
//                   No matching items found.
//                 </td>
//               </tr>
//             )}
//             {filtered.map((item) => {
//               const status = getStockStatus(item);
//               const isExpanded = !!expanded[item.id];
//               const repurchaseDate =
//                 item.repurchaseDate ||
//                 (item.batches && item.batches.length > 1
//                   ? item.batches[item.batches.length - 1].purchaseDate
//                   : "");
//               return (
//                 <React.Fragment key={item.id}>
//                   <tr className={status === "Low Stock" ? "bg-yellow-50" : status === "Out of Stock" ? "bg-red-50" : status === "Expired" ? "bg-red-100" : ""}>
//                     <td className="px-6 py-3 whitespace-nowrap font-semibold text-gray-900">{item.item}</td>
//                     <td className="px-6 py-3 whitespace-nowrap text-gray-700">
//                       {totalQuantity(item)} {item.unit || (item.batches && item.batches.length && item.batches[0].unit)}
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap text-gray-700">{item.batches?.[0]?.purchaseDate || ""}</td>
//                     <td className="px-6 py-3 whitespace-nowrap text-gray-700">{repurchaseDate || "--"}</td>
//                     <td className="px-6 py-3 whitespace-nowrap text-gray-700">{earliestExpiry(item)}</td>
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                           status === "Low Stock"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : status === "Expired"
//                               ? "bg-red-100 text-red-800"
//                               : status === "Out of Stock"
//                               ? "bg-red-800 text-red-900"
//                               : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-3 text-center">
//                       <button
//                         onClick={() => toggleExpand(item.id)}
//                         aria-label={`${isExpanded ? "Collapse" : "Expand"} batch details`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {isExpanded ? "▲" : "▼"}
//                       </button>
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap space-x-4">
//                       <button className="text-blue-600 hover:underline" onClick={() => onEdit(item)}>
//                         Edit
//                       </button>
//                       <button className="text-green-600 hover:underline" onClick={() => onAddBatch(item)}>
//                         Add Batch
//                       </button>
//                       <button
//                         className="text-red-600 hover:underline"
//                         onClick={() => {
//                           if (window.confirm(`Delete ${item.item}?`)) {
//                             onEdit(null);
//                             fetch(`http://localhost:5000/inventory/${item.id}`, { method: "DELETE" })
//                               .then((res) => {
//                                 if (res.ok) {
//                                   alert("Deleted successfully");
//                                   setRefresh((r) => r + 1);
//                                 } else {
//                                   alert("Delete failed");
//                                 }
//                               })
//                               .catch(() => alert("Delete failed"));
//                           }
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                   {isExpanded && item.batches && (
//                     <tr>
//                       <td colSpan={8} className="bg-gray-50 p-4">
//                         <strong>Batches:</strong>
//                         <table className="w-full border border-gray-300 mt-2 text-sm">
//                           <thead className="bg-white border-b border-gray-300">
//                             <tr>
//                               <th className="p-2 border border-gray-300 text-left">#</th>
//                               <th className="p-2 border border-gray-300 text-left">Quantity</th>
//                               <th className="p-2 border border-gray-300 text-left">Unit</th>
//                               <th className="p-2 border border-gray-300 text-left">Low Stock Threshold</th>
//                               <th className="p-2 border border-gray-300 text-left">Purchase Date</th>
//                               <th className="p-2 border border-gray-300 text-left">Amount</th>
//                               <th className="p-2 border border-gray-300 text-left">Expiry Date</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {item.batches.map((batch, i) => (
//                               <tr key={i}>
//                                 <td className="p-2 border border-gray-300">{i + 1}</td>
//                                 {/* Quantity Cell: Inline edit if chosen */}
//                                 <td className="p-2 border border-gray-300">
//                                   {editingBatch.itemId === item.id && editingBatch.batchIdx === i ? (
//                                     <>
//                                       <input
//                                         type="number"
//                                         min={0}
//                                         value={editingValue}
//                                         onChange={e => setEditingValue(e.target.value)}
//                                         className="w-16 border rounded px-1 py-0.5"
//                                         autoFocus
//                                       />
//                                       <button className="text-green-600 px-1" title="Save" type="button" onClick={() => saveBatchUpdate(item, i)}>✔</button>
//                                       <button className="text-gray-500 px-1" title="Cancel" type="button" onClick={() => setEditingBatch({ itemId: null, batchIdx: null })}>✖</button>
//                                     </>
//                                   ) : (
//                                     <>
//                                       <span>{batch.quantity}</span>
//                                       <button
//                                         className="text-blue-600 text-xs ml-1"
//                                         title="Edit"
//                                         type="button"
//                                         onClick={() => {
//                                           setEditingBatch({ itemId: item.id, batchIdx: i });
//                                           setEditingValue(batch.quantity);
//                                         }}
//                                       >✏️</button>
//                                     </>
//                                   )}
//                                 </td>
//                                 <td className="p-2 border border-gray-300">{batch.unit}</td>
//                                 <td className="p-2 border border-gray-300 text-xs text-gray-500">{batch.lowStockThreshold} {batch.unit}</td>
//                                 <td className="p-2 border border-gray-300">{batch.purchaseDate}</td>
//                                 <td className="p-2 border border-gray-300">{batch.amount}</td>
//                                 <td className="p-2 border border-gray-300">{batch.expiryDate}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// };

// const LowStockAlerts = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/inventory/low-stock")
//       .then((res) => res.json())
//       .then(({ lowStockItems }) => setItems(lowStockItems))
//       .catch(() => {});
//   }, []);

//   if (!items.length) return null;
//   return (
//     <section>
//       <h2 className="text-2xl font-bold mb-4">Low Stock Alerts</h2>
//       <div className="space-y-4">
//         {items.map((item) => (
//           <div
//             key={item.id}
//             className="flex items-center gap-4 bg-white p-4 rounded-xl border border-yellow-300 shadow-sm"
//           >
//             <div className="flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 w-12 h-12">
//               {/* Warning Icon */}
//               <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
//                 <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
//               </svg>
//             </div>
//             <div className="flex-1">
//               <h3 className="font-semibold">{item.item}</h3>
//               <p className="text-sm text-gray-600">
//                 Quantity: {item.batches?.reduce((sum, b) => sum + Number(b.quantity), 0)} {item.unit || (item.batches && item.batches.length && item.batches[0].unit)}
//               </p>
//             </div>
//             <time className="text-sm font-medium text-gray-600">
//               {item.batches && item.batches.length ? item.batches[0].expiryDate : ""}
//             </time>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// // ==== Expiry Notifications ====
// const ExpiryNotifications = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/inventory/expired")
//       .then((res) => res.json())
//       .then(({ expiredItems }) => setItems(expiredItems))
//       .catch(() => {});
//   }, []);

//   if (!items.length) return null;

//   function getNearExpiryQuantity(item) {
//     const today = new Date();
//     const nearExpiryLimit = new Date(today);
//     nearExpiryLimit.setDate(nearExpiryLimit.getDate() + 7);
//     return (item.batches || [])
//       .filter(batch => {
//         if (!batch.expiryDate) return false;
//         const expiryDate = new Date(batch.expiryDate);
//         return expiryDate >= today && expiryDate <= nearExpiryLimit;
//       })
//       .reduce((sum, batch) => sum + Number(batch.quantity || 0), 0);
//   }

//   return (
//     <section>
//       <h2 className="text-2xl font-bold mb-4">Expiry Notifications</h2>
//       <div className="space-y-4">
//         {items.map(item => {
//           const expiringQty = getNearExpiryQuantity(item);
//           return (
//             <div
//               key={item.id}
//               className="flex items-center gap-4 bg-white p-4 rounded-xl border border-red-300 shadow-sm"
//             >
//               <div className="flex items-center justify-center rounded-full bg-red-100 text-red-600 w-12 h-12">
//                 <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
//                   <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm40,80a8,8,0,1,1-16,0V80h32Z" />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.item}</h3>
//                 <p className="text-sm text-gray-600">
//                   Expiry soon — Quantity: {expiringQty}
//                 </p>
//               </div>
//               <time className="text-sm font-medium text-gray-600">
//                 {item.expiryDate}
//               </time>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// const MainContent = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [addBatchItem, setAddBatchItem] = useState(null);
//   const [batchModalOpen, setBatchModalOpen] = useState(false);
//   const [refresh, setRefresh] = useState(0);
//   const [refreshKey, setRefreshKey] = useState(0);

//   function openAdd() {
//     setEditingItem(null);
//     setModalOpen(true);
//   }
//   function openEdit(item) {
//     setEditingItem(item);
//     setModalOpen(true);
//   }
//   function openAddBatch(item) {
//     setAddBatchItem(item);
//     setBatchModalOpen(true);
//   }
//   function closeModal() {
//     setModalOpen(false);
//     setBatchModalOpen(false);
//   }

//   async function onSave(item) {
//     if (item.batches && item.batches.length) {
//       item.batches = item.batches.map(b => ({
//         ...b,
//         quantity: Number(b.quantity),
//         amount: Number(b.amount),
//       }));
//     }
//     try {
//       const res = await fetch(
//         item.id ? `http://localhost:5000/inventory/${item.id}` : "http://localhost:5000/inventory",
//         {
//           method: item.id ? "PUT" : "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(item),
//         }
//       );
//       if (res.ok) {
//         alert("Inventory saved.");
//         setModalOpen(false);
//         setRefresh(r => r + 1);
//         setRefreshKey(k => k + 1);
//       } else {
//         alert("Save failed");
//       }
//     } catch {
//       alert("Save failed");
//     }
//   }

//   async function onAddBatch(batch) {
//     if (!addBatchItem) return;
//     try {
//       const res = await fetch(`http://localhost:5000/inventory/${addBatchItem.id}`);
//       if (!res.ok) throw new Error("Failed to fetch item");
//       const currentItem = await res.json();
//       const batches = currentItem.batches || [];
//       batches.push({
//         ...batch,
//         quantity: Number(batch.quantity),
//         amount: Number(batch.amount),
//       });
//       const totalQty = batches.reduce((sum, b) => sum + Number(b.quantity), 0);
//       const status = totalQty <= (batches[0]?.lowStockThreshold || Math.ceil(totalQty * 0.2)) ? "Low Stock" : "In Stock";
//       const updateRes = await fetch(`http://localhost:5000/inventory/${addBatchItem.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...currentItem, batches, status }),
//       });
//       if (!updateRes.ok) throw new Error("Failed to update item");
//       alert("Batch added successfully");
//       setBatchModalOpen(false);
//       setAddBatchItem(null);
//       setRefresh(r => r + 1);
//       setRefreshKey(k => k + 1);
//     } catch (e) {
//       alert(e.message);
//     }
//   }

//   return (
//     <>
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-bold">Stock Control</h1>
//         <button
//           onClick={openAdd}
//           className="btn-primary flex items-center gap-2 px-4 py-2 rounded-full"
//         >
//           <svg fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
//             <path d="M224 128a8 8 0 0 1-8 8H136v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8z" />
//           </svg>
//           <span>Add New Item</span>
//         </button>
//       </header>

//       <StockTable
//         onEdit={openEdit}
//         onAddBatch={openAddBatch}
//         onRefresh={() => setRefresh(r => r + 1)}
//         key={refresh}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
//         <LowStockAlerts key={refreshKey + 1} />
//         <ExpiryNotifications key={refreshKey + 2} />
//       </div>

//       <InventoryModal
//         visible={modalOpen}
//         onClose={closeModal}
//         onSubmit={onSave}
//         initialData={editingItem}
//       />

//       <AddBatchModal
//         visible={batchModalOpen}
//         onClose={() => setBatchModalOpen(false)}
//         onSubmit={onAddBatch}
//         item={addBatchItem}
//       />
//     </>
//   );
// };

// const PathologyStockControl = () => (
//   <div
//     className="min-h-screen flex flex-col"
//     style={{
//       fontFamily: "'Public Sans', sans-serif",
//       "--brand-color": "#649ccd",
//       "--background-color": "#f7f9fc",
//       "--surface-color": "#fff",
//       "--text-primary": "#111",
//       "--text-secondary": "#637988",
//       "--border-color": "#D3D3D3"
//     }}
//   >
//     <header className="sticky top-0 bg-white shadow z-10 flex items-center justify-between p-4 border-b border-gray-300">
//       <h1 className="text-2xl font-bold flex items-center gap-2">
//         <svg className="w-8 h-8 text-[var(--brand-color)]" fill="none" viewBox="0 0 48 48">
//           <path
//             d="M42.17 20.17L27.83 5.83c1.3 1.3 2.04 3.36 1.39 5.04-1 2.21-4.17 3.8-6.56 3.83-3.3 0-5.1-3.5-7.5-3.84-3.7-.68-6.5-2.82-8-6C6.05 10 14.91 11 17.77 11c2 .3 7.1 3.8 9.83 5.7 3.3 2.4 6 5 8 8 3.3 2 .8 16-5.5 17-9.2-1-8.5-4-11-4C12 27 10 23 7 16.7c1.4-1.8 3.6-8 5.5-11 2.5 3 17 3 17 10z"
//             fill="currentColor"
//           />
//         </svg>
//         Pathology Stock Control
//       </h1>
//     </header>
//     <div className="flex flex-grow overflow-hidden">
//       <Sidebar />
//       <main className="flex-grow bg-[var(--background-color)] p-8 overflow-auto">
//         <MainContent />
//       </main>
//     </div>
//   </div>
// );

// export default PathologyStockControl;


import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from 'react-toastify';

const unitOptions = ["units", "pcs", "ml", "mg", "g", "l"];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

const InventoryModal = ({ visible, onClose, onSubmit, initialData }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(() => ({
    item: "",
    unit: "units",
    quantity: 0,
    purchaseDate: "",
    amount: 0,
    expiryDate: "",
    repurchaseDate: "",
    status: "In Stock",
    batches: [],
    ...initialData,
  }));

  useEffect(() => {
    setForm(form => ({
      item: "",
      unit: "units",
      quantity: 0,
      purchaseDate: "",
      amount: 0,
      expiryDate: "",
      repurchaseDate: "",
      status: "In Stock",
      batches: [],
      ...initialData,
    }));
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleBatchChange(index, field, value) {
    setForm(f => {
      const newBatches = [...(f.batches || [])];
      let lowStockThreshold = newBatches[index]?.lowStockThreshold;
      if (field === "quantity") {
        const qtyNum = Number(value);
        lowStockThreshold = isNaN(qtyNum) ? 0 : Math.ceil(qtyNum * 0.2);
      }
      newBatches[index] = { ...newBatches[index], [field]: value, lowStockThreshold };
      return { ...f, batches: newBatches };
    });
  }

  function addBatch() {
    setForm(f => ({
      ...f,
      batches: [...(f.batches || []), { quantity: 0, unit: f.unit || "units", purchaseDate: "", amount: 0, expiryDate: "", lowStockThreshold: 0 }]
    }));
  }

  function removeBatch(index) {
    setForm(f => {
      const newBatches = [...(f.batches || [])];
      newBatches.splice(index, 1);
      return { ...f, batches: newBatches };
    });
  }

  function handleSubmit() {
    if (!isEdit) {
      if (!form.item || !form.purchaseDate || form.amount == null || !form.expiryDate || form.quantity == null || !form.unit) {
        toast.error("Please fill all required fields for item.");
        return;
      }
      const lowStockThreshold = Math.ceil(Number(form.quantity) * 0.2);
      form.batches = [{
        quantity: form.quantity,
        unit: form.unit,
        purchaseDate: form.purchaseDate,
        amount: form.amount,
        expiryDate: form.expiryDate,
        lowStockThreshold,
      }];
    }
    if (isEdit && form.batches && form.batches.length > 0) {
      form.unit = form.batches[0].unit || "units";
    }
    if (isEdit) {
      if (!form.item) {
        toast.warn("Please fill item name.");
        return;
      }
      if (!form.batches || form.batches.length === 0) {
        toast.warn("Please add at least one batch.");
        return;
      }
      for (const b of form.batches) {
        if (b.quantity == null || !b.unit || !b.purchaseDate || b.amount == null || !b.expiryDate) {
          toast.warn("Please fill all required fields for batch.");
          return;
        }
      }
    }
    onSubmit(form);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">{isEdit ? "Edit Item" : "Add New Item"}</h3>
        <form onSubmit={e => e.preventDefault()} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="item" className="block font-medium mb-1">Item Name</label>
            <input
              id="item"
              name="item"
              value={form.item}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
              required
            />
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block font-medium mb-1">Quantity/Volume</label>
                <div className="flex gap-2">
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    className="flex-1 sm:w-32 border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
                    required
                    min={0}
                  />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
                  >
                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Purchase Date</label>
                  <input
                    name="purchaseDate"
                    type="date"
                    value={form.purchaseDate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Amount</label>
                  <input
                    name="amount"
                    type="number"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
                    required
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Expiry Date</label>
                <input
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
            >
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Expired</option>
            </select>
          </div>

          {isEdit && (
            <div>
              <label className="block font-semibold mb-2">Batches</label>
              <button
                type="button"
                onClick={addBatch}
                className="mb-4 text-sm text-blue-600 hover:underline"
              >
                + Add Batch
              </button>
              {(form.batches || []).map((batch, idx) => (
                <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium mb-1">Quantity/Volume</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={batch.quantity}
                          onChange={e => handleBatchChange(idx, "quantity", e.target.value)}
                          className="flex-1 border rounded px-2 py-1 focus:ring-1 focus:ring-[var(--brand-color)]"
                          min={0}
                        />
                        <select
                          value={batch.unit || "units"}
                          onChange={e => handleBatchChange(idx, "unit", e.target.value)}
                          className="border rounded px-2 py-1 focus:ring-1 focus:ring-[var(--brand-color)]"
                        >
                          {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBatch(idx)}
                      className="text-red-600 font-bold px-2 py-1 self-start sm:self-end h-8 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Purchase Date</label>
                      <input
                        type="date"
                        value={batch.purchaseDate}
                        onChange={e => handleBatchChange(idx, "purchaseDate", e.target.value)}
                        className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-[var(--brand-color)]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <input
                        type="number"
                        value={batch.amount}
                        onChange={e => handleBatchChange(idx, "amount", e.target.value)}
                        className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-[var(--brand-color)]"
                        min={0}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={batch.expiryDate}
                        onChange={e => handleBatchChange(idx, "expiryDate", e.target.value)}
                        className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-[var(--brand-color)]"
                        required
                      />
                    </div>
                  </div>

                  <small className="text-xs text-gray-500 mt-2 block">
                    Low Stock Threshold: {batch.lowStockThreshold || Math.ceil((batch.quantity || 0) * 0.2)} {batch.unit}
                  </small>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-[var(--brand-color)] text-white hover:bg-teal-700 transition-colors"
            >
              {isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddBatchModal = ({ visible, onClose, onSubmit, item }) => {
  const [batch, setBatch] = useState({
    quantity: 0,
    unit: "units",
    purchaseDate: "",
    amount: 0,
    expiryDate: "",
    lowStockThreshold: 0,
  });

  useEffect(() => {
    if (!visible) setBatch({
      quantity: 0,
      unit: "units",
      purchaseDate: "",
      amount: 0,
      expiryDate: "",
      lowStockThreshold: 0,
    });
  }, [visible]);

  function handleChange(e) {
    const { name, value } = e.target;
    setBatch(prev => {
      const newBatch = { ...prev, [name]: value };
      if (name === "quantity") {
        const qtyNum = Number(value);
        newBatch.lowStockThreshold = isNaN(qtyNum) ? 0 : Math.ceil(qtyNum * 0.2);
      }
      return newBatch;
    });
  }

  function submit() {
    if (!batch.quantity || !batch.unit || !batch.purchaseDate || !batch.amount || !batch.expiryDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    onSubmit(batch);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Add Batch - {item?.item}</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity/Volume</label>
            <div className="flex gap-2">
              <input
                name="quantity"
                type="number"
                value={batch.quantity}
                onChange={handleChange}
                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
              />
              <select
                name="unit"
                value={batch.unit}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
              >
                {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={batch.purchaseDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={batch.amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={batch.expiryDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--brand-color)]"
            />
          </div>

          <small className="text-xs text-gray-500 block">
            Low Stock Threshold: {batch.lowStockThreshold} {batch.unit}
          </small>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-[var(--brand-color)] text-white rounded hover:bg-teal-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const StockTable = ({ onEdit, onAddBatch, onRefresh }) => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [editingBatch, setEditingBatch] = useState({ itemId: null, batchIdx: null });
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/inventory`);
      const { inventory } = await res.json();
      setInventory(inventory);
    } catch {
      toast.error("Error fetching inventory");
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function saveBatchUpdate(item, batchIdx) {
    const newQty = Number(editingValue);
    if (isNaN(newQty) || newQty < 0) {
      toast.error("Enter valid quantity.");
      return;
    }
    try {
      const updateRes = await fetch(`${BACKEND_URL}/inventory/${item.id}/batch/${batchIdx}/quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (updateRes.ok) {
        toast.success("Batch quantity updated successfully");
        setEditingBatch({ itemId: null, batchIdx: null });
        setEditingValue("");
        setRefresh((r) => r + 1);
        if (onRefresh) onRefresh();
      } else {
        toast.error("Failed to update batch");
      }
    } catch {
      toast.error("Error updating batch");
    }
  }

  const filtered = inventory.filter(
    (itm) =>
      itm.item.toLowerCase().includes(search.toLowerCase()) ||
      itm.category?.toLowerCase().includes(search.toLowerCase())
  );

  function totalQuantity(item) {
    if (!item.batches || item.batches.length === 0) return item.quantity || 0;
    return item.batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  }

  function earliestExpiry(item) {
    if (!item.batches || item.batches.length === 0) return item.expiryDate || "";
    const dates = item.batches.map((b) => b.expiryDate).filter(Boolean);
    return dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : "";
  }

  function isItemExpired(item) {
    if (!item.batches) return false;
    const today = new Date();
    return item.batches.some(batch => {
      if (!batch.expiryDate) return false;
      return new Date(batch.expiryDate) < today;
    });
  }

  function getStockStatus(item) {
    if (isItemExpired(item)) return "Expired";

    if (!item.batches || item.batches.length === 0) return "Out of Stock";

    const totalStock = item.batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
    if (totalStock === 0) return "Out of Stock";

    const aggregateThreshold = item.batches
      .filter(b => Number(b.quantity) > 0)
      .reduce((sum, b) => sum + Number(b.lowStockThreshold || Math.ceil(Number(b.quantity) * 0.2)), 0);

    return totalStock <= aggregateThreshold ? "Low Stock" : "In Stock";
  }

  if (loading) {
    return (
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Reagents and Supplies</h2>
          <div className="w-full sm:max-w-sm">
            <div className="animate-pulse bg-gray-200 h-12 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-8">
          <LoadingSpinner size="large" />
          <p className="text-center text-gray-500 mt-4">Loading inventory...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Reagents and Supplies</h2>
        <div className="relative w-full sm:max-w-sm">
          <input
            className="form-input w-full rounded-full border-gray-700 border bg-white h-12 pl-10 pr-4 text-base focus:ring-2 focus:ring-[var(--brand-color)] focus:border-[var(--brand-color)]"
            placeholder="Search reagents & supplies"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-[#c1d7eb] opacity-90">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Item</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Quantity</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Purchase Date</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Repurchase Date</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Expiry Date</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Status</th>
              <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-600 tracking-wider">Details</th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-600 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No matching items found.
                </td>
              </tr>
            )}
            {filtered.map((item) => {
              const status = getStockStatus(item);
              const isExpanded = !!expanded[item.id];
              const repurchaseDate =
                item.repurchaseDate ||
                (item.batches && item.batches.length > 1
                  ? item.batches[item.batches.length - 1].purchaseDate
                  : "");
              return (
                <React.Fragment key={item.id}>
                  <tr className={status === "Low Stock" ? "bg-yellow-50" : status === "Out of Stock" ? "bg-red-50" : status === "Expired" ? "bg-red-100" : ""}>
                    <td className="px-3 sm:px-6 py-3 font-semibold text-gray-900 break-words">{item.item}</td>
                    <td className="px-3 sm:px-6 py-3 text-gray-700 whitespace-nowrap">
                      {totalQuantity(item)} {item.unit || (item.batches && item.batches.length && item.batches[0].unit)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-700 whitespace-nowrap">{item.batches?.[0]?.purchaseDate || ""}</td>
                    <td className="px-3 sm:px-6 py-3 text-gray-700 whitespace-nowrap">{repurchaseDate || "--"}</td>
                    <td className="px-3 sm:px-6 py-3 text-gray-700 whitespace-nowrap">{earliestExpiry(item)}</td>
                    <td className="px-3 sm:px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : status === "Expired"
                              ? "bg-red-100 text-red-800"
                              : status === "Out of Stock"
                                ? "bg-red-800 text-red-900"
                                : "bg-green-100 text-green-800"
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-center">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} batch details`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <button className="text-blue-600 hover:underline text-xs sm:text-sm" onClick={() => onEdit(item)}>
                          Edit
                        </button>
                        <button className="text-green-600 hover:underline text-xs sm:text-sm" onClick={() => onAddBatch(item)}>
                          Add Batch
                        </button>
                        <button
                          className="text-red-600 hover:underline text-xs sm:text-sm"
                          onClick={() => {
                            if (window.confirm(`Delete ${item.item}?`)) {
                              onEdit(null);
                              fetch(`${BACKEND_URL}/inventory/${item.id}`, { method: "DELETE" })
                                .then((res) => {
                                  if (res.ok) {
                                    toast.success("Deleted successfully");
                                    setRefresh((r) => r + 1);
                                  } else {
                                    toast.error("Delete failed");
                                  }
                                })
                                .catch(() => toast.error("Delete failed"));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && item.batches && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 p-3 sm:p-4">
                        <strong className="block mb-2">Batches:</strong>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-300 text-xs sm:text-sm min-w-[600px]">
                            <thead className="bg-white border-b border-gray-300">
                              <tr>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">#</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Quantity</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Unit</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Low Stock Threshold</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Purchase Date</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Amount</th>
                                <th className="p-1 sm:p-2 border border-gray-300 text-left">Expiry Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.batches.map((batch, i) => (
                                <tr key={i}>
                                  <td className="p-1 sm:p-2 border border-gray-300">{i + 1}</td>
                                  <td className="p-1 sm:p-2 border border-gray-300">
                                    {editingBatch.itemId === item.id && editingBatch.batchIdx === i ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min={0}
                                          value={editingValue}
                                          onChange={e => setEditingValue(e.target.value)}
                                          className="w-16 border rounded px-1 py-0.5 text-xs"
                                          autoFocus
                                        />
                                        <button
                                          className="text-green-600 px-1 hover:bg-green-50 rounded"
                                          title="Save"
                                          type="button"
                                          onClick={() => saveBatchUpdate(item, i)}
                                        >
                                          ✔
                                        </button>
                                        <button
                                          className="text-gray-500 px-1 hover:bg-gray-50 rounded"
                                          title="Cancel"
                                          type="button"
                                          onClick={() => setEditingBatch({ itemId: null, batchIdx: null })}
                                        >
                                          ✖
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <span>{batch.quantity}</span>
                                        <button
                                          className="text-blue-600 text-xs hover:bg-blue-50 rounded px-1"
                                          title="Edit"
                                          type="button"
                                          onClick={() => {
                                            setEditingBatch({ itemId: item.id, batchIdx: i });
                                            setEditingValue(batch.quantity);
                                          }}
                                        >
                                          ✏️
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-1 sm:p-2 border border-gray-300">{batch.unit}</td>
                                  <td className="p-1 sm:p-2 border border-gray-300 text-xs text-gray-500">
                                    {batch.lowStockThreshold} {batch.unit}
                                  </td>
                                  <td className="p-1 sm:p-2 border border-gray-300">{batch.purchaseDate}</td>
                                  <td className="p-1 sm:p-2 border border-gray-300">{batch.amount}</td>
                                  <td className="p-1 sm:p-2 border border-gray-300">{batch.expiryDate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const LowStockAlerts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/inventory/low-stock`)
      .then((res) => res.json())
      .then(({ lowStockItems }) => setItems(lowStockItems))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Low Stock Alerts</h2>
        <div className="bg-white rounded-xl border border-yellow-300 p-6">
          <LoadingSpinner />
          <p className="text-center text-gray-500 mt-2">Loading alerts...</p>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Low Stock Alerts</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-yellow-300 shadow-sm"
          >
            <div className="flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
                <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{item.item}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Quantity: {item.batches?.reduce((sum, b) => sum + Number(b.quantity), 0)} {item.unit || (item.batches && item.batches.length && item.batches[0].unit)}
              </p>
            </div>
            <time className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0">
              {item.batches && item.batches.length ? item.batches[0].expiryDate : ""}
            </time>
          </div>
        ))}
      </div>
    </section>
  );
};

const ExpiryNotifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/inventory/expired`)
      .then((res) => res.json())
      .then(({ expiredItems }) => setItems(expiredItems))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function getNearExpiryQuantity(item) {
    const today = new Date();
    const nearExpiryLimit = new Date(today);
    nearExpiryLimit.setDate(nearExpiryLimit.getDate() + 7);
    return (item.batches || [])
      .filter(batch => {
        if (!batch.expiryDate) return false;
        const expiryDate = new Date(batch.expiryDate);
        return expiryDate >= today && expiryDate <= nearExpiryLimit;
      })
      .reduce((sum, batch) => sum + Number(batch.quantity || 0), 0);
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Expiry Notifications</h2>
        <div className="bg-white rounded-xl border border-red-300 p-6">
          <LoadingSpinner />
          <p className="text-center text-gray-500 mt-2">Loading notifications...</p>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Expiry Notifications</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map(item => {
          const expiringQty = getNearExpiryQuantity(item);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-red-300 shadow-sm"
            >
              <div className="flex items-center justify-center rounded-full bg-red-100 text-red-600 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
                  <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">{item.item}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Expiry soon — Quantity: {expiringQty}
                </p>
              </div>
              <time className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0">
                {item.expiryDate}
              </time>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const MainContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [addBatchItem, setAddBatchItem] = useState(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function openAddBatch(item) {
    setAddBatchItem(item);
    setBatchModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setBatchModalOpen(false);
  }

  async function onSave(item) {
    setSaving(true);
    if (item.batches && item.batches.length) {
      item.batches = item.batches.map(b => ({
        ...b,
        quantity: Number(b.quantity),
        amount: Number(b.amount),
      }));
    }
    try {
      const res = await fetch(
        item.id ? `${BACKEND_URL}/inventory/${item.id}` : `${BACKEND_URL}/inventory`,
        {
          method: item.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }
      );
      if (res.ok) {
        toast.success("Item saved successfully");
        setModalOpen(false);
        setRefresh(r => r + 1);
        setRefreshKey(k => k + 1);
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onAddBatch(batch) {
    if (!addBatchItem) return;
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/inventory/${addBatchItem.id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      const currentItem = await res.json();
      const batches = currentItem.batches || [];
      batches.push({
        ...batch,
        quantity: Number(batch.quantity),
        amount: Number(batch.amount),
      });
      const totalQty = batches.reduce((sum, b) => sum + Number(b.quantity), 0);
      const status = totalQty <= (batches[0]?.lowStockThreshold || Math.ceil(totalQty * 0.2)) ? "Low Stock" : "In Stock";
      const updateRes = await fetch(`${BACKEND_URL}/inventory/${addBatchItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentItem, batches, status }),
      });
      if (!updateRes.ok) throw new Error("Failed to update item");
      toast.success("Batch added successfully");
      setBatchModalOpen(false);
      setAddBatchItem(null);
      setRefresh(r => r + 1);
      setRefreshKey(k => k + 1);
    } catch (e) {
      toast.error("Failed to add batch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {saving && <LoadingOverlay message="Saving..." />}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold">Stock Control</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-color)] text-white hover:bg-teal-700 transition-colors shadow-md w-full sm:w-auto justify-center"
        >
          <svg fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <path d="M224 128a8 8 0 0 1-8 8H136v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8z" />
          </svg>
          <span>Add New Item</span>
        </button>
      </header>

      <StockTable
        onEdit={openEdit}
        onAddBatch={openAddBatch}
        onRefresh={() => setRefresh(r => r + 1)}
        key={refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <LowStockAlerts key={refreshKey + 1} />
        <ExpiryNotifications key={refreshKey + 2} />
      </div>

      <InventoryModal
        visible={modalOpen}
        onClose={closeModal}
        onSubmit={onSave}
        initialData={editingItem}
      />

      <AddBatchModal
        visible={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        onSubmit={onAddBatch}
        item={addBatchItem}
      />
    </>
  );
};

const PathologyStockControl = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

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
        fontFamily: "'Public Sans', sans-serif",
        "--brand-color": "#649ccd",
        "--background-color": "#f8f9fa",
        "--surface-color": "#fff",
        "--text-primary": "#111",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3"
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
        <main className="flex-grow bg-[#f0f5fa] overflow-auto p-6">
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
                Inventory Management
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
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <MainContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PathologyStockControl;