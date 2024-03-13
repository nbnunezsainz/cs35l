import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Container, Row, Col, Button, Card,Form } from 'react-bootstrap';
//import { FaComment } from 'react-icons/fa'; // Assuming you're using react-icons for the comment icon
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import '../Styling/PDFViewer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



function ResumeViewer({sendDataToParent, resumeUrl, resumeUID, resumeComments}) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentResumeUID, setCurrentResumeUID] = useState(null); // Add this line
    
    const toggleComments = (e) => {
       setShowComments(!showComments);
         setCurrentResumeUID(e.target.value);
    //  // This will log the value of the button (resumeUID)
     }
    const submitComment = async() => {
        
        if (newComment.trim()) { // Avoid adding empty comments
            setComments([...comments, newComment]);
            setNewComment(''); // Reset input after submission
            sendDataToParent(true);   // log new comment
        }
        const requestBody = {
            resumeUID: currentResumeUID,
            comment: newComment
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        };
        try {
            // Make the fetch request to the server
            const response = await fetch('http://localhost:3001/api/v1/Resume/CommentOnResume', requestOptions);

            // Check if the request was successful
            if (response.ok) {
                const result = await response.json(); // Assuming the server sends back some data
                console.log('Comment submitted successfully', result);
                
                // Update local state with the new comment
                setComments(prevComments => [...prevComments, newComment]);
                setNewComment(''); // Clear the input after submission
            } else {
                // If the server response was not ok, log or handle the error
                console.error('Failed to submit comment:', response.statusText);
            }
        } catch (error) {
            // Log network or other errors to the console
            console.error('Error submitting comment:', error);


        }
    };

    return (
       
        <Col >

  {/* <iframe
    src={resumeUrl}
    loading="lazy"
    width={900}
    height={1000}
    style={{
      border: 'none',
      marginBottom: '20px', // Add some space below the iframe
    }}
     */}
  <Row> 
  <Document file={resumeUrl}>
  <Page pageNumber={1} width={900} />
</Document>
</Row>

<Row style= {{ marginBottom: '200px' }}> 

<Col sm={6}> 

  <Button value={resumeUID} onClick={toggleComments} variant="outline-primary" className="mb-3">
    Comments
  </Button>
  </Col>
  



  {showComments && (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Comments</h5>
        {resumeComments && resumeComments.length > 0 ? (
          resumeComments.map((resComment, index) => (
            <div key={index} className="mb-2">
              <strong>{resComment.comment} </strong> 
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
        </Form.Group>
        <Button onClick={submitComment} variant="primary">
          Submit
        </Button>
      </Card.Body>
      
    </Card>
    
  )}
    </Row>
</Col>
    );
}

export default ResumeViewer;
