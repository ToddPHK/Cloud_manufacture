
var Btn_RefreashTaskState = new Ext.Button({
    text: "更新任务状态",
    disabled: false,
    listeners: {
        "click": RefreshTaskState
    }
})
var Btn_SearchService = new Ext.Button({
    text: "查找服务",
    disabled: true,
    listeners: {
        "click": SearchService
    }
})
var Btn_ViewService = new Ext.Button({
    text: "查看服务",
    disabled: true,
    listeners: {
        "click": function () {

            if (taskTablePanel_sm.hasSelection()) {//rows为""说明没有选择任务
                var TaskID, taskState;
                var rec = taskTablePanel.getSelectionModel().getSelected();
                TaskID = rec.get("TaskID");
                taskState = rec.get("TaskState");
                window.open("../../../../CloudMfg_SRMS/ServiceView.aspx?TaskID=" + TaskID);
                //  TaskServeChoose_Window.show();
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "请选择一个任务！");
            }
        }
    }
})
var Btn_ApplyPublish = new Ext.Button({
    text: "申请发布",
    disabled: true,
    listeners: {
        "click": ApplyPublish
    }
})
/*var Btn_ConfirmServiceChosed = new Ext.Button({
    text: "服务选择完成",
    disabled: true,
    listeners: {
        "click": ConfirmServiceChosed
    }
})
function ConfirmServiceChosed() {

    SubmitOrder("ConfirmServiceChosed");

}*/
var Btn_ApplyBuyService = new Ext.Button({
    text: "服务购买完成",
    disabled: true,
    listeners: {
        "click": BuyServiceComplete
    }
})
var Btn_TaskCreateFinish = new Ext.Button({
    text: "任务创建完成",
    disabled: true,
    listeners: {
        "click": TaskCreateFinish
    }
})
//var Btn_ApplyService = new Ext.Button({
//    text: "申请服务",
//    disabled: true,
//    listeners: {
//        "click": ApplyService
//    }
//})
var Btn_MatchAgain = new Ext.Button({
    text: "再次匹配",
    disabled: true,
    listeners: {
        "click": MatchAgain
    }
})
var Btn_StartDeal = new Ext.Button({
    text: "开始交易",
    disabled: true,
    listeners: {
        "click": StartDeal
    }
})
var Btn_LocalTask = new Ext.Button({
    text: "标记本地任务",
    disabled: true,
    listeners: {
        "click": Tag_LocalTask
    }
})
//var Btn_CompleteDeal = new Ext.Button({
//    text: "交易完成",
//    disabled: true,
//    listeners: {
//        "click": CompleteDeal
//    }
//})
var Btn_ExecuteTask = new Ext.Button({
    text: "任务执行",
    disabled: true,
    listeners: {
        "click": ExecuteTask
    }
})
var Btn_FinishTask = new Ext.Button({
    text: "任务完成",
    disabled: true,
    listeners: {
        "click": FinishTask
    }
})
var Btn_OutSource = new Ext.Button({
    text: "标记外协任务",
    disabled: true,
    listeners: {
        "click": Tag_OutSource
    }
})
var Btn_SuspendTask = new Ext.Button({
    text: "挂起任务",
    disabled: true,
    listeners: {
        "click": SuspendTask
    }
})
var Btn_UnsuspendTask = new Ext.Button({
    text: "解除挂起",
    disabled: true,
    listeners: {
        "click": UnsuspendTask
    }
})
var Btn_AgreePublish = new Ext.Button({
    text: "同意发布",
    disabled: true,
    listeners: {
        "click": AgreePublish
    }
})
var Btn_NoAgreePublish = new Ext.Button({
    text: "拒绝发布",
    disabled: true,
    listeners: {
        "click": NoAgreePublish
    }
})
var Btn_AgreeBuy = new Ext.Button({
    text: "同意购买",
    disabled: true,
    listeners: {
        "click": AgreeBuy
    }
})
var Btn_ServiceAudit = new Ext.Button({
    text: "服务审核",
    disabled: true,
    listeners: {
        "click": ServiceAudit
    }
})
var Btn_NoAgreeBuy = new Ext.Button({
    text: "拒绝购买",
    disabled: true,
    listeners: {
        "click": NoAgreeBuy
    }
})
var Btn_ReleaseBinding = new Ext.Button({
    text: "解除绑定",
    disabled: true,
    listeners: {
        "click": ReleaseBinding
    }
})
var Btn_AutoFindS = new Ext.Button({
    text: "自动匹配",
    disabled: true,
    listeners: {
        "click": AutoFindS
    }
})
var Btn_ErrorEnd = new Ext.Button({
    text: "异常终止",
    disabled: true,
    listeners: {
        "click": ErrorEnd
    }
})
var Btn_ViewTaskProgress = new Ext.Button({
    text: "查看任务进度",
    disabled: true,
    listeners: {
        "click": ViewTaskProgress
    }
})
var ViewTaskProgress_Win = new Ext.Window({
    collapsible: false,
//    maximizable: false,
//    resizable: false,
    layout: 'border',
    width: 400,
    height: 250, //15+ -
    modal: false,
    border: false,
    closeAction: "hide",
    plain: true,
    title: '任务进度',
    buttonAlign: 'center',
    items: [{
        id: 'preview',
        region: 'center',
        height: 250,
        // title: '话题回复',
        split: true,
        autoScroll: true,
        bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
    }]
});
var TopicReply_Template = new Ext.XTemplate(
		 '<tpl for="ReplyData">',
'<p>{#}---------------{Time}---------------</p>',
'<p>进度：<br/>   {Description}</p>',
		 '</tpl>'
);
function ViewTaskProgress() {
    if (taskTablePanel_sm.hasSelection()) {
        var tempRec = taskTablePanel_sm.getSelected();
        var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
        conn1.open("POST", "DataProcess.aspx?OperateType=ViewTaskProgress&TaskID=" + tempRec.get('TaskID'), false);
        conn1.send(null);
        // alert(conn1.responseText);
        ViewTaskProgress_Win.show();
        var responseText = conn1.responseText;
        if (responseText != "") {
            var TaskProgressData = Ext.util.JSON.decode(responseText);
            var detailPanel = Ext.getCmp('preview');

            TopicReply_Template.overwrite(detailPanel.body, TaskProgressData);
        }
        else {
            Ext.getCmp('preview').body.update('<b><u>' + tempRec.get('PrjTaskTreeName') + '</u>  无进度或当前进度无法查看</b>');
        }
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "还未选择任务！");
    }
}
//var Btn_ViewService = new Ext.Button({
//    text: "查看服务",
//    disabled: true,
//    listeners: {
//        "click": ViewService
//    }
//})
function RefreshTaskState() {
    if (taskTablePanel_sm.hasSelection()) {

        var rec = taskTablePanel.getSelectionModel().getSelected();
        var jsonData = { OperateType: "RefreshTaskStateFServer", TaskID: rec.get("TaskID"), TaskState: rec.get("TaskState") };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }
    else {
        var jsonData = { OperateType: "RefreshTaskStateFServer" };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.reload();
    }


}
function TaskCreateFinish() {
    SubmitOrder("TaskCreateFinish");
}
//查找服务
function SearchService() {
    var TaskID, taskState;
    var rec = taskTablePanel.getSelectionModel().getSelected();
    if (taskTablePanel_sm.hasSelection()) {//rows为""说明没有选择任务
        TaskID = rec.get("TaskID");
        taskState = rec.get("TaskState");
        window.open("../../../../CloudMfg_SRMS/ServiceSearch.aspx?TaskID=" + TaskID);
        //  TaskServeChoose_Window.show();
    }
    else {
        App.setAlert(App.STATUS_NOTICE, "请选择一个要进行服务匹配的任务！");
    }

}
//申请发布
function ApplyPublish() {

    SubmitOrder("ApplyPublish");

}

