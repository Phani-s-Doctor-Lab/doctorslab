// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";

// // Set your color variables globally!
// const pageStyle = {
//   fontFamily: '"Public Sans", sans-serif',
//   "--primary-color": "#649ccd",
//   "--primary-light-color": "#f7f9fc",
//   "--secondary-color": "#fff",
//   "--text-primary-color": "#111",
//   "--text-secondary-color": "#637988",
//   "--border-color": "#D3D3D3",
// };

// // ------- Staff Form Modal -------
// function StaffModal({ open, staff, onClose, onSave, mode }) {
//   const [form, setForm] = useState({
//     name: staff?.name || "",
//     department: staff?.department || "",
//     role: staff?.role || "",
//     contact: staff?.contact || "",
//     status: staff?.status || "Active",
//   });

//   useEffect(() => {
//     setForm({
//       name: staff?.name || "",
//       department: staff?.department || "",
//       role: staff?.role || "",
//       contact: staff?.contact || "",
//       status: staff?.status || "Active",
//     });
//   }, [open, staff]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!form.name || !form.department || !form.role || !form.contact) {
//       alert("Fill required fields");
//       return;
//     }
//     onSave(form);
//   }

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mx-2 relative">
//         <button
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
//           onClick={onClose}
//         >&times;</button>
//         <h2 className="text-2xl font-bold mb-6 text-[var(--primary-color)]">
//           {mode === "edit" ? "Edit Staff" : "Add Staff"}
//         </h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input name="name" value={form.name} onChange={handleChange}
//             placeholder="Name" className="w-full border rounded px-3 py-2" />
//           <input name="department" value={form.department} onChange={handleChange}
//             placeholder="Department" className="w-full border rounded px-3 py-2" />
//           <input name="role" value={form.role} onChange={handleChange}
//             placeholder="Role" className="w-full border rounded px-3 py-2" />
//           <input name="contact" value={form.contact} onChange={handleChange}
//             placeholder="Contact" className="w-full border rounded px-3 py-2" />
//           <select name="status" value={form.status} onChange={handleChange}
//             className="w-full border rounded px-3 py-2">
//             <option>Active</option>
//             <option>Inactive</option>
//           </select>
//           <div className="flex justify-end gap-3 pt-4">
//             <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
//             <button type="submit" className="btn-primary px-4 py-2 rounded bg-[var(--primary-color)] text-white font-semibold">
//               {mode === "edit" ? "Save Changes" : "Add Staff"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Utility to get all days of current month as array {date, dayOfWeek}
// function getMonthDays(year, month) {
//   const days = [];
//   const date = new Date(year, month, 1);
//   while (date.getMonth() === month) {
//     // Format local date string YYYY-MM-DD same as getTodayStringIST()
//     const year = date.getFullYear();
//     const mon = String(date.getMonth() + 1).padStart(2, '0'); // local month
//     const day = String(date.getDate()).padStart(2, '0');      // local day
//     days.push({
//       date: `${year}-${mon}-${day}`,
//       day: date.getDay(),
//       dayOfMonth: date.getDate(),
//     });
//     date.setDate(date.getDate() + 1);
//   }
//   return days;
// }

// function getTodayStringIST() {
//   const now = new Date();
//   // Convert to IST by adding 5.5 hours offset (19800000 milliseconds)
//   const istTime = new Date(now.getTime() + (330 * 60 * 1000)); // 330 minutes = 5.5 hours
//   console.log(istTime);
//   const year = istTime.getUTCFullYear();
//   const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(istTime.getUTCDate()).padStart(2, '0');
//   console.log(`${year}-${month}-${day}`);
//   return `${year}-${month}-${day}`;
// }

// // In AttendanceModal:
// function AttendanceCalendar({ attendance }) {
//   const todayDT = new Date();
//   const [month, setMonth] = useState(todayDT.getMonth());
//   const [year, setYear] = useState(todayDT.getFullYear());

//   // Prepare a status map for quick lookup
//   const attendanceMap = {};
//   attendance.forEach((record) => {
//     attendanceMap[record.date] = record.status;
//   });

//   const days = getMonthDays(year, month);

//   // Find which weekday the 1st of month falls on (0=Sun..6=Sat) for grid offset
//   const firstWeekDay = days[0].day;

//   // Month/year switching
//   function prevMonth() {
//     setMonth((m) => (m === 0 ? 11 : m - 1));
//     if (month === 0) setYear((y) => y - 1);
//   }
//   function nextMonth() {
//     setMonth((m) => (m === 11 ? 0 : m + 1));
//     if (month === 11) setYear((y) => y + 1);
//   }

