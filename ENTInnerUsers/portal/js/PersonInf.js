var RoleListArrayStore = new Ext.data.ArrayStore({
    url: '../PDM/prjManege/GroupMemberArraryStoreData.aspx',
    autoLoad: { params: { type: 'role'} },
    fields: ['ID', 'Name'],
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});
var DepartListArrayStore = new Ext.data.ArrayStore({
    url: '../PDM/prjManege/GroupMemberArraryStoreData.aspx',
    autoLoad: { params: { type: 'DepartList'} },
    fields: ['ID', 'Name'],
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});

var FirstRoleCombo = new Ext.form.ComboBox({
    store: RoleListArrayStore,
    fieldLabel: "第一角色",
    valueField: 'ID',
    name: "FirstRole",
    readOnly: true,
    submitValue: false,
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});
var SecondRoleCombo = new Ext.form.ComboBox({
    store: RoleListArrayStore,
    fieldLabel: "第二角色",
    allowBlank: false,
    valueField: 'ID',
    name: "SecondRole",
    submitValue: false,
    readOnly: true,
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});
var DepartListCombo = new Ext.form.ComboBox({
    store: DepartListArrayStore,
    fieldLabel: "归属部门",
    allowBlank: false,
    valueField: 'ID',
    submitValue: false,
    readOnly: true,
    name: "Depart",
    displayField: 'Name', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 100
});



var rolesexstore = new Ext.data.SimpleStore({
    fields: ['id', 'sex'],
    data: [['0', '男'], ['1', '女']]
});
var educationstore = new Ext.data.SimpleStore({
    fields: ['id', 'type'],
    data: [['0', '小学'], ['1', '初中'], ['2', '高中'], ['3', '职高'], ['10', '技校'], ['4', '中专'], ['5', '大专'], ['6', '本科'], ['7', '研究生'], ['8', '博士'], ['9', '博士后']]
});
var PersonInfEditPanel = new Ext.FormPanel({
    shadow: false,
    labelWidth: 80,
    labelAlign: 'right',
    frame: false,
    layout: "form",
    width: 300,
    defaultType: 'textfield',
    reader: new Ext.data.JsonReader({ root: 'Root' },
			[{ name: 'Uid', mapping: '人员ID' },
			 { name: 'id', mapping: '人员编号' },
             { name: 'peoplename', mapping: '人员名称' },
			 { name: 'Microblog', mapping: 'Microblog' },
			 { name: 'sex', mapping: '性别' },
			 { name: 'birthday', mapping: '出生年月' },
			 { name: 'education', mapping: '学历' },
			 { name: 'mobilenumber', mapping: '移动电话' },
			 { name: 'fixtelephone', mapping: '固定电话' },
			 { name: 'Email', mapping: 'Email' },
			 { name: 'QQ', mapping: 'QQ号' },
			 { name: 'address', mapping: '通讯地址' },
			 { name: 'comeDate', mapping: '进厂日期' },
             { name: 'Depart', mapping: '归属部门' },
			 { name: 'FirstRole', mapping: '归属角色' },
			 { name: 'SecondRole', mapping: '第二角色' },
             { name: 'archive', mapping: '档案号' },
			 { name: 'training', mapping: '培训情况' },
			 { name: 'secretnumber', mapping: '密码' },
			 { name: 'description', mapping: '添加时间'}]),
    items: [{
        //fieldLabel: '人员编号',
        width: 150,
        allowBlank: false,
        hidden: true,
        name: 'Uid'
    }, {
        fieldLabel: '人员编号',
        width: 150,
        allowBlank: false,
        name: 'id'
    }, {
        fieldLabel: '人员名称',
        name: 'peoplename',
        width: 150,
        allowBlank: false, //是否允许为空！false不允许  
        blankText: "不允许为空", //提示信息  
        //regex:'/[/u4e00-/u9fa5]/',//正则表达式  
        regexText: "只能为中文"
    }, {
        fieldLabel: '我的微薄',
        name: 'Microblog',
        width: 150,
        allowBlank: false, //是否允许为空！false不允许  
        blankText: "不允许为空", //提示信息  
        //regex:'/[/u4e00-/u9fa5]/',//正则表达式  
        regexText: "只能为中文"
    }, {
        fieldLabel: '性别',
        xtype: 'combo',
        mode: 'local',
        store: rolesexstore,
        displayField: 'sex',
        triggerAction: 'all',
        // submitValue:false,
        forceSelesction: true,
        allowBlank: false,
        name: 'sex',
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '出生年月',
        width: 150,
        name: 'birthday',
        xtype: 'datefield',
        format: 'Y-m-d H:i:s',
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '学历',
        name: 'education',
        xtype: 'combo',
        mode: 'local',
        store: educationstore,
        // submitValue: false,
        displayField: 'type',
        triggerAction: 'all',
        forceSelesction: true,
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '移动电话',
        name: 'mobilenumber',
        width: 150,
        allowBlank: false,
        regex: /^[1]+[1,2,3,4,5,6,7,8,9]+\d{9}/,
        regexText: "电话格式错误",
        blankText: "不允许为空"
    }, {
        fieldLabel: '固定电话',
        name: 'fixtelephone',
        width: 150
    }, {
        fieldLabel: 'Email',
        width: 150,
        allowBlank: false,
        regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        regexText: "邮件地址格式错误",
        name: 'Email'
    }, {
        fieldLabel: 'QQ号',
        name: 'QQ',
        width: 150,
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '通讯地址',
        name: 'address',
        width: 150
    }, {
        fieldLabel: '进厂日期',
        xtype: 'datefield',
        format: 'Y-m-d H:i:s',
        width: 150,
        maxValue: new Date(),
        maxText: "不能大于当前日期",
        name: 'comeDate',
        allowBlank: false,
        blankText: "不允许为空"
    }, DepartListCombo, FirstRoleCombo, SecondRoleCombo, {
        fieldLabel: '档案号',
        readOnly: true,
        name: 'archive',
        width: 150,
        submitValue: false,
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '培训情况',
        name: 'training',
        width: 150,
        allowBlank: false,
        blankText: "不允许为空"
    }, {
        fieldLabel: '密码',
        width: 150,
        name: 'secretnumber',
        allowBlank: false,
        blankText: "不允许为空"
    }]
});

PersonInfEditPanel.load({
    url: 'DataProcess.aspx',
    params: { OperarteType: 'PersonInf' },
    success: function (form, action) { //加载成功的处理函数  
        PersonInfEditPanel.load(Ext.util.JSON.decode(action.response.responseText));

    }
});
PersonInfEditPanel.doLayout(); 

