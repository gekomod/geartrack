# Geartrack 1.1

[![NPM](https://nodei.co/npm/geartrack.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/geartrack/)

### Gearbest supported ids
- Sky56:
    - **PQ** Spain Priority Line (Spain Express)
    - **NL** Netherlands Post surface mail
    - **LV** Bpost International
    - **SY** Malasya Pos
    - **GE, SB** Switzerland Post Unregistered
- Correos Express
- Adicional
- Expresso24
- Correos.es

### Aliexpress supported ids
    - RF.....SG ids
    - RQ.....MY ids
    - R......SE ids
    - R......CN ids
    - R......NL ids

### Ebay
- Winit

### Install
- `npm install geartrack --save`

### Using Docker to run tests
- `docker build -t geartrack .`
- `docker run geartrack`

### API
```javascript
const geartrack = require('geartrack')

// Get [Traker] info
// with exception of "adicional" tracker, all the trackers work like bellow:
geartrack.[tracker].getInfo(id, (err, TrakerInfo) => {
	if(err) { return  }
    
    console.log(TrakerInfo.status) // see TrakerInfo entity for more fields
})

You just need to replace [Tracker] for one of the following available trackers:
- correos
- correosOld
- sky
- expresso24
- singpost
- ctt
- cainiao
- correoses
- directlink
- trackchinapost
- postNL
- yanwen
- malaysiaPos
- cjah
- winit
- panasia
- parcelTracker
- dhl
- Poczta Polska
- track24

// Get adicional info
geartrack.adicional.getInfo(id, postalcode, (err, TrakerInfo) => {
	if(err) { return  }

    console.log(TrakerInfo.status) // see TrakerInfo entity for more fields
})

```

### Changelog
- 18/01/2019 - Added support for Poczta Polska
- 17/05/2017 - Added support for track24
- 17/05/2017 - Added support for DHL
- 16/05/2017 - Added support for Parcel Tracker
- 26/04/2017 - Added support for Panasia, replaces sky56 for PQ ids
- 19/04/2017 - Added support for ID.. through track.winit.com.cn
- 19/04/2017 - Added support for SB.. through pts.cjah.co
- 19/04/2017 - Added support for Malaysia POS through www.pos.com.my
- 05/04/2017 - Added support for ebay ids through yanwen.com.cn
- 01/04/2017 - Added support for R..NL Ali express ids through postNL
- 31/03/2017 - Added support for R..CN Ali express ids through track-chinapost
- 31/03/2017 - Added support for R..SE Ali express ids through DirectLink
- 30/03/2017 - Added support for correo.es
- 27/03/2017 - Formated all dates to ISO format
- 26/03/2017 - Added support for Singpost, CTT & Cainiao - Aliexpress
- 15/03/2017 - Added SB ids support
- 12/03/2017 - Added support for Switzerland Post Unregistered
- 01/01/2017 - Added replaced request with requestretry to retry failed requests 
- 31/12/2016 - Added information about Malasya Pos (SYB..)
- 24/12/2016 - Added information about Expresso24.pt
- 17/12/2016 - Added Bpost International mail support
- 14/12/2016 - Added Netherlands Post surface mail support

### License
MIT
