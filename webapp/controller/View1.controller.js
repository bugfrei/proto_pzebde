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
const BTNTYPES = {
    KOMMEN: "Kommen",
    GEHEN: "Gehen",
    MONTAGE: "Montage / Reisezeit",
    DIENSTGANG: "Dienstgang",
    KOMMEN_KORREKTUR: "Kommen Korrektur",
    GEHEN_KORREKTUR: "Gehen Korrektur",
    PAUSE_KORREKTUR: "Pause Korrektur",
    PAUSENENDE_KORREKTUR: "Pausenende Korrektur",
    PAUSE: "Pause",
    PAUSENENDE: "Pausenende"
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

                return {
                    anwesend: anwesend,
                    pause: pause
                };
            },
            createPZE: function (typ, pause) {
                var pze = {
                    Typ: typ,
                    Pause: pause,
                    Zeitpunkt: this.getDateTime()
                };
                var pzebuchungen = this.model.getProperty( "/PZEBuchungen" );
                pzebuchungen.push(pze);
                this.model.setProperty("/PZEBuchungen", pzebuchungen);
                this.addLog(`PZE ${typ} gebucht`);
            },
            btnPress: function( type ) {
                var ssp = this.model.getProperty( "/SSP" );
                switch (type) {
                    case BTNTYPES.KOMMEN:
                        this.createPZE("Kommen", false);
                        break;
                    case BTNTYPES.GEHEN:
                        this.createPZE("Gehen", false);
                        break;
                    case BTNTYPES.PAUSE:
                        this.createPZE("Gehen", true);
                        break;
                    case BTNTYPES.PAUSENENDE:
                        this.createPZE("Kommen", true);
                        break;
                    case BTNTYPES.MONTAGE:
                        break;
                    case BTNTYPES.DIENSTGANG:
                        break;
                    case BTNTYPES.KOMMEN_KORREKTUR:
                        ssp.Ereignistyp = "Kommen";
                        ssp.Pause = false;
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.GEHEN_KORREKTUR:
                        ssp.Ereignistyp = "Gehen";
                        ssp.Pause = false;
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.PAUSE_KORREKTUR:
                        ssp.Ereignistyp = "Gehen";
                        ssp.Pause = true;
                        this.model.setProperty("/SSP", ssp);
                        var nc = this.getView().byId("app");
                        var p2 = this.getView().byId("korrektur");
                        nc.to(p2);
                        break;
                    case BTNTYPES.PAUSENENDE_KORREKTUR:
                        ssp.Ereignistyp = "Kommen";
                        ssp.Pause = true;
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
                const { anwesend, pause } = this.getStatus();
                // Status setzen
                if ( anwesend && !pause) {
                    this.setButton( "!l" );
                    this.setButton( "l", true, "GEHEN", "Standard Gehen Buchung", "Blau", true );
                    this.setButton( "r", true, "PAUSE", "Pause buchen", "Blau", true );
                    this.setStatus( "Anwensend", "", "" );
                    this.secDefault( "GEHEN Korrektur", "Gehenbuchung nachträglich durchführen", "PAUSE Korrektur", "Pause nachträglich buchen");
                    buttons.pl = BTNTYPES.GEHEN;
                    buttons.pr = BTNTYPES.PAUSE;
                    buttons.p1 = BTNTYPES.MONTAGE;
                    buttons.p2 = BTNTYPES.DIENSTGANG;
                    buttons.p3 = BTNTYPES.GEHEN_KORREKTUR;
                    buttons.p4 = BTNTYPES.PAUSE_KORREKTUR;
                }
                else if (!anwesend && !pause) {
                    this.setButton( "l", true, "KOMMEN", "Standard Kommen Buchung", "Blau", true );
                    this.setButton( "!l" );
                    this.setStatus( "Abwesend", "", "" );
                    this.secDefault( "KOMMEN Korrektur", "Kommenbuchung nachträglich durchführen", "PAUSENENDE Korrektur", "Pausenende nachträglich buchen");
                    buttons.pl = BTNTYPES.KOMMEN;
                    buttons.pr = "";
                    buttons.p1 = BTNTYPES.MONTAGE;
                    buttons.p2 = BTNTYPES.DIENSTGANG;
                    buttons.p3 = BTNTYPES.KOMMEN_KORREKTUR;
                    buttons.p4 = BTNTYPES.PAUSENENDE_KORREKTUR
                }
                else if (anwesend && pause) {

                }
                else if (!anwesend && pause) {
                        
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
                this.model.setProperty( "/BDEVorgang", { Typ: "", Status: "", Zeitpunkt: null } );
                this.model.setProperty( "/BDEBuchungen", [] );
                this.model.setProperty( "/PZEBuchungen", [] );
                this.model.setProperty( "/Montage", { Zeitpunkt: null } );
                this.setDateTime( "01.08.2024", "08:00:00" );
                this.initAll();
            },
            onPressBDEVorgangErstellen: function() {
                this.model.setProperty( "/BDEVorgang", { Typ: "Vorhanden", Status: "Erstellt", Zeitpunkt: this.getDateTime() } );
                this.addLog( "BDEVorgang erstellt" );
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
