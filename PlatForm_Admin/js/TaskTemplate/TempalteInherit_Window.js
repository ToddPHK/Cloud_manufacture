var root = new Ext.tree.AsyncTreeNode({
    text: 'Ext JS',
    draggable: false, // disable root node dragging
    id: 'src'
});
var tree = new Ext.tree.TreePanel({
    animate: true,
    autoScroll: true,
    root: root,
    rootVisible: false,
    loader: new Ext.tree.TreeLoader({ baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI }, dataUrl: 'DataProcess.aspx' }),
    enableDD: false,
    containerScroll: true,
    checkModel: "single",
    border: false,
    enableDrag: false,
    width: 250,
    height: 300
});


tree.on('contextmenu', function (node, e) {
    tree.selectPath(node.getPath());
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

//-------------------------------------------------------------
var tree2Loader = new Ext.tree.TreeLoader({
    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
    dataUrl: 'DataProcess.aspx'
});
var root2 = new Ext.tree.AsyncTreeNode({
    text: 'Extensions',
    draggable: false,
    id: 'ux'
});
var tree2 = new Ext.tree.TreePanel({
    animate: true,
    root: root2,
    autoScroll: true,
    rootVisible: false,
    loader: tree2Loader,
    containerScroll: true,
    checkModel: "single",
    border: false,
    width: 250,
    height: 300,
    //  dropConfig: { appendOnly: true },
    enableDD: false

});

tree2.on('contextmenu', function (node, e) {
    tree2.selectPath(node.getPath());
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
tree2.on("checkchange", function (node, checked) {

    if (checked) {
        if (node.attributes.Type == "A") {
            App.setAlert(App.STATUS_NOTICE, "不能选择属性节点！");
            node.getUI().checkbox.checked = false;
            node.attributes.checked = false;
            tree2.fireEvent('check', node, false);
        }

    }

});
//tree2.on("check", function (node, checked) {
//    if (node.attributes.Type == "A") {
//        if (checked) {
//            App.setAlert(App.STATUS_NOTICE, "如果您选择一个该节点将无法实现继承");
//        }

//    }
//});
//var button1 = new Ext.Button({
//    text: "继承选择",
//    listeners: {
//        "click": function () {
//            alert("Hello");
//        }
//    }
//})
var button2 = new Ext.Button({
    text: "继承模板",
    listeners: {
        "click": function () {

            if (tree.getChecked() == "") {
                App.setAlert(App.STATUS_NOTICE, "请在左侧树中选择一个节点！");
            }
            else {
                var Inheritnode = tree.getChecked()[0];
                var node = tree2.getChecked()[0];
                var parms;
                if (node == undefined) {
                    //  App.setAlert(App.STATUS_NOTICE, "请选择一个模板节点！");
                    parms = { OperateType: "InheritTemplates", InheriteTemplateType: Inheritnode.attributes.Type, InheriteTemplateID: Inheritnode.id, Type: "T", TemplateID: TaskMudole_TreeGrid.getChecked()[0].attributes.TaskTemplateID };

                }
                else {
                    parms = { OperateType: "InheritTemplates", InheriteTemplateType: Inheritnode.attributes.Type, InheriteTemplateID: Inheritnode.id, Type: node.attributes.Type, TemplateID: node.id };

                }
                InheritTemplates("DataProcess.aspx", parms);
            }


        }
    }
})

var ETemplateInherit_Window = new Ext.Window({
    layout: "table",
    width: 623,
    height: 370,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '模板继承',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [{ items: tree, frame: false },
                { items: [button2], bodyStyle: 'padding:20px', frame: false },
                { items: tree2, frame: false}],
    buttons: [{
        text: '关闭',
        //点击保存按钮后触发事件  
        handler: function () {
            ETemplateInherit_Window.hide();

        }
    }]
});
function InheritTemplates(url, parms) {
    var conn = new Ext.data.Connection();
    conn.request({
        //请求的 Url  
        url: url,
        // 传递的参数  
        params: parms,
        method: 'post',
        scope: this,
        //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
        callback: function (options, success, response) {
            if (success) {
                var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象
                if (result.success) {
                    tree2Loader.load(root2);
                    root2.expand();

                }
                App.setAlert(App.STATUS_NOTICE, result.msg);
            }
            else {
                Ext.MessageBox.alert("提示", "所提交的操作失败！");
            }

        }
    });
}
