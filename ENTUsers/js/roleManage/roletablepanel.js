var roletype = null;
var rolepagesize = 25;  //一页显示的角色数量

//----------------------------------------------------
Ext.QuickTips.init();
var RoleListArrayStore = new Ext.data.ArrayStore({ //角色列表
    url: '../GetComboxData.ashx',
    autoLoad: { params: { OperateType: 'role'} },
    fields: ['ID', 'Name'],
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});

var educationstore = new Ext.data.SimpleStore({ //学历列表
    fields: ['id', 'type'],
    data: [['0', '小学'], ['1', '初中'], ['2', '高中'], ['3', '职高'], ['10', '技校'], ['4', '中专'], ['5', '大专'], ['6', '本科'], ['7', '研究生'], ['8', '博士'], ['9', '博士后']]
});

var PeopleName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var FirstRole_Search = new Ext.form.ComboBox({
    store: RoleListArrayStore,
    valueField: 'ID',
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});
var PeopleNum_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});

var PeopleGrade_Search = new Ext.form.ComboBox({
    store: educationstore,
    valueField: 'id',
    displayField: 'type', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 80
});
//动作条
var roletablepaneltbar = new Ext.Toolbar({
    items: [{
        id: 'roletablepanelbtnAdd',
        text: "添加",
        iconCls: 'add-icon',
        handler: function () {
            roleTableEdit_Window.setTitle("人员添加");
            roleEditPanel.getForm().reset();
            roleTableEdit_Window.show();
            OperateType = 'add';
        }

    }, '-', {
        text: "批量添加",
        iconCls: 'add-icon',
        handler: function () {
            BatchAdd_People_WinShow();
        }

    }, '-', {
        id: 'roletablepanelbtnEdit',
        text: "编辑",
        iconCls: 'edit-icon',
        handler: function () {

            if (!roleTablepanel_sm.hasSelection()) {
                App.setAlert(App.STATUS_NOTICE, "请你选择需要编辑的人员！");
            }
            else {
                roleTableEdit_Window.setTitle("人员编辑");
                var rec = roleTablepanel_sm.getSelected();
                roleEditPanel.getForm().reset();
                roleTableEdit_Window.show();
                SetPanelValue(rec);
                //------------------------------
                OperateType = 'edit';
            }
        }

    }, '-', {
        id: 'roletablepanelbtnDel',
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            //Ext.MessageBox.alert("删除", "做删除的操作?");
            OperateType = 'delete';
            if (!roleTablepanel_sm.hasSelection()) {
                App.setAlert(App.STATUS_NOTICE, "请至少选择以为要删除的人员！");

            }
            else {
                Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', roleshowResult);
            }
        }
    }, {
        text: "信息发送",
        // iconCls: 'delete-icon',
        handler: function () {
            SendShortMsg();

        }

    }, '->', '人员名称', PeopleName_Search, '第一角色', FirstRole_Search, '编号', PeopleNum_Search, '学历', PeopleGrade_Search, {
        id: 'PeopleSearch_Btn',
        text: "搜索",
        iconCls: 'search-icon',
        handler: PeopleSearch
    }]

});

