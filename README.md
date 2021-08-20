⚠️ This extension is deprecated and is compatible only with the jsreport v2
--

# jsreport-fs-store-azure-sb-sync
[![NPM Version](http://img.shields.io/npm/v/jsreport-fs-store-azure-sb-sync.svg?style=flat-square)](https://npmjs.com/package/jsreport-fs-store-azure-sb-sync)
[![Build Status](https://travis-ci.org/jsreport/jsreport-fs-store-azure-sb-sync.png?branch=master)](https://travis-ci.org/jsreport/jsreport-fs-store-azure-sb-sync)

**Run jsreport [fs store](https://github.com/jsreport/jsreport-fs-store) in cluster and synchronize using azure service bus**


## Installation

> npm install jsreport-fs-store    
> npm install jsreport-fs-store-azure-sb-sync

Create an azure service bus and copy the connection string from the shared access policies. Then alter jsreport configuration:
```js
"store": {
  "provider": "fs"
},
"extensions": {
  "fs-store": {
    "sync": {
      "provider": "azure-sb"
    }
  },
  "fs-store-azure-sb-sync": {
    "connectionString": "...",
    // the rest is optional
    "topic": "jsreport",
    "subscription": "<host id>"  
  }
}
},
```
