/**
 * --------------------------------------------------------------------------
 * Bootstrap Range Tips (v0.0.1): range-tips.js
 * Licensed under MIT (https://github.com/iqbalfn/bootstrap-range-tips/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                  = 'rangetips'
const VERSION               = '0.0.1'
const DATA_KEY              = 'bs.rangetips'
const EVENT_KEY             = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT    = $.fn[NAME]
const CLASS_PREFIX          = 'bs-tooltip'

const DefaultType = {
    template          : 'string'
}

const Default = {
    template          : '<div class="tooltip" role="tooltip">' +
                    '<div class="arrow"></div>' +
                    '<div class="tooltip-inner"></div></div>'
}

const ClassName = {
    SHOW        : 'show'
}

const Event = {
  FOCUSIN    : `focusin${EVENT_KEY}`,
  FOCUSOUT   : `focusout${EVENT_KEY}`,
  INPUT      : `input${EVENT_KEY}`,
  MOUSEENTER : `mouseenter${EVENT_KEY}`,
  MOUSELEAVE : `mouseleave${EVENT_KEY}`
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class RangeTips {
    constructor(element, config) {
        this._config    = this._getConfig(config)
        this._element   = element
        this._parent    = element.parentNode

        this._tooltips  = this._makeTooltips()
        this._tooltipsInner = this._tooltips.querySelector('.tooltip-inner')
        this._tooltipsArrow = this._tooltips.querySelector('.arrow')

        this._isShown   = false;

        this._handleParent()
        this._addElementListener()
    }

    // Getters

    static get VERSION() {
        return VERSION
    }

    static get Default() {
        return Default
    }

    // Private

    _addElementListener(){
        $(this._element)
            .on(`${Event.MOUSEENTER} ${Event.FOCUSIN}`, e => {
                this._show()
            })
            .on(Event.MOUSELEAVE, e => {
                if(document.activeElement !== this._element)
                    this._hide()
            })
            .on(Event.FOCUSOUT, e => {
                if(!$(this._element).is(':hover'))
                    this._hide()
            })

        $(this._element).on(Event.INPUT, e => {
            this._updateLabel()
            this._updatePosition()
        })
    }

    _getConfig(config) {
        config = {
          ...Default,
          ...config
        }
        Util.typeCheckConfig(NAME, config, DefaultType)
        return config
    }

    _handleParent(){
        this._parent.style.position = 'relative'
    }

    _hide(){
        if(!this._isShown)
            return
        this._isShown = false;

        this._tooltips.classList.remove(ClassName.SHOW)
    }

    _makeTooltips(){
        let tooltips = $(this._config.template).get(0)
        tooltips.classList.add(`${CLASS_PREFIX}-top`)
        this._parent.appendChild(tooltips)

        return tooltips
    }

    _show(){
        if(this._isShown)
            return
        this._isShown = true;
        this._updateLabel()

        this._tooltipsInner.innerText = this._element.value

        let top = this._element.offsetTop - this._tooltips.offsetHeight
        this._tooltips.style.top = top + 'px'

        this._tooltips.classList.add(ClassName.SHOW)
        this._updatePosition()
    }

    _updatePosition(){
        let elValue = this._element.value 
        let elMax   = this._element.max || 100
        let elMin   = this._element.min || 0
        let elWidth = this._element.offsetWidth
        let elWidthUsed = elWidth - 16

        let ttWidth = this._tooltips.offsetWidth
        let ttLeft  = ( ( elValue / ( elMax - elMin ) ) * elWidthUsed ) - ( ttWidth / 2 ) + 8
        if(elMin)
            ttLeft-= ( elMin / ( elMax - elMin ) ) * elWidthUsed

        this._tooltips.style.left = ttLeft + 'px'

        let arWidth = 12.8
        let arLeft  = ( ttWidth / 2 ) - ( arWidth / 2 )
        this._tooltipsArrow.style.left = arLeft + 'px'

    }

    _updateLabel(){
        this._tooltipsInner.innerText = this._element.value
    }

    // Static

    static _jQueryInterface(config, relatedTarget) {
        return this.each(function () {
            let data = $(this).data(DATA_KEY)
            const _config = {
                ...Default,
                ...$(this).data(),
                ...typeof config === 'object' && config ? config : {}
            }

            if (!data) {
                data = new RangeTips(this, _config)
                $(this).data(DATA_KEY, data)
            }
        })
    }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = RangeTips._jQueryInterface
$.fn[NAME].Constructor = RangeTips
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return RangeTips._jQueryInterface
}

export default RangeTips