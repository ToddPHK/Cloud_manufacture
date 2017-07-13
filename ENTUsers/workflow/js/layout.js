var graph, OperateType;
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



    //-------------------上部工具栏-------------------

    var bbar = new Ext.Toolbar({
        items: [ '->', {
            text: '大小',
            iconCls: 'zoom-icon',
            handler: function (menu) {
            },
            menu: {
                items: [{
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
        }]
    });

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
        }, '-',  {
            id: 'refresh',
            text: '',
            iconCls: 'refresh-icon',
            tooltip: '刷新',
            handler: function () {
                graph.refresh();
            },
            scope: this
        },  '-', {
            id: 'loadwokflow',
            text: '',
            tooltip: '加载工作流',
            iconCls: 'load-icon',
            handler: function () {
                LoadNewWorkFlow();


            }
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


var NodeStateStore = new Ext.data.SimpleStore({

    url: '../PDM/ComboxData.aspx',
    autoLoad: { params: { OperateType: 'TaskState'} },
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
        fieldLabel: '绑定的任务',
        name: 'NodeName',
        anchor: '90%'  // anchor width by percentage
    }, NodeStateListCombo],
    buttons: [monitorbtn1,monitorbtn2]
});

var MessageSendForm = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    labelWidth: 60,
    //  fileUpload: true,
    bodyStyle: 'padding:8px 0 0 0;',
    frame: true,
    buttonAlign: 'center',
    labelAlign: "right",
    defaultType: 'textfield',
    buttons: [{
        text: '发送',
        handler: function () { alert('使用短信模块发送消息！'); }

    }],
    items: [{
        xtype: 'textarea',
        fieldLabel: '信息',
        name: 'Message',
        height: 120,
        anchor: '90%'  // anchor width by percentage
    }]
});



var myPropsTabs = new Ext.TabPanel({
    baseCls: 'x-plain',
    activeTab: 0,
    enableTabScroll: true,
    items: [
          { title: '常规', baseCls: 'x-plain', items: NodeForm },
        //  { title: '常用操作', baseCls: 'x-plain', items: ManageButtonPanel },
           { title: '信息发送', baseCls: 'x-plain', items: MessageSendForm }
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
NodeWindow.CurrentWorkFlowID=-1;
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

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            xtype: 'panel',
            margins: '5 5 5 5',
            region: 'center',
            layout: 'border',
            border: false,
            items: [ mainPanel]//, propertyPanel
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


    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);
    selectionListener();
   
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




