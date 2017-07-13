Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = '../../../../ext-3.2.0/resources/images/default/s.gif';
    var OrgStructuretreeroot = new Ext.tree.AsyncTreeNode({
        text: '我的公司',
        draggable: false,
        expanded: true,
        id: 'OrgStructuretreeroot'
    });
    var OrgStructureTreeLoader = new Ext.tree.TreeLoader({
        // baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
        baseParams: { OperateType: 'OrgStructureTree' },
        dataUrl: 'DataProcess.aspx'
    });
    var Depart_CodeNum = new Ext.form.TextField({
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        allowBlank: false,
        fieldLabel: '部门编号',
        width: 150
    });
    var OrgStructureFormPanel = new Ext.FormPanel({
        labelWidth: 80,
        labelAlign: 'right',
        frame: true,
        defaultType: 'textfield',
        items: [Depart_CodeNum,
        {
            regex: /^[^\\'‘’]+$/,
            regexText: "不能包含单引号",
            allowBlank: false,
            fieldLabel: '部门名称',
            width: 150,
            name: 'NewName'
        }]
    });
    function operate(OperaType, node, title) {
        var win = new Ext.Window({
            title: '另存为对话框',
            modal: true,
            width: 280,
            closeAction: "hide",
            height: 130,
            buttonAlign: 'center',
            listeners: {
                "hide": function () {
                    OrgStructureFormPanel.form.reset();

                }
            },
            buttons: [{ text: '保存',
                //点击保存按钮后触发事件  
                handler: function () {
                    if (Depart_CodeNum.getValue() == 'OrgStructuretreeroot') {
                        Ext.MessageBox.alert("提示", "不能使用此编号！");
                        return;
                    }
                    if (OrgStructureFormPanel.form.isValid()) {
                        if (OperaType == "EditNode") {

                            if (OrgStructureFormPanel.form.isValid())//判断是否通过客户端验证
                            {
                                var jsonData = { OrgStructureOperaType: OperaType, NodeID: node.id, NewID: Depart_CodeNum.getValue(), NodeText: OrgStructureFormPanel.getForm().findField("NewName").getValue() };
                                CodeOperaMethod('OrgStructure.ashx', jsonData);
                                OrgStructureTreeLoader.load(OrgStructuretreeroot);
                                OrgStructuretreeroot.expand(true, false);
                            }
                        }
                        else if (OperaType == "AddNode") {
                            if (OrgStructureFormPanel.form.isValid())//判断是否通过客户端验证
                            {
                                var jsonData = { OrgStructureOperaType: OperaType, newName: OrgStructureFormPanel.getForm().findField("NewName").getValue(), ParentNodeID: node.id, CodeNum: Depart_CodeNum.getValue() };
                                CodeOperaMethod('OrgStructure.ashx', jsonData);
                                OrgStructureTreeLoader.load(OrgStructuretreeroot);
                                OrgStructuretreeroot.expand(true, false);
                            }

                        }
                        else
                            Ext.MessageBox.alert("提示", "当前系统有误，请刷新后在操作！");
                    }
                    else {
                        Ext.MessageBox.alert("提示", "输入不符合规则！");
                    }
                    win.hide();
                }
            }],
            items: [OrgStructureFormPanel]
        });
        win.setTitle(title);
        win.show();
    }

    var OrgStructureTreePanel = new Ext.tree.TreePanel({
        title: "企业组结构树",
        border: true,
        split: true,
        autoheight: true,
        width: 150,
        region: 'center',
        // height: 800,
        root: OrgStructuretreeroot,
        autoScroll: true,
        animate: true,
        enableDD: true,
        layout: 'fit',
        rootVisible: true,
        //  checkModel: "single",
        tools: [{
            id: 'refresh',
            handler: function () {
                OrgStructureTreeLoader.load(OrgStructuretreeroot);
                OrgStructuretreeroot.expand(true, false);
            }

        }],
        containerScroll: true,
        listeners: {//监听
            "contextmenu": function (node, e) {
                // 编辑菜单  
                OrgStructureTreePanel.selectPath(node.getPath());
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
                },
             {
                 text: "添加",
                 handler: function () {
                     OrgStructureFormPanel.getForm().findField("NewName").setValue("");
                     Depart_CodeNum.setValue("");
                     operate("AddNode", node, "添加组织结构");


                 }
             }, {
                 text: "删除",
                 handler: function () {

                     if (node.isLeaf()) {
                         if (node.id == "OrgStructuretreeroot") {
                             App.setAlert(App.STATUS_NOTICE, "请选择其子节点！");
                         }
                         else {
                             var NodeID = node.id;
                             var jsonData = { OrgStructureOperaType: "DeleteNode", NodeID: NodeID };
                             CodeOperaMethod('OrgStructure.ashx', jsonData)
                             node.remove();
                         }
                     }

                 }
             }, {
                 text: "编辑",
                 handler: function () {

                     OrgStructureFormPanel.getForm().findField('NewName').setValue(node.text);
                     Depart_CodeNum.setValue(node.id);
                     operate("EditNode", node, "编辑组织结构")
                 }
             }])
                menu.showAt(e.getPoint());
            },
            "nodedragover": function (e) {

                var node = e.target;
                if (node.leaf)
                    node.leaf = false;
                // alert(node.id);
                return true;
            },
            "nodedrop": function (e) {
                var NodeID = e.dropNode.id;
                var TargetNodeID = e.target.id;
                // alert(NodeID + TargetNodeID);
                var jsonData = { OrgStructureOperaType: "MoveNode", NodeID: NodeID, TargetNodeID: TargetNodeID };
                CodeOperaMethod('OrgStructure.ashx', jsonData);
                return true;
            }
        },
        loader: OrgStructureTreeLoader
    });
    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [OrgStructureTreePanel
            ]
    });

});
