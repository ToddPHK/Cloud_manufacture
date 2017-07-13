var OperateType;

var TaskTemplate_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 120
});
var StandardTaskType_tbar = new Ext.Toolbar({
    items: [{
        id: 'taskbtnAdd',
        text: "添加",
        iconCls: 'add-icon',
        handler: StandardTaskType_Add

    }, '-', {
        id: 'taskbtnEdit',
        text: "编辑",
        iconCls: 'edit-icon',
        handler: StandardTaskType_Edit
    }, '-', {
        id: 'taskbtnDel',
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            //做删除的操作?");
            var nodes = StandardTaskType_TreeGrid.getChecked();
            if (nodes.length > 0) {
                Ext.MessageBox.confirm('提示', '您将要删除选择内容及其子内容?', StandardTaskType_Delete);

            }
            else {
                Ext.MessageBox.alert("提示", "选择要删除的内容！");
            }

        }

    }, '-', {

        text: "绑定模板",
        iconCls: 'edit-icon',
        handler: function () {
            var nodes = StandardTaskType_TreeGrid.getChecked();
            if (nodes.length > 0) {
                var node = nodes[0];
                TaskMouldBiding_Window.setTitle("为标准任务[" + node.attributes.StandardTaskName + "]绑定任务模板");
                TaskMouldBiding_Window.show();
                TaskMudole_TreeLoader.baseParams.OperateType = "LoadByStandardTaskID";
                TaskMudole_TreeLoader.baseParams.StandardTaskID = node.attributes.NodeId;
                refreshTreeGrid_TaskTempalte();
            }
            else {
                Ext.MessageBox.alert("提示", "选择需要绑定模板的标准任务！");

            }

        }
    }, '->', '任务/服务名称：', TaskTemplate_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: StandardTaskType_Search
    }]

});

function StandardTaskType_Add() {
    var nodes = StandardTaskType_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        StandardTaskType_FormPanel.getForm().findField('ID').setValue(node.attributes.NodeId);
        OperateType = "AddTaskType";
        StandardTaskType_Window.setTitle("添加新的任务/服务类型");
        StandardTaskType_Window.show();
    }
else {
    App.setAlert(App.STATUS_NOTICE, "请选择需添加任务的父节点！");
     //   OperateType = "AddTaskTypeNoParent";
            
    }
   
}
function StandardTaskType_Edit() {
    
    var nodes = StandardTaskType_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        OperateType = "EditTaskType";
        StandardTaskType_FormPanel.getForm().findField('ID').setValue(node.attributes.NodeId);
        StandardTaskType_FormPanel.getForm().findField('StandardTaskTypeName').setValue(node.attributes.StandardTaskName);
        StandardTaskType_FormPanel.getForm().findField('StandardServiceTypeName').setValue(node.attributes.NodeName);
        StandardTaskType_FormPanel.getForm().findField('CodingInit').setValue(node.attributes.CodingInit);
        StandardTaskType_FormPanel.getForm().findField('Description').setValue(decodeURIComponent(node.attributes.Description));
        StandardTaskType_Window.setTitle("编辑标准任务—" + node.attributes.StandardTaskName);

    StandardTaskType_Window.show();
        // alert(node.attributes.xtype);parentNode
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "选择您要修改的内容！");
    }
}
function StandardTaskType_Delete(btn) {
    if (btn == 'yes') {
        var nodes = StandardTaskType_TreeGrid.getChecked();
        var IDs = [];
        //  var nodes = StandardTaskType_TreeGrid.getChecked();
        for (i = 0; i < nodes.length; i++) {
            IDs.push(nodes[i].attributes.NodeId);
        }

        if (IDs.length > 0) {
            var parms = { OperateType: "DeleteNodes", IDs: IDs.join() };
            CodeOperaMethod("DataProcess.aspx", parms);
            refreshTreeGrid();
        }
    }

}

function StandardTaskType_Search() {
    StandardTaskType_TreeLoader.baseParams.Name = TaskTemplate_Search.getValue();
    StandardTaskType_TreeLoader.dataUrl = 'DataProcess.aspx?OperateType=StandardTask_Search';
    refreshTreeGrid();
  //  StandardTaskType_TreeGrid.render();

}




var StandardTaskType_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var StandardTaskType_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'DataProcess.aspx?OperateType=AllStandardTaskType'
});
var StandardTaskType_TreeGrid = new Ext.ux.tree.TreeGrid({
    title: '标准任务/服务管理',
    root: StandardTaskType_TreeRoot,
    loader: StandardTaskType_TreeLoader,
    width: 500,
    height: 300,
    tbar: StandardTaskType_tbar,
    region: "center",
    enableDD: true,
    tools: [{
        id: 'refresh',
        handler: function () {
            refreshTreeGrid();
        }

    }],
    // dataUrl: 'DataProcess.aspx?OperateType=TaskTemplate_TreeGrid_Data',
    columns: [{
        header: '标准任务名',
        dataIndex: 'StandardTaskName',
        width: 230
    }, {
        header: '标准服务名',
        dataIndex: 'NodeName',
        width: 230
    }, {
        header: '编号',
        dataIndex: 'CodingInit',
        width: 100
    }, {
        header: '绑定的任务模板',
        width: 100,
        dataIndex: 'TemplateDisplayName',
        align: 'center'
    }, {
        header: '创建时间',
        width: 100,
        dataIndex: 'CreateDate',
        align: 'center'
    }]


});
function showTypeImage(val) {
    if (val =='T') {
        return ' template';
    }
    else
        return ' template1'; ;
}
function refreshTreeGrid() {
    StandardTaskType_TreeLoader.load(StandardTaskType_TreeRoot);
    StandardTaskType_TreeRoot.expand();
}

StandardTaskType_TreeGrid.on('contextmenu', function (node, e) {
    StandardTaskType_TreeGrid.selectPath(node.getPath());
    menu = new Ext.menu.Menu([{
        text: "展开",
        handler: function () {
            node.expand(true, false);
            //  alert(node.text + '|' + node.id);
        }
    }, {
        text: "收缩",
        handler: function () {
            node.collapse(true, true);
        }
    }])
    menu.showAt(e.getPoint());
});