//发送短信 已修改
function SendShortMsg() {
    Ext.MessageBox.show({
        title: '短信发送',
        msg: '短信内容:',
        id: "SendShortMsg",
        modal: false,
        width: 300,
        buttons: Ext.MessageBox.OK,
        multiline: true,
        fn: function (btn, text) {
            if (btn == "ok") {
                if (roleTablepanel_sm.hasSelection()) {
                    var loadMarsk = new Ext.LoadMask('roleTablepanel', {
                        msg: '信息发送中......',
                        removeMask: true// 完成后移除
                    });
                    loadMarsk.show(); //显示
                    var UserIDs = [];
                    var rows = roleTablepanel_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        UserIDs.push(rows[i].get("人员id"));
                    }

                    var jsonData = { OperateType: "SendShortMsg", UserIDs: UserIDs.join(), Message: text };
                    var conn = new Ext.data.Connection();
                    conn.request({
                        url: "GetDataProcess.ashx",
                        // 传递的参数  
                        params: jsonData,
                        method: 'post',
                        scope: this,
                        callback: function (options, success, response) {
                            if (success) {
                                loadMarsk.hide();
                                Ext.MessageBox.alert("提示", response.responseText);
                            }
                            else {
                                loadMarsk.hide();
                                Ext.MessageBox.alert("提示", "所提交的操作失败！");
                            }

                        }
                    });

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                }
            }

            //-----------------------------
        }
    });

}
//查找人员，前端直接完成
function PeopleSearch() {
    roleTabletore.removeAll();
    roleTabletore.baseParams.PeopleName = PeopleName_Search.getValue()
    roleTabletore.baseParams.FirstRole = FirstRole_Search.getValue();
    roleTabletore.baseParams.PeopleNum = PeopleNum_Search.getValue();
    roleTabletore.baseParams.PeopleGrade = PeopleGrade_Search.getRawValue();
    roleTabletore.baseParams.roletype = "PeopleSearch";
    roleTabletore.reload();
    roleTablepageBar.changePage(1);
}


//第一角色下拉框
var FirstRoleCombo = new Ext.form.ComboBox({
    store: RoleListArrayStore,
    fieldLabel: "第一角色",
    valueField: 'ID',
    editable: false,
    hiddenName: 'role',
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    triggerAction: 'all',
    width: 150
});

//第二角色下拉框
var SecondRoleCombo = new Ext.form.ComboBox({
    store: RoleListArrayStore,
    fieldLabel: "第二角色",
    hiddenName: 'secondrole',
    editable: false,
    allowBlank: false,
    valueField: 'ID',
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    triggerAction: 'all',
    width: 150
});

//获取组织树状图的根节点
var OrgStructure_Tree = new Ext.tree.TreePanel({
    rootVisible: false,
    autoScroll: false,
    autoHeight: true,
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'GetDataProcess.ashx?OperateType=OrgStructureTreeNoCheckBox'
    }),
    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '项目树' })
});

OrgStructure_Tree.on('click', function (node, e) {
    roleEditPanel.getForm().findField('department').setValue(node.id);
});

//负责人部门下拉框
var OrgStructure_ComboBox = new Ext.ux.ComboBoxTree({
  //  hiddenName: 'department',
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

//大表单form布局
var RoleEditPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: false,
    allowBlank: false,
    layout: "form", // 整个大的表单是form布局
    labelAlign: "right",
    items: [FirstRoleCombo, SecondRoleCombo]

});

//对用户进行增删查改，目前只用于删除
function roleshowResult(btn) {
    if (btn == 'yes') {
        var id = [];
        var rows = roleTablepanel_sm.getSelections();
        for (var i = 0, len = rows.length; i < len; i++) {
            id.push(rows[i].get('人员id'));
        }
        var jsonData = { OperateType: OperateType, deleteId: id.join() };
        CodeOperaMethod('GetDataProcess.ashx', jsonData);
        //重新加载store信息
        roleTabletore.reload();
        roleTablepanel.store.reload();
    }
}

//-------------------------------------------根据传入的参数进行后台数据的添加，删除，编辑操作
//--2016--目前只处理删除
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
}

//性别下拉框中的数据
var rolesexstore = new Ext.data.SimpleStore({
    fields: ['id', 'sex'],
    data: [['0', '男'], ['1', '女']]
});

