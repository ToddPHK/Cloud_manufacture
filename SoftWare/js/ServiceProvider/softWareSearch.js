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
Ext.apply(Ext.form.VTypes, {
    StartEndTime: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
        if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
            var pwd = Ext.get(field.confirmTo); //取得confirmTo的那个id的值
            return (val > pwd.getValue());
        }
        return true;
    }
});
var SoftWareRegStartTime_Search = new Ext.form.DateField({//注册起始时间
    fieldLabel: "注册时间",
    width: 140,
    id: "SoftWareRegStartTime_Search",
    format: 'Y-m-d H:i:s'
});
var SoftWareRegEndTime_Search = new Ext.form.DateField({//注册结束时间
    fieldLabel: "至",
    width: 140,
    vtype: "StartEndTime", //自定义的验证类型
    vtypeText: "起始时间必须大于结束时间！",
    confirmTo: "SoftWareRegStartTime_Search", //要比较的另外一个的组件的id
    format: 'Y-m-d H:i:s'
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
var Choose_store = new Ext.data.SimpleStore({
    fields: ['id', 'type'],
    data: [['1', '是'], ['0', '否']]
});
var GiveTraining_Search = new Ext.form.ComboBox({//提供培训
    fieldLabel: "提供培训",
    store: Choose_store,
    valueField: 'id',
    displayField: 'type', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 140
});
var GiveDeploy_Search = new Ext.form.ComboBox({//提供部署
    fieldLabel: "提供部署",
    store: Choose_store,
    valueField: 'id',
    displayField: 'type', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 140
});
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
        }, {
            layout: "form",
            items: [SoftWareLaug_Search]
        }]
    }, { // 行2
        layout: "column",
        items: [{
            layout: "form",
            items: [SoftWareRegStartTime_Search]
        }, {
            layout: "form",
            items: [SoftWareRegEndTime_Search]
        }, {
            layout: "form",
            items: [SoftWareKeyWord_Search]
        }, {
            layout: "form",
            items: [GiveTraining_Search]
        }, {
            layout: "form",
            items: [GiveDeploy_Search]
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


        SoftWareTabletore.baseParams.SoftWareLaug = SoftWareLaug_Search.getValue();
        SoftWareTabletore.baseParams.SoftWareKeyWord = SoftWareKeyWord_Search.getRawValue();
        SoftWareTabletore.baseParams.SoftWareRegStartTime = SoftWareRegStartTime_Search.getRawValue();
        SoftWareTabletore.baseParams.SoftWareRegEndTime = SoftWareRegEndTime_Search.getRawValue();

        SoftWareTabletore.baseParams.GiveTraining = GiveTraining_Search.getValue();
        SoftWareTabletore.baseParams.GiveDeploy = GiveDeploy_Search.getValue();


        SoftWareTabletore.baseParams.OperateType = "SoftWareSearch";
        SoftWareTabletore.load();
        SoftWareTablepageBar.changePage(1);


    }

}