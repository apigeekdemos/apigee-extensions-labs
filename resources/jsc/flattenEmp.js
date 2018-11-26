var emp = context.getVariable("response.content");
var empJson = JSON.parse(emp);

for (var key in empJson) {
  if (empJson.hasOwnProperty(key)) {
    var val = JSON.stringify(empJson[key]);
    val = val.replace(/"/g, '\\"');
    context.setVariable("response.content", val);
  }
}
