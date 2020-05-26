$(function() {
    function FilamentRevolutionsViewModel(parameters) {
        var self = this;
        console.log("Trying to LOAD filament status at all...");

        // self.status_line = ko.observable();
        // self.show_status = ko.observable(false);
        self.filamentRunoutStatus = ko.observable();
        self.filamentJamStatus = ko.observable(); //actually Tool1 filament runout but let's keep it consistent for the moment.



        self.parseStatus = function(data) {
            //using this to deal with the confusing connascence of meaning on the status response values.  "Temporary"... - Josh, 5/26/2020
            console.log("Trying to PARSE filament status.");
            
            console.log(data);
            if (data.statusRunout !== undefined){
                if (data.statusRunout == 1){
                    self.filamentRunoutStatus("Loaded");
                } else {
                    self.filamentRunoutStatus("Not Loaded");
                }
            }
            if (data.statusJam !== undefined){
                if (data.statusRunout == 0){
                    self.filamentRunoutStatus("Loaded");
                } else {
                    self.filamentRunoutStatus("Not Loaded");
                }
            }
            self.show_status(true);
        }

        self.initialMessage = function(data) {
            // self.status_line(data.status_line);
            self.parseStatus(data);

            // self.show_status(data.status_line ? true : false);

        };

        self.onStartupComplete = function() {
            // WebApp started, get message if any
            console.log("Trying to GET filament status.");
            $.ajax({
                url: API_BASEURL + "plugin/filamentrevolutions/status",
                type: "GET",
                dataType: "json",
                success: self.parseStatus
            });
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