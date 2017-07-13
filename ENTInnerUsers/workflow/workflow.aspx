﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="workflow.aspx.cs" Inherits="workflow_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Content-Language" content="UTF-8" />
    <style>
        #load
        {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 10000;
            padding: 10px;
            background: white;
            font-size: 12px;
        }
    </style>
    <link rel="Stylesheet" type="text/css" href="../../ext-3.2.0/resources/css/ext-all.css" />
    <%-- <link rel="Stylesheet" type="text/css" href="../../ext-3.2.0/extjsPlugins/ItemSelector/css/MultiSelect.css" />--%>
    <link rel="stylesheet" type="text/css" href="css/workfow.css" />
    <script type="text/javascript" src="../../ext-3.2.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/ext-all.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/src/locale/ext-lang-zh_CN.js"></script>
    <%--     --%>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/ItemSelector/MultiSelect.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/synchro/ext-basex.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/RowExpander.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/ComboBoxTree.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/ComboPageSize.js"></script>
    <script type="text/javascript" src="../../ext-3.2.0/extjsPlugins/App.js"></script>
    <%--     --%>
    <script type="text/javascript" src="js/LoadWorkFlowWin.js"></script>
    <script type="text/javascript" src="js/AddWorkFlowWin.js"></script>
    <script type="text/javascript" src="js/CodeOperaMethod.js"></script>
    <%--    <script type="text/javascript" src="js/AdvacedSearch.js"></script>
    <script type="text/javascript" src="js/ActivityServer.js"></script>--%>
    <script type="text/javascript" src="js/WFDetail.js"></script>
    <script type="text/javascript" src="js/workflow.js"></script>
    <script type="text/javascript" src="js/TaskWorkFlow.js"></script>
    <script type="text/javascript" src="js/commonOperateBtn.js"></script>
    <script type="text/javascript" src="js/layout.js"></script>
    <script type="text/javascript">
        Ext.util.CSS.swapStyleSheet('theme', '../' + '<%=Session["StyleSheet"].ToString()%>');
        var App = new Ext.App({});

        Array.prototype.remove = function (dx) {
            if (isNaN(dx) || dx > this.length) { return false; }
            this.splice(dx, 1);
        }
        Array.prototype.indexOf = function (el, start) {
            var start = start || 0;
            for (var i = 0; i < this.length; ++i) {
                if (this[i] === el) {
                    return i;
                }
            }
            return -1;
        };

        var State_Colorconn = Ext.lib.Ajax.getConnectionObject().conn;
        State_Colorconn.open("POST", "DataProcess.aspx?OperateType=State_Color", false);
        State_Colorconn.send(null);
        var temp = State_Colorconn.responseText;
        var State_Color = Ext.util.JSON.decode(temp);

        var State_Nameconn = Ext.lib.Ajax.getConnectionObject().conn;
        State_Nameconn.open("POST", "DataProcess.aspx?OperateType=State_Name", false);
        State_Nameconn.send(null);
        var temp = State_Nameconn.responseText;
        var State_Name = Ext.util.JSON.decode(temp);

        var CurrentUserID = '<%=Session["userID"]%>';
        function onInit(editor, isFirstTime) {
            mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);

            editor.graph.setConnectable(true);
            editor.graph.connectionHandler.setCreateTarget(true);
            editor.addListener(mxEvent.SESSION, function (editor, evt) {
                var session = evt.getArgAt(0);
                if (session.connected) {
                    var tstamp = new Date().toLocaleString();
                    editor.setStatus(tstamp + ':' + ' ' + session.sent + ' bytes sent, ' + ' ' + session.received + ' bytes received');
                }
                else {
                    editor.setStatus('Not connected');
                }
            });

            mxEvent.addMouseWheelListener(function (evt, up) {
                if (!mxEvent.isConsumed(evt)) {
                    if (up) {
                        editor.execute('zoomIn');
                    }
                    else {
                        editor.execute('zoomOut');
                    }

                    mxEvent.consume(evt);
                }
            });
        }
    </script>
    <script type="text/javascript">
        window.onload = function () {

            main();
            // mxGraphHandler.getPrototype().guidesEnabled = true; //显示细胞位置标尺 
            //graph.guidesEnabled = true;
            Ext.get("load").dom.style.display = "none";

        };
    </script>
</head>
<body>
    <div id="load">
        <img src="images/loader.gif" width="16" height="16" alt="" />&nbsp;正在初始化,请稍候...</div>
    <div id="header">
        <div style="float: right; margin: 5px;" class="x-small-editor">
        </div>
    </div>
</body>
</html>
