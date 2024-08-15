var controller = null;
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
                this.pzebuchungen = oModel.getProperty( "/PZEBuchungen" );
            },
            onNavBack: function() {
                alert( "Ohne Funktion" );
                debugger;
            },
            onCmbSzenarien: function( e ) {
                var nr = e.oSource.getSelectedKey();
                this.schritte = this.szenarien.filter( e => e.Nr == nr )[ 0 ].Schritte;
                this.model.setProperty( "/Schritte", this.schritte );
                nr = `${nr}.1`;
                var schritteCombo = this.byId( "cbSchritte" );
                schritteCombo.setSelectedKey( nr );
                this.onCmdSchritte( { oSource: schritteCombo } );
            },
            onCmdSchritte: function( e ) {
                var nr = e.oSource.getSelectedKey();
                var schritt = this.schritte.filter( e => e.Nr == nr )[ 0 ];
                if (schritt) {
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
                var nr = schritteCombo.getSelectedKey().split(".");
                nr[1] = Number( nr[1] ) + 1;
                nr = nr.join(".");
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
                this.setDateTime(null, zeit);
            },
            onPressPlus1h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 1, 0 );
                this.setDateTime(null, zeit);
            },
            onPressPlus30m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 30 );
                this.setDateTime(null, zeit);
            },
            onPressPlus15m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 15 );
                this.setDateTime(null, zeit);
            },
            onPressPlus5m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 5 );
                this.setDateTime(null, zeit);
            },
            onPressPlus1m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, 1 );
                this.setDateTime(null, zeit);
            },
            onPressMinus2h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, -2, 0 );
                this.setDateTime(null, zeit);
            },
            onPressMinus1h: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, -1, 0 );
                this.setDateTime(null, zeit);
            },
            onPressMinus30m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -30 );
                this.setDateTime(null, zeit);
            },
            onPressMinus15m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -15 );
                this.setDateTime(null, zeit);
            },
            onPressMinus5m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -5 );
                this.setDateTime(null, zeit);
            },
            onPressMinus1m: function() {
                var { zeit } = this.getDateTime();
                zeit = this.addTimeHM( zeit, 0, -1 );
                this.setDateTime(null, zeit);
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
                if (m1 < 0) {
                    h1--;
                    m1 += 60;
                }
                if (h1 >= 24) {
                    h1 -= 24;
                    this.onPressPlus1Tag();
                }
                if (h1 < 0) {
                    h1 += 24;
                    this.onPressMinus1Tag();
                }
                return `${this.paddingTo2Digits( h1 )}:${this.paddingTo2Digits( m1 )}:00`;k
            },
            paddingTo2Digits( n) {
                return n.toString().padStart( 2, "0" );
            },
            formatDate( d) {
                return `${this.paddingTo2Digits( d.getDate() )}.${this.paddingTo2Digits( d.getMonth() + 1 )}.${d.getFullYear()}`;
            },
            getDateTime() {
                var datum = controller.byId("datum").getValue();
                var zeit = controller.byId("zeit").getValue();

                var datumA = datum.split(".");
                datum = new Date(datumA[2], datumA[1] - 1, datumA[0]);
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
