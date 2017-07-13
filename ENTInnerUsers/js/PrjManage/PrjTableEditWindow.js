var employeeArrayStore = new Ext.data.ArrayStore({
    url: 'GroupMemberArraryStoreData.aspx',
    autoLoad: { params: { type: 'allemployee'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var employeeListCombo = new Ext.form.ComboBox({
    store: employeeArrayStore,
    fieldLabel: '负责人',
    editable: true,
    allowBlank: false,
    valueField: 'value',
    hiddenName: 'prjChargePeople',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
});


var ProjectState_Store = new Ext.data.ArrayStore({
    url: 'GroupMemberArraryStoreData.aspx',
    autoLoad: { params: { type: 'ProjectState'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var ProjectState_Combo = new Ext.form.ComboBox({
    store: ProjectState_Store,
    fieldLabel: '项目状态',
    valueField: 'value',
    hiddenName: 'prjState',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
});



var ProjectType_Store = new Ext.data.ArrayStore({
    url: 'GroupMemberArraryStoreData.aspx',
    autoLoad: { params: { type: 'ProjectType'} },
    fields: ['value', 'text'],
    sortInfo: {
        field: 'value',
        direction: 'ASC'
    }
});
var ProjectType_Combo = new Ext.form.ComboBox({
    store: ProjectType_Store,
    fieldLabel: '项目类型',
    valueField: 'value',
    hiddenName: 'prjType',
    displayField: 'text', //store字段中你要显示的字段，多字段必选参数，默认当mode为remote时displayField为undefine，当select列表时displayField为"text"
    mode: 'local', //因为data已经取数据到本地了，所以'local',默认为"remote"，枚举完
    // emptyText: '每页记录数',
    triggerAction: 'all',
    width: 110
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
                fieldLabel: "项目名称",
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                allowBlank: false,
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
                fieldLabel: "项目客户",
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
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
                regex: /^[^\\'‘’]+$/,
                regexText: "不能包含单引号",
                allowBlank: false,
                name: 'prjCodeNumber',
                width: 110
            }]
        }, /*{
            layout: "form",
            items: [ProjectState_Combo]
        }, */{

        layout: "form",
        items: [ProjectType_Combo]

    }]
}, { // 行2
    layout: "column",
    items: [{
        layout: "form",
        items: [{
            xtype: "datefield",
            fieldLabel: "项目计划开始日期",
            format: 'Y-m-d H:i:s',
            minValue: new Date(),
            allowBlank: false,
            id: 'My_prjPlanStartDate',
            minText: "不能小于当前日期",
            name: 'prjPlanStartDate',
            width: 150
        }]
    }, {
        layout: "form",
        items: [{
            xtype: "datefield",
            fieldLabel: "项目计划结束日期",
            format: 'Y-m-d H:i:s',
            allowBlank: false,
            vtype: "StartEndTime", //自定义的验证类型
            vtypeText: "起始时间必须大于结束时间！",
            confirmTo: "My_prjPlanStartDate", //要比较的另外一个的组件的id
            name: 'prjPlanEndDate',
            width: 150
        }]
    }]
}, /* {// 行5
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
        // enableLists: false,
        name: 'prjIntoduction',
        enableSourceEdit: false,
        submitValue: false,
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
    items: NewPrjFormPanel,
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            //-------------------------------------
            if (NewPrjFormPanel.form.isValid())//判断是否通过客户端验证
            {
                NewPrjFormPanel.form.submit({
                    waitMsg: '正在提交数据请稍等...', 		//提示信息
                    waitTitle: '提示', 					//标题
                    url: 'prjDataManage.ashx', //请求的url地址
                    method: 'post',
                    params: {
                        prjOperaType: prjOperaType,
                        prjIntoduction: encodeURIComponent(NewPrjFormPanel.getForm().findField('prjIntoduction').getValue())
                    },
                    success: function (form, action) {
                        prjEdit_Window.hide();
                        App.setAlert(App.STATUS_NOTICE, action.result.msg);
                        prjstore.reload();

                    },
                    failure: function (form, action) {
                        App.setAlert(App.STATUS_NOTICE, action.result.msg);
                        //  Ext.Msg.alert('提示', '对模板行的操作失败');

                    }
                });

            }
            //--------------------------------
        }
    }, {
        text: '重置', handler: function () {
            NewPrjFormPanel.getForm().reset();
        }
    }]
});





