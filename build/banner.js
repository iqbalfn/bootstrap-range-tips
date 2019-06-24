'use strict'

const year = new Date().getFullYear()

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap Range Tips v0.0.1 (https://iqbalfn.github.io/bootstrap-range-tips/)
  * Copyright 2019 Iqbal Fauzi
  * Licensed under MIT (https://github.com/iqbalfn/bootstrap-range-tips/blob/master/LICENSE)
  */`
}

module.exports = getBanner
