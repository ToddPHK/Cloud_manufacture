Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = '../ext-3.2.0/resources/images/default/s.gif';
    //-----------------------------------------------------------------
    Ext.apply(Ext.form.VTypes, {
        password: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
            if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
                var pwd = Ext.get(field.confirmTo); //取得confirmTo的那个id的值
                return (val == pwd.getValue());
            }
            return true;
        }
    });

    var EditPassWord_Panel = new Ext.form.FormPanel({
        layout: 'form',
        border: false,
        items: [{
            xtype: "textfield",
            id: "pass1",
            fieldLabel: "密码",
            inputType: 'password',
            name: 'PassWord',
            regex: /[\x21-\x7E]{6,12}/,
            regexText: "只能输入由数字、26个英文字母组成的字符串,长度在6~12之间",
            width: 120
        }, {
            xtype: "textfield",
            fieldLabel: "确认密码",
            inputType: 'password',
            submitValue: false,
            vtype: "password", //自定义的验证类型
            vtypeText: "两次密码不一致！",
            confirmTo: "pass1", //要比较的另外一个的组件的id
            width: 120
        }]
    });
    var EditPassWord_Win = new Ext.Window({
        collapsible: false,
        maximizable: false,
        resizable: false,
        layout: 'fit',
        width: 260,
        height: 125, //15+ -
        modal: false,
        border: false,
        closeAction: "hide",
        plain: true,
        title: '密码修改',
        buttonAlign: 'center',
        buttons: [{ text: "确认修改", handler: EditPassWord}],
        items: [EditPassWord_Panel]
    });
    function EditPassWord() {
        if (EditPassWord_Panel.form.isValid())//判断是否通过客户端验证
        {
            EditPassWord_Panel.form.submit({
                waitMsg: '正在提交数据请稍等...', 		//提示信息
                waitTitle: '提示', 					//标题
                url: 'DataProcess.aspx', //请求的url地址
                method: 'GET',
                params: {
                    OperateType: "EditPassWord"
                },
                success: function (form, action) {
                    EditPassWord_Win.hide();
                    // App.setAlert(App.STATUS_NOTICE, action.result.msg);
                    Ext.Msg.alert('提示', action.result.msg);

                },
                failure: function (form, action) {
                    //App.setAlert(App.STATUS_NOTICE, action.result.msg);
                    Ext.Msg.alert('提示', action.result.msg);

                }
            });

        }
    }
    var EditPassWordButton = new Ext.Button({
        text: '修改密码',
        iconAlign: 'left',
        //        tooltip: '<span style="font-size:12px">切换用户,安全退出系统</span>',
        pressed: true,
        arrowAlign: 'right',
        renderTo: 'configDiv',
        handler: function () {
            EditPassWord_Win.show();
        }
    });
    //--------------------------------------------------------------
    var Microblog_conn = Ext.lib.Ajax.getConnectionObject().conn;
    Microblog_conn.open("POST", "SessionClear.aspx?OperateType=Microblog", false);
    Microblog_conn.send(null);
    var Microblog = Microblog_conn.responseText;

    Ext.QuickTips.init();
    //-------项目文档树---标准图文档树的实现
    var MyMaintabPanel = new Ext.TabPanel({
        //resizeTabs:true,宽度能自动变化,但是影响标题的显示
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
            html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + Microblog + '" > </iframe>'
        }]
    });
    var PrjTypetreeroot = new Ext.tree.AsyncTreeNode({
        text: '功能导航',
        draggable: false,
        expanded: true,
        //  id: 'prj',
        children: [

     { id: "WebPage/StandardTaskTypeTree/Default.aspx", text: "标准任务/服务管理", leaf: true },
     { id: "WebPage/TaskTemplate/Default.aspx", text: "任务模板管理", leaf: true },
      { id: "WebPage/TaskManage/Default.aspx", text: "任务管理", leaf: true },
      { id: "WebPage/TaskUnPassManage/Default.aspx", text: "待删除任务管理", leaf: true },
           { id: "WebPage/Forum/Default.aspx", text: "任务模板论坛", leaf: true }
                           ]
    });
    var PrjTypetrees = new Ext.tree.TreePanel({
        // title: "trees",
        border: false,
        autoheight: true,
        // height: 800,
        root: PrjTypetreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        // enableDD: true,
        //layout: 'fit',
        containerScroll: true,
        loader: new Ext.tree.TreeLoader(),
        listeners: {//监听
            "click": function (node, e) {
                addTab(node, e);
            }
        }

    });
    function addTab(node, e) {
        if (node.isLeaf()) {
            var add = true;
            var trt = MyMaintabPanel.items.items;
            for (i = 0; i < trt.length; i++) {
                if (trt[i].title == node.text) {
                    add = false;
                    MyMaintabPanel.setActiveTab(trt[i]);
                    break;
                }
            }
            if (add) {
                MyMaintabPanel.add({
                    title: node.text,
                    //    iconCls: 'tabs',
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + node.id + '"> </iframe>',
                    //  items: new Ext.Panel(),
                    closable: true
                }).show();
                MyMaintabPanel.doLayout();

            }
        }
    }
    var PrjMemberTreeroot = new Ext.tree.AsyncTreeNode({
        text: '标准图文档项目',
        draggable: false,
        rootVisible: false,
        expanded: true,
        id: 'goingTree',
        children: [{ id: "WebPage/DieClassManage/Default.aspx", text: "模具分类", leaf: true },
        { id: "WebPage/CraftManage/Default.aspx", text: "工艺类型", leaf: true },
                    { id: "WebPage/TaskStateManage/Default.aspx", text: "任务状态", leaf: true }


               ]
    });
    var PrjMembertree = new Ext.tree.TreePanel({
        // el:'tree-div',
        //  title: "trees",
        autoheight: true,
        border: false,
        // height: 800,
        root: PrjMemberTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        enableDD: true,
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

    var UserManageTreeroot = new Ext.tree.AsyncTreeNode({
        text: '标准图文档项目',
        draggable: false,
        rootVisible: false,
        expanded: true,
        id: 'UserManageTreeroot',
        children: [
                    { id: "WebPage/UserAudit/Default.aspx", text: "用户管理", leaf: true }


               ]
    });
    var UserManageTree = new Ext.tree.TreePanel({
        // el:'tree-div',
        //  title: "trees",
        autoheight: true,
        border: false,
        // height: 800,
        root: UserManageTreeroot,
        rootVisible: false,
        autoScroll: true,
        animate: true,
        enableDD: true,
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
    var SystemlogTreeroot = new Ext.tree.AsyncTreeNode({
        text: '系统日志',
        draggable: false,
        rootVisible: false,
        expanded: true,
        children: [
        { id: "WebPage/LoginLog/Default.aspx", text: "登录日志", leaf: true }



               ]
    });
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
    var themecombo = new Ext.form.ComboBox({
        store: themestore,
        id: 'themecombo1',
        valueField: 'css',
        displayField: 'name',
        hiddenName: 'StyleSheet',
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
                State_Colorconn.open("POST", "SessionClear.aspx?OperateType=SwapStyleSheet&StyleSheet=" + themecombo.getValue(), false);
                State_Colorconn.send(null);
                var temp = State_Colorconn.responseText;
                var State_Color = Ext.util.JSON.decode(temp);
                if (State_Color.success) {
                    Ext.util.CSS.swapStyleSheet('theme', themecombo.getValue());
                }
            }
        }
    });
    var closeButton = new Ext.Button({
        iconCls: 'home-icon',

        iconAlign: 'left',

        pressed: true,
        arrowAlign: 'right',
        renderTo: 'closeDiv',
        handler: function () {
            

            window.location.href = '../../index.aspx';
            //'<% Response.Write("{success:false,msg}")%>';
        }
    });
    //-----------------------------------------------------------------------------整体面板布局的实现
    var northPanel = new Ext.Panel({
        title: "云平台管理系统", //实际应用中，通常去掉该属性。
        region: 'north', //北部，即顶部，上面
        contentEl: 'north-div', //面板包含的内容
        layout: 'fit',
        split: true,
        height: 80,
        minSize: 60, maxSize: 150,
        //  items: [themecombo],
        // border: false, //当面板内容超出面板大小时，是否显示边框
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
            iconCls: 'money_box', //字面板样式UserManageTree
            items: [PrjTypetrees]
        },/* {
            title: '用户管理',
            layout: 'fit',
            iconCls: 'money_box', //字面板样式
            items: [UserManageTree]
        },*/ {
            title: "系统维护",
            layout: 'fit',
            border: false, autoScroll: true, iconCls: "Icon",
            items: [PrjMembertree]
        }, {
            title: "日志维护",
            layout: 'fit',
            border: false, autoScroll: true, iconCls: "Icon",
            items: [Systemlogbertree]
        }
        //autoLoad:{url:"xx.htm",scripts:true}//面板的内容是指向一个*.htm，scripts:true 是表示支持包含文件里面的js脚本
                ]
    });
    //页面的右边
    //    var eastPanel = new Ext.Panel({
    //        region: "east",
    //        title: "右边",
    //        collapsible: true,
    //        collapsed: true,
    //        //collapsed:true,//是否显示
    //        split: true,
    //        width: 225,
    //        minSize: 175, maxSize: 400, layout: "fit", margins: "0 5 0 0",
    //        layout: "accordion", iconCls: "my-toolPanelIcon", layoutConfig: { animate: true }
    //    });
    //---------------------------------------------页面的底部
    //    var southPanel = new Ext.Panel({
    //        title: '底部面板',
    //        split: true,
    //        region: "south",
    //        split: true, height: 80, minSize: 60, maxSize: 150, collapsible: true, collapsed: true,
    //        title: "底栏",
    //        margins: "0 0 0 0"
    //    });
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

