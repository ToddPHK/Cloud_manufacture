Ext.onReady(function () {
    var RoleDataManagePageSize = 20, RoleDataManageOperaType;
    var RoleDataManageEditPanel = new Ext.form.FormPanel({
        frame: false,
        //   layout: "form", // 整个大的表单是form布局
        labelAlign: "right",
        items: [{
            name: 'ID',
            submitValue: false,
            xtype: 'hidden'
        }, {
            fieldLabel: "角色名",
            xtype: 'textfield',
            submitValue: false,
            regex: /^[^\\'‘’]+$/,
            regexText: "不能包含单引号",
            allowBlank: false,
            name: 'Name',
            width: 200

        }, {
            fieldLabel: "角色描述",
            xtype: 'textarea',
            submitValue: false,
            name: 'Description',
            height: 150,
            width: 200
        }]

    });
    var RoleDataManageEdit_Window = new Ext.Window({
        width: 350,
        height: 250,
        modal: true,
        closeAction: "hide",
        plain: true,
        title: '角色添加',
        buttonAlign: 'center',
        items: [RoleDataManageEditPanel],
        buttons: [{
            text: '保存',
            //点击保存按钮后触发事件  
            handler: function () {
                if (RoleDataManageEditPanel.form.isValid())//判断是否通过客户端验证
                {
                    var Name = RoleDataManageEditPanel.getForm().findField('Name').getRawValue();
                    var Description = escape(RoleDataManageEditPanel.getForm().findField('Description').getRawValue());
                    if (Description.length > 500) {
                        App.setAlert(App.STATUS_NOTICE, "角色描述内容太长！");
                        return;
                    }
                    var param;
                    if (RoleDataManageOperaType == "RoleDataManageEdit") {
                        var ID = RoleDataManageEditPanel.getForm().findField('ID').getValue();
                        param = { RoleDataManageOperaType: RoleDataManageOperaType, ID: ID, Name: Name, Description: Description };

                    }
                    else {
                        param = { RoleDataManageOperaType: RoleDataManageOperaType, Name: Name, Description: Description };
                    }
                    RoleDataManageEditPanel.form.submit({
                        waitMsg: '正在提交数据请稍等...', 		//提示信息
                        waitTitle: '提示', 					//标题
                        url: 'RoleTableData.aspx', //请求的url地址
                        method: 'POST',
                        params: param,
                        success: function (form, action) {
                            RoleDataManageEdit_Window.hide();

                            App.setAlert(App.STATUS_NOTICE, action.result.msg);

                            RoleDataManageStore.reload();


                        },
                        failure: function (form, action) {
                            App.setAlert(App.STATUS_NOTICE, action.result.msg);
                            //  App.setAlert(App.STATUS_NOTICE, '对模板行的操作失败');

                        }
                    });
                    //                    CodeOperaMethod('RoleTableData.aspx', param);
                    //                    //重新加载store信息
                    //                    RoleDataManageStore.reload();
                    //                    RoleDataManageTablePanel.store.reload();
                }

            }
        }]
    });
    RoleDataManageEdit_Window.on('hide', function () {
        RoleDataManageEditPanel.getForm().findField('Name').setValue("");
        RoleDataManageEditPanel.getForm().findField('Description').setValue("");
    });
    var RoleDataManagetbar = new Ext.Toolbar({
        items: [
    {
        text: "添加",
        iconCls: 'add-icon',
        handler: RoleDataManageAdd
    }, '-', {
        text: "编辑",
        iconCls: 'edit-icon',
        handler: RoleDataManageDataEdit
    }, '-', {
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            RoleDataManageOperaType = 'DeleteRole';
            rows = RoleDataManageTablePanel.getSelectionModel().getSelections();
            if (rows.length == 0) {
                App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', RoleDataManageDelete);

        }

    }, '-', {
        text: "更新数据",
        iconCls: 'edit-icon',
        handler: Refresh_RoleData
    }, '->', new Ext.Toolbar.TextItem('角色名称：'), { xtype: 'textfield', id: 'RoleDataManageSearch' }, {
        id: 'RoleDataManagebtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: RoleDataManageDataSearch
    }]

});
function Refresh_RoleData() {

    CodeOperaMethod('RoleTableData.aspx', { RoleDataManageOperaType: "RefreshDataFromServer" });
    RoleDataManageStore.reload();
}
    function RoleDataManageDataEdit() {
        rec = RoleDataManageTablePanel.getSelectionModel().getSelected();
        if (rec == undefined) {
            Ext.Msg.alert("提示", "请你您要编辑的角色！");
        }
        else {
            RoleDataManageEditPanel.form.reset();
            RoleDataManageOperaType = 'RoleDataManageEdit';
            RoleDataManageEditPanel.getForm().findField('ID').setValue(rec.get("ID"));
            RoleDataManageEditPanel.getForm().findField('Name').setValue(rec.get("Name"));
            RoleDataManageEditPanel.getForm().findField('Description').setValue(unescape(rec.get("Description")));
            RoleDataManageEdit_Window.setTitle("角色编辑");
            RoleDataManageEdit_Window.show();
        }
    }

    function RoleDataManageAdd() {
        RoleDataManageEditPanel.form.reset();
        RoleDataManageOperaType = "RoleDataManageAdd";
        RoleDataManageEdit_Window.setTitle("角色添加");
        RoleDataManageEdit_Window.show();
    }

    function RoleDataManageDataSearch() {
        RoleDataManageStore.removeAll();

        RoleDataManageStore.baseParams.RoleDataManageName = RoleDataManagetbar.findById('RoleDataManageSearch').getValue();
        RoleDataManageStore.baseParams.RoleDataManageOperaType = "GroupSearch";
        RoleDataManageStore.reload();
        //        var RoleDataManageName = RoleDataManagetbar.findById('RoleDataManageSearch').getValue();
        //        RoleDataManageOperaType = 'GroupSearch';
        //        RoleDataManageStore.load({ params: { RoleDataManageOperaType: RoleDataManageOperaType, RoleDataManageName: RoleDataManageName} });
        RoleDataManagePageBar.changePage(1);
    }

    function RoleDataManageDelete(btn) {
        if (btn == 'yes') {
            var IDS;
            var rows = RoleDataManageTablePanel.getSelectionModel().getSelections();
            for (var i = 0, len = rows.length; i < len; i++) {
                if (rows.length == 0) {
                    IDS = rows[i].get('ID');
                }
                else {
                    if (i == 0) {
                        IDS = rows[i].get('ID');
                    }
                    else
                        IDS += "," + rows[i].get('ID');
                }

            }
            var jsonData = { RoleDataManageOperaType: RoleDataManageOperaType, IDS: IDS };
            CodeOperaMethod('RoleTableData.aspx', jsonData);
            //重新加载store信息
            RoleDataManageStore.reload();
            RoleDataManageTablePanel.store.reload();
        }
    }
    var RoleDataManageProxy = new Ext.data.HttpProxy({
        url: 'RoleTableData.aspx'
    });

    var RoleDataManageReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "Name" },
                        { name: "CreateDate" },
                         { name: "Description" }
                        ]
                    );

    var RoleDataManageStore = new Ext.data.Store(
                        { proxy: RoleDataManageProxy, reader: RoleDataManageReader }
                    );


    var RoleDataManagePageBar = new Ext.PagingToolbar({
        store: RoleDataManageStore,
        pageSize: RoleDataManagePageSize,
        plugins: new Ext.ui.plugins.ComboPageSize(),
        displayInfo: true,
        displayMsg: '总记录数 {0} - {1} of {2}',
        emptyMsg: "没有记录",
        id: 'RoleDataManagePageBar'
    });
    var RoleDataManageTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
    var RoleDataManageTablePanel = new Ext.grid.GridPanel({
        title: '角色管理',
        minSize: 400,
        split: true,
        width: 450,
        collapsed: false,
        autoScroll: true,
        layout: "fit",
        region: 'center',
        frame: true,
        store: RoleDataManageStore,
        tbar: RoleDataManagetbar,
        bbar: RoleDataManagePageBar,
        sm: RoleDataManageTablePanel_sm,
        loadMask: true,
        listeners: {//监听
            "rowdblclick": RoleDataManageDataEdit
        },
        columns: [
                    new Ext.grid.RowNumberer(),
                    RoleDataManageTablePanel_sm,
                    { header: 'ID', dataIndex: 'ID', sortable: true, hidden: true },
                       { header: '角色名', dataIndex: 'Name', sortable: true },
                    { header: '创建时间', dataIndex: 'CreateDate', width: 150, sortable: true }


            ]
    });
    RoleDataManageStore.load({ params: { start: 0, limit: RoleDataManagePageSize} });
    RoleDataManageTablePanel.on('render', function (taskTablePanel) {
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
                    tip.body.dom.innerHTML = '角色描述：<br>' + unescape(store.getAt(rowIndex).get('Description'));
                }
            }
        });
    });
    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [RoleDataManageTablePanel
            ]
    });

});