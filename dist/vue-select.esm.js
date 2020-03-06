function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  props: {
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    optionIdentifier: {
      type: [String, Number],
      required: true
    },
    selectedOptions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    loadingMore: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      required: true
    },
    scrollThrottleDelay: {
      type: Number,
      required: true
    },
    loadMoreThreshold: {
      type: Number,
      required: true
    },
    noOptionsMessage: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      showPointer: true,
      focusedOption: null,
      lastScroll: 0,
      scrollableHeight: 0,
      throttlingScroll: false
    };
  },
  computed: {
    selectedOptionValues: function selectedOptionValues() {
      var _this = this;

      return this.selectedOptions.map(function (option) {
        return option[_this.optionIdentifier];
      });
    },
    hasOptions: function hasOptions() {
      return this.options.length !== 0;
    },
    focusableOptions: function focusableOptions() {
      return this.options.filter(function (option) {
        return !option.disabled;
      });
    },
    hasFocusableOptions: function hasFocusableOptions() {
      return this.focusableOptions.length !== 0;
    },
    focusedOptionIndex: function focusedOptionIndex() {
      var _this2 = this;

      if (!this.focusedOption) {
        return null;
      }

      return this.options.findIndex(function (option) {
        return option[_this2.optionIdentifier] === _this2.focusedOption[_this2.optionIdentifier];
      });
    },
    lastOptionIndex: function lastOptionIndex() {
      return this.options.length - 1;
    }
  },
  watch: {
    options: {
      handler: function handler() {
        this.lastScroll = 0;
        this.setScrollableHeight();
      },
      deep: true
    },
    throttlingScroll: function throttlingScroll(_throttlingScroll) {
      if (_throttlingScroll) {
        return;
      }

      this.handleScrollEvent();
    }
  },
  created: function created() {
    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('mousemove', this.mouseMove);
  },
  mounted: function mounted() {
    this.$refs.scrollContent.addEventListener('scroll', this.throttleScroll);
    this.setScrollableHeight();

    if (this.hasFocusableOptions) {
      this.setFocusedOption(this.focusableOptions[0]);
    }
  },
  beforeDestroy: function beforeDestroy() {
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('mousemove', this.mouseMove);
    this.$refs.scrollContent.removeEventListener('keydown', this.throttleScroll);
  },
  methods: {
    keydownListener: function keydownListener(e) {
      if (!this.hasFocusableOptions) {
        return;
      } // Enter


      if (e.keyCode === 13) {
        e.preventDefault();

        if (this.focusableOptions.length === 1) {
          this.toggleSelectedOption(this.focusableOptions[0]);
          return;
        }

        this.toggleSelectedOption(this.options[this.focusedOptionIndex]);
      } // Arrow up


      if (e.keyCode === 38) {
        this.showPointer = false;
        var previousIndex = this.getPreviousFocusableIndex(this.focusedOptionIndex);
        this.setFocusedOption(this.options[previousIndex]);
        this.scrollToOption(previousIndex);
      } // Arrow down


      if (e.keyCode === 40) {
        this.showPointer = false;
        var nextIndex = this.getNextFocusableIndex(this.focusedOptionIndex);
        this.setFocusedOption(this.options[nextIndex]);
        this.scrollToOption(nextIndex);
      }
    },
    mouseMove: function mouseMove() {
      this.showPointer = true;
    },
    setScrollableHeight: function setScrollableHeight() {
      this.scrollableHeight = this.$refs.scrollContent.scrollHeight - this.$refs.scrollContent.clientHeight;
    },
    throttleScroll: function throttleScroll() {
      var _this3 = this;

      if (this.scrollThrottleDelay <= 0) {
        this.handleScrollEvent();
        return;
      }

      if (this.throttlingScroll) {
        return;
      }

      this.throttlingScroll = true;
      setTimeout(function () {
        _this3.throttlingScroll = false;
      }, this.scrollThrottleDelay);
    },
    handleScrollEvent: function handleScrollEvent() {
      var currentScroll = this.$refs.scrollContent.scrollTop;

      if (!this.loadingMore && currentScroll > this.lastScroll && this.scrollableHeight - currentScroll < this.loadMoreThreshold) {
        this.lastScroll = currentScroll;
        this.$emit('load-more');
      }
    },
    getPreviousFocusableIndex: function getPreviousFocusableIndex(currentIndex) {
      if (currentIndex > 0) {
        var previousIndex = currentIndex - 1;

        if (this.optionIsDisabled(this.options[previousIndex])) {
          return this.getPreviousFocusableIndex(previousIndex);
        }

        return previousIndex;
      }

      if (this.optionIsDisabled(this.options[0])) {
        return this.getNextFocusableIndex(0);
      }

      return 0;
    },
    getNextFocusableIndex: function getNextFocusableIndex(currentIndex) {
      if (currentIndex !== this.lastOptionIndex) {
        var nextIndex = currentIndex !== null ? currentIndex + 1 : 0;

        if (this.optionIsDisabled(this.options[nextIndex])) {
          return this.getNextFocusableIndex(nextIndex);
        }

        return nextIndex;
      }

      if (this.optionIsDisabled(this.options[currentIndex])) {
        return this.getPreviousFocusableIndex(currentIndex);
      }

      return currentIndex;
    },
    setFocusedOption: function setFocusedOption(option) {
      this.focusedOption = option;
    },
    optionIsFocused: function optionIsFocused(value) {
      return this.focusedOption && this.focusedOption[this.optionIdentifier] === value;
    },
    optionIsSelected: function optionIsSelected(value) {
      return this.selectedOptionValues.includes(value);
    },
    optionIsDisabled: function optionIsDisabled(option) {
      return option.disabled || false;
    },
    toggleSelectedOption: function toggleSelectedOption(option) {
      if (!option || this.optionIsDisabled(option)) {
        return;
      }

      if (this.optionIsSelected(option[this.optionIdentifier]) && this.multiple) {
        this.$emit('deselect-option', option);
        return;
      }

      this.$emit('select-option', option);
    },
    scrollToTop: function scrollToTop() {
      this.$refs.scrollContent.scrollTo(0, 0);
    },
    scrollToOption: function scrollToOption(index) {
      this.$refs["option-".concat(index)][0].scrollIntoView({
        block: 'nearest',
        inline: 'start'
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("div", {
    staticClass: "vs-dropdown",
    class: !_vm.showPointer ? "pointer-events-none" : ""
  }, [_c("div", {
    ref: "scrollContent",
    staticClass: "vs-dropdown-scroll"
  }, [!_vm.hasOptions ? _c("div", {
    staticClass: "vs-dropdown-no-options"
  }, [_vm._v("\n            " + _vm._s(_vm.noOptionsMessage) + "\n        ")]) : _vm._l(_vm.options, function (option, index) {
    return _c("div", {
      key: option[_vm.optionIdentifier],
      ref: "option-" + index,
      refInFor: true,
      on: {
        click: function click($event) {
          $event.stopPropagation();
          return _vm.toggleSelectedOption(option);
        },
        mouseenter: function mouseenter($event) {
          return _vm.setFocusedOption(option);
        }
      }
    }, [_vm._t("dropdown-option", null, null, {
      option: option,
      classes: {
        focused: _vm.optionIsFocused(option[_vm.optionIdentifier]),
        selected: _vm.optionIsSelected(option[_vm.optionIdentifier]),
        disabled: _vm.optionIsDisabled(option)
      }
    })], 2);
  }), _vm._v(" "), _vm.loadingMore ? _vm._t("dropdown-loader") : _vm._e()], 2)]);
};

var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var script$1 = {
  components: {
    SelectDropdown: __vue_component__
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: function _default() {
        return [];
      }
    },
    id: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    optionIdentifier: {
      type: [String, Number],
      default: 'value'
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingMore: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Please select...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    openDirection: {
      type: String,
      default: 'auto',
      validator: function validator(value) {
        return ['auto', 'down', 'up'].indexOf(value) !== -1;
      }
    },
    closeOnSelect: {
      type: Boolean,
      default: null
    },
    searchDebounceDelay: {
      type: Number,
      default: 150
    },
    scrollThrottleDelay: {
      type: Number,
      default: 150
    },
    loadMoreThreshold: {
      type: Number,
      default: 60
    },
    noOptionsMessage: {
      type: String,
      default: 'No options found.'
    }
  },
  data: function data() {
    return {
      searchQuery: '',
      inputIsActive: false,
      dropdownIsVisible: false,
      dropdownOpenDirection: 'down',
      selectedOptions: [],
      searchTimeout: null
    };
  },
  computed: {
    selectClasses: function selectClasses() {
      return {
        disabled: this.disabled,
        'vs-open-up': this.dropdownOpenDirection === 'up',
        'vs-open-down': this.dropdownOpenDirection === 'down'
      };
    },
    hasValue: function hasValue() {
      return this.selectedOptions.length !== 0;
    },
    hasOptions: function hasOptions() {
      return this.options.length !== 0;
    },
    hasSearchQuery: function hasSearchQuery() {
      return this.searchQuery.length !== 0;
    },
    selectedOptionValues: function selectedOptionValues() {
      var _this = this;

      return this.selectedOptions.map(function (option) {
        return option[_this.optionIdentifier];
      });
    },
    firstSelectedOption: function firstSelectedOption() {
      if (!this.hasValue) {
        return null;
      }

      return this.selectedOptions[0];
    },
    hideDropdownOnSelect: function hideDropdownOnSelect() {
      if (this.closeOnSelect === null) {
        return !this.multiple;
      }

      return this.closeOnSelect;
    }
  },
  watch: {
    value: {
      handler: function handler(values) {
        var _this2 = this;

        if (!this.hasOptions) {
          return;
        }

        if (!this.selectedOptionValues) {
          this.setSelectedOptions(values);
          return;
        }

        if (!Array.isArray(values)) {
          values = [values];
        }

        var diff = values.filter(function (value) {
          return !_this2.selectedOptionValues.includes(value);
        }); // Don't set select options if nothing has changed...

        if (values.length === this.selectedOptionValues.length && diff.length === 0) {
          return;
        }

        this.setSelectedOptions(values);
      },
      immediate: true
    },
    options: {
      handler: function handler() {
        if (this.options.length === 0) {
          this.setSelectedOptions(this.value);
        }
      },
      deep: true
    },
    searchQuery: function searchQuery(_searchQuery) {
      if (this.disabled) {
        return;
      }

      if (this.hasSearchQuery) {
        this.showDropdown();
      }

      if (this.$refs.dropdown) {
        this.$refs.dropdown.scrollToTop();
      }

      this.emitSearchQuery(_searchQuery);
    },
    selectedOptionValues: function selectedOptionValues(values) {
      // Don't do anything if the select is disabled...
      if (this.disabled) {
        return;
      }

      if (this.multiple) {
        return this.$emit('input', values);
      } // Return null if nothing has been selected...


      if (values.length === 0) {
        return this.$emit('input', null);
      } // Return the first selected value...


      this.$emit('input', values[0]);
    }
  },
  created: function created() {
    var _this3 = this;

    ['click', 'touchstart'].forEach(function (action) {
      document.addEventListener(action, _this3.deactivateSelectOnClick);
    });
    document.addEventListener('keydown', this.keydownListener);
  },
  destroyed: function destroyed() {
    var _this4 = this;

    ['click', 'touchstart'].forEach(function (action) {
      document.removeEventListener(action, _this4.deactivateSelectOnClick);
    });
    document.removeEventListener('keydown', this.keydownListener);
  },
  methods: {
    keydownListener: function keydownListener(e) {
      if (this.disabled) {
        return;
      } // Arrow down


      if (e.keyCode === 40 && this.inputIsActive && !this.dropdownIsVisible) {
        this.dropdownIsVisible = true;
      } // Delete


      if (e.keyCode === 8 && this.inputIsActive && this.hasValue && !this.multiple) {
        this.selectedOptions = [];
      } // Tab, Escape


      if ((e.keyCode === 9 || e.keyCode === 27) && this.dropdownIsVisible) {
        this.dropdownIsVisible = false;
      }
    },
    setSelectedOptions: function setSelectedOptions(values) {
      var _this5 = this;

      if (!Array.isArray(values)) {
        values = [values];
      }

      if (values.length === 0) {
        this.selectedOptions = [];
        return;
      }

      var options = _toConsumableArray(this.options);

      var optionsCache = {};
      var selectedOptions = [];
      values.forEach(function (value) {
        var cachedOption = optionsCache[value];

        if (cachedOption) {
          selectedOptions.push(_this5.formatSelectedOption(cachedOption));
          return;
        }

        options.some(function (option, index) {
          optionsCache[option[_this5.optionIdentifier]] = _objectSpread2({}, option);

          if (option[_this5.optionIdentifier] === value) {
            selectedOptions.push(_this5.formatSelectedOption(option)); // Remove all options before current index...

            options.splice(0, index + 1);
            return true;
          }
        });
      });
      this.selectedOptions = selectedOptions;
    },
    setDropdownPosition: function setDropdownPosition() {
      if (this.openDirection === 'auto') {
        var selectRect = this.$refs.select.getBoundingClientRect();
        var dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

        if (selectRect.y + selectRect.height + dropdownRect.height > window.innerHeight) {
          this.dropdownOpenDirection = 'up';
          return;
        }

        this.dropdownOpenDirection = 'down';
        return;
      }

      this.dropdownOpenDirection = this.openDirection;
    },
    activateSelect: function activateSelect() {
      if (this.disabled) {
        return;
      }

      this.focusInput();
      this.showDropdown();
    },
    focusInput: function focusInput() {
      this.$refs.input.focus();
      this.inputIsActive = true;
    },
    blurInput: function blurInput() {
      this.inputIsActive = false;
    },
    showDropdown: function showDropdown() {
      var _this6 = this;

      if (this.disabled || this.dropdownIsVisible) {
        return;
      }

      this.dropdownIsVisible = true;
      this.$nextTick(function () {
        _this6.setDropdownPosition();
      });
    },
    deactivateSelectOnClick: function deactivateSelectOnClick(event) {
      if (this.dropdownIsVisible && this.$refs.select !== event.target && !this.$refs.select.contains(event.target)) {
        this.searchQuery = '';
        this.inputIsActive = false;
        this.dropdownIsVisible = false;
      }
    },
    formatSelectedOption: function formatSelectedOption(option) {
      var _ref;

      return _ref = {}, _defineProperty(_ref, this.optionIdentifier, option[this.optionIdentifier]), _defineProperty(_ref, this.optionLabel, option[this.optionLabel]), _ref;
    },
    selectOption: function selectOption(option) {
      if (this.disabled) {
        return;
      }

      if (this.hideDropdownOnSelect) {
        this.focusInput();
        this.searchQuery = '';
        this.dropdownIsVisible = false;
      }

      this.$emit('change');
      this.$emit('select', option);

      if (this.multiple) {
        this.selectedOptions.push(option);
        return;
      }

      this.selectedOptions = [option];
    },
    deselectOption: function deselectOption(option) {
      var _this7 = this;

      if (this.disabled) {
        return;
      }

      if (this.hideDropdownOnSelect) {
        this.dropdownIsVisible = false;
      }

      this.$emit('change');
      this.$emit('deselect', option);
      this.selectedOptions = this.selectedOptions.filter(function (selectedOption) {
        return selectedOption[_this7.optionIdentifier] !== option[_this7.optionIdentifier];
      });
    },
    emitSearchQuery: function emitSearchQuery(searchQuery) {
      var _this8 = this;

      if (this.searchDebounceDelay <= 0) {
        this.$emit('query-change', searchQuery);
        return;
      }

      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(function () {
        _this8.$emit('query-change', searchQuery);
      }, this.searchDebounceDelay);
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("div", {
    staticClass: "vs-reset"
  }, [_c("div", {
    ref: "select",
    staticClass: "vs-select",
    class: _vm.selectClasses,
    on: {
      click: _vm.activateSelect
    }
  }, [_c("div", {
    staticClass: "vs-select-control"
  }, [_c("div", {
    staticClass: "vs-select-container"
  }, [!_vm.hasValue && !_vm.hasSearchQuery ? _c("div", {
    staticClass: "vs-select-placeholder"
  }, [_vm._v("\n                    " + _vm._s(_vm.placeholder) + "\n                ")]) : _vm._e(), _vm._v(" "), _vm.hasValue && _vm.multiple ? _vm._l(_vm.selectedOptions, function (selectedOption, index) {
    return _c("div", {
      key: index,
      staticClass: "vs-select-multiple-value",
      on: {
        click: function click($event) {
          $event.stopPropagation();
        }
      }
    }, [_c("div", {
      staticClass: "vs-select-multiple-value-label"
    }, [_vm._v("\n                            " + _vm._s(selectedOption[_vm.optionLabel]) + "\n                        ")]), _vm._v(" "), _c("div", {
      staticClass: "vs-select-multiple-value-remove",
      on: {
        click: function click($event) {
          return _vm.deselectOption(selectedOption);
        }
      }
    })]);
  }) : _vm._e(), _vm._v(" "), !_vm.hasSearchQuery && _vm.hasValue && !_vm.multiple ? _c("div", {
    staticClass: "vs-select-single-value"
  }, [_vm._v("\n                    " + _vm._s(_vm.firstSelectedOption[_vm.optionLabel]) + "\n                ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "vs-select-input"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.searchQuery,
      expression: "searchQuery"
    }],
    ref: "input",
    attrs: {
      id: _vm.id,
      type: "text",
      size: _vm.disabled || !_vm.searchable ? 2 : null,
      readonly: _vm.disabled || !_vm.searchable,
      tabindex: _vm.disabled ? -1 : 0,
      autocomplete: "off"
    },
    domProps: {
      value: _vm.searchQuery
    },
    on: {
      blur: _vm.blurInput,
      focus: _vm.activateSelect,
      input: function input($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.searchQuery = $event.target.value;
      }
    }
  })])], 2), _vm._v(" "), _c("div", {
    staticClass: "vs-select-actions"
  }, [_vm.loading ? _c("div", {
    staticClass: "vs-select-loader"
  }, _vm._l(4, function (i) {
    return _c("div", {
      key: i
    });
  }), 0) : _c("div", {
    staticClass: "vs-select-arrow"
  })])]), _vm._v(" "), _vm.dropdownIsVisible ? _c("select-dropdown", {
    ref: "dropdown",
    attrs: {
      options: _vm.options,
      multiple: _vm.multiple,
      "loading-more": _vm.loadingMore,
      "selected-options": _vm.selectedOptions,
      "option-identifier": _vm.optionIdentifier,
      "no-options-message": _vm.noOptionsMessage,
      "scroll-throttle-delay": _vm.scrollThrottleDelay,
      "load-more-threshold": _vm.loadMoreThreshold
    },
    on: {
      "load-more": function loadMore($event) {
        return _vm.$emit("load-more");
      },
      "select-option": _vm.selectOption,
      "deselect-option": _vm.deselectOption
    },
    scopedSlots: _vm._u([{
      key: "dropdown-option",
      fn: function fn(ref) {
        var option = ref.option;
        var classes = ref.classes;
        return [_vm._t("dropdown-option", [_c("div", {
          staticClass: "vs-dropdown-option",
          class: classes
        }, [_vm._v("\n                        " + _vm._s(option[_vm.optionLabel]) + "\n                    ")])], null, {
          option: option,
          classes: classes
        })];
      }
    }, {
      key: "dropdown-loader",
      fn: function fn() {
        return [_vm._t("dropdown-loader", [_c("div", {
          staticClass: "vs-dropdown-loader"
        }, [_c("div", {
          staticClass: "vs-loader-dots"
        }, [_vm._v("\n                            Loading\n                        ")])])])];
      },
      proxy: true
    }], null, true)
  }) : _vm._e()], 1)]);
};

var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var componentName = options.componentName || 'vue-select'; // Register components

  Vue.component(componentName, __vue_component__$1);
}

export default install;
