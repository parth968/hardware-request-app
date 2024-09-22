import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, detachHardware } from "../slice/requestSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Navbar from "../components/Navbar";
import QrScanner from "react-qr-scanner";

const ManageRequest = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.requests);
  const [searchTerm, setSearchTerm] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);

  useEffect(() => {
    dispatch(getRequests()); // Fetch requests on component mount
  }, [dispatch]);

  // Filter requests based on the search term and status
  const filteredRequests = requests.filter((request) =>
    request.status === "accepted" &&
    request.employeeId?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term state
  };

  const handleDetach = (requestId) => {
    setCurrentRequestId(requestId);
    setQrVisible(true); // Show QR scanner modal when detach is clicked
  };

  const handleScan = (data) => {
    if (data) {
      dispatch(detachHardware({ requestId: currentRequestId, qrCode: data.text }))
        .unwrap()
        .then(() => {
          setQrVisible(false); // Hide the QR scanner after a successful scan
        })
        .catch((err) => {
          console.error("Error detaching hardware:", err);
          setQrVisible(false); // Close scanner on error
        });
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  const renderEndDate = (rowData) => {
    if (rowData.duration === "temporary" && rowData.endDate) {
      const date = new Date(rowData.endDate);
      return date.toLocaleDateString("en-GB"); // 'en-GB' formats date as dd-mm-yyyy
    }
    return "N/A";
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        label="Detach"
        onClick={() => handleDetach(rowData._id)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
      />
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Manage Requests</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <span className="p-input-icon-left" style={{ width: "100%" }}>
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by employee email"
              style={{
                width: "100%",
                backgroundColor: "#f7f7f7",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </span>
        </div>

        {/* DataTable for requests */}
        <DataTable value={filteredRequests} loading={loading} paginator rows={10}>
          <Column field="employeeId.email" header="Employee Email" sortable />
          <Column field="hardwareId.name" header="Item Requested" sortable />
          <Column field="description" header="Description" sortable />
          <Column field="duration" header="Duration" sortable />
          <Column
            field="endDate"
            header="End Date"
            body={renderEndDate}
            sortable
          />
          <Column field="status" header="Status" sortable />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>

        {/* QR Scanner Modal */}
        <Dialog
          visible={qrVisible}
          onHide={() => setQrVisible(false)}
          header="Scan QR Code"
          style={{ width: "50vw" }}
        >
          {qrVisible && (
            <div className="flex flex-col items-center justify-center">
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
              <p>Scanning... Please scan the QR code.</p>
            </div>
          )}
        </Dialog>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default ManageRequest;