//   // Coloring status
//   function getStatusDot(status) {
//     if (status === "Present") return "bg-green-500";
//     if (status === "Absent") return "bg-red-500";
//     if (status === "Leave") return "bg-yellow-500";
//     if (status === "Holiday") return "bg-gray-300";
//     return "bg-gray-100";
//   }

//   return (
//     <div className="mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-100">&lt;</button>
//         <h2 className="text-lg font-semibold">{new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}</h2>
//         <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-100">&gt;</button>
//       </div>
//       {/* Week headers */}
//       <div className="grid grid-cols-7 text-center text-xs text-[var(--text-secondary-color)] font-semibold border-b border-[var(--border-color)] pb-2 mb-2 uppercase">
//         <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
//       </div>
//       {/* Date grid */}
//       <div className="grid grid-cols-7 gap-px border-l border-t border-[var(--border-color)]">
//         {/* filler for start */}
//         {Array.from({ length: firstWeekDay }).map((_, idx) => (
//           <div key={`filler-${idx}`} className="h-16 bg-gray-50 border-b border-r border-[var(--border-color)]" />
//         ))}
//         {days.map((d, i) => (
//           <div key={d.date}
//             className={`relative h-16 p-2 border-b border-r border-[var(--border-color)] text-sm ${d.date === getTodayStringIST() ? "bg-gray-100" : ""}`}
//           >
//             <span className="font-medium">{d.dayOfMonth}</span>
//             {attendanceMap[d.date] && (
//               <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full mx-auto mt-1"
//                    title={attendanceMap[d.date]}
//                    style={{ right: "unset" }}
//                    >
//                 <div className={`w-3 h-3 rounded-full ${getStatusDot(attendanceMap[d.date])}`}></div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       {/* Legend */}
//       <div className="flex gap-3 mt-3 items-center">
//         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div>Present</div>
//         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div>Absent</div>
//         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div>Leave</div>
//         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded-full"></div>Holiday</div>
//       </div>
//     </div>
//   );
// }

// // ------- Attendance Modal -------
// function AttendanceModal({ open, staff, onClose }) {
//   const [attendance, setAttendance] = useState([]);
//   const [newStatus, setNewStatus] = useState("Present");
//   const todayStr = getTodayStringIST();

//   useEffect(() => {
//     if (open && staff) {
//       fetch(`http://localhost:5000/attendance/${staff.id}`)
//         .then(res => res.json())
//         .then(data => setAttendance(data.attendance || []))
//         .catch(() => setAttendance([]));
//     }
//   }, [open, staff]);

//   function markAttendance() {
//     fetch("http://localhost:5000/attendance", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ staffId: staff.id, date: todayStr, status: newStatus }),
//     })
//       .then(res => res.json())
//       .then(res => {
//         alert("Attendance marked!");
//         setAttendance(att => [...att, { staffId: staff.id, date: todayStr, status: newStatus }]);
//       })
//       .catch(() => alert("Failed to mark attendance"));
//   }

//   if (!open || !staff) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mx-2 relative">
//         <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//           onClick={onClose}>&times;</button>
//         <h2 className="text-xl font-bold mb-4 text-[var(--primary-color)]">
//           Attendance: {staff.name}
//         </h2>
//         <div className="mb-3">
//           <span className="font-semibold">Today: {todayStr}</span>
//           <div className="mt-2 flex gap-3 items-center">
//             <select className="border rounded px-3 py-2" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
//               <option>Present</option>
//               <option>Absent</option>
//               <option>Leave</option>
//               <option>Holiday</option>
//             </select>
//             <button
//               onClick={markAttendance}
//               className="px-4 py-2 bg-[var(--primary-color)] text-white font-semibold rounded"
//             >
//               Mark
//             </button>
//           </div>
//         </div>
//         <h3 className="font-semibold mb-2">Past Attendance</h3>
//         <div className="max-h-60 overflow-y-auto border rounded bg-gray-50 p-2">
//           <AttendanceCalendar attendance={attendance} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ------- Main Page -------
// export default function StaffManagementPage() {
//   const [staff, setStaff] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalStaff, setModalStaff] = useState(null);
//   const [modalMode, setModalMode] = useState("add");
//   const [attendanceOpen, setAttendanceOpen] = useState(false);
//   const [attendanceStaff, setAttendanceStaff] = useState(null);

//   // GET staff on mount
//   useEffect(() => {
//     fetch("http://localhost:5000/staff")
//       .then(res => res.json())
//       .then(data => setStaff(data.staff || []))
//       .catch(() => setStaff([]));
//   }, []);

