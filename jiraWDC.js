(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {

		var cols = [{
			id: "id",
			alias: "ID",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "key",
			alias: "key",
			dataType: tableau.dataTypeEnum.string
			}];

        var tableSchema = {
            id: "jiraIssueFeed",
            alias: "JIRA Issues",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {

        var dateObj = JSON.parse(tableau.connectionData),
            after_date_epoch = new Date(dateObj.activityStartDate).getTime() / 1000,
            page = 1,
            per_page = 200;

        function getNextIssuePage() {
            $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'GET',
                async: true,
                url: 'https://vailresorts.jira.com/rest/api/2/search?jql=project=EDPM',
                //Append bearer token to Auth header
                headers: {'Authorization': 'Basic '+tableau.password},
                success: function(resp){
                    var results = resp,
                        tableData = [];

                    if (results.length > 0) {
                        console.log('getData - Page '+page);

                        page++
                        for (var i=0, len = results.length; i<len; i++) {
                            tableData.push({
								"id": results[i].issues.id,
								"key": results[i].issues.key,
							});
                        }
                        //getNextActivityPage();
                        doneCallback(); //temp
                    } else {
                        doneCallback();
                    }
                    table.appendRows(tableData);
                }
             });
        }
        
        getNextActivityPage();
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            var dateObj = {
                activityStartDate: $('#activity-start-date').val().trim()
            };

            function isValidDate(dateStr) {
                d = new Date(dateStr);
                return !isNaN(d.getDate());
            }

            if (isValidDate(dateObj.activityStartDate)) {

                tableau.connectionName = "Strava Feed";
                tableau.connectionData = JSON.stringify(dateObj);
                tableau.password = $('#bearer-input').val().trim();
                tableau.submit();
            } else {
                $('#errorMsg').html("Enter a valid date. For example, 2016-01-01.");
            }
        });
    });


})();
