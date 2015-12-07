// Bad JS follows! We should never have anything as a global variable.
// Some refactoring would be advisable! Maybe wrap as a closure in $(document).ready()? 

Handlebars.registerHelper('map', function(text) {
    var map = {
        "name": 'Name',
        "organisation": "Organization",
        "phones": "Phones",
        "emails": "Emails",
        "notes": "Notes"
    };
    return map[text];
});

var template = Handlebars.compile($("#modal-template").html());

var table = $('#sourceTable').DataTable({
    dom: '<"row"<"col-md-6"B><"col-md-6"f>>t<"row"<"col-md-6"i><"col-md-6"p>>',
    select: true,
    responsive: true,
    buttons: [{
        text: 'Edit',
        action: function(e, dt, node, config) {

            // necessary variables
            var oldData = dt.row({
                selected: true
            }).data(); // current row data

            var headers = ["name", "organisation", "phones", "emails", "notes"]; // titles of columns

            // render modal
            $("#modal-container").html(template({
                about: 'Edit',
                header: headers
            }));

            // display modal
            $("#myModal").modal();
            
            // populate modal fields
            for (var i = 0; i < headers.length; i++) {
                    $("#" + headers[i]).val(oldData[i]);
            }

            // custom event handlers on submit and close
            $(".submit").on('click', function() {
                $('#myModal').modal('hide');

                var newData = [];

                for (var i = 0; i < headers.length; i++) {
                    var value = $("#" + headers[i]).val();
                    console.log(value);
                    if (value) {
                        newData.push(value);
                    } else {
                        newData.push(oldData[i]);
                    }
                }

                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/edit",
                    data: JSON.stringify({
                        old: oldData,
                        new: newData
                    }),
                    success: function(event) {
                        console.log("Edited row");
                    }
                });

                dt.row({
                    selected: true
                }).data(newData).draw();
            });

        },
        enabled: false
    }, {
        text: 'Delete',
        action: function(e, dt, node, config) {

            $("#modal-container").html(template({
                about: 'Delete',
                delete: true
            }));

            // display modal
            $("#myModal").modal();

            $(".submit").on('click', function() {

                var row = dt.row({
                    selected: true
                });

                $('#myModal').modal('hide');

                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/delete",
                    data: JSON.stringify(row.data()),
                    success: function(event) {
                        console.log("Deleted row");
                    }
                });

                row.deselect();

                row.remove().draw('full-hold');
            });

        },
        enabled: false
    }, {
        text: 'Add',
        action: function(e, dt, node, config) {

            var headers = ["name", "organisation", "phones", "emails", "notes"]; // titles of columns
            
            $("#modal-container").html(template({
                about: 'Add',
                header: headers
            }));

            // populate modal fields
            for (var i = 0; i < headers.length; i++) {
                    $("#" + headers[i]).val("N/A");
            }

            // display modal
            $("#myModal").modal();

            $(".submit").on('click', function() {

                var newData = [];
                var allDataNull = true;

                for (var i = 0; i < headers.length; i++) {
                    var value = $("#" + headers[i]).val();
                    newData.push(value);
                    if (value) {
                        allDataNull = false
                    }
                }

                if (!allDataNull) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/add",
                        data: JSON.stringify(newData),
                        success: function(event) {
                            console.log("Added row");
                        }
                    });

                    dt.row.add(newData).draw(true);
                    // jump to last page
                    dt.page('last').draw('page');
                    $('#myModal').modal('hide');
                }

                // do nothing otherwise
            });

        },
        enabled: true
    }]
});

table.on('select', function() {
    var selectedRows = table.rows({
        selected: true
    }).count();

    table.button(0).enable(selectedRows == 1);
    table.button(1).enable(selectedRows == 1);
});

table.on('deselect', function() {
    table.button(0).disable();
    table.button(1).disable();
});
