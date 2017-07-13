var ProjectTaskTreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'ProjectTaskTreeRoot'
});
var ProjectTaskTreeLoader = new Ext.tree.TreeLoader({
    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
    dataUrl: 'DataProcess.aspx?OperateType=ProjectTaskTree'
});

var ProjectTaskTreePanel = new Ext.tree.TreePanel({
    title: "企业项目任务树",
    border: true,
    collapsible: true,
    border: true,
    split: true,
    // disabled: true,
    //frame: true,
    //layout: 'fit',
    width: 150,
    region: 'west',
    root: ProjectTaskTreeRoot,
    autoScroll: true,
  //  onlyLeafCheckable: true,
    animate: true,
    loader: ProjectTaskTreeLoader,
    rootVisible: false,
    checkModel: "single",
    tools: [{
        id: 'refresh',
        handler: function () {
            ProjectTaskTreeLoader.load(ProjectTaskTreeRoot);
            ProjectTaskTreeRoot.expand();
        }

    }],
    containerScroll: true,
    listeners: {//监听
        "click": function (node, e) {
            taskStore.removeAll();
            taskStore.baseParams.ProjectTaskID = node.id;
            taskStore.baseParams.OperateType = "LoadtaskByPrjTree";

            taskStore.reload();
            taskPageBar.changePage(1);

        },
        "checkchange": function (node, checked) {
            if (checked) {
                if (node.attributes.Chargor != CurrentUserID) {
                    Ext.Msg.alert("提示", "此任务的负责人不是您，你不能创建于该任务相关联的任务！");
                    node.getUI().checkbox.checked = false;
                    node.attributes.checked = false;
                    ProjectTaskTreePanel.fireEvent('check', node, false);
                }
                else if (node.attributes.BelongProjectTreeNode != "") {
                    Ext.Msg.alert("提示", "该节点任务已创建！");
                    node.getUI().checkbox.checked = false;
                    node.attributes.checked = false;
                    ProjectTaskTreePanel.fireEvent('check', node, false);
                }
            }
        }
    }
});

ProjectTaskTreePanel.on('contextmenu', function (node, e) {
    ProjectTaskTreePanel.selectPath(node.getPath());
    menu = new Ext.menu.Menu([{
        text: "展开",
        handler: function () {
            node.expand(true, false);
        }
    }, {
        text: "收缩",
        handler: function () {
            node.collapse(true, true);
        }
    }])
    menu.showAt(e.getPoint());
});