
var WorkFlowPreviewWin;


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

    this.graphPanel = new Ext.Panel({
        region: 'center',
        border: false,
        tbar: [{
            id: 'view',
            text: '',
            iconCls: 'preview-icon',
            tooltip: '预览',
            handler: function () {
                mxUtils.show(graph)
            },
            scope: this
        }],
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

function main() {
    Ext.Component.prototype.stateful = false
    Ext.BLANK_IMAGE_URL = '../../ext-3.2.0/resources/images/default/s.gif';
    editor = new mxApplication('config/diagrameditor.xml');
    Ext.QuickTips.init();
    mxEvent.disableContextMenu(document.body);
    mxConstants.DEFAULT_HOTSPOT = 0.3;
    graph = editor.graph;
    graph.setCellsLocked(true);
    graph.setConnectable(false);
    graph.setCellsDeletable(false);
    graph.guidesEnabled = true;
    var history = new mxUndoManager();
    var node = mxUtils.load('resources/default-style.xml').getDocumentElement();
    var dec = new mxCodec(node.ownerDocument);
    dec.decode(node, graph.getStylesheet());
    graph.alternateEdgeStyle = 'vertical';



    var mainPanel = new MainPanel(graph, history);

    var viewport = new Ext.Window({
        title: '加载工作流',
        // modal: true,
        width: 600,
        height: 370,
        minWidth: 300,
        minHeight: 100,
        loadMask: true,
        layout: 'border',
        closeAction: 'hide',
        plain: true,
        bodyStyle: 'padding:5px;',
        buttonAlign: 'center',
                items: [{
            xtype: 'panel',
            margins: '5 5 5 5',
            region: 'center',
            layout: 'border',
            border: false,
            items: [ mainPanel]//, propertyPanel
        }]

    });
    WorkFlowPreviewWin = viewport;
    WorkFlowPreviewWin.show();
    WorkFlowPreviewWin.hide();
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
    var listener = function (sender, evt) {
        history.undoableEditHappened(evt.getArgAt(0))
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
    var toolbarItems = mainPanel.graphPanel.getTopToolbar().items;
   // var bbarItems = mainPanel.graphPanel.getBottomToolbar().items;
    //--------监听mxcell的选择时间并执行相应的函数-----------------------------------------
    var selectionListener = function () {

        var selected = !graph.isSelectionEmpty();
    };
    //------------------------双击节点调试--------------------------------
    graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {

    });



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
  //  graph.container.focus();
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



