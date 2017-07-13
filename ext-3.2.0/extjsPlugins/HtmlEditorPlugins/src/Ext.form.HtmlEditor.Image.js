/**
* @author Shea Frederick - http://www.vinylfox.com
* @class Ext.form.HtmlEditor.Image
* @extends Ext.util.Observable
* <p>A plugin that creates an image button in the HtmlEditor toolbar for inserting an image. The method to select an image must be defined by overriding the selectImage method. Supports resizing of the image after insertion.</p>
* <p>The selectImage implementation must call insertImage after the user has selected an image, passing it a simple image object like the one below.</p>
* <pre>
*      var img = {
*         Width: 100,
*         Height: 100,
*         ID: 123,
*         Title: 'My Image'
*      };
* </pre>
*/
Ext.form.HtmlEditor.Image = Ext.extend(Ext.util.Observable, {
    // Image language text
    langTitle: 'Insert Image',
    urlSizeVars: ['width', 'height'],
    basePath: getBaseUrl(),
    init: function (cmp) {
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, { delay: 100, single: true });
    },
    onEditorMouseUp: function (e) {
        Ext.get(e.getTarget()).select('img').each(function (el) {
            var w = el.getAttribute('width'), h = el.getAttribute('height'), src = el.getAttribute('src') + ' ';
            src = src.replace(new RegExp(this.urlSizeVars[0] + '=[0-9]{1,5}([&| ])'), this.urlSizeVars[0] + '=' + w + '$1');
            src = src.replace(new RegExp(this.urlSizeVars[1] + '=[0-9]{1,5}([&| ])'), this.urlSizeVars[1] + '=' + h + '$1');
            el.set({ src: src.replace(/\s+$/, "") });
        }, this);

    },
    onInit: function () {
        Ext.EventManager.on(this.cmp.getDoc(), {
            'mouseup': this.onEditorMouseUp,
            buffer: 100,
            scope: this
        });
    },
    onRender: function () {
        var btn = this.cmp.getToolbar().addButton({
            iconCls: 'x-edit-image',
            handler: this.selectImage,
            scope: this,
            tooltip: {
                title: this.langTitle
            },
            overflowText: this.langTitle
        });
    },
    selectImage: Ext.emptyFn,
    insertImage: function (img) {
        this.cmp.insertAtCursor('<img src="' + this.basePath + '?' + this.urlSizeVars[0] + '=' + img.Width + '&' + this.urlSizeVars[1] + '=' + img.Height + '&id=' + img.ID + '" title="' + img.Name + '" alt="' + img.Name + '">');
    }
});

Ext.override(Ext.form.HtmlEditor.Image, { selectImage: function () {
    cmpCusor = this.cmp;
    var imgform = new Ext.FormPanel({
        region: 'center',
        labelWidth: 55,
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        autoScroll: true,
        border: false,
        fileUpload: true,
        items: [{
            xtype: 'textfield',
            fieldLabel: '选择文件',
            name: 'userfile',
            inputType: 'file',
            allowBlank: false,
            blankText: '文件不能为空',
            height: 25,
            anchor: '90%'
        }],
        buttons: [{
            text: '上传',
            type: 'submit',
            handler: function () {
                if (!imgform.form.isValid()) { return; }
                imgform.form.submit({
                    waitMsg: '正在上传',
                    url: getBaseUrl() + '/admin/upload/imageupload',
                    success: function (form, action) {
                        var element = document.createElement("img");
                        element.src = getBaseUrl() + '/' + action.result.fileURL;
                        if (Ext.isIE) {
                            cmpCusor.insertAtCursor(element.outerHTML);
                        } else {
                            var selection = cmpCusor.win.getSelection();
                            if (!selection.isCollapsed) {
                                selection.deleteFromDocument();
                            }
                            selection.getRangeAt(0).insertNode(element);
                        }
                        win.hide();
                    },
                    failure: function (form, action) {
                        form.reset();
                        if (action.failureType == Ext.form.Action.SERVER_INVALID)
                            Ext.MessageBox.alert('警告', "失败");
                    }
                });
            }
        }, {
            text: '关闭',
            type: 'submit',
            handler: function () {
                win.close(this);
            }
        }]
    });
    var win = new Ext.Window({
        title: "上传图片",
        width: 300,
        height: 200,
        modal: true,
        border: false,
        iconCls: "picture.png",
        layout: "fit",
        items: imgform

    });
    win.show();
} 
});