import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from 'react-toastify';

const LOGO = "/images/45x41inche.....1print...Doted vinyle (1) - Copy.jpg";

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const strHours = hours.toString().padStart(2, '0');
  const strMinutes = minutes.toString().padStart(2, '0');
  const strSeconds = seconds.toString().padStart(2, '0');
  return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
};

const PatientTestManager = () => {
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [total, setTotal] = useState(0);
  const [showAddTests, setShowAddTests] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [newTestsDiscount, setNewTestsDiscount] = useState("");
  const [allPatients, setAllPatients] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");
  const [packages, setPackages] = useState([]);
  const [packageSearchTerm, setPackageSearchTerm] = useState("");
  const [testSearchTerm, setTestSearchTerm] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBalance, setIsBalance] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [currentPaymentDate, setCurrentPaymentDate] = useState(null);

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorSearchInput, setDoctorSearchInput] = useState("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch patient info by ID
  const handlePatientSelect = async (patient) => {
    setPatient(patient);
    setSearchName(patient.name);
    setFilteredPatients([]);
    setHasSelected(true);
    setLoading(true);
    try {
      const resp = await fetch(
        `${BACKEND_URL}/patients/${patient.patientId || patient.id}`
      );
      const data = await resp.json();
      if (resp.ok && data.patient) {
        setPatient(data.patient);
        setEditData({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          contact: patient.contact,
          address: patient.address,
        });
        const dates = (data.patient.tests || [])
          .map((g) => g.requestedDate || g.requestDate)
          .filter(Boolean)
          .sort((a, b) => new Date(b) - new Date(a));
        setSelectedDate(dates[0] || null);
        setSelectedTests([]);
        setShowAddTests(false);
      } else {
        toast.error("Failed to load patient details");
        setPatient(null);
      }
    } catch {
      toast.error("Error fetching patient details");
      setPatient(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/doctors`)
      .then(res => res.json())
      .then(data => setDoctorOptions(data.doctors || []));
  }, []);

  const onDoctorInputChange = (val) => {
    setDoctorSearchInput(val);
    setSelectedDoctor(val);
  };

  // Calendar: Get all unique test-requested dates for the patient
  const patientTestDates = React.useMemo(() => {
    if (!patient || !patient.tests) return [];
    return patient.tests.map((group) => group.requestDate).filter(Boolean);
  }, [patient]);

  // When a calendar date is selected, filter tests of that date
  const testGroupOnSelectedDate = React.useMemo(() => {
    if (!selectedDate || !patient || !patient.tests) return null;

    // Find the test group corresponding to selectedDate
    const group = patient.tests.find((group) => group.requestDate === selectedDate);

    console.log("group", group);

    if (!group) return null;

    // Compute package statuses for the test items within the group
    const computePackageStatus = (testItems) => {
      return testItems.map(item => {
        if (item.isPackage && item.tests && item.tests.length) {
          console.log("item", item);
          const allCompleted = item.tests.every(test => test.status === "Completed");
          return {
            ...item,
            computedStatus: allCompleted ? "Completed" : "Pending"
          };
        }
        return {
          ...item,
          computedStatus: item.status || "Pending"
        }
      });
    };

    const updatedTestItems = computePackageStatus(group.testItems || []);

    return {
      ...group,
      testItems: updatedTestItems
    };

  }, [selectedDate, patient]);

  const handleChange = (e) => {
    console.log(editData);
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSave = async () => {
    if (isEditing) {
      // Save patient data to backend
      const response = await fetch(`${BACKEND_URL}/patients/${patient.patientId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        const updated = await response.json();
        console.log(updated);
        setPatient(updated.patient);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDoctorBlurOrSelect = async () => {
    if (
      doctorOptions.some(d => d.name.trim().toLowerCase() === doctorSearchInput.trim().toLowerCase())
    ) {
      setSelectedDoctor(doctorSearchInput); // Picked existing
    } else if (doctorSearchInput.trim() !== "") {
      // Add new doctor to DB
      const resp = await fetch(`${BACKEND_URL}/doctors`, {
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
  };

  const testsOnSelectedDate = testGroupOnSelectedDate?.testItems || [];
  const discountOnSelectedDate = testGroupOnSelectedDate?.discount || 0;
  const totalBillOnSelectedDate =
    testGroupOnSelectedDate?.testItems.reduce(
      (total, test) => total + test.price,
      0
    ) - discountOnSelectedDate;

  const uniqueDoctors = Array.from(
    new Set((testsOnSelectedDate).map(test => test.refDoctor).filter(Boolean))
  ).map(name => `Dr. ${name}`).join(", ");

  // Handle test toggle in add test table
  const handleTestToggle = (test) => {
    const testId = test.id || test._id || test.testId;
    setSelectedTests((prev) =>
      prev.find((t) => (t.id || t._id || t.testId) === testId)
        ? prev.filter((t) => (t.id || t._id || t.testId) !== testId)
        : [...prev, test]
    );
  };

  const handleItemToggle = (item) => {
    const itemId = getTestId(item);
    setSelectedTests((prev) => {
      if (prev.find(t => getTestId(t) === itemId)) {
        // Remove
        return prev.filter(t => getTestId(t) !== itemId);
      } else {
        // Add
        return [...prev, item];
      }
    });
  };

  const filteredTests = React.useMemo(() => {
    if (!testSearchTerm.trim()) return availableTests;
    return availableTests.filter((t) => t.testName.toLowerCase().includes(testSearchTerm.toLowerCase()));
  }, [testSearchTerm, availableTests]);

  const filteredPackages = React.useMemo(() => {
    if (!packageSearchTerm.trim()) return packages;
    return packages.filter((p) => p.name.toLowerCase().includes(packageSearchTerm.toLowerCase()));
  }, [packageSearchTerm, packages]);

  const getTestId = (test) => test.id || test._id || test.testId;

  // Extract all tests inside selected packages
  const selectedPackageTestIds = new Set(
    selectedTests
      .filter(item => item.isPackage)
      .flatMap(pkg => pkg.tests.map(t => getTestId(t)))
  );

  // Use this to disable tests that are part of selected packages
  const isTestDisabled = test => selectedPackageTestIds.has(getTestId(test));

  const openPaymentModal = (requestDate, balance, isBalance) => {
    console.log("openPaymentModal", requestDate, balance, isBalance);
    setCurrentPaymentDate(requestDate);
    setPaymentAmount(balance || 0);
    setPaymentMode("Cash");
    setIsBalance(isBalance);
    setShowPaymentModal(true);
  };

  const balanceDue = Math.max(0, total - Number(paymentAmount) || 0);

  const submitPayment = async () => {
    setShowPaymentModal(false);
    try {
      const payload = {
        requestDate: currentPaymentDate,
        payment: {
          amount: Number(paymentAmount),
          mode: paymentMode,
        },
        doctor: selectedDoctor,
        tests: [], // no new tests here, just payment
      };
      const resp = await fetch(
        `${BACKEND_URL}/patients/${patient.patientId}/add-tests`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        toast.success("Payment recorded successfully");
        setPatient(data.patient);
        setCurrentPaymentDate(null);
        setPaymentAmount(0);
      } else {
        toast.error(data.error || "Failed to record payment");
      }
    } catch {
      toast.error("Error submitting payment");
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
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/tests`);
      const data = await resp.json();
      if (resp.ok) {
        const requestedIds = (patient?.tests || []).map(
          (t) => t.id || t._id || t.testId
        );
        const filteredTests = (data.tests || []).filter(
          (test) => !requestedIds.includes(test.id || test._id || test.testId)
        );
        setAvailableTests(filteredTests);
        setLoading(false);
      } else {
        toast.error("Failed to fetch tests list");
      }
    } catch (e) {
      toast.error("Error fetching tests");
    }
  };

  useEffect(() => {
      const fetchPackages = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${BACKEND_URL}/packages`);
          const data = await res.json();
          if (res.ok) {
            setPackages(data.packages || []);
            setLoading(false);
          } else {
            alert("Failed to load packages");
          }
        } catch (error) {
          console.error("Error fetching packages:", error);
        }
      };
      fetchPackages();
    }, []);

    const isPackageItem = (item) => item.isPackage === true;

  const handleConfirm = () => {
    if (selectedTests.length === 0) {
      toast.warn("Please select at least one test");
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
        doctor: selectedDoctor,
        tests: selectedTests,
        discount: newTestsDiscount,
        date: getCurrentDate(),
        time: getCurrentTime(),
      };
      const resp = await fetch(
        `${BACKEND_URL}/patients/${patient.patientId}/add-tests`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        toast.success("Tests added successfully");
        setSelectedTests([]);
        setNewTestsDiscount(0);
        setShowDiscountModal(false);
        setPatient(data.patient);
        setShowAddTests(false);
      } else {
        toast.error(data.error || "Failed to add tests");
      }
    } catch (error) {
      toast.error("Server error while adding tests");
    }
  };

  useEffect(() => {
    async function fetchAllPatients() {
      try {
        const resp = await fetch(`${BACKEND_URL}/patients`);
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
      p.name.toLowerCase().includes(searchName.toLowerCase()) ||
      p.contact && p.contact.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchName, allPatients]);

  useEffect(() => {
    const totalPrice = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);
    const discountValue = Number(newTestsDiscount) || 0;
    setTotal(totalPrice - discountValue);
  }, [selectedTests, newTestsDiscount]);

  useEffect(() => {
    async function rehydrate() {
      try {
        if (location.state?.newlyAddedTest) {
          const newTestId = location.state.newlyAddedTest;
          const res = await fetch(`${BACKEND_URL}/tests/${newTestId}`);
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
            `${BACKEND_URL}/patients/${location.state.patientId}`
          );
          const data = await resp.json();
          if (data.patient) {
            setPatient(data.patient);
          } else {
            setPatient(null);
            toast.error("Could not find patient on rehydration");
          }
        }
      } catch (error) {
        setPatient(null);
        toast.error("Error during rehydration");
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

  const LoadingSpinner = ({ size = "w-6 h-6", className = "" }) => (
    <div className={`${size} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-[var(--brand-color)]"></div>
    </div>
  );

  const getOrCreateInvoiceNumber = async () => {
    if (!patient || !selectedDate) {
      toast.warn("No selected patient or date");
      return null;
    }

    try {
      const resp = await fetch(
        `${BACKEND_URL}/patients/${patient.patientId}/invoice-number`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestDate: selectedDate }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        toast.error(data.error || "Failed to get invoice number");
        return null;
      }
      return data.invoiceNo;
    } catch (error) {
      toast.error("Error fetching invoice number");
      return null;
    }
  };

  const generateInvoicePDF = (date, tests, invoiceNo) => {
    if (!patient || !date || !tests.length) {
      toast.warn("No test data for this date");
      return;
    }
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    if (LOGO) {
      doc.addImage(LOGO, "PNG", 12, 6, 22, 22);
    }

    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Blue
    doc.text("Phani's", 38, 10);

    // "DOCTOR"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 179);
    doc.text("DOCTOR", 38, 17,);

    // Telugu line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(128, 0, 128); // Purple
    doc.text("LABORATORIES & DIAGNOSTICS", 76, 22, { align: "center" });

    // Trust & Quality
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Trust & Quality", 90, 25);

    // Address & contact
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Baig's Manzil, Near Hydari Masjid,", 200, 10, { align: "right" });
    doc.text("Tadigadapa Donka Road,", 200, 14, { align: "right" });
    doc.text("Yanamalakuduru,", 200, 18, { align: "right" });
    doc.text("Vijayawada - 520007, A.P.", 200, 22, { align: "right" });
    doc.text("Contact: 9848833770 / 8074186770", 200, 26, { align: "right" });
    doc.text("Email: doctorlab8181@gmail.com", 200, 30, { align: "right" });

    let y = 34;
    doc.line(12, y, 200, y);
    y += 4;

    doc.setFontSize(10);
    doc.text(`Invoice No: ${patient.patientId} /${invoiceNo || "-"}`, 12, y);
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
    doc.text(`Ref By: ${uniqueDoctors || "-"}`, 12, y);

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

      if (test.isPackage) {
        const packageDescription = test.name;
        const testNames = test.tests.map(t => t.testName).join(", ");
        const fullDescription = `${packageDescription}\n${testNames}`;
        var descriptionLines = doc.splitTextToSize(fullDescription, 60);
      } else {
        var descriptionLines = doc.splitTextToSize(test.testName || "-", 60);
      }

      doc.text(String(idx + 1), 16, y + 6);
      doc.text(date, 25, y + 6);
      doc.text(descriptionLines, 65, y + 6);
      doc.text(`Rs. ${price.toFixed(2)}`, 140, y + 6, { maxWidth: 25 });
      doc.text(`Rs. ${price.toFixed(2)}`, 170, y + 6, { maxWidth: 20 });

      if (test.isPackage) {
        console.log("descriptionLines", descriptionLines);
        y += 5 * descriptionLines.length;
      } else {
        y += 8 * descriptionLines.length;
      }
      
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

    // Footer timestamp
    const generatedAt = new Date().toLocaleString(); // e.g. "9/30/2025, 11:15:23 PM"
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generated on: ${generatedAt}`, 105, 290, { align: "center" });

    doc.save(`${patient.name || "invoice"}_${date}.pdf`);
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 h-40 rounded-lg w-full"></div>
  );

  return (
    <div
      className="flex h-screen flex-col bg-gray-100 text-[var(--text-primary)]"
      style={{
        "--brand-color": "#649ccd",
        "--background-color": "#d1e1f0",
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
            <div className="flex justify-between">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold">Find Patient by Name</h2>
              <button
                  className="inline-flex items-center justify-center rounded-md h-12 px-6 text-base font-bold bg-[var(--primary-color)] text-white shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-transform duration-300 ease-in-out animate-pulse"
                  onClick={() => navigate("/patient-form")}
                  style={{ animationDuration: '2.5s', backgroundColor: '#356a9a' }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Case
                </button>
            </div>
            <div className="mb-6 flex gap-4 relative">
              <input
                type="text"
                className="rounded-md border border-gray-300 px-3 py-2 w-full"
                placeholder="Search patient by name or mobile number"
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
                    <div>
                      <span className="font-semibold">Name: </span> 
                      {isEditing ? (
                        <input className="form-input rounded-sm border-primary-200 px-4 py-2 text-sm bg-[#d1e1f0]" name="name" value={editData.name} onChange={handleChange} />
                      ) : (
                        <span>{patient.name}</span>
                      )}
                    </div>
                    <div><span className="font-semibold">Patient ID: </span> {patient.patientId || patient.id}</div>
                    <div>
                      <span className="font-semibold">Age/Gender: </span> 
                      {isEditing ? (
                        <>
                          <input className="form-input rounded-sm border-primary-200 px-4 py-2 text-sm bg-[#d1e1f0] w-20" name="age" value={editData.age} onChange={handleChange} /> 
                          <span className="mx-2">/</span>
                          <select className="form-input rounded-sm border-primary-200 px-4 py-2 text-sm bg-[#d1e1f0]" name="gender" value={editData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </>
                      ) : (
                        <span>{patient.age} / {patient.gender}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Contact: </span>
                      {isEditing ? (
                        <input className="form-input rounded-sm border-primary-200 px-4 py-2 text-sm bg-[#d1e1f0]" name="contact" value={editData.contact} onChange={handleChange} />
                      ) : (
                        <span>{patient.contact}</span>
                      )}
                    </div>
                    <div><span className="font-semibold">Address: </span> 
                      {isEditing ? (
                        <input className="form-input rounded-sm border-primary-200 px-4 py-2 text-sm bg-[#d1e1f0]" name="address" value={editData.address} onChange={handleChange} />
                      ) : (
                        <span>{patient.address}</span>
                      )}
                    </div>
                    <div><span className="font-semibold">Reg. Date/Time: </span> {patient.date} {patient.time}</div>
                    <div>
                      <span className="font-semibold">Ref. By: </span>{" "}
                      {testsOnSelectedDate && testsOnSelectedDate.length > 0 ? uniqueDoctors : "N/A"}
                    </div>
                    <div>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleEditSave} type="button">
                        {isEditing ? "Save" : "Edit Patient"}
                      </button>
                    </div>
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
                                      selectedDate,
                                      isPackage: test.isPackage ? test.isPackage : false,
                                    },
                                  }
                                )
                              }
                            >
                              <td className="px-3 sm:px-4 py-2">{test.isPackage ? test.name : test.testName}</td>
                              <td className="px-3 sm:px-4 py-2">
                                {test.isPackage ? 
                                  <ul className="list-disc ml-6">
                                    {test.tests.map((test, index) => (
                                      <li key={index}>{test.testName}</li>
                                    )) || "--"}
                                  </ul> : test.description || "--"}</td>
                              <td className="px-3 sm:px-4 py-2">₹{test.price}</td>
                              <td className="px-3 sm:px-4 py-2">{selectedDate}</td>
                              <td className="px-3 sm:px-4 py-2">
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  test.computedStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  test.computedStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {test.computedStatus}
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
                          toast.warn("Cannot generate invoice: Balance is NOT cleared for this test date!");
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
                <>
                  <div className="flex border-b border-gray-300 mb-4">
                    <button
                      type="button"
                      className={`px-4 py-2 font-semibold ${activeTab === "tests" ? "border-b-2 border-brand-color" : ""}`}
                      onClick={() => setActiveTab("tests")}
                    >
                      Tests
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 font-semibold ${activeTab === "packages" ? "border-b-2 border-brand-color" : ""}`}
                      onClick={() => setActiveTab("packages")}
                    >
                      Packages
                    </button>
                  </div>

                  {activeTab === "tests" && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold">Select Tests</h3>
                        {loading && <LoadingSpinner />}
                      </div>

                      <input
                        type="text"
                        placeholder="Search tests..."
                        className="w-full border border-[var(--border-color)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:border-[var(--border-color)] mb-2"
                        value={testSearchTerm}
                        onChange={(e) => setTestSearchTerm(e.target.value)}
                      />

                      {/* Mobile Card View */}
                      <div className="block sm:hidden space-y-4">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner size="w-8 h-8" />
                          </div>
                        ) : filteredTests.length > 0 ? (
                          filteredTests.map((test, idx) => (
                            <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--surface-color)]">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-[var(--text-primary)] text-sm leading-tight">
                                  {test.testName}
                                </h4>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 ml-2 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)] flex-shrink-0"
                                  checked={selectedTests.some((t) => getTestId(t) === getTestId(test))}
                                  disabled={isTestDisabled(test)}
                                  onChange={() => handleItemToggle(test)}
                                />
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mb-2">
                                {test.description || "No description available"}
                              </p>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {test.price ? `₹${test.price}` : "Price not available"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-[var(--text-secondary)]">
                            No tests available
                          </div>
                        )}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block w-full overflow-x-auto rounded-lg border border-[var(--border-color)]">
                        <table className="w-full divide-y divide-[var(--border-color)]">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-2/5 px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Test Name
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Description
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Price
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Select
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)] bg-[var(--surface-color)]">
                            {loading ? (
                              <tr>
                                <td colSpan="4" className="px-4 lg:px-6 py-8 text-center">
                                  <LoadingSpinner size="w-8 h-8" className="mx-auto" />
                                </td>
                              </tr>
                            ) : filteredTests.length > 0 ? (
                              filteredTests.map((test, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 lg:px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-normal break-words max-w-xs">
                                    {test.testName}
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-normal break-words max-w-sm">
                                    {test.description || "--"}
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                    {test.price ? `₹${test.price}` : "--"}
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                                      checked={selectedTests.some((t) => getTestId(t) === getTestId(test))}
                                      disabled={isTestDisabled(test)}
                                      onChange={() => handleItemToggle(test)}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-4 lg:px-6 py-4 text-sm text-center text-[var(--text-secondary)]">
                                  No tests available
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
                      </div>
                    </>
                  )}

                  {activeTab === "packages" && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold">Select Packages</h3>
                        {loading && <LoadingSpinner />}
                      </div>

                      <input
                        type="text"
                        placeholder="Search tests..."
                        className="w-full border border-[var(--border-color)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:border-[var(--border-color)] mb-2"
                        value={packageSearchTerm}
                        onChange={(e) => setPackageSearchTerm(e.target.value)}
                      />

                      {/* Mobile Card View */}
                      <div className="block sm:hidden space-y-4">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner size="w-8 h-8" />
                          </div>
                        ) : filteredPackages.length > 0 ? (
                          filteredPackages.map((pkg, idx) => (
                            <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--surface-color)]">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-[var(--text-primary)] text-sm leading-tight">
                                  {pkg.name}
                                </h4>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 ml-2 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)] flex-shrink-0"
                                  checked={selectedTests.some((t) => getTestId(t) === getTestId(pkg))}
                                  onChange={() => handleItemToggle({ ...pkg, isPackage: true })}
                                />
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mb-2">
                                <ul className="list-disc ml-6">
                                  {pkg.tests.map((test, index) => (
                                    <li key={index}>{test.testName}</li>
                                  )) || "--"}
                                </ul>
                              </p>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {pkg.price ? `₹${pkg.price}` : "Price not available"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-[var(--text-secondary)]">
                            No Packages available
                          </div>
                        )}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block w-full overflow-x-auto rounded-lg border border-[var(--border-color)]">
                        <table className="w-full divide-y divide-[var(--border-color)]">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-2/5 px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Package Name
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Tests
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Price
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Select
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)] bg-[var(--surface-color)]">
                            {loading ? (
                              <tr>
                                <td colSpan="4" className="px-4 lg:px-6 py-8 text-center">
                                  <LoadingSpinner size="w-8 h-8" className="mx-auto" />
                                </td>
                              </tr>
                            ) : filteredPackages.length > 0 ? (
                              filteredPackages.map((pkg, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 lg:px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-normal break-words max-w-xs">
                                    {pkg.name}
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-normal break-words max-w-sm">
                                    <ul className="list-disc ml-6">
                                      {pkg.tests.map((test, index) => (
                                        <li key={index}>{test.testName}</li>
                                      )) || "--"}
                                    </ul>
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                    {pkg.price ? `₹${pkg.price}` : "--"}
                                  </td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                                      checked={selectedTests.some((t) => getTestId(t) === getTestId(pkg))}
                                      onChange={() => handleItemToggle({ ...pkg, isPackage: true })}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-4 lg:px-6 py-4 text-sm text-center text-[var(--text-secondary)]">
                                  No Packages available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
                {/* <h3 className="mb-4 text-xl font-bold">Select Tests To Add</h3>
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
                </div> */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                  <p className="text-lg sm:text-xl font-bold">Total Bill: ₹{total}</p>
                  <button
                    onClick={handleConfirm}
                    className="order-1 sm:order-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-800 font-boldocus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
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
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Ref. Doctor:</label>
                    <div className="relative">
                      <input
                        className="mt-1 block w-full rounded-md border p-2 sm:p-3 border-[var(--border-color)] shadow-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] text-sm sm:text-base pr-8"
                        id="doctor"
                        placeholder="Select or enter referring doctor's name"
                        value={doctorSearchInput}
                        onChange={e => onDoctorInputChange(e.target.value)}
                        list="doctor-list"
                        onBlur={handleDoctorBlurOrSelect}
                        required
                        type="text"
                      />
                      {isLoadingDoctors && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 mt-0.5">
                          <LoadingSpinner size="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <datalist id="doctor-list">
                      {doctorOptions.map(doc => (
                        <option key={doc.id} value={doc.name} />
                      ))}
                    </datalist>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">
                    Record Payment for {currentPaymentDate}
                  </h3>
                  <p className="mb-4 text-gray-700">
                    Total Due <span className="font-bold">{total}</span>
                    {Number(paymentAmount) > 0 &&
                      <span className="ml-2 text-gray-500">
                        Balance after payment: <span className="font-bold">
                          {balanceDue}
                        </span>
                      </span>
                    }
                  </p>
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

