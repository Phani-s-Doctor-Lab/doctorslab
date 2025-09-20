import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import YesNoSwitch from "../components/YesNoSwitch";

export default function EditTestPage() {
  const { id } = useParams(); // testId from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    category: "",
    price: "",
    turnaroundTime: "",
    specimenType: "",
    methodology: "",
    cptCode: "",
    loincCode: "",
    instructions: "",
    status: "",
  });

  const [parameters, setParameters] = useState([
    { name: "", unit: "", referenceRanges: [] },
  ]);

  const [loading, setLoading] = useState(true);

  // Fetch test details
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`http://localhost:5000/tests/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            testName: data.testName,
            description: data.description,
            category: data.category,
            price: data.price,
            turnaroundTime: data.turnaroundTime,
            specimenType: data.specimenType,
            methodology: data.methodology,
            cptCode: data.cptCode,
            loincCode: data.loincCode,
            instructions: data.instructions || "",
            status: data.status,
          });
          setParameters(data.parameters || []);
        } else {
          alert("Failed to load test details");
        }
      } catch (error) {
        console.error("Error loading test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update parameter values
  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  // Add parameter
  const addParameter = () => {
    setParameters([...parameters, { name: "", unit: "", referenceRanges: [] }]);
  };

  // Add reference range inside a parameter
  const addReferenceRange = (index) => {
    const updated = [...parameters];
    if (!updated[index].referenceRanges) {
      updated[index].referenceRanges = [];
    }
    updated[index].referenceRanges.push({ group: "", range: "" });
    setParameters(updated);
  };

  // Submit edited test
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      parameters,
    };

    try {
      const response = await fetch(`http://localhost:5000/tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Test updated successfully!");
        navigate("/tests");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Something went wrong while updating the test.");
    }
  };

  if (loading) {
    return <div className="p-10">Loading test details...</div>;
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
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-color)] px-10 py-3 shadow-sm">
        <h1 className="text-xl font-bold">Edit Test</h1>
      </header>

      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-40 py-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Edit {formData.testName}</h1>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium">Test Name</label>
                <input
                  type="text"
                  value={formData.testName}
                  onChange={(e) => handleChange("testName", e.target.value)}
                  className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
                />
              </div>

              {/* Status */}
            <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Status</label>
            <YesNoSwitch
                checked={formData.status === "active"}
                onChange={(newChecked) =>
                handleChange("status", newChecked ? "active" : "inactive")
                }
            />
            </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="form-select w-full rounded-full border-primary-200 px-4 py-3 text-sm"
                  >
                    <option>Hematology</option>
                    <option>Biochemistry</option>
                    <option>Microbiology</option>
                    <option>Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {/* Parameters */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                {parameters.map((param, index) => (
                  <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        placeholder="Parameter Name"
                        value={param.name}
                        onChange={(e) =>
                          handleParameterChange(index, "name", e.target.value)
                        }
                        className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Units"
                        value={param.unit}
                        onChange={(e) =>
                          handleParameterChange(index, "unit", e.target.value)
                        }
                        className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
                      />
                    </div>

                    <h4 className="text-sm font-semibold mb-2">
                      Reference Ranges
                    </h4>
                    {param.referenceRanges?.map((range, rIndex) => (
                      <div key={rIndex} className="grid grid-cols-2 gap-4 mb-2">
                        <input
                          type="text"
                          placeholder="Group (e.g., Adults)"
                          value={range.group}
                          onChange={(e) => {
                            const updated = [...parameters];
                            updated[index].referenceRanges[rIndex].group =
                              e.target.value;
                            setParameters(updated);
                          }}
                          className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Range (e.g., 11–35)"
                          value={range.range}
                          onChange={(e) => {
                            const updated = [...parameters];
                            updated[index].referenceRanges[rIndex].range =
                              e.target.value;
                            setParameters(updated);
                          }}
                          className="form-input rounded-full border-primary-200 px-4 py-2 text-sm"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addReferenceRange(index)}
                      className="mt-2 text-xs text-primary-700 hover:underline"
                    >
                      + Add Reference Range
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addParameter}
                  className="mt-4 flex items-center gap-2 rounded-full border border-primary-300 px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
                >
                  + Add Parameter
                </button>
              </div>

              {/* Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-900 pb-1.5">
                    CPT Code
                  </label>
                  <input
                    type="text"
                    value={formData.cptCode}
                    onChange={(e) => handleChange("cptCode", e.target.value)}
                    placeholder="Enter CPT code"
                    className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900 pb-1.5">
                    LOINC Code
                  </label>
                  <input
                    type="text"
                    value={formData.loincCode}
                    onChange={(e) => handleChange("loincCode", e.target.value)}
                    placeholder="Enter LOINC code"
                    className="form-input w-full rounded-full border-primary-200 px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-primary-900 pb-1.5">
                  Instructions
                </label>
                <textarea
                  rows="3"
                  value={formData.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  placeholder="e.g., Patient should fast for 8 hours before test"
                  className="form-textarea w-full rounded-xl border-primary-200 p-4 text-sm"
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/tests")}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--brand-color)] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
