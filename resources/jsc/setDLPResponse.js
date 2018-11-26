var resp = context.getVariable("dlpEmployee");
if (resp !== null) {
    var dlpEmpJson = JSON.parse(resp);
    var dlpOut = JSON.parse(dlpEmpJson.text);
    context.setVariable("response.content", JSON.stringify(dlpOut));
}