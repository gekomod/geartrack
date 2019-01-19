'use strict';

const request = require('requestretry').defaults({ maxAttempts: 2, retryDelay: 1000 })
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
const tabletojson = require('tabletojson');
const zone = "Asia/Chongqing" // +8h

const URL = 'http://track.yw56.com.cn/en-US'

const yanwen = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
yanwen.getInfo = function (id, callback) {
    request.post({
        url: URL,
        form: {
            InputTrackNumbers: id
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return callback(utils.errorDown())
        }
        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(utils.errorDown())
        }
 
        if (body.indexOf('The shipment barcode was not found.') != -1){
            return callback(utils.errorNoData())
        }

        let entity = null
        try {
            entity = createYanwenEntity(id, body)
            if (!entity) {
                return callback(utils.errorNoData())
            }
            entity.retries = response.attempts
        } catch (error) {
            return callback(utils.errorParser(id, error.message))
        }

        callback(null, entity)

    })
}

function createYanwenEntity(id, html) {
    let $ = cheerio.load(html,{
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
});
    cheerioTableparser($);
    let trs1 = $('#'+id+' table tbody tr')
    let trs2 = $('#'+id+' table')
    let trs = $('#'+id).parsetable(true, true, true);
    
    const converted = tabletojson.convert(html);

    let origin = trs[1][0];
    let destiny = trs[1][1];
    
    /*const states = utils.tableParser(
        trs1,
        {
            'date': {'idx': 1, 'mandatory': true, 'parser': elem => { return moment.tz( elem, 'YYYY-MM-DD HH:mm', zone).format()}},
            'state': { 'idx': 3, 'mandatory': true }
        },
        (elem) => {
            origin = elem.children[3].children[0].children[0].data.trim()
            destiny = elem.children[3].children[0].children[0].data.trim()
            console.log("DEMO: ", destiny);
        })
        */

    return new YanwenInfo({
        'id': id,
        'origin': origin,
        'destiny': destiny,
        'states': converted[0].map((elem) => {
            let date = elem['Origin Country']
            return {
                state: elem[1],
                date: moment.tz(date, "YYYY-MM-DD HH:mm:ss", 'pl', zone).format(),
                area: null
            }
        })
    })
    
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function YanwenInfo(obj){
    this.id = obj.id
    this.origin = obj.origin
    this.destiny = obj.destiny
    this.states = obj.states.map(m => {
        m.state = replaceState(m.state)
        return m
    })
    this.state = this.states[0].state
    this.trackerWebsite = yanwen.getLink(null)
   
}

yanwen.getLink = function (id) {
    return URL
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

function replaceState(state) {
    state = state.replace('上海互换局 已出口直封', 'Shanghai Exchange Bureau has been export direct seal')
    state = state.replace('上海互换局 已出口开拆', 'Shanghai Interchange has been opened for export')
    state = state.replace('广商国际小包 已封发', 'Guangshang international package has been closed')
    state = state.replace('广商国际小包 已收寄', 'Guangshang international package has been received')
    state = state.replace('广商国际小包 离开，下一站【广商大宗】',
        'Canton business international package to leave, the next stop [Canton business bulk]')

    return state
}


module.exports = yanwen
