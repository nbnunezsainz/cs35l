Project Title:
    bigbytessquad

Project Description:
    One goal of the university is to get an internship. However, in most cases, it is a catch-22 where you need experience to get experience. However, attending a school like UCLA provides students with a vast network of alumni. The goal of this application will be to create a platform that connects students to alumni with the goal of alumni advocating for UCLA students.
    This will be accomplished by alumni posting internships available at their company, and positions they are willing to refer someone to. Students can then upload their resume and a short bio about themselves. If the Alumni feel they have a strong candidate then they will refer them to the position, through the internal referral program that most large corporations have.
    The motivation that alumni have is that they will be giving back to the community, and one day this will be expanded outside of internships but also into full-time roles. However, there will also be opportunities for these alumni to offer mentorship if they are unable to refer a student. Thus this can help to build up relationships with students and alumni. Ultimately, this will help students get industry experience, with the goal being that when they graduate they will help return the favor.

Installattion Process:
    1. Clone from GitHub repo
    2. Navigate to Backend directory and create the following files to store and initialize the Firebase API keys:
        - .env
        - FBAdmin.json
    3. 'npm install' in both bigbyte and Backend directory
    4. npm start in both bigbyte and Backend directory
    5. A new React application host will startup in localhost:3000 with backend functionality in localhost:3001


Backups:
Assyming the project is installed and you navigate to the /Backend folder with proper admin access. Run the terminal command below 'export' to save your current data and 'import' to rewrite the exported data to the database
Naming convention: backup[x].json - backup1.json, backup2.json, etc
1. export data: npx -p node-firestore-import-export firestore-export -a FBAdmin.json -b backup[x].json
2. import data: npx -p node-firestore-import-export firestore-import -a FBAdmin.json -b backup[x].json

Major Problems Solved Resources:
    Problem 1:How to render Pdfs, received CORS issue due to google permissions, how to solve below
    Solution 1: https://thehotcode.com/firebase-gcloud-fix-cors-issues/
Credits:
    Front-end team:
        Nicole Nunez-Sainz and Parkishit Sood
    Back-end team:
        Shivum Kapoor and Christian Gonzalez
    Full-stack team:
        Andres Enriquez
