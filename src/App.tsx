import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
export default function HousekeepingChecklistApp() {
  const checklistItems = [
    "ROOM - Temperature room comfortable upon arrival",
    "ROOM - AC functional and in good condition",
    "ROOM - DND / CLEAN MY ROOM Sign in good condition",
    "ROOM - Occupancy Indicator is in good condition",
    "ROOM - Entry door good condition",
    "ROOM - Entry door functional",
    "ROOM - Entry door lock functional",
    "ROOM - Entry door frame clean",
    "ROOM - Telephone works",
    "ROOM - TV works",
    "ROOM - TV programmed correctly",
    "ROOM - TV remote works",
    "ROOM - AC Remote operational",
    "ROOM - All electrical outlets functional",
    "CLOSET - Safe instructions posted",
    "ROOM - Minibar clean",
    "ROOM - Minibar functional",
    "BED  - Frame good condition",
    "BED - Bedding clean and free of stains",
    "BED - Frame good condition",
    "BED - Headboard good condition",
    "ROOM - All flooring/carpet clean",
    "ROOM - All flooring/carpet in good condition",
    "ROOM - All grouting and caulking lines clean",
    "FURNITURE - Night stands good condition",
    "FURNITURE - Trash bin clean",
    "FURNITURE - Desk chair good condition",
    "FURNITURE - Desk chair clean",
    "FURNITURE - Other chairs clean",
    "FURNITURE - Other chairs good condition",
    "FURNITURE - Desk clean",
    "FURNITURE - Desk good condition",
    "FURNITURE - Desk drawers functional",
    "CLOSET - All accessories in closet present and in good condition",
    "CLOSET - Light(s) functional",
    "CLOSET - Doors open & close properly",
    "CLOSET - Door good condition",
    "CLOSET - Interior clean",
    "ROOM - Art hung straight",
    "ROOM - Art/frame good condition",
    "ROOM - Mirrors clean",
    "ROOM - Mirrors good condition",
    "ROOM - General area lighting clean",
    "ROOM - General area lighting functional",
    "ROOM - USB charging ports work throughout room",
    "FURNITURE - Tables good condition",
    "FURNITURE - Tables clean",
    "FURNITURE - Sofa clean",
    "FURNITURE - Sofa good condition",
    "FURNITURE - Sofa good condition",
    "ROOM - Wall paint good condition",
    "ROOM - Walls damage free",
    "ROOM - Windows clean",
    "ROOM - Windows good condition",
    "ROOM - Windows function (if they can be opened)",
    "ROOM - Drapes/Sheers functional",
    "ROOM - Drapes/Sheers clean",
    "ROOM - Ceiling clean",
    "ROOM - Ceiling good condition",
    "ROOM - Ceiling paint good condition",
    "ROOM - WiFi functional throughout room",
    "ROOM - Vents clean",
    "ROOM - Vents good condition",
    "BATH - All  surfaces clean",
    "BATH - All bathroom tile and floor clean",
    "BATH - All tile and floor in good condition",
    "BATH - Shower glass streak free and clean",
    "BATH - All drains in room clean and non-obstructed",
    "BATH - Sink(s) clean",
    "BATH - All countertops and surfaces clean and streak free",
    "BATH - All lighting clean",
    "BATH - All lights functional",
    "BATH - All towels clean and in good condition",
    "BATH - All amenities refreshed and present in bathroom",
    "BATH - Trash bin clean and in good condition",
    "BATH - Toilet clean",
    "BATH - Toilet functional",
    "BATH - Water pressure functional",
    "BATH - Hair dryer functional",
  ];

  const [formData, setFormData] = useState(
    checklistItems.map((item) => ({
      item,
      status: "",
      remarks: "",
    }))
  );

  const [inspectorName, setInspectorName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [signature, setSignature] = useState("");

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const updateStatus = (index, value) => {
    const updated = [...formData];
    updated[index].status = value;
    setFormData(updated);
  };

  const updateRemarks = (index, value) => {
    const updated = [...formData];
    updated[index].remarks = value;
    setFormData(updated);
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const endDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    setSignature(canvas.toDataURL());
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const x = e.nativeEvent?.offsetX ?? e.touches?.[0]?.clientX - rect.left;
    const y = e.nativeEvent?.offsetY ?? e.touches?.[0]?.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const exportToExcel = () => {
    const exportData = formData.map((row) => ({
      "Areas of Inspection": row.item,
      Status: row.status,
      Remarks: row.remarks,
    }));

    exportData.unshift(
      {
        "Areas of Inspection": "Inspector Name",
        Status: inspectorName,
        Remarks: "",
      },
      {
        "Areas of Inspection": "Room Number",
        Status: roomNumber,
        Remarks: "",
      },
      {
        "Areas of Inspection": "Date",
        Status: date,
        Remarks: "",
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklist");

    XLSX.writeFile(
      workbook,
      `Housekeeping_Checklist_${roomNumber || "Room"}.xlsx`
    );
  };

  const handleSubmit = () => {
    alert("Checklist submitted successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Clarks Inn, Housekeeping Checklist
          </h1>
          <p className="text-sm text-gray-500"> Inspection App</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Inspector Name"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>

        <div className="space-y-4">
          {formData.map((item, index) => (
            <div key={index} className="border rounded-2xl p-3 bg-gray-50">
              <p className="font-medium text-sm mb-3">{item.item}</p>

              <div className="flex gap-2 mb-3">
                {["YES", "NO", "NA"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateStatus(index, option)}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold border ${
                      item.status === option
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Remarks"
                value={item.remarks}
                onChange={(e) => updateRemarks(index, e.target.value)}
                className="w-full border rounded-xl p-2 text-sm"
                rows={2}
              />
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Signature</h2>

          <canvas
            ref={canvasRef}
            width={320}
            height={150}
            className="border rounded-xl w-full bg-white touch-none"
            style={{ touchAction: "none" }}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onTouchStart={(e) => {
              e.preventDefault();
              startDrawing(e);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              endDrawing();
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              draw(e);
            }}
          />

          <button
            onClick={clearSignature}
            className="mt-2 text-sm text-red-600"
          >
            Clear Signature
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white py-3 rounded-2xl font-semibold"
          >
            Submit
          </button>

          <button
            onClick={exportToExcel}
            className="flex-1 border border-black py-3 rounded-2xl font-semibold"
          >
            Download Excel
          </button>
        </div>
        <p className="text-center text-xs text-blue-400 mt-4">
          Developed by majumders.org
        </p>
      </div>
    </div>
  );
}
