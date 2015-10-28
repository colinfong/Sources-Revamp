// Bad JS follows! We should never have anything as a global variable.
// Some refactoring would be advisable!
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
    var row = parseInt(target.parentNode.getAttribute("id")); // get the row by looking up <tr> id
    var property = target.getAttribute("data-property"); //get what property it corresponds to
    store[row][property] = target.innerText; // update the local copy of the store
    flag = true; // notify the world that a change has been made
    table.button(0).enable(); // enable the save changes button
}

window.onbeforeunload = function() {
    // Warns you if you try to leave without submitting your changes.
    if (flag === true) {
        return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
    }
}