//服务购买完成
function BuyServiceComplete() {

    SubmitOrder("BuyServiceComplete");
}
function ApplyService() {
    SubmitOrder("ApplyService");
}
//如果已经匹配的服务拒绝为其提供服务，是否再次经行匹配
function MatchAgain() {
    SubmitOrder("MatchAgain");
}
function StartDeal() {
    SubmitOrder("StartDeal");
}
function Tag_LocalTask() {
    SubmitOrder("Tag_LocalTask");
}
//function CompleteDeal() {
//    SubmitOrder("CompleteDeal");
//}
function ExecuteTask() {
    SubmitOrder("ExecuteTask");
}
function FinishTask() {
    SubmitOrder("FinishTask");
}
function Tag_OutSource() {
    SubmitOrder("Tag_OutSource");
}
function SuspendTask() {
    SubmitOrder("SuspendTask");
}
function UnsuspendTask() {
    SubmitOrder("UnsuspendTask");
}
function AgreePublish() {

    SubmitOrder("AgreePublish");

}
function NoAgreePublish() {

    SubmitOrder("NoAgreePublish");

}
function AgreeBuy() {

    SubmitOrder("AgreeBuy");

}
function NoAgreeBuy() {
    SubmitOrder("NoAgreeBuy");

}
function ReleaseBinding() {
    SubmitOrder("ReleaseBinding");

}
function ServiceAudit() {
    Task_ServiceWin.show();

}
function AutoFindS() {
    SubmitOrder("AutoFindS"); 

}
function ViewService() {
    alert("查看服务");

}
function ErrorEnd() {

    SubmitOrder("ErrorEnd");

}
function SubmitOrder(OperateType) {
    if (taskTablePanel_sm.hasSelection())//没有选择任务
    {
        var rec = taskTablePanel_sm.getSelected();
        var jsonData = { OperateType: OperateType, TaskID: rec.get("TaskID") };
        TaskTreeOperaMethod('TaskSubmitManage.aspx', jsonData);
        taskStore.load({ params: { start: 0, limit: taskPageSize} });
    }
    else {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择任务！");
    }
}
var TaskOperation_Panel = new Ext.Panel({
    region: 'center',
    border: false,
    tbar: [{
        xtype: 'buttongroup',
        columns: 4,
        items: [Btn_RefreashTaskState,
         Btn_SearchService,
         Btn_ViewService,
         Btn_ApplyPublish,
        // Btn_ConfirmServiceChosed,
         Btn_ApplyBuyService,
         Btn_TaskCreateFinish,
        //  Btn_ApplyService,
        // Btn_MatchAgain,
         Btn_StartDeal,
         Btn_LocalTask,
        // Btn_CompleteDeal,
         Btn_ExecuteTask,
         Btn_FinishTask,
         Btn_OutSource,
         Btn_SuspendTask,
         Btn_UnsuspendTask,
        // Btn_ServiceAudit,
         Btn_AgreePublish,
         Btn_NoAgreePublish,
//         Btn_AgreeBuy,
//         Btn_NoAgreeBuy,
         Btn_ReleaseBinding,
         Btn_AutoFindS,
         Btn_ErrorEnd,
         Btn_ViewTaskProgress
                  ]
    }]
});
var TaskOperationWin = new Ext.Window({
    collapsible: false,
    maximizable: false,
    resizable: false,
    layout: 'border',
    width: 360,
    height: 165, //15+ -
    modal: false,
    border: false,
    closeAction: "hide",
    plain: true,
    title: '任务操作板',
    buttonAlign: 'center',
    items: [TaskOperation_Panel]
});
TaskOperationWin.on("hide", function () {
    Ext.getCmp('Task_Operate').toggle(false);
})
function SetOptBtnState(rec) {

    var tbtns = TaskOperation_Panel.getTopToolbar().findByType('button');
    for (i = 0; i < tbtns.length; i++) {
        tbtns[i].disable();
    }
    if (rec.get("TaskCreator") == CurrentUserID) {
        Btn_RefreashTaskState.enable();

    }
    var state = rec.get("TaskState");
    var TaskTypeID = rec.get("TypeID");

    if (TaskTypeID == -1) {
        if (rec.get("TaskCreator") == CurrentUserID) {
            if (state == 19) {//状态——创建完成
                var WorkFlowID = rec.get("WorkFlowID");
                if (WorkFlowID != -1) {
                    Btn_ReleaseBinding.enable();
                }
            }
            Btn_LocalTask.enable();
            Btn_OutSource.enable();
        }
    }
    else if (TaskTypeID == 2) {

        if (state > 0) {//状态——初始
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_SuspendTask.enable();
            }
        }
        else if (state < 0) {
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_UnsuspendTask.enable();
            }
        }
        if (state == 0) {//状态——初始
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_TaskCreateFinish.enable();
            }
        }
        else if (state == 19) {//状态——创建完成
            if (rec.get("TaskCreator") == CurrentUserID) {
                WorkFlowID = rec.get("WorkFlowID");
                if (WorkFlowID != -1) {
                    Btn_ReleaseBinding.enable();
                }
                Btn_ApplyPublish.enable();
            }
            //    Btn_ConfirmServiceChosed.enable();
            //    Btn_SearchService.enable();
        }

        else if (state == 18) {//状态——服务选择中，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ApplyBuyService.enable();
                Btn_SearchService.enable();
              //  Btn_ApplyBuyService.enable();
                Btn_ViewService.enable();
            }

        }
        else if (state == 4) {//状态——通过审核，
            if (rec.get("TaskCreator") == CurrentUserID) {
                //Btn_ConfirmServiceChosed.enable();
                Btn_SearchService.enable();
                Btn_AutoFindS.enable();
            }
        }
        else if (state == 6) {//状态——申请购买服务，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
                Btn_ViewService.enable();
            }
        }
        else if (state == 8) {//状态——匹配中，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
            }
        }
