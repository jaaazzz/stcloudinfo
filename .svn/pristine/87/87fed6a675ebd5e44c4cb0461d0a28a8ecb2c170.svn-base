;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-sousuo" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M826.398 770.383l-124.95-124.943c36.182-51.676 55.676-113.072 55.676-177.471 0-82.883-32.276-160.805-90.89-219.413-58.608-58.608-136.535-90.883-219.424-90.883s-160.814 32.275-219.424 90.883c-58.61 58.608-90.89 136.531-90.89 219.413s32.276 160.805 90.89 219.413 136.535 90.883 219.424 90.883c64.402 0 125.803-19.494 177.479-55.674l124.95 124.943c10.653 10.653 24.614 15.979 38.576 15.979s27.924-5.326 38.576-15.979c21.307-21.303 21.307-55.846 0.001-77.153zM245.617 467.968c0-110.937 90.256-201.187 201.196-201.187s201.196 90.253 201.196 201.187c0 110.935-90.256 201.187-201.196 201.187-110.939 0-201.196-90.253-201.196-201.187z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-narrow" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M192.47264 415.809217l639.054721 0 0 192.381565-639.054721 0 0-192.381565Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-fangda" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M582.7 441.3v-282.796h-141.398v282.796h-282.796v141.398h282.796v282.796h141.398v-282.796h282.796v-141.398z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-delete" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.889995 128.745223c-201.852264 0-365.490182 163.637917-365.490182 365.490182 0 201.851241 163.637917 365.490182 365.490182 365.490182 201.851241 0 365.489158-163.637917 365.489158-365.490182C877.379153 292.382117 713.741235 128.745223 511.889995 128.745223L511.889995 128.745223zM688.519808 626.689089l-44.187385 44.175105L511.889995 538.409486 379.447567 670.864194l-44.187385-44.175105 132.442428-132.454708L335.260182 361.791953l44.151569-44.187385 132.465964 132.454708 132.454708-132.454708 44.187385 44.187385L556.0651 494.246661 688.519808 626.689089 688.519808 626.689089zM688.519808 626.689089"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-wodeweizhi" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M689.494507 494.412436h86.862323c-8.972349-131.389446-113.989147-236.380662-245.388826-245.314125v89.005127c0 10.041704-8.140401 18.181081-18.181082 18.181081s-18.181081-8.140401-18.181081-18.181081v-89.005127c-131.407865 8.933463-236.429781 113.936959-245.390873 245.337661 0.154519-0.004093 0.304945-0.023536 0.460488-0.023536h92.027973c10.041704 0 18.181081 8.140401 18.181081 18.181082 0 10.041704-8.139378 18.181081-18.181081 18.181081h-92.027973c-0.158612 0-0.313132-0.019443-0.470721-0.023536 8.886391 131.475404 113.939005 236.560764 245.401106 245.49832v-90.353844c0-10.041704 8.140401-18.181081 18.181081-18.181081s18.181081 8.140401 18.181082 18.181081v90.353844c131.453914-8.936533 236.502435-114.010637 245.399059-245.474784h-86.872556c-10.041704 0-18.181081-8.140401-18.181082-18.181081s8.140401-18.181081 18.181082-18.181082z m-176.482457 70.765717c-29.058826 0-52.616358-23.557532-52.616358-52.616358s23.557532-52.616358 52.616358-52.616358 52.616358 23.557532 52.616358 52.616358-23.557532 52.616358-52.616358 52.616358z" fill="#262731" ></path>' +
    '' +
    '<path d="M824.152393 65.949015H199.847607c-74.372871 0-134.663002 60.291155-134.663002 134.663002V823.385936c0 74.372871 60.291155 134.663002 134.663002 134.663003h624.304786c74.372871 0 134.663002-60.291155 134.663002-134.663003V200.612017c0-74.371848-60.291155-134.663002-134.663002-134.663002zM512 807.240211c-163.05668 0-295.240211-132.183532-295.240211-295.240211S348.94332 216.759789 512 216.759789s295.240211 132.183532 295.240211 295.240211-132.183532 295.240211-295.240211 295.240211z" fill="#262731" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)