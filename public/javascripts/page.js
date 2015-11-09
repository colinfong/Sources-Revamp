// Bad JS follows! We should never have anything as a global variable.
// Some refactoring would be advisable!
var table;
var store;
var isEditUnsaved = false;

store = $('#sourceTable').tableToJSON(); // save copy of table on page load, before DataTables is applied. EDIT: We probably no longer need this!

table = $('#sourceTable').DataTable({
    dom: '<"row"<"col-md-6"B><"col-md-6"f>>t<"row"<"col-md-6"i><"col-md-6"p>>',
    select: true,
    responsive: true,
    buttons: [{
        text: 'Edit',
        action: function(e, dt, node, config) {
            // get the data!
            var oldData = dt.row({
                selected: true
            }).data();
            // alter the data!
            var newData = $.extend({}, oldData); // create shallow copy
            newData[0] = "ANDDNDDNDNDND";
            // set the data!
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/edit",
                data: JSON.stringify({
                    old: oldData,
                    new: newData
                }),
                success: function(event) {
                    console.log("It worked");
                }
            });
            dt.row({
                selected: true
            }).data(newData).draw();
        },
        enabled: false
    }, {
        text: 'Delete',
        action: function(e, dt, node, config) {
            // delete the data!
            swal({
                title: "Are you sure?",
                text: "You are about to delete the selected row",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!"
            }, function() {
                var row = dt.row({
                    selected: true
                });
                row.deselect();
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/delete",
                    data: JSON.stringify(row.data()),
                    success: function(event) {
                        console.log("It worked");
                    }
                });
                row.remove().draw('full-hold');
            });
        },
        enabled: false
    }, {
        text: 'Add',
        action: function(e, dt, node, config) {
            // deselect selected rows
            dt.row({
                selected: true
            }).deselect();
            // add a row!
            var newRowData = ["Name", "Title", "Organisation", "workPhone", "cellPhone", "otherPhone", "workEmail", "personalEmail", "notes"];
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/add",
                data: JSON.stringify(newRowData),
                success: function(event) {
                    console.log("It worked");
                }
            });
            dt.row.add(newRowData).draw(true);
            // jump to last page
            dt.page('last').draw('page');
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

table.on('deselect', function() {
    table.button(0).disable();
    table.button(1).disable();
});