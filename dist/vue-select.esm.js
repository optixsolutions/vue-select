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
    noOptionsMessage: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      focusedOption: null,
      lastScroll: 0,
      scrollableHeight: 0,
      scrollLoaderThreshold: 60
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

      if (this.focusedOption) {
        return this.options.findIndex(function (option) {
          return option[_this2.optionIdentifier] === _this2.focusedOption[_this2.optionIdentifier];
        });
      }

      return null;
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
    }
  },
  created: function created() {
    document.addEventListener('keydown', this.keydownListener);
  },
  mounted: function mounted() {
    this.$refs.scrollContent.addEventListener('scroll', this.scrollListener);
    this.setScrollableHeight();

    if (this.hasFocusableOptions) {
      this.setFocusedOption(this.focusableOptions[0]);
    }
  },
  beforeDestroy: function beforeDestroy() {
    document.removeEventListener('keydown', this.keydownListener);
    this.$refs.scrollContent.removeEventListener('keydown', this.scrollListener);
  },
  methods: {
    keydownListener: function keydownListener(e) {
      if (this.hasFocusableOptions) {
        // Enter
        if (e.keyCode === 13) {
          e.preventDefault();

          if (this.focusableOptions.length === 1) {
            return this.toggleSelectedOption(this.focusableOptions[0]);
          }

          return this.toggleSelectedOption(this.options[this.focusedOptionIndex]);
        } // Arrow up


        if (e.keyCode === 38) {
          var previousIndex = this.getPreviousFocusableIndex(this.focusedOptionIndex);
          this.setFocusedOption(this.options[previousIndex]);
          this.scrollToOption(previousIndex);
        } // Arrow down


        if (e.keyCode === 40) {
          var nextIndex = this.getNextFocusableIndex(this.focusedOptionIndex);
          this.setFocusedOption(this.options[nextIndex]);
          this.scrollToOption(nextIndex);
        }
      }
    },
    setScrollableHeight: function setScrollableHeight() {
      this.scrollableHeight = this.$refs.scrollContent.scrollHeight - this.$refs.scrollContent.clientHeight;
    },
    scrollListener: function scrollListener() {
      var currentScroll = this.$refs.scrollContent.scrollTop;

      if (!this.loadingMore && currentScroll > this.lastScroll && this.scrollableHeight - currentScroll < this.scrollLoaderThreshold) {
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
    clearFocusedOption: function clearFocusedOption() {
      this.focusedOption = null;
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
      if (option) {
        if (this.optionIsDisabled(option)) {
          return;
        }

        if (this.optionIsSelected(option[this.optionIdentifier])) {
          return this.$emit('deselect-option', option);
        }

        this.$emit('select-option', option);
      }
    },
    scrollToTop: function scrollToTop() {
      this.$refs.scrollContent.scrollTo(0, 0);
    },
    scrollToOption: function scrollToOption(index) {
      this.$refs["option-".concat(index)][0].scrollIntoView({
        behavior: 'smooth',
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
    staticClass: "vs-dropdown"
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
        mouseout: _vm.clearFocusedOption,
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

//
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
      default: true
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
      selectedOptions: []
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
    }
  },
  watch: {
    value: {
      handler: function handler(value) {
        if (this.hasOptions) {
          this.setSelectedOptions(value, 'value');
        }
      },
      immediate: true
    },
    options: {
      handler: function handler() {
        this.setSelectedOptions(this.value, 'options');
      },
      deep: true
    },
    searchQuery: function searchQuery(_searchQuery) {
      if (!this.disabled) {
        if (this.hasSearchQuery) {
          this.showDropdown();
        }

        if (this.dropdownIsVisible) {
          this.$refs.dropdown.scrollToTop();
        }

        this.$refs.input.setAttribute('size', _searchQuery.length + 2);
        this.$emit('query-change', _searchQuery);
      }
    },
    selectedOptionValues: function selectedOptionValues(_selectedOptionValues) {
      if (!this.disabled) {
        if (this.multiple) {
          return this.$emit('input', _selectedOptionValues);
        }

        if (_selectedOptionValues.length !== 0) {
          return this.$emit('input', _selectedOptionValues[0]);
        }

        this.$emit('input', null);
      }
    }
  },
  created: function created() {
    var _this2 = this;

    ['click', 'touchstart'].forEach(function (action) {
      document.addEventListener(action, _this2.deactivateSelectOnClick);
    });
    document.addEventListener('keydown', this.keydownListener);
  },
  destroyed: function destroyed() {
    var _this3 = this;

    ['click', 'touchstart'].forEach(function (action) {
      document.removeEventListener(action, _this3.deactivateSelectOnClick);
    });
    document.removeEventListener('keydown', this.keydownListener);
  },
  methods: {
    keydownListener: function keydownListener(e) {
      if (!this.disabled) {
        // Arrow down
        if (e.keyCode === 40 && this.inputIsActive && !this.dropdownIsVisible) {
          this.dropdownIsVisible = true;
        } // Delete


        if (e.keyCode === 8 && this.inputIsActive && this.hasValue && !this.multiple) {
          this.selectedOptions = [];
        } // Tab, Escape


        if ((e.keyCode === 9 || e.keyCode === 27) && this.dropdownIsVisible) {
          this.dropdownIsVisible = false;
        }
      }
    },
    setSelectedOptions: function setSelectedOptions(value) {
      var _this4 = this;

      if (!value) {
        return this.selectedOptions = [];
      }

      var values = Array.isArray(value) ? value : [value];
      this.selectedOptions = this.options.filter(function (selectedOption) {
        return values.includes(selectedOption[_this4.optionIdentifier]);
      });
    },
    setDropdownPosition: function setDropdownPosition() {
      if (this.openDirection === 'auto') {
        var selectRect = this.$refs.select.getBoundingClientRect();
        var dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

        if (selectRect.y + selectRect.height + dropdownRect.height > window.innerHeight) {
          return this.dropdownOpenDirection = 'up';
        }

        return this.dropdownOpenDirection = 'down';
      }

      return this.dropdownOpenDirection = this.openDirection;
    },
    activateSelect: function activateSelect() {
      if (!this.disabled) {
        this.focusInput();
        this.showDropdown();
      }
    },
    focusInput: function focusInput() {
      this.$refs.input.focus();
      this.inputIsActive = true;
    },
    blurInput: function blurInput() {
      this.inputIsActive = false;
    },
    showDropdown: function showDropdown() {
      var _this5 = this;

      if (!this.disabled && !this.dropdownIsVisible) {
        this.dropdownIsVisible = true;
        this.$nextTick(function () {
          _this5.setDropdownPosition();
        });
      }
    },
    deactivateSelectOnClick: function deactivateSelectOnClick(event) {
      if (this.dropdownIsVisible && this.$refs.select !== event.target && !this.$refs.select.contains(event.target)) {
        this.searchQuery = '';
        this.inputIsActive = false;
        this.dropdownIsVisible = false;
      }
    },
    selectOption: function selectOption(option) {
      if (!this.disabled) {
        this.focusInput();
        this.searchQuery = '';
        this.dropdownIsVisible = false;
        this.$emit('change');
        this.$emit('select', option);

        if (this.multiple) {
          return this.selectedOptions.push(option);
        }

        this.selectedOptions = [option];
      }
    },
    deselectOption: function deselectOption(option) {
      var _this6 = this;

      if (!this.disabled) {
        this.dropdownIsVisible = false;
        this.$emit('change');
        this.$emit('deselect', option);
        this.selectedOptions = this.selectedOptions.filter(function (selectedOption) {
          return selectedOption[_this6.optionIdentifier] !== option[_this6.optionIdentifier];
        });
      }
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
  }, [_vm._v("\n                    " + _vm._s(_vm.placeholder) + "\n                ")]) : _vm._e(), _vm._v(" "), _vm.hasValue && _vm.multiple ? _vm._l(_vm.selectedOptions, function (selectedOption) {
    return _c("div", {
      key: selectedOption[_vm.optionIdentifier],
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
      size: "2",
      type: "text",
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
      "loading-more": _vm.loadingMore,
      "selected-options": _vm.selectedOptions,
      "option-identifier": _vm.optionIdentifier,
      "no-options-message": _vm.noOptionsMessage
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
        }, [_vm._v("\n                        Loading...\n                    ")])])];
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