//编辑/新增表单
var roleEditPanel = new Ext.FormPanel({
    labelWidth: 80,
    labelAlign: 'right',
    frame: false,
    layout: "form",
    width: 300,
    defaultType: 'textfield',
    items: [
        {
        fieldLabel: '人员编号',
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        width: 150,
        allowBlank: false,
        name: 'Peopleid'
    }, {
        fieldLabel: '人员名称',
        name: 'peoplename',
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        width: 150,
        allowBlank: false, //是否允许为空！false不允许  
        blankText: "不允许为空"
    }, {
        fieldLabel: '性别',
        xtype: 'combo',
        editable: false,
        mode: 'local',
        store: rolesexstore,
        displayField: 'sex',
        triggerAction: 'all',
        forceSelesction: true,
        allowBlank: false,
        name: 'sex',
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '出生年月',
        width: 150,
        name: 'birthday',
        xtype: 'datefield',
        format: 'Y-m-d H:i:s',
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '学历',
        name: 'education',
        xtype: 'combo',
        editable: false,
        mode: 'local',
        store: educationstore,
        displayField: 'type',
        triggerAction: 'all',
        forceSelesction: true,
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '移动电话',
        name: 'mobilenumber',
        width: 150,
        regex: /^[1]+[1,2,3,4,5,6,7,8,9]+\d{9}/,
        regexText: "电话格式错误",
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '固定电话',
        name: 'fixtelephone',
        width: 150
        //  allowBlank: false,
        //  blankText: "不允许为空"
    }, {
        fieldLabel: 'Email',
        width: 150,
        allowBlank: false,
        regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        regexText: "邮件地址格式错误",
        name: 'Email'
    }, {
        fieldLabel: 'QQ号',
        name: 'QQ',
        width: 150
    }, {
        fieldLabel: '通讯地址',
        name: 'address',
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        width: 150
    }, {
        fieldLabel: '进厂日期',
        xtype: 'datefield',
        format: 'Y-m-d H:i:s',
        maxValue: new Date(),
        maxText: "不能大于当前日期",
        width: 150,
        name: 'comeDate'
    }, OrgStructure_ComboBox, FirstRoleCombo, SecondRoleCombo, {
        fieldLabel: '档案号',
        name: 'archive',
        width: 150,
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '培训情况',
        name: 'training',
        width: 150,
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '密码',
        width: 150,
        name: 'secretnumber',
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        xtype: "hidden",
        name: 'ID'
    }, {
        xtype: "hidden",
        name: 'department'
    }]
});

//编辑/新增确认框
var roleTableEdit_Window = new Ext.Window({
//    layout: 'fit',
    minHeight: 200,
    width: 312,
    modal: true,
    closeAction: "hide",
    layout: 'form', //layout布局方式为form  
    title: '编辑对话框',
    buttonAlign: 'center',
    items: roleEditPanel,
    buttons: [{
        text: '保存',
        handler: function () {
            SavePeopleInf();
        }
    }, {
        text: '重置',
        handler: function () {
            roleEditPanel.getForm().reset();
        }
    }]
});

//保存编辑/新增信息
function SavePeopleInf() {
    if (roleEditPanel.form.isValid())//判断是否通过客户端验证
    {
        roleEditPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'GetDataProcess.ashx', //请求的url地址
            method: 'POST',
            params: {
                OperateType: OperateType

            },
            success: function (form, action) {
                roleTableEdit_Window.hide();
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                roleTabletore.reload();
                roleTablepanel.store.reload();

            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
            }
        });
    }
}


//处理人员名单的显示、搜索
var proxy = new Ext.data.HttpProxy({
    url: 'roleTableData.ashx'
});

var roleTablereader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                         { name: "人员编号" },
                         { name: "人员id" },
                         { name: "人员名称" },
                         { name: "性别" },
                         { name: "出生年月" },
                         { name: "学历" },
                         { name: "移动电话" },
                         { name: "固定电话" },
                         { name: "Email" },
                         { name: "QQ号" },
                         { name: "通讯地址" },
                         { name: "进厂日期" },
                         { name: "归属部门" },
                         { name: "部门名称" },
                         { name: "归属角色" },
                         { name: "Role1Name" },
                         { name: "第二角色" },
                         { name: "Role2Name" },
                         { name: "档案号" },
                         { name: "培训情况" },
                         { name: "密码" },
                         { name: "添加时间" }
                        ]
                    );

//通过proxy获取所有要用到的数据
var roleTabletore = new Ext.data.Store(
                        { id: 'roleTabletoreid', proxy: proxy, reader: roleTablereader }
                    );


