(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.VueSelect = {}));
}(this, function (exports) { 'use strict';

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
          return !!this.options.length;
        },
        hasFocusableOptions: function hasFocusableOptions() {
          return !!this.options.filter(function (option) {
            return !option.disabled;
          }).length;
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
      created: function created() {
        document.addEventListener('keydown', this.keydownListener);
      },
      mounted: function mounted() {
        this.$refs.scrollContent.addEventListener('scroll', this.scrollListener);
        this.scrollableHeight = this.$refs.scrollContent.scrollHeight - this.$refs.scrollContent.clientHeight;
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
              this.toggleSelectedOption(this.options[this.focusedOptionIndex]);
              e.preventDefault();
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
        scrollToOption: function scrollToOption(index) {
          this.$refs["option-".concat(index)][0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
          });
        }
      }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

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

    var SelectDropdown = normalizeComponent_1({
      render: __vue_render__,
      staticRenderFns: __vue_staticRenderFns__
    }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

    //
    var script$1 = {
      components: {
        SelectDropdown: SelectDropdown
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
        hideSelected: {
          type: Boolean,
          default: false
        },
        placeholder: {
          type: String,
          default: 'Please select...'
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
          selectClass: null,
          dropdownIsVisible: false,
          selectedOptions: []
        };
      },
      computed: {
        hasValue: function hasValue() {
          return !!this.selectedOptions.length;
        },
        hasSearchQuery: function hasSearchQuery() {
          return !!this.searchQuery.length;
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
        filteredOptions: function filteredOptions() {
          var _this2 = this;

          var options = this.options;

          if (this.hideSelected) {
            options = options.filter(function (option) {
              return !_this2.selectedOptionValues.includes(option[_this2.optionIdentifier]);
            });
          }

          if (this.searchable) {
            options = options.filter(function (option) {
              return option[_this2.optionLabel].toUpperCase().indexOf(_this2.searchQuery.toUpperCase()) !== -1;
            });
          }

          return options;
        }
      },
      watch: {
        searchQuery: function searchQuery(_searchQuery) {
          if (this.hasSearchQuery) {
            this.showDropdown();
          }

          this.$refs.input.setAttribute('size', _searchQuery.length + 2);
          this.$emit('search-change', _searchQuery);
        },
        selectedOptionValues: function selectedOptionValues(_selectedOptionValues) {
          if (this.multiple) {
            return this.$emit('input', _selectedOptionValues);
          }

          return this.$emit('input', _selectedOptionValues.length ? _selectedOptionValues[0] : null);
        }
      },
      created: function created() {
        var _this3 = this;

        ['click', 'touchstart'].forEach(function (action) {
          document.addEventListener(action, _this3.hideDropdown);
        });
        document.addEventListener('keydown', this.keydownListener);
      },
      destroyed: function destroyed() {
        var _this4 = this;

        ['click', 'touchstart'].forEach(function (action) {
          document.removeEventListener(action, _this4.hideDropdown);
        });
        document.removeEventListener('keydown', this.keydownListener);
      },
      methods: {
        keydownListener: function keydownListener(e) {
          // Arrow down
          if (e.keyCode === 40 && this.inputIsActive && !this.dropdownIsVisible) {
            this.dropdownIsVisible = true;
          } // Delete


          if (e.keyCode === 8 && this.inputIsActive && this.hasValue && !this.multiple) {
            this.selectedOptions = [];
          } // Escape


          if (e.keyCode === 27 && this.dropdownIsVisible) {
            this.dropdownIsVisible = false;
          }
        },
        setDropdownPosition: function setDropdownPosition() {
          if (this.openDirection === 'auto') {
            var selectRect = this.$refs.select.getBoundingClientRect();
            var dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

            if (selectRect.y + selectRect.height + dropdownRect.height > window.innerHeight) {
              return this.selectClass = 'vs-open-up';
            }

            return this.selectClass = 'vs-open-down';
          }

          return this.selectClass = "vs-open-".concat(this.openDirection);
        },
        blurInput: function blurInput() {
          this.searchQuery = '';
          this.inputIsActive = false;
        },
        showDropdown: function showDropdown() {
          var _this5 = this;

          if (!this.dropdownIsVisible) {
            this.dropdownIsVisible = true;
            this.$nextTick(function () {
              _this5.setDropdownPosition();

              _this5.$refs.input.focus();
            });
          }
        },
        hideDropdown: function hideDropdown(event) {
          if (this.dropdownIsVisible && this.$refs.select !== event.target && !this.$refs.select.contains(event.target)) {
            this.dropdownIsVisible = false;
          }
        },
        selectOption: function selectOption(option) {
          this.searchQuery = '';
          this.dropdownIsVisible = false;
          this.$emit('select', option);

          if (this.multiple) {
            return this.selectedOptions.push(option);
          }

          this.selectedOptions = [option];
        },
        deselectOption: function deselectOption(option) {
          var _this6 = this;

          this.dropdownIsVisible = false;
          this.$emit('deselect', option);
          this.selectedOptions = this.selectedOptions.filter(function (selectedOption) {
            return selectedOption[_this6.optionIdentifier] !== option[_this6.optionIdentifier];
          });
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
        class: _vm.selectClass,
        on: {
          click: _vm.showDropdown
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
          size: "2"
        },
        domProps: {
          value: _vm.searchQuery
        },
        on: {
          blur: _vm.blurInput,
          focus: function focus($event) {
            _vm.inputIsActive = true;
          },
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
          options: _vm.filteredOptions,
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

    var VueSelect = normalizeComponent_1({
      render: __vue_render__$1,
      staticRenderFns: __vue_staticRenderFns__$1
    }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

    function install(Vue) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var componentName = options.componentName || 'vue-select'; // Register components

      Vue.component(componentName, VueSelect);
    }

    exports.default = install;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
