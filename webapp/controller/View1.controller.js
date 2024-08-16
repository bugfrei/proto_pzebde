var controller = null;
const styleClasses = [
    "BtnBlau",
    "BtnGrau",
    "BtnDunkelblau",
    "BtnInnerNormalPrim",
    "BtnNormalPrim",
    "BtnInnerBigPrim",
    "BtnBigPrim",
    "BtnInnerNormalSec",
    "BtnNormalSec",
    "BtnInnerBigSec",
    "BtnBigSec"
];
var buttons = {
    pl: "",
    pr: "",
    p1: "",
    p2: "",
    p3: "",
    p4: ""
}
const PZETYPES = {
    DIENSTGANG: "A008",
    STANDARD: "A002",
    KUNDE: "A003"
}
const BTNTYPES = {
    KOMMEN: "Kommen",
    GEHEN: "Gehen",
    MONTAGE: "Montage / Reisezeit",
    MONTAGE_KUNDE: "Montage / Reisezeit (Kunde)",
    MONTAGE_NICHTKUNDE: "Montage / Reisezeit (Nicht-Kunde)",
    DIENSTGANG: "Dienstgang",
    DIENSTGANGENDE: "Dienstgang Ende",
    KOMMEN_KORREKTUR: "Kommen Korrektur",
    GEHEN_KORREKTUR: "Gehen Korrektur",
    PAUSE_KORREKTUR: "Pause Korrektur",
    PAUSENENDE_KORREKTUR: "Pausenende Korrektur",
    PAUSE: "Pause",
    PAUSENENDE: "Pausenende",
    VORGANG_UNTERBRECHEN: "Vorgang unterbrechen",
    VORGANG_BEENDEN: "Vorgang beenden",
    ABBRUCH: "Abbruch",
    VORGANG_FORTSETZEN: "Vorgang fortsetzen",
    VORGANG_NICHTFORT: "Vorgang nicht fortsetzen"
}
const STATES = {
    "NORMAL_ABWESEND": "Normal abwesend",
    "NORMAL_ANWESEND": "Normal anwesend"

};
sap.ui.define( [
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function( Controller ) {
        "use strict";

        return Controller.extend( "project1.controller.View1", {
            onInit: function() {

            },
            onAfterRendering: function() {
                controller = this;
                this.getView().addStyleClass( "sapUiSizeCozy" );
                var oModel = this.getOwnerComponent().getModel( "data" );
                this.model = oModel;
                this.szenarien = oModel.getProperty( "/Szenarien" );
                this.schritte = oModel.getProperty( "/Schritte" );
                this.log = oModel.getProperty( "/Log" );
                this.settings = oModel.getProperty( "/Settings" );
                this.montage = oModel.getProperty( "/Montage" );
                this.bdevorgang = oModel.getProperty( "/BDEVorgang" );
                this.bdebuchungen = oModel.getProperty( "/BDEBuchungen" );

                this.initAll();
            },
            onNavBack: function() {
                var nc = this.getView().byId("app");
                var p2 = this.getView().byId("korrektur");
                nc.to(p2);

            },
            onSSPBuchen: function() {
                var ssp = this.model.getProperty( "/SSP" );
                var dp = this.getView().byId("ssp_date");
                var tp = this.getView().byId("ssp_time");
                var datum = dp.getDateValue();
                if (typeof datum === "string") {
                    datum = datum.split(".");
                    datum = new Date(datum[2], datum[1] - 1, datum[0]);
                }
                var zeitpunkt = {
                    datum: datum,
                    zeit: tp.getValue()
                }
                this.createPZE(ssp.Ereignistyp, PZETYPES.STANDARD, ssp.Pause, zeitpunkt);
                if (ssp.Pause) {
                    if (ssp.Ereignistyp == "Kommen") {
                        this.addLog("Pausenende nachgebucht (Kommen)");
                    }
                    else {
                        this.addLog("Pause nachgebucht (Gehen)");
                    }
                }
                else {
                    if (ssp.Ereignistyp == "Kommen") {
                        this.addLog("Kommen nachgebucht");
                    }
                    else {
                        this.addLog("Gehen nachgebucht");
                    }
                }
                            var nc = this.getView().byId("app");
                            var p1 = this.getView().byId("pzebde");
                            nc.to(p1);
                            this.initAll();
            },
            onSSPAbbruch: function() {
                            var nc = this.getView().byId("app");
                            var p1 = this.getView().byId("pzebde");
                            nc.to(p1);
            },
            zeitpunktToDate: function( zeitpunkt ) {
                return this.datumZeitToDate( zeitpunkt.datum, zeitpunkt.zeit );
            },
            datumZeitToDate: function( datum, zeit ) {
                if (typeof datum === "string") {
                    var a = datum.split( "." );
                    var d = new Date( a[ 2 ], a[ 1 ] - 1, a[ 0 ] );
                }
                else {
                    var d = datum;
                }
                a = zeit.split( ":" );
                d.setHours( a[ 0 ] );
                d.setMinutes( a[ 1 ] );
                d.setSeconds( a[ 2 ] );
                return d;
            },
            setButton: function( btn, visible, label, tooltip, color, big ) {
                switch ( btn ) {
                    case "l":
                        btn = "primaryLeft";
                        break;
                    case "r":
                        btn = "primaryRight";
                        break;
                    case "1":
                        btn = "secondary1";
                        break;
                    case "2":
                        btn = "secondary2";
                        break;
                    case "3":
                        btn = "secondary3";
                        break;
                    case "4":
                        btn = "secondary4";
                        break;
                }
                if ( btn.startsWith( "!" ) ) {
                    var exclusive = btn.substring( 1 );
                    switch ( exclusive ) {
                        case "l":
                            exclusive = "primaryLeft";
                            break;
                        case "r":
                            exclusive = "primaryRight";
                            break;
                        case "1":
                            exclusive = "secondary1";
                            break;
                        case "2":
                            exclusive = "secondary2";
                            break;
                        case "3":
                            exclusive = "secondary3";
                            break;
                        case "4":
                            exclusive = "secondary4";
                            break;
                    }
                    var all = [ "primaryLeft", "primaryRight", "secondary1", "secondary2", "secondary3", "secondary4" ];
                    for ( var b of all ) {
                        if ( b != exclusive ) {
                            this.setButton( b, false );
                        }
                    }
                }
                else {
                    var prop = {
                        Label: label,
                        Visible: visible,
                        Tooltip: tooltip,
                        Color: color,
                        Big: big
                    };
                    this.model.setProperty( `/${ btn }`, prop );
                }
            },
            getStatus: function() {
                // Statusermittlung und definieren der Buttons
                var anwesend = false;
                var pause = false;
                var code = "";
                var montage = false;
                var preCmd = "";
                var bdevorgang = this.model.getProperty( "/BDEVorgang" );
                if (bdevorgang.Zeitpunkt != null && (bdevorgang.Status == "aktiv" || bdevorgang.Status == "unterbrochen")) {
                    preCmd = bdevorgang.preCmd;
                }
                var lastBuchung = {
                    Typ: null,
                    Zeitpunkt: null
                };
                var pzebuchungen = this.model.getProperty( "/PZEBuchungen" );
                for ( var pzeBuchung of pzebuchungen ) {
                    var buchungDate = this.zeitpunktToDate( pzeBuchung.Zeitpunkt );
                    if ( lastBuchung.Zeitpunkt == null || buchungDate >= this.zeitpunktToDate(lastBuchung.Zeitpunkt) ) {
                        lastBuchung = pzeBuchung;
                    }
                }
                anwesend = lastBuchung.Typ == "Kommen";
                pause = lastBuchung.Pause;
                code = lastBuchung.Kennung;
                var mon = this.model.getProperty( "/Montage" );
                montage = mon.Zeitpunkt != null;

                return {
                    anwesend: anwesend,
                    pause: pause,
                    code: code,
                    montage: montage,
                    preCmd: preCmd
                };
            },
            createPZE: function (typ, code, pause, zeitpunkt) {
                if (!zeitpunkt) {
                    zeitpunkt = this.getDateTime();
                }
                var pze = {
                    Typ: typ,
                    Kennung: code,
                    Pause: pause,
                    Zeitpunkt: zeitpunkt,
                    Datum: zeitpunkt.datum.toLocaleDateString()
                };
                var pzebuchungen = this.model.getProperty( "/PZEBuchungen" );
                pzebuchungen.push(pze);
                this.model.setProperty("/PZEBuchungen", pzebuchungen);
                this.addLog(`PZE ${typ} gebucht`);
            },
            btnPress: function( type, ignoreBDE ) {
                var ssp = this.model.getProperty( "/SSP" );
                var { anwesend, pause } = this.getStatus();
                var bdevorgang = this.model.getProperty( "/BDEVorgang" );
                var bdeexists = bdevorgang.Zeitpunkt != null && bdevorgang.Status == "aktiv";
                var bdebreak = bdevorgang.Zeitpunkt != null && bdevorgang.Status == "unterbrochen";
                switch (type) {
                    case BTNTYPES.KOMMEN:
                        if (bdebreak && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.KOMMEN );
                            break;
                        }
                        this.createPZE("Kommen", PZETYPES.STANDARD, false);
                        break;
                    case BTNTYPES.GEHEN:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.GEHEN );
                            break;
                        }
                        this.createPZE("Gehen", PZETYPES.STANDARD, false);
                        break;
                    case BTNTYPES.PAUSE:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.PAUSE );
                            break;
                        }
                        this.createPZE("Gehen", PZETYPES.STANDARD, true);
                        break;
                    case BTNTYPES.PAUSENENDE:
                        if (bdebreak && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.PAUSENENDE );
                            break;
                        }
                        this.createPZE("Kommen", PZETYPES.STANDARD, true);
                        break;
                    case BTNTYPES.VORGANG_UNTERBRECHEN:
                        this.model.setProperty( "/BDEVorgang/Status", "unterbrochen" );
                        var preCmd = this.model.getProperty( "/BDEVorgang/preCmd" );
                        this.model.setProperty( "/BDEVorgang/preCmd", "" );
                        this.addLog( "BDE Vorgang unterbrochen" );
                        this.btnPress( preCmd, true );
                        return;
                    case BTNTYPES.VORGANG_BEENDEN:
                        var preCmd = this.model.getProperty( "/BDEVorgang/preCmd" );
                        this.model.setProperty( "/BDEVorgang", 
                        { 
                            Typ: "", 
                            Status: "", 
                            Zeitpunkt: null,
                            preCmd: ""
                        } );
                        this.model.setProperty( "/BDEVorgang/preCmd", "" );
                        this.addLog( "BDE Vorgang beendet" );
                        this.btnPress( preCmd, true );
                        return;
                    case BTNTYPES.VORGANG_FORTSETZEN:
                        this.model.setProperty( "/BDEVorgang/Status", "aktiv" );
                        var preCmd = this.model.getProperty( "/BDEVorgang/preCmd" );
                        this.model.setProperty( "/BDEVorgang/preCmd", "" );
                        this.addLog( "BDE Vorgang fortgesetzt" );
                        this.btnPress( preCmd, true );
                        return;
                    case BTNTYPES.VORGANG_NICHTFORT:
                        var preCmd = this.model.getProperty( "/BDEVorgang/preCmd" );
                        this.model.setProperty( "/BDEVorgang/preCmd", "" );
                        this.addLog( "BDE Vorgang nicht fortgesetzt" );
                        this.btnPress( preCmd, true );
                        return;
                    case BTNTYPES.ABBRUCH:
                        this.model.setProperty( "/BDEVorgang/preCmd", "" );
                    break;
                    case BTNTYPES.MONTAGE:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.MONTAGE );
                            break;
                        }
                        if (anwesend) {
                            this.createPZE("Gehen", PZETYPES.STANDARD, pause);
                        }
                        var montage = {
                            Zeitpunkt: this.getDateTime()
                        };
                        this.model.setProperty("/Montage", montage);

                        break;
                    case BTNTYPES.MONTAGE_KUNDE:
                        var mon = this.model.getProperty("/Montage");
                        this.createPZE("Kommen", PZETYPES.KUNDE, false, mon.Zeitpunkt);
                        this.createPZE("Gehen", PZETYPES.KUNDE, false);

                        mon = { Zeitpunkt: null };
                        this.model.setProperty("/Montage", mon);
                        break;
                    case BTNTYPES.MONTAGE_NICHTKUNDE:
                        var mon = this.model.getProperty("/Montage");
                        this.createPZE("Kommen", PZETYPES.STANDARD, false, mon.Zeitpunkt);
                        this.createPZE("Gehen", PZETYPES.STANDARD, false);

                        mon = { Zeitpunkt: null };
                        this.model.setProperty("/Montage", mon);
                        break;
                    case BTNTYPES.DIENSTGANG:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.DIENSTGANG );
                            break;
                        }
                        if (anwesend) {
                            this.createPZE("Gehen", PZETYPES.STANDARD, pause);
                        }
                        this.createPZE("Kommen", PZETYPES.DIENSTGANG, false);
                        break;
                    case BTNTYPES.DIENSTGANGENDE:
                        this.createPZE("Gehen", PZETYPES.DIENSTGANG, false);
                        break;
                    case BTNTYPES.KOMMEN_KORREKTUR:
                        if (bdebreak && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.KOMMEN_KORREKTUR );
                            break;
                        }
                        ssp.Ereignistyp = "Kommen";
                        ssp.Pause = false;
                        var dp = this.getView().byId("ssp_date");
                        var tp = this.getView().byId("ssp_time");
                        var dt = this.getDateTime();
                        dp.setDateValue(dt.datum);
                        tp.setValue(dt.zeit);
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.GEHEN_KORREKTUR:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.GEHEN_KORREKTUR );
                            break;
                        }
                        ssp.Ereignistyp = "Gehen";
                        ssp.Pause = false;
                        var dp = this.getView().byId("ssp_date");
                        var tp = this.getView().byId("ssp_time");
                        var dt = this.getDateTime();
                        dp.setDateValue(dt.datum);
                        tp.setValue(dt.zeit);
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.PAUSE_KORREKTUR:
                        if (bdeexists && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.PAUSE_KORREKTUR );
                            break;
                        }
                        ssp.Ereignistyp = "Gehen";
                        ssp.Pause = true;
                        var dp = this.getView().byId("ssp_date");
                        var tp = this.getView().byId("ssp_time");
                        var dt = this.getDateTime();
                        dp.setDateValue(dt.datum);
                        tp.setValue(dt.zeit);
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.PAUSENENDE_KORREKTUR:
                        if (bdebreak && !ignoreBDE) {
                            this.model.setProperty( "/BDEVorgang/preCmd", BTNTYPES.PAUSENENDE_KORREKTUR );
                            break;
                        }
                        ssp.Ereignistyp = "Kommen";
                        ssp.Pause = true;
                        var dp = this.getView().byId("ssp_date");
                        var tp = this.getView().byId("ssp_time");
                        var dt = this.getDateTime();
                        dp.setDateValue(dt.datum);
                        tp.setValue(dt.zeit);
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                }
                this.initAll();
            },
            onPrimaryLeft: function() {
                this.btnPress(buttons.pl);
            },
            onPrimaryRight: function() {
                this.btnPress(buttons.pr);
            },
            onSecondary1: function() {
                this.btnPress(buttons.p1);
            },
            onSecondary2: function() {
                this.btnPress(buttons.p2);
            },
            onSecondary3: function() {
                this.btnPress(buttons.p3);
            },
            onSecondary4: function() {
                this.btnPress(buttons.p4);
            },
            secDefault: function( b3, b3Tooltip, b4, b4Tooltip) {
                // Montage / Reisezeit | Dienstgang | KOMMEN korrektur
                this.setButton( "1", true, "Montage / Reisezeit", "Montage / Reisezeit", "Dunkelblau", false );
                this.setButton( "2", true, "Dienstgang", "Dienstgang", "Dunkelblau", false );
                this.setButton( "3", true, b3, b3Tooltip, "Grau", false );
                this.setButton( "4", true, b4, b4Tooltip, "Grau", false );
            },
            initAll: function() {
                const { anwesend, pause, code, montage, preCmd } = this.getStatus();
                // Status setzen
                this.model.setProperty( "/PrimaryLabel", "");
                if ( montage ) {
                    this.setButton( "!l" );
                    this.setButton( "l", true, "BEIM KUNDEN", "Montage/Reisezeit beim Kunden", "Blau", true );
                    this.setButton( "r", true, "NICHT BEIM KUNDEN", "Montage/Reisezeit nicht beim Kunden", "Blau", true );
                    this.setStatus( "Montage / Reisezeit", "", "" );
                    this.setButton( "1", false);
                    this.setButton( "2", false);
                    this.setButton( "3", false);
                    this.setButton( "4", false);
                    buttons.pl = BTNTYPES.MONTAGE_KUNDE;
                    buttons.pr = BTNTYPES.MONTAGE_NICHTKUNDE;
                    buttons.p1 = "";
                    buttons.p2 = "";
                    buttons.p3 = "";
                    buttons.p4 = "";
                }
                else {
                    if ( anwesend ) {
                        if (code == PZETYPES.STANDARD || code == PZETYPES.KUNDE) {
                            this.setButton( "!l" );
                            this.setButton( "l", true, "GEHEN", "Standard Gehen Buchung", "Blau", true );
                            this.setButton( "r", true, "PAUSE", "Pause buchen", "Blau", true );
                            this.setStatus( "Anwesend", "", "" );
                            this.secDefault( "GEHEN Korrektur", "Gehenbuchung nachträglich durchführen", "PAUSE Korrektur", "Pause nachträglich buchen");
                            buttons.pl = BTNTYPES.GEHEN;
                            buttons.pr = BTNTYPES.PAUSE;
                            buttons.p1 = BTNTYPES.MONTAGE;
                            buttons.p2 = BTNTYPES.DIENSTGANG;
                            buttons.p3 = BTNTYPES.GEHEN_KORREKTUR;
                            buttons.p4 = BTNTYPES.PAUSE_KORREKTUR;
                        }
                        else if (code == PZETYPES.DIENSTGANG) {
                            this.setButton( "!l" );
                            this.setButton( "l", true, "DIENSTGANG ENDE", "Ende Dienstgang (Ankunft) buchen", "Blau", true );
                            this.setStatus( "Dienstgang", "", "" );
                            this.setButton( "1", false);
                            this.setButton( "2", false);
                            this.setButton( "3", false);
                            this.setButton( "4", false);
                            buttons.pl = BTNTYPES.DIENSTGANGENDE;
                            buttons.pr = "";
                            buttons.p1 = "";
                            buttons.p2 = "";
                            buttons.p3 = "";
                            buttons.p4 = "";
                        }
                    }
                    else if (!anwesend && !pause) {
                        this.setButton( "l", true, "KOMMEN", "Standard Kommen Buchung", "Blau", true );
                        this.setButton( "!l" );
                        this.setStatus( "Abwesend", "", "" );
                        this.secDefault( "KOMMEN Korrektur", "Kommenbuchung nachträglich durchführen", "", "");
                        buttons.pl = BTNTYPES.KOMMEN;
                        buttons.pr = "";
                        buttons.p1 = BTNTYPES.MONTAGE;
                        buttons.p2 = BTNTYPES.DIENSTGANG;
                        buttons.p3 = BTNTYPES.KOMMEN_KORREKTUR;
                        buttons.p4 = "";
                    }
                    else if (!anwesend && pause) {
                        this.setButton( "!l" );
                        this.setButton( "l", true, "PAUSENENDE", "Pausenende buchen", "Blau", true );
                        this.setStatus( "in Pause", "", "" );
                        this.secDefault( "", "", "PAUSENENDE Korrektur", "Pausenende nachträglich buchen");
                        buttons.pl = BTNTYPES.PAUSENENDE;
                        buttons.pr = "";
                        buttons.p1 = BTNTYPES.MONTAGE;
                        buttons.p2 = BTNTYPES.DIENSTGANG;
                        buttons.p3 = "";
                        buttons.p4 = BTNTYPES.PAUSENENDE_KORREKTUR;
                    }   
                }
                if (preCmd != "") {
                    // Bedeutet das ein vorheriger Befehl die BDE Buttons anzeigen lässt
                    if (preCmd == BTNTYPES.GEHEN || preCmd == BTNTYPES.PAUSE || preCmd == BTNTYPES.PAUSENENDE_KORREKTUR || preCmd == BTNTYPES.GEHEN_KORREKTUR || preCmd == BTNTYPES.MONTAGE || preCmd == BTNTYPES.DIENSTGANG) {
                        this.model.setProperty( "/PrimaryLabel", "BDE Vorgang aktiv! Diese Vorgang");
                        this.setButton( "!l" );
                        this.setButton( "l", true, "UNTERBRECHEN", "Aktiven Vorgang vorrübergehend unterbrechen.", "Blau", true );
                        this.setButton( "r", true, "BEENDEN", "Aktiven Vorgang dauerhaft beenden.", "Blau", true );
                        this.setButton( "1", true, "Abbruch", "Vorheriger Buchungswunsch abbrechen", "Dunkelblau", false );
                        this.setButton( "2", false);
                        this.setButton( "3", false);
                        this.setButton( "4", false);
                        buttons.pl = BTNTYPES.VORGANG_UNTERBRECHEN;
                        buttons.pr = BTNTYPES.VORGANG_BEENDEN;
                        buttons.p1 = BTNTYPES.ABBRUCH;
                        buttons.p2 = "";
                        buttons.p4 = "";
                        buttons.p3 = "";
                    }
                    else {
                        this.model.setProperty( "/PrimaryLabel", "Pausiertet BDE Vorgang vorhanden! Dieses Vorgang");
                        this.setButton( "!l" );
                        this.setButton( "l", true, "FORTSETZEN", "Pausierten Vorgang fortsetzen.", "Blau", true );
                        this.setButton( "r", true, "NICHT FORTSETZEN", "Pausierten Vorgang pausiert lassen.", "Blau", true );
                        this.setButton( "1", true, "Abbruch", "Vorheriger Buchungswunsch abbrechen", "Dunkelblau", false );
                        this.setButton( "2", true, "BEENDEN", "Aktiven Vorgang dauerhaft beenden.", "Blau", false );
                        this.setButton( "3", false);
                        this.setButton( "4", false);
                        buttons.pl = BTNTYPES.VORGANG_FORTSETZEN;
                        buttons.pr = BTNTYPES.VORGANG_NICHTFORT;
                        buttons.p1 = BTNTYPES.ABBRUCH;
                        buttons.p2 = BTNTYPES.VORGANG_BEENDEN;
                        buttons.p4 = "";
                        buttons.p3 = "";
                    }
                }
                // Buttons initialisieren
                const btns = [
                    "primaryLeft",
                    "primaryRight",
                    "secondary1",
                    "secondary2",
                    "secondary3",
                    "secondary4"
                ];
                for ( var btnName of btns ) {
                    const btn = this.byId( btnName );
                    const prop = this.model.getProperty( `/${ btnName }` );
                    for ( var className of styleClasses ) {
                        btn.removeStyleClass( className );
                    }
                    btn.addStyleClass( `Btn${ prop.Color }` );
                    if ( btnName.startsWith( "primary" ) ) {

                        if ( prop.Big ) {
                            btn.addStyleClass( "BtnInnerBigPrim" );
                            btn.addStyleClass( "BtnBigPrim" );
                        }
                        else {
                            btn.addStyleClass( "BtnInnerNormalPrim" );
                            btn.addStyleClass( "BtnNormalPrim" );
                        }
                    }
                    else {
                        if ( prop.Big ) {
                            btn.addStyleClass( "BtnInnerBigSec" );
                            btn.addStyleClass( "BtnBigSec" );
                        }
                        else {
                            btn.addStyleClass( "BtnInnerNormalSec" );
                            btn.addStyleClass( "BtnNormalSec" );
                        }
                    }
                }
            },
            setStatus: function( status, primaryTitle, secondaryTitle ) {
                this.model.setProperty( "/Status", status );
                this.model.setProperty( "/PrimaryLabel", primaryTitle );
                this.model.setProperty( "/SecondaryLabel", secondaryTitle );
            },

            onCmbSzenarien: function( e ) {
                var nr = e.oSource.getSelectedKey();
                this.schritte = this.szenarien.filter( e => e.Nr == nr )[ 0 ].Schritte;
                this.model.setProperty( "/Schritte", this.schritte );
                nr = `${ nr }.1`;
                var schritteCombo = this.byId( "cbSchritte" );
                schritteCombo.setSelectedKey( nr );
                this.onCmdSchritte( { oSource: schritteCombo } );
            },
            onCmdSchritte: function( e ) {
                var nr = e.oSource.getSelectedKey();
                var schritt = this.schritte.filter( e => e.Nr == nr )[ 0 ];
                if ( schritt ) {
                    this.model.setProperty( "/SchrittBeschreibung", schritt.Beschreibung );
                    switch ( schritt.Nr ) {
                        case "1.1":
                            this.setDateTime( "01.08.2024", "08:00:00" );
                            break;
                        case "2.1":
                            this.setDateTime( "01.08.2024", "08:00:00" );
                            break;
                        case "2.2":
                            this.setDateTime( "01.08.2024", "17:00:00" );
                            break;
                        case "3.1":
                            this.setDateTime( "01.08.2024", "08:00:00" );
                            break;
                        case "3.2":
                            this.setDateTime( "01.08.2024", "13:00:00" );
                            break;
                    }
                }
                else {
                    this.model.setProperty( "/SchrittBeschreibung", "" );
                }
            },
            onPressSchritt: function() {
                var schritteCombo = this.byId( "cbSchritte" );
                var nr = schritteCombo.getSelectedKey().split( "." );
                nr[ 1 ] = Number( nr[ 1 ] ) + 1;
                nr = nr.join( "." );
                schritteCombo.setSelectedKey( nr );
                this.onCmdSchritte( { oSource: schritteCombo } );
            },
            onPressPlus1Tag: function() {
                var { datum } = this.getDateTime();
                datum.setDate( datum.getDate() + 1 );
                this.setDateTime( this.formatDate( datum ) );
            },
            onPressMinus1Tag: function() {
                var { datum } = this.getDateTime();
                datum.setDate( datum.getDate() - 1 );
                this.setDateTime( this.formatDate( datum ) );
            },
            onPress8Uhr: function() {
                this.setDateTime( null, "08:00:00" );
            },
            onPress10Uhr: function() {
                this.setDateTime( null, "10:00:00" );
            },
            onPress12Uhr: function() {
                this.setDateTime( null, "12:00:00" );
            },
            onPress14Uhr: function() {
                this.setDateTime( null, "14:00:00" );
            },
            onPress16Uhr: function() {
                this.setDateTime( null, "16:00:00" );
            },
            onPress18Uhr: function() {
                this.setDateTime( null, "18:00:00" );
            },
            onPressPlus2h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 2, 0 );
                this.setDateTime( null, zeit );
            },
            onPressPlus1h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 1, 0 );
                this.setDateTime( null, zeit );
            },
            onPressPlus30m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 30 );
                this.setDateTime( null, zeit );
            },
            onPressPlus15m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 15 );
                this.setDateTime( null, zeit );
            },
            onPressPlus5m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 5 );
                this.setDateTime( null, zeit );
            },
            onPressPlus1m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 1 );
                this.setDateTime( null, zeit );
            },
            onPressMinus2h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, -2, 0 );
                this.setDateTime( null, zeit );
            },
            onPressMinus1h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, -1, 0 );
                this.setDateTime( null, zeit );
            },
            onPressMinus30m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -30 );
                this.setDateTime( null, zeit );
            },
            onPressMinus15m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -15 );
                this.setDateTime( null, zeit );
            },
            onPressMinus5m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -5 );
                this.setDateTime( null, zeit );
            },
            onPressMinus1m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -1 );
                this.setDateTime( null, zeit );
            },
            onPressLeeren: function() {
                this.model.setProperty( "/Log", [] );
            },
            onPressReset: function() {
                this.onPressLeeren();
                this.model.setProperty( "/BDEVorgang", 
                    { 
                        Typ: "", 
                        Status: "", 
                        Zeitpunkt: null,
                        preCmd: ""
                    } );
                this.model.setProperty( "/BDEBuchungen", [] );
                this.model.setProperty( "/PZEBuchungen", [] );
                this.model.setProperty( "/Montage", { Zeitpunkt: null } );
                this.setDateTime( "01.08.2024", "08:00:00" );
                var nc = this.getView().byId("app");
                var p1 = this.getView().byId("pzebde");
                nc.to(p1);
                this.initAll();
            },
            createBDE: function( typ, status, zeitpunkt ) {
                this.model.setProperty( "/BDEVorgang", { Typ: typ, Status: status, Zeitpunkt: zeitpunkt, preCmd: "" } );
                this.addLog( `BDEVorgang ${ typ } ${ status }` );
            },
            onPressBDEVorgangErstellen: function() {
              this.createBDE( "X123", "aktiv", this.getDateTime() );
            },
            addLog( text ) {
                var log = this.model.getProperty( "/Log" );
                log.push( { Nr: log.length + 1, Text: text } );
                this.model.setProperty( "/Log", log );
            },
            addTimeHM( t, h, m ) {
                var a = t.split( ":" );
                var h1 = Number( a[ 0 ] ) + h;
                var m1 = Number( a[ 1 ] ) + m;
                if ( m1 >= 60 ) {
                    h1++;
                    m1 -= 60;
                }
                if ( m1 < 0 ) {
                    h1--;
                    m1 += 60;
                }
                if ( h1 >= 24 ) {
                    h1 -= 24;
                    this.onPressPlus1Tag();
                }
                if ( h1 < 0 ) {
                    h1 += 24;
                    this.onPressMinus1Tag();
                }
                return `${ this.paddingTo2Digits( h1 ) }:${ this.paddingTo2Digits( m1 ) }:00`; k;
            },
            paddingTo2Digits( n ) {
                return n.toString().padStart( 2, "0" );
            },
            formatDate( d ) {
                return `${ this.paddingTo2Digits( d.getDate() ) }.${ this.paddingTo2Digits( d.getMonth() + 1 ) }.${ d.getFullYear() }`;
            },
            getDateTime() {
                var datum = controller.byId( "datum" ).getValue();
                var zeit = controller.byId( "zeit" ).getValue();

                var datumA = datum.split( "." );
                datum = new Date( datumA[ 2 ], datumA[ 1 ] - 1, datumA[ 0 ] );
                return { datum: datum, zeit: zeit };
            },

            setDateTime( d, t ) {
                if ( d ) {
                    this.settings.Datum = d;
                }
                if ( t ) {
                    this.settings.Zeit = t;
                }
                this.model.setProperty( "/Settings", this.settings );
            }
        } );
    } );