var roleTablepageBar = new Ext.PagingToolbar({
    store: roleTabletore,
    pageSize: rolepagesize,

    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'roleTablepageBar',
    plugins: new Ext.ui.plugins.ComboPageSize()
    //   items: [roleTablepagesizecombo]
});


var roleTablepanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var roleTablepanel = new Ext.grid.GridPanel({
    title: '人员列表',
    id: "roleTablepanel",
    region: 'center',
    frame: true,
    store: roleTabletore,
    tbar: roletablepaneltbar,
    bbar: roleTablepageBar,
    sm: roleTablepanel_sm,
    loadMask: true,
    listeners: {//监听
        "rowdblclick": function () {
            var rec = Ext.getCmp("roleTablepanel").getSelectionModel().getSelected();
            roleTableEdit_Window.setTitle("人员编辑");
            roleTableEdit_Window.show();
            OperateType = 'edit';
            SetPanelValue(rec);
        }
    },
    columns: [
                    new Ext.grid.RowNumberer(),
                   roleTablepanel_sm,
                    { header: '人员编号', dataIndex: '人员编号', sortable: true },
                    { header: '人员名称', dataIndex: '人员名称', sortable: true },
                    { header: '性别', dataIndex: '性别', sortable: true },
                    { header: '出生年月', dataIndex: '出生年月', sortable: true },
                    { header: '学历', dataIndex: '学历', sortable: true },
                    { header: '归属部门', dataIndex: '部门名称', sortable: true },
                    { header: '归属角色', dataIndex: 'Role1Name', sortable: true },
                    { header: '第二角色', dataIndex: 'Role2Name', sortable: true },
                    { header: '培训情况', dataIndex: '培训情况', sortable: true },
                    { header: '移动电话', dataIndex: '移动电话', sortable: true },
                    { header: '固定电话', dataIndex: '固定电话', sortable: true },
                    { header: 'Email', dataIndex: 'Email', sortable: true },
                    { header: 'QQ号', dataIndex: 'QQ号', sortable: true },
                    { header: '通讯地址', dataIndex: '通讯地址', sortable: true },
                    { header: '档案号', dataIndex: '档案号', sortable: true },

                    { header: '密码', dataIndex: '密码', sortable: true },
                    { header: '添加时间', dataIndex: '添加时间', sortable: true }
            ]
});
roleTabletore.load({ params: { start: 0, limit: rolepagesize} });

function SetPanelValue(rec) {
    var roleEditform = roleEditPanel.getForm();
    roleEditform.findField('ID').setValue(rec.get('人员id'));
    roleEditform.findField('Peopleid').setValue(rec.get('人员编号'));
    roleEditform.findField('peoplename').setValue(rec.get('人员名称'));
    roleEditform.findField('sex').setValue(rec.get('性别'));
    roleEditform.findField('birthday').setRawValue(rec.get('出生年月'));
    roleEditform.findField('education').setValue(rec.get('学历'));
    roleEditform.findField('mobilenumber').setValue(rec.get('移动电话'));
    roleEditform.findField('fixtelephone').setValue(rec.get('固定电话'));
    roleEditform.findField('Email').setValue(rec.get('Email'));
    roleEditform.findField('QQ').setValue(rec.get('QQ号'));
    roleEditform.findField('address').setValue(rec.get('通讯地址'));
    roleEditform.findField('comeDate').setValue(rec.get('进厂日期'));
    //---------------------------

    OrgStructure_ComboBox.setValue(rec.get('部门名称'));
    roleEditform.findField('department').setValue(rec.get('归属部门'));
   //----------------------------------------------------------------------
    FirstRoleCombo.setValue(rec.get('归属角色'));
    SecondRoleCombo.setValue(rec.get('第二角色'));


    roleEditform.findField('archive').setValue(rec.get('档案号'));
    roleEditform.findField('training').setValue(rec.get('培训情况'));
    roleEditform.findField('secretnumber').setValue(rec.get('密码'));
}