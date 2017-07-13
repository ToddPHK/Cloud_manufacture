var OperateType = null;
var SoftWarepagesize = 25;

//----------------------------------------------------
Ext.QuickTips.init();



var SoftWare_TwoBar = new Ext.Toolbar({
    items: [{
        text: "删除",
        iconCls: 'delete-icon',
        handler: DeleteFromStore

    }, {
        text: "通过",
        iconCls: 'add-icon',
        handler: PassApply

    }
    , {
        text: "不通过",
        iconCls: 'add-icon',
        handler: NoPassApply

    }]

});


function PassApply() {


    if (!SoftWareTablepanel_sm.hasSelection())//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择数据！");
    }
    else {
        var IDS = [];
        var rows = SoftWareTablepanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("状态") != 1) {
                Ext.Msg.alert('提示框', "ID为[" + rows[i].get("ID") + "]的记录不能进行审核操作！");
                return;
            }

            else
                IDS.push(rows[i].get("ID"));
        }

        var conn = new Ext.data.Connection();
        conn.request({
            //请求的 Url  
            url: 'DataProcess.aspx',
            // 传递的参数  
            params: { OperateType: 'PassApply', IDS: IDS.join() },
            method: 'post',
            scope: this,
            //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
            callback: function (options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象
                if (result.success) {
                    App.setAlert(App.STATUS_NOTICE, '操作成功');
                    SoftWareTabletore.reload();
                }
                else {

                    App.setAlert(App.STATUS_NOTICE, '操作失败！');

                }


            }
        });
    }
}

function NoPassApply() {


    if (!SoftWareTablepanel_sm.hasSelection())//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择数据！");
    }
    else {
        var IDS = [];
        var rows = SoftWareTablepanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("状态") != 1) {
                Ext.Msg.alert('提示框', "ID为[" + rows[i].get("ID") + "]的记录不能进行审核操作！");
                return;
            }

            else
                IDS.push(rows[i].get("ID"));
        }

        var conn = new Ext.data.Connection();
        conn.request({
            //请求的 Url  
            url: 'DataProcess.aspx',
            // 传递的参数  
            params: { OperateType: 'NoPassApply', IDS: IDS.join() },
            method: 'post',
            scope: this,
            //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
            callback: function (options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象
                if (result.success) {

                    App.setAlert(App.STATUS_NOTICE, '删除成功');
                    SoftWareTabletore.reload();
                }
                else {

                    App.setAlert(App.STATUS_NOTICE, '记录删除失败！');

                }


            }
        });
    }
}


//-------------------------------------------根据传入的参数进行后台数据的添加，删除，编辑操作

function DeleteFromStore() {

    if (!SoftWareTablepanel_sm.hasSelection())//没有选择任务
    {
        App.setAlert(App.STATUS_NOTICE, " 你还没有选择数据！");
    }
    else {
        var IDS = [];
        var rows = SoftWareTablepanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {
            IDS.push(rows[i].get("ID"));
        }

        var conn = new Ext.data.Connection();
        conn.request({
            //请求的 Url  
            url: 'DataProcess.aspx',
            // 传递的参数  
            params: { OperateType: 'DeleteFromStore', IDS: IDS.join() },
            method: 'post',
            scope: this,
            //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
            callback: function (options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象
                if (result.success) {
                    if (result.HasNoDelete)
                        Ext.Msg.alert('提示', 'ID为[' + result.NoDeleteID + ']不能进行删除操作');
                    else
                        App.setAlert(App.STATUS_NOTICE, '删除成功');
                    SoftWareTabletore.reload();
                }
                else {

                    App.setAlert(App.STATUS_NOTICE, '记录删除失败！');

                }


            }
        });
    }
}

var proxy = new Ext.data.HttpProxy({
    url: 'SoftWareData.aspx'
    //method: 'GET'
});

var SoftWareTablereader = new Ext.data.JsonReader(
                    { root: 'rows', totalProperty: 'results' },
                        [
                         { name: "软件编号" },
                          { name: "软件名称" },
                         { name: "软件版本" },
                         { name: "版本发布日期" },
//  { name: "软件负责人" },
                         {name: "开发企业" },
                         { name: "咨询电话" },
                         { name: "软件官方网站" },
                         { name: "系统环境" },
                         { name: "软件语言" },
                         { name: "软件模式" },
                         { name: "软件类别" },
                         { name: "是否对平台公开" },
                         { name: "帮助文档地址" },
                         { name: "链接地址" },
                         { name: "提供培训服务" },
                         { name: "提供部署服务" },
                         { name: "资源简介" },
                         { name: "授权方式" },
                         { name: "其他参数信息" },
                         { name: "注意事项" },
                         { name: "企业编号" },
                         { name: "共享方式" },
                         { name: "其他参数信息" },
                         { name: "ProviderEntName" },
//  { name: "是否可链接" },
                         {name: "注册时间" },
                         { name: "图片" },
                         { name: "使用次数" },
//-------------------------
                         {name: "状态" },
                         { name: "加入时间" },
                         { name: "申请时间" },
                         { name: "审核时间" },
                         { name: "用户名" },
                         { name: "密码" },
                         { name: "起止日期" },
                         { name: "终止日期" },
                         { name: "ApplyEntName" },
                          { name: "userName" },
                         { name: "ID" }
                        ]
                    );

