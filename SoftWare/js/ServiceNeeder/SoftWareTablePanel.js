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
        text: "申请",
        iconCls: 'add-icon',
        handler: ShowApplyWin

    }, {
        text: "&nbsp&nbsp&nbsp&nbsp",

        iconCls: 'dogo-icon',
        handler: LinkSoftWare

    }, '->', {
       // text: "主页",
        iconCls: 'home-icon',
        tooltip:'返回平台首页',
        handler: function () {
            window.document.location = '../../../../index.aspx';
        }

    }]

});
/**      
* 对Date的扩展，将 Date 转化为指定格式的String      
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
* eg:      
* (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423      
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
*/
Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//var date = new Date();
//window.alert(date.pattern("yyyy-MM-dd hh:mm:ss"));

function LinkSoftWare() {
    if (!SoftWareTablepanel_sm.hasSelection())//没有选择任务
    {


        App.setAlert(App.STATUS_NOTICE, " 你还没有选择记录！");
    }
    else {
        var rec = SoftWareTablepanel_sm.getSelected();
        if (rec.get("状态") != 2) {
            App.setAlert(App.STATUS_NOTICE, " 当前软件的状态你不能使用！");
        }
        else {
            var dateNow = new Date().pattern("yyyy-MM-dd hh:mm:ss");
            if (rec.get("起止日期") < dateNow && dateNow < rec.get("终止日期")) {
                window.open(rec.get("链接地址"));
                var conn = new Ext.data.Connection();
                conn.request({
                    //请求的 Url  
                    url: 'DataProcess.aspx',
                    // 传递的参数  
                    params: { OperateType: 'CountAdd', ID: rec.get("软件编号") },
                    method: 'post',
                    scope: this,
                    //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
                    callback: function (options, success, response) {
//                        var result = Ext.util.JSON.decode(response.responseText); //解码响应字符串为JSON对象

                    }
                });

            }
            else if (dateNow > rec.get("终止日期")) {
                Ext.Msg.alert('提示', "使用期已过！");
            }
            else if (dateNow < rec.get("起止日期")) {
                Ext.Msg.alert('提示', "还未到您可使用的日期！");
            }

        }
    }
}

