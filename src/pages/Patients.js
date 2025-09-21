import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const LOGO = "/images/45x41inche.....1print...Doted vinyle (1) - Copy.jpg";

const PatientTestManager = () => {
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [showAddTests, setShowAddTests] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [newTestsDiscount, setNewTestsDiscount] = useState(0);
  const [allPatients, setAllPatients] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBalance, setIsBalance] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [currentPaymentDate, setCurrentPaymentDate] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  // Fetch patient info by ID
  const handlePatientSelect = async (patient) => {
    setPatient(patient);
    setSearchName(patient.name);
    setFilteredPatients([]);
    setHasSelected(true);
    setLoading(true);
    try {
      const resp = await fetch(
        `http://localhost:5000/patients/${patient.patientId || patient.id}`
      );
      const data = await resp.json();
      if (resp.ok && data.patient) {
        setPatient(data.patient);
        const dates = (data.patient.tests || [])
          .map((g) => g.requestedDate || g.requestDate)
          .filter(Boolean)
          .sort((a, b) => new Date(b) - new Date(a));
        setSelectedDate(dates[0] || null);
        setSelectedTests([]);
        setShowAddTests(false);
      } else {
        alert("Failed to load patient details");
        setPatient(null);
      }
    } catch {
      alert("Error fetching patient details");
      setPatient(null);
    }
    setLoading(false);
  };

  // Calendar: Get all unique test-requested dates for the patient
  const patientTestDates = React.useMemo(() => {
    if (!patient || !patient.tests) return [];
    return patient.tests.map((group) => group.requestDate).filter(Boolean);
  }, [patient]);

  // When a calendar date is selected, filter tests of that date
  const testGroupOnSelectedDate = React.useMemo(() => {
    if (!selectedDate || !patient || !patient.tests) return null;
    return (
      patient.tests.find((group) => group.requestDate === selectedDate) || null
    );
  }, [patient, selectedDate]);

  const testsOnSelectedDate = testGroupOnSelectedDate?.testItems || [];
  const discountOnSelectedDate = testGroupOnSelectedDate?.discount || 0;
  const totalBillOnSelectedDate =
    testGroupOnSelectedDate?.testItems.reduce(
      (total, test) => total + test.price,
      0
    ) - discountOnSelectedDate;

  // Handle test toggle in add test table
  const handleTestToggle = (test) => {
    const testId = test.id || test._id || test.testId;
    setSelectedTests((prev) =>
      prev.find((t) => (t.id || t._id || t.testId) === testId)
        ? prev.filter((t) => (t.id || t._id || t.testId) !== testId)
        : [...prev, test]
    );
  };

  const openPaymentModal = (requestDate, balance, isBalance) => {
    setCurrentPaymentDate(requestDate);
    setPaymentAmount(balance || 0);
    setPaymentMode("Cash");
    setIsBalance(isBalance);
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    setShowPaymentModal(false);
    try {
      const payload = {
        requestDate: currentPaymentDate,
        payment: {
          amount: Number(paymentAmount),
          mode: paymentMode,
        },
        tests: [], // no new tests here, just payment
      };
      const resp = await fetch(
        `http://localhost:5000/patients/${patient.patientId}/add-tests`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        alert("Payment recorded successfully");
        setPatient(data.patient);
        setCurrentPaymentDate(null);
        setPaymentAmount(0);
      } else {
        alert(data.error || "Failed to record payment");
      }
    } catch {
      alert("Error submitting payment");
    }
  };

  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Show add test selection table and load available tests excluding already requested
  const handleAddTestClick = async () => {
    setShowAddTests(true);
    try {
      const resp = await fetch("http://localhost:5000/tests");
      const data = await resp.json();
      if (resp.ok) {
        const requestedIds = (patient?.tests || []).map(
          (t) => t.id || t._id || t.testId
        );
        const filteredTests = (data.tests || []).filter(
          (test) => !requestedIds.includes(test.id || test._id || test.testId)
        );
        setAvailableTests(filteredTests);
      } else {
        alert("Failed to fetch tests list");
      }
    } catch (e) {
      alert("Error fetching tests");
    }
  };

  const handleConfirm = () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test");
      return;
    }
    setShowDiscountModal(true); // show modal to enter discount
  };

  const handleSubmitWithDiscount = async () => {
    setShowDiscountModal(false);
    try {
      const payload = {
        payment: {
          amount: Number(paymentAmount),
          mode: paymentMode,
        },
        tests: selectedTests,
        discount: newTestsDiscount,
      };
      const resp = await fetch(
        `http://localhost:5000/patients/${patient.patientId}/add-tests`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        alert("Tests added successfully");
        setSelectedTests([]);
        setNewTestsDiscount(0);
        setShowDiscountModal(false);
        setPatient(data.patient);
        setShowAddTests(false);
      } else {
        alert(data.error || "Failed to add tests");
      }
    } catch (error) {
      alert("Server error while adding tests");
    }
  };

  useEffect(() => {
    async function fetchAllPatients() {
      try {
        const resp = await fetch("http://localhost:5000/patients");
        const data = await resp.json();
        setAllPatients(data.patients || []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      }
    }
    fetchAllPatients();
  }, []);

  useEffect(() => {
    const filtered = allPatients.filter((p) =>
      p.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchName, allPatients]);

  useEffect(() => {
    async function rehydrate() {
      try {
        if (location.state?.newlyAddedTest) {
          const newTestId = location.state.newlyAddedTest;
          const res = await fetch(`http://localhost:5000/tests/${newTestId}`);
          const testData = await res.json();

          setAvailableTests((prev) => {
            if (
              prev.some((t) => (t.id || t._id || t.testId) === newTestId)
            ) {
              return prev;
            }
            return [...prev, testData];
          });

          setSelectedTests((prevSelected) => {
            const alreadySelected = prevSelected.some(
              (t) => (t.id || t._id || t.testId) === newTestId
            );
            return alreadySelected ? prevSelected : [...prevSelected, testData];
          });

          setShowAddTests(true);
        } else if (location.state?.selectedTests) {
          setSelectedTests(location.state.selectedTests);
        }

        if (location.state?.patientId) {
          setPatientId(location.state.patientId);

          const resp = await fetch(
            `http://localhost:5000/patients/${location.state.patientId}`
          );
          const data = await resp.json();
          if (data.patient) {
            setPatient(data.patient);
          } else {
            setPatient(null);
            alert("Could not find patient on rehydration");
          }
        }
      } catch (error) {
        setPatient(null);
        alert("Error during rehydration");
      }
    }

    rehydrate();
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    if (patient && patient.tests && patient.tests.length) {
      const dates = patient.tests
        .map((t) => t.requestedAt && t.requestedAt.split("T")[0])
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } else {
      setSelectedDate(null);
    }
  }, [patient]);

  const getOrCreateInvoiceNumber = async () => {
    if (!patient || !selectedDate) {
      alert("No selected patient or date");
      return null;
    }

    try {
      const resp = await fetch(
        `http://localhost:5000/patients/${patient.patientId}/invoice-number`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestDate: selectedDate }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error || "Failed to get invoice number");
        return null;
      }
      return data.invoiceNo;
    } catch (error) {
      alert("Error fetching invoice number");
      return null;
    }
  };

  const generateInvoicePDF = (date, tests, invoiceNo) => {
    if (!patient || !date || !tests.length) {
      alert("No test data for this date");
      return;
    }
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    if (LOGO) {
      doc.addImage(LOGO, "PNG", 12, 6, 22, 22);
    }

    doc.setFont("helvetica");
    doc.setFontSize(15);
    doc.text("PHANI S DOCTOR LABORATORIES AND DIAGNOSTICS", 52, 14);
    doc.setFontSize(9);
    doc.text("TRUST & QUALITY", 105, 20);
    doc.setFontSize(8);
    doc.text(
      "BAIGS MANZIL, TADIGADAPA, DONKA ROAD, YANAMALAKUDURU",
      75,
      24
    );
    doc.text(
      "Contact: 9848833770 / 8074186770  |  doctorlab8181@gmail.com",
      77.5,
      28
    );

    let y = 34;
    doc.line(12, y, 200, y);
    y += 4;

    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceNo || "-"}`, 12, y);
    y += 7;
    doc.text(`Patient Name: ${patient.name || "-"}`, 12, y);
    doc.text(`Patient ID: ${patient.patientId || "-"}`, 140, y);
    y += 7;
    doc.text(`Age/Sex: ${patient.age || "-"}/${patient.gender || "-"}`, 12, y);
    doc.text(`Reg. Date: ${patient.date}  ${patient.time}`, 140, y);
    y += 7;
    doc.text(`Contact: ${patient.contact || "-"}`, 12, y);
    doc.text(`Address: ${patient.address || "-"}`, 140, y);
    y += 7;
    doc.text(`Ref By: ${patient.doctor || "-"}`, 12, y);

    y += 8;
    doc.setFontSize(9.5);
    doc.setFillColor(230, 230, 230);
    doc.rect(12, y - 5, 186, 8, "F");
    doc.setDrawColor(180);
    doc.setLineWidth(0.08);

    doc.text("SL", 16, y);
    doc.text("REPORT DATE", 25, y);
    doc.text("TEST DESCRIPTION", 65, y);
    doc.text("CHARGES", 140, y, { maxWidth: 25 });
    doc.text("AMOUNT", 170, y, { maxWidth: 20 });

    y += 5;
    let total = 0;
    tests.forEach((test, idx) => {
      doc.setDrawColor(220);
      doc.line(12, y, 198, y);
      const price = typeof test.price === "number" ? test.price : Number(test.price) || 0;
      const descriptionLines = doc.splitTextToSize(test.testName || "-", 60);

      doc.text(String(idx + 1), 16, y + 6);
      doc.text(date, 25, y + 6);
      doc.text(descriptionLines, 65, y + 6);
      doc.text(`Rs. ${price.toFixed(2)}`, 140, y + 6, { maxWidth: 25 });
      doc.text(`Rs. ${price.toFixed(2)}`, 170, y + 6, { maxWidth: 20 });

      y += 8 * descriptionLines.length;
      total += price;
    });

    y += 2;
    doc.line(12, y, 198, y);
    y += 6;
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, y);
    doc.text(`Rs. ${total.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Discount:", 140, y);
    doc.text(`Rs. ${discountOnSelectedDate || "0.00"}`, 170, y);
    y += 6;
    const grandTotal = total - (Number(discountOnSelectedDate) || 0);
    doc.text("TOTAL:", 140, y);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Paid Amount:", 140, y);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Balance due:", 140, y);
    doc.text("Rs. 0.00", 170, y);

    y += 15;
    doc.setFontSize(10);
    doc.text("Signature", 180, y + 7);
    y += 6;
    doc.setFontSize(9);
    doc.text("TARUN", 180, y + 7);
    y += 20;

    doc.setFontSize(9);
    doc.text("THANK YOU, VISIT AGAIN", 95, y, { align: "center" });

    doc.save(`${patient.name || "invoice"}_${date}.pdf`);
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 h-40 rounded-lg w-full"></div>
  );

  return (
    <div
      className="flex h-screen flex-col bg-gray-100 text-[var(--text-primary)]"
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
        <div
          className={`md:relative fixed md:h-full h-screen inset-y-0 left-0 z-30 w-64 bg-white border-r border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
                Patient Management
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
          <div className="mx-auto rounded-lg bg-[var(--surface-color)] p-4 sm:p-6 shadow-lg text-left">
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold">Find Patient by Name</h2>
            <div className="mb-6 flex gap-4 relative">
              <input
                type="text"
                className="rounded-md border border-gray-300 px-3 py-2 w-full"
                placeholder="Search patient by name"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setPatient(null);
                  setHasSelected(false);
                }}
              />
              {filteredPatients.length > 0 && searchName && !hasSelected && (
                <ul className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white shadow-md border">
                  {filteredPatients.map((patient) => (
                    <li
                      key={patient.patientId || patient.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      {patient.name} (ID: {patient.patientId || patient.id})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkeletonCard />
                <SkeletonCard />
              </div>}

            {patient && !loading && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-2">Patient Details</h3>
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div><span className="font-semibold">Name: </span> {patient.name}</div>
                    <div><span className="font-semibold">Patient ID: </span> {patient.patientId || patient.id}</div>
                    <div><span className="font-semibold">Age/Gender: </span> {patient.age} / {patient.gender}</div>
                    <div><span className="font-semibold">Contact: </span> {patient.contact}</div>
                    <div><span className="font-semibold">Address: </span> {patient.address}</div>
                    <div><span className="font-semibold">Reg. Date/Time: </span> {patient.date} {patient.time}</div>
                    <div><span className="font-semibold">Doctor: </span> {patient.doctor}</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-2">Test Dates Calendar</h3>
                  <div className="max-w-full overflow-x-auto">
                    <Calendar
                      tileDisabled={({ date }) =>
                        !patientTestDates.includes(formatDateLocal(date))
                      }
                      tileClassName={({ date }) =>
                        patientTestDates.includes(formatDateLocal(date))
                          ? "bg-green-300 rounded-full"
                          : ""
                      }
                      onClickDay={(date) => setSelectedDate(formatDateLocal(date))}
                      value={selectedDate ? new Date(selectedDate) : null}
                      className="react-calendar"
                    />
                  </div>
                  {selectedDate && (
                    <div className="mt-2 text-sm flex items-center gap-3">
                      <b>Selected Date:</b>
                      <span className="text-blue-700">{selectedDate}</span>
                    </div>
                  )}
                </div>

                {selectedDate && (
                  <>
                    <div className="mb-6 bg-white p-4 rounded shadow border">
                      <h2 className="text-lg font-semibold mb-3">
                        Tests on {selectedDate}
                      </h2>
                      <div className="space-y-1 text-sm sm:text-base">
                        <p>
                          <b>Total Bill: ₹{totalBillOnSelectedDate + (testGroupOnSelectedDate?.discount || 0)}</b>
                        </p>
                        <p>
                          <b>Discount: ₹{testGroupOnSelectedDate?.discount || 0}</b>
                        </p>
                        <p>
                          <b>Final Bill: ₹{totalBillOnSelectedDate}</b>
                        </p>
                        <p>
                          <b>Payments:</b>
                          {testGroupOnSelectedDate?.paymentInfo?.payments?.length ? (
                            <ul className="ml-4 list-disc mt-1">
                              {testGroupOnSelectedDate.paymentInfo.payments.map(
                                (p, i) => (
                                  <li key={i} className="text-sm">
                                    ₹{p.amount} via {p.mode} on{" "}
                                    {new Date(p.date).toLocaleString()}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            " No payments yet"
                          )}
                        </p>
                        <p>
                          <b>Amount Paid:</b>{" "}
                          ₹{testGroupOnSelectedDate?.paymentInfo?.totalPaid || 0}
                        </p>
                        <p>
                          <b>Balance:</b>{" "}
                          ₹{testGroupOnSelectedDate?.paymentInfo?.balance || 0}
                        </p>
                        <p>
                          <b>Status:</b>{" "}
                          <span className={`font-medium ${testGroupOnSelectedDate?.paymentInfo?.cleared ? 'text-green-600' : 'text-red-600'}`}>
                            {testGroupOnSelectedDate?.paymentInfo?.cleared ? "Cleared" : "Due"}
                          </span>
                        </p>
                      </div>
                      {!testGroupOnSelectedDate?.paymentInfo?.cleared && (
                        <button
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          onClick={() =>
                            openPaymentModal(
                              selectedDate,
                              testGroupOnSelectedDate?.paymentInfo?.balance,
                              true
                            )
                          }
                        >
                          Pay Balance
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {selectedDate
                      ? `Requested Tests on ${selectedDate}`
                      : "Requested Tests"}
                  </h3>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full rounded border border-[var(--border-color)] min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 text-left">Test Name</th>
                          <th className="px-3 sm:px-4 py-2 text-left">Description</th>
                          <th className="px-3 sm:px-4 py-2 text-left">Price</th>
                          <th className="px-3 sm:px-4 py-2 text-left">Requested At</th>
                          <th className="px-3 sm:px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testsOnSelectedDate && testsOnSelectedDate.length > 0 ? (
                          testsOnSelectedDate.map((test, idx) => (
                            <tr
                              key={idx}
                              className="cursor-pointer hover:bg-gray-100 border-t"
                              onClick={() =>
                                navigate(
                                  `/test-result/${patient.id || patient._id || patient.patientId}/${test.id || test._id || test.testId}`,
                                  {
                                    state: {
                                      patientId: patient.id || patient.patientId,
                                      patient,
                                      testGroupOnSelectedDate,
                                    },
                                  }
                                )
                              }
                            >
                              <td className="px-3 sm:px-4 py-2">{test.testName}</td>
                              <td className="px-3 sm:px-4 py-2">{test.description || "--"}</td>
                              <td className="px-3 sm:px-4 py-2">₹{test.price}</td>
                              <td className="px-3 sm:px-4 py-2">{selectedDate}</td>
                              <td className="px-3 sm:px-4 py-2">
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  test.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  test.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {test.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                              {selectedDate
                                ? "No tests were requested for this date"
                                : "No tests requested"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col justify-between sm:flex-row gap-3 sm:gap-4">
                    <button
                      className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
                      disabled={!selectedDate || testsOnSelectedDate.length === 0}
                      onClick={async () => {
                        if (!testGroupOnSelectedDate?.paymentInfo?.cleared) {
                          alert("Cannot generate invoice: Balance is NOT cleared for this test date!");
                          return;
                        }
                        const invoiceNo = await getOrCreateInvoiceNumber();
                        if (!invoiceNo) return;

                        generateInvoicePDF(selectedDate, testsOnSelectedDate, invoiceNo);
                      }}
                    >
                      {/* Invoice Icon */}
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-12 group-disabled:rotate-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Generate Invoice for {selectedDate}</span>

                      {/* Shimmer effect overlay */}
                      <div className="absolute inset-0 -top-px rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />
                    </button>

                    <button
                      className="group relative inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-md hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
                      onClick={handleAddTestClick}
                    >
                      {/* Plus Icon */}
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Add Test</span>

                      {/* Hover background effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {showAddTests && (
              <div className="mt-10">
                <h3 className="mb-4 text-xl font-bold">Select Tests To Add</h3>
                <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
                  <table className="w-full divide-y divide-[var(--border-color)] min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left">Test Name</th>
                        <th className="px-3 sm:px-4 py-2 text-left">Description</th>
                        <th className="px-3 sm:px-4 py-2 text-left">Price</th>
                        <th className="px-3 sm:px-4 py-2 text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableTests.length > 0 ? (
                        availableTests.map((test, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-3 sm:px-4 py-2">{test.testName}</td>
                            <td className="px-3 sm:px-4 py-2">{test.description || "--"}</td>
                            <td className="px-3 sm:px-4 py-2">₹{test.price}</td>
                            <td className="px-3 sm:px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedTests.some(
                                  (t) =>
                                    (t.id || t._id || t.testId) ===
                                    (test.id || test._id || test.testId)
                                )}
                                onChange={() => handleTestToggle(test)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-gray-500">
                            No more tests available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                  <button
                    onClick={() => setShowAddTests(false)}
                    className="order-3 sm:order-1 rounded-md border border-gray-300 px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      navigate("/add-test", {
                        state: {
                          fromPatientTestManager: true,
                          patientId,
                          selectedTests,
                        },
                      })
                    }
                    className="order-2 rounded-md border border-[var(--border-color)] px-4 py-2 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Add New Test
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="order-1 sm:order-3 rounded-md bg-[var(--primary-color)] px-6 py-2 text-white font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedTests.length === 0}
                  >
                    Confirm Add ({selectedTests.length})
                  </button>
                </div>
              </div>
            )}

            {showPaymentModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-full overflow-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Record Payment for {currentPaymentDate}
                  </h3>
                  <p className="mb-4 text-gray-700">Total Due: ₹{paymentAmount}</p>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Amount:</label>
                    <input
                      type="number"
                      min={0}
                      max={paymentAmount}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Payment Mode:</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={paymentAmount <= 0}
                      onClick={async () => {
                        if (isBalance) {
                          submitPayment();
                        } else {
                          if (paymentAmount > 0) {
                            handleSubmitWithDiscount();
                          }
                          setShowPaymentModal(false);
                        }
                      }}
                    >
                      Submit Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDiscountModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                  <h2 className="text-lg font-semibold mb-4">
                    Enter Discount for these tests
                  </h2>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Discount Amount (₹):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedTests.reduce(
                        (sum, t) => sum + Number(t.price),
                        0
                      )}
                      value={newTestsDiscount}
                      onChange={(e) => setNewTestsDiscount(Number(e.target.value))}
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter discount amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: ₹{selectedTests.reduce((sum, t) => sum + Number(t.price), 0)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDiscountModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowDiscountModal(false);
                        setShowPaymentModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={newTestsDiscount < 0}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default PatientTestManager;

