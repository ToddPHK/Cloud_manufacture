<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_LoginLog_Default" %>

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
        Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
        Ext.QuickTips.init();
        var loginLogPageSize = 25, OperateType;
        var CodeOperaMethod = function (u, p) {
            var conn = new Ext.data.Connection();
            conn.request({
                //����� Url  
                url: u,
                // ���ݵĲ���  
                params: p,
                method: 'post',
                scope: this,
                //�ص�����������ִ�н������ͬ�Ĳ���������ɹ���ʾ�����ɹ�����Ϣ�����ʧ����ʾʧ�ܵ���Ϣ  
                callback: function (options, success, response) {
                    if (success) {
                        App.setAlert(App.STATUS_NOTICE, response.responseText);
                    }
                    else {
                        App.setAlert(App.STATUS_NOTICE, "���ύ�Ĳ���ʧ�ܣ�");
                    }

                }
            });
        };
        Ext.onReady(function () {
            Ext.apply(Ext.form.VTypes, {
                StartEndTime: function (val, field) {//valָ������ı���ֵ��fieldָ����ı�����������Ҫ���������˼
                    if (field.confirmTo) {//confirmTo�������Զ�������ò�����һ��������������������idֵ
                        var pwd = Ext.get(field.confirmTo); //ȡ��confirmTo���Ǹ�id��ֵ
                        return (val > pwd.getValue());
                    }
                    return true;
                }
            });
            var LoginENTName_Search = new Ext.form.TextField({//�ؼ���
                fieldLabel: "�ؼ���",
                regex: /^[^\\'����]+$/,
                regexText: "���ܰ���������",
                width: 140
            });
            //------------------------------------------------

            var LoginStartTime_Search = new Ext.form.DateField({//ע����ʼʱ��
                fieldLabel: "��¼ʱ��",
                id: 'LoginStartTime_Search',
                width: 140,
                format: 'Y-m-d H:i:s'
            });
            var LoginEndTime_Search = new Ext.form.DateField({//ע�����ʱ��
                fieldLabel: "��",
                width: 140,
                vtype: "StartEndTime", //�Զ������֤����
                vtypeText: "��ʼʱ�������ڽ���ʱ�䣡",
                confirmTo: "LoginStartTime_Search", //Ҫ�Ƚϵ�����һ���������id
                format: 'Y-m-d H:i:s'
            });

            var loginLogtbar = new Ext.Toolbar({
                items: [{
                    text: "ɾ��",
                    iconCls: 'delete-icon',
                    handler: function () {
                        rows = loginLogTablePanel.getSelectionModel().getSelections();
                        if (rows.length == 0) {
                            App.setAlert(App.STATUS_NOTICE, "������ѡ��һ����Ҫɾ�������ݣ�");
                            return;
                        }
                        Ext.MessageBox.confirm('��ʾ', 'ȷʵҪɾ����ѡ�ļ�¼��?', loginLogDelete);

                    }

                }, '->', '��Ա���ƣ�', LoginENTName_Search, '��¼ʱ�䣺', LoginStartTime_Search, '����', LoginEndTime_Search, {
                    text: "����",
                    iconCls: 'search-icon',
                    handler: loginLogDataSearch
                }]

            });

            function loginLogDelete(btn) {
                if (btn == 'yes') {
                    var IDS = [];
                    var rows = loginLogTablePanel.getSelectionModel().getSelections();
                    for (var i = 0, len = rows.length; i < len; i++) {

                        IDS.push(rows[i].get('ID'));

                    }
                    var jsonData = { OperateType: "DeleteloginLog", IDS: IDS.join() };
                    CodeOperaMethod('DataProcess.aspx', jsonData);
                    loginLogStore.reload();
                }
            }
            function loginLogDataSearch() {
                if (LoginEndTime_Search.isValid() && LoginENTName_Search.isValid())//�ж��Ƿ�ͨ���ͻ�����֤
                {

                    loginLogStore.removeAll();
                    loginLogStore.baseParams.LoginEntName = LoginENTName_Search.getValue()
                    loginLogStore.baseParams.LoginStartTime = LoginStartTime_Search.getRawValue();
                    loginLogStore.baseParams.LoginEntTime = LoginEndTime_Search.getRawValue();



                    loginLogStore.baseParams.OperateType = "LoginLogSearch";
                    loginLogStore.load();
                    loginLogPageBar.changePage(1);



                }

            }
            var loginLogProxy = new Ext.data.HttpProxy({
                url: 'LoginData.aspx'
            });

            var loginLogReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "LoginIP" },
                        { name: "LoginTime" },
                        { name: "��Ա����" }
                        ]
                    );

            var loginLogStore = new Ext.data.Store(
                        { proxy: loginLogProxy, reader: loginLogReader }
                    );


            var loginLogPageBar = new Ext.PagingToolbar({
                store: loginLogStore,
                pageSize: loginLogPageSize,
                plugins: new Ext.ui.plugins.ComboPageSize(),
                displayInfo: true,
                displayMsg: '�ܼ�¼�� {0} - {1} of {2}',
                emptyMsg: "û�м�¼",
                id: 'loginLogPageBar'
            });
            var loginLogTablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
            var loginLogTablePanel = new Ext.grid.GridPanel({
                title: '��¼��־',
                minSize: 400,
                split: true,
                width: 450,
                collapsed: false,
                autoScroll: true,
                layout: "fit",
                region: 'center',
                frame: true,
                store: loginLogStore,
                tbar: loginLogtbar,
                bbar: loginLogPageBar,
                sm: loginLogTablePanel_sm,
                loadMask: true,
                columns: [
                    new Ext.grid.RowNumberer(),
                    loginLogTablePanel_sm,
                    { header: 'ID', dataIndex: 'ID', sortable: true, hidden: true },
                    { header: '��¼��', dataIndex: '��Ա����', sortable: true },
                    { header: '��¼IP', dataIndex: 'LoginIP', sortable: true },
                    { header: '��¼ʱ��', dataIndex: 'LoginTime', width: 150, sortable: true }


            ]
            });
            loginLogStore.load({ params: { start: 0, limit: loginLogPageSize} });
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
            tip.body.dom.innerHTML = '��ɫ������<br>' + unescape(store.getAt(rowIndex).get('Description'));
            }
            }
            });
            });*/
            var viewport = new Ext.Viewport({
                layout: 'border', //����,������border
                loadMask: true,
                items: [loginLogTablePanel
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
