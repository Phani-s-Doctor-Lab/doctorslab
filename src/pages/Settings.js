// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";

// function SettingsPage() {
//   // Profile state
//   const [profile, setProfile] = useState({ email: "", username: "", name: "" });
//   const [profileEdit, setProfileEdit] = useState({ email: "", username: "", name: "" });
//   const [profileMessage, setProfileMessage] = useState("");
//   const [profileError, setProfileError] = useState("");

//   // Password modal state
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [passwordForm, setPasswordForm] = useState({ prev: "", new: "", confirm: "" });
//   const [passwordError, setPasswordError] = useState("");
//   const [passwordSuccess, setPasswordSuccess] = useState("");

//   // Signatures state
//   const [signatures, setSignatures] = useState([]);
//   const [newSignature, setNewSignature] = useState("");
//   const [signatureMessage, setSignatureMessage] = useState("");

//   // Show/hide password for each input
//   const [showPassword, setShowPassword] = useState({
//     prev: false,
//     new: false,
//     confirm: false,
//   });

//   // Fetch profile on mount
//   useEffect(() => {
//     async function fetchProfile() {
//       // Example: you may have a /users/:email route, adjust as needed
//       const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
//       const resp = await fetch(`http://localhost:5000/users/${encodeURIComponent(userEmail)}`);
//       if (!resp.ok) return;
//       const data = await resp.json();
//       setProfile({ email: data.email, name: data.name, username: data.username });
//       setProfileEdit({ email: data.email, name: data.name, username: data.username });
//     }
//     async function fetchSignatures() {
//       const res = await fetch("http://localhost:5000/signatures");
//       const data = await res.json();
//       setSignatures(data.signatures || []);
//     }
//     fetchProfile();
//     fetchSignatures();
//   }, []);

//   // Clear profile messages after 3 seconds
//   useEffect(() => {
//     if (profileMessage || profileError) {
//       const timer = setTimeout(() => {
//         setProfileMessage("");
//         setProfileError("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [profileMessage, profileError]);

//   // Clear signature messages after 3 seconds
//   useEffect(() => {
//     if (signatureMessage) {
//       const timer = setTimeout(() => setSignatureMessage(""), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [signatureMessage]);

//   // Clear password messages after 3 seconds
//   useEffect(() => {
//     if (passwordError || passwordSuccess) {
//       const timer = setTimeout(() => {
//         setPasswordError("");
//         setPasswordSuccess("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [passwordError, passwordSuccess]);

//   // Toggle show/hide password input field
//   const toggleShowPassword = (field) => {
//     setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   function EyeIcon({ open }) {
//     return open ? (
//         // Eye open icon SVG
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         </svg>
//     ) : (
//         // Eye closed icon SVG
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.303-3.607M6.823 6.824A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.056 10.056 0 01-3.349 4.224M3 3l18 18" />
//         </svg>
//     )
//   }

//   // Profile update handlers
//   const handleProfileChange = (e) => {
//     setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setProfileMessage(""); setProfileError("");
//     // Allow update username or name or email
//     try {
//       const res = await fetch("http://localhost:5000/update-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...profileEdit, email: profile.email }) // send current email for lookup
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Profile update failed");
//       setProfileMessage("Profile updated!");
//       setProfile(profileEdit);
//     } catch (err) {
//       setProfileError(err.message);
//     }
//   };

//   // Password modal handlers
//   const openPasswordModal = () => {
//     setShowPasswordModal(true);
//     setPasswordForm({ prev: "", new: "", confirm: "" });
//     setPasswordError(""); setPasswordSuccess("");
//   };
//   const closePasswordModal = () => setShowPasswordModal(false);
//   const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setPasswordError(""); setPasswordSuccess("");
//     if (!passwordForm.prev || !passwordForm.new || !passwordForm.confirm) return setPasswordError("All fields required.");
//     if (passwordForm.new !== passwordForm.confirm) return setPasswordError("Passwords do not match.");
//     try {
//       const resp = await fetch("http://localhost:5000/update-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ previousPassword: passwordForm.prev, newPassword: passwordForm.new, email: profile.email }),
//       });
//       const data = await resp.json();
//       if (!resp.ok) throw new Error(data.error || "Update failed");
//       setPasswordSuccess("Password updated!");
//       setTimeout(closePasswordModal, 1200);
//     } catch (err) { setPasswordError(err.message); }
//   };

