/**
 * vue-validator v1.4.3
 * (c) 2014-2015 kazuya kawaguchi
 * Released under the MIT License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-validator"] = factory();
	else
		root["vue-validator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Import(s)
	 */

	var validates = __webpack_require__(1)
	var _ = __webpack_require__(2)


	/**
	 * Export(s)
	 */

	module.exports = install


	/**
	 * Install plugin
	 */

	function install (Vue, options) {
	  options = options || {}
	  var componentName = options.component = options.component || '$validator'
	  var directiveName = options.directive = options.directive || 'validate'
	  var path = Vue.parsers.path
	  var util = Vue.util

	  function getVal (obj, keypath) {
	    var ret = null
	    try {
	      ret = path.get(obj, keypath)
	    } catch (e) { }
	    return ret
	  }


	  Vue.directive(directiveName, {

	    priority: 1024,

	    bind: function () {
	      var vm = this.vm
	      var el = this.el
	      var $validator = vm[componentName]
	      var keypath = this._keypath = this._parseModelAttribute(el.getAttribute(Vue.config.prefix + 'model'))
	      var validator = this.arg ? this.arg : this.expression
	      var arg = this.arg ? this.expression : null
	      var customs = (vm.$options.validator && vm.$options.validator.validates) || {}
	      if (!this._checkDirective(validator, validates, customs)) {
	        _.warn('specified invalid v-validate directive !! please check v-validator directive !!')
	        this._ignore = true
	        return
	      }
	      if (!$validator) {
	        vm[componentName] = $validator = vm.$addChild({
	          validator: vm.$options.validator
	        }, Vue.extend(__webpack_require__(3)))
	      }

	      var value = el.getAttribute('value')
	      if (el.getAttribute('number') !== null) {
	        value = util.toNumber(value)
	      }
	      this._init = value

	      var validation = $validator._getValidationNamespace('validation')
	      var init = value || vm.$get(keypath)
	      var readyEvent = el.getAttribute('wait-for')

	      if (readyEvent && !$validator._isRegistedReadyEvent(keypath)) {
	        $validator._addReadyEvents(keypath, this._checkParam('wait-for'))
	      }
	      
	      this._setupValidator($validator, keypath, validation, validator, el, arg, init)
	    },

	    update: function (val, old) {
	      if (this._ignore) { return }

	      var self = this
	      var vm = this.vm
	      var keypath = this._keypath
	      var validator = this.arg ? this.arg : this.expression
	      var $validator = vm[componentName]

	      $validator._changeValidator(keypath, validator, val)
	      if (!$validator._isRegistedReadyEvent(keypath)) { // normal
	        this._updateValidator($validator, validator, keypath)
	      } else { // wait-for
	        vm.$once($validator._getReadyEvents(keypath), function (val) {
	          $validator._setInitialValue(keypath, val)
	          vm.$set(keypath, val)
	          self._updateValidator($validator, validator, keypath)
	        })
	      }
	    },

	     
	    unbind: function () {
	      if (this._ignore) { return }

	      var vm = this.vm
	      var keypath = this._keypath
	      var validator = this.arg ? this.arg : this.expression
	      var $validator = vm[componentName]

	      this._teardownValidator(vm, $validator, keypath, validator)
	    },

	    _parseModelAttribute: function (attr) {
	      var res = Vue.parsers.directive.parse(attr)
	      return res[0].arg ? res[0].arg : res[0].expression
	    },

	    _checkDirective: function (validator, validates, customs) {
	      var items = Object.keys(validates).concat(Object.keys(customs))
	      return items.some(function (item) {
	        return item === validator
	      })
	    },

	    _setupValidator: function ($validator, keypath, validation, validator, el, arg, init) {
	      var vm = this.vm
	      if (!getVal($validator[validation], keypath)) {
	        $validator._defineModelValidationScope(keypath, el)
	        if (el.tagName === 'INPUT' && el.type === 'radio') {
	          if (getVal(vm, keypath) === init) {
	            $validator._setInitialValue(keypath, init)
	          }
	        } else {
	          $validator._setInitialValue(keypath, init)
	        }
	      }

	      if (!getVal($validator[validation], [keypath, validator].join('.'))) {
	        $validator._defineValidatorToValidationScope(keypath, validator)
	        $validator._addValidator(keypath, validator, getVal(vm, arg) || arg)
	      }
	    },

	    _updateValidator: function ($validator, validator, keypath) {
	      var value = $validator.$get(keypath)
	      var el = this.el

	      if (this._init) {
	        value = this._init
	        delete this._init
	      }

	      if (el.tagName === 'INPUT' && el.type === 'radio') {
	        if (value === $validator.$get(keypath)) {
	          $validator._updateDirtyProperty(keypath, value)
	        }
	      } else {
	        $validator._updateDirtyProperty(keypath, value)
	      }

	      $validator._doValidate(keypath, validator, $validator.$get(keypath), el)
	    },

	    _teardownValidator: function (vm, $validator, keypath, validator) {
	      $validator._undefineValidatorToValidationScope(keypath, validator)
	      $validator._undefineModelValidationScope(keypath, validator)
	    }
	  })
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Fundamental validate functions
	 */


	/**
	 * required
	 *
	 * This function validate whether the value has been filled out.
	 *
	 * @param val
	 * @return {Boolean}
	 */

	function required (val) {
	  if (Array.isArray(val)) {
	    return val.length > 0
	  } else if (typeof val === 'number') {
	    return true
	  } else if ((val !== null) && (typeof val === 'object')) {
	    return Object.keys(val).length > 0
	  } else {
	    return !val
	      ? false
	      : true
	  }
	}


	/**
	 * pattern
	 *
	 * This function validate whether the value matches the regex pattern
	 *
	 * @param val
	 * @param {String} pat
	 * @return {Boolean}
	 */

	function pattern (val, pat) {
	  if (typeof pat !== 'string') { return false }

	  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'))
	  if (!match) { return false }

	  return new RegExp(match[1], match[2]).test(val)
	}


	/**
	 * minLength
	 *
	 * This function validate whether the minimum length of the string.
	 *
	 * @param {String} val
	 * @param {String|Number} min
	 * @return {Boolean}
	 */

	function minLength (val, min) {
	  return typeof val === 'string' &&
	    isInteger(min, 10) &&
	    val.length >= parseInt(min, 10)
	}


	/**
	 * maxLength
	 *
	 * This function validate whether the maximum length of the string.
	 *
	 * @param {String} val
	 * @param {String|Number} max
	 * @return {Boolean}
	 */

	function maxLength (val, max) {
	  return typeof val === 'string' &&
	    isInteger(max, 10) &&
	    val.length <= parseInt(max, 10)
	}


	/**
	 * min
	 *
	 * This function validate whether the minimum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg minimum
	 * @return {Boolean}
	 */

	function min (val, arg) {
	  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) >= +(arg))
	}


	/**
	 * max
	 *
	 * This function validate whether the maximum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg maximum
	 * @return {Boolean}
	 */

	function max (val, arg) {
	  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) <= +(arg))
	}


	/**
	 * isInteger
	 *
	 * This function check whether the value of the string is integer.
	 *
	 * @param {String} val
	 * @return {Boolean}
	 * @private
	 */

	function isInteger (val) {
	  return /^(-?[1-9]\d*|0)$/.test(val)
	}


	/**
	 * export(s)
	 */
	module.exports = {
	  required: required,
	  pattern: pattern,
	  minLength: minLength,
	  maxLength: maxLength,
	  min: min,
	  max: max
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Utilties
	 */


	/**
	 * warn
	 *
	 * @param {String} msg
	 * @param {Error} [err]
	 *
	 */

	exports.warn = function (msg, err) {
	  if (window.console) {
	    console.warn('[vue-validator] ' + msg)
	    if (err) {
	      console.warn(err.stack)
	    }
	  }
	}

	/**
	 * Get target validatable object
	 *
	 * @param {Object} validation
	 * @param {String} keypath
	 * @return {Object} validatable object
	 */

	exports.getTarget = function (validation, keypath) {
	  var last = validation
	  var keys = keypath.split('.')
	  var key, obj
	  for (var i = 0; i < keys.length; i++) {
	    key = keys[i]
	    obj = last[key]
	    last = obj
	    if (!last) {
	      break
	    }
	  }
	  return last
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Import(s)
	 */

	var validates = __webpack_require__(1)
	var _ = __webpack_require__(2)


	/**
	 * Export(s)
	 */


	/**
	 * `v-validator` component with mixin
	 */

	module.exports = {
	  inherit: true,

	  created: function () {
	    this._initValidationVariables()
	    this._initOptions()
	    this._mixinCustomValidates()
	    this._defineProperties()
	    this._defineValidationScope()
	  },

	  methods: {
	    _getValidationNamespace: function (key) {
	      return this.$options.validator.namespace[key]
	    },

	    _initValidationVariables: function () {
	      this._validators = {}
	      this._validates = {}
	      this._initialValues = {}
	      for (var key in validates) {
	        this._validates[key] = validates[key]
	      }
	      this._validatorWatchers = {}
	      this._readyEvents = {}
	    },

	    _initOptions: function () {
	      var validator = this.$options.validator = this.$options.validator || {}
	      var namespace = validator.namespace = validator.namespace || {}
	      namespace.validation = namespace.validation || 'validation'
	      namespace.valid = namespace.valid || 'valid'
	      namespace.invalid = namespace.invalid || 'invalid'
	      namespace.dirty = namespace.dirty || 'dirty'
	    },

	    _mixinCustomValidates: function () {
	      var customs = this.$options.validator.validates
	      for (var key in customs) {
	        this._validates[key] = customs[key]
	      }
	    },

	    _defineValidProperty: function (target, getter) {
	      Object.defineProperty(target, this._getValidationNamespace('valid'), {
	        enumerable: true,
	        configurable: true,
	        get: getter
	      })
	    },

	    _undefineValidProperty: function (target) {
	      delete target[this._getValidationNamespace('valid')]
	    },

	    _defineInvalidProperty: function (target) {
	      var self = this
	      Object.defineProperty(target, this._getValidationNamespace('invalid'), {
	        enumerable: true,
	        configurable: true,
	        get: function () {
	          return !target[self._getValidationNamespace('valid')]
	        }
	      })
	    },

	    _undefineInvalidProperty: function (target) {
	      delete target[this._getValidationNamespace('invalid')]
	    },

	    _defineDirtyProperty: function (target, getter) {
	      Object.defineProperty(target, this._getValidationNamespace('dirty'), {
	        enumerable: true,
	        configurable: true,
	        get: getter
	      })
	    },

	    _undefineDirtyProperty: function (target) {
	      delete target[this._getValidationNamespace('dirty')]
	    },

	    _defineProperties: function () {
	      var self = this

	      var walk = function (obj, propName, namespaces) {
	        var ret = false
	        var keys = Object.keys(obj)
	        var i = keys.length
	        var key, last
	        while (i--) {
	          key = keys[i]
	          last = obj[key]
	          if (!(key in namespaces) && typeof last === 'object') {
	            ret = walk(last, propName, namespaces)
	            if ((propName === self._getValidationNamespace('valid') && !ret) ||
	                (propName === self._getValidationNamespace('dirty') && ret)) {
	              break
	            }
	          } else if (key === propName && typeof last !== 'object') {
	            ret = last
	            if ((key === self._getValidationNamespace('valid') && !ret) ||
	                (key === self._getValidationNamespace('dirty') && ret)) {
	              break
	            }
	          }
	        }
	        return ret
	      }

	      this._defineValidProperty(this.$parent, function () {
	        var validationName = self._getValidationNamespace('validation')
	        var validName = self._getValidationNamespace('valid')
	        var namespaces = self.$options.validator.namespace

	        return walk(this[validationName], validName, namespaces)
	      })

	      this._defineInvalidProperty(this.$parent)

	      this._defineDirtyProperty(this.$parent, function () {
	        var validationName = self._getValidationNamespace('validation')
	        var dirtyName = self._getValidationNamespace('dirty')
	        var namespaces = self.$options.validator.namespace

	        return walk(this[validationName], dirtyName, namespaces)
	      })
	    },

	    _undefineProperties: function () {
	      this._undefineDirtyProperty(this.$parent)
	      this._undefineInvalidProperty(this.$parent)
	      this._undefineValidProperty(this.$parent)
	    },

	    _defineValidationScope: function () {
	      this.$parent.$add(this._getValidationNamespace('validation'), {})
	    },

	    _undefineValidationScope: function () {
	      var validationName = this._getValidationNamespace('validation')
	      this.$parent.$delete(validationName)
	    },

	    _defineModelValidationScope: function (keypath, el) {
	      var self = this
	      var validationName = this._getValidationNamespace('validation')
	      var dirtyName = this._getValidationNamespace('dirty')

	      var keys = keypath.split('.')
	      var last = this[validationName]
	      var obj, key
	      for (var i = 0; i < keys.length; i++) {
	        key = keys[i]
	        obj = last[key]
	        if (!obj) {
	          obj = {}
	          last.$add(key, obj)
	        }
	        last = obj
	      }
	      last.$add(dirtyName, false)

	      this._defineValidProperty(last, function () {
	        var ret = true
	        var validators = self._validators[keypath]
	        var i = validators.length
	        var validator
	        while (i--) {
	          validator = validators[i]
	          if (last[validator.name]) {
	            ret = false
	            break
	          }
	        }
	        return ret
	      })
	      this._defineInvalidProperty(last)
	      
	      this._validators[keypath] = []

	      this._watchModel(keypath, function (val, old) {
	        self._updateDirtyProperty(keypath, val)
	        self._validators[keypath].forEach(function (validator) {
	          self._doValidate(keypath, validator.name, val, el)
	        })
	      })
	    },

	    _undefineModelValidationScope: function (keypath, validator) {
	      if (this.$parent) {
	        var targetPath = [this._getValidationNamespace('validation'), keypath].join('.')
	        var target = this.$parent.$get(targetPath)
	        if (target && Object.keys(target).length === 3 &&
	            this._getValidationNamespace('valid') in target &&
	            this._getValidationNamespace('invalid') in target &&
	            this._getValidationNamespace('dirty') in target) {
	          this._unwatchModel(keypath)
	          this._undefineDirtyProperty(target)
	          this._undefineInvalidProperty(target)
	          this._undefineValidProperty(target)
	          removeValidationProperties(
	            this.$parent.$get(this._getValidationNamespace('validation')),
	            keypath
	          )
	        }
	      }
	    },

	    _defineValidatorToValidationScope: function (keypath, validator) {
	      var target = _.getTarget(this[this._getValidationNamespace('validation')], keypath)
	      target.$add(validator, null)
	    },

	    _undefineValidatorToValidationScope: function (keypath, validator) {
	      var validationName = this._getValidationNamespace('validation')
	      if (this.$parent) {
	        var targetPath = [validationName, keypath].join('.')
	        var target = this.$parent.$get(targetPath)
	        if (target) {
	          target.$delete(validator)
	        }
	      }
	    },

	    _getInitialValue: function (keypath) {
	      return this._initialValues[keypath]
	    },

	    _setInitialValue: function (keypath, val) {
	      this._initialValues[keypath] = val
	    },

	    _addValidator: function (keypath, validator, arg) {
	      this._validators[keypath].push({ name: validator, arg: arg })
	    },

	    _changeValidator: function (keypath, validator, arg) {
	      var validators = this._validators[keypath]
	      var i = validators.length
	      while (i--) {
	        if (validators[i].name === validator) {
	          validators[i].arg = arg
	          break
	        }
	      }
	    },

	    _findValidator: function (keypath, validator) {
	      var found = null
	      var validators = this._validators[keypath]
	      var i = validators.length
	      while (i--) {
	        if (validators[i].name === validator) {
	          found = validators[i]
	          break
	        }
	      }
	      return found
	    },

	    _watchModel: function (keypath, fn) {
	      this._validatorWatchers[keypath] =
	        this.$watch(keypath, fn, { deep: false, immediate: true })
	    },

	    _unwatchModel: function (keypath) {
	      var unwatch = this._validatorWatchers[keypath]
	      if (unwatch) {
	        unwatch()
	        delete this._validatorWatchers[keypath]
	      }
	    },
	    
	    _addReadyEvents: function (id, event) {
	      this._readyEvents[id] = event
	    },

	    _getReadyEvents: function (id) {
	      return this._readyEvents[id]
	    },

	    _isRegistedReadyEvent: function (id) {
	      return id in this._readyEvents
	    },

	    _updateDirtyProperty: function (keypath, val) {
	      var validationName = this._getValidationNamespace('validation')
	      var dirtyName = this._getValidationNamespace('dirty')

	      var target = _.getTarget(this[validationName], keypath)
	      if (target) {
	        target.$set(dirtyName, this._getInitialValue(keypath) !== val)
	      }
	    },

	    _doValidate: function (keypath, validateName, val, el) {
	      var validationName = this._getValidationNamespace('validation')
	      var target = _.getTarget(this[validationName], keypath)
	      var validator = this._findValidator(keypath, validateName)
	      if (target && validator) {
			this._addMsgToModel(this._validates[validateName], val, validator, el, target);
	        this._invokeValidator(
	          this._validates[validateName],
	          val, validator.arg,
	          function (result) {
	            target.$set(validateName, !result)
	          })
	      }
	    },
	    
	    _invokeValidator: function (validator, val, arg, fn) {
	      var future = validator.call(this, val, arg)
	      if (typeof future === 'function') { // async
	        if (future.resolved) {
	          // cached
	          fn(future.resolved)
	        } else if (future.requested) {
	          // pool callbacks
	          future.pendingCallbacks.push(fn)
	        } else {
	          future.requested = true
	          var fns = future.pendingCallbacks = [fn]
	          future(function resolve () {
	            future.resolved = true
	            for (var i = 0, l = fns.length; i < l; i++) {
	              fns[i](true)
	            }
	          }, function reject () {
	            fn(false)
	          })
	        }
	      } else { // sync
	        fn(future)
	      }
	    },
		  /**
		   *
		   * @param validates 验证对象的验证函数
		   * @param val 验证对象的值
		   * @param validator 验证对象的验证参数
		   * @param el 验证对象
		   * @param target 验证对象目标对象
		   * @private
		   */
		_addMsgToModel:function(validates, val, validator, el, target){
			var future = validates.call(this, val, validator.arg);
			var oElNextTag=el.nextSibling;
			var message = this.$options.validator.message;
			var isLabel = oElNextTag.tagName === 'LABEL' && oElNextTag.className === 'error';
			if(!future){
				var content='';
				switch (validator.name){
					case 'required':
						content='必须填写';
						break;
					case 'minLength':
						content=target['required']?'必须填写':'最少 '+validator.arg+' 个字';
						break;
					case 'maxLength':
						content=target['required']?'必须填写':'最多 '+validator.arg+' 个字';
						break;
					case 'min':
						content=target['required']?'必须填写':'请输入不小于 '+validator.arg+' 的数值';
						break;
					case 'max':
						content=target['required']?'必须填写':'请输入不大于 '+validator.arg+' 的数值';
						break;
					default :
						content=target['required'] ? '必须填写' : message[validator.name] ? message[validator.name] : '请填写正确的信息';
						break;
				}
				if(isLabel){
					oElNextTag.style.display = 'block';
					oElNextTag.innerHTML=content;
					this._absoluteStyle(oElNextTag, el);
				}else{
					var oLabel=document.createElement('label');
					oLabel.innerHTML=content;
					oLabel.className='error';
					this._absoluteStyle(oLabel, el);
					el.parentNode.insertBefore(oLabel,el.nextSibling);
				}
			}else{
				if(target.valid && isLabel){
					oElNextTag.style.display = 'none';
				}
			}

		},
		  /**
		   *
		   * @param oLabel 错误显示，label标签
		   * @param el 对应的对象model
		   * @private
		   */
		_absoluteStyle:function(oLabel, el){
			var absolute= this.$options.validator.absolute?this.$options.validator.absolute:false;
			//是否对对应的model对象做绝对定位操作
			if(absolute){
				var elTop=el.offsetTop;
				var elLeft=el.offsetLeft;
				var elHeight=el.offsetHeight;
				oLabel.style.top=elTop+elHeight+2+"px";
				oLabel.style.left=elLeft+"px";
				oLabel.style.position='absolute';
			}
		}
	  }
	}

	/**
	 * Remove properties from target validation
	 *
	 * @param {Object} validation
	 * @param {String} keypath
	 */

	function removeValidationProperties (validation, keypath) {
	  var keys = keypath.split('.')
	  var key, obj
	  while (keys.length) {
	    key = keys.pop()
	    if (keys.length !== 0) {
	      obj = _.getTarget(validation, keys.join('.'))
	      obj.$delete(key)
	    } else {
	      validation.$delete(key)
	    }
	  }
	}


/***/ }
/******/ ])
});
;