/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "project1/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                var model = new JSONModel( {
                    PZEBuchungen: [],
                    BDEVorgang: {
                        Typ: "",
                        Status: "",
                        Zeitpunkt: null,
                        preCmd: ""
                    },
                    BDEBuchungen: [],
                    Montage: {
                        Zeitpunkt: null
                    },
                    Settings: {
                        Zeit: "08:00:00",
                        Datum: "01.08.2024"
                    },
                    Log: [
                         //{ Nr: 1, Text: "Start" }
                    ],
                    Szenarien: [
                        { Nr: 1, Text: "Start", Beschreibung: "Startzeitpunkt für eigene Tests", Schritte: [ 
                            { Nr: "1.1", Text: "Start", Beschreibung: "01.08.2024 08:00 Uhr" }
                        ] },
                        { Nr: 2, Text: "Kommen/Gehen ohne BDE", Beschreibung: "Normales Kommen/Gehen", Schritte: [
                            { Nr: "2.1", Text: "Kommen", Beschreibung: "kommen buchen" },
                            { Nr: "2.2", Text: "Gehen", Beschreibung: "gehen buchen" }
                        ] },
                        { Nr: 3, Text: "Kommen, Pause vergessen", Beschreibung: "Pause nachbuchen", Schritte: [
                            { Nr: "3.1", Text: "Kommen", Beschreibung: "Normales Kommen"},
                            { Nr: "3.2", Text: "Pausenende", Beschreibung: "Pause nachbuchen (Korrektur)"}
                        ] },
                    ],
                    Schritte: [],
                    SchrittBeschreibung: "",
                    Status: "Test",
                    SSP: {
                        Ereignistyp: "Kommen",
                        Pause: false
                    },
                    primaryLeft: {
                        Label: "Primär Links!",
                        Visible: true,
                        ToolTip: "l",
                        Color: "Blau",
                        Big: true
                    },
                    primaryRight: {
                        Label: "Primär g_, Rechts!",
                        Visible: true,
                        ToolTip: "r",
                        Color: "Blau",
                        Big: true
                    },
                    PrimaryLabel: "Primär",
                    secondary1: {
                        Label: "Sekundär 1!",
                        Visible: true,
                        ToolTip: "1",
                        Color: "Grau",
                        Big: false
                    },
                    secondary2: {
                        Label: "Sekundär 2!",
                        Visible: true,
                        ToolTip: "2",
                        Color: "Grau",
                        Big: false
                    },
                    secondary3: {
                        Label: "Sekundär 3!",
                        Visible: true,
                        ToolTip: "3",
                        Color: "Grau",
                        Big: false
                    },
                    fecondary4: {
                        Label: "Sekundär 4!",
                        Visible: true,
                        ToolTip: "4",
                        Color: "Grau",
                        Big: false
                    },
                    SecondaryLabel: "Sekundär"
                });
                
                //this.getView().setModel(model, "data");
                this.setModel(model, "data");

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);