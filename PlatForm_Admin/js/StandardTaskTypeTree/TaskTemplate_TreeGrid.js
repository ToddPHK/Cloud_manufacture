var OperateType;

var TaskTemplate11_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 120
});
var taskMould_tbar = new Ext.Toolbar({
    items: [ '->', '模板名称：', TaskTemplate11_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: taskMould_Search
    }]

});



function taskMould_Search() {
    var node = StandardTaskType_TreeGrid.getChecked()[0];
    TaskMudole_TreeLoader.baseParams.StandardTaskID = node.attributes.NodeId;
    TaskMudole_TreeLoader.baseParams.OperateType = "TaskTemplate_Search";
    TaskMudole_TreeLoader.baseParams.Name = TaskTemplate11_Search.getValue();
    // TaskMudole_TreeLoader.baseParams.OperateType = "TaskTemplate_Search";
   // TaskMudole_TreeLoader.dataUrl = 'DataProcess.aspx?OperateType=TaskTemplate_Search';
    refreshTreeGrid_TaskTempalte();
    TaskMudole_TreeGrid.render();

}

var TaskMudole_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var TaskMudole_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'DataProcess.aspx'
});
var TaskMudole_TreeGrid = new Ext.ux.tree.TreeGrid({
    title: '任务模板列表',
    root: TaskMudole_TreeRoot,
    loader: TaskMudole_TreeLoader,
    width: 500,
    height: 300,
    tbar: taskMould_tbar,
    //region: "center",
    enableDD: true,
    tools: [{
        id: 'refresh',
        handler: function () {
            refreshTreeGrid_TaskTempalte();
        }

    }],
    // dataUrl: 'DataProcess.aspx?OperateType=TaskTemplate_TreeGrid_Data',
    columns: [{
        header: '名称',
        dataIndex: 'DisplayName',
        width: 230
    }, {
        header: '模板状态',
        dataIndex: 'State',
        width: 100,
        tpl: new Ext.XTemplate('{State:this.formatState}', {
            formatState: function (v) {
                if (v == 0) {
                    return "创建中";
                }
                else if (v == 1) {

                    return "创建完成";
                }
                else if (v == 2) {

                    return "已生成";
                }
                else if (v == 3) {

                    return "试用中";
                }
                else if (v == 4) {

                    return "标准模板";
                }
                else if (v == 5) {

                    return "已淘汰";
                }
                else if (v == -1) {
                    return "";
                }
            }
        })
    }, {
        header: '提交名',
        width: 100,
        dataIndex: 'name',
        align: 'center'
    }, {
        header: '所属任务类',
        width: 100,
        dataIndex: 'StandardTaskName',
        align: 'center'
    },  {
        header: '提示文本',
        width: 150,
        dataIndex: 'emptyText'
    }, {
        header: '宽度',
        dataIndex: 'width',
        width: 100
    }, {
        header: '高度',
        width: 100,
        dataIndex: 'height',
        align: 'center'
    }, {
        header: '添加时间',
        dataIndex: 'TaskTemplateCreateDate',
        width: 150
    }]

});



function refreshTreeGrid_TaskTempalte() {
 //   TaskMudole_TreeGrid.removeAll();
    TaskMudole_TreeLoader.load(TaskMudole_TreeRoot);
    TaskMudole_TreeRoot.expand();
}

TaskMudole_TreeGrid.on('contextmenu', function (node, e) {
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
var TaskMouldBiding_Window = new Ext.Window({
    layout: 'fit',
    width: 650,
    id: 'TaskMouldBiding_Window',
    height: 500,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '任务模板绑定',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [TaskMudole_TreeGrid],
    buttons: [{
        text: '绑定',
        //点击保存按钮后触发事件  
        handler: function () {
            TaskTempalte_biding();

        }
    }, {
        text: '预览',
        //点击保存按钮后触发事件  
        handler: function () {

            var nodes = TaskMudole_TreeGrid.getChecked();
            TemplatePreview(nodes[0].attributes.name);

        }
    }]
});
function TaskTempalte_biding() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length == 1) {
        var node = nodes[0];
        if (node.attributes.Type == "T") {

            var parms = { OperateType: "TaskTempalteBiding", ID: StandardTaskType_TreeGrid.getChecked()[0].attributes.NodeId, TemplateID: node.attributes.TaskTemplateID };
            CodeOperaMethod("DataProcess.aspx", parms);
        }
        else
            App.setAlert(App.STATUS_NOTICE, "请您选择模板节点而不是模板的元素节点或标签节点！");
    }
    else if (nodes.length > 1) {
        App.setAlert(App.STATUS_NOTICE, "只能为每一个标准任务选择一个模板！");
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "您还没选择模板！");
    }

}
