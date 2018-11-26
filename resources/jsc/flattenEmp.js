var emp = context.getVariable("response.content");
emp = emp.replace(/"/g, '\\"');
context.setVariable("response.content", emp);
