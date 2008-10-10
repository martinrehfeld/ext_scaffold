Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';
Ext.namespace('ExtScaffold');
Ext.form.Field.prototype.msgTarget = 'side';

// Custom FormPanel supporting different behaviour for show/edit/new operating modes
ExtScaffold.FormPanel = Ext.extend(Ext.FormPanel, {
  //
  // properties (all Ext.FormPanel properties may be given as well)
  //

  // read-only properties
  okButton: null,
  cancelButton: null,
  currentMode: '',

  // the form titles for each mode
  modeTitles: {
   'show': 'Show Resource',
   'edit': 'Edit Resource',
   'new':  'Create Resource'
  },
  
  // the button texts for each mode, ok property may be false to hide okButton
  modeButtonTexts: {
    'show': { ok: false, cancel: 'Back' },
    'edit': { ok: 'Save', cancel: 'Cancel' },
    'new':  { ok: 'Create', cancel: 'Cancel' }
  },
  
  // optional callbacks (default to no-ops)
  onCancel: Ext.emptyFn,
  onOk:     Ext.emptyFn,
  
  //
  // public instance methods
  //
  setFieldsDisabled: function(fieldsDisabled) {
    this.getForm().items.each(function(item) {
      item.setDisabled(fieldsDisabled);
    });
  },
  
  setFormMode: function (mode) {
    if (mode === 'new') this.getForm().reset(); // empty all fields

    this.setTitle(this.modeTitles[mode] || 'Ext Scaffold Form');

    // disable fields and hide okButton when modeButtonTexts for ok is false
    this.setFieldsDisabled(!this.modeButtonTexts[mode].ok);
    this.okButton.setVisible(this.modeButtonTexts[mode].ok);

    // set button texts according to mode
    this.okButton.setText(this.modeButtonTexts[mode].ok || '[disabled]');
    this.cancelButton.setText(this.modeButtonTexts[mode].cancel);
    
    // update currentMode property
    this.currentMode = mode;
  },
  
  //
  // constructor
  //
  constructor: function(config) {
    if (config === undefined) config = {}; // set default for optional config param
    var formPanel = this;                  // save scope for later reference
    
    // register callback config
    if (config.onCancel) this.onCancel = config.onCancel;
    if (config.onOk)     this.onOk     = config.onOk;
    
    // create from buttons -> accessible as properties
    this.okButton     = new Ext.Button({ text: 'Ok',     handler: formPanel.onOk, type: 'submit' });
    this.cancelButton = new Ext.Button({ text: 'Cancel', handler: formPanel.onCancel });
    
    // call superclass constructor to create actual FormPanel
    ExtScaffold.FormPanel.superclass.constructor.call(this, Ext.applyIf(config, {
      title:         '[form-title]', // have a title (to be updated later)
      labelWidth:    100,            // default label width
      defaults:      { width: 300 }, // default field width
      waitMsgTarget: true,
      autoScroll:    true,
      bodyStyle:     'padding:10px 10px 0',
      defaultType:   'textfield',
      bbar:          [ formPanel.cancelButton, formPanel.okButton ]
    }));
  }
});


