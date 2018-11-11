# Setting up your Informatica Cloud Organization

*Duration : 40 mins*

*Persona : API Team*

The set of steps below allows you to setup a backend proxy and Firebase database to serve as the backend data repository for your API proxies.

# Pre-requisites

* GCP account and project

# Instructions

## Setting up Firebase backend (Optional)

The API proxies used in the Extension lab exercises, reads and writes *employee* data in a Firebase database on Google Cloud Platform. This process below can be used to set up a new backend database. 

**NOTE**
* Instructions for creating a firebase project to contain the backend data is shown below. A ZIP file, dbsetup.zip, contains everything needed to populate the Firebase database. 
* Runtime access to the Firebase database is only via the Apigee Edge proxies. 

# Create Firebase DB and Import

1. In a browser go to https://firebase.google.com
2. Click Go to Console at the top right.
3. Click +ADD PROJECT button. Select your GCP project name from the drop-down list or enter a new project name.
4. Click on Continue once the project is ready
5. Accept defaults, terms, and Click Add Firebase button.
6. Click Develop > Database in the left nav menu, scroll down to choose Realtime Database, and then click Create database button.
7. Accept default read/write rules (Start in locked mode), and click *Enable* button.
    You will see the database URI to access your Firebase instance (https://{your-gcp-project-name}.firebaseio.com/). You'll need this later.
8. Import data into Firebase. Click three dots on the right and select IMPORT JSON. Navigate to the data directory and under the *Setup* folder select the ./Resources/dbsetup/empdata.json file. Click the IMPORT button.

# Update Firebase Rules

1. In the Firebase Console, select Develop > Database and click the Rules tab. 
2. Open the ./Resources/dbsetup/emprules.json file and copy the JSON from that file into the rules text box
3. Click Publish.


# Summary

That completes the setup of Firebase as the backend database. You can now proceed with Lab 1 in this series.



