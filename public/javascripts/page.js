// Bad JS follows! We should never have anything as a global variable.
// Some refactoring would be advisable!
var table;
var store;
var isEditUnsaved = false;

store = $('#sourceTable').tableToJSON(); // save copy of table on page load, before DataTables is applied.

table = $('#sourceTable').DataTable({
    dom: '<"row"<"col-md-6"B><"col-md-6"f>>t<"row"<"col-md-6"i><"col-md-6"p>>',
    select: true,
    responsive: true,
    buttons: [{
        text: 'Edit',
        action: function(e, dt, node, config) {
            // get the data!
            var returned = dt.row({selected: true}).data();
            // alter the data!
            returned[0] = "ANDDNDDNDNDND";
            // set the data!
            dt.row({selected: true}).data(returned).draw(false);
        },
        enabled: false
    },{
        text: 'Delete',
        action: function(e, dt, node, config) {
            // delete the data!
            var row = dt.row({selected: true});
            row.deselect();
            row.remove().draw(false);
        },
        enabled: false
    },{
        text: 'Add',
        action: function(e, dt, node, config) {
            // deselect selected rows
            dt.row({selected: true}).deselect();
            // add a row!
            dt.page('last').draw('page');
            dt.row.add(
                ["Name", "Title", "Organisation", "workPhone", "cellPhone", "otherPhone", "workEmail", "personalEmail", "notes"]
            ).draw(false);
        },
        enabled: true
    }]
});

table.on('select', function() {
    var selectedRows = table.rows({
        selected: true
    }).count();

    table.button(0).enable(selectedRows > 0);
    table.button(1).enable(selectedRows > 0);
});

table.on('deselect', function () {
    table.button(0).disable();
    table.button(1).disable();
} );


/* 

The following function is deprecated, since we're moving to editing rows rather than each
individual cell.

*/

/*function handleChange(target) {
    var row = parseInt(target.parentNode.getAttribute("id")); // get the row by looking up <tr> id
    var property = target.getAttribute("data-property"); //get what property it corresponds to
    store[row][property] = target.innerText; // update the local copy of the store
    flag = true; // notify the world that a change has been made
    table.button(0).enable(); // enable the save changes button
}*/

window.onbeforeunload = function() {
    // Warns you if you try to leave without submitting your changes.
    if (isEditUnsaved === true) {
        return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
    }
}