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

  // Fetch patient info by ID
  const handlePatientSelect = async (patient) => {
    setPatient(patient)
    setSearchName(patient.name);
    setFilteredPatients([]);
    setHasSelected(true);
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:5000/patients/${patient.patientId || patient.id}`);
      const data = await resp.json();
      if (resp.ok && data.patient) {
        setPatient(data.patient);
        const dates = (data.patient.tests || [])
          .map(g => g.requestedDate || g.requestDate)
          .filter(Boolean)
          .sort((a,b) => new Date(b) - new Date(a));
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

  console.log("patient", patient);
  console.log("patientTestDates", patientTestDates);

  // When a calendar date is selected, filter tests of that date
  const testGroupOnSelectedDate = React.useMemo(() => {
    if (!selectedDate || !patient || !patient.tests) return null;
    return patient.tests.find(group => group.requestDate === selectedDate) || null;
  }, [patient, selectedDate]);

  console.log("testGroupOnSelectedDate", testGroupOnSelectedDate);

  const testsOnSelectedDate = testGroupOnSelectedDate?.testItems || [];
  const discountOnSelectedDate = testGroupOnSelectedDate?.discount || 0;
  const totalBillOnSelectedDate = testGroupOnSelectedDate?.testItems.reduce((total, test) => total + test.price, 0) - discountOnSelectedDate;

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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
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
      const resp = await fetch(`http://localhost:5000/patients/${patient.patientId}/add-tests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
    const filtered = allPatients.filter(p =>
      p.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchName, allPatients]);

  // Rehydrate after returning from add-test page
  useEffect(() => {
    async function rehydrate() {
      try {
        if (location.state?.newlyAddedTest) {
          const newTestId = location.state.newlyAddedTest;
          const res = await fetch(`http://localhost:5000/tests/${newTestId}`);
          const testData = await res.json();

          setAvailableTests((prev) => {
            if (prev.some((t) => (t.id || t._id || t.testId) === newTestId)) {
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
      console.log(patient);
      // Extract dates and sort descending
      const dates = patient.tests
        .map(t => t.requestedAt && t.requestedAt.split("T")[0])
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
      if (dates.length > 0) {
        setSelectedDate(dates[0]); // set most recent date as default selected
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

  // ----------- PDF Invoice -----------
  const generateInvoicePDF = (date, tests) => {
    if (!patient || !date || !tests.length) {
      alert("No test data for this date");
      return;
    }
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    // 1. Logo
    // Adjust width/height as needed for your logo
    if (LOGO) {
      doc.addImage(LOGO, "PNG", 12, 6, 22, 22);
    }

    // 2. Header
    doc.setFont("helvetica");
    doc.setFontSize(15);
    doc.text("PHANI S DOCTOR LABORATORIES AND DIAGNOSTICS", 52, 14);
    doc.setFontSize(9);
    doc.text("TRUST & QUALITY", 105, 20);
    doc.setFontSize(8);
    doc.text("BAIGS MANZIL, TADIGADAPA, DONKA ROAD, YANAMALAKUDURU", 75, 24);
    doc.text("Contact: 9848833770 / 8074186770  |  doctorlab8181@gmail.com", 77.5, 28);

    let y = 34;
    doc.line(12, y, 200, y);
    y += 4;

    // 3. Invoice Meta & Patient Info
    doc.setFontSize(10);
    doc.text(`Invoice No: ${testGroupOnSelectedDate?.invoiceNo || "-"}`, 12, y);
    y += 7;
    doc.text(`Patient Name: ${patient.name || "-"}`, 12, y);
    doc.text(`Patient ID: ${patient.patientId || "-"}`, 140, y);
    y += 7;
    doc.text(`Age/Sex: ${patient.age || "-"}/${patient.gender || "-"}`, 12, y);
    doc.text(`Reg. Date: ${patient.date}  ${patient.time}`, 140, y);
    y += 7;
    doc.text(`Contact: ${patient.contact || "-"}`, 12, y);
    doc.text(`Address: ${patient.address || "-"}`, 140, y);
    y += 7;
    doc.text(`Ref By: ${patient.doctor || "-"}`, 12, y);

    // 4. Table header
    y += 8;
    doc.setFontSize(9.5);
    doc.setFillColor(230, 230, 230);
    doc.rect(12, y - 5, 186, 8, 'F');
    doc.setDrawColor(180);
    doc.setLineWidth(0.08);

    doc.text("SL", 16, y);
    doc.text("REPORT DATE", 25, y);
    doc.text("TEST DESCRIPTION", 65, y);
    doc.text("CHARGES", 140, y, { maxWidth: 25 });
    doc.text("AMOUNT", 170, y, { maxWidth: 20 });

    // 5. Table body
    y += 5;
    let total = 0;
    tests.forEach((test, idx) => {
      doc.setDrawColor(220);
      doc.line(12, y, 198, y);
      const price = typeof test.price === "number" ? test.price : Number(test.price) || 0;
      const descriptionLines = doc.splitTextToSize(test.testName || "-", 60);

      // Print serial number and date normally
      doc.text(String(idx + 1), 16, y + 6);
      doc.text(date, 25, y + 6);

      // Print description with wrapping
      doc.text(descriptionLines, 65, y + 6);

      // Print charges and amount
      doc.text(`Rs. ${price.toFixed(2)}`, 140, y + 6, { maxWidth: 25 });
      doc.text(`Rs. ${price.toFixed(2)}`, 170, y + 6, { maxWidth: 20 });

      // Increase y by number of lines * line height (for example, 8mm per line)
      y += 8 * descriptionLines.length;
      total += price;
    });

    // 6. Subtotal, Discount, etc.
    y += 2;
    doc.line(12, y, 198, y);
    y += 6;
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, y); doc.text(`Rs. ${total.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Discount:", 140, y); doc.text(`Rs. ${discountOnSelectedDate || "0.00"}`, 170, y);
    y += 6;
    const grandTotal = total - (Number(discountOnSelectedDate) || 0);
    doc.text("TOTAL:", 140, y); doc.text(`Rs. ${grandTotal.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Paid Amount:", 140, y); doc.text(`Rs. ${grandTotal.toFixed(2)}`, 170, y);
    y += 6;
    doc.text("Balance due:", 140, y); doc.text("Rs. 0.00", 170, y);

    // 7. Signature block
    y += 15;
    doc.setFontSize(10);
    doc.text("Signature", 180, y + 7);
    y += 6;
    doc.setFontSize(9);
    doc.text("TARUN", 180, y + 7);
    y += 20;

    doc.setFontSize(9);
    doc.text("THANK YOU, VISIT AGAIN", 95, y, { align: "center" });

    // Footer (optional: page number, date, etc.)

    doc.save(`${patient.name || "invoice"}_${date}.pdf`);
  };

  // ----------- END PDF ------------

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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Manage Patient Tests</h1>
        </div>
      </header>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-lg rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
            <h2 className="mb-6 text-3xl font-bold">Find Patient by Name</h2>
            <div className="mb-6 flex gap-4 relative">
              <input
                type="text"
                className="rounded-md border border-gray-300 px-3 py-2 w-full"
                placeholder="Search patient by name"
                value={searchName}
                onChange={e => {
                  setSearchName(e.target.value);
                  setPatient(null);
                  setHasSelected(false);
                }}
              />
              {filteredPatients.length > 0 && searchName &&  !hasSelected && (
                <ul className="border max-h-48 overflow-auto rounded-md bg-white shadow absolute z-50 w-full mt-1">
                  {filteredPatients.map(patient => (
                    <li
                      key={patient.patientId || patient.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      {patient.name} (ID: {patient.patientId || patient.id})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Patient Details */}
            {loading && <p>Loading patient data...</p>}
            {patient && !loading && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-2">Patient Details</h3>
                  <div className="mb-4 grid grid-cols-2 gap-6">
                    <div>Name: {patient.name}</div>
                    <div>Age: {patient.age}</div>
                    <div>Gender: {patient.gender}</div>
                    <div>Contact: {patient.contact}</div>
                    <div>Address: {patient.address}</div>
                    <div>Doctor: {patient.doctor}</div>
                    <div>Date: {patient.date}</div>
                    <div>Time: {patient.time}</div>
                  </div>
                </div>

                {/* Calendar widget */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Test Dates Calendar</h3>
                  <Calendar
                    tileDisabled={({ date }) =>
                      !patientTestDates.includes(formatDateLocal(date))
                    }
                    tileClassName={({ date }) =>
                      patientTestDates.includes(formatDateLocal(date))
                        ? "bg-green-300 rounded-full"
                        : ""
                    }
                    onClickDay={date => setSelectedDate(formatDateLocal(date))}
                    value={selectedDate ? new Date(selectedDate) : null}
                  />
                  {selectedDate && (
                    <div className="mt-2 text-sm flex items-center gap-3">
                      <b>Selected Date:</b>
                      <span className="text-blue-700">{selectedDate}</span>
                    </div>
                  )}
                </div>

                {selectedDate && (
                  <>
                    <div className="mb-6 bg-white p-4 rounded shadow">
                      <h2 className="text-lg font-semibold">Tests on {selectedDate}</h2>
                      <p><b>Total Bill: ₹{totalBillOnSelectedDate + testGroupOnSelectedDate?.discount}</b></p>
                      <p><b>Discount: ₹{testGroupOnSelectedDate?.discount || 0}</b></p>
                      <p><b>Final Bill: ₹{totalBillOnSelectedDate}</b></p>
                      <p>
                        <b>Payments:</b>
                        {testGroupOnSelectedDate?.paymentInfo?.payments?.length ? (
                          <ul className="ml-2 list-disc">
                            {testGroupOnSelectedDate.paymentInfo.payments.map((p, i) => (
                              <li key={i}>
                                ₹{p.amount} via {p.mode} on {new Date(p.date).toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          " No payments yet"
                        )}
                      </p>
                      <p><b>Amount Paid:</b> ₹{testGroupOnSelectedDate?.paymentInfo?.totalPaid || 0}</p>
                      <p><b>Balance:</b> ₹{testGroupOnSelectedDate?.paymentInfo?.balance || 0}</p>
                      <p><b>Status:</b> {testGroupOnSelectedDate?.paymentInfo?.cleared ? "Cleared" : "Due"}</p>
                      {!testGroupOnSelectedDate?.paymentInfo?.cleared && (
                        <button
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                          onClick={() => openPaymentModal(selectedDate, testGroupOnSelectedDate?.paymentInfo?.balance, true)}
                        >
                          Pay Balance
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Filtered Test Table */}
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {selectedDate
                      ? `Requested Tests on ${selectedDate}`
                      : "Requested Tests"}
                  </h3>
                  <table className="w-full mb-4 rounded border border-[var(--border-color)]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Test Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Requested At</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testsOnSelectedDate && testsOnSelectedDate.length > 0 ? (
                        testsOnSelectedDate.map((test, idx) => (
                          <tr
                            key={idx}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              navigate(
                                `/test-result/${patient.id || patient._id || patient.patientId}/${test.id || test._id || test.testId}`,
                                { state: { patientId: patient.id || patient.patientId, patient, testGroupOnSelectedDate } }
                              )
                            }
                          >
                            <td className="px-4 py-2">{test.testName}</td>
                            <td className="px-4 py-2">{test.description || "--"}</td>
                            <td className="px-4 py-2">₹{test.price}</td>
                            <td className="px-4 py-2">{selectedDate}</td>
                            <td className="px-4 py-2">{test.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-2">
                            {selectedDate
                              ? "No tests were requested for this date"
                              : "No tests requested"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <button
                    className="rounded bg-blue-600 text-white px-6 py-2 font-bold mt-4"
                    disabled={!selectedDate || testsOnSelectedDate.length === 0}
                    onClick={async () => {
                        if (
                          !testGroupOnSelectedDate?.paymentInfo?.cleared // <== Check if fully paid
                        ) {
                          alert("Cannot generate invoice: Balance is NOT cleared for this test date!");
                          return;
                        }

                        const invoiceNo = await getOrCreateInvoiceNumber();
                        if (!invoiceNo) return;

                        // Update patient state locally to include new invoiceNo for test group
                        setPatient((prevPatient) => {
                          const newTests = prevPatient.tests.map((tg) => {
                            if (tg.requestDate === selectedDate) {
                              return { ...tg, invoiceNo };
                            }
                            return tg;
                          });
                          return { ...prevPatient, tests: newTests };
                        });

                        generateInvoicePDF(selectedDate, testsOnSelectedDate)
                      }
                    }
                  >
                    Generate Invoice for {selectedDate}
                  </button>
                  <button
                    className="rounded-md border border-[var(--border-color)] px-4 py-2 text-[var(--text-primary)] bg-[var(--background-color)] hover:bg-[var(--border-color)] ml-4"
                    onClick={handleAddTestClick}
                  >
                    Add Test
                  </button>
                </div>
              </>
            )}
            {showAddTests && (
              <div className="mt-10">
                <h3 className="mb-4 text-xl font-bold">Select Tests To Add</h3>
                <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
                  <table className="w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Test Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableTests.length > 0 ? (
                        availableTests.map((test, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{test.testName}</td>
                            <td className="px-4 py-2">{test.description || "--"}</td>
                            <td className="px-4 py-2">₹{test.price}</td>
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedTests.some(
                                  (t) =>
                                    (t.id || t._id || t.testId) ===
                                    (test.id || test._id || test.testId)
                                )}
                                onChange={() => handleTestToggle(test)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-2 text-center">
                            No more tests available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => setShowAddTests(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="rounded-md bg-[var(--brand-color)] px-6 py-2 text-white font-bold"
                    disabled={selectedTests.length === 0}
                  >
                    Confirm Add
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
                    className="rounded-md border border-[var(--border-color)] px-4 py-2 bg-white"
                  >
                    Add New Test
                  </button>
                </div>
              </div>
            )}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded shadow max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">Record Payment for {currentPaymentDate}</h3>
                    <p>Total Due: ₹{paymentAmount}</p>
                    <div className="mb-4">
                      <label className="block mb-1">Amount:</label>
                      <input
                        type="number"
                        min={0}
                        max={paymentAmount}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Payment Mode:</label>
                      <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full border rounded p-2">
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border rounded" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        disabled={paymentAmount <= 0}
                        onClick={async () => {
                          // Send payment to backend
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
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
          {showDiscountModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">Enter Discount for these tests</h2>
                <input
                  type="number"
                  min={0}
                  max={selectedTests.reduce((sum, t) => sum + Number(t.price), 0)}
                  value={newTestsDiscount}
                  onChange={(e) => setNewTestsDiscount(Number(e.target.value))}
                  className="border p-2 w-full mb-4"
                  placeholder="Enter discount amount"
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
                    disabled={newTestsDiscount < 0}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientTestManager;
