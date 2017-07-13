Ext.onReady(function () {

    var form = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 80,
        fileUpload: true,
        defaultType: 'textfield',

        items: [{
            xtype: 'textfield',
            fieldLabel: 'File Name',
            name: 'userfile',
            inputType: 'file',
            allowBlank: false,
            blankText: 'File can\'t not empty.',
            anchor: '90%'  // anchor width by percentage
        }, {
            xtype: 'textfield',
            fieldLabel: 'File Name',
            name: 'userfile1',
            inputType: 'file',
            allowBlank: false,
            blankText: 'File can\'t not empty.',
            anchor: '90%'  // anchor width by percentage
        }]
    });

    var win = new Ext.Window({
        title: 'Upload file',
        width: 400,
        height: 150,
        layout: 'fit',
        plain: true,
        bodyStyle: 'padding:5px;',
        buttonAlign: 'center',
        items: form,

        buttons: [{
            text: 'Upload',
            handler: function () {
                var filebutton = '<br><input type="file" size="50" name="File" class="ButtonCss" />';
                form.add({
                    xtype: 'textfield',
                    fieldLabel: 'File Name',
                    name: 'userfile1',
                    inputType: 'file',
                    allowBlank: false,
                    blankText: 'File can\'t not empty.',
                    anchor: '90%'  // anchor width by percentage
                });
                form.doLayout(); 
            }
        }, {
            text: 'Upload',
            handler: function () {
                if (form.form.isValid()) {
                    form.getForm().submit({
                       url: 'fileupload.aspx',
                        method: 'GET',
                        success: function (form, action) {
                            Ext.Msg.alert('提示框', action.result.msg + action.result.tr);
                            //  win.hide();
                        },
                        failure: function () {
                            Ext.Msg.alert('Error', 'File upload failure.');
                        }
                    })
                }
            }
        }, {
            text: 'Close',
            handler: function () { win.hide(); }
        }]
    });
    win.show();
    }
})