function ShowApplyWin() {


    if (!SoftWareTablepanel_sm.hasSelection())//没有选择任务
    {


        App.setAlert(App.STATUS_NOTICE, " 你还没有选择记录！");
    }
    else {
        var rows = SoftWareTablepanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("状态") != 0 && rows[i].get("状态") != 3) {
                Ext.Msg.alert('提示框', "ID为[" + rows[i].get("ID") + "]的记录不能进行申请操作！");
                return;
            }

        }
        Apply_Window.show();
    }
}
Ext.apply(Ext.form.VTypes, {
    StartEndTime: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
        if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
            var pwd = Ext.get(field.confirmTo); //取得confirmTo的那个id的值
            return (val > pwd.getValue());
        }
        return true;
    }
});
var SoftWareApplyStartTime_Apply = new Ext.form.DateField({//注册起始时间
    fieldLabel: "起始时间",
    width: 150,
    id: "SoftWareApplyStartTime_Apply",
    name: 'ApplyStartTime',
    minValue: new Date(),
    minText: "不能小于当前日期",
    allowBlank: false,
    format: 'Y-m-d H:i:s'
});
var SoftWareApplyEndTime_Apply = new Ext.form.DateField({//注册结束时间
    fieldLabel: "结束时间",
    width: 150,
    allowBlank: false,
    name: 'ApplyEndTime',
    vtype: "StartEndTime", //自定义的验证类型
    vtypeText: "起始时间必须大于结束时间！",
    confirmTo: "SoftWareApplyStartTime_Apply", //要比较的另外一个的组件的id
    format: 'Y-m-d H:i:s'
});
var UserName_Apply = new Ext.form.TextField({//软件语言
    fieldLabel: "申请用户名",
    name: 'ApplyUserName',
    allowBlank: false,
    regex: /[(A-Z)|(a-z)]{5,12}/,
    regexText: "只能输入5-12个字母",
    width: 150
});
var PassWord_Apply = new Ext.form.TextField({//关键词
    fieldLabel: "申请密码",
    name: 'ApplyPassWord',
    allowBlank: false,
    regex: /[\x21-\x7E]{6,12}/,
    regexText: "只能输入由数字、26个英文字母组成的字符串,长度在6~12之间",
    width: 150
});
var ApplyPanel = new Ext.form.FormPanel({
    height: 200,
    autoScroll: true,
    frame: false,
    layout: "form", // 整个大的表单是form布局
    border: false,
    labelAlign: "right",
    bodyStyle: 'padding:10px',
    items: [UserName_Apply, PassWord_Apply, SoftWareApplyStartTime_Apply, SoftWareApplyEndTime_Apply]


});
var Apply_Window = new Ext.Window({
    title: '软件申请',
    width: 320,
    height: 220,
    resizable: false,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    closeAction: 'hide',
    buttonAlign: 'center',
    items: ApplyPanel,
    buttons: [{
        text: '确认',
        handler: ApplySoftware
    }, {
        text: '关闭',
        handler: function () { Apply_Window.hide(); }
    }]
});
function ApplySoftware() {
    if (ApplyPanel.form.isValid()) {
        var IDS = [];
        var rows = SoftWareTablepanel_sm.getSelections();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get("状态") != 0 && rows[i].get("状态") != 3) {
                Ext.Msg.alert('提示框', "ID为[" + rows[i].get("ID") + "]的记录不能进行申请操作！");
                return;
            }

            else
                IDS.push(rows[i].get("ID"));
        }
        ApplyPanel.getForm().submit({
            url: 'DataProcess.aspx',
            params: { OperateType: 'ApplySoftware', IDS: IDS.join() },
            method: 'GET',
            success: function (form, action) {
                Ext.Msg.alert('提示框', action.result.msg);
                SoftWareTabletore.reload();
                Apply_Window.hide();
            },
            failure: function () {
                Ext.Msg.alert('提示', action.result.msg);
            }
        })
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
                          { name: "userName" },
                         { name: "用户名" },
                         { name: "密码" },
                         { name: "起止日期" },
                         { name: "终止日期" },
                         { name: "审核时间" },
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
    title: '软件列表',
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
                    { header: 'ID', dataIndex: '软件编号', width: 30, sortable: true },
                    { header: '软件名称', dataIndex: '软件名称', sortable: true },
    //---------------------------------------------------------------------
                    {header: '状态', dataIndex: '状态', width: 40, renderer: showStateText, sortable: true },
                    { header: '申请用户名', dataIndex: '用户名', align: 'center', sortable: true },
                    { header: '申请密码', dataIndex: '密码', sortable: true },
                    { header: '起始日期', dataIndex: '起止日期', sortable: true },
                    { header: '终止日期', dataIndex: '终止日期', sortable: true },
                    { header: '申请时间', dataIndex: '申请时间', sortable: true },
                    { header: '加入时间', dataIndex: '加入时间', sortable: true },
                    { header: '审核时间', dataIndex: '审核时间', sortable: true },
    //-----------------------------------------------------
                    {header: '发布企业', dataIndex: 'ProviderEntName', sortable: true },
                    { header: '软件类别', dataIndex: '软件类别', width: 70, align: 'center', sortable: true },
                    { header: '开发企业', dataIndex: '开发企业', sortable: true },
                    { header: '软件版本', dataIndex: '软件版本', sortable: true },
                    { header: '版本发布日期', dataIndex: '版本发布日期', sortable: true },
                    { header: '咨询电话', dataIndex: '咨询电话', sortable: true },
                    { header: '帮助文档地址', dataIndex: '帮助文档地址', renderer: showWebSite, sortable: true },
                  //  { header: '链接地址', dataIndex: '链接地址', renderer: showWebSite, sortable: true },
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