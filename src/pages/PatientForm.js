import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const getCurrentTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const defaultFormData = {
  name: "",
  age: "",
  gender: "",
  address: "",
  contact: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
  doctor: "",
  discount: 0,
};

const PatientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from location.state if present (rehydration)
  const [formData, setFormData] = useState(location.state?.formData || defaultFormData);
  const [selectedTests, setSelectedTests] = useState(location.state?.selectedTests || []);
  const [doctorOptions, setDoctorOptions] = useState([]); // [{id, name}]
  const [doctorSearchInput, setDoctorSearchInput] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [tests, setTests] = useState([]);
  const [total, setTotal] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false); // To prevent double submits
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMode, setPaymentMode] = useState("UPI");

  useEffect(() => {
    fetch("http://localhost:5000/doctors")
      .then(res => res.json())
      .then(data => setDoctorOptions(data.doctors || []));
  }, []);

  // Fetch available tests from backend
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("http://localhost:5000/tests");
        const data = await res.json();
        if (res.ok) {
          setTests(data.tests || []);
        } else {
          alert("Failed to load tests");
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  // Rehydrate state if coming back from Add Test
  useEffect(() => {
    if (location.state?.newlyAddedTest) {
      const newTestId = location.state.newlyAddedTest;

      // Try to find in tests list first
      const found = tests.find((t) => getTestId(t) === newTestId);

      if (found) {
        // Ensure it’s selected only once
        setSelectedTests((prev) =>
          prev.some((t) => getTestId(t) === newTestId) ? prev : [...prev, found]
        );
      } else {
        // If not already in tests, fetch it
        fetch(`http://localhost:5000/tests/${newTestId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              setTests((prev) => {
                const exists = prev.some((t) => getTestId(t) === newTestId);
                return exists ? prev : [...prev, data];
              });

              setSelectedTests((prev) =>
                prev.some((t) => getTestId(t) === newTestId) ? prev : [...prev, data]
              );
            }
          })
          .catch((err) => console.error("Error fetching new test:", err));
      }
    }

    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.selectedTests) {
      setSelectedTests(location.state.selectedTests);
    }
  }, [location.state, tests]);

  // Recalculate total whenever tests or discount changes
  useEffect(() => {
    const totalPrice = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);
    const discountValue = Number(formData.discount) || 0;
    setTotal(totalPrice - discountValue);
  }, [selectedTests, formData.discount]);

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onDoctorInputChange = (val) => {
    setDoctorSearchInput(val);
    setSelectedDoctor(val);
  };

  const handleDoctorBlurOrSelect = async () => {
    if (
      doctorOptions.some(d => d.name.trim().toLowerCase() === doctorSearchInput.trim().toLowerCase())
    ) {
      setSelectedDoctor(doctorSearchInput); // Picked existing
    } else if (doctorSearchInput.trim() !== "") {
      // Add new doctor to DB
      const resp = await fetch("http://localhost:5000/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: doctorSearchInput }),
      });
      if (resp.ok) {
        const newDoc = await resp.json();
        setDoctorOptions([...doctorOptions, { id: newDoc.doctor.id, name: newDoc.doctor.name }]);
        setSelectedDoctor(doctorSearchInput);
      }
    }
    handleChange("doctor", doctorSearchInput);
  };

  // Handle test selection toggle
  const getTestId = (test) => test.id || test._id || test.testId;

  const handleTestToggle = (test) => {
    const testId = getTestId(test);
    setSelectedTests((prev) => {
      if (prev.find((t) => getTestId(t) === testId)) {
        return prev.filter((t) => getTestId(t) !== testId);
      } else {
        return [...prev, test];
      }
    });
  };

  // Add Test button navigation (send current state)
  const handleAddTestClick = () => {
    navigate("/add-test", {
      state: {
        formData,
        selectedTests,
        fromPatientForm: true,
      },
    });
  };

  // Submit patient form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      alert("Please select at least one test");
      return;
    }
    setShowDiscountModal(true);
  };

  const submitPatientData = async () => {
    setShowPaymentModal(false);
    const payload = {
      ...formData,
      tests: selectedTests,
      discount: Number(formData.discount),
      payment: {
        amountPaid: Number(amountPaid),
        paymentMode, // 'UPI' or 'Cash'
        balanceCleared: Number(amountPaid) >= total, // boolean
        balanceAmount: Number(total) - Number(amountPaid)
      }
    };
    try {
      const res = await fetch("http://localhost:5000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Patient added successfully!");
        navigate("/patients");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Something went wrong while saving patient.");
    }
  };

  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTimeLocal(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    console.log(`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
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
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <svg
            className="h-8 w-8 text-[var(--brand-color)]"
            fill="none"
            viewBox="0 0 48 48"
          >
            <g clipPath="url(#clip0_6_543)">
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              ></path>
              <path
                clipRule="evenodd"
                d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_543">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
          <h1 className="text-xl font-bold">Pathology Services</h1>
        </div>
      </header>

      <div className="relative flex flex-col min-h-screen md:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
            <h2 className="mb-6 text-3xl font-bold tracking-tight">
              Patient Information and Test Selection
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="age">
                    Age
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="age"
                    placeholder="Enter patient's age"
                    required
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="gender"
                    required
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="address">
                    Address
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter patient's address"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="contact">
                    Contact Number
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="contact"
                    placeholder="Enter patient's contact number"
                    required
                    value={formData.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    type="tel"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-primary)]" htmlFor="doctor">
                    Referred Doctor
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    id="doctor"
                    placeholder="Select or enter referring doctor's name"
                    value={doctorSearchInput}
                    onChange={e => onDoctorInputChange(e.target.value)}
                    list="doctor-list"
                    onBlur={handleDoctorBlurOrSelect}
                    required
                    type="text"
                  />
                  <datalist id="doctor-list">
                    {doctorOptions.map(doc => (
                      <option key={doc.id} value={doc.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-xl font-bold">Select Tests</h3>
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
                          Select
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] bg-[var(--surface-color)]">
                      {tests.length > 0 ? (
                        tests.map((test, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-normal break-words max-w-xs">
                              {test.testName}
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-normal break-words max-w-sm">
                              {test.description || "--"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                              {test.price ? `₹${test.price}` : "--"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                                checked={selectedTests.some((t) => getTestId(t) === getTestId(test))}
                                onChange={() => handleTestToggle(test)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-sm text-center text-[var(--text-secondary)]">
                            No tests available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddTestClick}
                    className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--border-color)]"
                  >
                    <span className="material-icons text-base">Add Test</span>
                  </button>
                </div>
              </div>
              <div className="mt-8 flex justify-end items-center gap-6 border-t border-[var(--border-color)] pt-6">
                <p className="text-lg font-bold">Total Bill: ₹{total}</p>
                <button
                  className="rounded-md bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
        {showDiscountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-80 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">Enter Discount</h2>
              <input
                type="number"
                min="0"
                max={selectedTests.reduce((sum, t) => sum + Number(t.price), 0)}
                value={formData.discount}
                onChange={e => handleChange("discount", e.target.value)}
                required
                className="w-full mb-4 rounded border p-2"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDiscountModal(false);
                    setShowPaymentModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-80 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">Payment Details</h2>
              <label className="block mb-2 font-medium">Amount Paid</label>
              <input
                type="number"
                min="0"
                max={total}
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full mb-4 rounded border p-2"
              />
              <label className="block mb-2 font-medium">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full mb-4 rounded border p-2"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPatientData}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  disabled={Number(amountPaid) > Number(total) || amountPaid === ""}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientForm;