//   // Signature CRUD handlers
//   const handleAddSignature = async (e) => {
//     e.preventDefault();
//     if (!newSignature.trim()) return;
//     setSignatureMessage("");
//     const resp = await fetch("http://localhost:5000/signatures", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: newSignature })
//     });
//     const data = await resp.json();
//     if (!resp.ok) return setSignatureMessage(data.error || "Add failed");
//     setSignatures(s => [...s, data.signature]);
//     setSignatureMessage("Signature added!");
//     setNewSignature("");
//   };
//   const handleDeleteSignature = async (id) => {
//     await fetch(`http://localhost:5000/signatures/${id}`, { method: "DELETE" });
//     setSignatures(sigs => sigs.filter(s => s.id !== id));
//   };

//   return (
//     <div className="flex min-h-screen bg-white flex-col">
//       <div className="layout-container flex h-full grow flex-col">
//         <header className="sticky top-0 bg-white shadow z-10 flex items-center justify-between p-4 border-b border-gray-300">
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             Pathology Stock Control
//           </h1>
//         </header>
//         <div className="flex flex-grow overflow-hidden">
//           <Sidebar />
//           <main className="flex-1 bg-[#f0f5fa] px-4 py-8 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-7xl space-y-8">
//               {/* Profile */}
//               <section>
//                 <h2 className="mb-4 text-xl font-bold text-[#1e293b]">User Profile</h2>
//                 <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-[#64748b]" htmlFor="username">Username</label>
//                       <input name="username" id="username" type="text" className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2" value={profileEdit.username} onChange={handleProfileChange} />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#64748b]" htmlFor="email">Email</label>
//                       <input name="email" id="email" type="email" className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2" value={profileEdit.email} onChange={handleProfileChange} />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#64748b]" htmlFor="name">Name</label>
//                       <p className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2">{profile.name}</p>
//                     </div>
//                     <div className="flex justify-end gap-2">
//                       <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">Save Changes</button>
//                     </div>
//                     {profileMessage && <p className="text-green-600">{profileMessage}</p>}
//                     {profileError && <p className="text-red-600">{profileError}</p>}
//                   </div>
//                   <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-6">
//                     <h4 className="text-lg font-semibold text-[#1e293b] mb-4">Password</h4>
//                     <button type="button" onClick={openPasswordModal} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">
//                       Update Password
//                     </button>
//                   </div>
//                 </form>
//               </section>
//               {/* Signatures */}
//               <section>
//                 <h2 className="mb-4 text-xl font-bold text-[#1e293b]">Lab Signatures</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
//                     <h4 className="font-semibold text-[#1e293b] mb-4">Existing Signatures</h4>
//                     <ul className="space-y-3">
//                       {signatures.map(sig => (
//                         <li key={sig.id} className="flex items-center justify-between p-3 rounded-md bg-[#f0f5fa] border border-[#e2e8f0]">
//                           <span className="text-sm font-medium text-[#64748b]">{sig.name}</span>
//                           <button className="text-[#94a3b8] hover:text-red-500" onClick={() => handleDeleteSignature(sig.id)}>
//                             <span className="material-symbols-outlined text-md">delete</span>
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
//                     <h4 className="font-semibold text-[#1e293b] mb-4">Add New Signature</h4>
//                     <form onSubmit={handleAddSignature} className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-[#64748b]" htmlFor="signature-name">Signature Name</label>
//                         <input
//                           className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
//                           id="signature-name"
//                           type="text"
//                           value={newSignature}
//                           onChange={e => setNewSignature(e.target.value)}
//                           placeholder="e.g. Dr. Jennifer Miller"
//                         />
//                       </div>
//                       <div className="flex justify-end mt-6">
//                         <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-800">
//                           Add Signature
//                         </button>
//                       </div>
//                     </form>
//                     {signatureMessage && <p className="mt-2 text-green-700">{signatureMessage}</p>}
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* Password Modal */}
//             {showPasswordModal && (
//                 <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//                     <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
//                         <button className="absolute top-2 right-2 text-gray-400 hover:text-teal-700" onClick={closePasswordModal} aria-label="Close">
//                         &times;
//                         </button>
//                         <h3 className="text-lg font-semibold mb-4">Update Password</h3>
//                         <form onSubmit={handlePasswordSubmit} className="space-y-4">

