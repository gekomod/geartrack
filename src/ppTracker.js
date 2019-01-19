'use strict';

const request = require('requestretry')
const utils = require('./utils')
const moment = require('moment-timezone')
const soap = require('soap')
const zone = "Europe/Berlin"

var header = "<wsse:Security xmlns:wsse='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'><wsse:UsernameToken xmlns:wsse='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'><wsse:Username>sledzeniepp</wsse:Username><wsse:Password Type='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText'>PPSA</wsse:Password></wsse:UsernameToken></wsse:Security>"; 
var NAMESPACE = "http://sledzenie.pocztapolska.pl";

const URL = 'https://tt.poczta-polska.pl/Sledzenie/services/Sledzenie?wsdl'

const exportModule = {}

/**
 * Get Poczta Polska tracker info
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param callback(Error, PPTrackerInfo)
 */
exportModule.getInfo = function (id, callback) {
    obtainInfo(id, '', callback)
}

/**
 * Get info from tracker request
 *
 * @param action
 * @param id
 * @param cb
 */
function obtainInfo(id, action, cb) {
    let args = {numer: id};
    soap.createClient(URL, function(err, client) {
       //let zapytanie = client.call("sprawdzPrzesylkePl", {numer: id}, NAMESPACE,header);
      client.addSoapHeader(header);
      client.sprawdzPrzesylkiPl({numer: id},function(err, response){
          let entity = null
          let data = response.return.przesylki.przesylka[0].danePrzesylki;
          try {
            entity = createTrackerEntity(data,id)
        } catch (error) {
            return cb(utils.errorParser(id, error.message))
        }
          if(entity != null) cb(null, entity);
      });
  });
}

/**
 * Create tracker entity from object
 * @param html
 */
function createTrackerEntity(data,id) {

    let result = data
    let res = result.zdarzenia.zdarzenie
 
    return new TrackerInfo({
        attempts: 1,
        id: id,
        transportType: result.rodzPrzes,
        origin: result.krajNadania,
        destiny: result.krajPrzezn,
        states: result.zdarzenia.zdarzenie.map((elem) => {
            let date = elem.czas
            return {
                state: elem.nazwa,
                date: moment.tz(date, "YYYY-MM-DD HH:mm:ss", 'pl', zone).format(),
                area: elem.jednostka.nazwa
            }
        })
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function TrackerInfo(obj) {
    this.attempts = obj.attempts
    this.id = obj.id
    this.deliveryDate = obj.deliveryDate
    this.states = obj.states
    this.origin = obj.origin,
    this.destiny = obj.destiny
    this.trackerWebsite = exportModule.getLink(this.id)
}

exportModule.getLink = function (id) {
    return "https://emonitoring.poczta-polska.pl/?numer=" + id
}

module.exports = exportModule