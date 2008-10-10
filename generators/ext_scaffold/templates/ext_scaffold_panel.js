/*
Substitutions
-------------
Posts <%= controller_class_name %>  -- WARNING: might be namespaced with ::, generate Ext.ns and s/::/./g
      ohne nesting: <%= controller_class_name.demodulize %>
Post <%= class_name %>
      ohne nesting: <%= class_name.demodulize %>
post[att1]..post[att2] (attribute / fields / mappings)
posts (JSON root) <%= controller_class_name.tableize.tr('/','_') %>
*/

ExtScaffold.Posts = Ext.extend(Ext.Panel, {
  //
  // static text properties (override for i18n)
  //
  labels: { // FIXME: tpl
    'id': '#',
    'post[title]': 'Title',
    'post[body]': 'Body',
    'post[published]': 'Published'
  },
  listModeTitle: 'Listing <%= controller_class_name.demodulize %>',
  showModeTitle: 'Show <%= class_name.demodulize %>',
  editModeTitle: 'Edit <%= class_name.demodulize %>',
  newModeTitle:  'Create <%= class_name.demodulize %>',
  newButtonLabel: 'New...',
  newButtonTooltip: 'Create new <%= class_name.demodulize %>',
  editButtonLabel: 'Edit...',
  editButtonTooltip: 'Edit selected <%= class_name.demodulize %>',
  selectRowText: 'Please select a row first.',
  deleteButtonLabel: 'Delete...',
  deleteButtonTooltip: 'Delete selected <%= class_name.demodulize %>',
  deleteConfirmationText: 'Really delete?',
  deleteFailedText: 'Delete operation failed. The record might have been deleted by someone else.',
  paginationStatusTemplate: 'Record {0} - {1} of {2}',
  paginationNoRecordsText: 'No records found',
  savingMessage: 'Saving...',
  saveFailedText: 'Save operation failed. The record might have been deleted by someone else.',

  //
  // custom properties
  //
  url: '#',
  baseParams: {},
  recordsPerPage: 50,
  
  //
  // public instance methods
  //
  activateGrid: function() {
    this.getLayout().setActiveItem(0);
  },
  
  activateForm: function(mode) {
    this.formPanel.setFormMode(mode);
    this.getLayout().setActiveItem(1);
  },
  
  //
  // constructor
  //
  constructor: function(config) {
    if (config === undefined) config = {}; // set default for optional config param
    var scaffoldPanel = this;              // save scope for later reference
    
    // set custom properties
    if (config.url) this.url = config.url;
    if (config.baseParams) this.baseParams = config.baseParams;

    var ds = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
                   url: scaffoldPanel.url + '?format=ext_json',
                   method: 'GET'
               }),
        reader: new Ext.data.JsonReader({
                    root: '<%= controller_class_name.tableize.tr('/','_') %>',
                    id: 'id',
                    totalProperty: 'results'
                },
                // FIXME: tpl
                [ {name: 'id', mapping: 'post.id'}, {name: 'post[title]', mapping: 'post.title'},{name: 'post[body]', mapping: 'post.body'},{name: 'post[published]', mapping: 'post.published'},{name: 'post[created_at]', mapping: 'post.created_at'},{name: 'post[updated_at]', mapping: 'post.updated_at'} ]),
        remoteSort: true, // turn on server-side sorting
        sortInfo: {field: 'id', direction: 'ASC'}
    });

    var cm = new Ext.grid.ColumnModel([ // FIXME: tpl
      {id: 'id', header: scaffoldPanel.labels['id'], width: 20, dataIndex: 'id'},
      {header: scaffoldPanel.labels['post[title]'], dataIndex: 'post[title]'},
      {header: scaffoldPanel.labels['post[body]'], dataIndex: 'post[body]'},
      {header: scaffoldPanel.labels['post[published]'], dataIndex: 'post[published]'}
    ]);

    cm.defaultSortable = true; // all fields are sortable by default
    
    // create the grid
    this.gridPanel = new Ext.grid.GridPanel({
        ds: ds,
        cm: cm,
        sm: new Ext.grid.RowSelectionModel({ singleSelect:true }),
        title:  scaffoldPanel.listModeTitle,
        height: '100%',
        stripeRows: true,
        viewConfig: { forceFit:true },

        // inline toolbars
        tbar:[{
            text:    scaffoldPanel.newButtonLabel,
            tooltip: scaffoldPanel.newButtonTooltip,
            handler: function(){
                       scaffoldPanel.activateForm('new');
                     },
            iconCls:'add'
        }, '-', {
            text:    scaffoldPanel.editButtonLabel,
            tooltip: scaffoldPanel.editButtonTooltip,
            handler: function(){
                       var selected = scaffoldPanel.gridPanel.getSelectionModel().getSelected();
                       if(selected) {
                         scaffoldPanel.activateForm('edit');
                       } else { 
                         alert(scaffoldPanel.selectRowText);
                       }
                     },
            iconCls:'edit'
        },'-',{
            text:    scaffoldPanel.deleteButtonLabel,
            tooltip: scaffoldPanel.deleteButtonTooltip,
            handler: function(){
                       var selected = scaffoldPanel.gridPanel.getSelectionModel().getSelected();
                       if(selected) {
                         if(confirm(scaffoldPanel.deleteConfirmationText)) {
                            var conn = new Ext.data.Connection({
                              extraParams: scaffoldPanel.baseParams
                            });
                            conn.request({
                                url: scaffoldPanel.url + '/' + selected.data.id,
                                method: 'POST',
                                params: { _method: 'DELETE' },
                                success: function(response, options){ ds.load(); },
                                failure: function(response, options){
                                  // the delete probably failed because the record is already gone, so let's reload the store
                                  ds.load();
                                  alert(scaffoldPanel.deleteFailedText);
                                }
                            });
                         }
                       } else { 
                         alert(scaffoldPanel.selectRowText);
                       }
                     },
            iconCls:'remove'
        },'->'],
        bbar: new Ext.PagingToolbar({
                  pageSize: 5,
                  store: ds,
                  displayInfo: true,
                  displayMsg: scaffoldPanel.paginationStatusTemplate,
                  emptyMsg:   scaffoldPanel.paginationNoRecordsText
        }),
        plugins:[new Ext.ux.grid.Search({
                    position:'top'
                })]
    });

    // show record on double-click
    this.gridPanel.on('rowdblclick', function(grid, row, e) {
      scaffoldPanel.activateForm('show');
    });
    
    // populate form fields when a row is selected
    this.gridPanel.getSelectionModel().on('rowselect', function(sm, row, rec) {
      scaffoldPanel.formPanel.getForm().loadRecord(rec);
    });

    ds.load({params: {start: 0, limit: this.recordsPerPage} });
    
    // create the form
    var post_form_items = [ // FIXME: tpl
      {  fieldLabel: scaffoldPanel.labels['post[title]'],  xtype: 'textfield',  name: 'post[title]'},
      {  fieldLabel: scaffoldPanel.labels['post[body]'],  xtype: 'textarea',  name: 'post[body]'},
      {  fieldLabel: scaffoldPanel.labels['post[published]'],  xtype: 'checkbox',  inputValue: '1', width: 18, height: 21,  name: 'post[published]'},{   xtype: 'hidden',   value: '0',   name: 'post[published]' }
    ];
    this.formPanel = new ExtScaffold.FormPanel({
      baseParams: scaffoldPanel.baseParams,
      items: post_form_items,
      modeTitles: {
       'show': scaffoldPanel.showModeTitle,
       'edit': scaffoldPanel.editModeTitle,
       'new':  scaffoldPanel.newModeTitle
      },
    
      onOk: function() {
        var selected = scaffoldPanel.gridPanel.getSelectionModel().getSelected();
        var submitOptions = {
          url: scaffoldPanel.url,
          waitMsg: scaffoldPanel.savingMessage,
          params: { format: 'ext_json' },
          success: function(form, action) {
            ds.load();
            scaffoldPanel.activateGrid();
          },
          failure: function(form, action) {
            switch (action.failureType) {
              case Ext.form.Action.CLIENT_INVALID:
              case Ext.form.Action.SERVER_INVALID:
                // validation errors are handled by the form, so we ignore them here
                break;
              case Ext.form.Action.CONNECT_FAILURE:
              case Ext.form.Action.LOAD_FAILURE:
                // these might be 404 Not Found or some 5xx Server Error
                alert(scaffoldPanel.saveFailedText);
                break;
            }
          }
        };

        if (scaffoldPanel.formPanel.currentMode == 'edit') {
          // set up request for Rails create action
          submitOptions.params._method = 'PUT';
          submitOptions.url = submitOptions.url + '/' + selected.data.id;
        }
        scaffoldPanel.formPanel.getForm().submit(submitOptions);
      },
      onCancel: function() {
        scaffoldPanel.activateGrid();
      }
    });

    ExtScaffold.Posts.superclass.constructor.call(this, Ext.applyIf(config, {
      layout:     'slide',
      layoutConfig: {
          easing: 'easeOut',
          duration: .75
      },
      activeItem: 0,
      height:     '100%',
      defaults:   { border: false, frame: false },
      items: [
        scaffoldPanel.gridPanel, // card 0 = grid
        scaffoldPanel.formPanel  // card 1 = form
      ]
    }));
    
  }
});

