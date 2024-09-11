import React from "react";
import { Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ApplicantTabs.css";

const ApplicantTabs = ({
  applicants,
  activeTab,
  onTabClick,
  addApplicant,
  removeApplicant,
}) => {
  return (
    <div>
      {/* Tabs Navigation */}
      <div className="tabs">
        {applicants.map((applicant, index) => (
          <div
            key={applicant.id}
            className={`tab-item ${activeTab === index ? "active" : ""}`}
          >
            <span onClick={() => onTabClick(index)}>{applicant.name}</span>
            <Button
              type="link"
              danger
              onClick={() => removeApplicant(index)}
              className="remove-btn"
              icon={<DeleteOutlined />} // Add remove icon
            ></Button>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={addApplicant}
          style={{ marginTop: 20 }}
          icon={<PlusOutlined />} // Add plus icon
        >
          Add Applicant
        </Button>
      </div>

      {/* Add Applicant Button */}
    </div>
  );
};

export default ApplicantTabs;
