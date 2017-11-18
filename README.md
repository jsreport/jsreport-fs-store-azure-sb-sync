# jsreport-fs-store-aws-sns-sync
[![NPM Version](http://img.shields.io/npm/v/jsreport-fs-store-azure-sb-sync.svg?style=flat-square)](https://npmjs.com/package/jsreport-fs-store-azure-sb-sync)
[![Build Status](https://travis-ci.org/jsreport/jsreport-fs-store-azure-sb-sync.png?branch=master)](https://travis-ci.org/jsreport/jsreport-fs-store-azure-sb-sync)

**Run jsreport [fs store](https://github.com/jsreport/jsreport-fs-store) in cluster and synchronize using azure service bus**


## Installation

> npm install jsreport-fs-store:next    
> npm install jsreport-fs-store-azure-sb-sync

And alter jsreport configuration 
```js
"connectionString": { 
  "name": "fs2",
  "sync": {
    "name": "azure-sb",
    "connectionString": "..."    
  }
},	
```