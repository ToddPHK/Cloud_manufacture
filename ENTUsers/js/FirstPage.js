Ext.onReady(function () {
    //--------------------------------------------------------------
    Ext.BLANK_IMAGE_URL = '../ext-3.2.0/resources/images/default/s.gif';
    Ext.QuickTips.init();
    //-------项目文档树---标准图文档树的实现
    //--------------主页框架--------------//
    var MyMaintabPanel = new Ext.TabPanel({
        region: 'center',
        activeTab: 0,
        enableTabScroll: true, //挤的时候能够滚动收缩
        frame: true,
        initEvents: function () {
            Ext.TabPanel.superclass.initEvents.call(this);
            this.mon(this.strip, 'mousedown', this.onStripMouseDown, this);
            //ADD:monitor title dbclick
            this.mon(this.strip, 'dblclick', this.onTitleDbClick, this);
        },
        //ADD: handler  双击关闭tab页
        onTitleDbClick: function (e, target, o) {
            var t = this.findTargets(e);
            if (t.item != null && t.item.title != '我的工作台') {
                if (t.item.fireEvent('beforeclose', t.item) !== false) {
                    t.item.fireEvent('close', t.item);
                    this.remove(t.item);
                }
            }
        },
        listeners: {
            //传进去的三个参数分别为:这个tabpanel(tabsDemo),当前标签页,事件对象e
            "contextmenu": function (tdemo, myitem, e) {
                menu = new Ext.menu.Menu([{
                    text: "关闭当前页",
                    handler: function () {
                        if (myitem.title != "我的工作台")
                            tdemo.remove(myitem);
                    }
                }, {
                    text: "关闭其他所有页",
                    handler: function () {
                        //循环遍历
                        tdemo.items.each(function (item) {
                            if (item.closable && item != myitem) {
                                //可以关闭的其他所有标签页全部关掉
                                if (myitem.title != "我的工作台")
                                    tdemo.remove(item);
                            }
                        });
                    }
                }]);
                //显示在当前位置
                menu.showAt(e.getPoint());
            }
        },
        items: [{
            title: "我的工作台",
            html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="http://www.zju.edu.cn/" > </iframe>'
        }]
    });

    //------------添加一个tab----------//
    function addTab(node, e) {
        if (node.isLeaf()) {
            var add = true;
            var trt = MyMaintabPanel.items.items;       //添加在TabPanel里
            for (i = 0; i < trt.length; i++) {          //如果已经打开，就不再添加
                if (trt[i].title == node.text) {
                    add = false;
                    MyMaintabPanel.setActiveTab(trt[i]);
                    break;
                }
            }
            if (add) {
                MyMaintabPanel.add({
                    title: node.text,
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + node.id + '"> </iframe>',      //将nodeId指向的网页作为其中的内容
                    closable: true
                }).show();
                MyMaintabPanel.doLayout();
            }
        }
    }

    //--------------项目管理功能树数据---------------//
    var PrjTypetreeroot = new Ext.tree.AsyncTreeNode({
        text: '项目管理',
        draggable: false,
        expanded: true,
        //  id: 'prj',
        children: [     //要显示的页节点
            { id: "PDM/rolemanage/Default.aspx", text: "人员管理", leaf: true },
            { id: "PDM/prjManege/Default.aspx", text: "项目管理", leaf: true },
            { id: "PDM/PrjManagerAudit/Default.aspx", text: "服务审核", leaf: true },
            { id: "PDM/TaskManage/Default.aspx", text: "任务管理", leaf: true },
            { id: "workflow/workflow.aspx", text: "工作流", leaf: true }]
    });

    //------------项目管理功能树-------------//
    var PrjTypetrees = new Ext.tree.TreePanel({     //功能导航
        border: false,
        autoheight: true,
        root: PrjTypetreeroot,      //PrjTyptreeroot作为这个TreePanel的根
        rootVisible: false,
        autoScroll: true,
        animate: true,
        containerScroll: true,
        loader: new Ext.tree.TreeLoader(),
        listeners: {    //监听click事件
            "click": function (node, e) {       //传入所有节点，监听单击叶节点事件
                addTab(node, e);
            }
        }
    });

    //--------------系统维护功能树数据---------------//
    var PrjMemberTreeroot = new Ext.tree.AsyncTreeNode({
        text: '系统维护',
        draggable: false,
        rootVisible: false,
        expanded: true,
        id: 'goingTree',
        children:
            [   { id: "PDM/DataManage/RoleManage/RoleManage.aspx", text: "角色维护", leaf: true },
                { id: "PDM/DataManage/ProjectType/Default.aspx", text: "项目类型维护", leaf: true },
                { id: "PDM/DataManage/DataRefresh/Default.aspx", text: "数据更新", leaf: true },
                { id: "PDM/DataManage/OrgStructure/OrgStructure.aspx", text: "组织结构维护", leaf: true }
            ]
    });

    //------------系统维护功能树-------------//
    var PrjMembertree = new Ext.tree.TreePanel({
        autoheight: true,
        border: false,
        root: PrjMemberTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        layout: 'fit',
        containerScroll: true,
        listeners: {//监听
            "click": function (node, e) {
                addTab(node, e);
            }
        },
        loader: new Ext.tree.TreeLoader()
    });

    //--------------系统日志树数据---------------//
    var SystemlogTreeroot = new Ext.tree.AsyncTreeNode({
        text: '系统日志',
        draggable: false,
        rootVisible: false,
        expanded: true,
        children: [
        { id: "PDM/LoginLog/Default.aspx", text: "登录日志", leaf: true }



        ]
    });

    //--------------系统日志树---------------//
    var Systemlogbertree = new Ext.tree.TreePanel({
        // el:'tree-div',
        //  title: "trees",
        autoheight: true,
        border: false,
        // height: 800,
        root: SystemlogTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        layout: 'fit',
        containerScroll: true,
        listeners: {//监听
            "click": function (node, e) {
                //alert(node.text + node.id);
                addTab(node, e);
            }
        },
        loader: new Ext.tree.TreeLoader()
    });

    //--------------任务模板树数据---------------//
    var TaskTemplateTreeroot = new Ext.tree.AsyncTreeNode({
        text: '标准图文档项目',
        draggable: false,
        rootVisible: false,
        expanded: true,
        children: [
                    { id: "../PlatForm_Admin/WebPage/TaskTemplate/Default.aspx", text: "任务模板共建", leaf: true },
     { id: "../Forum/Default.aspx", text: "任务模板论坛", leaf: true }
        ]

    });

    //--------------任务模板树---------------//
    var TaskTemplateTree = new Ext.tree.TreePanel({
        autoheight: true,
        border: false,
        root: TaskTemplateTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        layout: 'fit',
        containerScroll: true,
        listeners: {//监听
            "click": function (node, e) {
                //alert(node.text + node.id);
                addTab(node, e);
            }
        },
        loader: new Ext.tree.TreeLoader()
    });

    //-------------------资源服务树数据-------//
    var ResServiceTreeroot = new Ext.tree.AsyncTreeNode({
        text: '资源服务',
        draggable: false,
        rootVisible: false,
        expanded: true,
        children: [
                    { id: "../../CloudMfg_SRMS/index.aspx", text: "资源服务", leaf: true }
        ]

    });

    //-------------------资源服务树-------//
    var ResServiceTree = new Ext.tree.TreePanel({
        autoheight: true,
        border: false,
        root: ResServiceTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        layout: 'fit',
        containerScroll: true,
        listeners: {//监听
            "click": function (node, e) {
                //alert(node.text + node.id);
                addTab(node, e);
            }
        },
        loader: new Ext.tree.TreeLoader()
    });


    //------------------风格颜色下拉菜单数据--------//
    var themestore = new Ext.data.SimpleStore({
        fields: ['name', 'css'],
        data: [['默认', '../ext-3.2.0/resources/css/ext-all.css'],
                ['石板色', '../ext-3.2.0/resources/css/xtheme-slate.css'],
                ['粉红', '../ext-3.2.0/resources/css/xtheme-purple.css'],
                ['黑色', '../ext-3.2.0/resources/css/xtheme-access.css'],
                 ['灰色', '../ext-3.2.0/resources/css/xtheme-gray.css'],
                 ['绿色', '../ext-3.2.0/resources/css/xtheme-green.css'],
                 ['椒盐色', '../ext-3.2.0/resources/css/xtheme-peppermint.css'],
                ['橄榄色', '../ext-3.2.0/resources/css/xtheme-olive.css']]
    });

    //------------------风格颜色下拉菜单--------//
    var themecombo = new Ext.form.ComboBox({
        store: themestore,
        id: 'themecombo1',
        valueField: 'css',
        displayField: 'name',
        mode: 'local',
        renderTo: 'themeDiv',
        width: 100,
        value: '默认',
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
        selectOnFocus: true,
        listeners: {
            "select": function () {
                var State_Colorconn = Ext.lib.Ajax.getConnectionObject().conn;
                State_Colorconn.open("POST", "Indexhandler.ashx?OperateType=SwapStyleSheet&StyleSheet=" + themecombo.getValue(), false);
                State_Colorconn.send(null);
                var temp = State_Colorconn.responseText;
                var State_Color = Ext.util.JSON.decode(temp);
                if (State_Color.success) {
                    Ext.util.CSS.swapStyleSheet('theme', themecombo.getValue());
                }
                //location.reload();
            }
        }
    });

    //------------------登出按钮--------//
    var closeButton = new Ext.Button({
        iconCls: 'logout-icon',
        iconAlign: 'left',
        tooltip: '<span style="font-size:12px">切换用户,安全退出系统</span>',
        pressed: true,
        arrowAlign: 'right',
        renderTo: 'closeDiv',
        handler: function () {
            var conn = new Ext.data.Connection();
            conn.request({
                //请求的 Url  
                url: 'Indexhandler.ashx',
                // 传递的参数  
                params: { OperateType: 'ClearAllSession' },
                method: 'post',
                scope: this
            })
            window.location.href = '../Login.htm';
            //'<% Response.Write("{success:false,msg}")%>';
        }
    });

    //------------------回到平台首页--------//
    var homeButton = new Ext.Button({
        iconCls: 'home-icon',
        text: '',
        iconAlign: 'left',
        tooltip: '<span style="font-size:12px">返回首页</span>',
        pressed: true,
        arrowAlign: 'right',
        renderTo: 'homeDiv',
        handler: function () {
            window.location.href = '../../index.aspx';
        }
    });
    //-----------------------------------------------------------------------------整体面板布局的实现
    var northPanel = new Ext.Panel({
        title: "云端企业信息管理系统", //实际应用中，通常去掉该属性。
        region: 'north', //北部，即顶部，上面
        contentEl: 'north-div', //面板包含的内容
        layout: 'fit',
        split: true,
        height: 80,
        minSize: 60, maxSize: 150,
        collapsible: true //是否可以收缩,默认不可以收缩，即不显示收缩箭头

    });
    var westPanel = new Ext.Panel({
        title: '系统导航', //面板名称
        region: 'west', //该面板的位置，此处是西部 也就是左边
        split: true, //为true时，布局边框变粗 ,默认为false
        border: false,
        collapsible: true,
        collapsed: false, //初始化是否显示, 默认是显示
        width: 150,
        minSize: 10, //最小宽度
        maxSize: 300,
        layout: 'accordion',
        layoutConfig: { //布局
            titleCollapse: true,
            animate: true,
            activeOnTop: false
        },
        items: [{
            title: '功能导航',
            layout: 'fit',
            iconCls: 'money_box', //字面板样式
            items: [PrjTypetrees]
        }, {
            title: '模板共建',
            layout: 'fit',
            iconCls: 'money_box', //字面板样式
            items: [TaskTemplateTree]
        }, {
            title: '资源服务',
            layout: 'fit',
            iconCls: 'money_box', //字面板样式
            items: [ResServiceTree]
        }, {
            title: "系统维护",
            layout: 'fit',
            border: false, autoScroll: true, iconCls: "Icon",
            items: [PrjMembertree]
        }, {
            title: "系统日志",
            layout: 'fit',
            border: false, autoScroll: true, iconCls: "Icon",
            items: [Systemlogbertree]
        }
        //autoLoad:{url:"xx.htm",scripts:true}//面板的内容是指向一个*.htm，scripts:true 是表示支持包含文件里面的js脚本
        ]
    });
    var viewport = new Ext.Viewport({
        layout: 'border', //布局,必须是border
        loadMask: true,
        items: [MyMaintabPanel, //中
        // eastPanel, //右
        // southPanel, //下
                 northPanel, //上
                westPanel //左
        ]
    });
});

