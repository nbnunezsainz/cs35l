import React, { useState, useEffect } from 'react';
import PDFViewer from './PDFViewer.js'; // Adjust this if the file path is different
import AuthNavbar from './AuthenticatedNavBar';

const ResumeReviewer = () => {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/v1/user/GetAllResumes')
            .then(response => response.json())
            .then(data => {
                setResumes(data.resumes);
            })
            .catch(error => console.error('Error fetching resumes:', error));
    }, []);

    return (
        <>
            <AuthNavbar />
            <div style={{ paddingTop: "80px" }}>
                <h1>Resumes</h1>
                <div>
                    {resumes.length > 0 ? (
                        resumes.map((resume, index) => (
                            <div key={index}>
                                <h2>User: {resume.userID}</h2>
                                <PDFViewer resumeUrl={resume.URL} />
                            </div>
                        ))
                    ) : (
                        <p>Loading resumes or no resumes available...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResumeReviewer;


