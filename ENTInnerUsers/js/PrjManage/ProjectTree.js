
var OperateType;
var Node_employeeArrayStore = new Ext.data.ArrayStore({
    url: 'DataProcess.aspx',
   // autoLoad: { params: { OperateType: 'LoadPeopleByDepart'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
Node_employeeArrayStore.baseParams.OperateType = "LoadPeopleByDepart";
Node_employeeArrayStore.load();
var OrgStructure_Tree = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'DataProcess.aspx?OperateType=OrgStructureTreeNoCheckBox'
    }),
    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '项目树' })
});
OrgStructure_Tree.on('click', function (node, e) {
    Node_employeeArrayStore.removeAll();
    Node_employeeArrayStore.baseParams.DepartID = node.id;
    Node_employeeArrayStore.baseParams.OperateType = "LoadPeopleByDepart";
    Node_employeeArrayStore.load();

});
var OrgStructure_ComboBox = new Ext.ux.ComboBoxTree({
    hiddenName: 'StandardDieClassID',
    resizable: true,
    width: 120,
    autoScroll: false,
    autoLoad: true,
    fieldLabel: "负责人部门",
    //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
    tree: OrgStructure_Tree,
    selectModel: 'single',
    selectNodeModel: 'all' //只有选叶子时，才设置值 
});

var ProjectTaskTree_tbar = new Ext.Toolbar({
    items: [{
        text: '添加',
        iconCls: 'add-icon',
        handler: ProjectTaskTree_Add
    }, {
        text: '编辑',
        iconCls: 'edit-icon',
        handler: ProjectTaskTree_Edit
    }, {
        text: '删除',
        iconCls: 'delete-icon',
        handler: function () {
            //做删除的操作?");
            var nodes = ProjectTaskTree_Grid.getChecked();
            if (nodes.length > 0) {
                Ext.MessageBox.confirm('提示', '您将要删除选择内容及其子内容?', ProjectTaskTree_Delete);
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "选择要删除的内容！");
            }

        }
    }]

});

function ProjectTaskTree_Add() {
    var nodes = ProjectTaskTree_Grid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
      //  alert(CurrentUserID);
        if (CurrentUserID != node.attributes.Chargor) {
            App.setAlert(App.STATUS_NOTICE, "您不是["+node.attributes.Name+"]节点的负责人，不能创建下一级任务节点！");
        }
        else {
            OperateType = "AddProjectTaskTreeNode";
            ProjectTaskTree_FormPanel.getForm().findField('ID').setValue(node.attributes.ID);
            ProjectTaskTree_NodeWindow.setTitle("项目任务节点添加");
            ProjectTaskTree_NodeWindow.show();
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "选择要添加子任务的节点！");
    }

}
function ProjectTaskTree_Edit() {
    var nodes = ProjectTaskTree_Grid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];

        if (node.parentNode.id == 'PunchModuleRoot') {
            App.setAlert(App.STATUS_NOTICE, "只能编辑[" + node.attributes.Name + "]的子节点！");
            return;
        }
        if (CurrentUserID != node.attributes.Creator) {
            App.setAlert(App.STATUS_NOTICE, "您不是[" + node.attributes.Name + "]节点的创建人，不能进行修改！");
        }
        else {
            OperateType = "EditProjectTaskTreeNode";
            ProjectTaskTree_FormPanel.getForm().findField('ID').setValue(node.attributes.ID);
            ProjectTaskTree_FormPanel.getForm().findField('Name').setValue(node.attributes.Name);
            ProjectTaskChargor_ComboBox.setValue(node.attributes.Chargor);
            OrgStructure_ComboBox.setValue(node.attributes.Department)
            ProjectTaskTree_NodeWindow.setTitle("项目任务节点编辑")
            ProjectTaskTree_NodeWindow.show();
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "选择您要修改的内容！");
    }
}
function ProjectTaskTree_Delete() {
    var nodes = ProjectTaskTree_Grid.getChecked();
    var IDs = [];
    for (i = 0; i < nodes.length; i++) {

        if (nodes[i].parentNode.id == 'PunchModuleRoot') {
            App.setAlert(App.STATUS_NOTICE, "只能删除[" + nodes[i].attributes.Name + "]的子节点！");
            return;
        }
        if (CurrentUserID != nodes[i].attributes.Chargor) {
            App.setAlert(App.STATUS_NOTICE, "您不是[" + nodes[i].attributes.Name + "]节点的负责人，不能删除该任务节点！");
            return;
        }
        IDs.push(nodes[i].attributes.ID);
    }

    if (IDs.length > 0) {
        var parms = { OperateType: "DeleteProjectTaskTreeNode", IDs: IDs.join() };
        CodeOperaMethod("ProjectTree.aspx", parms);
    }

}

