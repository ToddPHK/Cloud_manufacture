
var WorkFlowName_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var WorkFlowEnt_Search = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 80
});
var WorkFlowTasktbar = new Ext.Toolbar({
    items: [{
        text: '',
        iconCls: 'preview-icon',
        tooltip: '预览',
        handler: function () {
            if (ProcessTaskGrid.getSelectionModel().hasSelection()) {
                rec = ProcessTaskGrid.getSelectionModel().getSelected();
                WorkFlowPreviewWin.setTitle("流程-" + rec.get("WorkFlowName"));
                LoadWorkFlow(rec.get("WorkFlow"));
            }
            else
                Ext.Msg.alert("提示", "还未选择流程");

        }
    }, '-', {
        text: "删除",
        iconCls: 'delete-icon',
        handler: function () {
            OperateType = 'DeleteWorkFlow';

            if (WorkFlowTaskablePanel_sm.hasSelection()) {
                Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', WorkFlowDelete);
               

            }
            else {
                App.setAlert(App.STATUS_NOTICE, "请至少选择一行你要删除的数据！");
            }


        }

    }, '->', "流程所属企业:", WorkFlowEnt_Search, ' 流程名:', WorkFlowName_Search, {
        id: 'taskbtnSearch',
        text: "搜索",
        iconCls: 'search-icon',
        handler: WorkFlowTaskDataSearch
    }]

});

function WorkFlowTaskDataSearch() {
    WorkFlowTaskStore.removeAll();
    WorkFlowTaskStore.baseParams.WorkFlowName = WorkFlowName_Search.getValue();
    WorkFlowTaskStore.baseParams.WorkFlowEnt = WorkFlowEnt_Search.getValue();
    WorkFlowTaskStore.baseParams.OperateType = "search";
    WorkFlowTaskStore.reload();
    WorkFlowTaskPageBar.changePage(1);
}
function WorkFlowDelete(btn) {
    if (btn == 'yes') {
        var WorkFlowID = [];
        var rows = WorkFlowTaskablePanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {

            WorkFlowID.push(rows[i].get("ID"));

        }
        var jsonData = { OperateType: OperateType, WorkFlowID: WorkFlowID.join() };
        CodeOperaMethod('TaskSubmitManage.aspx', jsonData);
        WorkFlowTaskStore.reload();
    }
}
var WorkFlowTaskProxy = new Ext.data.HttpProxy({
    url: 'WFTableData.aspx'
});

var WorkFlowTask_Reader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "UserWorkFlowID" },
                        { name: "WorkFlow" },
                        { name: "Publisher" },
                        { name: "PublishTime" },
                        { name: "WDeleteTime" },
                        { name: "WFState" },
                        { name: "WorkFlowName" },
                        { name: "WFTaskInfo" },
                        { name: "StateName" },
                        { name: "PublisherName" }
                        ]
                    );

var WorkFlowTaskStore = new Ext.data.Store(
                        { proxy: WorkFlowTaskProxy, reader: WorkFlowTask_Reader }
                    );

var WorkFlowTaskExpander = new Ext.grid.RowExpander({
    tpl: new Ext.XTemplate(
        '<div class="detailData">',
        '',
        '</div>'
        )
});

