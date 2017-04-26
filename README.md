# Geartrack

[![NPM](https://nodei.co/npm/geartrack.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/geartrack/)

[![Join the chat at https://gitter.im/hdnpt/geartrack](https://badges.gitter.im/hdnpt/geartrack.svg)](https://gitter.im/hdnpt/geartrack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=plastic)](https://github.com/hdnpt/geartrack)
[![David](https://img.shields.io/david/strongloop/express.svg?style=plastic)](https://github.com/hdnpt/geartrack)
[![Known Vulnerabilities](https://snyk.io/test/github/hdnpt/geartrack/badge.svg)](https://snyk.io/test/github/hdnpt/geartrack)
[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg?style=plastic)](https://github.com/hdnpt/geartrack)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=plastic)](https://github.com/hdnpt/geartrack)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://geartrack.pt/)

## API to track shippments from Gearbest & Aliexpress
Online version: [https://geartrack.pt](https://geartrack.pt)

This library scrapes the websites providers for shipping information.

## Supported Methods

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

// Get Sky 56 info
// Supports these ids: PQ, NL, LV, SY, GE, SB..
geartrack.sky.getInfo(id, (err, SkyInfo) => {
	if(err) { return  }
    
    console.log(SkyInfo.status) // see SkyInfo entity for more fields
})

// Get correos express info (when the package is in spain)
// ID is the provided from Gearbest PQ4F6P07XXXXXXXX750Z
// Postalcode is 4 digit like 1785 (Portuguese)
geartrack.correos.getInfo(id, postalcode, (err, CorreosInfo) => {
	if(err) { return  }
    
    console.log(CorreosInfo.state) // see CorreosInfo entity for more fields
    console.log(CorreosInfo.lastUpdate) 
})

// Get adicional.pt info (when the package is in portugal)
// This info is only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.id
// Postalcode is 4 digit like 1785
geartrack.adicional.getInfo(id, postalcode, (err, AdicionalInfo) => {
	if(err) { return  }
    
    console.log(AdicionalInfo.status) // see AdicionalInfo entity for more fields
    console.log(AdicionalInfo.distributor) 
})

// Get expresso24.pt info (when the package is in portugal)
// This info is only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.product.ref
geartrack.expresso24.getInfo(id, (err, ExpressoInfo) => {
    if(err) { return  }

    console.log(ExpressoInfo.status) // see ExpressoInfo entity for more fields 
})

// Get www.singpost.com info (for aliexpress)
geartrack.singpost.getInfo(id, (err, SingpostInfo) => {
    if(err) { return  }

    console.log(SingpostInfo.status) // see SingpostInfo entity for more fields 
})

// Get www.cttexpresso.pt info (used in aliexpress buys)
geartrack.ctt.getInfo(id, (err, CttInfo) => {
    if(err) { return  }

    console.log(CttInfo.status) // see CttInfo entity for more fields 
})

// Get global.cainiao.com info (used in aliexpress buys)
geartrack.cainiao.getInfo(id, (err, CainiaoInfo) => {
    if(err) { return  }

    console.log(CainiaoInfo.status) // see CainiaoInfo entity for more fields 
})

// Get correos.es info (when the package is in spain)
// ID is the provided from Gearbest PQ4F6P07XXXXXXXX750Z
geartrack.correoses.getInfo(id, (err, CorreosESInfo) => {
	if(err) { return  }

    console.log(CorreosESInfo.state) // see CorreosESInfo entity for more fields
})

// Get directlink info
// ID is the provided from AliExpress R..SE
geartrack.directlink.getInfo(id, (err, DirectLinkInfo) => {
	if(err) { return  }

    console.log(DirectLinkInfo.state) // see DirectLinkInfo entity for more fields
})

// Get track-chinapost.com info
// ID is the provided from AliExpress R..CN
geartrack.trackchinapost.getInfo(id, (err, TrackChinaPostInfo) => {
	if(err) { return  }

    console.log(TrackChinaPostInfo.state) // see TrackChinaPostInfo entity for more fields
})

// Get postNL.com info
// ID is the provided from AliExpress R..NL
geartrack.postNL.getInfo(id, (err, PostNLInfo) => {
	if(err) { return  }

    console.log(PostNLInfo.state) // see PostNLInfo entity for more fields
})

// Get Yanwen.com.cn info
// ID is the provided from Ebay
geartrack.yanwen.getInfo(id, (err, YanwenInfo) => {
	if(err) { return  }

    console.log(YanwenInfo.state) // see YanwenInfo entity for more fields
})

// Get http://www.pos.com.my/ info
geartrack.malaysiaPos.getInfo(id, (err, MalaysiaPosInfo) => {
	if(err) { return  }

    console.log(MalaysiaPosInfo.state) // see MalaysiaPosInfo entity for more fields
})

// Get http://pts.cjah.co/ info
geartrack.cjah.getInfo(id, (err, CjahInfo) => {
	if(err) { return  }

    console.log(CjahInfo.state) // see CjahInfo entity for more fields
})

// Get http://pts.cjah.co/ info
geartrack.winit.getInfo(id, (err, WinitInfo) => {
	if(err) { return  }

    console.log(WinitInfo.state) // see WinitInfo entity for more fields
})

// Get http://www.faryaa.com/user/index/package-refer/type/track
geartrack.panasia.getInfo(id, (err, PanasiaInfo) => {
	if(err) { return  }

    console.log(PanasiaInfo.states) // see PanasiaInfo entity for more fields
})
```

### Changelog
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
