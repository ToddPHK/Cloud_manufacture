var fileuploadform = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    labelWidth: 80,
    fileUpload: true,
    layout: "form",
    defaultType: 'textfield',
    items: [ {
        xtype: 'textfield',
        fieldLabel: '文件 ',
        name: 'userfile',
        inputType: 'file',
        allowBlank: false,
        blankText: 'File can\'t not empty.',
        anchor: '90%'  // anchor width by percentage
    }]
});
var FileUpLoadWindow = new Ext.Window({
    title: '文件上传',
    width: 400,
    height: 200,
    resizable: false,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    closeAction: 'hide',
    buttonAlign: 'center',
    items: fileuploadform,
    buttons: [{
        text: '保存',
        handler: function () {
            if (fileuploadform.form.isValid()) {
                fileuploadform.getForm().submit({
                    url: 'Dfileupload.aspx?TaskID=' + FileUpLoadWindow.TaskID + "&DelFileName=" + FileUpLoadWindow.FileName,
                    method: 'GET',
                    success: function (form, action) {
                        Ext.Msg.alert('提示框', action.result.msg);
                        FileUpLoadWindow.hide();
                    },
                    failure: function () {
                        Ext.Msg.alert('Error', 'File upload failure.');
                    }
                })
            }
        }
    }, {
        text: '关闭',
        handler: function () { FileUpLoadWindow.hide();  }
    }]
});
function FileDownLoad(filename) {
  //  window.open("10.15.43.242");
     //   filename = rows[0].get('name');
        var jsonData = { fileOperateType: 'download', filename: filename }
        if (!Ext.fly('test')) {
            var frm = document.createElement('form');
            frm.id = 'test';
            frm.name = id;
            frm.style.display = 'none';
            document.body.appendChild(frm);
        }
        Ext.Ajax.request({
            url: 'DfileDownLoad.aspx',
            form: Ext.fly('test'),
            method: 'POST',
            params: jsonData,
            isUpload: true
        });

}