import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Package Modal component
const PackageModal = ({
  isOpen,
  onClose,
  allTests,
  onCreatePackage,
  initialPackage,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [packageName, setPackageName] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [customPrice, setCustomPrice] = useState("");
  const [testSearch, setTestSearch] = useState("");

  useEffect(() => {
    if (initialPackage) {
      setPackageName(initialPackage.name || "");
      setSelectedTests(initialPackage.tests || []);
      setCustomPrice(
        initialPackage.price ? initialPackage.price.toString() : ""
      );
      setActiveTab(1);
    } else {
      setPackageName("");
      setSelectedTests([]);
      setCustomPrice("");
      setActiveTab(0);
    }
  }, [initialPackage, isOpen]);

  const filteredTests = React.useMemo(() => {
    if (!testSearch.trim()) return allTests;
    return allTests.filter((t) =>
      (t.testName || "").toLowerCase().includes(testSearch.toLowerCase())
    );
  }, [testSearch, allTests]);
  const total = selectedTests.reduce((sum, t) => sum + Number(t.price || 0), 0);

  const getTestId = (test) => test.id || test._id || test.testId;

  const handleTestToggle = (test) => {
    const testId = getTestId(test);
    setSelectedTests((prev) =>
      prev.some((t) => getTestId(t) === testId)
        ? prev.filter((t) => getTestId(t) !== testId)
        : [...prev, test]
    );
  };

  const handleCreate = () => {
    onCreatePackage({
      packageName,
      selectedTests,
      packagePrice: customPrice ? Number(customPrice) : total,
    });
    onClose();
    // Reset states
    setSelectedTests([]);
    setCustomPrice("");
    setActiveTab(0);
    setTestSearch("");
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedTests([]);
      setCustomPrice("");
      setActiveTab(0);
      setTestSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Test Package</h2>
          <button
            className="text-gray-500 text-xl p-1 rounded hover:bg-gray-100"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === 0
                ? "border-b-2 border-[var(--brand-color)] text-teal-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Select Tests
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === 1
                ? "border-b-2 border-[var(--brand-color)] text-teal-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Set Package Price
          </button>
        </div>
        {/* Tab 0: Select Tests */}
        {activeTab === 0 && (
          <div>
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full border border-[var(--border-color)] rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
            />
            {/* Grid Display */}
            <div className="max-h-64 overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2">
              {filteredTests.length === 0 ? (
                <div className="col-span-full text-center text-gray-400">
                  No tests found.
                </div>
              ) : (
                filteredTests.map((test) => (
                  <div
                    key={getTestId(test)}
                    className="border rounded-lg px-3 py-2 flex flex-col gap-1 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm truncate">
                        {test.testName}
                      </h4>
                      <input
                        type="checkbox"
                        checked={selectedTests.some(
                          (t) => getTestId(t) === getTestId(test)
                        )}
                        onChange={() => handleTestToggle(test)}
                        className="ml-2"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {test.description || "--"}
                    </p>
                    <p className="text-xs font-medium mt-1">
                      ₹{test.price !== undefined ? test.price : "--"}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end text-lg font-bold">
              Total Bill: ₹{total}
            </div>
          </div>
        )}
        {/* Tab 1: Set Package Price */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Package Name</label>
              <input
                type="text"
                placeholder="Enter package name"
                className="w-full border border-[var(--border-color)] rounded px-3 py-2"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Package Price</label>
              <input
                type="number"
                min={0}
                placeholder="Enter final price"
                className="w-full border border-[var(--border-color)] rounded px-3 py-2"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
              <div className="mt-2 text-sm text-gray-500">
                Total of selected tests:{" "}
                <span className="font-semibold">₹{total}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-base text-gray-600">
                Tests in package:{" "}
                <span className="font-semibold">{selectedTests.length}</span>
              </div>
              <button
                className="rounded-lg bg-[var(--brand-color)] text-white px-6 py-2 font-bold hover:bg-teal-900"
                onClick={handleCreate}
                disabled={selectedTests.length === 0}
              >
                {initialPackage ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingPackage, setEditingPackage] = useState(null);

  const userName =
    localStorage.getItem("userName") ||
    sessionStorage.getItem("userName") ||
    "";

  // Fetch tests from backend
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("http://localhost:5000/tests");
        const data = await res.json();
        setTests(data.tests || []);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    async function fetchPackages() {
      setLoadingPackages(true);
      try {
        const res = await fetch("http://localhost:5000/packages");
        const data = await res.json();
        setPackages(data.packages || []);
      } catch {
        setPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      // Fetch tests
      setLoadingTests(true);
      fetch("http://localhost:5000/tests")
        .then((res) => res.json())
        .then((data) => setTests(data.tests || []))
        .catch(() => setTests([]))
        .finally(() => setLoadingTests(false));
    } else {
      // Fetch packages
      setLoadingPackages(true);
      fetch("http://localhost:5000/packages")
        .then((res) => res.json())
        .then((data) => setPackages(data.packages || []))
        .catch(() => setPackages([]))
        .finally(() => setLoadingPackages(false));
    }
  }, [activeTab]);

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowPackageModal(true);
  };

  // Handler to create a package
  const handleSavePackage = async ({
    packageName,
    selectedTests,
    packagePrice,
  }) => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test to create a package");
      return;
    }
    try {
      const payload = {
        id: editingPackage ? editingPackage.id : undefined, // send id for update
        packageName,
        selectedTests,
        packagePrice,
      };
      const response = await fetch("http://localhost:5000/packages", {
        method: editingPackage ? "PUT" : "POST", // PUT for update, POST for create
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert(
          `Package ${
            editingPackage ? "updated" : "created"
          } successfully with ID: ${data.package.id}`
        );
        setShowPackageModal(false);
        setEditingPackage(null);
        // Refresh active tab data
        if (activeTab === 0) {
          setActiveTab(1); // Switch to packages tab to view changes
        } else {
          // refresh packages
          setLoadingPackages(true);
          const refreshed = await fetch("http://localhost:5000/packages");
          const refreshedData = await refreshed.json();
          setPackages(refreshedData.packages || []);
          setLoadingPackages(false);
        }
      } else {
        alert(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save package. Please try again.");
    }
  };

  return (
    <div
      className="relative flex flex-col h-screen bg-[var(--background-color)]"
      style={{
        "--brand-color": "#008080",
        "--primary-light": "#e0f2f1",
        "--background-color": "#f7f9fc",
        "--surface-color": "#ffffff",
        "--text-primary": "#111518",
        "--text-secondary": "#637988",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`md:relative fixed md:h-full h-screen inset-y-0 left-0 z-30 w-64 bg-white border-r border-[var(--border-color)] shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

          {/* Card Wrapper */}
          <div className="mx-auto w-full rounded-lg bg-[var(--surface-color)] p-6 shadow-lg text-left">
            <div className="mb-6 border-b border-[var(--border-color)] flex space-x-4">
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === 0
                    ? "border-b-2 border-[var(--brand-color)] text-teal-700"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(0)}
              >
                Tests
              </button>
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === 1
                    ? "border-b-2 border-[var(--brand-color)] text-teal-700"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(1)}
              >
                Packages
              </button>
            </div>

            {activeTab === 0 && (
              <>
                <h2 className="mb-6 text-2xl lg:text-3xl font-bold tracking-tight">
                  Tests Available In The Lab
                </h2>
                <div className="mt-6">
                  {loadingTests ? (
                    // Skeleton Loader
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 w-full rounded-md bg-gray-200"
                        ></div>
                      ))}
                    </div>
                  ) : tests.length === 0 ? (
                    <p className="text-gray-500">No tests found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tests.map((test) => (
                        <div
                          key={test.id}
                          className="bg-[var(--primary-light)] rounded-lg p-4 shadow-md hover:shadow-lg transition"
                        >
                          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                            {test.testName}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-3">
                            {test.description || "--"}
                          </p>
                          <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                            Price: {test.price ? `₹${test.price}` : "--"}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                              onClick={() => navigate(`/view-test/${test.id}`)}
                            >
                              View
                            </button>
                            <button
                              className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                              onClick={() => navigate(`/edit-test/${test.id}`)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPackageModal(true)}
                      className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-yellow-600 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-700 transition-colors shadow-md"
                    >
                      <span className="material-icons text-base">
                        Create Package
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/add-test")}
                      className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--brand-color)] px-4 py-2 text-sm font-bold text-white hover:bg-teal-900 transition-colors shadow-md"
                    >
                      <span className="material-icons text-base">Add Test</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 1 && (
              <>
                <h2 className="mb-6 text-2xl lg:text-3xl font-bold tracking-tight">
                  Packages Available In The Lab
                </h2>
                {loadingPackages ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 w-full rounded-md bg-gray-200"
                      ></div>
                    ))}
                  </div>
                ) : packages.length === 0 ? (
                  <p className="text-gray-500">No packages found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-[var(--primary-light)] rounded-lg p-4 shadow-md hover:shadow-lg transition"
                      >
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                          Package Name: {pkg.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Tests in package: {pkg.tests.length}
                        </p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                          Price: ₹{pkg.price}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Turnaround Time: {pkg.turnaroundTime} hours
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                            onClick={() => navigate(`/view-package/${pkg.id}`)}
                          >
                            View
                          </button>
                          <button
                            className="text-[var(--brand-color)] font-semibold hover:text-teal-700"
                            onClick={() => handleEditPackage(pkg)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <PackageModal
          isOpen={showPackageModal}
          onClose={() => {
            setShowPackageModal(false);
            setEditingPackage(null);
          }}
          allTests={tests}
          onCreatePackage={handleSavePackage}
          initialPackage={editingPackage}
        />
      </div>
    </div>
  );
};

export default Tests;
