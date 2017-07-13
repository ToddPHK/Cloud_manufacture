var SoftWareClass_store = new Ext.data.SimpleStore({
    fields: ['id', 'type'],
    data: [['0', '管理类'], ['1', '设计类'], ['2', '制造类'], ['3', '仿真类']]
});
var SoftWareName_Search = new Ext.form.TextField({
    fieldLabel: "软件名称",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});

var SoftWareEnt_Search = new Ext.form.TextField({//软件归属企业
    fieldLabel: "发布企业",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});
var SoftWareEvir_Search = new Ext.form.TextField({//系统环境
    fieldLabel: "系统环境",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});
var SoftWareClass_Search = new Ext.form.ComboBox({
    fieldLabel: "软件类别",
    store: SoftWareClass_store,
    valueField: 'id',
    displayField: 'type', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 140
});

var SoftWareLaug_Search = new Ext.form.TextField({//软件语言
    fieldLabel: "软件语言",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});
var SoftWareKeyWord_Search = new Ext.form.TextField({//关键词
    fieldLabel: "关键词",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});
//------------------------------------------------

var MySoftWareApplyStartTime_Search = new Ext.form.DateField({//注册起始时间
    fieldLabel: "申请时间",
    id: 'SoftWareApplyStartTime_Search',
    width: 140,
    format: 'Y-m-d H:i:s'
});
var MySoftWareApplyEndTime_Search = new Ext.form.DateField({//注册结束时间
    fieldLabel: "至",
    width: 140,
    vtype: "StartEndTime", //自定义的验证类型
    vtypeText: "起始时间必须大于结束时间！",
    confirmTo: "SoftWareApplyStartTime_Search", //要比较的另外一个的组件的id
    format: 'Y-m-d H:i:s'
});
var MyChoose_store = new Ext.data.SimpleStore({
    fields: ['id', 'type'],
    data: [['0', '初始'], ['1', '待审核'], ['2', '通过'], ['3', '不通过']]
});
var MyStatus_Search = new Ext.form.ComboBox({//提供培训
    fieldLabel: "状态",
    store: MyChoose_store,
    valueField: 'id',
    displayField: 'type', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 140
});
var MyUserName_Search = new Ext.form.TextField({//软件语言
    fieldLabel: "申请用户名",
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    width: 140
});
//------------------------------------------------------------
var SearchPanel = new Ext.form.FormPanel({
    height: 200,
    autoScroll: true,
    frame: true,
    layout: "form", // 整个大的表单是form布局
    buttonAlign: 'center',
    labelAlign: "right",
    buttons: [{
        text: '搜索',
        handler: SoftWareSearch
    }],
    items: [{
        xtype: 'fieldset',
        title: '软件信息',
        collapsible: true, //可折叠
        height: 50,
        labelWidth: 65,
        labelSeparator: ':',
        autoWidth: true,
        labelAlign: 'left',
        items: [{ // 行2
            layout: "column",
            items: [{
                layout: "form",
                items: [SoftWareName_Search]
            }, {
                layout: "form",
                items: [SoftWareEnt_Search]
            }, {

                layout: "form",
                items: [SoftWareEvir_Search]
            }, {
                layout: "form",
                items: [SoftWareClass_Search]
            },  {
                layout: "form",
                items: [SoftWareKeyWord_Search]
            }]
        }]
    }, {
        xtype: 'fieldset',
        title: '申请信息',
        collapsible: true, //可折叠
        height: 50,
        labelWidth: 65,
        labelSeparator: ':',
        autoWidth: true,
        labelAlign: 'left',
        items: [{ // 行2
            layout: "column",
            items: [{
                layout: "form",
                items: [MySoftWareApplyStartTime_Search]
            }, {
                layout: "form",
                items: [MySoftWareApplyEndTime_Search]
            }, {

                layout: "form",
                items: [MyStatus_Search]
            }, {
                layout: "form",
                items: [MyUserName_Search]
            }]
        }]
    }]

});
function SoftWareSearch() {
    if (SearchPanel.form.isValid())//判断是否通过客户端验证
    {


        SoftWareTabletore.removeAll();
        SoftWareTabletore.baseParams.SoftWareName = SoftWareName_Search.getValue()
        SoftWareTabletore.baseParams.SoftWareEnt = SoftWareEnt_Search.getValue();
        SoftWareTabletore.baseParams.SoftWareEvir = SoftWareEvir_Search.getValue();
        SoftWareTabletore.baseParams.SoftWareClass = SoftWareClass_Search.getRawValue();
        SoftWareTabletore.baseParams.SoftWareKeyWord = SoftWareKeyWord_Search.getRawValue();

        SoftWareTabletore.baseParams.MySoftWareApplyStartTime = MySoftWareApplyStartTime_Search.getRawValue();
        SoftWareTabletore.baseParams.MySoftWareApplyEndTime = MySoftWareApplyEndTime_Search.getRawValue();
        SoftWareTabletore.baseParams.MyStatus = MyStatus_Search.getValue();
        SoftWareTabletore.baseParams.MyUserName = MyUserName_Search.getRawValue();


        SoftWareTabletore.baseParams.OperateType = "SoftWareSearch";
        SoftWareTabletore.load();
        SoftWareTablepageBar.changePage(1);


    }

}