var ProjectTaskTree_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var ProjectTaskTree_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'ProjectTree.aspx'
});
var ProjectTaskTree_Grid = new Ext.ux.tree.TreeGrid({
    title: '项目任务树构建',
    root: ProjectTaskTree_TreeRoot,
    loader: ProjectTaskTree_TreeLoader,
    width: 500,
    height: 300,
    tbar: ProjectTaskTree_tbar,
    region: "center",
    enableDD: true,
    tools: [{
        id: 'refresh',
        handler: function () {
            ProjectTaskTree_Grid_refresh();
        }

    }],
    columns: [{
        header: '名称',
        dataIndex: 'Name',
        width: 230
    }, {
        header: '节点创建人',
        width: 100,
        dataIndex: 'CreatorPeopleName',
        align: 'center'
    }, {
        header: '负责人',
        width: 150,
        dataIndex: 'ChargorPeopleName'
    }, {
        header: '负责人所属部门',
        width: 100,
        dataIndex: 'Department'
    },{
        header: '创建时间',
        dataIndex: 'CreateDate',
        width: 150
    }],
    dropConfig: { appendOnly: false },
    listeners: {
        "nodedragover": function (e) {

            var node = e.target;
            if (e.dropNode.attributes.xtype == "C" || e.dropNode.attributes.xtype == "T" || e.target.attributes.xtype != "C" || e.target.parentNode.attributes.ID != e.dropNode.parentNode.parentNode.attributes.ID || e.target.attributes.ID == e.dropNode.parentNode.attributes.ID) {

                return false;
            }
            else {
                if (node.leaf) node.leaf = false;
                return true;
            }

        },
        "nodedrop": function (e) {

            var jsonData = { OperateType: "MoveElement", NodeID: e.dropNode.attributes.ID, TargetNodeID: e.target.attributes.ID };
            CodeOperaMethod('ProjectTree.aspx', jsonData);
            return true;

        }
    }
});

function ProjectTaskTree_Grid_refresh() {
    ProjectTaskTree_TreeLoader.load(ProjectTaskTree_TreeRoot);
    ProjectTaskTree_TreeRoot.expand();
}

ProjectTaskTree_Grid.on('contextmenu', function (node, e) {
    ProjectTaskTree_Grid.selectPath(node.getPath());
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

var ProjectTaskChargor_ComboBox = new Ext.form.ComboBox({
    store: Node_employeeArrayStore,
    fieldLabel: "负责人",
    labelWidth: 20,
    hiddenName: 'Chargor',
    editable:true,
    //name: 'xtype',
    valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 120
});


var ProjectTaskTree_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    // layout: "form", // 整个大的表单是form布局
    labelAlign: "left",
    items: [
    {
        xtype: "textfield",
        fieldLabel: "任务名",
        labelWidth: 20,
        allowBlank: false,
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        name: 'Name',
        width: 120
    }, OrgStructure_ComboBox,ProjectTaskChargor_ComboBox, {
        xtype: "hidden",
        name: 'ID'
    }, {
        xtype: "hidden",
        name: 'ProjectID'
    }]
});
var ProjectTaskTree_NodeWindow = new Ext.Window({
    //layout: 'fit',
    width: 300,
    height: 148,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '项目任务节点添加',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [ProjectTaskTree_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SubmitProjectTaskTreeNode();

        }
    }]
});
ProjectTaskTree_NodeWindow.on('hide', function () {
    OrgStructure_ComboBox.setValue('')
    ProjectTaskChargor_ComboBox.setValue('');
    ProjectTaskTree_FormPanel.getForm().findField('Name').setValue('');
})
var ProjectTaskTree_Window = new Ext.Window({
    collapsible: true,
    layout: 'border',
    width: 800,
    height: 500,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '项目构建',
    // bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [ProjectTaskTree_Grid],
    buttons: [{
        text: '关闭',
        //点击保存按钮后触发事件  
        handler: function () {
            ProjectTaskTree_Window.close();
        }
    }]
});

function SubmitProjectTaskTreeNode() {
    if (ProjectTaskTree_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        ProjectTaskTree_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'ProjectTree.aspx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: OperateType
            },
            success: function (form, action) {
                ProjectTaskTree_NodeWindow.hide();
                ProjectTaskTree_Grid_refresh();
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
            }
        });
    }
}
