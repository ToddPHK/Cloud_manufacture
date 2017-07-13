var prjpagesize = 25;   //显示项目的默认数量
var OperateType;    //handler处理的操作类型

//-----------------项目搜索框----------------//
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

//-----------------项目上方工具栏----------------//
var prjtbar = new Ext.Toolbar({
    items: [ {
        id: 'prjbtnDel',
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            //Ext.MessageBox.alert("删除", "做删除的操作?");
            OperateType = 'delete';
            if (!prjTableTanel_sm.hasSelection()) {
                App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
                return;
            }
            Ext.MessageBox.confirm('提示', '删除项目会删除项目中任务树及相关任务的详细信息，确认删除?', showprjResult);

        }

    }, '-', {
        text: "任务纵览",
        iconCls: 'edit-icon',
        handler: ViewTask
    }, '-', {
        text: "任务树",
        iconCls: 'edit-icon',
        handler: PrjTaskTreeCons
    },
    '->', '项目名称', PrjName_Search, '客户',PrjCustomer_Search, '负责人',PrjDutyPeople_Search, '状态',PrjState_Search, '类型',PrjType_Search, {
        id: 'prjbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: prjDataSearch
    }]

});

//-----------------删除项目----------------//
function showprjResult(btn) {
    if (btn == 'yes') {
        var id = [];
        var rows = prjTableTanel_sm.getSelections();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rec.get("项目状态") != '2')
                id.push(rec.get("序号"));
            else {
                App.setAlert(App.STATUS_NOTICE, "当前项目的状态不能进行删除！");
                return;
            }
        }
        var jsonData = { OperateType: OperateType, id: id.join() };
        CodeOperaMethod('DataProcess.aspx', jsonData);
        //重新加载store信息
        prjstore.reload();
        prjTableTanel.store.reload();
    }
}

var CodeOperaMethod = function (u, p) {
    var conn = new Ext.data.Connection();
    conn.request({
        //请求的 Url  
        url: u,
        // 传递的参数  
        params: p,
        method: 'post',
        scope: this,
        //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
        callback: function (options, success, response) {
            var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象
            if (result.success) {
                roleTabletore.reload();
            }
            App.setAlert(App.STATUS_NOTICE, result.msg);
        }
    });
};

//----------------任务纵览----------------//
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

//----------------项目任务树----------------//
function PrjTaskTreeCons() {
    rec = Ext.getCmp("prjTableTanel").getSelectionModel().getSelected();
    if (rec != undefined) {
        ProjectTaskTree_Window.setTitle("["+rec.get('项目名称') + "]任务树");
        ProjectTaskTree_Window.PrjID = rec.get('序号');
        ProjectTaskTree_Window.show();
        ProjectTaskTree_TreeLoader.baseParams.OperateType = "ProjectTaskTree_Data";
        ProjectTaskTree_TreeLoader.baseParams.ProjectID = rec.get('序号');
        ProjectTaskTree_TreeLoader.load(ProjectTaskTree_TreeRoot);
        ProjectTaskTree_TreeRoot.expand();
    }
    else
        App.setAlert(App.STATUS_NOTICE, "选择您要构建的项目");
}

//----------------项目搜索----------------//
function prjDataSearch() {
    prjstore.baseParams.PrjName = PrjName_Search.getValue();
    prjstore.baseParams.PrjCustomer = PrjCustomer_Search.getValue();
    prjstore.baseParams.PrjState = PrjState_Search.getValue();
    prjstore.baseParams.PrjDutyPeople = PrjDutyPeople_Search.getValue();
    prjstore.baseParams.PrjType = PrjType_Search.getValue();
    prjstore.baseParams.OperateType = "search";
    prjstore.reload();
    prjpageBar.changePage(1);
}

//----------------双击编辑项目信息----------------//
function prjDataEdit() {
  var  rec=prjTableTanel_sm.getSelected();
    prjEdit_Window.show();
    prjEdit_Window.setTitle("项目详细信息");
    NewPrjFormPanel.getForm().findField('id').setValue(rec.get('序号'));
    NewPrjFormPanel.getForm().findField('prjName').setValue(rec.get('项目名称'));
    employeeListCombo.setValue(rec.get('项目负责人'));
    NewPrjFormPanel.getForm().findField('prjCustomer').setValue(rec.get('项目客户名称'));
    ProjectType_Combo.setValue(rec.get('项目类型'));
    NewPrjFormPanel.getForm().findField('prjCodeNumber').setValue(rec.get('项目编号'));
    ProjectState_Combo.setValue(rec.get('项目状态'));
    NewPrjFormPanel.getForm().findField('prjPlanStartDate').setRawValue(rec.get('项目计划开始日期'));
    NewPrjFormPanel.getForm().findField('prjPlanEndDate').setRawValue(rec.get('项目计划结束日期'));
    NewPrjFormPanel.getForm().findField('prjIntoduction').setValue(decodeURIComponent(rec.get('项目简介')));
    //------------------------------
}

//----------------整张表格数据的代理----------------//
var prjproxy = new Ext.data.HttpProxy({
    url: 'prjTablePanelData.aspx'
    //method: 'GET'
});

//----------------读取Json数据的容器----------------//
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
                         { name: "PrjCreator" },
                         { name: "人员名称" },
                         { name: "项目简介" }
                        ]
                    );

//---------------项目信息数据----------------//
var prjstore = new Ext.data.Store(
                        { id: 'prjstore', proxy: prjproxy, reader: prjreader }
                    );

//---------------底部数据数量，包含一个外部控件----------------//
var prjpageBar = new Ext.PagingToolbar({
    store: prjstore,
    pageSize: prjpagesize,
    plugins: new Ext.ui.plugins.ComboPageSize(),
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'prjpageBar'
});

//---------------选中的projectmodel----------------//
var prjTableTanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });

//---------------整个PANEL显示外观---------------//
var prjTableTanel = new Ext.grid.GridPanel({
    title: '项目管理',
    id: "prjTableTanel",
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
                    { header: '项目名称', dataIndex: '项目名称', sortable: true },
                    { header: '项目负责人', dataIndex: '人员名称', sortable: true },
                    { header: '项目创建人', dataIndex: 'PrjCreator', sortable: true },
                    { header: '项目客户', dataIndex: '项目客户名称', sortable: true },
                    { header: '项目类型', dataIndex: 'TypeText', sortable: true },
                    { header: '项目编号', dataIndex: '项目编号', sortable: true },
                    { header: '项目状态', dataIndex: 'StateText', sortable: true },
                    { header: '创建日期', dataIndex: '创建日期', sortable: true },
                    { header: '项目计划开始日期', dataIndex: '项目计划开始日期', sortable: true },
                    { header: '项目实际开始日期', dataIndex: '项目实际开始日期', sortable: true },
                    { header: '项目计划结束日期', dataIndex: '项目计划结束日期', sortable: true },
                    { header: '项目实际结束日期', dataIndex: '项目实际结束日期', sortable: true }
            ]
});
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
                tip.body.dom.innerHTML = '项目简介：<br>' +decodeURIComponent(store.getAt(rowIndex).get('项目简介'));
            }
        }
    });
}); 