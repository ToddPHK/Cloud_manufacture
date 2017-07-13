<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_UserAudit_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <style type="text/css">
        .download-icon
        {
            height: 16px;
            width: 16px;
            background-image: url(../../../images/download.gif) !important;
        }
    </style>
</head>
<body>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});
        Ext.QuickTips.init();
        var OperaMethod = function (u, p) {
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
                    if (success) {
                        App.setAlert(App.STATUS_NOTICE, response.responseText);
                    }
                    else {
                        App.setAlert(App.STATUS_NOTICE, "所提交的操作失败！");
                    }

                }
            });
        };
        var PageSize = 25;
        Ext.onReady(function () {
            var UserName_Search = new Ext.form.TextField({
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                width: 80
            });
            var EntName_Search = new Ext.form.TextField({
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                width: 80
            });
            var UserDataBaseType_Store = new Ext.data.SimpleStore({
                fields: ['id', 'type'],
                data: [['0', '云平台'], ['1', '企业本地']]
            });
            var UserStateType_Store = new Ext.data.SimpleStore({
                fields: ['id', 'type'],
                data: [['0', '未审核'], ['1', '通过审核'], ['2', '未通过审核'], /*['3', '已注销'],*/['-1', '已禁用']]
            });
            var UserType_Store = new Ext.data.SimpleStore({
                fields: ['id', 'type'],
                data: [['0', '企业'], ['1', '个人']]
            });
            var UserDataBaseType_Search = new Ext.form.ComboBox({
                store: UserDataBaseType_Store,
                valueField: 'id',
                displayField: 'type',
                mode: 'local',
                emptyText: '数据库类型',
                triggerAction: 'all',
                width: 80
            });
            var UserStateType_Search = new Ext.form.ComboBox({
                store: UserStateType_Store,
                valueField: 'id',
                displayField: 'type',
                mode: 'local',
                emptyText: '用户状态',
                triggerAction: 'all',
                width: 80
            });
            var UserType_Search = new Ext.form.ComboBox({
                store: UserType_Store,
                valueField: 'id',
                displayField: 'type',
                mode: 'local',
                emptyText: '用户类型',
                triggerAction: 'all',
                width: 70
            });
            var UserAudittbar = new Ext.Toolbar({
//                autoScroll: true,
               // enableOverflow:true,
                items: [{
                    text: "审核通过",
                    iconCls: 'pass-icon',
                    handler: PassAudit
                }, {
                    text: "审核不通过",
                    iconCls: 'nopass-icon',
                    handler: NoPassAudit
                }, '-', {
                    text: "禁用",
                    // iconCls: 'edit-icon',
                    handler: ForbideUser
                }, {
                    text: "启用",
                    //  iconCls: 'edit-icon',
                    handler: StartUsingUser
                }, '-', {
                    text: "信息发送",
                    //  iconCls: 'edit-icon',
                    handler: SendShortMsg
                }, '-', {
                    text: "链接检查",
                    //  iconCls: 'edit-icon',
                    handler: CheckLink
                }, '->', "用户名: ", UserName_Search, " 公司名: ", EntName_Search, "用户状态:", UserStateType_Search, "用户类型:", UserType_Search, " 数据库位置:", UserDataBaseType_Search, {
                    id: 'taskbtnSearch',
                    text: "搜索",
                    iconCls: 'search-icon',
                    handler: UserDataSearch
                }]
            });
//            UserAudittbar.on("resize", function (c) {
//                alert(c.);

            //            })overflowchange 

//            UserAudittbar.on("resize", function (c, adjWidth ,   adjHeight ,   rawWidth ,   rawHeight ) {
//  deferHeight
//                    UserAudittbar.setAutoScroll(true);
//                    UserAudittbar.setHeight(40);


//            })
            function CheckLink() {
                if (UserAuditTablePanel_sm.hasSelection()) {

                    var rec = UserAuditTablePanel_sm.getSelected();
                    if (rec.get("localDatabase") == 1) {
                        var jsonData = { OperateType: "CheckLink", UserID: rec.get("UserID") };
                        OperaMethod('DataProcess.aspx', jsonData);
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "该用户不能进行此操作！");
                }
                else
                    App.setAlert(App.STATUS_NOTICE, "选择要检查的用户！");
            }
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
                        //--------------------
                        if (btn == "ok") {


                            if (UserAuditTablePanel_sm.hasSelection()) {
                                var loadMarsk = new Ext.LoadMask('UserAuditTablePanel', {
                                    msg: '信息发送中......',
                                    removeMask: true// 完成后移除
                                });
                                loadMarsk.show(); //显示
                                var UserIDs = [];
                                var rows = UserAuditTablePanel_sm.getSelections();
                                for (var i = 0; i < rows.length; i++) {
                                    var UserState = rows[i].get("UserState");
                                    if (UserState == 1) {
                                        UserIDs.push(rows[i].get("UserID"));
                                    }
                                    else {
                                        loadMarsk.hide();
                                        App.setAlert(App.STATUS_NOTICE, "ID为[" + rows[i].get("UserID") + "]的用户当前的状态不能进行此操作！");

                                        return;
                                    }

                                }
                                var jsonData = { OperateType: "SendShortMsg", UserIDs: UserIDs.join(), Message: text };
                                var conn = new Ext.data.Connection();
                                conn.request({
                                    url: "DataProcess.aspx",
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
            function PassAudit() {
                if (UserAuditTablePanel_sm.hasSelection()) {
                    var UserID = [];
                    var rows = UserAuditTablePanel_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        var UserState = rows[i].get("UserState");

                        if (UserState == 0) {

                            UserID.push(rows[i].get("UserID"));
                        }
                        else {
                            App.setAlert(App.STATUS_NOTICE, "ID为[" + rows[i].get("UserID") + "]的用户当前的状态不能进行此操作！");
                            return;
                        }
                    }
                    var jsonData = { OperateType: "PassAudit", UserID: UserID.join() };
                    OperaMethod('DataProcess.aspx', jsonData);
                    UserAuditStore.reload();
                    // taskTablePanel.store.reload();
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                }
            }
            function NoPassAudit() {
                Ext.MessageBox.show({
                    title: '提示',
                    msg: '不通过理由:',
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: true,
                    fn: function (btn, text) {
                        //--------------------
                        if (btn == "ok") {

                            if (UserAuditTablePanel_sm.hasSelection()) {
                                var UserID = [];
                                var rows = UserAuditTablePanel_sm.getSelections();
                                for (var i = 0; i < rows.length; i++) {
                                    var UserState = rows[i].get("UserState");
                                    if (UserState == 0) {
                                        UserID.push(rows[i].get("UserID"));
                                    }
                                    else {
                                        App.setAlert(App.STATUS_NOTICE, "ID为[" + rows[i].get("UserID") + "]的用户当前的状态不能进行此操作！");
                                        return;
                                    }
                                }
                                var jsonData = { OperateType: "NoPassAudit", UserID: UserID.join(), Message: text };
                                OperaMethod('DataProcess.aspx', jsonData);
                                UserAuditStore.reload();
                            }
                            else {
                                App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                            }
                        }

                        //-----------------------------
                    }
                });

            }
            function ForbideUser() {
                Ext.MessageBox.show({
                    title: '提示',
                    msg: '禁用原因:',
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: true,
                    fn: function (btn, text) {
                        //--------------------
                        if (btn == "ok") {
                            if (UserAuditTablePanel_sm.hasSelection()) {
                                var UserID = [];
                                var rows = UserAuditTablePanel_sm.getSelections();
                                for (var i = 0; i < rows.length; i++) {
                                    var UserState = rows[i].get("UserState");
                                    if (UserState == 1) {
                                        UserID.push(rows[i].get("UserID"));
                                    }
                                    else {
                                        App.setAlert(App.STATUS_NOTICE, "ID为[" + rows[i].get("UserID") + "]的用户当前的状态不能进行此操作！");
                                        return;
                                    }
                                }
                                var jsonData = { OperateType: "ForbideUser", UserID: UserID.join(), Message: text };
                                OperaMethod('DataProcess.aspx', jsonData);
                                UserAuditStore.reload();
                            }
                            else {
                                App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                            }
                        }

                        //-----------------------------
                    }
                });
            }
            function StartUsingUser() {
                if (UserAuditTablePanel_sm.hasSelection()) {
                    var UserID = [];
                    var rows = UserAuditTablePanel_sm.getSelections();
                    for (var i = 0; i < rows.length; i++) {
                        var UserState = rows[i].get("UserState");
                        if (UserState == -1) {
                            UserID.push(rows[i].get("UserID"));
                        }
                        else {
                            App.setAlert(App.STATUS_NOTICE, "ID为[" + rows[i].get("UserID") + "]的用户当前的状态不能进行此操作！");
                            return;
                        }
                    }
                    var jsonData = { OperateType: "StartUsingUser", UserID: UserID.join() };
                    OperaMethod('DataProcess.aspx', jsonData);
                    UserAuditStore.reload();
                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "还未选择记录！");
                }
            }
            function UserDataSearch() {
                //  alert(UserDataBaseType_Search.getValue());
                UserAuditStore.removeAll();

                //                UserAuditStore.baseParams.start = 0;
                //                UserAuditStore.baseParams.limit = PageSize;
                UserAuditStore.baseParams.UserDataBaseType = UserDataBaseType_Search.getValue();
                UserAuditStore.baseParams.UserName = UserName_Search.getValue();
                UserAuditStore.baseParams.EntName = EntName_Search.getValue();
                UserAuditStore.baseParams.UserStateType = UserStateType_Search.getValue();
                UserAuditStore.baseParams.UserType = UserType_Search.getValue();
                UserAuditStore.baseParams.OperateType = "UserSearch";
                //   UserAuditStore.load();
                UserAuditStore.reload();
                UserAuditPageBar.changePage(1);
            }

            var UserAuditProxy = new Ext.data.HttpProxy({
                url: 'UserInfTable.aspx'
            });

            var UserAuditReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "UserID" },
                        { name: "userName" },
                        { name: "UserType" },
                        { name: "UserState" },
                         { name: "GudingTelephone" },
                        { name: "Telephone" },
                        { name: "Adress" },
                        { name: "eMail" },
                        { name: "localDatabase" },
                        { name: "DataBaseName" },
                        { name: "DataBaseUserID" },
                        { name: "DataBasePwd" },
                        { name: "DataBaseServer" },
                        { name: "StyleSheet" },
                        { name: "Microblog" },
                        { name: "EntFullName" },
                        { name: "RegisterIDCard" },
                        { name: "RegisterRealName" },
                        { name: "EntWebSite" },
                        { name: "LocateRegion" },
                        { name: "BusinessSphere" },
                        { name: "RegisterTime" },
                        { name: "UserLastEditTime" },
                        { name: "OperateTime" }
                        ]
                    );

            var UserAuditStore = new Ext.data.Store(
                        { proxy: UserAuditProxy, reader: UserAuditReader }
                    );

            var UserAuditPageBar = new Ext.PagingToolbar({
                store: UserAuditStore,
                plugins: new Ext.ui.plugins.ComboPageSize(),
                pageSize: PageSize,
                displayInfo: true,
                displayMsg: '总记录数 {0} - {1} of {2}',
                emptyMsg: "没有记录"
            });

            var UserAuditTablePanel_sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });
            var UserAuditTablePanel = new Ext.grid.GridPanel({
                id: "UserAuditTablePanel",
                title: '用户审核',
                region: 'center',
                frame: true,
                store: UserAuditStore,
                sm: UserAuditTablePanel_sm,
                height: 400,
                tbar: UserAudittbar,
                bbar: UserAuditPageBar,
                loadMask: true,
                tools: [{
                    id: 'refresh',
                    handler: function () {
                        UserAuditStore.load();
                    }

                }],
                columns: [
                    new Ext.grid.RowNumberer(),
                    UserAuditTablePanel_sm,
                    {
                        xtype: 'actioncolumn',
                        width: 20,
                        // header: '文件操作',
                        items: [{
                            iconCls: 'download-icon',
                            tooltip: '查看公司说明及合同',
                            handler: function (grid, rowIndex, colIndex) {
                                var rec = UserAuditStore.getAt(rowIndex);
                                if (rec.get('userName') != '')
                                    FileDownLoad(rec.get('userName'))
                            }
                        }]
                    },
                    { header: '用户ID', dataIndex: 'UserID', width: 50, sortable: true },
                    { header: '用户名', dataIndex: 'userName', sortable: true },
                    { header: '用户状态', dataIndex: 'UserState', sortable: true, renderer: showState },
                    { header: '用户类型', dataIndex: 'UserType', sortable: true, renderer: showUserType },
                    { header: '数据位置', dataIndex: 'localDatabase', sortable: true, renderer: showDataBasePlace },
                    { header: '公司全名', dataIndex: 'EntFullName', sortable: true },
                    { header: '公司网址', dataIndex: 'EntWebSite', sortable: true, renderer: showWebSite },
                    { header: '联系地址', dataIndex: 'Adress', sortable: true },
                    { header: '真实姓名', dataIndex: 'RegisterRealName', sortable: true },
                    { header: '微博地址', dataIndex: 'Microblog', sortable: true, renderer: showWebSite },
                    { header: '手机号码', dataIndex: 'Telephone', sortable: true },
                    { header: '固定电话', dataIndex: 'GudingTelephone', sortable: true },
                    { header: '身份证号', dataIndex: 'RegisterIDCard', sortable: true },
                    { header: '公司所在地', dataIndex: 'LocateRegion', sortable: true },
                    { header: '公司主营', dataIndex: 'BusinessSphere', sortable: true },
                    { header: '电子邮件', dataIndex: 'eMail', sortable: true },
                    { header: '注册时间', dataIndex: 'RegisterTime', sortable: true },
                    { header: '用户上次修改时间', dataIndex: 'UserLastEditTime', sortable: true },
                    { header: '最新操作时间', dataIndex: 'OperateTime', sortable: true }
            ]
            });

            UserAuditStore.load({ params: { start: 0, limit: PageSize} });
            function showUserType(val) {
                if (val == 0)
                    return "企业";
                else if (val == 1)
                    return "个人";
                else
                    return "出错";
            }
            function showWebSite(val) {
                return '<a href="' + val + '" target=_blank>' + val + '</a>';
            }
            function showDataBasePlace(val) {
                if (val == 0)
                    return "平台";
                else if (val == 1)
                    return "本地";
                else
                    return "出错";
            }
            function showState(val) {
                if (val == 0)
                    return "未审核";
                else if (val == 1)
                    return "通过审核";
                else if (val == 2)
                    return "未通过审核";
                else if (val == 3)
                    return "已注销";

                else if (val == -1)
                    return "已禁用";
            }
            function FileDownLoad(filename) {
                //  window.open("10.15.43.242");
                //   filename = rows[0].get('name');
                var jsonData = { fileOperateType: 'download', filename: filename }
                if (!Ext.fly('test')) {
                    var frm = document.createElement('form');
                    frm.id = 'test';
                    frm.name = id;
                    frm.style.display = 'none';
                    document.body.appendChild(frm);
                }
                Ext.Ajax.request({
                    url: 'DfileDownLoad.aspx',
                    form: Ext.fly('test'),
                    method: 'POST',
                    params: jsonData,
                    isUpload: true
                });

            }
            Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [UserAuditTablePanel
            ]
            });

        });
    </script>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
