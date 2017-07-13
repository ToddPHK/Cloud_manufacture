



var ProjectTaskTreeView_TreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true
});
var ProjectTaskTreeView_TreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'ProjectTree.aspx'
});
var ProjectTaskTreeView_Grid = new Ext.ux.tree.TreeGrid({
    title: '项目任务树构建',
    root: ProjectTaskTreeView_TreeRoot,
    loader: ProjectTaskTreeView_TreeLoader,
    width: 500,
    height: 300,
    region: "center",
    tools: [{
        id: 'refresh',
        handler: function () {
            ProjectTaskTreeView_Grid_refresh();
        }

    }],
    columns: [{
        header: '名称',
        dataIndex: 'Name',
        width: 230
    }, {
        header: '节点创建人',
        width: 100,
        dataIndex: 'CreatorPeopleName',
        align: 'center'
    }, {
        header: '负责人',
        width: 150,
        dataIndex: 'ChargorPeopleName'
    }, {
        header: '负责人所属部门',
        width: 100,
        dataIndex: 'Department'
    }, {
        header: '创建时间',
        dataIndex: 'CreateDate',
        width: 150
    }],
    dropConfig: { appendOnly: false }
});

function ProjectTaskTreeView_Grid_refresh() {
    ProjectTaskTreeView_TreeLoader.load(ProjectTaskTreeView_TreeRoot);
    ProjectTaskTreeView_TreeRoot.expand();
}

ProjectTaskTreeView_Grid.on('contextmenu', function (node, e) {
    ProjectTaskTreeView_Grid.selectPath(node.getPath());
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




var ProjectTaskTreeView_Window = new Ext.Window({
    collapsible: true,
    layout: 'border',
    width: 800,
    height: 500,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '项目树查看',
    // bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [ProjectTaskTreeView_Grid],
    buttons: [{
        text: '关闭',
        //点击保存按钮后触发事件  
        handler: function () {
            ProjectTaskTreeView_Window.close();
        }
    }]
});


