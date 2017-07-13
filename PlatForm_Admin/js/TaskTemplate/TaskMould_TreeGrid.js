
var OperateType;

var TaskTemplate_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 120
});
var TaskTemplate_EditMenu = new Ext.menu.Menu({
    items: [{
        text: '添加',
        iconCls: 'add-icon',
        handler: taskMould_Add
    }, {
        text: '修改',
        iconCls: 'edit-icon',
        handler: taskMould_Edit
    }, {
        text: '删除',
        iconCls: 'delete-icon',
        handler: function () {
            //做删除的操作?");
            var nodes = TaskMudole_TreeGrid.getChecked();
            if (nodes.length > 0) {
                Ext.MessageBox.confirm('提示', '您将要删除选择内容及其子内容?', taskMould_Delete);
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "选择要删除的内容！");
            }

        }
    }, '-', {
        text: "模板继承",
        iconCls: 'edit-icon',
        handler: Inherit_Template
    }, '-', {
        text: "启用Wiki",
        iconCls: 'edit-icon',
        handler: Use_Wiki
    }, {
        text: "禁用Wiki",
        iconCls: 'edit-icon',
        handler: UnUse_Wiki
    }]
});
function Use_Wiki() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        var TemplateNode = GetTopNode(node);

        if (TemplateNode.attributes.State != '0')
            App.setAlert(App.STATUS_NOTICE, "只有创建中的模板才能进行此操作！");
        else {
            if (UserType != 'PlatFormUser') {
                if (TemplateNode.attributes.Establish_Wiki == '2') {
                    App.setAlert(App.STATUS_NOTICE, "当前模板已被管理员启用‘禁止编辑’，你无权进行此操作！");
                    return;
                }
                if (node.attributes.CompanyID != CompanyID || node.attributes.CreatorID != CreatorID) {//当前登录者模板不是模板创建人

                    App.setAlert(App.STATUS_NOTICE, "当前节点不是您创建的，你无权进行此操作！");
                    return;
                }
                var parms = { OperateType: "Use_Wiki", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();
            }
            else {
                if (node.attributes.Type == "T") {
                    var parms = { OperateType: "Use_Wiki", ID: node.attributes.TaskTemplateID };
                    CodeOperaMethod("DataProcess.aspx", parms);
                    refreshTreeGrid();

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
                }

            }

        }

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个节点！");
}
function UnUse_Wiki() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        var TemplateNode = GetTopNode(node);

        if (TemplateNode.attributes.State != '0')
            App.setAlert(App.STATUS_NOTICE, "只有创建中的模板才能进行此操作！");
        else {
            if (UserType != 'PlatFormUser') {
                if (TemplateNode.attributes.Establish_Wiki == '2') {
                    App.setAlert(App.STATUS_NOTICE, "当前模板已被管理员启用‘禁止编辑’，你无权进行此操作！");
                    return;
                }
                if (node.attributes.CompanyID != CompanyID || node.attributes.CreatorID != CreatorID) {//当前登录者模板不是模板创建人

                    App.setAlert(App.STATUS_NOTICE, "当前节点不是您创建的，你无权进行此操作！");
                    return;
                }
                var parms = { OperateType: "UnUse_Wiki", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();
            }
            else {
                if (node.attributes.Type == "T") {
                    var parms = { OperateType: "UnUse_Wiki", ID: node.attributes.TaskTemplateID };
                    CodeOperaMethod("DataProcess.aspx", parms);
                    refreshTreeGrid();

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
                }

            }

        }

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个节点！");
}

var TaskTemplate_OperateMenu = new Ext.menu.Menu({
    items: [{
        text: "生成任务模板",
        iconCls: 'edit-icon',
        handler: taskMould_Create
    }, '-', {

        text: "提升为标准模板",
        iconCls: 'edit-icon',
        handler: PromoteAs_StandardTemplate
    }, '-', {

        text: "确认创建完成",
        iconCls: 'edit-icon',
        handler: FinishCreate_StandardTemplate
    }, '-', {

        text: "废除模板",
        iconCls: 'edit-icon',
        handler: Abolish_Template
    }, '-', {

        text: "启用模板",
        iconCls: 'edit-icon',
        handler: UseAgain_Template
    }, '-', {
        text: "禁止编辑",
        iconCls: 'edit-icon',
        handler: NoEditable_Template
    }]
});
function NoEditable_Template() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        var TemplateNode = GetTopNode(node);

        if (node.attributes.State != '0')
            App.setAlert(App.STATUS_NOTICE, "只有创建中的模板才能进行此操作！");
        else {

            if (node.attributes.Type == "T") {
                var parms = { OperateType: "NoEditable_Template", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
            }
        }
    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个节点！");

}
var taskMould_tbar = new Ext.Toolbar({
    items: [{
        text: "编辑",
        menu: TaskTemplate_EditMenu
    }, '-' /* {
            text: "模板操作(O)",
            menu: TaskTemplate_OperateMenu
        }'-', {
            text: "显示模板所有相关评论",
            iconCls: 'edit-icon',
            handler: ShowAll_templateComment
        }, '-', {

            text: "显示所有",
            iconCls: 'edit-icon',
            handler: taskMould_ShowAll
        }, '->', '模板名称：', TaskTemplate_Search, {
            id: 'taskbtnSearch',
            text: "搜索",
            handler: taskMould_Search
        }*/]

});

