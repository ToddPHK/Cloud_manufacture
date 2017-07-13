var graph, OperateType, library;
MainPanel = function (graph, history) {
    var executeLayout = function (layout, animate, ignoreChildCount) {
        var cell = graph.getSelectionCell();
        if (cell == null
				|| (!ignoreChildCount && graph.getModel().getChildCount(cell) == 0)) {
            cell = graph.getDefaultParent()
        }
        if (animate && navigator.userAgent.indexOf('Camino') < 0) {
            var listener = function (sender, evt) {
                mxUtils.animateChanges(graph, evt.getArgAt(0));
                graph.getModel().removeListener(listener)
            };
            graph.getModel().addListener(mxEvent.CHANGE, listener)
        }
        layout.execute(cell)
    };
    var fillColorMenu = new Ext.menu.ColorMenu({
        items: [{
            text: '无',
            handler: function () {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR,
								mxConstants.NONE)
            }
        }, '-'],
        handler: function (cm, color) {
            if (typeof (color) == "string") {


                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#'
										+ color)
            }
        }
    });
    var gradientColorMenu = new Ext.menu.ColorMenu({
        items: [{
            text: '左',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_GRADIENT_DIRECTION,
								mxConstants.DIRECTION_WEST)
            }
        }, {
            text: '上',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_GRADIENT_DIRECTION,
								mxConstants.DIRECTION_NORTH)
            }
        }, {
            text: '下',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_GRADIENT_DIRECTION,
								mxConstants.DIRECTION_SOUTH)
            }
        }, {
            text: '右',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_GRADIENT_DIRECTION,
								mxConstants.DIRECTION_EAST)
            }
        }, '-', {
            text: '无',
            handler: function () {
                graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR,
								mxConstants.NONE)
            }
        }, '-'],
        handler: function (cm, color) {
            if (typeof (color) == "string") {
                graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR,
								'#' + color)
            }
        }
    });

    var lineColorMenu = new Ext.menu.ColorMenu({
        items: [{
            text: '无',
            handler: function () {
                graph.setCellStyles(mxConstants.STYLE_STROKECOLOR,
								mxConstants.NONE)
            }
        }, '-'],
        handler: function (cm, color) {
            if (typeof (color) == "string") {
                graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#'
										+ color)
            }
        }
    });
    var labelBackgroundMenu = new Ext.menu.ColorMenu({
        items: [{
            text: '无',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
								mxConstants.NONE)
            }
        }, '-'],
        handler: function (cm, color) {
            if (typeof (color) == "string") {
                graph.setCellStyles(
								mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#'
										+ color)
            }
        }
    });
    var labelBorderMenu = new Ext.menu.ColorMenu({
        items: [{
            text: '无',
            handler: function () {
                graph.setCellStyles(
								mxConstants.STYLE_LABEL_BORDERCOLOR,
								mxConstants.NONE)
            }
        }, '-'],
        handler: function (cm, color) {
            if (typeof (color) == "string") {
                graph.setCellStyles(
								mxConstants.STYLE_LABEL_BORDERCOLOR, '#'
										+ color)
            }
        }
    });


    //-------------------上部工具栏-------------------

    var bbar = new Ext.Toolbar({
        items: [{
            id: 'linecolor',
            text: '',
            tooltip: '线颜色',
            iconCls: 'linecolor-icon',
            menu: lineColorMenu
        }, {
            id: 'fillcolor',
            text: '',
            tooltip: '填充颜色',
            iconCls: 'fillcolor-icon',
            menu: fillColorMenu
        }, '->', {
            text: '大小',
            iconCls: 'zoom-icon',
            handler: function (menu) {
            },
            menu: {
                items: [{
                    text: '自定义',
                    scope: this,
                    handler: function (item) {
                        var value = mxUtils.prompt(
										'Enter Source Spacing (像素)',
										parseInt(graph.getView().getScale()
												* 100));
                        if (value != null) {
                            graph.getView().setScale(parseInt(value)
											/ 100)
                        }
                    }
                }, '-', {
                    text: '400%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(4)
                    }
                }, {
                    text: '200%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(2)
                    }
                }, {
                    text: '150%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(1.5)
                    }
                }, {
                    text: '100%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(1)
                    }
                }, {
                    text: '75%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(0.75)
                    }
                }, {
                    text: '50%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(0.5)
                    }
                }, {
                    text: '25%',
                    scope: this,
                    handler: function (item) {
                        graph.getView().setScale(0.25)
                    }
                }, '-', {
                    text: '放大',
                    scope: this,
                    handler: function (item) {
                        graph.zoomIn()
                    }
                }, {
                    text: '缩小',
                    scope: this,
                    handler: function (item) {
                        graph.zoomOut()
                    }
                }, '-', {
                    text: '实际大小',
                    scope: this,
                    handler: function (item) {
                        graph.zoomActual()
                    }
                }, {
                    text: '自适应窗口',
                    scope: this,
                    handler: function (item) {
                        graph.fit()
                    }
                }]
            }
        }, '-', {
            text: '布局',
            iconCls: 'diagram-icon',
            handler: function (menu) {
            },
            menu: {
                items: [{
                    text: '垂直层次布局',
                    scope: this,
                    handler: function (item) {
                        executeLayout(new mxHierarchicalLayout(graph), true)
                    }
                }, {
                    text: '水平层次布局',
                    scope: this,
                    handler: function (item) {
                        executeLayout(new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST), true)
                    }
                }, '-', {
                    text: '紧凑布局',
                    scope: this,
                    handler: function (item) {
                        executeLayout(new mxCompactTreeLayout(graph, mxConstants.ALIGN_CENTER), true)
                        // executeLayout(new mxParallelEdgeLayout(graph))
                    }
                }, '-', {
                    text: '环形布局',
                    scope: this,
                    handler: function (item) {
                        executeLayout(new mxCircleLayout(graph), true)
                    }
                }, {
                    text: '有机布局',
                    scope: this,
                    handler: function (item) {
                        var layout = new mxFastOrganicLayout(graph);
                        layout.forceConstant = 80;
                        executeLayout(layout, true)
                    }
                }]
            }
        }, '-', {
            text: '选项',
            iconCls: 'preferences-icon',
            handler: function (menu) {
            },
            menu: {
                items: [{
                    text: '网格',
                    handler: function (menu) {
                    },
                    menu: {
                        items: [{
                            text: '网格大小',
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.prompt('提示', '输入网格的大小（必须为数字）', setGridSize, this, true, graph.gridSize);
                                function setGridSize(id, msg) {
                                    if (id == 'ok') {
                                        graph.gridSize = msg;
                                        alert(id + msg);
                                    }
                                }
                            }
                        }, {
                            checked: true,
                            text: '启动网格',
                            scope: this,
                            checkHandler: function (item, checked) {
                                graph.setGridEnabled(checked)
                                graph.container.style.backgroundImage = (graph
												.isGridEnabled())
												? 'url(images/body_bg.jpg)'
												: 'none';
                            }
                        }]
                    }
                }, {
                    text: '标签',
                    handler: function (menu) {
                    },
                    menu: {
                        items: [{
                            checked: true,
                            text: '显示标签',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.labelsVisible = checked;
                                graph.refresh()
                            }
                        }, {
                            checked: true,
                            text: '允许移动连线标签',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.edgeLabelsMovable = checked
                            }
                        }, {
                            checked: false,
                            text: '允许移动图形标签',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.vertexLabelsMovable = checked
                            }
                        }]
                    }
                }, '-', {
                    text: '连接线',
                    handler: function (menu) {
                    },
                    menu: {
                        items: [{
                            checked: true,
                            text: '自动连接线',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.setConnectable(checked)
                            }
                        }, '-', {
                            checked: true,
                            text: '自动创建目标图形',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.connectionHandler
														.setCreateTarget(checked)
                            }
                        }]
                    }
                }, {
                    text: '图形规则',
                    handler: function (menu) {
                    },
                    menu: {
                        items: [{
                            checked: true,
                            text: '允许悬空连接',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.setAllowDanglingEdges(checked)
                            }
                        }, '-', {
                            checked: false,
                            text: '允许自连',
                            scope: this,
                            checkHandler: function (item,
													checked) {
                                graph.setAllowLoops(checked)
                            }
                        }]
                    }
                }, '-', {
                    text: '显示 XML',
                    scope: this,
                    handler: function (item) {
                        var enc = new mxCodec(mxUtils
										.createXmlDocument());
                        var node = enc.encode(graph.getModel());
                        mxUtils.popup(mxUtils.getPrettyXml(node))
                    }
                }]
            }
        }]
    });
    var WorkFlow_OperateMenu = new Ext.menu.Menu({
        items: [{
            text: "确认流程创建完成",
            iconCls: 'edit-icon',
            handler: ConfirmWFFinish
        }, {
            text: "确认任务绑定完成",
            iconCls: 'edit-icon',
            handler: ConfirmWFBindingFinish
        }, {
            text: "通过发布",
            iconCls: 'edit-icon',
            handler: WorkF_PassAuDit
        }, {
            text: "拒绝发布",
            iconCls: 'edit-icon',
            handler: WorkF_NoPassAuDit
        }, {
            text: "申请发布流程",
            iconCls: 'edit-icon',
            handler: PublishWorkFlow
        }, {
            text: "确认",
            iconCls: 'edit-icon',
            handler: ConfirmWorkFlow
        }]
    });
    function ConfirmWorkFlow() {
        var WorkFlowID = NodeWindow.CurrentWorkFlowID;

        if (WorkFlowID > 0) {
            if (NodeWindow.creator != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程归属项目的负责人，无权进行此操作！");
                return;
            }
            else {
                if (NodeWindow.WorkFlowState != 8 && NodeWindow.WorkFlowState != 10 && NodeWindow.WorkFlowState != 13 && NodeWindow.WorkFlowState != 17 && NodeWindow.WorkFlowState != 15) {
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                }
                else {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=ConfirmWorkFlow&WorkFlowID=" + WorkFlowID , false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    if (responseText == 'success') {
                            NodeWindow.WorkFlowState = 1;

                        App.setAlert(App.STATUS_NOTICE, "操作成功！");
                    }
                    else if (responseText == 'failure') {
                        App.setAlert(App.STATUS_NOTICE, "操作失败！");
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "系统错误！");
                    //                    var jsonDataNode = { OperateType: 'WorkF_PassAuDit', WorkFlowID: WorkFlowID, State: NodeWindow.WorkFlowState };
                    //                    CodeOperaMethod('workFlowHandler.ashx', jsonDataNode);
                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    function WorkF_PassAuDit() {

        var WorkFlowID = NodeWindow.CurrentWorkFlowID;

        if (WorkFlowID > 0) {
            if (NodeWindow.ProjectChargor != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程归属项目的负责人，无权进行此操作！");
                return;
            }
            else {
                if (NodeWindow.WorkFlowState != 12 && NodeWindow.WorkFlowState != 14) {
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                }
                else {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=WorkF_PassAuDit&WorkFlowID=" + WorkFlowID + "&State=" + NodeWindow.WorkFlowState, false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    if (responseText == 'success') {
                        if (NodeWindow.WorkFlowState == 12)
                            NodeWindow.WorkFlowState = 7;
                        else
                            NodeWindow.WorkFlowState = 16;
                        App.setAlert(App.STATUS_NOTICE, "操作成功！");
                        graphLock();
                    }
                    else if (responseText == 'failure') {
                        App.setAlert(App.STATUS_NOTICE, "操作失败！");
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "系统错误！");
                    //                    var jsonDataNode = { OperateType: 'WorkF_PassAuDit', WorkFlowID: WorkFlowID, State: NodeWindow.WorkFlowState };
                    //                    CodeOperaMethod('workFlowHandler.ashx', jsonDataNode);
                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    function WorkF_NoPassAuDit() {

        var WorkFlowID = NodeWindow.CurrentWorkFlowID;

        if (WorkFlowID > 0) {
            if (NodeWindow.ProjectChargor != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程归属项目的负责人，无权进行此操作！");
                return;
            }
            else {
                if (NodeWindow.WorkFlowState != 12 && NodeWindow.WorkFlowState != 14) {
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                }
                else {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=WorkF_NoPassAuDit&WorkFlowID=" + WorkFlowID + "&State=" + NodeWindow.WorkFlowState, false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    if (responseText == 'success') {
                        if (NodeWindow.WorkFlowState == 12)
                            NodeWindow.WorkFlowState = 13;
                        else
                            NodeWindow.WorkFlowState = 15;

                        App.setAlert(App.STATUS_NOTICE, "操作成功！");
                        graphLock();
                    }
                    else if (responseText == 'failure') {
                        App.setAlert(App.STATUS_NOTICE, "操作失败！");
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "系统错误！");
                    //                    var jsonDataNode = { OperateType: 'WorkF_NoPassAuDit', WorkFlowID: WorkFlowID, State: NodeWindow.WorkFlowState };
                    //                    CodeOperaMethod('workFlowHandler.ashx', jsonDataNode);
                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    function PublishWorkFlow() {

        var WorkFlowID = NodeWindow.CurrentWorkFlowID;

        if (WorkFlowID > 0) {
            if (NodeWindow.creator != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
                return;
            }
            else {
                if (NodeWindow.WorkFlowState != 2) {
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                }
                else {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=publishWorkFlowTask&WorkFlowID=" + WorkFlowID + "&State=" + NodeWindow.WorkFlowState, false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    var result = Ext.util.JSON.decode(responseText);
                    if (result.success) {
                        NodeWindow.WorkFlowState = result.state;
                        App.setAlert(App.STATUS_NOTICE, result.msg);
                        graphLock();
                    }
                    else {
                        App.setAlert(App.STATUS_NOTICE, result.msg);
                    }

                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    function ConfirmWFFinish() {
        // CurrentUserID
        var WorkFlowID = NodeWindow.CurrentWorkFlowID;

        if (WorkFlowID > 0) {
            if (NodeWindow.creator != CurrentUserID) {
                App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
            }
            else {
                if (NodeWindow.WorkFlowState != 0) {
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                }
                else {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=ConfirmWFFinish&WorkFlowID=" + WorkFlowID, false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    if (responseText == 'success') {
                        NodeWindow.WorkFlowState = 1;
                        App.setAlert(App.STATUS_NOTICE, "操作成功！");
                        graphLock();
                    }
                    else if (responseText == 'failure') {
                        App.setAlert(App.STATUS_NOTICE, "操作失败！");
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "系统错误！");

                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    function ConfirmWFBindingFinish() {
        if (NodeWindow.creator != CurrentUserID) {
            App.setAlert(App.STATUS_NOTICE, "你不是该流程的创建人，无权进行此操作！");
            return;
        }
        var WorkFlowID = NodeWindow.CurrentWorkFlowID;
        if (WorkFlowID > 0) {
            //只有当前状态是流程创建完成才能确认流程任务绑定完成
            if (NodeWindow.WorkFlowState != 1) {
                App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                return;
            }
            else {
                var NodeNames = [];
                var flag = true;
                graph.selectVertices();
                var cells = graph.getSelectionCells();
                graph.clearSelection();
                for (i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (cell.value.tagName == 'Rect' && cell.getTaskID() == null) {
                        flag = false;
                        NodeNames.push(cell.getAttribute('label'));
                    }
                }
                if (flag) {
                    var TaskDicWordconn = Ext.lib.Ajax.getConnectionObject().conn;
                    TaskDicWordconn.open("POST", "workFlowHandler.ashx?OperateType=ConfirmWFBindingFinish&WorkFlowID=" + WorkFlowID, false);
                    TaskDicWordconn.send(null);
                    var responseText = TaskDicWordconn.responseText;
                    if (responseText == 'success') {
                        NodeWindow.WorkFlowState = 2;
                        App.setAlert(App.STATUS_NOTICE, "操作成功！");

                    }
                    else if (responseText == 'failure') {
                        App.setAlert(App.STATUS_NOTICE, "操作失败！");
                    }
                    else
                        App.setAlert(App.STATUS_NOTICE, "系统错误！");

                    //                var jsonDataNode = { OperateType: 'ConfirmWFBindingFinish', WorkFlowID: WorkFlowID };
                    //                CodeOperaMethod('workFlowHandler.ashx', jsonDataNode);

                }
                else {
                    App.setAlert(App.STATUS_NOTICE, "节点[" + NodeNames.join() + "]还未绑定任务！");
                }
            }
        }
        else {
            App.setAlert(App.STATUS_NOTICE, "还未加载工作流！");
        }
    }
    this.graphPanel = new Ext.Panel({
        region: 'center',
        border: false,
        bbar: bbar,
        tbar: [{
            id: 'view',
            text: '',
            iconCls: 'preview-icon',
            tooltip: '预览',
            handler: function () {
                mxUtils.show(graph)
            },
            scope: this
        }, '-', {
            id: 'cut',
            text: '',
            iconCls: 'cut-icon',
            tooltip: '剪切',
            handler: function () {
                mxClipboard.cut(graph)
            },
            scope: this
        }, {
            id: 'copy',
            text: '',
            iconCls: 'copy-icon',
            tooltip: '复制',
            handler: function () {
                mxClipboard.copy(graph)
            },
            scope: this
        }, {
            text: '',
            iconCls: 'paste-icon',
            tooltip: '粘贴',
            handler: function () {
                mxClipboard.paste(graph)
            },
            scope: this
        }, {
            id: 'refresh',
            text: '',
            iconCls: 'refresh-icon',
            tooltip: '刷新',
            handler: function () {
                graph.refresh();
            },
            scope: this
        }, {
            id: 'save',
            text: '',
            iconCls: 'save-icon ',
            tooltip: '保存',
            handler: function () {
                //  alert(NodeWindow.CurrentWorkFlowID)
                if (NodeWindow.CurrentWorkFlowID == -1) {
                    App.setAlert(App.STATUS_NOTICE, "请先加载一个工作流！");
                }
                else {
                    var enc = new mxCodec(mxUtils.createXmlDocument());
                    var node = enc.encode(graph.getModel());
                    //var val = escape(Ext.util.Format.htmlEncode(mxUtils.getPrettyXml(node))); //Ext.util.Format.htmlDecode(unescape())
                    var val = escape(mxUtils.getPrettyXml(node));
                    //var val = mxUtils.getPrettyXml(node);
                    var jsonData = { OperateType: 'updateWorkFlowContent', workflowID: NodeWindow.CurrentWorkFlowID, workflowcontent: val };
                    CodeOperaMethod('workFlowHandler.ashx', jsonData);
                }
            },
            scope: this
        }, '-', {
            id: 'delete',
            text: '',
            iconCls: 'delete-icon',
            tooltip: '删除',
            handler: function () {
                graph.removeCells()
            },
            scope: this
        }, '-', {
            id: 'undo',
            text: '',
            iconCls: 'undo-icon',
            tooltip: '撤销',
            handler: function () {
                history.undo()
            },
            scope: this
        }, {
            id: 'redo',
            text: '',
            iconCls: 'redo-icon',
            tooltip: '恢复',
            handler: function () {
                history.redo()
            },
            scope: this
        }, {
            id: 'loadwokflow',
            text: '',
            tooltip: '加载工作流',
            iconCls: 'load-icon',
            handler: function () {
                LoadNewWorkFlow();


            }
        }, '-', {
            text: "流程操作",
            menu: WorkFlow_OperateMenu
        }],
        //----------------------------上下文菜单-------------------------------

        onContextHide: function () {
            if (this.ctxNode) {
                this.ctxNode.ui.removeClass('x-node-ctx');
                this.ctxNode = null
            }
        }
    });


    MainPanel.superclass.constructor.call(this, {
        region: 'center',
        layout: 'fit',
        items: this.graphPanel
    });
    var self = this;
    //    graph.panningHandler.popup = function (x, y, cell, evt) {
    //        self.graphPanel.onContextMenu(null, evt)
    //    };
    //    graph.panningHandler.hideMenu = function () {
    //        if (self.graphPanel.menuPanel != null) {
    //            self.graphPanel.menuPanel.hide()
    //        }
    //    };
    this.graphPanel.on('resize', function () {
        graph.sizeDidChange()
    });
};
Ext.extend(MainPanel, Ext.Panel);
LibraryPanel = function () {
    LibraryPanel.superclass.constructor.call(this, {
        region: 'center',
        split: true,
        rootVisible: false,
        lines: false,
        autoScroll: true,
        root: new Ext.tree.TreeNode('Graph Editor'),
        collapseFirst: false
    });
    this.templates = this.root.appendChild(new Ext.tree.TreeNode({
        text: '形状',
        cls: 'feeds-node',
        expanded: true
    }))
};
Ext.extend(LibraryPanel, Ext.tree.TreePanel, {
    addTemplate: function (name, icon, parentNode, cells) {
        var exists = this.getNodeById(name);
        if (exists) {
            if (!inactive) {
                exists.select();
                exists.ui.highlight()
            }
            return
        }
        var node = new Ext.tree.TreeNode({
            text: name,
            icon: icon,
            leaf: true,
            cls: 'feed',
            cells: cells,
            id: name
        });
        if (parentNode == null) {
            parentNode = this.templates
        }
        parentNode.appendChild(node);
        return node
    },
    afterRender: function () {
        LibraryPanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function (e) {
            e.preventDefault()
        })
    }
});
GraphEditor = {};
var editor = null;


function mxApplication(config) {
    try {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            var node = mxUtils.load(config).getDocumentElement();
            var editor = new mxEditor(node);

            // Displays version in statusbar
            editor.setStatus('mxGraph ' + mxClient.VERSION);
        }
    }
    catch (e) {
        // Shows an error message if the editor cannot start
        mxUtils.alert('Cannot start application: ' + e.message);
        throw e; // for debugging
    }
    return editor;
}
//---------------------------------------------------------------
showMyProps = function (graph) {
    var cell = graph.getSelectionCell();
    if (cell != null) {

        NodeForm.getForm().findField('ID').setValue(cell.getId());
        NodeForm.getForm().findField('NodeName').setValue(cell.getAttribute('label'));
        NodeStateListCombo.setValue(cell.getMyState());
        //------------------


    }

    if (cell == null) {

    }
}
setMyProps = function (graph) {

    var cell = graph.getSelectionCell();

    if (cell != null) {
        cell.setAttribute('label', NodeForm.getForm().findField('NodeName').getValue());
        cell.setTask(NodeForm.getForm().findField('NodeDescrib').getValue());
       // cell.setMyState(NodeStateListCombo.getValue());

    }

    if (cell == null) {

    }
}
var NodeStateStore = new Ext.data.SimpleStore({

    url: '../PDM/ComboData.aspx',
    autoLoad: { params: { type: 'TaskState'} },
    fields: ['ID', 'State'],
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});
var NodeStateListCombo = new Ext.form.ComboBox({
    store: NodeStateStore,
    valueField: 'ID',
    displayField: 'State', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    emptyText: '节点/任务状态',
    fieldLabel: '节点状态',
    editable: false, // 是否允许输入
    forceSelection: true, // 必须选择一个选项
    blankText: '请选择', // 该项如果没有选择，则提示错误信息,
    triggerAction: 'all',
    anchor: '90%'
});
var NodeForm = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    bodyStyle: 'padding:8px 0 0 0;',
    frame: true,
    buttonAlign: 'center',
    layout: "form",
    labelAlign: "right",
    items: [{
        xtype: 'textfield',
        fieldLabel: '节点ID',
        disabled: true,
        name: 'ID',
        anchor: '90%'  // anchor width by percentage
    }, {
        xtype: 'textfield',
        fieldLabel: '名称',
        name: 'NodeName',
        anchor: '90%'  // anchor width by percentage
    }, NodeStateListCombo,
          {
              xtype: 'textarea',
              fieldLabel: '节点描述',
              name: 'NodeDescrib',
              anchor: '90%'  // anchor width by percentage
          }],
    buttons: [{
        text: '保存',
        handler: function () { setMyProps(graph); }

    }]
});

//var MessageSendForm = new Ext.form.FormPanel({
//    baseCls: 'x-plain',
//    labelWidth: 60,
//    //  fileUpload: true,
//    bodyStyle: 'padding:8px 0 0 0;',
//    frame: true,
//    buttonAlign: 'center',
//    labelAlign: "right",
//    defaultType: 'textfield',
//    buttons: [{
//        text: '发送',
//        handler: function () { setMyProps(graph); }

//    }],
//    items: [{
//        xtype: 'textarea',
//        fieldLabel: '信息',
//        name: 'Message',
//        height: 120,
//        anchor: '90%'  // anchor width by percentage
//    }]
//});


var myPropsTabs = new Ext.TabPanel({
    baseCls: 'x-plain',
    activeTab: 0,
    enableTabScroll: true,
    items: [
          { title: '常规', baseCls: 'x-plain', items: NodeForm },
          { title: '常用操作', baseCls: 'x-plain', items: ManageButtonPanel }
//          ,{ title: '信息发送', baseCls: 'x-plain', items: MessageSendForm }
     ]
});
var NodeWindow = new Ext.Window({
    title: '属性框',
    id: 'attribute',
    width: 400,
    height: 260,
    closable: false,
    collapsible: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: myPropsTabs

});
NodeWindow.CurrentWorkFlowID = -1;
//-----------------------------------------------
function main() {
    Ext.Component.prototype.stateful = false
    Ext.BLANK_IMAGE_URL = '../../ext-3.2.0/resources/images/default/s.gif';
    editor = new mxApplication('config/diagrameditor.xml');
    Ext.QuickTips.init();
    mxEvent.disableContextMenu(document.body);
    mxConstants.DEFAULT_HOTSPOT = 0.3;
    //var graph = editor.graph;
    graph = editor.graph;

    //graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_WEST); //-------------
    //mxGraphHandler.prototype.guidesEnabled = true
    graph.guidesEnabled = true;
    var history = new mxUndoManager();
    var node = mxUtils.load('resources/default-style.xml').getDocumentElement();
    var dec = new mxCodec(node.ownerDocument);
    dec.decode(node, graph.getStylesheet());
    graph.alternateEdgeStyle = 'vertical';

    //--------------------------mystart-------------------------------

    NodeWindow.show();

    //--------------------------myend-------------------------------

    var mainPanel = new MainPanel(graph, history);
     library = new LibraryPanel();
    var outlinePanel = new Ext.Panel({
        id: 'outlinePanel',
        layout: 'fit',
        split: true,
        height: 200,
        region: 'south'
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
       // id: "Wfviewport",
        items: [{
            xtype: 'panel',
            margins: '5 5 5 5',
            region: 'center',
            layout: 'border',
            border: false,
            items: [new Ext.Panel({
                title: '图形库',
                region: 'west',
                layout: 'border',
                split: true,
                width: 180,
                collapsible: true,
                border: false,
                items: [library, outlinePanel]
            }), mainPanel]//, propertyPanel
        }]
    });
    mainPanel.graphPanel.body.dom.style.overflow = 'auto';
    if (mxClient.IS_MAC && mxClient.IS_SF) {
        graph.addListener(mxEvent.SIZE, function (graph) {
            graph.container.style.overflow = 'auto'
        })
    }
    graph.init(mainPanel.graphPanel.body.dom);
    graph.setConnectable(true);
    graph.setDropEnabled(true);
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.connectionHandler.setCreateTarget(true);
    var rubberband = new mxRubberband(graph);
    var parent = graph.getDefaultParent();
    // graph.getModel().beginUpdate();
    // try {
    // LoadNewWorkFlow(graph);
    //loadXML(graph)
    //} finally {
    //    graph.getModel().endUpdate()
    //}
    var listener = function (sender, evt) {
        history.undoableEditHappened(evt.getArgAt(0))
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
    var toolbarItems = mainPanel.graphPanel.getTopToolbar().items;
    var bbarItems = mainPanel.graphPanel.getBottomToolbar().items;
    //--------监听mxcell的选择时间并执行相应的函数-----------------------------------------
    var selectionListener = function () {
        showMyProps(graph);
        var selected = !graph.isSelectionEmpty();
        toolbarItems.get('cut').setDisabled(!selected);
        toolbarItems.get('copy').setDisabled(!selected);
        toolbarItems.get('delete').setDisabled(!selected);
        //        bbarItems.get('italic').setDisabled(!selected);
        //        bbarItems.get('bold').setDisabled(!selected);
        //        bbarItems.get('underline').setDisabled(!selected);
        bbarItems.get('fillcolor').setDisabled(!selected);
        //   bbarItems.get('fontcolor').setDisabled(!selected);
        bbarItems.get('linecolor').setDisabled(!selected);
        //        bbarItems.get('align').setDisabled(!selected)
    };
    //------------------------双击节点调试--------------------------------
    graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
        var cell = graph.getSelectionCell();
        //alert(cell);
        if (cell != undefined)
            showService_EditWindow(cell);
    });
    //    graph.getSelectionModel().addListener(mxEvent.CLICK, function (sender, evt) {
    //        var cell = graph.getSelectionCell();
    //        if (cell != null) {

    ////            NodeForm.getForm().findField('ID').setValue(cell.getId());
    ////            NodeForm.getForm().findField('NodeName').setValue(cell.getAttribute('label'));
    ////            NodeForm.getForm().findField('NodeDescrib').setValue(cell.getTask());
    ////            NodeForm.getForm().findField('NodeState').setValue(cell.getMyState());
    //            alert(cell.getId());
    //        }
    //        //        selectionChanged(graph, cell);
    //    });
    //-------------------------调试-------------------------------------
//        function deleteListener() {
//            var cell = graph.getSelectionCell();
//            alert(cell.getID());
//        }

//        graph.addListener(mxEvent.CELLS_REMOVED, deleteListener);

    //  graph.getSelectionModel().addListener(mxEvent.CELLS_REMOVED, deleteListener);

    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);
    var historyListener = function () {
        toolbarItems.get('undo').setDisabled(!history.canUndo());
        toolbarItems.get('redo').setDisabled(!history.canRedo())
    };
    history.addListener(mxEvent.ADD, historyListener);
    history.addListener(mxEvent.UNDO, historyListener);
    history.addListener(mxEvent.REDO, historyListener);
    selectionListener();
    historyListener();
    var outline = new mxOutline(graph, outlinePanel.body.dom);
    insertVertexTemplate(library, graph, '文本', 'images/text.gif',
			'text;rounded=1', 80, 20, 'text');
    //    insertVertexTemplate(library, graph, '容器', 'images/swimlane.gif',
    //			'swimlane', 200, 200, 'container');
    insertVertexTemplate(library, graph, '任务节点', 'images/rectangle.gif', 'fillColor=#99CCFF',
			100, 40, "rectangle");
    //    insertVertexTemplate(library, graph, '矩形', 'images/rectangle.gif', 'fillColor=#00CC00',
    //			100, 40, "rectangle");
    //  insertVertexTemplate(library, graph, '平滑矩形', 'images/rounded.gif',
    //		'rounded=1;strokeColor=red;fillColor=green', 100, 40, "rounded");
    insertVertexTemplate(library, graph, '开始/结束', 'images/ellipse.gif', 'ellipse',
			60, 60, "ellipse");
    //    insertVertexTemplate(library, graph, '双环椭圆', 'images/doubleellipse.gif',
    //			'ellipse;shape=doubleEllipse', 60, 60, "doubleellipse");
    //    insertVertexTemplate(library, graph, '三角形', 'images/triangle.gif',
    //			'triangle', 40, 60, "triangle");
    //insertVertexTemplate(library, graph, '条件', 'images/rhombus.gif', 'rhombus',
	//		60, 60, "rhombus");
    //    insertVertexTemplate(library, graph, '水平线', 'images/hline.gif', 'line',
    //			120, 10, "hline");
    //    insertVertexTemplate(library, graph, '六边形', 'images/hexagon.gif',
    //			'shape=hexagon', 80, 60, "hexagon");
    //    insertVertexTemplate(library, graph, '圆柱体', 'images/cylinder.gif',
    //			'shape=cylinder', 60, 80, "cylinder");
    //    insertVertexTemplate(library, graph, '角色', 'images/actor.gif',
    //			'shape=actor', 40, 60, "actor");
    //    insertVertexTemplate(library, graph, '对话', 'images/cloud.gif',
    //			'ellipse;shape=cloud', 80, 60, "cloud");
    //insertEdgeTemplate(library, graph, '直线', 'images/straight.gif', 'straight;strokeColor=#00CC00',
	//		100, 100, "connector");
    //insertEdgeTemplate(library, graph, '水平连接线', 'images/connect.gif', 'strokeColor=#00CC00',
	//		100, 100, "connector");
   // insertEdgeTemplate(library, graph, '垂直连接线', 'images/vertical.gif',
	//		'vertical;strokeColor=#00CC00', 100, 100, "connector");
    //    insertEdgeTemplate(library, graph, '实体关系', 'images/entity.gif', 'entity;strokeColor=#00CC00',
    //			100, 100, "connector");
    //    insertEdgeTemplate(library, graph, '箭头', 'images/arrow.gif', 'arrow', 100,
    //			100, "connector");
    var previousCreateGroupCell = graph.createGroupCell;
    graph.createGroupCell = function () {
        var group = previousCreateGroupCell.apply(this, arguments);
        group.setStyle('group');
        return group
    };
    graph.connectionHandler.factoryMethod = function () {
        if (GraphEditor.edgeTemplate != null) {
            return graph.cloneCells([GraphEditor.edgeTemplate])[0]
        }
        return null
    };
    library.getSelectionModel().on('selectionchange', function (sm, node) {
        if (node != null && node.attributes.cells != null) {
            var cell = node.attributes.cells[0];
            if (cell != null && graph.getModel().isEdge(cell)) {
                GraphEditor.edgeTemplate = cell
            }
        }
    });
    mxGraphHandler.prototype.guidesEnabled = true; //显示细胞位置标尺 
    graph.getTooltipForCell = function (cell) {
  
        return State_Name[cell.getMyState()];
        //return 'Doubleclick and right- or shiftclick';
    }
    //    var tooltip = new Ext.ToolTip({
    //        target: graph.container,
    //        html: ''
    //    });
    //    tooltip.disabled = true;
    //    graph.tooltipHandler.show = function (tip, x, y) {
    //        if (tip != null && tip.length > 0) {
    //            if (tooltip.body != null) {
    //                 tooltip.body.dom.firstChild.nodeValue = tip
    //                //tooltip.body.dom.firstChild.nodeValue = "hh"
    //            } else {
    //                tooltip.html = tip
    //            }
    //            tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET])
    //        }
    //    };
    //    graph.tooltipHandler.hide = function () {
    //        tooltip.hide()
    //    };
    var drillHandler = function (sender) {
        var model = graph.getModel();
        var cell = graph.getCurrentRoot();
        var title = '';
        while (cell != null && model.getParent(model.getParent(cell)) != null) {
            if (graph.isValidRoot(cell)) {
                title = ' > ' + graph.convertValueToString(cell) + title
            }
            cell = graph.getModel().getParent(cell)
        }
        document.title = 'KSOA图形编辑器' + title
    };
    //    graph.getSelectionModel().removeListener(mxEvent.DOUBLE_CLICK);
    //    graph.getSelectionModel().addListener(mxEvent.DOUBLE_CLICK, showWindow);
    graph.getView().addListener(mxEvent.DOWN, drillHandler);
    graph.getView().addListener(mxEvent.UP, drillHandler);
    var undoHandler = function (sender, evt) {
        var changes = evt.getArgAt(0).changes;
        graph.setSelectionCells(graph.getSelectionCellsForChanges(changes))
    };
    history.addListener(mxEvent.UNDO, undoHandler);
    history.addListener(mxEvent.REDO, undoHandler);
    graph.container.focus();
    graph.container.style.backgroundImage = 'url(images/body_bg.jpg)';

    mxConnectionHandler.prototype.connectImage = new mxImage(
			'images/connector.gif', 16, 16);
    var img = new Image();
    img.src = mxConnectionHandler.prototype.connectImage.src;

    var keyHandler = new mxKeyHandler(graph);
    keyHandler.enter = function () {
    };
    keyHandler.bindKey(8, function () {
        graph.foldCells(true)
    });
    keyHandler.bindKey(13, function () {
        graph.foldCells(false)
    });
    keyHandler.bindKey(33, function () {
        graph.exitGroup()
    });
    keyHandler.bindKey(34, function () {
        graph.enterGroup()
    });
    keyHandler.bindKey(36, function () {
        graph.home()
    });
    keyHandler.bindKey(35, function () {
        graph.refresh()
    });
    keyHandler.bindKey(37, function () {
        graph.selectPreviousCell()
    });
    keyHandler.bindKey(38, function () {
        graph.selectParentCell()
    });
    keyHandler.bindKey(39, function () {
        graph.selectNextCell()
    });
    keyHandler.bindKey(40, function () {
        graph.selectChildCell()
    });
    keyHandler.bindKey(46, function () {
        graph.removeCells()
    });
    keyHandler.bindKey(107, function () {
        graph.zoomIn()
    });
    keyHandler.bindKey(109, function () {
        graph.zoomOut()
    });
    keyHandler.bindKey(113, function () {
        graph.startEditingAtCell()
    });
    keyHandler.bindControlKey(65, function () {
        graph.selectAll()
    });
    keyHandler.bindControlKey(89, function () {
        history.redo()
    });
    keyHandler.bindControlKey(90, function () {
        history.undo()
    });
    keyHandler.bindControlKey(88, function () {
        mxClipboard.cut(graph)
    });
    keyHandler.bindControlKey(67, function () {
        mxClipboard.copy(graph)
    });
    keyHandler.bindControlKey(86, function () {
        mxClipboard.paste(graph)
    });
    keyHandler.bindControlKey(71, function () {
        graph.setSelectionCell(graph.groupCells(null, 20))
    });
    keyHandler.bindControlKey(85, function () {
        graph.setSelectionCells(graph.ungroupCells())
    })
};
function insertSymbolTemplate(panel, graph, name, icon, rhombus) {
    var imagesNode = panel.symbols;
    var style = (rhombus) ? 'rhombusImage' : 'roundImage';
    return insertVertexTemplate(panel, graph, name, icon, style + ';image='
					+ icon, 50, 50, '', imagesNode)
};
function insertImageTemplate(panel, graph, name, icon, round) {

    var imagesNode = panel.images;
    var style = (round) ? 'roundImage' : 'image';
    return insertVertexTemplate(panel, graph, name, icon, style + ';image='
					+ icon, 50, 50, name, imagesNode)
};
function insertVertexTemplate(panel, graph, name, icon, style, width, height,
		value, parentNode) {

    var cell = null;
    if (value != null) {
        cell = editor.templates[value];
        if (cell == null) {
            cell = new mxCell(value, width, height, style);
        }
        cell.setStyle(style);
    } else {
        cell = new mxCell(new mxGeometry(0, 0, width, height), style);
    }
    var cells = [cell];
    cells[0].vertex = true;
    var funct = function (graph, evt, target) {
        cells = graph.getImportableCells(cells);
        if (cells.length > 0) {
            var validDropTarget = (target != null) ? graph.isValidDropTarget(
					target, cells, evt) : false;
            var select = null;
            if (target != null && !validDropTarget
					&& graph.getModel().getChildCount(target) == 0
					&& graph.getModel().isVertex(target) == cells[0].vertex) {
                graph.getModel().setStyle(target, style);
                select = [target]
            } else {
                if (target != null && !validDropTarget) {
                    target = null
                }
                var pt = graph.getPointForEvent(evt);
                if (graph.isSplitEnabled()
						&& graph.isSplitTarget(target, cells, evt)) {
                    graph.splitEdge(target, cells, null, pt.x, pt.y);
                    select = cells
                } else {
                    cells = graph.getImportableCells(cells);
                    if (cells.length > 0) {
                        select = graph.importCells(cells, pt.x, pt.y, target)
                    }
                }
            }
            if (select != null && select.length > 0) {
                graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select)
            }
        }
    };
    var node = panel.addTemplate(name, icon, parentNode, cells);
    var installDrag = function (expandedNode) {
        if (node.ui.elNode != null) {
            var dragPreview = document.createElement('div');
            dragPreview.style.border = 'dashed black 1px';
            dragPreview.style.width = width + 'px';
            dragPreview.style.height = height + 'px';
            mxUtils.makeDraggable(node.ui.elNode, graph, funct, dragPreview, 0,
					0, graph.autoscroll, true)
        }
    };
    if (!node.parentNode.isExpanded()) {
        panel.on('expandnode', installDrag)
    } else {
        installDrag(node.parentNode)
    }
    return node
};
function insertEdgeTemplate(panel, graph, name, icon, style, width, height,
		value, parentNode) {
    /*
    * var cell=null; if(value!=null){ cell=editor.templates[value];
    * if(cell==null){ cell=new mxCell(value,width,height,style); }
    * cell.setStyle(style); }else{ cell=new mxCell(new mxGeometry(0, 0,width,
    * height), style); } var cells=[cell];
    */
    var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0,
					width, height), style)];
    cells[0].geometry.setTerminalPoint(new mxPoint(0, height), true);
    cells[0].geometry.setTerminalPoint(new mxPoint(width, 0), false);
    cells[0].edge = true;
    var funct = function (graph, evt, target) {
        cells = graph.getImportableCells(cells);
        if (cells.length > 0) {
            var validDropTarget = (target != null) ? graph.isValidDropTarget(
					target, cells, evt) : false;
            var select = null;
            if (target != null && !validDropTarget) {
                target = null
            }
            var pt = graph.getPointForEvent(evt);
            var scale = graph.view.scale;
            pt.x -= graph.snap(width / 2);
            pt.y -= graph.snap(height / 2);
            select = graph.importCells(cells, pt.x, pt.y, target);
            GraphEditor.edgeTemplate = select[0];
            graph.scrollCellToVisible(select[0]);
            graph.setSelectionCells(select)
        }
    };
    var node = panel.addTemplate(name, icon, parentNode, cells);
    var installDrag = function (expandedNode) {
        if (node.ui.elNode != null) {
            var dragPreview = document.createElement('div');
            dragPreview.style.border = 'dashed black 1px';
            dragPreview.style.width = width + 'px';
            dragPreview.style.height = height + 'px';
            mxUtils.makeDraggable(node.ui.elNode, graph, funct, dragPreview,
					-width / 2, -height / 2, graph.autoscroll, true)
        }
    };
    if (!node.parentNode.isExpanded()) {
        panel.on('expandnode', installDrag)
    } else {
        installDrag(node.parentNode)
    }
    return node
};
Ext.example = function () {
    var msgCt;
    function createBox(t, s) {
        return [
				'<div class="msg">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('')
    }
    return {
        msg: function (title, format) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.append(document.body, {
                    id: 'msg-div'
                }, true)
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(
							arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {
                html: createBox(title, s)
            }, true);
            m.slideIn('t').pause(1).ghost("t", {
                remove: true
            })
        }
    }
} ();
mxUtils.alert = function (message) {
    Ext.example.msg(message, '', '')
};



