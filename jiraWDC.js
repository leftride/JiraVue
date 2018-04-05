(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {

		var cols = [{
			id: "id",
			alias: "ID",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "external_id",
			alias: "External ID",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "upload_id",
			alias: "Upload ID",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "athlete",
			alias: "Athlete ID",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "name",
			alias: "Activity Name",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "distance",
			alias: "Distance - meters",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "moving_time",
			alias: "Moving Time",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "elapsed_time",
			alias: "Elapsed Time",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "total_elevation_gain",
			alias: "Elevation Gain",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "elev_high",
			alias: "Highest Elevation - meters",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "elev_low",
			alias: "Lowest Elevation - meters",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "type",
			alias: "Activity Type",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "start_date",
			alias: "Activity Date - UTC",
			dataType: tableau.dataTypeEnum.datetime
			},{
			id: "start_date_local",
			alias: "Activity Date",
			dataType: tableau.dataTypeEnum.datetime
			},{
			id: "timezone",
			alias: "Activity Timezone",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "start_latlng",
			alias: "Starting Latitue/Longitude",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "end_latlng",
			alias: "Ending Latitue/Longitude",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "achievement_count",
			alias: "Achievement Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "kudos_count",
			alias: "Kudos Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "comment_count",
			alias: "Comment Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "athlete_count",
			alias: "Athlete Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "photo_count",
			alias: "Instagram Photo Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "total_photo_count",
			alias: "Photo Count",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "map",
			alias: "Map",
			dataType: tableau.dataTypeEnum.string
			},{
			id: "trainer",
			alias: "Trainer",
			dataType: tableau.dataTypeEnum.bool
			},{
			id: "commute",
			alias: "Commute",
			dataType: tableau.dataTypeEnum.bool
			},{
			id: "manual",
			alias: "Manual",
			dataType: tableau.dataTypeEnum.bool
			},{
			id: "private",
			alias: "Private",
			dataType: tableau.dataTypeEnum.bool
			},{
			id: "flagged",
			alias: "flagged",
			dataType: tableau.dataTypeEnum.bool
			},{
			id: "workout_type",
			alias: "Workout Type",
			dataType: tableau.dataTypeEnum.int
			},{
			id: "average_speed",
			alias: "Average Speed - meters per second",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "max_speed",
			alias: "Max Speed - meters per second",
			dataType: tableau.dataTypeEnum.float
			},{
			id: "has_kudoed",
			alias: "Kudoed",
			dataType: tableau.dataTypeEnum.bool

			}];

        var tableSchema = {
            id: "stravaActivityFeed",
            alias: "Strava Activity",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {

        var dateObj = JSON.parse(tableau.connectionData),
            after_date_epoch = new Date(dateObj.activityStartDate).getTime() / 1000,
            page = 1,
            per_page = 200;

        function getNextActivityPage() {
            $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'GET',
                async: true,
                url: 'https://www.strava.com/api/v3/athlete/activities?after='+after_date_epoch+'&page='+page+'&per_page='+per_page,
                //Append bearer token to Auth header
                headers: {'Authorization': 'Bearer '+tableau.password},
                success: function(resp){
                    var results = resp,
                        tableData = [];

                    if (results.length > 0) {
                        console.log('getData - Page '+page);

                        page++
                        for (var i=0, len = results.length; i<len; i++) {
                            var start_latlong,
                                end_latlong;

	                    if(results[i].start_latlng != null) {
                                start_latlong = results[i].start_latlng[0] + ',' + results[i].start_latlng[1];
                            } else {
                                start_latlong = null;
                            }
                            if(results[i].end_latlng != null) {
                                end_latlong = results[i].end_latlng[0] + ',' + results[i].end_latlng[1];
                            } else {
                                end_latlong = null
                            }


                            tableData.push({
								"id": results[i].id,
								"external_id": results[i].external_id,
								"upload_id": results[i].upload_id,
								"athlete": results[i].athlete.id,
								"name": results[i].name,
								"distance": results[i].distance,
								"moving_time": results[i].moving_time,
								"elapsed_time": results[i].elapsed_time,
								"total_elevation_gain": results[i].total_elevation_gain,
								"elev_high": results[i].elev_high,
								"elev_low": results[i].elev_low,
								"type": results[i].type,
								"start_date": results[i].start_date,
								"start_date_local": results[i].start_date_local,
								"timezone": results[i].timezone,
								"start_latlng": start_latlong,
								"end_latlng": end_latlong,
								"achievement_count": results[i].achievement_count,
								"kudos_count": results[i].kudos_count,
								"comment_count": results[i].comment_count,
								"athlete_count": results[i].athlete_count,
								"photo_count": results[i].photo_count,
								"total_photo_count": results[i].total_photo_count,
								"map": results[i].map,
								"trainer": results[i].trainer,
								"commute": results[i].commute,
								"manual": results[i].manual,
								"private": results[i].private,
								"flagged": results[i].flagged,
								"workout_type": results[i].workout_type,
								"average_speed": results[i].average_speed,
								"max_speed": results[i].max_speed,
								"has_kudoed": results[i].has_kudoed,
							});
                        }
                        getNextActivityPage();
                    } else {
                        doneCallback();
                    }
                    table.appendRows(tableData);
//                    doneCallback();
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
