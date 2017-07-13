Ext.onReady(function () {
    var OperateType;
    var ProjectTypeDataManageEditPanel = new Ext.form.FormPanel({
        frame: false,
        //   layout: "form", // 整个大的表单是form布局
        labelAlign: "right",
        items: [{
            name: 'ID',
            submitValue: false,
            xtype: 'hidden'
        }, {
            fieldLabel: "类型名",
            submitValue: false,
            xtype: 'textfield',
            regex: /^[^\\'‘’]+$/,
            regexText: "不能包含单引号",
            allowBlank: false,
            name: 'TypeText',
            width: 200

        }, {
            fieldLabel: "类型描述",
            submitValue: false,
            xtype: 'textarea',
            name: 'TypeDescribe',
            height: 150,
            width: 200
        }]

    });
    var ProjectTypeDataManageEdit_Window = new Ext.Window({
        width: 350,
        height: 250,
        modal: true,
        closeAction: "hide",
        plain: true,
        title: '类型添加',
        buttonAlign: 'center',
        items: [ProjectTypeDataManageEditPanel],
        buttons: [{
            text: '保存',
            //点击保存按钮后触发事件  
            handler: function () {
                if (ProjectTypeDataManageEditPanel.form.isValid())//判断是否通过客户端验证
                {
                    var Name = ProjectTypeDataManageEditPanel.getForm().findField('TypeText').getRawValue();
                    var Description = escape(ProjectTypeDataManageEditPanel.getForm().findField('TypeDescribe').getRawValue());
                    if (Description.length > 500) {
                        App.setAlert(App.STATUS_NOTICE, "角色描述内容太长！");
                        return;
                    }
                    var param;
                    if (OperateType == "DataEdit") {
                        var ID = ProjectTypeDataManageEditPanel.getForm().findField('ID').getValue();
                        param = { OperateType: OperateType, ID: ID, Name: Name, Description: Description };

                    }
                    else {
                        param = { OperateType: OperateType, Name: Name, Description: Description };
                    }

                    ProjectTypeDataManageEditPanel.form.submit({
                        waitMsg: '正在提交数据请稍等...', 		//提示信息
                        waitTitle: '提示', 					//标题
                        url: 'ProjectTypeData.aspx', //请求的url地址
                        method: 'POST',
                        params: param,
                        success: function (form, action) {
                            ProjectTypeDataManageEdit_Window.hide();

                            App.setAlert(App.STATUS_NOTICE, action.result.msg);

                            ProjectTypeDataManageStore.reload();
                            ProjectTypeDataManageTablePanel.store.reload();

                        },
                        failure: function (form, action) {
                            App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            //  App.setAlert(App.STATUS_NOTICE, '对模板行的操作失败');

                        }
                    });
                }

            }
        }]
    });
    ProjectTypeDataManageEdit_Window.on('hide', function () {
        ProjectTypeDataManageEditPanel.getForm().findField('TypeText').setValue("");
        ProjectTypeDataManageEditPanel.getForm().findField('TypeDescribe').setValue("");
    });
    var ProjectTypeDataManagetbar = new Ext.Toolbar({
        items: [
    {
        text: "添加",
        iconCls: 'add-icon',
        handler: TypeDataAdd
    }, '-', {
        text: "编辑",
        iconCls: 'edit-icon',
        handler: TypeDataEdit
    }, '-', {
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            if (ProjectTypeDataManageTablePanel_sm.hasSelection()) {
                Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', TypeDataDelete);

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
            }


        }

    }, '->', new Ext.Toolbar.TextItem('类型名称：'), { xtype: 'textfield', id: 'TypeName' }, {
        text: "搜索",
        iconCls: 'search-icon',
        handler: TypeDataSearch
    }]

    });
    function TypeDataEdit() {
        rec = ProjectTypeDataManageTablePanel.getSelectionModel().getSelected();
        if (rec == undefined) {
            Ext.Msg.alert("提示", "请你您要编辑的项目类型！");
        }
        else {
            OperateType = 'DataEdit';
            ProjectTypeDataManageEditPanel.getForm().findField('ID').setValue(rec.get("TypeID"));
            ProjectTypeDataManageEditPanel.getForm().findField('TypeText').setValue(rec.get("TypeText"));
            ProjectTypeDataManageEditPanel.getForm().findField('TypeDescribe').setValue(unescape(rec.get("TypeDescribe")));
            ProjectTypeDataManageEdit_Window.setTitle("类型编辑");
            ProjectTypeDataManageEdit_Window.show();
        }
    }

    function TypeDataAdd() {
        OperateType = "DataAdd";
        ProjectTypeDataManageEdit_Window.setTitle("类型添加");
        ProjectTypeDataManageEdit_Window.show();
    }

    function TypeDataSearch() {
        ProjectTypeDataManageStore.removeAll();
        var TypeName = ProjectTypeDataManagetbar.findById('TypeName').getValue();
        OperateType = 'DataSearch';
        ProjectTypeDataManageStore.load({ params: { OperateType: OperateType, TypeName: TypeName} });
    }

    function TypeDataDelete(btn) {
        if (btn == 'yes') {
            var IDS = [];
            var rows = ProjectTypeDataManageTablePanel.getSelectionModel().getSelections();
            for (var i = 0, len = rows.length; i < len; i++) {
                IDS.push(rows[i].get('TypeID'));
            }
            var jsonData = { OperateType: "DataDelete", IDS: IDS.join() };
            CodeOperaMethod('ProjectTypeData.aspx', jsonData);
            //重新加载store信息
            ProjectTypeDataManageStore.reload();
            ProjectTypeDataManageTablePanel.store.reload();
        }
    }
    var ProjectTypeDataManageProxy = new Ext.data.HttpProxy({
        url: 'ProjectTypeData.aspx'
    });

    var ProjectTypeDataManageReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "TypeID" },
                        { name: "TypeText" },
                        { name: "TypeDescribe" },
                         { name: "AddTime" }
                        ]
                    );

    var ProjectTypeDataManageStore = new Ext.data.Store(
                        { proxy: ProjectTypeDataManageProxy, reader: ProjectTypeDataManageReader }
                    );



    var ProjectTypeDataManageTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
    var ProjectTypeDataManageTablePanel = new Ext.grid.GridPanel({
        title: '项目类型',
        minSize: 400,
        split: true,
        width: 450,
        collapsed: false,
        autoScroll: true,
        layout: "fit",
        region: 'center',
        frame: true,
        store: ProjectTypeDataManageStore,
        tbar: ProjectTypeDataManagetbar,
        sm: ProjectTypeDataManageTablePanel_sm,
        loadMask: true,
        listeners: {//监听
            "rowdblclick": TypeDataEdit
        },
        columns: [
                    new Ext.grid.RowNumberer(),
                    ProjectTypeDataManageTablePanel_sm,
                    { header: 'ID', dataIndex: 'TypeID', sortable: true, hidden: true },
                       { header: '类型名', dataIndex: 'TypeText', sortable: true },
                    { header: '添加时间', dataIndex: 'AddTime', width: 150, sortable: true }


            ]
    });
    ProjectTypeDataManageStore.load({ params: { OperateType: "LoadData"} });
    ProjectTypeDataManageTablePanel.on('render', function (taskTablePanel) {
        var store = taskTablePanel.getStore();  // Capture the Store.    

        var view = taskTablePanel.getView();    // Capture the GridView.    

        taskTablePanel.tip = new Ext.ToolTip({
            target: view.mainBody,    // The overall target element.    

            delegate: '.x-grid3-row', // Each grid row causes its own seperate show and hide.    

            trackMouse: true,         // Moving within the row should not hide the tip.    

            renderTo: document.body,  // Render immediately so that tip.body can be referenced prior to the first show.    

            listeners: {              // Change content dynamically depending on which element triggered the show.    

                beforeshow: function updateTipBody(tip) {
                    var rowIndex = view.findRowIndex(tip.triggerElement);
                    tip.body.dom.innerHTML = '类型描述：<br>' + unescape(store.getAt(rowIndex).get('TypeDescribe'));
                }
            }
        });
    });
    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [ProjectTypeDataManageTablePanel
            ]
    });

});