var SoftWareTabletore = new Ext.data.Store(
                        { id: 'SoftWareTabletoreid', proxy: proxy, reader: SoftWareTablereader }
                    );
var SoftWareTablepageBar = new Ext.PagingToolbar({
    store: SoftWareTabletore,
    pageSize: SoftWarepagesize,

    displayInfo: true,
    displayMsg: '总记录数 {0} - {1} of {2}',
    emptyMsg: "没有记录",
    id: 'SoftWareTablepageBar',
    plugins: new Ext.ui.plugins.ComboPageSize()
    //   items: [SoftWareTablepagesizecombo]
});
var SoftWareTablepanel_sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
var SoftWareTablepanel = new Ext.grid.GridPanel({
    title: '软件购买审核',
    id: "SoftWareTablepanel",
    region: 'center',
    frame: true,
    store: SoftWareTabletore,
    tbar: SoftWare_TwoBar,

    bbar: SoftWareTablepageBar,
    sm: SoftWareTablepanel_sm,
    loadMask: true,
    //    listeners: {//监听
    //        "rowdblclick": AddToMyStore


    //    },
    columns: [
                    new Ext.grid.RowNumberer(),
                   SoftWareTablepanel_sm,
                    { header: 'ID', dataIndex: '软件编号', width: 50, sortable: true },
                    { header: '软件名称', dataIndex: '软件名称', sortable: true },
    //---------------------------------------------------------------------
                    {header: '状态', dataIndex: '状态', width: 50, renderer: showStateText, sortable: true },
                    { header: '申请用户名', dataIndex: '用户名', align: 'center', sortable: true },
                    { header: '申请密码', dataIndex: '密码', width: 70, sortable: true },
                    { header: '起始日期', dataIndex: '起止日期', sortable: true },
                    { header: '终止日期', dataIndex: '终止日期', sortable: true },
                    { header: '申请时间', dataIndex: '申请时间', sortable: true },
                    { header: '加入时间', dataIndex: '加入时间', sortable: true },
                    { header: '审核时间', dataIndex: '审核时间', sortable: true },
                    { header: '申请企业', dataIndex: 'ApplyEntName', sortable: true },
                    { header: '企业登录名', dataIndex: 'userName', sortable: true },
    //-----------------------------------------------------
                    {header: '发布企业', dataIndex: 'ProviderEntName', sortable: true },
                    { header: '软件类别', dataIndex: '软件类别', width: 70, align: 'center', sortable: true },
                    { header: '开发企业', dataIndex: '开发企业', sortable: true },
                    { header: '软件版本', dataIndex: '软件版本', sortable: true },
                    { header: '版本发布日期', dataIndex: '版本发布日期', sortable: true },
                    { header: '咨询电话', dataIndex: '咨询电话', sortable: true },
                    { header: '帮助文档地址', dataIndex: '帮助文档地址', renderer: showWebSite, sortable: true },
                    { header: '链接地址', dataIndex: '链接地址', renderer: showWebSite, sortable: true },
                    { header: '提供培训', dataIndex: '提供培训服务', renderer: showSuspend, width: 70, align: 'center', sortable: true },
                    { header: '提供部署', dataIndex: '提供部署服务', renderer: showSuspend, width: 70, align: 'center', sortable: true },
                    { header: '授权方式', dataIndex: '授权方式', sortable: true },
                    { header: '软件官方网站', dataIndex: '软件官方网站', renderer: showWebSite, sortable: true },
                    { header: '系统环境', dataIndex: '系统环境', sortable: true },
                    { header: '软件语言', dataIndex: '软件语言', sortable: true },
                    { header: '软件模式', dataIndex: '软件模式', sortable: true },
                    { header: '其他参数信息', dataIndex: '其他参数信息', sortable: true },
                    { header: '注册时间', dataIndex: '注册时间', sortable: true }
            ]
});
function showWebSite(val) {
    return '<a href="' + val + '" target=_blank>' + val + '</a>';
}
function showSuspend(val) {
    if (val)
        return "是";
    else
        return "否";
}
function showStateText(val) {
    if (val == 0)
        return "初始";
    else if (val == 1)
        return "待审核";
    else if (val == 2)
        return "通过";
    else if (val == 3)
        return "不通过";

}
SoftWareTablepanel.on('render', function (taskTablePanel) {
    var store = taskTablePanel.getStore();  // Capture the Store.    

    var view = taskTablePanel.getView();    // Capture the GridView.    

    taskTablePanel.tip = new Ext.ToolTip({
        target: view.mainBody,    // The overall target element.    

        delegate: '.x-grid3-row', // Each grid row causes its own seperate show and hide.    

        trackMouse: true,         // Moving within the row should not hide the tip.    

        renderTo: document.body,  // Render immediately so that tip.body can be referenced prior to the first show.    

        listeners: {              // Change content dynamically depending on which element triggered the show.    

            beforeshow: function updateTipBody(tip) {
                var rowIndex = view.findRowIndex(tip.triggerElement);
                tip.body.dom.innerHTML = '资源简介：<br>' + unescape(store.getAt(rowIndex).get('资源简介'));
            }
        }
    });
});
SoftWareTabletore.load({ params: { start: 0, limit: SoftWarepagesize} });

function SetPanelValue(rec) {

}