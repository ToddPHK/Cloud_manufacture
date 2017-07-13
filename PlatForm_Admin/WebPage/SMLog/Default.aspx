<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_SMLog_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="Stylesheet" type="text/css" href="../../../css/myIcon.css" />
    <link rel="Stylesheet" type="text/css" href="../../../ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="../../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/App.js"></script>
    <script type="text/javascript" src="../../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <script type="text/javascript">

        var App = new Ext.App({});
        var SMLogPageSize = 25, OperateType;
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
                    if (success) {
                        App.setAlert(App.STATUS_NOTICE, response.responseText);
                    }
                    else {
                        App.setAlert(App.STATUS_NOTICE, "所提交的操作失败！");
                    }

                }
            });
        };
        Ext.onReady(function () {
            Ext.apply(Ext.form.VTypes, {
                StartEndTime: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
                    if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
                        var pwd = Ext.get(field.confirmTo); //取得confirmTo的那个id的值
                        return (val > pwd.getValue());
                    }
                    return true;
                }
            });
            var SenderENTName_Search = new Ext.form.TextField({//关键词
                fieldLabel: "发送企业",
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                width: 140
            });
            var RecieverENTName_Search = new Ext.form.TextField({//关键词
                fieldLabel: "接受企业",
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                width: 140
            });
            var SenderStartTime_Search = new Ext.form.DateField({//注册起始时间
                fieldLabel: "发送时间",
                id: 'SenderStartTime_Search',
                width: 140,
                format: 'Y-m-d H:i:s'
            });
            var SenderEndTime_Search = new Ext.form.DateField({//注册结束时间
                fieldLabel: "至",
                width: 140,
                vtype: "StartEndTime", //自定义的验证类型
                vtypeText: "起始时间必须大于结束时间！",
                confirmTo: "SenderStartTime_Search", //要比较的另外一个的组件的id
                format: 'Y-m-d H:i:s'
            });
           
            Ext.QuickTips.init();
            var SMLogtbar = new Ext.Toolbar({
                items: [{
                    text: "删除",
                    iconCls: 'delete-icon',
                    handler: function () {
                        rows = SMLogTablePanel.getSelectionModel().getSelections();
                        if (rows.length == 0) {
                            App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
                            return;
                        }
                        Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', SMLogDelete);

                    }

                }, '->', '发送企业：', SenderENTName_Search, '接受企业：', RecieverENTName_Search, '发送时间：', SenderStartTime_Search, '至：', SenderEndTime_Search, {
                    id: 'SMLogbtnSearch',
                    text: "搜索",
                    iconCls: 'search-icon',
                    handler: SMLogDataSearch
                }]

            });

            function SMLogDelete(btn) {
                if (btn == 'yes') {
                    var IDS = [];
                    var rows = SMLogTablePanel.getSelectionModel().getSelections();
                    for (var i = 0, len = rows.length; i < len; i++) {

                        IDS.push(rows[i].get('ID'));

                    }
                    var jsonData = { OperateType: "DeleteLog", IDS: IDS.join() };
                    CodeOperaMethod('DataProcess.aspx', jsonData);
                    //重新加载store信息
                    SMLogStore.reload();
                    //   SMLogTablePanel.store.reload();
                }
            }
            function SMLogDataSearch() {
                if (SenderENTName_Search.isValid() && RecieverENTName_Search.isValid() && SenderEndTime_Search.isValid())//判断是否通过客户端验证
                {


                    SMLogStore.removeAll();
                    SMLogStore.baseParams.SenderENTName = SenderENTName_Search.getValue()
                    SMLogStore.baseParams.RecieverENTName = RecieverENTName_Search.getValue()
                    SMLogStore.baseParams.SenderStartTime = SenderStartTime_Search.getRawValue();
                    SMLogStore.baseParams.SenderEndTime = SenderEndTime_Search.getRawValue();



                    SMLogStore.baseParams.OperateType = "SMLogSearch";
                    SMLogStore.load();
                    SMLogPageBar.changePage(1);


                }
            }
            var SMLogProxy = new Ext.data.HttpProxy({
                url: 'SMData.aspx'
            });

            var SMLogReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "SenderID" },
                        { name: "SenderENTID" },
                        { name: "SMContent" },
                        { name: "ReceiverTelephone" },
                        { name: "ReceiverID" },
                        { name: "ReceiverENTID" },
                        { name: "SendTime" },
                        { name: "SenderENT" },
                         { name: "ReceiverENT" }
                        ]
                    );

            var SMLogStore = new Ext.data.Store(
                        { proxy: SMLogProxy, reader: SMLogReader }
                    );


            var SMLogPageBar = new Ext.PagingToolbar({
                store: SMLogStore,
                pageSize: SMLogPageSize,
                plugins: new Ext.ui.plugins.ComboPageSize(),
                displayInfo: true,
                displayMsg: '总记录数 {0} - {1} of {2}',
                emptyMsg: "没有记录",
                id: 'SMLogPageBar'
            });
            var SMLogTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
            var SMLogTablePanel = new Ext.grid.GridPanel({
                title: '短信日志',
                minSize: 400,
                split: true,
                width: 450,
                collapsed: false,
                autoScroll: true,
                layout: "fit",
                region: 'center',
                frame: true,
                store: SMLogStore,
                tbar: SMLogtbar,
                bbar: SMLogPageBar,
                sm: SMLogTablePanel_sm,
                loadMask: true,
                columns: [
                    new Ext.grid.RowNumberer(),
                    SMLogTablePanel_sm,
                    { header: 'ID', dataIndex: 'ID', sortable: true, hidden: true },
                    { header: '发送企业', dataIndex: 'SenderENT', sortable: true },
                    { header: '短信内容', dataIndex: 'SMContent', sortable: true},
                    { header: '接受企业', dataIndex: 'ReceiverENT', sortable: true },
                    { header: '接受号码', dataIndex: 'ReceiverTelephone', sortable: true },
                //   { header: '角色名', dataIndex: 'Name', sortable: true },
                    {header: '发送时间', dataIndex: 'SendTime', width: 150, sortable: true }


            ]
            });
            SMLogStore.load({ params: { start: 0, limit: SMLogPageSize} });
            /*   RoleDataManageTablePanel.on('render', function (taskTablePanel) {
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
            });*/
            var viewport = new Ext.Viewport({
                layout: 'border', //布局,必须是border
                loadMask: true,
                items: [SMLogTablePanel
            ]
            });

        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
