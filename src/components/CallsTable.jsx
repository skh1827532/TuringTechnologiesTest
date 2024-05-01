import React from "react";
import { Table, Button } from "react-bootstrap";
import "../App.css";

const CallsTable = ({ calls }) => {
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Answered":
        return "success";
      case "Missed":
        return "danger";
      case "Voicemail":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="table-container">
      <Table hover className="full-height-table" responsive>
        <thead style={{ backgroundColor: "#F4F4F9" }}>
          <tr style={{ backgroundColor: "#F4F4F9" }}>
            <th>Call Type</th>
            <th>Direction</th>
            <th>Duration</th>
            <th>From</th>
            <th>To</th>
            <th>Via</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id}>
              <td
                className={`text-primary ${
                  call.call_type === "answered" ? "text-info" : ""
                } ${call.call_type === "missed" ? "text-danger" : ""}`}
              >
                {call.call_type === "voicemail"
                  ? "Voice Mail"
                  : toTitleCase(call.call_type)}
              </td>
              <td className="text-primary">{toTitleCase(call.direction)}</td>
              <td>
                <div>
                  <div>
                    {Math.floor(call.duration / 60)} minutes{" "}
                    {call.duration % 60} seconds
                  </div>
                  <div className="text-primary">({call.duration} seconds)</div>
                </div>
              </td>
              <td>{call.from}</td>
              <td>{call.to}</td>
              <td>{call.via}</td>
              <td>{new Date(call.created_at).toLocaleDateString()}</td>
              <td className={`text-${getStatusVariant(call.status)}`}>
                {call.is_archived ? (
                  <Button
                    className="text-black"
                    style={{
                      backgroundColor: "#EEEEEE",
                      border: "none",
                    }}
                    size="sm"
                  >
                    Unarchive
                  </Button>
                ) : (
                  <Button
                    className="text-info"
                    size="sm"
                    style={{
                      backgroundColor: "#EDFBFA",
                      border: "none",
                    }}
                  >
                    Archived
                  </Button>
                )}
              </td>
              <td>
                <Button variant="primary" size="sm">
                  Add Note
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CallsTable;
