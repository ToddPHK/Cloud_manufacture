
var roletreeroot = new Ext.tree.AsyncTreeNode({
    text: '公司组织结构',
    draggable: false,
    expanded: true,
    id: 'roletreeroot'
});
var roleTreeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'getroleTree.ashx'
});
var roletreepanel = new Ext.tree.TreePanel({
    title: "组织结构",
    border: true,
    split: true,
    collapsible: true,
    autoheight: true,
    region: 'west',
    width: 150,
    root: roletreeroot,
    autoScroll: true,
    animate: true,
    enableDD: false,
    layout: 'fit',
    rootVisible: false,
    tools: [{
        id: 'refresh',
        handler: function () {
            roleTreeLoader.load(roletreeroot);
        }

    }],
    containerScroll: true,
    listeners: {//监听
        "click": function (node, e) {
            roleTabletore.removeAll();
            roletype = node.id;
            roleTabletore.baseParams.roletype = roletype;
            roleTabletore.reload();
            roleTablepageBar.changePage(1);
        }
    },
    loader: roleTreeLoader
});
roletreepanel.on('contextmenu', function (node, e) {
    roletreepanel.selectPath(node.getPath());
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