WorkFlowTaskExpander.on("expand", function (expander, r, body, rowIndex) {
    //查找 grid 
    window.testEle = body;
    //alert(body.id);
    if (Ext.DomQuery.select("div.x-panel-bwrap", body).length == 0) {
        //var data = r.json.WFTaskInfo;decodeURI   unescape   decodeURIComponent
        var data = Ext.util.JSON.decode(decodeURIComponent(r.json.WFTaskInfo));
        store1 = new Ext.data.SimpleStore({
            fields: ["ID","TaskDetailInf", "TaskStateName", "StandardTaskName", "TaskName"],
            data: data
        });


        var InnerTaskDicWordtpl = new Ext.Template(
         '<br>',
            '<p><b>详细信息:</b> {TaskDetailInf:this.ShowDes()}</p>'
        );

        InnerTaskDicWordtpl.ShowDes = function (Description) {

            var TaskDicWordJson = Ext.util.JSON.decode(responseText); //responseText  见 Panel.js
            var xmlDoc;
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(Description, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(Description);
            }
            var s = "";
            var nodes = xmlDoc.firstChild.childNodes;
            var k;
            for (i = 0; i < nodes.length; i++) {
                s += "<b>[" + (TaskDicWordJson[nodes[i].nodeName] == undefined ? "未知属性" : TaskDicWordJson[nodes[i].nodeName]) + "]:</b>" + nodes[i].text + ",";
            }
            return s.substr(0, s.length - 1);
        }
        var InnerTaskDicWordexpander = new Ext.ux.grid.RowExpander({
            tpl: InnerTaskDicWordtpl
        });
        Ext.DomQuery.select("div.detailData")[0];
        var grid1 = new Ext.grid.GridPanel({
            store: store1,
            viewConfig: { autoFill: true, forceFit: true },
            renderTo: Ext.DomQuery.select("div.detailData", body)[0],
            autoWidth: true,
            columns: [InnerTaskDicWordexpander,
                 { header: "任务名", dataIndex: 'TaskName', width: 130, sortable: true },
                { header: "标准任务类", dataIndex: 'StandardTaskName', width: 130, sortable: true },
                { header: "任务状态", dataIndex: 'TaskStateName', width: 130, sortable: true }
            ],
            plugins: [InnerTaskDicWordexpander],
            autoHeight: true
        });

        grid1.on({
            'mouseover': function (e) {
                e.stopPropagation();
            },
            'mouseout': function (e) {
                e.stopPropagation();
            }
        });

        grid1.afterMethod("processEvent", function (n, e) {
            e.stopPropagation();
        });

        grid1.on('rowcontextmenu', function (grid, rowIndex, e) {
            menu = new Ext.menu.Menu([{
                text: "展开",

                handler: function () {
                    var rec = grid.getStore().getAt(rowIndex);
                    var TaskID = rec.get("ID");
                    window.open("../../../../../CloudMfg_SRMS/ServiceSearch.aspx?TaskID=" + TaskID);
                }
            }, {
                text: "收缩",
                handler: function () {
                    //  node.collapse(true, true);
                }
            }])
            e.preventDefault();
            menu.showAt(e.getPoint());
        });
        //        grid1.getSelectionModel().on('rowselect', function (sm,rowIndex, r) {
        //            alert(r.get("TaskName"));

        //        });

    }
});

var WorkFlowTaskPageBar = new Ext.PagingToolbar({
    store: WorkFlowTaskStore,
    plugins: new Ext.ui.plugins.ComboPageSize(),
    pageSize: 20,
    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录"
});

var WorkFlowTaskablePanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var ProcessTaskGrid = new Ext.grid.GridPanel({
    viewConfig: { autoFill: true, forceFit: true },
    region: 'center',
    frame: true,
    store: WorkFlowTaskStore,
    plugins: WorkFlowTaskExpander,
    height: 400,
    tbar: WorkFlowTasktbar,
    bbar: WorkFlowTaskPageBar,
    sm: WorkFlowTaskablePanel_sm,
    loadMask: true,
    //    listeners: {//监听
    //        "rowdblclick": taskDataEdit
    //    },
    columns: [WorkFlowTaskExpander,
                    new Ext.grid.RowNumberer(),
                    WorkFlowTaskablePanel_sm,
    { header: "名称", dataIndex: 'WorkFlowName', sortable: true },
    { header: "发布企业", dataIndex: 'PublisherName', sortable: true },
    { header: "发布时间", dataIndex: 'PublishTime', sortable: true },
    { header: "审核不通过时间", dataIndex: 'WDeleteTime', sortable: true },
    { header: "状态", dataIndex: 'StateName', sortable: true }
            ]
});
ProcessTaskGrid.on('rowcontextmenu', function (grid, rowIndex, e) {
    menu = new Ext.menu.Menu([{
        text: "展开",

        handler: function () {
            var rec = grid.getStore().getAt(rowIndex);
            var WorkFlowID = rec.get("ID");
            window.open("../../../../../CloudMfg_SRMS/ServiceSearch.aspx?WorkFlowID=" + WorkFlowID);
            alert(rec.get("WorkFlowName"));
        }
    }, {
        text: "收缩",
        handler: function () {
            //  node.collapse(true, true);
        }
    }])
    e.preventDefault();
    menu.showAt(e.getPoint());
});
WorkFlowTaskStore.load({ params: { start: 0, limit: 20} });

function LoadWorkFlow(workflow) {
    graph.getModel().beginUpdate();
    var xmlDocument = mxUtils.parseXml(workflow);
    var decoder = new mxCodec(xmlDocument);
    var node = xmlDocument.documentElement;
    decoder.decode(node, graph.getModel());
    graph.getModel().endUpdate();
    WorkFlowPreviewWin.show();
}
