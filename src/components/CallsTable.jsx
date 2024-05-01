import React, { useContext, useState } from "react";
import { Modal, Button, Table, Form, Row, Col } from "react-bootstrap";
import "../App.css";
import AppContext from "../context/AppContext";

const CallsTable = ({ calls }) => {
  const {
    fetchCallDetails,
    specificCallData,
    fetchCalls,
    accessToken,
    addNote,
  } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const handleRowClick = async (callId) => {
    await fetchCallDetails(
      callId,
      accessToken || localStorage.getItem("access-token")
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNoteContent(""); // Clear the note content when closing the modal
  };

  const handleSaveNote = async () => {
    if (noteContent.trim()) {
      // Assuming `addNote` is a method in your context to add a note to a call
      await addNote(specificCallData?.id, noteContent);
      setNoteContent("");
      handleCloseModal();
      await fetchCalls(); // Refresh calls to show any updates
    }
  };

  // Utility to convert strings to Title Case
  function toTitleCase(str) {
    if (typeof str !== "string" || !str) return ""; // Check if str is not a string or is empty
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <div className="table-container">
      <Table hover className="full-height-table" responsive>
        <thead style={{ backgroundColor: "#F4F4F9" }}>
          <tr>
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
            <tr key={call.id} onClick={() => handleRowClick(call.id)}>
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
                {Math.floor(call.duration / 60)} minutes {call.duration % 60}{" "}
                seconds
              </td>
              <td>{call.from}</td>
              <td>{call.to}</td>
              <td>{call.via}</td>
              <td>{new Date(call.created_at).toLocaleDateString()}</td>
              <td>
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRowClick(call.id)}
                >
                  Add Note
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for showing specific call details and adding notes */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Form>
            <Row className="form-row">
              <Col>
                <Modal.Title>Add Notes</Modal.Title>
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "#ABA7FB",
              }}
            >
              <div style={{ marginRight: "10px" }}>Call ID </div>
              <div>{specificCallData?.id}</div>
            </div>
          </Form>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>Call Type:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="no-border"
                  style={{ color: "#ABA7FB" }}
                  type="text"
                  readOnly
                  value={toTitleCase(specificCallData?.call_type) || ""}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>Duration:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="no-border"
                  type="text"
                  readOnly
                  value={`${Math.floor(
                    specificCallData?.duration / 60
                  )} minutes ${specificCallData?.duration % 60} seconds`}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>From:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="no-border"
                  type="text"
                  readOnly
                  value={specificCallData?.from || ""}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>To:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="no-border"
                  type="text"
                  readOnly
                  value={specificCallData?.to || ""}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>Via:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="no-border"
                  type="text"
                  readOnly
                  value={specificCallData?.via || ""}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3}>
                <Form.Label>Notes:</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col sm={9} style={{ width: "100%", margin: "0" }}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ width: "100%", margin: "0px 2px" }}>
          <Button
            // variant="primary"
            style={{ background: "#ABA7FB", width: "100%" }}
            onClick={handleSaveNote}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CallsTable;