//   // ADD or EDIT staff
//   function handleSaveStaff(form) {
//     if (modalMode === "edit" && modalStaff) {
//       // Update
//       fetch(`http://localhost:5000/staff/${modalStaff.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//         .then(res => res.json())
//         .then(res => {
//           setStaff(staff => staff.map(s => s.id === modalStaff.id ? { ...s, ...form } : s));
//           setModalOpen(false);
//         });
//     } else {
//       // Add
//       fetch("http://localhost:5000/staff", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//         .then(res => res.json())
//         .then(res => {
//           setStaff(staff => [...staff, res.staff]);
//           setModalOpen(false);
//         });
//     }
//   }

//   function handleDeleteStaff(id) {
//     if (!window.confirm("Delete staff member?")) return;
//     fetch(`http://localhost:5000/staff/${id}`, { method: "DELETE" })
//       .then(res => res.json())
//       .then(() => setStaff(staff => staff.filter(s => s.id !== id)));
//   }

//   function openAddStaff() {
//     setModalStaff(null);
//     setModalMode("add");
//     setModalOpen(true);
//   }

//   function openEditStaff(staffObj) {
//     setModalStaff(staffObj);
//     setModalMode("edit");
//     setModalOpen(true);
//   }

//   function openAttendance(staffObj) {
//     setAttendanceStaff(staffObj);
//     setAttendanceOpen(true);
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={pageStyle}>
//       <header className="sticky top-0 bg-white shadow z-10 flex items-center justify-between p-4 border-b border-gray-300">
//         <h1 className="text-2xl font-bold flex items-center gap-2">
//             <svg className="w-8 h-8 text-[var(--brand-color)]" fill="none" viewBox="0 0 48 48"><path d="M42.17 20.17L27.83 5.83c1.3 1.3 2.04 3.36 1.39 5.04-1 2.21-4.17 3.8-6.56 3.83-3.3 0-5.1-3.5-7.5-3.84-3.7-.68-6.5-2.82-8-6C6.05 10 14.91 11 17.77 11c2 .3 7.1 3.8 9.83 5.7 3.3 2.4 6 5 8 8 3.3 2 .8 16-5.5 17-9.2-1-8.5-4-11-4C12 27 10 23 7 16.7c1.4-1.8 3.6-8 5.5-11 2.5 3 17 3 17 10z" fill="currentColor" /></svg>
//             Pathology Stock Control
//         </h1>
//         {/* Add nav or user menu later */}
//       </header>
//       <div className="flex flex-grow overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar />
//         {/* Main Content */}
//         <main className="flex-1 px-10 py-8">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold text-[var(--text-primary-color)]">Staff Management</h1>
//             <button
//               onClick={openAddStaff}
//               className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90 transition-all"
//             >
//               <span>Add Staff</span>
//             </button>
//           </div>
//           <div className="mt-6 bg-white border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-[var(--border-color)]">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Dept.</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Role</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[var(--border-color)]">
//                 {staff.map(s => (
//                   <tr key={s.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary-color)]">{s.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary-color)]">{s.department}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary-color)]">{s.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary-color)]">{s.contact}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span className={
//                         s.status === "Active"
//                           ? "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
//                           : "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
//                       }>
//                         {s.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
//                       <button
//                         className="text-blue-600 hover:underline"
//                         onClick={() => openEditStaff(s)}
//                       >Edit</button>
//                       <button
//                         className="text-red-600 hover:underline"
//                         onClick={() => handleDeleteStaff(s.id)}
//                       >Delete</button>
//                       <button
//                         className="text-[var(--primary-color)] hover:underline"
//                         onClick={() => openAttendance(s)}
//                       >Attendance</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Modals */}
//           <StaffModal
//             open={modalOpen}
//             staff={modalStaff}
//             mode={modalMode}
//             onClose={() => setModalOpen(false)}
//             onSave={handleSaveStaff}
//           />
//           <AttendanceModal
//             open={attendanceOpen}
//             staff={attendanceStaff}
//             onClose={() => setAttendanceOpen(false)}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from 'react-toastify';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Global page style
const pageStyle = {
  fontFamily: '"Public Sans", sans-serif',
  "--primary-color": "#649ccd",
  "--primary-light-color": "#c1d7eb",
  "--secondary-color": "#fff",
  "--text-primary-color": "#111",
  "--text-secondary-color": "#637988",
  "--border-color": "#D3D3D3",
};

