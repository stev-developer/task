import React from "react";

const ApplicantContent = ({ applicant }) => {
  return (
    <div className="tab-content">
      <h3>{applicant.name}</h3>
      <p>Details for {applicant.name} go here...</p>
    </div>
  );
};

export default ApplicantContent;
