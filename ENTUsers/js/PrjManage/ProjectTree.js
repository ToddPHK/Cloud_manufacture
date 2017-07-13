

var ProjectTaskTree_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var ProjectTaskTree_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'DataProcess.aspx'
});
var ProjectTaskTree_Grid = new Ext.ux.tree.TreeGrid({
    root: ProjectTaskTree_TreeRoot,
    loader: ProjectTaskTree_TreeLoader,
    width: 500,
    height: 300,
    region: "center",
    enableDD: true,
    tools: [{
        id: 'refresh',
        handler: function () {
            ProjectTaskTree_Grid_refresh();
        }

    }],
    columns: [{
        header: '名称',
        dataIndex: 'Name',
        width: 230
    }, {
        header: '创建人',
        width: 100,
        dataIndex: 'CreatorPeopleName',
        align: 'center'
    }, {
        header: '负责人',
        width: 150,
        dataIndex: 'ChargorPeopleName'
    }, {
        header: '创建时间',
        dataIndex: 'CreateDate',
        width: 150
    }],
    dropConfig: { appendOnly: false }

});

function ProjectTaskTree_Grid_refresh() {
    ProjectTaskTree_TreeLoader.load(ProjectTaskTree_TreeRoot);
    ProjectTaskTree_TreeRoot.expand();
}

ProjectTaskTree_Grid.on('contextmenu', function (node, e) {
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



var ProjectTaskTree_Window = new Ext.Window({
    layout: 'border',
    width: 800,
    height: 500,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '项目构建',
    buttonAlign: 'center',
    items: [ProjectTaskTree_Grid]

});

