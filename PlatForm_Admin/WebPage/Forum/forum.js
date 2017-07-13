

var TopicProxy = new Ext.data.HttpProxy({
    url: 'TopicTable.aspx'
});

var TopicReader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                        { name: "ID" },
                        { name: "TopicName" },
                        { name: "CreatorName" },
                        { name: "TopicContent" },
                        { name: "TemplateName" },
                        { name: "Creator" },
                        { name: "AvgScore" },
                        { name: 'CreateTime' },
                        { name: "ReplyCount" },
                        { name: "LastReplyContent" },
                        { name: "LastReplyTime" },
                        { name: "LastRepler" }

                        ]
                    );

var TopicStore = new Ext.data.Store(
                        { id: 'TopicStore', proxy: TopicProxy, reader: TopicReader }
                    );
TopicStore.load({ params: { start: 0, limit: 25} });
function ShowTopic(value, p, record) {


    return String.format(
                '<div class="topic"><b>{0}</b>', value);

}
function ShowLastPost(value, p, record) {
    if (value == '-1')
        return '<span class="post-date"> 无回复</span><br/>';
    else
        return String.format('<span class="post-date">{0}</span><br/>by {1}', value, record.data['LastRepler']);

}



Ext.QuickTips.init();
var sm = new Ext.grid.CheckboxSelectionModel({
    singleSelect: false,
    listeners: {
        selectionchange: function (sel) {

            var rec = sel.getSelected();
            ShowSelectedTopicReply(rec)

        }
    }
});

var cm = new Ext.grid.ColumnModel([sm, {
    id: 'topic',
    header: "主题",
    dataIndex: 'TopicName',
    width: 420,
    renderer: ShowTopic
}, {
    header: "创建人",
    dataIndex: 'CreatorName',
    width: 100,
    hidden: true
}, {
    header: "回复",
    dataIndex: 'ReplyCount',
    width: 70,
    align: 'right'
}, {
    id: 'last',
    header: "最新回复时间",
    dataIndex: 'LastReplyTime',
    width: 150,
    renderer: ShowLastPost
}]);

cm.defaultSortable = true;
var StandardTaskTreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var StandardTaskTreeLoader = new Ext.tree.TreeLoader({
    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
    dataUrl: 'DataProcess.aspx?OperateType=AllStandardTaskType'
});

var StandardTaskTreePanel = new Ext.tree.TreePanel({
    title: "标准任务",
    border: true,
    collapsible: true,
    border: true,
    split: true,
    id: 'forum-tree',
    // disabled: true,
    //frame: true,
    //layout: 'fit',
    width: 150,
    region: 'west',
    root: StandardTaskTreeRoot,
    autoScroll: true,
    animate: true,
    loader: StandardTaskTreeLoader,
    rootVisible: false,
    checkModel: "single",
    tools: [{
        id: 'refresh',
        handler: function () {
            StandardTaskTreeLoader.load(StandardTaskTreeRoot);
            StandardTaskTreeRoot.expand();
        }

    }],
    containerScroll: true,
    listeners: {//监听
        "click": function (node, e) {
            TaskTempelate_TreeLoader.dataUrl = 'DataProcess.aspx'
            TaskTempelate_TreeLoader.baseParams.OperateType = "TaskTemplate_CertainNode";
            TaskTempelate_TreeLoader.baseParams.StandardTaskID = node.id;
            TaskTempelate_TreeLoader.load(TaskTempelate_TreeRoot);
        },
        "checkchange": function (node, e) {
            CardPanel.layout.setActiveItem(node.attributes.TemplateName);
            // alert(node.attributes.ComponetID);
        }
    }
});
StandardTaskTreePanel.on('contextmenu', function (node, e) {
    StandardTaskTreePanel.selectPath(node.getPath());
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
    }])
    menu.showAt(e.getPoint());
});
var DeleteBtn_Topic = new Ext.Button({
    text: "删除",
    id: "DeleteBtn_Topic",
    iconCls: 'delete1-icon',
    listeners: {
        "click": function () {
            if (sm.hasSelection()) {
                Ext.MessageBox.confirm('提示', '您将要删除话题及其回复?', DeleteTopic);
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "选择您要删除的话题");
            }

        }
    }
})
function DeleteTopic(btn) {
    if (btn=='yes') {
        var TopicID = [];
        var rows = sm.getSelections();


        for (var i = 0; i < rows.length; i++) {

            TopicID.push(rows[i].get("ID"));
        }
        var jsonData = { OperateType: "DeleteTopic", TopicID: TopicID.join() };
        CodeOperaMethod('DataProcess.aspx', jsonData);
        TopicStore.removeAll();
        TopicStore.reload();
    }

}
var TaskTempelate_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '任务模板',
    draggable: false,
    expanded: true,
    id: 'TaskTempelate_TreeRoot'
});
var TaskTempelate_TreeLoader = new Ext.tree.TreeLoader({
    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
    dataUrl: 'DataProcess.aspx?OperateType=TaskTemplate_AllNode'
});

