// Bad JS follows! We should never have anything as a global variable.
// Some refactoring would be advisable! Maybe wrap as a closure in $(document).ready()? 

Handlebars.registerHelper('map', function(text) {
    var map = {
        "name": 'Name',
        "title": 'Title',
        "organisation": "Organisation",
        "work-phone": "Work Phone",
        "cell-phone": "Cell Phone",
        "other-phone": "Other Phone",
        "work-email": "Work Email",
        "personal-email": "Personal Email",
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

            var headers = ["name", "title", "organisation", "work-phone", "cell-phone", "other-phone", "work-email", "personal-email", "notes"]; // titles of columns

            // render modal
            $("#modal-container").html(template({
                about: 'Edit',
                header: headers
            }));

            // display modal
            $("#myModal").modal();
            
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
                        console.log("It worked");
                    }
                });

                dt.row({
                    selected: true
                }).data(newData).draw();
                dt.columns.adjust().draw();
            });

            $(".close").on('click', function() {
                $('#myModal').modal('hide');
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
                        console.log("It worked");
                    }
                });

                row.deselect();

                row.remove().draw('full-hold');
            });

            $(".close").on('click', function() {
                $('#myModal').modal('hide');
            });
        },
        enabled: false
    }, {
        text: 'Add',
        action: function(e, dt, node, config) {

            var headers = ["name", "title", "organisation", "work-phone", "cell-phone", "other-phone", "work-email", "personal-email", "notes"]; // titles of columns

            $("#modal-container").html(template({
                about: 'Add',
                header: headers
            }));

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
                            console.log("It worked");
                        }
                    });

                    dt.row.add(newData).draw(true);
                    // jump to last page
                    dt.page('last').draw('page');
                    $('#myModal').modal('hide');
                }

                // do nothing otherwise
            });

            $(".close").on('click', function() {
                $('#myModal').modal('hide');
            });
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