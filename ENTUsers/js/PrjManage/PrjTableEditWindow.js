var employeeArrayStore = new Ext.data.ArrayStore({
    url: '../ComboxData.aspx',
    autoLoad: { params: { OperateType: 'allemployee'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var employeeListCombo = new Ext.form.ComboBox({
    store: employeeArrayStore,
    readOnly:true,
    fieldLabel: '负责人',
     valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
});


var ProjectState_Store = new Ext.data.ArrayStore({
    url: '../ComboxData.aspx',
    autoLoad: { params: { OperateType: 'ProjectState'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var ProjectState_Combo = new Ext.form.ComboBox({
    store: ProjectState_Store,
    readOnly: true,
    fieldLabel: '项目状态',
    valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
});



var ProjectType_Store = new Ext.data.ArrayStore({
    url: '../ComboxData.aspx',
    autoLoad: { params: { OperateType: 'ProjectType'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var ProjectType_Combo = new Ext.form.ComboBox({
    store: ProjectType_Store,
    readOnly: true,
    fieldLabel: '项目类型',
     valueField: 'value',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
});



var NewPrjFormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    layout: "form", // 整个大的表单是form布局
    labelAlign: "right",
    items: [{ // 行2
        layout: "column",
        items: [{
            fieldLabel: 'id',
            name: 'id',
            xtype: 'hidden'
        }, {

            layout: "form",
            items: [{
                xtype: "textfield",
                readOnly: true,
                fieldLabel: "项目名称",
                name: 'prjName',
                width: 110
            }]
        }, {

            layout: "form",
            items: [employeeListCombo]
        }, {

            layout: "form",
            items: [{
                xtype: "textfield",
                readOnly: true,
                fieldLabel: "项目客户",
                name: 'prjCustomer',
                width: 110
            }]
        }]
    }, { // 行2
        layout: "column",
        items: [{
            layout: "form",
            items: [{
                xtype: "textfield",
                fieldLabel: "项目编号",
                readOnly: true,
                name: 'prjCodeNumber',
                width: 110
            }]
        }, {
            layout: "form",
            items: [ProjectState_Combo]
        }, {

            layout: "form",
            items: [ProjectType_Combo]

        }]
    }, { // 行2
        layout: "column",
        items: [{
            layout: "form",
            items: [{
                xtype: "datefield",
                readOnly: true,
                fieldLabel: "项目计划开始日期",
                format: 'Y-m-d H:i:s',
                name: 'prjPlanStartDate',
                width: 150
            }]
        }, {
            layout: "form",
            items: [{
                xtype: "datefield",
                readOnly: true,
                fieldLabel: "项目计划结束日期",
                format: 'Y-m-d H:i:s',
                name: 'prjPlanEndDate',
                width: 150
            }]
        }]
    },/* {// 行5
        layout: "column",
     items: [{
         layout: "form",
         items: [{
             xtype: "datefield",
             fieldLabel: "项目实际开始日期",
             format: 'Y-n-j H:i:s',
             name: 'prjActualStartDate',
             width: 150
         }]
     }, {

         layout: "form",
         items: [{
             xtype: "datefield",
             fieldLabel: "项目实际结束日期",
             format: 'Y-n-j H:i:s',
             name: 'prjActualEndtDate',
             width: 150
         }]

     }]
    },*/{// 行5
        layout: "form",
        items: [{
             xtype: "htmleditor",
             fieldLabel: "项目简介",
             readOnly: true,
            // enableLists: false,
            plugins: [new Ext.form.HtmlEditor.MidasCommand(), new Ext.form.HtmlEditor.Table(), new Ext.form.HtmlEditor.SpecialCharacters()],
            name: 'prjIntoduction',
            enableSourceEdit: false,
            width: 600,
            height: 150
        }]
    }]

});
var prjEdit_Window = new Ext.Window({
    layout: 'fit',
    width: 750,
    minHeight: 200,
    modal: true,
    closeAction: "hide",
    plain: true,
    title: '编辑对话框',
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: NewPrjFormPanel
});