/*
 * from: http://slidelayout.freehostia.com/grid3.js / 
 *       http://extjs.com/forum/showthread.php?p=233741
 *
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.layout.SlideLayout = Ext.extend(Ext.layout.FitLayout, {
  
  deferredRender : false,
  
  renderHidden : false,
  easing: 'none',
  duration: .5,
  opacity: 1,
  
  setActiveItem : function(itemInt){
    if (typeof(itemInt) == 'string') { itemInt = this.container.items.keys.indexOf(itemInt); }
    else if (typeof(itemInt) == 'object') { itemInt = this.container.items.items.indexOf(itemInt); }
    var item = this.container.getComponent(itemInt);
    if (this.activeItem != item) {
      if (this.activeItem) {
        if (item && (!item.rendered || !this.isValidParent(item, this.container))) {
          this.renderItem(item, itemInt, this.container.getLayoutTarget()); item.show();
        }
        var s = [this.container.body.getX() - this.container.body.getWidth(), this.container.body.getX() + this.container.body.getWidth()];
        this.activeItem.el.shift({ duration: this.duration, easing: this.easing, opacity: this.opacity, x:(this.activeItemNo < itemInt ? s[0] : s[1] )});
        item.el.setY(this.container.body.getY());
        item.el.setX((this.activeItemNo < itemInt ? s[1] : s[0] ));
        item.el.shift({ duration: this.duration, easing: this.easing, opacity: 1, x:this.container.body.getX()});
      }
      this.activeItemNo = itemInt;
      this.activeItem = item;
      this.layout();
    }
  },
  
  renderAll : function(ct, target){
    if (this.deferredRender) {
      this.renderItem(this.activeItem, undefined, target);
    } else {
      Ext.layout.CardLayout.superclass.renderAll.call(this, ct, target);
    }
  }
});
Ext.Container.LAYOUTS['slide'] = Ext.layout.SlideLayout;

Ext.namespace('Ext.ux'); 
/**
  * Ext.ux.form.DateTime Extension Class for Ext 2.x Library
  *
  * @author    Ing. Jozef Sakalos, adjusted for ext_scaffold by Martin Rehfeld
  * @copyright (c) 2008, Ing. Jozef Sakalos
  *
  * @class Ext.ux.form.DateTime
  * @extends Ext.form.Field
  */
Ext.namespace('Ext.ux.form');
Ext.ux.form.DateTime = Ext.extend(Ext.form.Field, {
     defaultAutoCreate:{tag:'input', type:'hidden'}
    ,timeWidth:100
    ,dtSeparator:' '
    ,hiddenFormat:'Y/m/d H:i:s O'
    ,isFormField:true

    ,initComponent:function() {
        // call parent initComponent
        Ext.ux.form.DateTime.superclass.initComponent.call(this);

        // create DateField
        var dateConfig = Ext.apply({}, {
             id:this.id + '-date'
            ,format:this.dateFormat
            ,allowBlank:true
            ,width:this.timeWidth
            ,listeners:{
                 blur:{scope:this, fn:this.onBlur}
            }
        }, this.dateConfig);
        this.df = new Ext.form.DateField(dateConfig);
        delete(this.dateFormat);

        // create TimeField
        var timeConfig = Ext.apply({}, {
             id:this.id + '-time'
            ,format:this.timeFormat
            ,allowBlank:true
            ,width:this.timeWidth
            ,listeners:{
                 blur:{scope:this, fn:this.onBlur}
            }
        }, this.timeConfig);
        this.tf = new Ext.form.TimeField(timeConfig);
        delete(this.timeFormat);

        // relay events
        this.relayEvents(this.df, ['focus', 'change', 'specialkey', 'invalid', 'valid']);
        this.relayEvents(this.tf, ['focus', 'change', 'specialkey', 'invalid', 'valid']);

    } // end of function initComponent

    ,onRender:function(ct, position) {

        // render underlying field
        Ext.ux.form.DateTime.superclass.onRender.call(this, ct, position);

        // render DateField and TimeField
        // create bounding table
        var t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
            {tag:'tr',children:[
                {tag:'td',style:'padding-right:4px'},{tag:'td'}
            ]}
        ]}, true);

        this.tableEl = t;

        // render DateField
        var td = t.child('td');
        this.df.render(td);

        // render TimeField
        var td = td.next('td');
        this.tf.render(td);

        if(Ext.isIE && Ext.isStrict) {
            t.select('input').applyStyles({top:0});
        }

        this.on('specialkey', this.onSpecialKey, this);

        this.df.el.swallowEvent(['keydown', 'keypress']);
        this.tf.el.swallowEvent(['keydown', 'keypress']);

        this.rendered = true;

    } // end of function onRender

    ,onSpecialKey:function(t, e) {
        if(e.getKey() == e.TAB) {
            if(t === this.df && !e.shiftKey) {
                e.stopEvent();
                this.tf.focus();
            }
            if(t === this.tf && e.shiftKey) {
                e.stopEvent();
                this.df.focus();
            }
        }
    } // end of function onSpecialKey

    ,setSize:function(w, h) {
        if(!w) {
            return;
        }
        this.df.setSize(w - this.timeWidth - 4, h);
        this.tf.setSize(this.timeWidth, h);

        if(Ext.isIE) {
            this.df.el.up('td').setWidth(w - this.timeWidth - 4);
            this.tf.el.up('td').setWidth(this.timeWidth);
        }

    } // end of function setSize

    ,focus:function() {
        this.df.focus();
    } // end of function focus

    ,setValue:function(val) {
        var da, time;
        if(val instanceof Date) {
            this.setDate(val);
            this.setTime(val);
        }
        else {
           if(val) {
              da = val.split(this.dtSeparator);
              this.setDate(da[0]);
              if(da[1]) {
                  this.setTime(da[1]);
              }
           }
        }
        this.updateValue(true);
    } // end of function setValue

    ,getValue:function() {
        // create new instance of date
        return new Date(this.dateValue);
    } // end of function getValue

    ,onBlur:function() {
        this.updateValue(true);
        (function() {
            var suppressEvent = this.df.hasFocus || this.tf.hasFocus;
            this.updateValue(suppressEvent);
        }).defer(100, this);
    } // end of function onBlur

    ,updateValue:function(suppressEvent) {
        // update date
        var d = this.df.getValue();
        this.dateValue = new Date(d);
        if(d instanceof Date) {
            this.dateValue.setFullYear(d.getFullYear());
            this.dateValue.setMonth(d.getMonth());
            this.dateValue.setDate(d.getDate());
        }

        // update time
        var t = Date.parseDate(this.tf.getValue(), this.tf.format);
        if(t instanceof Date && this.dateValue instanceof Date) {
            this.dateValue.setHours(t.getHours());
            this.dateValue.setMinutes(t.getMinutes());
            this.dateValue.setSeconds(t.getSeconds());
        }

        // update underlying hidden
        if(this.rendered) {
            this.el.dom.value = this.dateValue instanceof Date ? this.dateValue.format(this.hiddenFormat) : this.dateValue;
        }

        // fire blur event if not suppressed and if neither DateField nor TimeField has it
        if(true !== suppressEvent) {
            this.fireEvent('blur', this);
        }
    } // end of function updateValue

    ,isValid:function() {
        return this.df.isValid() && this.tf.isValid();
    } // end of function isValid

    ,validate:function() {
        return this.df.validate() && this.tf.validate();
    } // end of function validate

    ,setDate:function(date) {
        this.df.setValue(date);
    } // end of function setDate

    ,setTime:function(date) {
        this.tf.setValue(date);
    } // end of function setTime

}); // end of extend

