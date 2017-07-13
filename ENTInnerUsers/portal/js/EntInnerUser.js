
function Get_PublishMessage() {
    var PublishMessage_conn = Ext.lib.Ajax.getConnectionObject().conn;
    PublishMessage_conn.open("POST", "DataProcess.aspx?OperarteType=PublishMessage", false);
    PublishMessage_conn.send(null);
    var PublishMessage_responseText = PublishMessage_conn.responseText;
    return Ext.util.JSON.decode(PublishMessage_responseText);

}


//呈现组件 
var PlatForm_PublishMessage_Panel = new Ext.Panel({
    id: "mypanel",
    width: 300,
    frame: false,
    height: 100,
  //  title: "XTemplate简单示例",
    renderTo: Ext.getBody()
});

//创建模板
function tt(title) {
    alert(title);
}
var tpl = new Ext.XTemplate(
            '<table width = "100%">',
            '<tpl for="Root"><tr>',       // process the data.kids node 
             '<td width=10px><img src="../../images/signTri.jpg" width="5" height="6" align="right"/></td>',
             '<td><p><a href="announcement.aspx?filename={filename}"   target="_blank">{Title}</a></p></td>',
               '<td align="left">{PublishTime}</td>', // use current array index to autonumber 
            '</tr></tpl>',
            '</table>'
        );

//重写绑定模板 
tpl.overwrite(PlatForm_PublishMessage_Panel.body, Get_PublishMessage()); // pass the kids property of the data object


  