// ------- Staff Form Modal -------
function StaffModal({ open, staff, onClose, onSave, mode }) {
  const [form, setForm] = useState({
    name: staff?.name || "",
    department: staff?.department || "",
    role: staff?.role || "",
    contact: staff?.contact || "",
    status: staff?.status || "Active",
  });

  useEffect(() => {
    setForm({
      name: staff?.name || "",
      department: staff?.department || "",
      role: staff?.role || "",
      contact: staff?.contact || "",
      status: staff?.status || "Active",
    });
  }, [open, staff]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.department || !form.role || !form.contact) {
      toast.error("Please fill all required fields.");
      return;
    }
    onSave(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--primary-color)]">
          {mode === "edit" ? "Edit Staff" : "Add Staff"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full border rounded px-3 py-2"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--primary-color)] text-white font-semibold hover:opacity-90"
            >
              {mode === "edit" ? "Save Changes" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Utility to get all days of current month as array {date, dayOfWeek}
function getMonthDays(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const yearVal = date.getFullYear();
    const mon = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    days.push({
      date: `${yearVal}-${mon}-${day}`,
      day: date.getDay(),
      dayOfMonth: date.getDate(),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getTodayStringIST() {
  const now = new Date();
  const istTime = new Date(now.getTime() + 330 * 60 * 1000);
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istTime.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Attendance Calendar
function AttendanceCalendar({ attendance }) {
  const todayDT = new Date();
  const [month, setMonth] = useState(todayDT.getMonth());
  const [year, setYear] = useState(todayDT.getFullYear());

  const attendanceMap = {};
  attendance.forEach((record) => {
    attendanceMap[record.date] = record.status;
  });

  const days = getMonthDays(year, month);
  const firstWeekDay = days[0].day;

  function prevMonth() {
    setMonth((m) => (m === 0 ? 11 : m - 1));
    if (month === 0) setYear((y) => y - 1);
  }
  function nextMonth() {
    setMonth((m) => (m === 11 ? 0 : m + 1));
    if (month === 11) setYear((y) => y + 1);
  }

  function getStatusDot(status) {
    if (status === "Present") return "bg-green-500";
    if (status === "Absent") return "bg-red-500";
    if (status === "Leave") return "bg-yellow-500";
    if (status === "Holiday") return "bg-gray-300";
    return "bg-gray-100";
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded hover:bg-gray-100"
        >
          &lt;
        </button>
        <h2 className="text-sm sm:text-lg font-semibold">
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      {/* Week headers */}
      <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs text-[var(--text-secondary-color)] font-semibold border-b border-[var(--border-color)] pb-2 mb-2 uppercase">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      {/* Date grid */}
      <div className="grid grid-cols-7 gap-px border-l border-t border-[var(--border-color)]">
        {Array.from({ length: firstWeekDay }).map((_, idx) => (
          <div
            key={`filler-${idx}`}
            className="h-12 sm:h-16 bg-gray-50 border-b border-r border-[var(--border-color)]"
          />
        ))}
        {days.map((d) => (
          <div
            key={d.date}
            className={`relative h-12 sm:h-16 p-1 sm:p-2 border-b border-r border-[var(--border-color)] text-[10px] sm:text-sm ${d.date === getTodayStringIST() ? "bg-gray-100" : ""
              }`}
          >
            <span className="font-medium">{d.dayOfMonth}</span>
            {attendanceMap[d.date] && (
              <div
                className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                title={attendanceMap[d.date]}
              >
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getStatusDot(
                    attendanceMap[d.date]
                  )}`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ------- Attendance Modal -------
function AttendanceModal({ open, staff, onClose }) {
  const [attendance, setAttendance] = useState([]);
  const [newStatus, setNewStatus] = useState("Present");
  const todayStr = getTodayStringIST();

  useEffect(() => {
    if (open && staff) {
      fetch(`${BACKEND_URL}/attendance/${staff.id}`)
        .then((res) => res.json())
        .then((data) => setAttendance(data.attendance || []))
        .catch(() => setAttendance([]));
    }
  }, [open, staff]);

  function markAttendance() {
    fetch(`${BACKEND_URL}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId: staff.id,
        date: todayStr,
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Attendance marked!");
        setAttendance((att) => [
          ...att,
          { staffId: staff.id, date: todayStr, status: newStatus },
        ]);
      })
      .catch(() => toast.error("Failed to mark attendance"));
  }

  if (!open || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[var(--primary-color)]">
          Attendance: {staff.name}
        </h2>
        <div className="mb-3">
          <span className="font-semibold text-sm sm:text-base">
            Today: {todayStr}
          </span>
          <div className="mt-2 flex gap-2 sm:gap-3 items-center">
            <select
              className="border rounded px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
              <option>Holiday</option>
            </select>
            <button
              onClick={markAttendance}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-[var(--primary-color)] text-white font-semibold rounded hover:opacity-90"
            >
              Mark
            </button>
          </div>
        </div>
        <h3 className="font-semibold mb-2 text-sm sm:text-base">
          Past Attendance
        </h3>
        <div className="max-h-60 overflow-y-auto border rounded bg-gray-50 p-2">
          <AttendanceCalendar attendance={attendance} />
        </div>
      </div>
    </div>
  );
}

// ------- Main Page -------
export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStaff, setModalStaff] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [attendanceStaff, setAttendanceStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  useEffect(() => {
    fetch(`${BACKEND_URL}/staff`)
      .then((res) => res.json())
      .then((data) => {
        setStaff(data.staff || []);
        setLoading(false);
      })
      .catch(() => {
        setStaff([]);
        setLoading(false);
      });
  }, []);

  function handleSaveStaff(form) {
    if (modalMode === "edit" && modalStaff) {
      fetch(`${BACKEND_URL}/staff/${modalStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then(() => {
          setStaff((staff) =>
            staff.map((s) =>
              s.id === modalStaff.id ? { ...s, ...form } : s
            )
          );
          setModalOpen(false);
        });
    } else {
      fetch(`${BACKEND_URL}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          setStaff((staff) => [...staff, res.staff]);
          setModalOpen(false);
        });
    }
  }

  function handleDeleteStaff(id) {
    if (!window.confirm("Delete staff member?")) return;
    fetch(`${BACKEND_URL}/staff/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setStaff((staff) => staff.filter((s) => s.id !== id)));
  }

  function openAddStaff() {
    setModalStaff(null);
    setModalMode("add");
    setModalOpen(true);
  }

  function openEditStaff(staffObj) {
    setModalStaff(staffObj);
    setModalMode("edit");
    setModalOpen(true);
  }

  function openAttendance(staffObj) {
    setAttendanceStaff(staffObj);
    setAttendanceOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col" style={pageStyle}>
      {/* Header */}
      {/* <header className="sticky top-0 bg-white shadow z-20 flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--brand-color)]"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M42.17 20.17L27.83 5.83c1.3 1.3 2.04 3.36 1.39 5.04-1 2.21-4.17 3.8-6.56 3.83-3.3 0-5.1-3.5-7.5-3.84-3.7-.68-6.5-2.82-8-6C6.05 10 14.91 11 17.77 11c2 .3 7.1 3.8 9.83 5.7 3.3 2.4 6 5 8 8 3.3 2 .8 16-5.5 17-9.2-1-8.5-4-11-4C12 27 10 23 7 16.7c1.4-1.8 3.6-8 5.5-11 2.5 3 17 3 17 10z"
                fill="currentColor"
              />
            </svg>
            Pathology Stock Control
          </h1>
        </div>
      </header> */}

      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:relative sm:translate-x-0 sm:shadow-none`}
        >
          <Sidebar />
        </div>

        {/* Overlay (mobile only) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 bg-[#f0f5fa] px-4 sm:px-10 py-6 sm:py-8 overflow-x-auto">
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
                Staff Management
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
          <div className="flex justify-end items-end mb-6 sm:mb-8 gap-3">
            <button
              onClick={openAddStaff}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--primary-color)] text-white text-sm sm:text-base font-semibold rounded-xl md:rounded-3xl shadow-sm hover:opacity-90"
            >
              <span className="text-lg sm:text-xl">＋</span> Add Staff
            </button>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto border rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-[var(--border-color)] text-[10px] sm:text-sm md:text-base">
              <thead className="bg-[var(--primary-light-color)] text-[var(--text-secondary-color)]">
                <tr>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Name</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Dept</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Role</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Contact</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Status</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      <div className="flex justify-center items-center gap-2 text-[var(--text-secondary-color)]">
                        <svg
                          className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-[var(--primary-color)]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Loading staff...
                      </div>
                    </td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No staff found
                    </td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-[var(--text-primary-color)]">
                        {s.name}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3">
                        {s.department}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3">{s.role}</td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3">
                        {s.contact}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${s.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                        <div className="flex justify-center gap-2 sm:gap-3 text-sm">
                          <button
                            className="text-[var(--primary-color)] hover:underline"
                            onClick={() => openEditStaff(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDeleteStaff(s.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-gray-600 hover:underline"
                            onClick={() => openAttendance(s)}
                          >
                            Attendance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modals */}
      <StaffModal
        open={modalOpen}
        staff={modalStaff}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveStaff}
        mode={modalMode}
      />
      <AttendanceModal
        open={attendanceOpen}
        staff={attendanceStaff}
        onClose={() => setAttendanceOpen(false)}
      />
    </div>
  );
}