//        else if (state == 9) {//状态——完成匹配
//            if (rec.get("TaskCreator") == CurrentUserID) {
//                Btn_ViewService.enable();
//                Btn_ConfirmServiceChosed.enable();
//                Btn_MatchAgain.enable();
//            }
//        }
        else if (state == 10) {//状态——服务申请中
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
 Btn_SearchService.enable();
            }
        }
        else if (state == 11) {//状态——服务拒绝，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_MatchAgain.enable();
                Btn_ViewService.enable();
            }
        }
        else if (state == 12) {//状态——服务接受，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
                Btn_StartDeal.enable();
            }
        }
        else if (state == 13) {//状态——交易进行中，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
                // Btn_CompleteDeal.enable();
            }
        }
        else if (state == 14) {//状态——交易完成，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
                Btn_ExecuteTask.enable();
            }
        }
        else if (state == 15) {//状态——任务执行中，
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ErrorEnd.enable();
                Btn_ViewService.enable();
                Btn_FinishTask.enable();
                Btn_ViewTaskProgress.setText("查看任务进度");
                Btn_ViewTaskProgress.enable();
            }
        }
        else if (state == 16) {//状态——任务执行完成
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_RefreashTaskState.disable();
                Btn_ViewService.enable();
                Btn_SuspendTask.disable();
                Btn_ViewTaskProgress.setText("查看进度历史");
                Btn_ViewTaskProgress.enable();
            }
        }
        else if (state == 21) {//状态——向项目负责人申请发布，

            if (rec.get("ProjectChargorID") == CurrentUserID) {
                Btn_ServiceAudit.enable();
                Btn_AgreePublish.enable();
                Btn_NoAgreePublish.enable();
            }
        }
        else if (state == 22) {//状态——向项目负责人请购买服务，
            if (rec.get("ProjectChargorID") == CurrentUserID) {
                Btn_ServiceAudit.enable();
                Btn_SearchService.enable();
                Btn_ViewService.enable();
                Btn_AgreeBuy.enable();
                Btn_NoAgreeBuy.enable();
            }
        }
                else if (state == 23) {//状态——项目负责人发布拒绝
                    if (rec.get("TaskCreator") == CurrentUserID) {
                        Btn_ViewService.enable();
                        Btn_MatchAgain.enable();
                   }
                }
        else if (state == 24) {//状态——项目负责人购买拒绝
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_ViewService.enable();
                Btn_MatchAgain.enable();
            }
        }

    }
    else if (TaskTypeID == 1) {//本地任务
        if (state > 0) {//状态——初始
            if (state != 16) {//状态——初始
                if (rec.get("TaskCreator") == CurrentUserID) {
                    Btn_SuspendTask.enable();
                }
            }

            if (WorkFlowID != -1) {
                if (rec.get("TaskCreator") == CurrentUserID) {
                    Btn_ReleaseBinding.enable();
                    if (state == 0) {//状态——初始
                        Btn_TaskCreateFinish.enable();
                    }
                    else if (state == 19) {//状态——创建完成
                        Btn_ExecuteTask.enable();
                    }
                    else if (state == 15) {//状态——任务执行中
                        Btn_FinishTask.enable();
                    }
                }

            }
        }
        else if (state < 0) {
            if (rec.get("TaskCreator") == CurrentUserID) {
                Btn_UnsuspendTask.enable();
            }
        }
        var WorkFlowID = rec.get("WorkFlowID");



    }
    else {
        App.setAlert(App.STATUS_NOTICE, "系统出错，请刷新或重新登录后再试！");
    }

}