var TaskTempelate_TreePanel = new Ext.tree.TreePanel({
    title: "任务模板",
    border: true,
    collapsible: true,
    border: true,
    split: true,
    //     checkModel: "single",
    id: 'TaskTempelate_TreePanel',
    width: 150,
    region: 'west',
    root: TaskTempelate_TreeRoot,
    autoScroll: true,
    animate: true,
    loader: TaskTempelate_TreeLoader,
    rootVisible: false,
    checkModel: "single",
    tools: [{
        id: 'refresh',
        handler: function () {

            TaskTempelate_TreeLoader.load(TaskTempelate_TreeRoot);
            TaskTempelate_TreeRoot.expand();
        }

    }],
    containerScroll: true,
    listeners: {//监听
        "click": function (node, e) {
            TopicStore.removeAll();
            TopicStore.baseParams.TempalteID = node.id;
            TopicStore.baseParams.OperateType = "LoadTopicByTempalte";
            TopicStore.load();
            TopicStore.reload();


        },
        "checkchange": function (node, e) {


        }
    }
});
TaskTempelate_TreePanel.on('contextmenu', function (node, e) {
    TaskTempelate_TreePanel.selectPath(node.getPath());
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
    }])
    menu.showAt(e.getPoint());
});

function NewTopic() {
    var node = TaskTempelate_TreePanel.getSelectionModel().getSelectedNode();
    if (node != null) {
        if (node.attributes.type == 'T') {
            NewTopic_FormPanel.getForm().findField('ID').setValue(node.id);
            NewTopic_Window.show();
        }
        else
            App.setAlert(App.STATUS_NOTICE, "只能选择模板节点！");
    }
    else {
        //   Ext.Msg.alert("提示", "只能创建于任务模板相关的话题，请首先在任务模板中选择一个节点！");
        App.setAlert(App.STATUS_NOTICE, "只能创建于任务模板相关的话题，请首先在任务模板中选择一个节点！");
    }
}
function AddReply() {
    var sm = Ext.getCmp('topic-grid').getSelectionModel();
    if (sm.hasSelection()) {
        TemplateScore_FormPanel.getForm().findField('ID').setValue(sm.getSelected().get("ID"));
        TemplateScore_Window.show();
    }
    else {
        // Ext.Msg.alert("提示", "选择一个话题");

        App.setAlert(App.STATUS_NOTICE, "选择一个话题");

    }
}
var TopicReply_Template = new Ext.XTemplate(
		 '<tpl for="ReplyData">',
         '<div style=" height:auto;">',
         '{ReplyContent:this.ShowReplyContent()}',
         '</div>',
             '<div style="text-align:right">',
             '{#}楼 ',
             '{ReplyTime} ',
             '{Score}分 ',
             '{ReplerName}',
             '</div>',
		'<hr/>',
		 '</tpl>'
);
TopicReply_Template.ShowReplyContent = function (ReplyContent) {
    return decodeURIComponent(ReplyContent);
}

