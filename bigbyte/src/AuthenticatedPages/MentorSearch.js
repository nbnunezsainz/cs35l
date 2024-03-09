// change to use mentor searching, currently same as internship searching

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AuthNavbar from './AuthenticatedNavBar';
import auth from "../fb.js";

const MentorSearch = () => {
  const [Mentors, setMentors] = useState([]); // State to store internship data
  const [loading, setLoading] = useState(true); // State to manage loading status
  
  useEffect(() => {
    // Define the asynchronous function inside the useEffect hook
    
    const fetchData = async () => {
     
      try {
        // Fetching the auth token
        const user = auth.currentUser ;
        const token = user && (await user.getIdToken());
  
        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
  
        // Using the token to fetch internships
        const response = await fetch('http://localhost:3001/api/v1/mentor/GetAllMentors', payloadHeader);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
  
        const data = await response.json();
        setMentors(data.mentorData); // Assuming the response JSON structure matches our state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after the fetch operation completes
      }
    };
  
    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount
  

  if (loading) {
    return <div>Loading...</div>; // Render a loading page or spinner here
  }

  return (
    <>
      <AuthNavbar />
      <Row className="mt-5" style={{paddingTop : "30px"}}>
        {Mentors.map((Mentor) => (
          <Col md={12} >
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{Mentor.title}</Card.Title>
                <Card.Text><strong>Company:</strong> {Mentor.Company}</Card.Text>
                <Card.Text><strong>Date Posted:</strong> {Mentor.datePosted}</Card.Text>
                <Card.Text>{Mentor.Description}</Card.Text>
                <Button variant="primary">Apply</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default MentorSearch;
