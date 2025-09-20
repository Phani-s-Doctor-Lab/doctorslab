import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TIME_RANGES = ["Day", "Week", "Month", "Year"];
const TOP_TESTS_OPTIONS = ["Top 5", "View All"];
const PAYMENT_TYPES = ["All", "UPI", "Cash"];

function ReportsDashboard() {
  // State for filters
  const [testTopFilter, setTestTopFilter] = useState(TOP_TESTS_OPTIONS[0]);
  const [testTimeRange, setTestTimeRange] = useState("Month");
  const [revenueTimeRange, setRevenueTimeRange] = useState("Month");
  const [paymentType, setPaymentType] = useState("All");

  // State for dynamic data
  const [frequentTests, setFrequentTests] = useState([]);
  const [change, setChange] = useState(0);
  const [grandTotalTests, setGrandTotalTests] = useState(0);
  const [incomeStats, setIncomeStats] = useState({ amount: 0, change: 0 });
  const [expenseStats, setExpenseStats] = useState({ amount: 0, change: 0 });
  const [netCashFlow, setNetCashFlow] = useState({ amount: 0, change: 0 });
  const [expenses, setExpenses] = useState([]);
  const [otherExpenses, setOtherExpenses] = useState([]);
  const [incomeTrendData, setIncomeTrendData] = useState([]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: "",
    category: "",
    description: "",
    amount: ""
  });

  // Convert time range labels to backend expected params if needed
  function mapTimeRangeToParam(range) {
    switch (range) {
      case "Day": return "1d";
      case "Week": return "1w";
      case "Month": return "1m";
      case "Year": return "1y";
      default: return "1m";
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch frequent tests
        const testRangeParam = mapTimeRangeToParam(testTimeRange);
        const topParam = testTopFilter === "Top 5" ? 5 : 1000; // large number for "View All"
        const testsResp = await fetch(
          `http://localhost:5000/testsFrequency?range=${testRangeParam}&top=${topParam}`
        );
        const testsData = await testsResp.json();
        setFrequentTests(testsData.tests || []);
        setChange(testsData.change || 0);

        // Fetch Grand Total Tests (all time)
        const grandTestsResp = await fetch("http://localhost:5000/testsTotal");
        const grandTestsData = await grandTestsResp.json();
        setGrandTotalTests(grandTestsData.total || 0);

        // Fetch financial stats
        const revRangeParam = mapTimeRangeToParam(revenueTimeRange);
        const paymentParam = paymentType;

        const incomeResp = await fetch(
          `http://localhost:5000/revenue?range=${revRangeParam}&paymentType=${paymentParam}`
        );
        const incomeData = await incomeResp.json();

        const expenseResp = await fetch(
          `http://localhost:5000/expenses?range=${revRangeParam}`
        );
        const expenseData = await expenseResp.json();

        // Set financial stats including cash flow
        setIncomeStats({
          amount: incomeData.amount || 0,
          change: incomeData.change || 0
        });
        setExpenseStats({
          amount: expenseData.amount || 0,
          change: expenseData.change || 0
        });

        const currentNet = (incomeData.amount || 0) - (expenseData.amount || 0);
        const prevIncome = (incomeData.amount || 0) / (1 + ((incomeData.change || 0) / 100));
        const prevExpense = (expenseData.amount || 0) / (1 + ((expenseData.change || 0) / 100));
        const previousNet = prevIncome - prevExpense;

        const netChange = previousNet
          ? ((currentNet - previousNet) / Math.abs(previousNet)) * 100
          : 0;

        setNetCashFlow({
          amount: currentNet,
          change: netChange
        });

        // Fetch expenses table
        const expensesResp = await fetch(
          `http://localhost:5000/expensesList?range=${revRangeParam}`
        );
        const expensesData = await expensesResp.json();
        console.log(expensesData);
        setExpenses(expensesData.expenses || []);

        const otherExpensesResp = await fetch(
          `http://localhost:5000/getExpenses?range=${revRangeParam}`
        );
        const otherExpensesData = await otherExpensesResp.json();
        console.log(otherExpensesData);
        setOtherExpenses(otherExpensesData.expenses || []);

      } catch (error) {
        console.error("Failed to fetch report data", error);
      }
    }
    fetchData();
  }, [testTopFilter, testTimeRange, revenueTimeRange, paymentType]);

  useEffect(() => {
    async function fetchTrend() {
      try {
        const res = await fetch("http://localhost:5000/income/trend");
        const data = await res.json();
        setIncomeTrendData(data);
      } catch (err) {
        console.error("Error fetching income trend data:", err);
      }
    }

    fetchTrend();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/addExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseForm),
      });

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }

      const newExpense = await res.json();

      // Update state: prepend the new expense
      setExpenses((prev) => [newExpense, ...prev]);

      // Reset form
      setExpenseForm({
        date: "",
        category: "",
        description: "",
        amount: "",
      });

      // Close modal
      setShowExpenseModal(false);
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Something went wrong while adding the expense");
    }
  };

  const totalCurrentCount = frequentTests.reduce((sum, t) => sum + (t.count || 0), 0);
  const totalPreviousCount = frequentTests.reduce((sum, t) => sum + (t.previousCount || 0), 0);
  const totalChange = totalPreviousCount > 0
    ? ((totalCurrentCount - totalPreviousCount) / totalPreviousCount) * 100
    : null;

  const incomeTrendDataWithChange = incomeTrendData.map((entry, idx, arr) => {
    if (idx === 0) return { ...entry, change: null };
    const prev = arr[idx - 1].amount || 0;
    const change = prev ? ((entry.amount - prev) / prev) * 100 : null;
    return { ...entry, change };
  });

  // combine both expenses and other expenses
  const totalExpenses = [...expenses, ...otherExpenses];

  console.log(totalExpenses);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-white shadow z-10 flex items-center justify-between p-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {/* SVG omitted for brevity */}
            Pathology Stock Control
          </h1>
        </header>

        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <main className="flex-1 bg-[#f0f4f7] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
              {/* Lab Test Frequency Section */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#1e293b]">
                  Lab Test Frequency Analysis
                </h2>

                {/* Filters for test stats */}
                <div className="flex justify-between mb-4 gap-4">
                  {/* Top Tests Select */}
                  <select
                    value={testTopFilter}
                    onChange={e => setTestTopFilter(e.target.value)}
                    className="px-3 py-1 rounded border"
                  >
                    {TOP_TESTS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  {/* Time Range Select */}
                  <select
                    value={testTimeRange}
                    onChange={e => setTestTimeRange(e.target.value)}
                    className="px-3 py-1 rounded border"
                  >
                    {TIME_RANGES.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Tests Frequency Cards */}
                <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col rounded-lg bg-[#f0f4f7] p-4">
                      <p className="text-sm font-medium text-[#64748b]">Total Tests (All Time)</p>
                      <p className="mt-1 text-3xl font-bold text-[#1e293b]">
                        {grandTotalTests}
                      </p>
                    </div>
                    <div className="flex flex-col rounded-lg bg-[#f0f4f7] p-4">
                      <p className="text-sm font-medium text-[#64748b]">Total Tests</p>
                      <p className="mt-1 text-3xl font-bold text-[#1e293b]">
                        {totalCurrentCount.toLocaleString()}
                      </p>
                      {/* You can calculate % change dynamically if backend provides */}
                      <div className="mt-2 flex items-center gap-1">
                        <p className="text-sm font-medium text-[#16a34a]">{typeof change === 'number' && !isNaN(change) ? change.toFixed(2) : '--'}%</p>
                        <p className="text-sm text-[#64748b]">vs last month</p>
                      </div>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="mb-4 font-semibold text-[#1e293b]">
                        {testTopFilter === "Top 5" ? "Top 5 Most Frequent Tests" : "Most Frequent Tests"}
                      </p>
                      <div className="space-y-4">
                        {frequentTests.map((test) => (
                          <div
                            key={test.name}
                            className="grid grid-cols-[100px_1fr_50px] items-center gap-4"
                          >
                            <p className="truncate text-sm font-medium text-[#64748b]">{test.name}</p>
                            <div className="h-2.5 w-full rounded-full bg-[#f0f4f7]">
                              <div
                                className="h-2.5 rounded-full bg-[#b2d1e5]"
                                style={{ width: `${test.percent}%` }}
                              ></div>
                            </div>
                            <p className="text-right text-sm font-medium text-[#1e293b]">{test.count.toLocaleString()}
                              {typeof test.change === "number" && test.change !== null ? (
                                <span
                                  className={
                                    test.change >= 0
                                      ? "text-green-600 ml-2"
                                      : "text-red-600 ml-2"
                                  }
                                >
                                  ({test.change >= 0 ? "+" : ""}
                                  {test.change.toFixed(1)}%)
                                </span>
                              ) : null}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Financial Tracking Section */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#1e293b]">
                  Financial Tracking
                </h2>

                {/* Filters for revenue stats */}
                <div className="flex flex-wrap gap-4 mb-4 max-w-md">
                  {/* Payment Type Radio */}
                  <div className="flex items-center gap-2">
                    {PAYMENT_TYPES.map(type => (
                      <label key={type} className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value={type}
                          checked={paymentType === type}
                          onChange={() => setPaymentType(type)}
                          className="form-radio"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>

                  {/* Revenue Time Range */}
                  <select
                    value={revenueTimeRange}
                    onChange={e => setRevenueTimeRange(e.target.value)}
                    className="px-3 py-1 rounded border"
                  >
                    {TIME_RANGES.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-[#64748b]">Income</p>
                    <p className="mt-2 text-3xl font-bold text-[#1e293b]">₹{incomeStats.amount.toLocaleString()}</p>
                    <p className="mt-1 text-sm font-medium text-[#16a34a]">{incomeStats.change.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-[#64748b]">Expenses</p>
                    <p className="mt-2 text-3xl font-bold text-[#1e293b]">₹{expenseStats.amount.toLocaleString()}</p>
                    <p className="mt-1 text-sm font-medium text-[#dc2626]">{expenseStats.change.toFixed(1)}%</p>
                  </div>
                  {/* Net Cash Flow */}
                  {paymentType === "All" && (
                    <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                      <p className="text-sm font-medium text-[#64748b]">Net Cash Flow</p>
                      <p className="mt-2 text-3xl font-bold text-[#1e293b]">₹{netCashFlow.amount.toLocaleString()}</p>
                      <p className={`mt-1 text-sm font-medium ${netCashFlow.change >=0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                        {netCashFlow.change.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Expense Management Section */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#1e293b] flex justify-between">
                  <span className="text-[#1e293b]">Expense Management</span>
                  <button
                    className="mb-4 px-4 py-2 text-sm bg-blue-600 text-white rounded"
                    onClick={() => setShowExpenseModal(true)}
                  >
                    Add Expense
                  </button>
                </h2>
                {showExpenseModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
                      <h3 className="text-lg font-bold mb-4">Add Expense</h3>
                      <form
                        onSubmit={handleExpenseSubmit}
                        className="space-y-4"
                      >
                        <input
                          type="date"
                          className="w-full border rounded px-3 py-2"
                          value={expenseForm.date}
                          onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Category"
                          value={expenseForm.category}
                          onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Description"
                          value={expenseForm.description}
                          onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                          required
                        />
                        <input
                          type="number"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Amount"
                          value={expenseForm.amount}
                          onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          required
                          min="0"
                        />
                        <div className="flex gap-2 justify-end mt-6">
                          <button
                            type="button"
                            onClick={() => setShowExpenseModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <div className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#e2e8f0]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e8f0] bg-white">
                        {totalExpenses.map((row, i) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-[#1e293b]">{row.date}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-[#1e293b]">{row.category}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748b]">{row.description}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-[#1e293b]">{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Monthly Trend Visualization */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#1e293b]">
                  Monthly Trend Visualization
                </h2>
                <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#64748b]">Monthly Income Trend</p>
                    <p className="mt-1 text-3xl font-bold text-[#1e293b]">₹{incomeTrendData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={incomeTrendDataWithChange} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(tick) => `${tick}%`} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === "amount") return [`₹${value.toLocaleString()}`, "Income"];
                          else if (name === "change") return [props.payload.change ? `${props.payload.change.toFixed(2)}%` : "N/A", "Change"];
                          return [value, name];
                        }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="change" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-4 flex justify-between border-t border-[#e2e8f0] pt-2">
                        {incomeTrendData.map((d) => (
                        <p key={d.month} className="text-xs font-medium text-[#64748b]">
                            {d.month.split("-")[1]}
                        </p>
                        ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
export default ReportsDashboard;