function UseAgain_Template() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];

        if (node.attributes.Type == "T") {
            if (node.attributes.State == '5') {
                var parms = { OperateType: "UseAgain", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "只有废除的模板才能进行启用操作！");
            }

        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
}
function Abolish_Template() {
    Ext.MessageBox.confirm('提示', '废除选择的模板?', Abolish);
}
function Abolish(btn) {
    if (btn == 'yes') {
        var nodes = TaskMudole_TreeGrid.getChecked();
        if (nodes.length > 0) {
            var node = nodes[0];

            if (node.attributes.Type == "T") {
                if (node.attributes.State != '0' ) {
                    var parms = { OperateType: "AbolishTemplate", ID: node.attributes.TaskTemplateID };
                    CodeOperaMethod("DataProcess.aspx", parms);
                    refreshTreeGrid();

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "创建中的模板不能废除！");
                }

            }
            else
                App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");

        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
    }
}
function taskMould_Add() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        // alert(node.attributes.Type);parentNode
        var TemplateNode = GetTopNode(node);
        if (TemplateNode.attributes.State != '0') {
            App.setAlert(App.STATUS_NOTICE, "模板当前状态不能进行此操作！");
        }

        else {
            //平台管理员对模板拥有所有的操作权限，登录者自己创建的模板登录者拥有所有权限（不论模板是否参与wiki共建，除非平台管理启用了“模板编辑禁止”功能），非模板节点拥有者只能为参与wiki共建的模板添加内容
            if (UserType != 'PlatFormUser') {
                if (TemplateNode.attributes.Establish_Wiki != '2') {

                    if ((TemplateNode.attributes.CompanyID != CompanyID || TemplateNode.attributes.CreatorID != CreatorID) && (node.attributes.CompanyID != CompanyID || node.attributes.CreatorID != CreatorID)) {//当前登录者模板不是模板创建人

                        if (TemplateNode.attributes.Establish_Wiki != '1') {//模板没参与Wiki共建
                            App.setAlert(App.STATUS_NOTICE, "当前你无权进行此操作！");
                            return;
                        }
                        else {
                            if (node.attributes.Establish_Wiki != '1') {//模板参与了Wiki共建，但当前节点没有参与Wiki共建
                                App.setAlert(App.STATUS_NOTICE, "当前你无权进行此操作！");
                                return;
                            }
                        }
                    }
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "模板处于禁止编辑的状态，你无权进行此操作！");
                    return;
                }
            }
            if (node.attributes.Type == "T") {


                OperateType = "AddRow";
                Row_Window.setTitle("在[" + node.attributes.DisplayName + "]中添加行");
                Row_FormPanel.getForm().findField('ID').setValue(node.attributes.TaskTemplateID);
                Row_Window.show();

            }
            else if (node.attributes.Type == "R") {
                OperateType = "AddElement";
                Element_Window.setTitle("在[" + node.parentNode.attributes.DisplayName + "中的" + node.attributes.DisplayName + "]中添加元素");
                Element_FormPanel.getForm().findField('ID').setValue(node.attributes.TaskTemplateID);
                Element_FormPanel.getForm().findField('ParentID').setValue(node.parentNode.attributes.TaskTemplateID);
                DicWord_ListCombo.show();
                Element_Window.show();
                Element_Window.setHeight(305);
                DicWord_ArrayStore.load({ params: { OperateType: 'DicWordList', ID: node.parentNode.attributes.TaskTemplateID} });

            }
            else
                App.setAlert(App.STATUS_NOTICE, "不能在行的元素中添加其他内容！");
        }
    }
    else {
        OperateType = "AddMould";
        Mould_Window.setTitle("添加模板");
        // Mould_FormPanel.getForm().findField('ID').setValue(node.attributes.ID);
        Mould_Window.show();

    }

}
function taskMould_Edit() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        var TemplateNode = GetTopNode(node);
        if (TemplateNode.attributes.State != '0') {
            App.setAlert(App.STATUS_NOTICE, "模板当前状态不能进行此操作！");
        }
        else {
            if (UserType != 'PlatFormUser') {
                if (TemplateNode.attributes.Establish_Wiki != '2') {
                    if (TemplateNode.attributes.Establish_Wiki != '1') {
                        if (!(node.attributes.CompanyID == CompanyID && node.attributes.CreatorID == CreatorID) && !(TemplateNode.attributes.CompanyID == CompanyID && TemplateNode.attributes.CreatorID == CreatorID)) {//非节点创建人，也非模板创建人
                            App.setAlert(App.STATUS_NOTICE, "您无权进行此操作！");
                            return;
                        }
                    }
                    else {//模板启用了wiki
                        if (node.attributes.Establish_Wiki != '1') {
                            if (!(node.attributes.CompanyID == CompanyID && node.attributes.CreatorID == CreatorID) && !(TemplateNode.attributes.CompanyID == CompanyID && TemplateNode.attributes.CreatorID == CreatorID)) {//非节点创建人，也非模板创建人
                                App.setAlert(App.STATUS_NOTICE, "您无权进行此操作！");
                                return;
                            }
                        }
                    }

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "模板处于禁止编辑的状态，你无权进行此操作！");
                    return;
                }
            }
            if (node.attributes.Type == "T") {

                OperateType = "EditMould";
                Mould_Window.setTitle("修改名为[" + node.attributes.DisplayName + "]的模板");
                Mould_FormPanel.getForm().findField('ID').setValue(node.attributes.TaskTemplateID);
                Mould_FormPanel.getForm().findField('MouldDisplayName').setValue(node.attributes.DisplayName);
                Mould_FormPanel.getForm().findField('MouldName').setValue(node.attributes.name);
                Mould_Window.show();
                StandardTask_ComboBox.setComboValue(node.attributes.BidingStandardTaskID, node.attributes.StandardTaskName);

            }
            else if (node.attributes.Type == "R") {
                OperateType = "EditRow";
                Row_Window.setTitle("修改[" + node.parentNode.attributes.DisplayName + "]中的行");
                Row_FormPanel.getForm().findField('ParentID').setValue(node.parentNode.attributes.TaskTemplateID);
                Row_FormPanel.getForm().findField('ID').setValue(node.attributes.TaskTemplateID);
                Row_FormPanel.getForm().findField('RowName').setValue(node.attributes.DisplayName);
                Row_Window.show();

            }
            else {
                OperateType = "EditElement";

                Element_Window.setTitle("修改[" + node.parentNode.parentNode.attributes.DisplayName + "中的" + node.attributes.DisplayName + "]的元素");
                Element_FormPanel.getForm().findField('ID').setValue(node.attributes.TaskTemplateID);
                Element_FormPanel.getForm().findField('emptyText').setValue(node.attributes.emptyText);
                Element_FormPanel.getForm().findField('width').setValue(node.attributes.width);
                Element_FormPanel.getForm().findField('emptyText').setValue(node.attributes.emptyText);
                DicWord_ListCombo.hide();
                Element_Window.show();
                Element_Window.setHeight(275);
                if (node.attributes.allowBlank == '0') {
                    RadioGroup_EmptyText.items.items[1].setValue(true);
                    TextField_BlankText.setValue(node.attributes.blankText);

                }
                if (node.attributes.regex != '') {
                    RadioGroup_Regex.items.items[0].setValue(true);
                    TextField_Regex.setValue(decodeURIComponent(node.attributes.regex).replace(/\+/g, ' '));
                    TextField_RegexText.setValue(node.attributes.regexText);
                }

            }
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "选择您要修改的内容！");
    }
}
function taskMould_Delete(btn) {
    if (btn == 'yes') {
        var nodes = TaskMudole_TreeGrid.getChecked();
        var IDs = [];
        for (i = 0; i < nodes.length; i++) {
            var TemplateNode = GetTopNode(nodes[i]);
          
            if (TemplateNode.attributes.State != 0 && TemplateNode.attributes.State != 5) {
                App.setAlert(App.STATUS_NOTICE, "模板当前状态不能进行此操作！");
                return;
            }
            if (UserType != 'PlatFormUser') {
                if (TemplateNode.attributes.Establish_Wiki == '2') {
                    App.setAlert(App.STATUS_NOTICE, "当前模板已被管理员启用‘禁止编辑’，你无权进行此操作！");
                    return;
                }
                if (nodes[i].attributes.CompanyID == CompanyID && nodes[i].attributes.CreatorID == CreatorID) {//节点创建人
                    IDs.push(nodes[i].attributes.TaskTemplateID);
                }
                else if (TemplateNode.attributes.CompanyID == CompanyID && TemplateNode.attributes.CreatorID == CreatorID) {//模板创建人
                    IDs.push(nodes[i].attributes.TaskTemplateID);
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "您无权进行此操作！");
                    return;
                }
            }
            else {
                IDs.push(nodes[i].attributes.TaskTemplateID);
            }

        }

        if (IDs.length > 0) {
            var parms = { OperateType: "DeleteNodes", IDs: IDs.join() };
            CodeOperaMethod("DataProcess.aspx", parms);
            refreshTreeGrid();
        }
    }

}
function ShowAll_templateComment() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        ShowTemplate_TemplateAllComment(nodes[0]);
    }

}

