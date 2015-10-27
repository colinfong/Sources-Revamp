var table;
var store;
var flag = false;

store = $('#sourceTable').tableToJSON();
table = $('#sourceTable').DataTable({
    dom: '<"row"<"col-md-6"B><"col-md-6"f>>t<"row"<"col-md-6"i><"col-md-6"p>>',
    buttons: [{
        text: 'Save',
        action: function(e, dt, node, config) {
            console.log(store);
        },
        enabled: false
    }]
});

function handleChange(target) {
    var row = parseInt(target.parentNode.getAttribute("id"));
    var property = target.getAttribute("data-property");
    store[row][property] = target.innerText;
    flag = true;
    table.button(0).enable();
}

window.onbeforeunload = function() {
    if (flag === true) {
        return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
    }
}