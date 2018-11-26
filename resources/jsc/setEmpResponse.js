var emp = context.getVariable("response.content");
var empJson = JSON.parse(emp);

for (var key in empJson) {
  if (empJson.hasOwnProperty(key)) {
    var val = empJson[key];
    context.setVariable("response.content", JSON.stringify(val));
  }
}