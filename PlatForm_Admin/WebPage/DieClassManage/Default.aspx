<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PlatForm_Admin_WebPage_DieClassManage_Default" %>

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
    <script type="text/javascript" src="../../js/CodeOperaMethod.js"></script>
</head>
<script language="JavaScript" type="text/javascript">
    Ext.util.CSS.swapStyleSheet('theme', '../../' + '<%=Session["StyleSheet"].ToString()%>');
    var App = new Ext.App({});
    var OperateType;
    Ext.onReady(function () {

        Ext.BLANK_IMAGE_URL = '../../../ext-3.2.0/resources/images/default/s.gif';
        var DieClasstreeroot = new Ext.tree.AsyncTreeNode({
            text: '模具类别',
            draggable: false,
            expanded: true
        });
        var DieClassTreeLoader = new Ext.tree.TreeLoader({
            autoLoad: false,
            dataUrl: 'DataProcess.aspx'
        });
        DieClassTreeLoader.baseParams.OperateType = "LoadDieClassTreeData";
        var DieClassFormPanel = new Ext.FormPanel({
            labelWidth: 80,
            labelAlign: 'right',
            items: [{
                xtype: "textfield",
                fieldLabel: '名称',
                name: 'ClassName',
                submitValue: true,
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                width: 150

            }, {
                xtype: "hidden",
                name: 'ID'
            }]
        });

        var win = new Ext.Window({
            title: '另存为对话框',
            modal: true,
            width: 280,
            closeAction: "hide",
            height: 95,
            buttonAlign: 'center',
            listeners: {
                "hide": function () {
                    DieClassFormPanel.form.reset();
                }
            },
            buttons: [{ text: '保存',
                //点击保存按钮后触发事件  
                handler: function () {
                    if (DieClassFormPanel.form.isValid()) {
                        DieClassFormPanel.form.submit({
                            waitMsg: '正在提交数据请稍等...', 		//提示信息
                            waitTitle: '提示', 					//标题
                            url: 'DataProcess.aspx', //请求的url地址
                            method: 'POST',
                            params: {
                                OperateType: OperateType
                            },
                            success: function (form, action) {

                                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                                win.hide();
                                DieClassTreeLoader.load(DieClasstreeroot);

                            },
                            failure: function (form, action) {
                                App.setAlert(App.STATUS_NOTICE, action.result.msg);

                            }
                        });

                    }
                    else {
                        Ext.MessageBox.alert("提示", "输入不能包含中英文单引号！");
                    }

                }
            }],
            items: [DieClassFormPanel]
        });



        var DieClassTreePanel = new Ext.tree.TreePanel({
            title: "模具类型树",
            border: true,
            split: true,
            collapsible: false,
            region: 'center',
            root: DieClasstreeroot,
            autoScroll: true,
            animate: true,
            enableDD: true,
            rootVisible: false,
            tools: [{
                id: 'refresh',
                handler: function () {
                    DieClassTreeLoader.load(DieClasstreeroot);
                }

            }],
            containerScroll: true,
            listeners: {//监听
                "contextmenu": function (node, e) {
                    // 编辑菜单  
                    DieClassTreePanel.selectPath(node.getPath());
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
                    }, {
                        text: "添加",
                        handler: function () {
                            DieClassFormPanel.form.findField("ID").setValue(node.id);
                            OperateType = "AddNode"
                            win.setTitle("添加模具类别");
                            win.show();
                        }
                    }, {
                        text: "删除",
                        handler: function () {
                            if (node.isLeaf()) {
                                var jsonData = { OperateType: "DeleteNode", ID: node.id };
                                CodeOperaMethod('DataProcess.aspx', jsonData);
                                node.remove();
                            }

                        }
                    }, {
                        text: "编辑",
                        handler: function () {
                            DieClassFormPanel.form.findField("ID").setValue(node.id);
                            DieClassFormPanel.form.findField("ClassName").setValue(node.text);
                            OperateType = "EditNode"
                            win.setTitle("编辑[" + node.text + "]模具类名称");
                            win.show();
                        }
                    }])
                    menu.showAt(e.getPoint());
                },
                "nodedragover": function (e) {

                    var node = e.target;
                    if (node.leaf)
                        node.leaf = false;
                    return true;
                },
                "nodedrop": function (e) {
                    var NodeID = e.dropNode.id;
                    var TargetNodeID = e.target.id;
                    var jsonData = { OperateType: "MoveNode", NodeID: NodeID, TargetNodeID: TargetNodeID };
                    CodeOperaMethod('DataProcess.aspx', jsonData);
                    return true;
                }
            },
            loader: DieClassTreeLoader
        });


        var viewport = new Ext.Viewport({
            layout: 'border', //布局,必须是border
            loadMask: true,
            items: [DieClassTreePanel
            ]
        });

    });

</script>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
