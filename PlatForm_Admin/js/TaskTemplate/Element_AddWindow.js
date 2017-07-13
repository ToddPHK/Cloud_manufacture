var DicWord_ArrayStore = new Ext.data.ArrayStore({
    url: '../ComboData.aspx',
   // autoLoad: { params: { OperateType: 'DicWordList'} },
    fields: ['ID', 'Name'],
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});

var DicWord_ListCombo = new Ext.form.ComboBox({
    store: DicWord_ArrayStore,
   // id: "RoleListCombo11",
    displayField: 'Name',
    valueField: 'ID',
    submitValue: false,
    fieldLabel: "元素名称",
    typeAhead: true,
    mode: 'local',
    //tpl:'<tpl for="."><div ><span><input type="checkbox" onclick="myclick(this)" value="{state}" /></span><span class="x-combo-list-item">{state}</span></div></tpl>',   
    tpl: '<tpl for="."><div class="x-combo-list-item"><span><input type="checkbox" {[values.check?"checked":""]}  value="{[values.Name]}" /></span><span >{Name}</span></div></tpl>',
    triggerAction: 'all',
    emptyText: 'select...',
    selectOnFocus: true,
    onSelect: function (record, index) {
        if (this.fireEvent('beforeselect', this, record, index) !== false) {
            record.set('check', !record.get('check'));
            var str = []; //页面显示的值   
            var strvalue = []; //传入后台的值   
            this.store.each(function (rc) {
                if (rc.get('check')) {
                    str.push(rc.get('Name'));
                    strvalue.push(rc.get('ID'));
                }
            });
            this.setValue(str.join());
            this.value = strvalue.join();
            this.hideValue = strvalue.join();
            //this.collapse();   
            this.fireEvent('select', this, record, index);
        }
    }
});
var RadioGroup_EmptyText= new Ext.form.RadioGroup({
    fieldLabel: '允许为空',
 //   name: 'AllowEmpty', //设置radiogroup的默认值，可以在Struts2的Action中创建一个名称和xtype的name一样的属性   
  //  labelStyle: 'text-align:right;',
    labelAlign: "left",
    cls: 'x-check-group-alt',
    items: [
                { boxLabel: '是', name: 'AllowEmpty', inputValue: 'Yes', checked: true },
                { boxLabel: '否', name: 'AllowEmpty', inputValue: 'No' }
    ]
});
RadioGroup_EmptyText.on('change', function (RadioGroup, Radio) {
    if (Radio.getRawValue() == 'No') {
        TextField_BlankText.enable();
    }
    else {
        TextField_BlankText.setValue("");
        TextField_BlankText.disable();
        TextField_BlankText.clearInvalid();
    }

})
var RadioGroup_Regex = new Ext.form.RadioGroup({
    fieldLabel: '使用正则表达式',
 //   name: 'AllowRegex', //设置radiogroup的默认值，可以在Struts2的Action中创建一个名称和xtype的name一样的属性   
   // labelStyle: 'text-align:right;',
    labelAlign: "left",
    cls: 'x-check-group-alt',
    items: [
                { boxLabel: '是', name: 'AllowRegex', inputValue: 'Yes' },
                { boxLabel: '否', name: 'AllowRegex', inputValue: 'No', checked: true }
    ]
});
RadioGroup_Regex.on('change', function (RadioGroup, Radio) {
    if (Radio.getRawValue() == 'Yes') {
        TextField_Regex.enable();
        TextField_RegexText.enable();
    }
    else {
        TextField_Regex.setValue("");
        TextField_RegexText.setValue("");
        TextField_Regex.disable();
        TextField_RegexText.disable();
        TextField_Regex.clearInvalid();
        TextField_RegexText.clearInvalid();
    }
})
var TextField_BlankText = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    fieldLabel: "标签为空的提示",
    disabled:true,
    labelWidth: 50,
    allowBlank:false,
    name: 'blankText',
    width: 120
});
var TextField_Regex = new Ext.form.TextField({
    fieldLabel: "正则表达式",
    regex: /^[\/]\S*[\/]$/,
    regexText: "必须以‘/’开头以‘\/’结尾",
    labelWidth: 50,
    allowBlank: false,
    disabled: true,
    name: 'regex',
    width: 120
});
var TextField_RegexText = new Ext.form.TextField({
    regex: /^[^\\'‘’]+$/,
    regexText: "不能包含单引号",
    fieldLabel: "正则表达式验证错误的提示",
    labelWidth: 50,
    disabled: true,
    allowBlank: false,
    name: 'regexText',
    width: 120
});

var Element_FormPanel = new Ext.form.FormPanel({
    autoHeight: true,
    frame: true,
    region:'center',
    labelAlign: "left",
    items: [
DicWord_ListCombo,{
        xtype: "textfield",
        fieldLabel: "标签宽度",
        value:120,
        regex: /^[1-9]\d*$/,
        regexText: "必须为正整数",
        labelWidth: 50,
        name: 'width',
        width: 120
    }, {
        regex: /^[^\\'‘’]+$/,
        regexText: "不能包含单引号",
        xtype: "textfield",
        fieldLabel: "默认文本",
        labelWidth: 50,
        name: 'emptyText',
        width: 120
    }, RadioGroup_EmptyText, TextField_BlankText, RadioGroup_Regex, TextField_Regex, TextField_RegexText, {
        xtype: "hidden",
        name: 'ID'
    },
    {
        xtype: "hidden",
        name: 'ParentID'
    }
     ]
});

var Element_Window = new Ext.Window({
    layout: 'border',
    width: 350,
    height: 305,
    modal: true,
    closeAction: "hide",
    // plain: true,
    title: '编辑对话框',
    //bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [Element_FormPanel],
    buttons: [{
        text: '保存',
        //点击保存按钮后触发事件  
        handler: function () {
            SaveElement();

        }
    }]
});
Element_Window.on('hide', function () {
    DicWord_ListCombo.setValue("");
    RadioGroup_EmptyText.items.items[0].setValue(true);
    RadioGroup_Regex.items.items[1].setValue(true);
    Element_FormPanel.form.findField("emptyText").setValue("");
    Element_FormPanel.form.findField("width").setValue("120");
});
function SaveElement() {
    if (Element_FormPanel.form.isValid())//判断是否通过客户端验证
    {
        Element_FormPanel.form.submit({
            waitMsg: '正在提交数据请稍等...', 		//提示信息
            waitTitle: '提示', 					//标题
            url: 'DataProcess.aspx', //请求的url地址
            method: 'GET',
            params: {
                OperateType: OperateType,
                WordIDS: DicWord_ListCombo.hideValue
            },
            success: function (form, action) {
                Element_Window.hide();
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                refreshTreeGrid();

            },
            failure: function (form, action) {
                App.setAlert(App.STATUS_NOTICE, action.result.msg);
                //  Ext.Msg.alert('提示', '对模板行的操作失败');

            }
        });

    }
}
//------------------------------------模板Element编辑-----------------------------------------

//---------------------------模板Element评价-------------------------------
var TaskTemplate_ElementComment = new Ext.XTemplate('<b>[ID]</b>: {INNERID}<br/>',
		'<b>[名称]</b>: {NAME}<br/>',
		'<b>[所有人]</b>: {USER_TEXT}<br/>',
		'<b>[注册时间]</b>: {REGISTE_TIME}<br/>',
		'<b>[资源类型]</b>: {TYPE_TEXT}<br/>',
		'<b>[资源得分]</b>: {AVEEVALUATION}<br/>',
		'<b>[状态]</b>: {STATE}<br/>',
		'<b>[资源入口]</b>: {GATE}<br/>',
		'<b>[描述]</b>: {DESCRIPTION}<br/>',
		'<b>[资源评论]</b>:<br/>',
		 '<tpl for="Assess">',
		 '{#}------------------<b>[评论时间]</b>: {EVA_TIME}------------------<br/>',
		'<b>[评论人]</b>: {EVA_USER_ID}<br/>',	
		'<b>[得分]</b>: {EVA_VALUE}<br/>',
		 '<tpl if="this.isnullde(EVA_DESCRIPTION)">',
            '<b>[评论]</b>: 未评论<br/>',
        '</tpl>',
        '<tpl if="this.isAcess(EVA_DESCRIPTION) == true">',
            '<b>[评论]</b>: {EVA_DESCRIPTION}<br/>',
        '</tpl>',
		'</br>',
		 '</tpl>',
		 {
		     isnullde: function (EVA_DESCRIPTION) {
		         return EVA_DESCRIPTION == 'undefined';
		     },
		     isAcess: function (EVA_DESCRIPTION) {
		         return EVA_DESCRIPTION != 'undefined';
		     }
		 }
		);
var TaskTemplate_ElementComment_Panel = new Ext.Panel({
    id: 'TaskTemplate_ElementComment_Panel',
    frame: false,
    autoScroll: true,
    region: 'north',
    bodyStyle: {
        background: '#ffffff',
        padding: '7px'
    },
    html: 'Please select a book to see additional details.<div id="dsaas"></div>'
});
var TaskTemplate_ElementComment_Win = new Ext.Window({				//创建弹出窗口
    title: "资源详细信息",
    layout: 'fit',
    width: 400,
    height: 320,
    //autoHeight: true,
    closeAction: 'hide',
    resizable: false,
    shadow: true,
    //modal: true,
    closable: true,
    bodyStyle: 'padding:5 5 5 5',
    animCollapse: true,
    items: TaskTemplate_ElementComment_Panel

});

function ShowTemplate_ElementComment() {
 var nodes = TaskMudole_TreeGrid.getChecked();
    if (nodes.length > 0) {
    node.attributes.ID
        var node = nodes[0];
        var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
        conn1.open("POST", "TaskTemplate.aspx?OperateType=ViewElementComment&ID=" + node.attributes.TaskTemplateID, false);
        conn1.send(null);
        var CommentData = Ext.util.JSON.decode(response.responseText); 
       // var TaskTemplates = conn1.responseText;
        var Templates = TaskTemplates.split('|');
        TaskTemplate_ElementComment_Win.show();
    var detailPanel = Ext.getCmp('TaskTemplate_Comment_panel');
    TaskTemplate_ElementComment.overwrite(detailPanel.body, CommentData);
    }

}