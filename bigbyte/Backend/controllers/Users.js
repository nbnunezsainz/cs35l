const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { db, admin, bucket} = require('../FireBaseSetUp.js');
const Constants = require('./databaseConstant.js');
const { queryCollection, deleteDocument, getDocument } = require('./databaseFunctions.js');


// create and initialize a database reference to the "Internship" collection
const UserRef = db.collection(Constants.COLLECTION_USERS);

//add a User --> takes userData in json format (FirstName: John, LastName: Smith)
exports.addUser = async (req, res) => {
    try {
        const userData = req.body;
        const userID = req.body.id;

        console.log(userData);

        const data = {
            FirstName: userData.firstName,
            LastName: userData.lastName,
            Major: userData.major,
            Year: userData.year,
            Bio: userData.bio || null,
            Organizations: userData.organizations || [],
            LinkedIn: userData.linkedIn || null,
            Resume: userData.resume || null,

            //not provided by entered data
            MonthlyRefferalCount: 20,
            TotalRefferalCount: 0,
        };

        await UserRef.doc(userID).set(data);

        console.log("Success- a new user has been added!");
        res.status(200).json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.log("There was some error when adding user", error);
        res.status(500).json({ success: false, message: 'Error adding user' });
    }
}

//query all users based on a specific field, filtering technique, and target value --> returns dictionary of mentor ID to their data
exports.queryUsers = async (req, res) => {
    try {

        queryDict = await queryCollection(UserRef, req.body);

        console.log(queryDict);
        console.log("Success- users have been found!");
        res.status(200).json({ success: true, message: 'Users have been found' });
        return queryDict;

    } catch (error) {
        console.log("RAN INTO PROBLEM QUERYING USERS", error);
        res.status(500).json({ success: false, message: 'Error querying users' });
    }
};

//deletes a user based on their ID
exports.deleteUser = async (req, res) => {
    try {
        let userID = req.body.id;

        const result = await deleteDocument(UserRef, userID);
        console.log(result)
        console.log("Success- user deleted!");
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log("There was some error when deleting user", error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

// find and return an user dictionary that relates their ID to their data --> used by front end
exports.getUser = async (req, res) => {
    try {
        let userID = req.body.id;
        const user = await getDocument(UserRef, userID);
        console.log(user)

        console.log("Success- user received!");
        res.status(200).json({ success: true, message: 'Internship user successfully' });
        return user;

    } catch (error) {
        console.log("RAN INTO PROBLEM LOOKING FOR USER", error);
        res.status(500).json({ success: false, message: 'Error when getting user' });
    }
};

/*
apply to an internship --> relates user ID to internship ID, mentor ID, and internship company
creates a new document in the User->InternshipApp(UID->IID,MID,Company) collection
when displaying this application, including the internship status may be useful --> can be done by dynamically searching for the internship and pulling its status

req.body only contains userID and internshipID
*/
exports.applyForInternship = async (req, res) => {
    try {
        // gather user information
        const appRef = db.collection(Constants.COLLECTION_RELATIONAL_APPLICATIONS);
        let userID = req.body.userID;

        // gather internship information
        let internshipID = req.body.internshipID;
        const InternshipRef = db.collection(Constants.COLLECTION_INTERNSHIP);
        let internshipData = await getDocument(InternshipRef, internshipID);
        internshipData = internshipData[internshipID];

        // create and post application data
        const appData = {
            UserID: userID,
            InternshipID: internshipID,
            MentorID: internshipData.MentorID,
            InternshipCompany: internshipData.Company
        }
        await appRef.add(appData);

        // update user and internship data post application
        updateUserAndInternship(userID, internshipID, InternshipRef, internshipData);

        console.log("Success- user has applied to the internship");
        res.status(200).json({ success: true, message: 'User has applied successfully' });
    } catch (error) {
        console.log("There was some error when applying to the internship", error);
        res.status(500).json({ success: false, message: 'Error applying to internship' });
    }
};

exports.UploadResume = async (req, res) => {
    
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
       // const userId = req.body.userId; // Or however you obtain the user's ID
        const file = req.files.resume; // Assuming the file input name is 'resume'
    
        uploadPdfAndStoreReference(file, "andresisHere")
            .then(() => res.status(200).json({ message: "File uploaded and reference stored successfully." }))
            .catch(error => res.status(500).send({ message: error.message }));
    }
    

    async function uploadPdfAndStoreReference(file, userId) {
        try {
            if (!file || !userId) {
                throw new Error('Missing file or user ID.');
            }
    
            // Upload the PDF to Firebase Storage
            const blob = bucket.file(`${userId}/${file.name}`); // Storing under a 'userId' directory for organization
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: 'application/pdf',
                },
            });
    
            await new Promise((resolve, reject) => {
                blobStream.on('error', reject);
                blobStream.on('finish', resolve);
                blobStream.end(file.data);
            });
    
            // Get the public URL for the uploaded file
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
    
            // Store the URL in Cloud Firestore
            await db.collection('users').doc(userId).set({
                resumeUrl: url
            }, { merge: true });
    
            console.log("File uploaded and reference stored successfully.");
        } catch (error) {
            console.error('Error uploading file and storing reference:', error);
            throw error; // Re-throw the error to handle it appropriately in the calling context
        }
    }
    
    exports.getResumes = async (req, res) => {
            try {
                console.log("hello")
                const usersCollection = await db.collection('users').get();
                const resumes = [];
                
                usersCollection.forEach(doc => {
                    const userData = doc.data();
                    if (userData.resumeUrl) { // Make sure the user has a resume URL
                        resumes.push({ userId: doc.id, resumeUrl: userData.resumeUrl });
                    }
                });

                console.log(resumes,"resumes");
        
                // Send the list of resumes back to the client
                res.status(200).json(resumes);
            } catch (error) {
                console.error('Error fetching resumes:', error);
                res.status(500).send({ message: 'Error fetching resumes' });
            }
       
        
    }
    
// this is an internal funciton to update User and Internship data
const updateUserAndInternship = async (userID, internshipID, InternshipRef, internshipData) => {
    try {
        // gather and update user information
        const user = UserRef.doc(userID);
        let userData = (await user.get()).data();
        console.log(userData)
        await user.update(
            {
                MonthlyRefferalCount: userData.MonthlyRefferalCount - 1,
                TotalRefferalCount: userData.TotalRefferalCount + 1
            }
        );

        // gather and update internship information
        const internship = InternshipRef.doc(internshipID);
        let appCount = internshipData.ApplicationCounter + 1;
        let newStatus = internshipData.Status;
        let newDisplay = internshipData.Display;
        if (appCount >= internshipData.RefferalLimit) {
            newStatus = Constants.INTERNSHIP_STATUS_REVIEW;
            newDisplay = false;
        }
        await internship.update(
            {
                ApplicationCounter: appCount,
                Status: newStatus,
                Display: newDisplay
            }
        );

        console.log("User/internship data are updated after application was submitted");
    } catch (error) {
        console.log("There was some error when updating user/internship data", error);
    }
};