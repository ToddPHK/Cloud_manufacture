var prjpagesize = 25, prjOperaType;
var PrjName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var PrjCustomer_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var PrjState_Search = new Ext.form.ComboBox({
    store: ProjectState_Store,
    valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});
var PrjDutyPeople_Search = new Ext.form.ComboBox({
    store: employeeArrayStore,
    valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});


var PrjType_Search = new Ext.form.ComboBox({
    store: ProjectType_Store,
    valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 80
});
var ProjectState_SetCombo_Store = new Ext.data.SimpleStore({
    fields: ['value', 'text', 'target'],
    data: [['0', '开始', '2'], ['1', '结束', '3'], ['2', '挂起', '-1'], ['3', '解除挂起', '-1'], ['4', '置为初始', '1']]
});
var ProjectState_SetCombo = new Ext.form.ComboBox({
    store: ProjectState_SetCombo_Store,
    valueField: 'value',
    editable: false,
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 80
});
ProjectState_SetCombo.on('select', function (combo, Combrec, index) {
    if (prjTableTanel_sm.hasSelection()) {
        var rec = prjTableTanel_sm.getSelected();
        var state = rec.get('项目状态');
        var target = Combrec.get('target');
        if (target == '2') {

            if (state != '1') {
                App.setAlert(App.STATUS_NOTICE, "只有初始状态的项目才可进行此操作！");
                return;
            }
        }
        else if (target == '3') {
            if (state != '2') {
                App.setAlert(App.STATUS_NOTICE, "只有进行中的项目才可进行此操作！");
                return;
            }
        }
        else if (target == '-1') {
            if (state == '1') {
                App.setAlert(App.STATUS_NOTICE, "只有非初始状态的项目才可进行此操作！");
                return;
            }
        }
        else if (target == '1') {
            if (state >0) {
                App.setAlert(App.STATUS_NOTICE, "只有挂起状态的项目才可进行此操作！");
                return;
            }
        }

        if (rec.get("项目创建人") != CurrentUserID && rec.get("项目负责人") != CurrentUserID) {
            App.setAlert(App.STATUS_NOTICE, "您不是[" + rec.get('项目名称') + "]项目的创建人/负责人，无权进行此操作！");
            return;
        }

        var jsonData = { prjOperaType: 'changeState', id: rec.get('序号'), target: target };
        CodeOperaMethod('prjDataManage.ashx', jsonData);
        //重新加载store信息
        prjstore.reload();
        prjTableTanel.store.reload();
    }

})
var Prj_OperateMenu = new Ext.menu.Menu({
    items: [{
        text: "添加",
        iconCls: 'add-icon',
        handler: function () {
            NewPrjFormPanel.getForm().reset();
            prjEdit_Window.show();
            prjEdit_Window.setTitle("添加新项目");
            prjOperaType = 'add';
        }
    }, {
        text: "编辑",
        iconCls: 'edit-icon',
        handler: prjDataEdit
    }, {
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            //Ext.MessageBox.alert("删除", "做删除的操作?");
            prjOperaType = 'delete';
            rows = Ext.getCmp("prjTableTanel").getSelectionModel().getSelections();
            if (rows.length == 0) {
                Ext.Msg.alert("", "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '删除项目会删除项目中项目组的信息，确认删除?', showprjResult);

        }
    }]
});
var prjtbar = new Ext.Toolbar({
    items: [{
        text: "项目操作",
        menu: Prj_OperateMenu
    }, '-', {
        text: "项目构建",
        iconCls: 'edit-icon',
        handler: PrjTaskTreeCons
    }, {
        text: "项目树查看",
        iconCls: 'edit-icon',
        handler: ViewProjectTree
    }, {
        text: "任务纵览",
        iconCls: 'edit-icon',
        handler: ViewTask
    }, '-', '状态修改', ProjectState_SetCombo, '->', '项目名称', PrjName_Search, '客户', PrjCustomer_Search, '负责人', PrjDutyPeople_Search, '状态', PrjState_Search, '类型', PrjType_Search, {
        id: 'prjbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: prjDataSearch
    }]

});
function ViewProjectTree() {
    if (Ext.getCmp("prjTableTanel").getSelectionModel().hasSelection()) {
        var rec = Ext.getCmp("prjTableTanel").getSelectionModel().getSelected();
        ProjectTaskTreeView_Grid.setTitle(rec.get('项目名称') + "——任务树查看");

        ProjectTaskTreeView_Window.show();


        ProjectTaskTreeView_TreeLoader.baseParams.OperateType = "ProjectTaskTree_Data";
        ProjectTaskTreeView_TreeLoader.baseParams.ProjectID = rec.get('序号');
        ProjectTaskTreeView_TreeLoader.load(ProjectTaskTreeView_TreeRoot);
        ProjectTaskTreeView_TreeRoot.expand();
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "请你选择要查看的项目！");
    }

}
function ViewTask() {
    ViewTask_Window.show();
    taskStore.removeAll();
    if (prjTableTanel_sm.hasSelection()) {
        var rec = prjTableTanel_sm.getSelected();
        taskStore.baseParams.PrjID = rec.get('序号');
    }
    else {
        taskStore.baseParams.PrjID = "all";
    }
    taskStore.baseParams.OperateType = "LoadTaskByPrj";
    taskStore.reload();
    taskPageBar.changePage(1);
    
}
function PrjTaskTreeCons() {
    rec = Ext.getCmp("prjTableTanel").getSelectionModel().getSelected();
    if (rec != undefined) {
        if (rec.get("项目状态") < 0 || rec.get("项目状态") == '3') {
            App.setAlert(App.STATUS_NOTICE, "[" + rec.get('项目名称') + "]项目当前的状态不能进行项目构建！");

        }
        else {
            ProjectTaskTree_Grid.setTitle(rec.get('项目名称') + "——任务树构建");
            ProjectTaskTree_Window.PrjID = rec.get('序号');
            ProjectTaskTree_Window.show();


            ProjectTaskTree_TreeLoader.baseParams.OperateType = "ProjectTaskTree_Data";
            ProjectTaskTree_TreeLoader.baseParams.ProjectID = rec.get('序号');
            ProjectTaskTree_TreeLoader.load(ProjectTaskTree_TreeRoot);
            ProjectTaskTree_FormPanel.getForm().findField('ProjectID').setValue(rec.get('序号')); 
            ProjectTaskTree_TreeRoot.expand();
        }


    }
    else
        App.setAlert(App.STATUS_NOTICE, "选择您要构建的项目");
}
function prjDataEdit() {
    rows = Ext.getCmp("prjTableTanel").getSelectionModel().getSelected();
    if (rows == undefined) {
        App.setAlert(App.STATUS_NOTICE, "请你选择一行数据进行操作！");

    }
    else {
        if (rows.get("项目创建人") != CurrentUserID) {
            App.setAlert(App.STATUS_NOTICE, "您不是[" + rows.get('项目名称') + "]项目的创建人，不能修改此项目数据！");
        }

        else {
            NewPrjFormPanel.getForm().reset();
            prjEdit_Window.show();
            prjEdit_Window.setTitle("修改项目");
            //将选中项的信息绑定到TextField中
            NewPrjFormPanel.getForm().findField('id').setValue(rows.get('序号'));
            NewPrjFormPanel.getForm().findField('prjName').setValue(rows.get('项目名称'));
            employeeListCombo.setValue(rows.get('项目负责人'));
            NewPrjFormPanel.getForm().findField('prjCustomer').setValue(rows.get('项目客户名称'));
            ProjectType_Combo.setValue(rows.get('项目类型'));
            NewPrjFormPanel.getForm().findField('prjCodeNumber').setValue(rows.get('项目编号'));
            // NewPrjFormPanel.getForm().findField('prjFileCodeNumber').setValue(rows[0].get('文件号'));
          //  ProjectState_Combo.setValue(rows.get('项目状态'));
            // NewPrjFormPanel.getForm().findField('prjMudleName').setValue(rows[0].get('项目模板名称'));
            NewPrjFormPanel.getForm().findField('prjPlanStartDate').setRawValue(rows.get('项目计划开始日期'));
            NewPrjFormPanel.getForm().findField('prjPlanEndDate').setRawValue(rows.get('项目计划结束日期'));
            NewPrjFormPanel.getForm().findField('prjIntoduction').setValue(decodeURIComponent(rows.get('项目简介')));
            //------------------------------
            prjOperaType = 'edit';
        }
    }
}
function prjDataSearch() {
    prjstore.removeAll();
    prjstore.baseParams.PrjName = PrjName_Search.getValue();
    prjstore.baseParams.PrjCustomer = PrjCustomer_Search.getValue();
    prjstore.baseParams.PrjState = PrjState_Search.getValue();
    prjstore.baseParams.PrjDutyPeople = PrjDutyPeople_Search.getValue();
    prjstore.baseParams.PrjType = PrjType_Search.getValue();
    prjstore.baseParams.prjOperaType = "search";
 //   prjstore.load({ params: { start: 0, limit: 25} });
    prjstore.reload();
    prjpageBar.changePage(1);
}
function showprjResult(btn) {
    if (btn == 'yes') {
        var id = [];
        var rows = Ext.getCmp("prjTableTanel").getSelectionModel().getSelections();
        for (var i = 0, len = rows.length; i < len; i++) {

            id.push(rows[i].get('序号'));
            if (rows[i].get("项目状态") == '2') {
                App.setAlert(App.STATUS_NOTICE, "[" + rows[i].get('项目名称') + "]的当前状态不能进行删除！");
                return;
            }
            if (rows[i].get("项目创建人") != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "您不是[" + rows[i].get('项目名称') + "]项目的创建人，不能删除此项目数据！");
                return;
            }
        }
        var jsonData = { prjOperaType: prjOperaType, id: id.join() };
        CodeOperaMethod('prjDataManage.ashx', jsonData);
        //重新加载store信息
        prjstore.reload();
        prjTableTanel.store.reload();
    }
}
var prjproxy = new Ext.data.HttpProxy({
    url: 'prjTablePanelData.aspx'
    //method: 'GET'
});

