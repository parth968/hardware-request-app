import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  getRequests,
  updateRequest,
  assignHardware,
} from "../slice/requestSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Navbar from "../components/Navbar";
import QrScanner from "react-qr-scanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.requests);
  const [scanning, setScanning] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [scannerDialogVisible, setScannerDialogVisible] = useState(false);

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);

  useEffect(() => {
    // Filter requests based on search term and status
    setFilteredRequests(
      requests
        .filter(
          (request) =>
            (request.status === "pending" || request.status === "rejected") &&
            (request.employeeId?.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              request.hardwareId?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              request.description?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => (a.status === "pending" ? -1 : 1))
    );
  }, [searchTerm, requests]);

  const handleAccept = (requestId) => {
    setCurrentRequestId(requestId);
    setScannerDialogVisible(true);
    setScanning(true);
  };

  const handleReject = (requestId) => {
    dispatch(updateRequest({ id: requestId, status: "rejected" }));
  };

  const handleScan = (data) => {
    if (data) {
      dispatch(
        assignHardware({ requestId: currentRequestId, qrCode: data.text })
      )
        .unwrap()
        .then(() => {
          dispatch(updateRequest({ id: currentRequestId, status: "accepted" }));
          setScanning(false);
          setScannerDialogVisible(false);
          setCurrentRequestId(null);
        })
        .catch((error) => {
          console.error("Error assigning hardware:", error);
          setScanning(false);
          setScannerDialogVisible(false);
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const statusStyle = (status) => {
    return {
      color:
        status === "accepted"
          ? "green"
          : status === "rejected"
          ? "red"
          : "black",
    };
  };

  const renderEndDate = (rowData) => {
    if (rowData.duration === "temporary" && rowData.endDate) {
      const date = new Date(rowData.endDate);
      return date.toLocaleDateString("en-GB"); // 'en-GB' formats date as dd-mm-yyyy
    }
    return "N/A";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Requests</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <span
            className="p-input-icon-left"
            style={{
              backgroundColor: "#f7f7f7",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requests..."
              style={{ width: "100%" }}
            />
          </span>
        </div>

        {/* Data Table */}
        <DataTable
          value={filteredRequests}
          paginator
          rows={10}
          sortMode="single"
          style={{ width: "100%" }}
        >
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
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <span style={statusStyle(rowData.status)}>{rowData.status}</span>
            )}
            sortable
          />
          <Column
            header="Actions"
            body={(rowData) => {
              if (rowData.status === "rejected") {
                return <></>;
              } else {
                return (
                  <>
                    <Button
                      label="Assign"
                      // icon={<FontAwesomeIcon icon={faCheck} />}
                      onClick={() => handleAccept(rowData._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded shadow-md transition duration-300 mr-2"
                    />
                    <Button
                      label="Reject"
                      // icon={<FontAwesomeIcon icon={faTimes} />}
                      onClick={() => handleReject(rowData._id)}
                      className="bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded shadow-md transition duration-300"
                    />
                  </>
                );
              }
            }}
          />
        </DataTable>

        {/* QR Scanner Popup */}
        <Dialog
          visible={scannerDialogVisible}
          onHide={() => setScannerDialogVisible(false)}
          header="Scan QR Code"
          style={{ width: "50vw" }}
        >
          {scanning && (
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
      </div>
    </>
  );
};

export default AdminDashboard;