// register xtype
Ext.reg('xdatetime', Ext.ux.form.DateTime);


/**
 * Ext.ux.grid.Search
 *
 * Search plugin
 *
 * @author    Ing. Jozef Sakalos
 * @copyright (c) 2008, by Ing. Jozef Sakalos
 * @date      17. January 2008
 * @version   $Id: Ext.ux.grid.Search.js 634 2008-01-19 17:00:20Z jozo $
 */
Ext.namespace('Ext.ux.grid');
/**
 * @constructor
 */
Ext.ux.grid.Search = function(config) {
    Ext.apply(this, config, {
        // defaults
         position:'bottom'
        ,searchText:'Search'
        ,searchTipText:'Type a text to search and press Enter'
        ,iconCls:'ux-icon-search'
        ,checkIndexes:'all'
        ,disableIndexes:[]
        ,dateFormat:undefined
        ,mode:'remote'
        ,paramNames: {
             fields:'fields'
            ,query:'query'
        }
    });

    Ext.ux.grid.Search.superclass.constructor.call(this);
}; // end of constructor

Ext.extend(Ext.ux.grid.Search, Ext.util.Observable, {
    // {{{
    init:function(grid) {
        this.grid = grid;

        grid.onRender = grid.onRender.createSequence(this.onRender, this);
        grid.reconfigure = grid.reconfigure.createSequence(this.reconfigure, this);
    } // end of function init
    // }}}
    // {{{
    ,onRender:function() {
        var grid = this.grid;
        var tb = 'bottom' == this.position ? grid.bottomToolbar : grid.topToolbar;

        // add menu
        this.menu = new Ext.menu.Menu();
        tb.addSeparator();
        tb.add({
             text:this.searchText
            ,menu:this.menu
            ,iconCls:this.iconCls
        });

        // add filter field
        this.field = new Ext.form.TwinTriggerField({
             width:this.width
            ,selectOnFocus:undefined === this.selectOnFocus ? true : this.selectOnFocus
            ,trigger1Class:'x-form-clear-trigger'
            ,trigger2Class:'x-form-search-trigger'
            ,onTrigger1Click:this.onTriggerClear.createDelegate(this)
            ,onTrigger2Click:this.onTriggerSearch.createDelegate(this)
        });
        this.field.on('render', function() {
            this.field.el.dom.qtip = this.searchTipText;
            var map = new Ext.KeyMap(this.field.el, [{
                 key:Ext.EventObject.ENTER
                ,scope:this
                ,fn:this.onTriggerSearch
            },{
                 key:Ext.EventObject.ESC
                ,scope:this
                ,fn:this.onTriggerClear
            }]);
            map.stopEvent = true;
        }, this, {single:true});

        tb.add(this.field);

        // reconfigure
        this.reconfigure();
    } // end of function onRender
    // }}}
    // {{{
    ,onTriggerClear:function() {
        this.field.setValue('');
        this.field.focus();
        this.onTriggerSearch();
    } // end of function onTriggerClear
    // }}}
    // {{{
    ,onTriggerSearch:function() {
        var val = this.field.getValue();
        var store = this.grid.store;

        if('local' === this.mode) {
            store.clearFilter();
            if(val) {
                store.filterBy(function(r) {
                    var retval = false;
                    this.menu.items.each(function(item) {
                        if(!item.checked || retval) {
                            return;
                        }
                        var rv = r.get(item.dataIndex);
                        rv = rv instanceof Date ? rv.format(this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;
                        var re = new RegExp(val, 'gi');
                        retval = re.test(rv);
                    }, this);
                    if(retval) {
                        return true;
                    }
                    return retval;
                }, this);
            }
            else {
            }
        }
        else {
            // clear start (necessary if we have paging)
            if(store.lastOptions && store.lastOptions.params) {
                store.lastOptions.params[store.paramNames.start] = 0;
            }

            // get fields to search array
            var fields = [];
            this.menu.items.each(function(item) {
                if(item.checked) {
                    fields.push(item.dataIndex);
                }
            });

            // add fields and query to baseParams of store
            delete(store.baseParams[this.paramNames.fields]);
            delete(store.baseParams[this.paramNames.query]);
            if(store.lastOptions && store.lastOptions.params) {
              delete(store.lastOptions.params[this.paramNames.fields]);
              delete(store.lastOptions.params[this.paramNames.query]);
            }
            if(fields.length) {
                store.baseParams[this.paramNames.fields] = Ext.encode(fields);
                store.baseParams[this.paramNames.query] = val;
            }

            // reload store
            store.reload();
        }

    } // end of function onTriggerSearch
    // }}}
    // {{{
    // private 
    ,reconfigure:function() {

        // {{{
        // remove old items
        var menu = this.menu;
        menu.removeAll();

        // }}}
        // {{{
        // add new items
        var cm = this.grid.colModel;
        Ext.each(cm.config, function(config) {
            var disable = false;
            if(config.header) {
                Ext.each(this.disableIndexes, function(item) {
                    disable = disable ? disable : item === config.dataIndex;
                });
                if(!disable) {
                    menu.add(new Ext.menu.CheckItem({
                         text:config.header
                        ,hideOnClick:false
                        ,checked:'all' === this.checkIndexes
                        ,dataIndex:config.dataIndex
                    }));
                }
            }
        }, this);
        // }}}
        // {{{
        // check items
        if(this.checkIndexes instanceof Array) {
            Ext.each(this.checkIndexes, function(di) {
                var item = menu.items.find(function(itm) {
                    return itm.dataIndex === di;
                });
                if(item) {
                    item.setChecked(true, true);
                }
            }, this);
        }
        // }}}

    } // end of function reconfigure
    // }}}

}); // end of extend
