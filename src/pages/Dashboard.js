import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const TIME_FILTERS = [
  { label: "Last 1 Day", value: "1d" },
  { label: "Last 1 Week", value: "1w" },
  { label: "Last 1 Month", value: "1m" },
  { label: "All", value: "all" },
];

function getStartDate(timeFilter) {
  const now = new Date();
  switch (timeFilter) {
    case "1d":
      return new Date(now.setDate(now.getDate() - 1));
    case "1w":
      return new Date(now.setDate(now.getDate() - 7));
    case "1m":
      return new Date(now.setMonth(now.getMonth() - 1));
    default:
      return null;
  }
}

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: 0,
    patientsChange: 0,
    tests: 0,
    testsChange: 0,
    revenue: 0,
    revenueChange: 0,
  });

  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("1d");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  useEffect(() => {
    async function fetchData() {
      const patientsResp = await fetch("http://localhost:5000/patients");
      const patientsData = await patientsResp.json();
      const patientsList = patientsData.patients || patientsData || [];

      const numPatients = patientsList.length;

      const numTests = patientsList.reduce(
        (sum, p) =>
          sum +
          p.tests.reduce((groupSum, group) => groupSum + (group.testItems?.length || 0), 0),
        0
      );

      const revenue = patientsList.reduce(
        (sum, p) => sum + (Number(p.totalBill) || 0),
        0
      );

      const currPatientsResp = await fetch(
        "http://localhost:5000/patientsData?period=current"
      );
      const prevPatientsResp = await fetch(
        "http://localhost:5000/patientsData?period=previous"
      );
      const currentPatientsData = await currPatientsResp.json();
      const previousPatientsData = await prevPatientsResp.json();

      const currCostsResp = await fetch("http://localhost:5000/inventoryCosts?period=current");
      const prevCostsResp = await fetch("http://localhost:5000/inventoryCosts?period=previous");
      const currentCostsData = await currCostsResp.json();
      const previousCostsData = await prevCostsResp.json();

      const currCosts = currentCostsData.totalCost || 0;
      const prevCosts = previousCostsData.totalCost || 0;

      const currPatientsList =
        currentPatientsData.patients || currentPatientsData || [];
      const prevPatientsList =
        previousPatientsData.patients || previousPatientsData || [];

      const numCurrPatients = currPatientsList.length;
      const numPrevPatients = prevPatientsList.length;

      const numCurrTests = currPatientsList.reduce((sum, patient) => {
        if (!patient.tests) return sum;
        return sum + patient.tests.reduce((groupSum, group) => groupSum + (group.testItems?.length || 0), 0);
      }, 0);

      const numPrevTests = prevPatientsList.reduce((sum, patient) => {
        if (!patient.tests) return sum;
        return sum + patient.tests.reduce((groupSum, group) => groupSum + (group.testItems?.length || 0), 0);
      }, 0);

      const currRevenue = currPatientsList.reduce(
        (sum, p) => sum + (Number(p.totalBill) || 0),
        0
      );
      const prevRevenue = prevPatientsList.reduce(
        (sum, p) => sum + (Number(p.totalBill) || 0),
        0
      );

      const currTotalRevenue = currRevenue - currCosts;
      const prevTotalRevenue = prevRevenue - prevCosts;

      let costs = 0;
      try {
        const inventoryResp = await fetch("http://localhost:5000/inventory");
        const inventoryData = await inventoryResp.json();
        costs = (inventoryData.inventory || []).reduce((sum, item) => {
          return (
            sum +
            (item.batches
              ? item.batches.reduce((s, b) => s + (Number(b.amount) || 0), 0)
              : 0)
          );
        }, 0);
      } catch {
        costs = 0;
      }

      const patientsChange = calculateChange(numCurrPatients, numPrevPatients);
      const testsChange = calculateChange(numCurrTests, numPrevTests);
      const revenueChange = calculateChange(currTotalRevenue, prevTotalRevenue);

      const totalRevenue = revenue === 0 ? 0 : revenue - costs;

      setStats({
        patients: numPatients,
        patientsChange,
        tests: numTests,
        testsChange,
        revenue: totalRevenue.toFixed(2),
        revenueChange,
      });

      setCases(patientsList);
    }

    fetchData();
  }, []);

  const filteredCases = React.useMemo(() => {
    if (filter === "all") return cases;
    const startDate = getStartDate(filter);
    if (!startDate) return cases;
    return cases.filter((c) => new Date(c.date) >= startDate);
  }, [cases, filter]);

  return (
    <div
      className="relative flex min-h-screen bg-[var(--background-color)]"
      style={{
        "--primary-color": "#008080",
        "--primary-light": "#e0f2f1",
        "--text-primary": "#111827",
        "--text-secondary": "#6b7280",
        "--background-color": "#f8f9fa",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[var(--border-color)] shadow-lg h-screen flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 lg:ml-28" aria-label="Main content area">
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
            Dashboard
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

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              Number of Patients
            </p>
            <p className="text-[var(--text-primary)] text-3xl font-bold mt-2">
              {stats.patients}
            </p>
            <p
              className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                stats.patientsChange >= 0 ? "text-teal-600" : "text-red-600"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {stats.patientsChange >= 0 ? (
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-8.707l-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 1.414 1.414L9 9.414V13a1 1 0 1 0 2 0V9.414l1.293 1.293a1 1 0 0 0 1.414-1.414z"
                    fillRule="evenodd"
                  />
                ) : (
                  <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-3.707 7.707l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V7a1 1 0 1 0-2 0v3.586L7.707 8.293a1 1 0 0 0-1.414 1.414z" />
                )}
              </svg>
              {Math.abs(stats.patientsChange).toFixed(1)}% from last month
            </p>
          </div>

          <div className="card bg-white p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              Tests Conducted
            </p>
            <p className="text-[var(--text-primary)] text-3xl font-bold mt-2">
              {stats.tests}
            </p>
            <p
              className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                stats.testsChange >= 0 ? "text-teal-600" : "text-red-600"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {stats.testsChange >= 0 ? (
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-8.707l-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 1.414 1.414L9 9.414V13a1 1 0 1 0 2 0V9.414l1.293 1.293a1 1 0 0 0 1.414-1.414z"
                    fillRule="evenodd"
                  />
                ) : (
                  <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-3.707 7.707l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V7a1 1 0 1 0-2 0v3.586L7.707 8.293a1 1 0 0 0-1.414 1.414z" />
                )}
              </svg>
              {Math.abs(stats.testsChange).toFixed(1)}% from last month
            </p>
          </div>

          <div className="card bg-white p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              Revenue
            </p>
            <p className="text-[var(--text-primary)] text-3xl font-bold mt-2">
              ₹{stats.revenue}
            </p>
            <p
              className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                stats.revenueChange >= 0 ? "text-teal-600" : "text-red-600"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {stats.revenueChange >= 0 ? (
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-8.707l-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 1.414 1.414L9 9.414V13a1 1 0 1 0 2 0V9.414l1.293 1.293a1 1 0 0 0 1.414-1.414z"
                    fillRule="evenodd"
                  />
                ) : (
                  <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-3.707 7.707l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V7a1 1 0 1 0-2 0v3.586L7.707 8.293a1 1 0 0 0-1.414 1.414z" />
                )}
              </svg>
              {Math.abs(stats.revenueChange).toFixed(1)}% from last month
            </p>
          </div>
        </div>

        {/* Recent Cases Table */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Recent Cases
          </h2>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm font-bold focus:ring outline-none"
            >
              {TIME_FILTERS.map((opt) => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-bold bg-[var(--primary-color)] text-white hover:bg-teal-900 transition-colors shadow-md"
              onClick={() => navigate("/patient-form")}
            >
              Add Case
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-color)] overflow-x-auto">
  <table className="w-full text-sm text-left text-[var(--text-secondary)] table-fixed overflow-x-auto">
    <colgroup>
      <col style={{ width: "20%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "20%" }} />
    </colgroup>
    <thead className="table-header bg-gray-50 text-xs text-[var(--text-primary)] uppercase">
      <tr>
        <th className="px-6 py-3">Case ID</th>
        <th className="px-6 py-3">Patient Name</th>
        <th className="px-6 py-3">Date</th>
        <th className="px-6 py-3">Status</th>
        <th className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredCases.length === 0 ? (
        <tr>
          <td className="px-6 py-4 text-center" colSpan={5}>
            No cases found.
          </td>
        </tr>
      ) : (
        filteredCases.map(({ patientId, name, date, tests }) => {
          let allTestItems = [];
          if (Array.isArray(tests)) {
            tests.forEach((group) => {
              if (Array.isArray(group.testItems)) {
                allTestItems = allTestItems.concat(group.testItems);
              }
            });
          }
          let status = "Completed";
          if (
            !allTestItems.length ||
            allTestItems.some(
              (t) => t.status === "Pending" || t.status === "In Progress"
            )
          ) {
            status = "Pending";
          }
          const statusClass =
            status === "Completed"
              ? "bg-teal-100 text-teal-800"
              : status === "Pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-200 text-gray-800";
          return (
            <tr
              key={patientId}
              className="bg-white border-b border-[var(--border-color)] hover:bg-gray-50"
            >
              <td className="px-6 py-4 max-w-0 whitespace-nowrap relative group">
                <div className="truncate cursor-default">{patientId}</div>
                <div
                  className="absolute left-1/2 top-1/2 hidden max-w-xs -translate-x-1/2 -translate-y-full whitespace-normal rounded bg-gray-800 p-2 text-sm text-white shadow-lg group-hover:block z-50 pointer-events-none"
                  style={{ whiteSpace: "normal" }}
                >
                  {patientId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap max-w-0 relative group">
                <div className="truncate cursor-default">{name}</div>
                <div
                  className="absolute left-1/2 top-1/2 hidden max-w-xs -translate-x-1/2 -translate-y-full whitespace-normal rounded bg-gray-800 p-2 text-sm text-white shadow-lg group-hover:block z-50 pointer-events-none"
                  style={{ whiteSpace: "normal" }}
                >
                  {name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap max-w-0 relative group">
                <div className="truncate cursor-default">{date}</div>
                <div
                  className="absolute left-1/2 top-1/2 hidden max-w-xs -translate-x-1/2 -translate-y-full whitespace-normal rounded bg-gray-800 p-2 text-sm text-white shadow-lg group-hover:block z-50 pointer-events-none"
                  style={{ whiteSpace: "normal" }}
                >
                  {date}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center rounded-full h-6 px-3 text-xs font-medium ${statusClass}`}
                >
                  {status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-normal max-w-0 truncate">
                <button
                  onClick={() =>
                    navigate("/patients", {
                      state: { patientId, fromDashboard: true },
                    })
                  }
                  className="font-medium text-[var(--primary-color)] hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  View
                </button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
      </main>
    </div>
  );
};

export default Dashboard;

