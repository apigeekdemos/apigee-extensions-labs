# Lab 1 - Using the Stackdriver Logging Extension

*Duration : 20 mins*

*Persona : API Team*

# Use case

You have to build and manage your employee database by exposing APIs that allow a client application to perform CRUD operations. For this lab you have a requirement to accept a POST request to your proxy inorder to create a new employee record in the backend database. As part of this requirement, the security and audit team within the organization mandates that all successful employee creation requests must be logged to an external system for audit and tracking purposes.

# How can Apigee Edge help?

Apigee Edge enables you to quickly expose backend services or workflows as APIs. You do this by creating an API proxy that provides a facade for the backend service or data that you want to expose.

The API proxy decouples your backend service implementation from the API that developers consume. This shields developers from future changes to your backend services. As you update backend services, developers, insulated from those changes, can continue to call the API uninterrupted.

In this lab, we will see how to implement the employees proxy to create employee records in our backend database. As part of a successful request/response, an audit record is logged to Stackdriver using the Apigee Stackdriver extension.

# Pre-requisites

* GCP service account credentials
* (Optional) If you are using your own backend Firebase database, the url endpoint to that database
* Apigee Edge account and Organization provisioned on Apigee Cloud with *Extensions* enabled
* Org Admin credentials to the above Apigee Edge Organization
* [REST Client](https://apigee-rest-client.appspot.com/) on a browser window., or Postman


# Instructions

## Create and configure the Stackdriver Extension instance on Apigee Edge

In the next set of steps below you will create an instance of the Stackdriver Extension, configure it, and deploy it to the Apigee Edge *Test* environment.

1. Login to the Apigee Edge Org as an Organization Administrator.

2. Select *Admin > Extensions* from the left navigation menu

![image alt text](../media/image_apigee_extensions.png)

This page displays the list of existing Extension instances previously created in your Org, if any. Click on the *Add Extension* button in the top right to create a new extension.

![image alt text](./media/image_apigee_extensions_sd.png)

3. On the *New Extension* page, click on the *Google Stackdriver Logging* extension.
Enter a name and optional description for the Extension instance. Then, click Create.

4. On the Extension detail page, click the > to configure the instance for the corresponding Apigee environment. In this lab, we will configure the *stackdriver* extension instance for the *test* environment.

5. Clicking the > will popup a dialog where you enter the following information:

* select the latest extension version
* your GCP project id. you can get your GCP project id from the GCP console.

![image alt text](../media/image_gcp_project_id.png)

* Copy/paste your GCP service account json file into the *Credential* field.
* If yo

![image alt text](./media/image_apigee_extensions_sd_config_creds.png)

Click Save.

6. Once the configuration is saved, click on the Deploy button for the *test* environment. This will initiate deployment of the extension instance to the Apigee *test* environment.

![image alt text](./media/image_apigee_extensions_sd_deploy.png)

7. Once the extension is successfully deployed, you should see a green check mark that says *Deployed*. This indicates that the extension is ready for use in an API proxy deployed to the same Apigee Edge environment.

![image alt text](./media/image_apigee_extensions_sd_deployed.png)

*Congratulations!* ...You have now successfully configured and deployed an instance of the Stackdriver Logging Extension on Apigee Edge.

## Create the Employees API proxy in Apigee Edge

In this set of steps, you will develop an API proxy in Apigee Edge that makes use of the Stackdriver Extension previously configured and deployed in the Edge *test* environment.

8. Click on Develop > API Proxies. This lists any existing API proxies in your Apigee Org. Click the *+Proxy* button in the top right to create a new API proxy.

![image alt text](./media/image_apigee_proxy_create.png)

9. Select the *Reverse proxy (most commmon)* option and click the *Use OpenAPI* button. In the popup dialog, select *Upload File* tab, and: 

NOTE: Please download the OAS spec from the github repo onto your local machine, and update the *host* entry in the spec file to use your own Apigee Edge organization name.

* Click the arrow to select the OpenAPI specification *employees_oas.yaml* from your local machine.
*NOTE*: Replace the {your_initials} with your own initials. 
* Click the *Select* button
* Click *Next* on the *Create Proxy* page
* Fill out the field on this page:

*Proxy name*: {your_initials}_employees
*Proxy basepath*: Append a version to the default basepath: /v1/employees
*Existing API*: https://infa-apijam-1537329947239.firebaseio.com/db/employees
(NOTE: Replace the above Existing API url with your own, if you are using your own backend Firebase database)
*Description*: Optionally, enter a description for the proxy

![image alt text](./media/image_apigee_proxy_create_details.png)

Click Next.

10. Click thru the next set of pages to deploy the proxy.
 
* On the next page, leave all operations selected, and click Next. 
* Select the *Passthru* option to allow the proxy to be called with no authorization. Click Next. 
* Accept the default virtual hosts selected. This will deploy the proxy to both the default and secure virtual hosts on Apigee Edge. Click Next. 
* Uncheck the *prod* environment checkbox and leave the *test* checkbox checked. This will deploy the API proxy only to the test environment. 
* Finally click *Build and Deploy* to deploy the proxy.

11. Once the API proxy is successfully deployed, click the link to view it in the development editor in the Edge UI. From the Overview page, click the *Develop* tab at the top right. 

12. Develop the Proxy Endpoint > default > /POST conditional flow in the left nav menu. 
This operation will handle POST requests to the employees proxy to create an employee record in the backend database.

In this flow, we first extract certain information from the request payload into flow variables, which we will use to construct the log message to be logged in Stackdriver.

* Attach an *ExtractVariables* policy to the /POST conditional flow, and modify it as shown to extract the employee name, email, department into 3 separate flow variables using *employee* as the variable name prefix. Click Save to save the proxy.

![image alt text](./media/image_apigee_proxy_develop_evpolicy_edit.png)

## Modify the proxy TargetEndpoint to construct the log message, and rewrite the target url

13. Next, add a Javascript policy to construct the log message using these flow variables in addition to the current timestamp. We also use the same policy to augment the input data with system generated fields, employee id. 

* We add this policy in the Target Endpoint > default > /POST conditional flow request.
* We will also re-write the target url to send the request to the backend in this JS. 

![image alt text](./media/image_apigee_proxy_develop_js_edit.png)

14. Next, we need to update the HTTP verb on the request from POST to PATCH since we are updating the existing *employees* data in the backend Firebase database. 

* To do this, add an *AssignMessage* policy as shown. This policy also saves the original value of the incoming request.verb variable for use later.

![image alt text](./media/image_apigee_proxy_develop_am_verb.png)

Save the proxy.

15. Once a successful response is received from the target, we then log the message to Stackdriver. To do this, we add an ExtensionCallout policy that references the Stackdriver extension previously configured; in the Target Endpoint > default > /POST conditional flow response.
NOTE: This is a separate flow that uses the previously saved value of the request.verb variable.
To create this flow, simply copy/paste the previous flow and edit it accordingly, as shown below:

![image alt text](./media/image_apigee_proxy_develop_log_flow.png)

16. Update the ExtensionCallout policy to use the logMessage flow variable created by the JS policy in the earlier step.

![image alt text](./media/image_apigee_proxy_develop_ecpolicy.png)

* Modify the policy to supply the name of the log, project_id metadata, and the logMessage variable containing the log message string.
* Save and deploy the proxy.

![image alt text](./media/image_apigee_proxy_develop_ecpolicy_edit.png)

## Testing the API 

1. Let us test the updated API proxy.
We will use the [REST Client](https://apigee-rest-client.appspot.com/). Open the REST Client on a new browser window.  You can also use other REST clients (eg. Postman) for testing.

2. Enter the proxy endpoint URL to fetch all employees into the REST Client to make a GET call, and observe the request/response
Method: POST
URL: https://{your-edge-org}-test.apigee.net/v1/employees

Header: Content-Type: application/json

NOTE: Change the values of the attributes in the json payload below:
Payload:
{
    "birthDate": "07-29",
    "city": "Dade City",
    "department": "Human Resources",
    "email": "robert@inquala.com",
    "gender": "male",
    "isActive": true,
    "name": "Robert Johnson",
    "phone": "+1 (801) 480-3114",
    "postal": "33525",
    "state": "FL",
    "street": "14129 Paradise Street"
}

3. You should see a success response similar to this -
![image alt text](./media/image_apigee_proxy_success_response.png)

4. Verify the log message in Stackdriver in the GCP console

* Navigate to the Stackdriver > Logging > Logs menu in the GCP console from the left hand  top icon (3 lines)
![image alt text](./media/image_gcp_sd_log_menu.png)

* On the logs page, select the Global resource
* View the log entries

![image alt text](./media/image_gcp_sd_log_entries.png)

# Summary

That completes this hands-on lesson. In this simple lab you learned:
* To create and deploy the Stackdriver Logging Extension
* Develop an API proxy to POST a resource to the backend and log a message to Stackdriver on GCP

# References

* [Google Stackdriver Logging Extension](https://docs.apigee.com/api-platform/reference/extensions/google-stackdriver-logging-extension)