function taskMould_ShowAll() {
    TaskMudole_TreeLoader.dataUrl = 'DataProcess.aspx?OperateType=TaskTemplate_TreeGrid_Data';
    refreshTreeGrid();
    TaskMudole_TreeGrid.render();
}
function taskMould_Search() {
    TaskMudole_TreeLoader.baseParams.Name = TaskTemplate_Search.getValue();
    // TaskMudole_TreeLoader.baseParams.OperateType = "TaskTemplate_Search";
    TaskMudole_TreeLoader.dataUrl = 'DataProcess.aspx?OperateType=TaskTemplate_Search';
    refreshTreeGrid();
    TaskMudole_TreeGrid.render();
}

function taskMould_Create() {
    var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
        var node = nodes[0];
        // alert(node.attributes.Type);


        if (node.attributes.Type == "T") {
            if (node.attributes.State != '1')
                App.setAlert(App.STATUS_NOTICE, "只有创建完成的模板才能进行生成操作！");
            else {
                var parms = { OperateType: "CreateMould", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();
            }

        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");


    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
}
function PromoteAs_StandardTemplate() {
    var nodes = TaskMudole_TreeGrid.getChecked();

    if (nodes.length > 0) {
        var node = nodes[0];


        if (node.attributes.Type == "T") {
            if ( node.attributes.State != '3')
                App.setAlert(App.STATUS_NOTICE, "请先确认模板创建完成或模板正在使用中！");
            else {
                var parms = { OperateType: "PromoteTemplate", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();
            }
        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");

}

function FinishCreate_StandardTemplate() {
    var nodes = TaskMudole_TreeGrid.getChecked();

    if (nodes.length > 0) {
        var node = nodes[0];


        if (node.attributes.Type == "T") {
            if (node.attributes.State != '0')
                App.setAlert(App.STATUS_NOTICE, "只有创建中才能确认创建完成！");
            else {
                var parms = { OperateType: "ConfirmFinish", ID: node.attributes.TaskTemplateID };
                CodeOperaMethod("DataProcess.aspx", parms);
                refreshTreeGrid();
            }
        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
}
function Inherit_Template() {
    var nodes = TaskMudole_TreeGrid.getChecked();

    if (nodes.length > 0) {
        var node = nodes[0];


        if (node.attributes.Type == "T") {
            if (node.attributes.State != '0')
                App.setAlert(App.STATUS_NOTICE, "只有创建中才能实现继承！");
            else {
                ETemplateInherit_Window.show();

                var Loader = tree.getLoader();
                Loader.baseParams.OperateType = "LoadTemplate";
                Loader.baseParams.CheckedTemPlateID = node.attributes.TaskTemplateID;
                Loader.load(root);
                root.expand();

                tree2Loader.baseParams.OperateType = "LoadTemplateByID";
                tree2Loader.baseParams.CheckedTemPlateID = node.attributes.TaskTemplateID;
                tree2Loader.load(root2);
                root2.expand();
            }


        }
        else
            App.setAlert(App.STATUS_NOTICE, "请选择模板节点！");

    }
    else
        App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
}


var TaskMudole_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var TaskMudole_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'DataProcess.aspx?OperateType=TaskTemplate_TreeGrid_Data'
});
var TaskMudole_TreeGrid = new Ext.ux.tree.TreeGrid({
    title: '任务模板管理',
    root: TaskMudole_TreeRoot,
    loader: TaskMudole_TreeLoader,
    width: 500,
    height: 300,
    tbar: taskMould_tbar,
    bodyStyle: "width:100%",
    viewConfig: {
        forceFit: true
    },
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
        header: '名称',
        dataIndex: 'DisplayName',
        width: 230
    }, {
        header: '创建者',
        dataIndex: 'CreatorName',
        width: 100,
        align: 'center'
    }, {
        header: '模板状态',
        dataIndex: 'TemplateStateName',
        width: 100,
        align: 'center'
    }, {
        header: '启用Wiki',
        width: 80,
        dataIndex: 'Establish_Wiki',
        align: 'center',
        tpl: new Ext.XTemplate('{Establish_Wiki:this.formatEstablish_Wiki}', {
            formatEstablish_Wiki: function (v) {
                if (v == '1')
                    return '是';
                else if (v == '2')
                    return "禁止编辑";
                else
                    return '否';

            }
        })
    }, {
        header: '提交名',
        width: 80,
        dataIndex: 'name',
        align: 'center'
    }, {
        header: '所属任务类',
        width: 100,
        dataIndex: 'StandardTaskName',
        align: 'center'
    }, {
        header: '默认文本',
        width: 100,
        dataIndex: 'emptyText',
        align: 'center'
    }, {
        header: '允许为空',
        width: 50,
        dataIndex: 'allowBlank',
        align: 'center',
        tpl: new Ext.XTemplate('{allowBlank:this.formatallowBlank}', {
            formatallowBlank: function (v) {
                if (v == '1')
                    return '是';
                else if (v == '0')
                    return '否';
                else
                    return '';

            }
        })
    }, {
        header: '提示文本',
        width: 100,
        dataIndex: 'blankText',
        align: 'center'
    }, {
        header: '正则表达式',
        width: 100,
        dataIndex: 'regex',
        align: 'center',
        tpl: new Ext.XTemplate('{regex:this.formatregex}', {
            formatregex: function (v) {
                return decodeURIComponent(v).replace(/\+/g, ' ');

            }
        })
    }, {
        header: '不通过提示',
        width: 150,
        dataIndex: 'regexText'

    }, {
        header: '宽度',
        dataIndex: 'width',
        width: 40
    }, {
        header: '高度',
        width: 40,
        dataIndex: 'height',
        align: 'center'
    }, {
        header: '添加时间',
        dataIndex: 'TaskTemplateCreateDate',
        width: 110,
        align: 'center'
    }, {
        header: '最新编辑时间',
        dataIndex: 'LastEditTime',
        width: 110,
        align: 'center'
    }],
    dropConfig: { appendOnly: false },
    listeners: {
        "nodedragover": function (e) {

            var target = e.target;
            var dropNode = e.dropNode;

            if (dropNode.attributes.Type == "A" && target.attributes.Type == 'R' && GetTopNode(target).id == GetTopNode(dropNode).id) {
                if (UserType != 'PlatFormUser') {
                    if (GetTopNode(target).attributes.Establish_Wiki == '2') {
                        App.setAlert(App.STATUS_NOTICE, "当前模板已被管理员启用‘禁止编辑’，你无权进行此操作！");
                        return false;
                    }
                    else if (GetTopNode(target).attributes.Establish_Wiki == '1') {
                        if ((target.attributes.Establish_Wiki == '1' || (target.attributes.CompanyID == CompanyID && target.attributes.CreatorID == CreatorID)) && (dropNode.attributes.CompanyID == CompanyID && dropNode.attributes.CreatorID == CreatorID)) {
                            if (target.leaf)
                                target.leaf = false;
                            return true;
                        }
                        else {
                            return false;
                            App.setAlert(App.STATUS_NOTICE, "你无权进行此操作！");
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (target.leaf)
                        target.leaf = false;
                    return true;
                }

            }
            else {
                return false;
            }

        },
        "nodedrop": function (e) {

            var jsonData = { OperateType: "MoveElement", NodeID: e.dropNode.attributes.TaskTemplateID, TargetNodeID: e.target.attributes.TaskTemplateID };
            CodeOperaMethod('DataProcess.aspx', jsonData);
            return true;

        }
    }


});
function showTypeImage(val) {
    if (val == 'T') {
        return ' template';
    }
    else
        return ' template1'; ;
}
function refreshTreeGrid() {
    TaskMudole_TreeLoader.load(TaskMudole_TreeRoot);
    TaskMudole_TreeRoot.expand();
}

TaskMudole_TreeGrid.on('contextmenu', function (node, e) {
    TaskMudole_TreeGrid.selectPath(node.getPath());
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

TaskMudole_TreeGrid.on('dblclick', function (node, e) {
    /*   if (node.attributes.Type != "C") {
    ShowTemplate_TemplateComment(node);
    }*/

});
function GetTopNode(nodet) {

    if (nodet.attributes.Type == 'T')
        return nodet;
    else if (nodet.attributes.Type == 'R')
        return nodet.parentNode;
    else
        return nodet.parentNode.parentNode;

}
//------------
