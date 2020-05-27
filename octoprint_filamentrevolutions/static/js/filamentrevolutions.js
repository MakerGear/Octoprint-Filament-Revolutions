$(function() {
    function FilamentRevolutionsViewModel(parameters) {
        var self = this;
        // console.log("Trying to LOAD filament status at all...");


        self.filamentRunoutStatus = ko.observable("No data yet.");
        self.filamentJamStatus = ko.observable("No data yet."); //actually Tool1 filament runout but let's keep it consistent for the moment.
        self.filamentLastMessage = ko.observable("No messages received yet.");
        self.sensorStatusUrl = OctoPrint.getBlueprintUrl("filamentrevolutions") + "status";


        self.parseStatus = function(data) {
            //using this to deal with the confusing connascence of meaning on the status response values.  "Temporary"... - Josh, 5/26/2020
            // console.log("Trying to PARSE filament status.");
            
            // console.log(data);
            if (data.statusRunout !== undefined){
                if (data.statusRunout == 1){
                    self.filamentRunoutStatus("Loaded");
                } else {
                    self.filamentRunoutStatus("Not Loaded");
                }
            }
            if (data.statusJam !== undefined){
                if (data.statusJam == 0){
                    self.filamentJamStatus("Loaded");
                } else {
                    self.filamentJamStatus("Not Loaded");
                }
            }
            if (data.lastMessage !== undefined){
                self.filamentLastMessage(data.lastMessage);
            }

        }


        self.requestSensorData = function() {

            OctoPrint.get(self.sensorStatusUrl)
                .done(self.parseStatus)
                ;


        }


        self.onStartupComplete = function() {
            // console.log(OctoPrintClient.getBaseUrl());
            // console.log("Trying to GET filament status.");

            self.requestSensorData();
            // OctoPrint.get(self.sensorStatusUrl)
            //     .done(self.parseStatus)
            //     ;
        }


// statusRunout=statusRunout, statusJam=statusJam //format in python side


        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "filamentrevolutions") {
                return;
            }

            self.parseStatus(data);
            // self.status_line(data.status_line);
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        FilamentRevolutionsViewModel,
        [ ],
        ["#filamentrevolutions_sidebar"]
    ]);
})