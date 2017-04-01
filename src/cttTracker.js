'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const tidy = require('htmltidy').tidy
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Lisbon"

const URL = 'http://www.cttexpresso.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?lang=def&objects='

const ctt = {}

/**
 * Get CTT info
 * Scraps the CTT website
 * Async
 *
 * Design changes may break this code!!
 * @param id like RQ02341279MY & RF432233044SG
 * @param callback(Error, CttInfo)
 */
ctt.getInfo = function (id, callback) {
    request.get({
        url: URL + id,
        timeout: 30000,
        maxAttempts: 3,
        retryDelay: 1000,
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return callback(utils.getError('DOWN'))
        }

        // Not found
        if (body.indexOf('Objeto não encontrado') != -1 || body.indexOf('Insira pelo menos 10 caracteres') != -1) {
            return callback(utils.getError('NO_DATA'))
        }

        createCttEntity(id, body, (err, result) => {
            if(err)
                return callback(utils.getError('PARSER'))

            result.retries = response.attempts
            callback(null, result)
        })
    })
}


/**
 * Create ctt entity from html
 * @param id
 * @param html
 * @param cb
 */
function createCttEntity(id, html, cb) {
    tidy(html, function(err, htmlResult) {
        if(err)
            return cb(err)

        let state = null
        let messages = []

        try {
            let $ = parser.load(htmlResult)

            let table = $('table.full-width tr').get(1).children.filter(e => e.type == 'tag')

            let dayAndHours = table[2].children[0].data.trim() + ' ' + table[3].children[0].data.trim()
            state = {
                date: moment.tz(dayAndHours, "YYYY/MM/DD HH:mm", zone).format(),
                status: table[4].children[0].data.trim()
            }

            let details = $('#details_0').find('tr')

            let day = ""
            let dayUnformated = ""
            for(let i = 2; i < details.length; i++) {
                let tr = details[i]
                if(tr.attribs && tr.attribs.class == 'group') {
                    day = tr.children[1].children[0].data.trim()
                    dayUnformated = day.split(',')[1].trim()
                    day = moment.tz(dayUnformated, "DD MMMM YYYY", 'pt', zone).format()
                    messages.push({
                        day: day,
                        status: []
                    })
                } else {
                    if(tr.children.length == 11) {
                        let hours = tr.children[1].children[0].data.trim()
                        let time = moment.tz(dayUnformated + ' ' + hours, "DD MMMM YYYY HH:mm", 'pt', zone).format()
                        let add = {
                            time: time,
                            status: tr.children[3].children[0].data.trim(),
                            local: tr.children[7].children[0].data.trim()
                        }
                        messages.filter(m => m.day == day)[0].status.push(add)
                    }
                }
            }

        } catch (error) {
            return cb(error)
        }

        cb(null, new CttInfo(id, state, messages))
    });

}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/
function CttInfo(id, state, messages) {
    this.id = id
    this.state = state
    this.messages = messages
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

module.exports = ctt