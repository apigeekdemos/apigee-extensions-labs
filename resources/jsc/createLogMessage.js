var empname = context.getVariable("employee.name");
var empemail = context.getVariable("employee.email");
var empdept = context.getVariable("employee.department");
var timestamp_str = context.getVariable("system.time");
var timestamp = context.getVariable("system.timestamp");

var log_msg = timestamp_str + " Created employee: " + empname + ":" + empemail + ":" + empdept;
context.setVariable("logMessage", log_msg);

// augment input
var emp = JSON.parse(context.getVariable("request.content"));
emp.created = timestamp;
emp.modified = timestamp;
emp.id = context.getVariable("messageid");
context.setVariable("employee.id", emp.id);

var targetPayload = {};
targetPayload[emp.id] = emp;
context.setVariable("request.content", JSON.stringify(targetPayload));

// set the target url
var targeturl = context.getVariable("target.url");
context.setVariable("target.url", targeturl + ".json");