var prjreader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "序号" },
                         { name: "项目编号" },
                         { name: "创建日期" },
                         { name: "项目名称" },
                         { name: "项目类型" },
                         { name: "TypeText" },
                         { name: "项目客户名称" },
                         { name: "项目状态" },
                         { name: "StateText" },
                         { name: "项目计划开始日期" },
                         { name: "项目实际开始日期" },
                         { name: "项目计划结束日期" },
                         { name: "项目实际结束日期" },
                         { name: "项目负责人" },
                         { name: "项目创建人" },
                         { name: "PrjCreator" },
                         { name: "人员名称" },
                         { name: "项目简介" }
                        ]
                    );

var prjstore = new Ext.data.Store(
                        { id: 'prjstore', proxy: prjproxy, reader: prjreader }
                    );


var prjpageBar = new Ext.PagingToolbar({
    store: prjstore,
    pageSize: prjpagesize,
    plugins: new Ext.ui.plugins.ComboPageSize(),
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'prjpageBar'
});
var prjTableTanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var prjTableTanel = new Ext.grid.GridPanel({
    title: '项目管理',
    id: "prjTableTanel",
    //  viewConfig: { autoFill: true },
    region: 'center',
    frame: true,
    store: prjstore,
    tbar: prjtbar,
    bbar: prjpageBar,
    sm: prjTableTanel_sm,
    loadMask: true,
    listeners: {//监听
        "rowdblclick": prjDataEdit
    },
    columns: [
                    new Ext.grid.RowNumberer(),
                   prjTableTanel_sm,
                   // { header: 'id', dataIndex: '序号', sortable: true },
                    { header: '项目名称', dataIndex: '项目名称', sortable: true },
                    { header: '项目负责人', dataIndex: '人员名称', sortable: true },
                    { header: '项目创建人', dataIndex: 'PrjCreator', sortable: true },
                    { header: '项目客户', dataIndex: '项目客户名称', sortable: true },
                    { header: '项目类型', dataIndex: 'TypeText', sortable: true },
                    { header: '项目编号', dataIndex: '项目编号', sortable: true },
                    { header: '项目状态', dataIndex: 'StateText', sortable: true, renderer: showState },
                    { header: '创建日期', dataIndex: '创建日期', sortable: true },
                    { header: '项目计划开始日期', dataIndex: '项目计划开始日期', sortable: true },
                    { header: '项目实际开始日期', dataIndex: '项目实际开始日期', sortable: true },
                    { header: '项目计划结束日期', dataIndex: '项目计划结束日期', sortable: true },
                    { header: '项目实际结束日期', dataIndex: '项目实际结束日期', sortable: true }
    //{ header: '项目简介', dataIndex: '项目简介', sortable: true }
            ]
});
function showState(v) {
    if (v == '') {
        return '挂起';
    }
    else
        return v
}
prjstore.load({ params: { start: 0, limit: prjpagesize} });

prjTableTanel.on('render', function (prjTableTanel) {
    var store = prjTableTanel.getStore();  // Capture the Store.    

    var view = prjTableTanel.getView();    // Capture the GridView.    

    prjTableTanel.tip = new Ext.ToolTip({
        target: view.mainBody,    // The overall target element.    

        delegate: '.x-grid3-row', // Each grid row causes its own seperate show and hide.    

        trackMouse: true,         // Moving within the row should not hide the tip.    

        renderTo: document.body,  // Render immediately so that tip.body can be referenced prior to the first show.    

        listeners: {              // Change content dynamically depending on which element triggered the show.    

            beforeshow: function updateTipBody(tip) {
                var rowIndex = view.findRowIndex(tip.triggerElement);
                tip.body.dom.innerHTML = '项目简介：<br>' + decodeURIComponent(store.getAt(rowIndex).get('项目简介'));
            }
        }
    });
}); 