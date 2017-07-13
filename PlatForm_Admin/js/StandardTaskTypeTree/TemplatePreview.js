


function TemplatePreview(TemplateName) {
    var loadMarsk = new Ext.LoadMask('TaskMouldBiding_Window', {
        msg: '正在加载模板，请稍候......',
        removeMask: true// 完成后移除
    });
    loadMarsk.show(); //显示
    

    var TemplatePreview_win = new Ext.Window({
        //layout: 'fit',
        width: 500,
        height: 300,
        modal: true,
        closeAction: "hide",
        title: '模板预览'
    });
    TemplatePreview_win.removeAll();
    function taskMould_Add() {

        s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "../../../TaskMould/" + TemplateName + ".js";
        s.id = TemplateName + "Template_Now";
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);
    }

    var tag = document.getElementById(TemplateName + "Template_Now");
    if (tag == null) {
        taskMould_Add();
        tag = document.getElementById(TemplateName + "Template_Now");
        //-----------------
        var start = new Date().getTime();

        var TimeoutID;
        //---------------------------
        var IntervalID = setInterval(function () {
            if (Ext.getCmp(TemplateName) != undefined) {
                TemplatePreview_win.add(Ext.getCmp(TemplateName));
                TemplatePreview_win.doLayout();
                TemplatePreview_win.show();
                loadMarsk.hide(); //隐藏
                clearInterval(IntervalID);

            }
            else {
                if (new Date().getTime() - start > 30000) {
                    Ext.MessageBox.confirm('提示', '加载时间过长，继续加载?', NoLoad);
                }
            }
        }, 3000)
        TemplatePreview_win.on('hide', function () {
            clearInterval(IntervalID);
        })
        function NoLoad(btn) {
            if (btn == 'no') {
                loadMarsk.hide(); //隐藏
                tag.removeNode();
                clearInterval(IntervalID);
            }
            else {
                tag.removeNode();
                taskMould_Add();
                start = new Date().getTime();
            }

        }
        //-------------------------------
    }
    else {
        TemplatePreview_win.add(Ext.getCmp(TemplateName));
        TemplatePreview_win.doLayout();
        TemplatePreview_win.show();
        loadMarsk.hide(); //隐藏
    }

}