//                         {["prev", "new", "confirm"].map((field) => (
//                             <div key={field} className="relative">
//                                 <label className="block text-sm font-medium text-[#64748b]" htmlFor={field}>
//                                     {field === "prev" ? "Current Password" : field === "new" ? "New Password" : "Confirm New Password"}
//                                 </label>
//                                 <input
//                                     id={field}
//                                     name={field}
//                                     type={showPassword[field] ? "text" : "password"}
//                                     className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 pr-10"
//                                     autoComplete={field === "prev" ? "current-password" : "new-password"}
//                                     value={passwordForm[field]}
//                                     onChange={handlePasswordChange}
//                                     required
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => toggleShowPassword(field)}
//                                     className="absolute right-2 top-1/2 flex items-center text-gray-500"
//                                     aria-label={`Toggle ${field} password visibility`}
//                                 >
//                                 <EyeIcon open={showPassword[field]} />
//                                 </button>
//                             </div>
//                             ))}

//                         {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
//                         {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

//                         <div className="flex justify-end">
//                             <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">
//                             Update Password
//                             </button>
//                         </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SettingsPage;



import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from 'react-toastify';

function SettingsPage() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({ email: "", username: "", name: "" });
  const [profileEdit, setProfileEdit] = useState({ email: "", username: "", name: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ prev: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Signatures state
  const [signatures, setSignatures] = useState([]);
  const [newSignature, setNewSignature] = useState("");
  const [signatureMessage, setSignatureMessage] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Sidebar toggle

  // Password modal
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Signatures
  const [loadingSignatures, setLoadingSignatures] = useState(true);

  // Show/hide password for each input
  const [showPassword, setShowPassword] = useState({
    prev: false,
    new: false,
    confirm: false,
  });


  // new state
  const [loadingAddSignature, setLoadingAddSignature] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch profile + signatures on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
        const resp = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(userEmail)}`);
        if (resp.ok) {
          const data = await resp.json();
          setProfile({ email: data.email, name: data.name, username: data.username });
          setProfileEdit({ email: data.email, name: data.name, username: data.username });
        }
        const res = await fetch(`${BACKEND_URL}/signatures`);
        const sigData = await res.json();
        setSignatures(sigData.signatures || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Clear profile messages after 3 seconds
  useEffect(() => {
    if (profileMessage || profileError) {
      const timer = setTimeout(() => {
        setProfileMessage("");
        setProfileError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profileMessage, profileError]);

  // Clear signature messages after 3 seconds
  useEffect(() => {
    if (signatureMessage) {
      const timer = setTimeout(() => setSignatureMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [signatureMessage]);

  // Clear password messages after 3 seconds
  useEffect(() => {
    if (passwordError || passwordSuccess) {
      const timer = setTimeout(() => {
        setPasswordError("");
        setPasswordSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordError, passwordSuccess]);

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  function EyeIcon({ open }) {
    return open ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.303-3.607M6.823 6.824A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.056 10.056 0 01-3.349 4.224M3 3l18 18" />
      </svg>
    );
  }

  // Profile update handlers
  const handleProfileChange = (e) => {
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    try {
      const res = await fetch(`${BACKEND_URL}/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileEdit, email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed");
      setProfileMessage("Profile updated!");
      setProfile(profileEdit);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  // Password modal handlers
  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordForm({ prev: "", new: "", confirm: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };
  const closePasswordModal = () => setShowPasswordModal(false);
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.prev || !passwordForm.new || !passwordForm.confirm) return setPasswordError("All fields required.");
    if (passwordForm.new !== passwordForm.confirm) return setPasswordError("Passwords do not match.");
    try {
      const resp = await fetch(`${BACKEND_URL}/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousPassword: passwordForm.prev, newPassword: passwordForm.new, email: profile.email }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Update failed");
      setPasswordSuccess("Password updated!");
      setTimeout(closePasswordModal, 1200);
    } catch (err) {
      setPasswordError(err.message);
    }
  };


  useEffect(() => {
    async function fetchData() {
      const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
      const resp = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(userEmail)}`);
      if (resp.ok) {
        const data = await resp.json();
        setProfile({ email: data.email, name: data.name, username: data.username });
        setProfileEdit({ email: data.email, name: data.name, username: data.username });
      }
      setLoadingProfile(false);

      const res = await fetch(`${BACKEND_URL}/signatures`);
      const data2 = await res.json();
      setSignatures(data2.signatures || []);
      setLoadingSignatures(false);
    }
    fetchData();
  }, []);


  // update your add signature handler
  const handleAddSignature = async (e) => {
    e.preventDefault();
    if (!newSignature.trim()) return;

    setLoadingAddSignature(true);
    setSignatureMessage("");
    try {
      const resp = await fetch(`${BACKEND_URL}/signatures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSignature }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setSignatures([...signatures, data.signature]);
        setNewSignature("");
        setSignatureMessage("Signature added!");
      } else {
        setSignatureMessage(data.error || "Failed to add signature.");
      }
    } catch (err) {
      setSignatureMessage("Server error. Try again.");
    } finally {
      setLoadingAddSignature(false);
    }
  };

  const handleDeleteSignature = async (id) => {
    setLoading(true); // optional: show loading on deletion
    try {
      const resp = await fetch(`${BACKEND_URL}/signatures/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Delete failed");

      setSignatures((prev) => prev.filter((sig) => sig.id !== id));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 h-40 rounded-lg w-full"></div>
  );

  return (
    <div className="relative flex min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[var(--border-color)] shadow-lg h-screen flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
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
                Settings
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

        <div className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Profile */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <input name="username" className="w-full border p-2 rounded" value={profileEdit.username} onChange={handleProfileChange} />
                <input name="email" className="w-full border p-2 rounded" value={profileEdit.email} onChange={handleProfileChange} />
                <p className="w-full border p-2 rounded bg-gray-100">{profile.name}</p>
                <div className="flex justify-between items-center">
                  <button type="submit" className="px-4 py-2 bg-[#649ccd] text-white rounded">Save Changes</button>
                  <button type="button" onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-gray-700 text-white rounded">Update Password</button>
                </div>
                {profileMessage && <p className="text-green-600">{profileMessage}</p>}
                {profileError && <p className="text-red-600">{profileError}</p>}
              </form>
            )}
          </section>

          {/* Signatures */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Existing Signatures */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-4">Existing Signatures</h3>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                <ul className="space-y-2">
                  {signatures.map((sig) => (
                    <li
                      key={sig.id}
                      className="flex justify-between bg-gray-100 p-2 rounded"
                    >
                      {sig.name}
                      <button
                        onClick={() => handleDeleteSignature(sig.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add Signature */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-4">Add Signature</h3>
              {loading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                </div>
              ) : (
                <form onSubmit={handleAddSignature} className="space-y-4">
                  <input
                    className="w-full border p-2 rounded"
                    value={newSignature}
                    onChange={(e) => setNewSignature(e.target.value)}
                    disabled={loadingAddSignature}
                  />
                  <button
                    type="submit"
                    disabled={loadingAddSignature}
                    className="px-4 py-2 bg-[#649ccd] text-white rounded flex items-center justify-center"
                  >
                    {loadingAddSignature ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        />
                      </svg>
                    ) : (
                      "Add"
                    )}
                  </button>
                </form>
              )}

              {signatureMessage && (
                <p className="text-green-600 mt-2">{signatureMessage}</p>
              )}
            </div>
          </section>

        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
              <button onClick={() => setShowPasswordModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-black">&times;</button>
              <h3 className="text-lg font-semibold mb-4">Update Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {["prev", "new", "confirm"].map(field => (
                  <div key={field} className="relative">
                    <input type={showPassword[field] ? "text" : "password"} placeholder={field === "prev" ? "Current Password" : field === "new" ? "New Password" : "Confirm Password"} className="w-full border p-2 rounded pr-10" value={passwordForm[field]} onChange={e => setPasswordForm({ ...passwordForm, [field]: e.target.value })} />
                    <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}><EyeIcon open={showPassword[field]} /></button>
                  </div>
                ))}
                {passwordError && <p className="text-red-600">{passwordError}</p>}
                {passwordSuccess && <p className="text-green-600">{passwordSuccess}</p>}
                <button type="submit" disabled={loadingPassword} className="w-full py-2 bg-[#649ccd] text-white rounded">
                  {loadingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>

  );
}

export default SettingsPage;
