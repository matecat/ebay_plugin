window.APP = null

window.APP = {
  fitText: function (
    container,
    child,
    limitHeight,
    escapeTextLen,
    actualTextLow,
    actualTextHi,
  ) {
    if (typeof escapeTextLen == 'undefined') escapeTextLen = 4
    if (typeof $(child).attr('data-originalText') == 'undefined') {
      $(child).attr('data-originalText', $(child).text())
    }

    var originalText = $(child).text()

    //tail recursion exit control
    if (
      originalText.length < escapeTextLen ||
      (actualTextLow + actualTextHi).length < escapeTextLen
    ) {
      return false
    }

    if (
      typeof actualTextHi == 'undefined' &&
      typeof actualTextLow == 'undefined'
    ) {
      //we are in window.resize
      if (originalText.match(/\[\.\.\.]/)) {
        originalText = $(child).attr('data-originalText')
      }

      actualTextLow = originalText.substr(0, Math.ceil(originalText.length / 2))
      actualTextHi = originalText.replace(actualTextLow, '')
    }

    actualTextHi = actualTextHi.substr(1)
    actualTextLow = actualTextLow.substr(0, actualTextLow.length - 1)

    child.text(actualTextLow + '[...]' + actualTextHi)

    var loop = true
    // break recursion for browser width resize below 1024 px to avoid infinite loop and stack overflow
    while (container.height() >= limitHeight && loop == true) {
      loop = this.fitText(
        container,
        child,
        limitHeight,
        escapeTextLen,
        actualTextLow,
        actualTextHi,
      )
    }
    return false
  },
  addCommas: function (nStr) {
    nStr += ''
    var x = nStr.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
  },
  appendTime: function () {
    var t = new Date()
    return '&time=' + t.getTime()
  },
  getRandomUrl: function () {
    if (config.enableMultiDomainApi) {
      return (
        '//' +
        Math.floor(Math.random() * config.ajaxDomainsNumber) +
        '.ajax.' +
        location.host +
        '/'
      )
    }
    return config.basepath
  },
  doRequest: function (req, log) {
    var logTxt = typeof log == 'undefined' ? '' : '&type=' + log
    var version =
      typeof config.build_number == 'undefined'
        ? ''
        : '-v' + config.build_number
    var builtURL = req.url
      ? req.url
      : this.getRandomUrl() +
        '?action=' +
        req.data.action +
        logTxt +
        this.appendTime() +
        version +
        ',jid=' +
        config.id_job +
        (typeof req.data.id_segment != 'undefined'
          ? ',sid=' + req.data.id_segment
          : '')
    var reqType = req.type ? req.type : 'POST'
    var setup = {
      url: builtURL,

      data: req.data,
      type: reqType,
      dataType: 'json',
      xhrFields: {withCredentials: true},
      //TODO set timeout longer than server curl for TM/MT
    }

    // Callbacks
    if (typeof req.success === 'function') setup.success = req.success
    if (typeof req.complete === 'function') setup.complete = req.complete
    if (typeof req.context != 'undefined') setup.context = req.context
    if (typeof req.error === 'function') setup.error = req.error
    if (typeof req.beforeSend === 'function') setup.beforeSend = req.beforeSend

    return $.ajax(setup)
  },
  getParameterByName: function (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },
}
