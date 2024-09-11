import React, { useState } from "react";
import { Button, Upload, Image } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs
import "./App.css";

const App = () => {
  const [applicants, setApplicants] = useState([
    {
      id: uuidv4(), // Generate unique ID
      name: "Applicant 1",
      documents: [
        {
          id: uuidv4(), // Generate unique ID
          images: [],
        },
      ],
    },
  ]);
  const [activeApplicant, setActiveApplicant] = useState(0);
  const [activeDocument, setActiveDocument] = useState(0);

  // Add new applicant
  const addApplicant = () => {
    const newApplicant = {
      id: uuidv4(), // Generate unique ID
      name: `Applicant ${applicants.length + 1}`,
      documents: [
        {
          id: uuidv4(), // Generate unique ID
          images: [],
        },
      ],
    };
    setApplicants([...applicants, newApplicant]);
    setActiveApplicant(applicants.length);
    setActiveDocument(0);
  };

  // Remove applicant
  const removeApplicant = (id) => {
    const updatedApplicants = applicants.filter(
      (applicant) => applicant.id !== id
    );
    setApplicants(updatedApplicants);

    // Adjust activeApplicant and activeDocument
    if (activeApplicant >= updatedApplicants.length) {
      setActiveApplicant(updatedApplicants.length - 1);
      setActiveDocument(0);
    }
  };

  // Add new document
  const addDocument = () => {
    if (applicants[activeApplicant]) {
      const updatedApplicants = [...applicants];
      const applicantDocs = updatedApplicants[activeApplicant].documents;
      applicantDocs.push({
        id: uuidv4(), // Generate unique ID
        images: [],
      });
      setApplicants(updatedApplicants);
    }
  };

  // Remove document
  const removeDocument = (id) => {
    if (
      applicants[activeApplicant] &&
      applicants[activeApplicant].documents.length === 1
    )
      return; // Prevent removing the last document

    const updatedApplicants = [...applicants];
    if (applicants[activeApplicant]) {
      updatedApplicants[activeApplicant].documents = updatedApplicants[
        activeApplicant
      ].documents.filter((doc) => doc.id !== id);
      setApplicants(updatedApplicants);
      if (
        activeDocument >= updatedApplicants[activeApplicant].documents.length
      ) {
        setActiveDocument(0);
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    if (
      applicants[activeApplicant] &&
      applicants[activeApplicant].documents[activeDocument]
    ) {
      const updatedApplicants = [...applicants];
      updatedApplicants[activeApplicant].documents[activeDocument].images = [];
      setApplicants(updatedApplicants);
    }
  };

  // Handle image upload
  const handleUpload = ({ file }, docIndex) => {
    if (
      applicants[activeApplicant] &&
      applicants[activeApplicant].documents[docIndex]
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedApplicants = [...applicants];
        const docImages =
          updatedApplicants[activeApplicant].documents[docIndex].images;
        docImages[0] = reader.result; // Replace the first image
        setApplicants(updatedApplicants);
      };
      reader.readAsDataURL(file);
      return false; // Prevent default upload behavior
    }
    return false;
  };

  const uploadProps = {
    customRequest: (options) => handleUpload(options, activeDocument),
    showUploadList: false, // Hide default upload list
  };

  // Handle next and previous navigation
  const handleNext = () => {
    if (applicants[activeApplicant]) {
      const currentApplicant = applicants[activeApplicant];
      if (activeDocument < currentApplicant.documents.length - 1) {
        setActiveDocument(activeDocument + 1);
      } else if (activeApplicant < applicants.length - 1) {
        setActiveApplicant(activeApplicant + 1);
        setActiveDocument(0);
      }
    }
  };

  const handlePrevious = () => {
    if (activeDocument > 0) {
      setActiveDocument(activeDocument - 1);
    } else if (activeApplicant > 0) {
      setActiveApplicant(activeApplicant - 1);
      const previousApplicant = applicants[activeApplicant - 1];
      setActiveDocument(previousApplicant.documents.length - 1);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h2>Applicant Management</h2>
      </header>

      <div className="grid-layout">
        {/* Applicant Tabs */}
        <div className="applicant-tabs">
          <h3>Applicants</h3>
          <div className="applicant-row">
            {applicants.map((applicant, index) => (
              <div
                key={applicant.id}
                className={`applicant-tab ${
                  activeApplicant === index ? "active" : ""
                }`}
                onClick={() => {
                  setActiveApplicant(index);
                  setActiveDocument(0); // Reset to first document when switching applicant
                }}
              >
                {applicant.name}
                <Button
                  type="link"
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    removeApplicant(applicant.id);
                  }}
                  icon={<DeleteOutlined />}
                  disabled={applicants.length === 1} // Disable button if only one applicant remains
                />
              </div>
            ))}
            <Button
              type="dashed"
              onClick={addApplicant}
              icon={<PlusOutlined />}
            >
              Add Applicant
            </Button>
          </div>
        </div>

        {/* Sidebar for Documents */}
        <div className="sidebar">
          <h3>Documents</h3>
          {applicants[activeApplicant]?.documents?.map((doc, index) => (
            <div
              key={doc.id}
              className={`document-tab ${
                activeDocument === index ? "active" : ""
              }`}
              onClick={() => setActiveDocument(index)}
            >
              Document {index + 1}
              <Button
                type="link"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  removeDocument(doc.id);
                }}
                icon={<DeleteOutlined />}
                disabled={applicants[activeApplicant]?.documents.length === 1} // Disable if only one document remains
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={addDocument}
            style={{ marginTop: 10 }}
            icon={<PlusOutlined />}
          >
            Add Document
          </Button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <h3>
            {applicants[activeApplicant]?.name} - Document{" "}
            {applicants[activeApplicant]?.documents[activeDocument]?.name}
          </h3>

          <div className="upload-section">
            <h4>Upload Image</h4>
            <Upload {...uploadProps}>
              <div className="upload-button">
                {applicants[activeApplicant]?.documents[activeDocument]?.images
                  .length > 0 ? (
                  <>
                    <Image
                      width={100}
                      src={
                        applicants[activeApplicant].documents[activeDocument]
                          .images[0]
                      }
                      preview={false}
                      style={{ marginBottom: 10 }}
                    />
                    <Button
                      type="link"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      icon={<DeleteOutlined />}
                      disabled={
                        applicants[activeApplicant]?.documents[activeDocument]
                          ?.images.length === 0
                      } // Disable if no image is present
                    />
                  </>
                ) : (
                  <>
                    <PlusOutlined style={{ fontSize: 24 }} />
                    <div>Upload</div>
                  </>
                )}
              </div>
            </Upload>
          </div>
          <div className="navigation-buttons">
            <Button
              type="primary"
              onClick={handlePrevious}
              disabled={activeApplicant === 0 && activeDocument === 0}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>

            <Button
              type="primary"
              onClick={handleNext}
              disabled={
                activeApplicant === applicants.length - 1 &&
                activeDocument ===
                  applicants[activeApplicant]?.documents.length - 1
              }
              icon={<ArrowRightOutlined />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