function ShowSelectedTopicReply(rec) {
    if (rec) {

        var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
        conn1.open("POST", "DataProcess.aspx?OperateType=ViewReply&TopicID=" + rec.get('ID'), false);
        conn1.send(null);
        // alert(conn1.responseText);

        var responseText = conn1.responseText;
        if (responseText != "") {
            var ReplyData = Ext.util.JSON.decode(responseText);
            var detailPanel = Ext.getCmp('preview');
            TopicReply_Template.overwrite(detailPanel.body, ReplyData);
        }
        else {
            Ext.getCmp('preview').body.update('<b><u>' + rec.get('TopicName') + '</u>  还没有回复</b>');
        }
    }


}
function toggleDetails(btn, pressed) {
    var view = Ext.getCmp('topic-grid').getView();
    view.showPreview = pressed;
    view.refresh();
}

function togglePreview(btn, pressed) {
    var preview = Ext.getCmp('preview');
    preview[pressed ? 'show' : 'hide']();
    preview.ownerCt.doLayout();
}
function ShowAll() {
    TopicStore.removeAll();
    TopicStore.baseParams.OperateType = "LoadAllTopic";
    TopicStore.load({ params: { start: 0, limit: 25} });
}
Ext.onReady(function () {

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [

StandardTaskTreePanel,
            new Ext.Panel({
                id: 'main-view',
                region: 'center',
                layout: 'border',
                //   title: 'Loading...',
                items: [
                   TaskTempelate_TreePanel,
                        new Ext.grid.GridPanel({
                            region: 'center',
                            id: 'topic-grid',
                            store: TopicStore,
                            cm: cm,
                            sm: sm,
                            trackMouseOver: false,
                            loadMask: { msg: '数据加载中' },
                            viewConfig: {
                                forceFit: true,
                                enableRowBody: true,
                                showPreview: true,
                                getRowClass: function (record, rowIndex, p) {
                                    if (this.showPreview) {
                                        p.body = '<p>' + decodeURIComponent(record.data.TopicContent) + '</p><p><span class="author">[发起人]:' + record.data.CreatorName + ' [平均分]:' + record.data.AvgScore + ' [绑定项]:' + record.data.TemplateName + '</span></p>';
                                        return 'x-grid3-row-expanded';
                                    }
                                    return 'x-grid3-row-collapsed';
                                }
                            },
                            tbar: [
                                {
                                    text: '新话题',
                                    iconCls: 'new-topic',
                                    handler: function () { NewTopic(); }
                                },
                                                                '-',
                                {
                                    text: '回复',
                                    iconCls: 'new-topic',
                                    handler: function () { AddReply(); }
                                }, '-',
                               DeleteBtn_Topic,
                                '-',
                                {
                                    pressed: true,
                                    enableToggle: true,
                                    text: '预览',
                                    tooltip: { title: 'Preview Pane', text: 'Show or hide the Preview Pane' },
                                    iconCls: 'preview',
                                    toggleHandler: togglePreview
                                },
                                ' ',
                                {
                                    pressed: true,
                                    enableToggle: true,
                                    text: '概要',
                                    tooltip: { title: 'Post Summary', text: 'View a short summary of each post in the list' },
                                    iconCls: 'summary',
                                    toggleHandler: toggleDetails
                                },
                                ' ', {
                                    text: '显示所有',
                                    handler: ShowAll
                                }
                            ],
                            bbar: new Ext.PagingToolbar({
                                pageSize: 25,
                                store: TopicStore,
                                displayInfo: true,
                                displayMsg: '总记录数 {0} - {1} of {2}',
                                emptyMsg: "无记录"
                            })
                        }), {
                            id: 'preview',
                            region: 'south',
                            height: 250,
                            title: '话题回复',
                            split: true,
                            autoScroll: true,
                            bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
                        }
                ]
            })
         ]
    });


});

