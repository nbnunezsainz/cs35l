/*DO NOT EDIT THIS FILE UNLESS PERMISSION IS GRANTED FROM BACK-END TEAM
----
this file holds database names that are stored in Firebase*/

//constants for Firestore collections
exports.COLLECTION_USERS = "User";
exports.COLLECTION_MENTORS = "Mentor";
exports.COLLECTION_INTERNSHIP = "Internship";
exports.Collection_RESUME = "Resume";
exports.Collection_COMMENTS = "Comments";
exports.Collection_RESUME_COMMENTS ="ResumeWithComments";

//constants for Internship statuses
exports.INTERNSHIP_STATUS_OPEN = "Open for Applications";
exports.INTERNSHIP_STATUS_REVIEW = "Applications are Under Review";
exports.INTERNSHIP_STATUS_CLOSED = "Applications are Now Closed";
exports.COLLECTION_RELATIONAL_APPLICATIONS = "User->InternshipApp(UID->IID,MID,Company)";



//constants for Storage names
exports.STORAGE_RESUME = "resumes/";
