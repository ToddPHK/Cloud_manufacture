var StandardTaskTreeRoot = new Ext.tree.AsyncTreeNode({
    text: '标准制造任务',
    draggable: false,
    expanded: true,
    id: 'PunchModuleRoot'
});
var StandardTaskTreeLoader = new Ext.tree.TreeLoader({
    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI },
    dataUrl: 'DataProcess.aspx?OperateType=StandardTaskTree'
});

var StandardTaskTreePanel = new Ext.tree.TreePanel({
    title: "标准任务类",
    border: true,
    collapsible: true,
    border: true,
    split: true,
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
            clearInterval(IntervalID);
            LoadTaskTemplate(node.attributes.TemplateName)
         //   CardPanel.layout.setActiveItem(node.attributes.TemplateName);

        },
        "checkchange": function (node, e) {
            //CardPanel.layout.setActiveItem(node.attributes.TemplateName);
            clearInterval(IntervalID);
            LoadTaskTemplate(node.attributes.TemplateName)
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
var IntervalID;
function LoadTaskTemplate(TemplateName) {
    var loadMarsk = new Ext.LoadMask('TaskCreate_Window', {
        msg: '正在加载模板，请稍候......',
        removeMask: true// 完成后移除
    });
    loadMarsk.show(); //显示
    function taskMould_Add() {
        s = document.createElement("script");
        s.type = "text/javascript";
        s.id = TemplateName + "Template_Now";
        s.src = "../../../TaskMould/" + TemplateName + ".js";
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);
    }

    var tag = document.getElementById(TemplateName + "Template_Now");

    if (tag == null) {
        taskMould_Add();
        tag = document.getElementById(TemplateName + "Template_Now");
        //-----------------
        var start = new Date().getTime();

        //---------------------------
         IntervalID = setInterval(function () {
            if (Ext.getCmp(TemplateName) != undefined) {
                CardPanel.add(Ext.getCmp(TemplateName));
                CardPanel.doLayout();
                CardPanel.layout.setActiveItem(Ext.getCmp(TemplateName));
                loadMarsk.hide(); //隐藏
                clearInterval(IntervalID);

            }
            else {
                if (new Date().getTime() - start > 30000) {
                    Ext.MessageBox.confirm('提示', '加载时间过长，继续加载?', NoLoad);
                }
            }
        }, 3000)

        function NoLoad(btn) {

            if (btn == 'no') {
                loadMarsk.hide(); //隐藏
                tag.removeNode();
                clearInterval(IntervalID);
            }
            else {
                tag.removeNode();
                taskMould_Add();
                start = new Date().getTime();
            }

        }
        //-------------------------------
    }
    else {
        CardPanel.layout.setActiveItem(Ext.getCmp(TemplateName));
        loadMarsk.hide(); //隐藏
    }

}
