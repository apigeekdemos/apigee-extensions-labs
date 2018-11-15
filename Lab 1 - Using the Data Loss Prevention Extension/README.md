# Lab 1 - Using the Data Loss Prevention Extension

*Duration : 20 mins*

*Persona : API Team*

# Use case

You have a requirement to create a reverse proxy for taking requests from the Internet to retrieve employee information from a backend database and return employee data based on employee id. However certain employee information like employee phone number must be redacted before being returned to the calling application.

# How can Apigee Edge help?

Apigee Edge enables you to quickly expose backend services or workflows as APIs. You do this by creating an API proxy that provides a facade for the backend service or data that you want to expose.

The API proxy decouples your backend service implementation from the API that developers consume. This shields developers from future changes to your backend services. As you update backend services, developers, insulated from those changes, can continue to call the API uninterrupted.

In this lab, we will see how to create a reverse proxy, that routes inbound requests to an existing backend, and returns the data after processing it through Google's Data Loss Prevention API using an Apigee Extension.

# Pre-requisites

* GCP service account credentials
* (Optional) If you are using your own backend Firebase database, the url endpoint to that database
* Apigee Edge account and Organization provisioned on Apigee Cloud with *Extensions* enabled
* Org Admin credentials to the above Apigee Edge Organization
* [REST Client](https://apigee-rest-client.appspot.com/) on a browser window., or Postman


# Instructions

## Create and configure the Data Loss Prevention (DLP) Extension instance on Apigee Edge

In the next set of steps below you will create an instance of the DLP Extension, configure it, and deploy it to the Apigee Edge *Test* environment.

1. Login to the Apigee Edge Org as an Organization Administrator.

2. Select *Admin > Extensions* from the left navigation menu

![image alt text](../media/image_apigee_extensions.png)

This page displays the list of existing Extension instances previously created in your Org, if any. Click on the *Add Extension* button in the top right to create a new extension.

![image alt text](./media/image_apigee_extensions_dlp.png)

3. On the *New Extension* page, click on the *Google Data Loss Prevention* extension.
Enter a name and optional description for the Extension instance. Then, click Create.

4. On the Extension detail page, click the > to configure the instance for the corresponding Apigee environment. In this lab, we will configure the *dlp* extension instance for the *test* environment.

![image alt text](./media/image_apigee_extensions_dlp_config.png)

5. Clicking the > will popup a dialog where you enter the following information:

* select the latest extension version
* your GCP project id. you can get your GCP project id from the GCP console.

![image alt text](../media/image_gcp_project_id.png)

* Info types. Enter PHONE_NUMBER in uppercase
* your GCP service account credentials in json format

![image alt text](./media/image_apigee_extensions_dlp_config_creds.png)

Click Save.

6. Once the configuration is saved, click on the Deploy button for the *test* environment. This will initiate deployment of the extension instance to the Apigee *test* environment.

![image alt text](./media/image_apigee_extensions_dlp_deploy.png)

7. Once the extension is successfully deployed, you should see a green check mark that says *Deployed*. This indicates that the extension is ready for use in an API proxy deployed to the same Apigee Edge environment.

![image alt text](./media/image_apigee_extensions_dlp_deployed.png)

*Congratulations!* ...You have now successfully configured and deployed an instance of the Data Loss Prevention Extension on Apigee Edge.

## Develop an API proxy in Apigee Edge

In this set of steps, you will now develop an API in Apigee Edge that makes use of the DLP Extension previously configured and deployed in the Edge *test* environment.

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

# Update the Target Endpoint Preflow

12. Since we are using Firebase as the backend, we need to update the target.url at runtime. To do this, select the *Target Endpoints > default > PreFlow in the left hand menu of the proxy editor in the UI.

* Click the +Step button in the graphical policy editor
* Select the Javascript policy type and rename it in the popup dialog

![image alt text](./media/image_apigee_proxy_develop_js.png)

* Edit the Javascript policy as shown to rewrite the *target.url* system variable
* Click *Save* to save and deploy the API proxy

![image alt text](./media/image_apigee_proxy_develop_js_edit.png)

## Testing the API 

1. Let us test the newly built API proxy.
We will use the [REST Client](https://apigee-rest-client.appspot.com/). Open the REST Client on a new browser window.  You can also use other REST clients (eg. Postman) for testing.

2. Enter the proxy endpoint URL to fetch all employees into the REST Client to make a GET call, and observe the request/response
URL: https://{your-edge-org}-test.apigee.net/v1/employees

3. You should see a success response similar to this -
![image alt text](./media/image_apigee_proxy_success_response.png)

# Develop the GET /{employee-id} conditional flow

13. In order to fetch an individual employee from the Firebase backend database, we need to extract the employee-id passed in the proxy request path, and supply it to the backend api via filter query parameters.

* First, in Proxy Endpoints > default > GET /{employee-id} flow, add an *ExtractVariables* policy in the request to extract the value of the employee-id passed as a path parameter in the api call, and store that value in a variable: *employeeId*
* Next, in Target Endpoints > default, add a *Conditional* flow for the GET /{employee-id}

![image alt text](./media/image_apigee_proxy_create_flow.png)

* Add a Javascript policy to this conditional flow's request to append query parameters to the target.url as shown

![image alt text](./media/image_apigee_proxy_develop_js_filter.png) 

14. Next, for any employee record returned we need to redact the employee phone number. We will use the DLP extension previously configured. Since the DLP policy takes a string as input, we need to first flatten the json object returned from the backend, as well as escape the " character in the employee json.

You can do this using a JS policy in the Proxy Endpoints > default > GET /{employee-id} response conditional flow.

![image alt text](./media/image_apigee_proxy_develop_js_flatten.png)

15. Add an Extension Callout policy to the Proxy Endpoints > default > GET /{employee-id} response conditional flow.
* In the policy popup, select the *Lab1dlp* instance previously created, then select the *deidentifyWithType* Action from the drop-down list. Apigee Edge automatically discovers all available workflows for this extension instance.

![image alt text](./media/image_apigee_proxy_develop_ecpolicy.png)

* Edit the policy to supply its input, which will be the *response.content* variable. Also, change the name of the output variable. This variable will contain the output of the extension after the DLP extension executes. 
* Click Save to save and deploy the proxy.

![image alt text](./media/image_apigee_proxy_develop_ecpolicy_edit.png)

16. Set the output of the API proxy as the content of the extension's output variable *text* attribute. To do this, add an *AssignMessage* policy to the response of the GET /{employee-id} conditional flow. 

* Click on +Step button in the response flow, then select *AssignMessage* policy type in the popup dialog.

![image alt text](./media/image_apigee_proxy_develop_ampolicy.png)

17. Edit the *AssignMessage* policy to remove the unused elements, set the payload content type, and content to come from the *{dlpEmployee.text}* variable, and set the *AssignTo* elements' type attribute to be *response*, as shown in the image below. Then, click Save to save and deploy the proxy changes.

![image alt text](./media/image_apigee_proxy_develop_ampolicy_edit.png)

*Congratulations!* ...You have now built a reverse proxy for an existing backend service to return data with sensitive information protected using the DLP extension.


## Test the API Proxy

1. Let us test the newly built API proxy. This proxy is a *passthru* proxy since it does not have any Apigee policies configured yet. We will add policies in subsequent labs. 
We will use the [REST Client](https://apigee-rest-client.appspot.com/). Open the REST Client on a new browser window.  You can also use other REST clients (eg. Postman) for testing.

2. Click on the *Trace* tab in the top right of the Developer editor in the Edge UI.

3. Click on the green *Start Trace Session* to start a trace session for your proxy.

4. Paste the http://{your-org}-test.apigee.net/v1/employees/{empid} link into the REST Client to make a GET call, and observe the request/response in the Trace window of the Apigee Edge UI.

5. You should see a success response similar to this -
![image alt text](./media/image_apigee_proxy_success_response_emp.png)

# Summary

That completes this hands-on lesson. In this simple lab you learned:
* To create and deploy the Apigee Data Loss Prevention Extension
* Develop an API proxy to retrieve and protect sensitive information from the backend service by using Google's DLP API

# References

* [Google Cloud Data Loss Prevention Extension](https://docs.apigee.com/api-platform/reference/extensions/google-cloud-data-loss-prevention-extension)


