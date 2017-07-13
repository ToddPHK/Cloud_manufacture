
var button2 = new Ext.Button({
    text: "查找服务",
    listeners: {
        "click": function () {
            if (NodeWindow.WorkFlowState != 11)
                App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
            else {
                var cell = graph.getSelectionCell();

                if (cell != null) {
                    var TaskID = cell.getTaskID();

                        window.open("../../../../CloudMfg_SRMS/ServiceSearch.aspx?TaskID=" + TaskID);
                        //  TaskServeChoose_Window.show();
      

                }
                else
                    App.setAlert(App.STATUS_NOTICE, "请选择一个节点！");
            }
        }
    }
})

var BindingTaskBtn= new Ext.Button({
    text: "绑定任务",
    listeners: {
        "click": function () {
            if (NodeWindow.WorkFlowState != 1)
                App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
            else {
                var cell = graph.getSelectionCell();

                if (cell != null) {
                    BindingTask(cell);
                }
                else
                    App.setAlert(App.STATUS_NOTICE, "请选择一个节点！");
            }
        }
    }
})
var monitorbtn1 = new Ext.Button({
    text: "刷新状态",
    listeners: {
        "click": function () {
            if (NodeWindow.CurrentWorkFlowID < 0) {
                App.setAlert(App.STATUS_NOTICE, "请首先加载一个流程！");
                return;

            }
            var cells_monitor = [];
            var TaskIDs_monitor = [];
            graph.selectVertices();
            var cells = graph.getSelectionCells();
            graph.clearSelection();
            for (i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (cell.value.tagName == 'Rect' && cell.getTaskID() != null) {
                    cells_monitor.push(cell);
                    TaskIDs_monitor.push(cell.getTaskID());
                }
            }
            cells.splice();
            delete cell;

            //------------------------------------------------------
            var Task_Stateconn = Ext.lib.Ajax.getConnectionObject().conn;
            Task_Stateconn.open("POST", "DataProcess.aspx?OperateType=Task_State&TaskIDs=" + TaskIDs_monitor.join(), false);
            Task_Stateconn.send(null);
            var temp_Task_State = Task_Stateconn.responseText;
            var Task_State = Ext.util.JSON.decode(temp_Task_State);
            for (i = 0; i < cells_monitor.length; i++) {
                cells_monitor[i].setMyState(Task_State[cells_monitor[i].getTaskID()]);
                graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, State_Color[Task_State[cells_monitor[i].getTaskID()]], graph.setSelectionCell(cells_monitor[i]));
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, State_Color[Task_State[cells_monitor[i].getTaskID()]], graph.setSelectionCell(cells_monitor[i]));

            }
            graph.clearSelection();

            //------------------------------------
        }
    }
})
var end_monitor_flag = false;
var monitorbtn2 = new Ext.Button({
    text: "开始监视",
    listeners: {
        "click": function (btn) {
            if (NodeWindow.CurrentWorkFlowID < 0) {
                App.setAlert(App.STATUS_NOTICE, "请首先加载一个流程！");
                return;

            }
            if (btn.text == "开始监视") {
                btn.setText("结束监视");
                end_monitor_flag = false;
            }
            else {
                btn.setText("开始监视");
                end_monitor_flag = true;
            }
            if (!end_monitor_flag) {
                var cells_monitor = [];
                var TaskIDs_monitor = [];
                graph.selectVertices();
                var cells = graph.getSelectionCells();
                graph.clearSelection();
                for (i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (cell.value.tagName == 'Rect' && cell.getTaskID() != null) {
                        cells_monitor.push(cell);
                        TaskIDs_monitor.push(cell.getTaskID());
                    }
                }

                var IntervalID = setInterval(function () {

                    //-------------------------------------------------------------------------------

                    if (cells_monitor.length < 1) {
                        clearInterval(IntervalID);
                        var enc = new mxCodec(mxUtils.createXmlDocument());
                        var node = enc.encode(graph.getModel());
                        var val = escape(mxUtils.getPrettyXml(node));
                        App.setAlert(App.STATUS_NOTICE, '任务已全部执行完成！');
                        btn.setText("开始监视");
                        var jsonData = { OperateType: 'updateWorkFlowContent', workflowID: NodeWindow.CurrentWorkFlowID, workflowcontent: val };
                        CodeOperaMethod('workFlowHandler.ashx', jsonData);
                        var jsonData = { OperateType: 'WorkFlowFinish', workflowID: NodeWindow.CurrentWorkFlowID, workflowcontent: val, State: NodeWindow.WorkFlowState };
                        CodeOperaMethod('workFlowHandler.ashx', jsonData);
                    }
                    else {
                        var Task_Stateconn = Ext.lib.Ajax.getConnectionObject().conn;
                        Task_Stateconn.open("POST", "DataProcess.aspx?OperateType=Task_State&TaskIDs=" + TaskIDs_monitor.join(), false);
                        Task_Stateconn.send(null);
                        var temp_Task_State = Task_Stateconn.responseText;
                        var Task_State = Ext.util.JSON.decode(temp_Task_State);
                        for (i = 0; i < cells_monitor.length; i++) {
                            var cell_monitor = cells_monitor[i];
                            cell_monitor.setMyState(Task_State[cell_monitor.getTaskID()]);
                            graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, State_Color[Task_State[cell_monitor.getTaskID()]], graph.setSelectionCell(cell_monitor));
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, State_Color[Task_State[cell_monitor.getTaskID()]], graph.setSelectionCell(cell_monitor));
                            //如果cell绑定的任务的状态是“任务执行完成”状态，则把该cell从cells_monitor中移除，并且把cell绑定的任务ID从TaskIDs_monitor中移除
                            if (Task_State[cell_monitor.getTaskID()] == 16) {
                                cells_monitor.remove(i);
                                TaskIDs_monitor.remove(TaskIDs_monitor.indexOf(cell_monitor.getTaskID()));
                            }
                        }
                        if (end_monitor_flag) {
                            clearInterval(IntervalID);
                            var enc = new mxCodec(mxUtils.createXmlDocument());
                            var node = enc.encode(graph.getModel());
                            var val = escape(mxUtils.getPrettyXml(node));
                            var jsonData = { OperateType: 'updateWorkFlowContent', workflowID: NodeWindow.CurrentWorkFlowID, workflowcontent: val };
                            CodeOperaMethod('workFlowHandler.ashx', jsonData);
                        }
                    }
                    //----------------------------------------------------------------------------------  

                }, 1000)
            }

        }
    }
})
var Btn_SendShortMsg = new Ext.Button({
    text: "发送短信息",
    listeners: {
        "click": SendShortMsg
    }
})
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
                if (NodeWindow.WorkFlowState == 0 || NodeWindow.WorkFlowState == 1)
                    App.setAlert(App.STATUS_NOTICE, "该流程的当前状态不能进行此项操作！");
                else {
                    var cells = graph.getSelectionCells();
                    //var cell = graph.getSelectionCell();
                    if (cells.length > 0) {
                        //                        var TaskID = cell.getTaskID();
                        var loadMarsk = new Ext.LoadMask('attribute', {
                            msg: '信息发送中......',
                            removeMask: true// 完成后移除
                        });
                        loadMarsk.show(); //显示
                        var TaskIDs = [];
                        for (var i = 0; i < cells.length; i++) {
                            TaskIDs.push(cells[i].getTaskID());
                        }
//                        alert(TaskIDs.join());
                        var jsonData = { OperateType: "SendShortMsg", TaskIDs: TaskIDs.join(), Message: text };
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
                        App.setAlert(App.STATUS_NOTICE, "还未选择任务节点！");
                    }
                }
            }

            //-----------------------------
        }
    });

}
var ManageButtonPanel = new Ext.Panel({
    layout: "table",
    //    width: '.100',
    //    height: ' .100',
    frame: false,
    layoutConfig: {
        columns: 3
    },
    bodyStyle: 'padding:20px',
    items: [

                { items: button2, bodyStyle: 'padding:20px', frame: false },
                 { items: Btn_SendShortMsg, bodyStyle: 'padding:20px', frame: false },
                { items: monitorbtn1, bodyStyle: 'padding:20px', frame: false },
                { items: monitorbtn2, bodyStyle: 'padding:20px', frame: false},
                { items: BindingTaskBtn, bodyStyle: 'padding:20px', frame: false}]
});

/*mxCell.prototype.getTask = function () {
return this.task;
};
mxCell.prototype.setTask = function (task) {
this.task = task;
};
mxCell.prototype.getTaskID = function () {
return this.taskID;
};
mxCell.prototype.setTaskID = function (taskID) {
this.taskID = taskID;
};
mxCell.prototype.getMyState = function () {
return this.mystate;
};
mxCell.prototype.setMyState = function (mystate) {
this.mystate = mystate;
};*/