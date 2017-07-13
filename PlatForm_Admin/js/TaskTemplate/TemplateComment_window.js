//---------------------------模板Template评价-------------------------------
var TaskTemplate_TemplateComment = new Ext.XTemplate(
		 '<tpl for="Comments">',
		 '{#}------------------ {CommentDate}------------------<br/>',
		'<b>[评论人]</b>: {Company}--{CompanyUser}<br/>',
		'<b>[评分]</b>: {Score}<br/>',
        '<b>[评论信息]</b>: {Comment}<br/>',
		'</br>',
		 '</tpl>'
		);
var TaskTemplate_TemplateComment_Panel = new Ext.Panel({
    id: 'TaskTemplate_TemplateComment_Panel',
    frame: false,
    autoScroll: true,
    region: 'north',
    bodyStyle: {
        background: '#ffffff',
        padding: '7px'
    },
    html: '还未评论.<div id="dsaas"></div>'
});
var TaskTemplate_TemplateComment_Win = new Ext.Window({				//创建弹出窗口
    title: "模板评论",
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
    items: TaskTemplate_TemplateComment_Panel

});

function ShowTemplate_TemplateComment(node) {


    var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
    conn1.open("POST", "CommentData.aspx?OperateType=ViewTemplateComment&ID=" + node.attributes.TaskTemplateID, false);
    conn1.send(null);
    // alert(conn1.responseText);
    var responseText = conn1.responseText
    if (responseText != "{}") {
        var CommentData = Ext.util.JSON.decode(responseText);
        TaskTemplate_TemplateComment_Win.setTitle("模板[" + node.attributes.fieldLabel + "]评论信息");
        TaskTemplate_TemplateComment_Win.show();
        var detailPanel = Ext.getCmp('TaskTemplate_TemplateComment_Panel');
        TaskTemplate_TemplateComment.overwrite(detailPanel.body, CommentData);
    }
    else
        Ext.Msg.alert("提示", "模板[" + node.attributes.fieldLabel + "]还未评论！");

}

//---------------------------------查看模板的相关所有评价--------------------------------------------------
var TaskTemplate_TemplateAllComment = new Ext.XTemplate(
 '---------------------- 模板总体评价-------------------------<br/>',
          '<br/>',
		 '<tpl for="TemplateComments">',
		 '{#}------------------ {CommentDate}------------------<br/>',
		'<b>[评论人]</b>: {Company}--{CompanyUser}<br/>',
		'<b>[评分]</b>: {Score}<br/>',
        '<b>[评论信息]</b>: {Comment}<br/>',
		'</br>',
		 '</tpl>',
          '------------------ 模板相关属性的评价-------------------<br/>',
          '<br/>',
         '<tpl for="ElementComments">',
		 '{#}------------------ {CommentDate}------------------<br/>',
         '<b>[模板属性]</b>: {fieldLabel}<br/>',
		'<b>[评论人]</b>: {Company}--{CompanyUser}<br/>',
		'<b>[评分]</b>: {Score}<br/>',
        '<b>[评论信息]</b>: {Comment}<br/>',
		'</br>',
		 '</tpl>'
		);
var TaskTemplate_TemplateAllComment_Panel = new Ext.Panel({
    id: 'TaskTemplate_TemplateAllComment_Panel',
    frame: false,
    autoScroll: true,
    region: 'north',
    bodyStyle: {
        background: '#ffffff',
        padding: '7px'
    },
    html: '还未评论<div id="dsaas"></div>'
});
var TaskTemplate_TemplateAllComment_Win = new Ext.Window({				//创建弹出窗口
    title: "模板评论",
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
    items: TaskTemplate_TemplateAllComment_Panel

});

function ShowTemplate_TemplateAllComment(node) {


    var conn1 = Ext.lib.Ajax.getConnectionObject().conn;
    conn1.open("POST", "CommentData.aspx?OperateType=ViewTemplateAllComment&ID=" + node.attributes.TaskTemplateID, false);
    conn1.send(null);
    // alert(conn1.responseText);
    var responseText = conn1.responseText
    if (responseText != "{}") {
        var CommentData = Ext.util.JSON.decode(responseText);
        TaskTemplate_TemplateAllComment_Win.setTitle("模板[" + node.attributes.fieldLabel + "]评论信息");
        TaskTemplate_TemplateAllComment_Win.show();
        var detailPanel = Ext.getCmp('TaskTemplate_TemplateAllComment_Panel');
        TaskTemplate_TemplateAllComment.overwrite(detailPanel.body, CommentData);
    }
    else
        Ext.Msg.alert("提示", "模板[" + node.attributes.fieldLabel + "]还未评论！");

}

