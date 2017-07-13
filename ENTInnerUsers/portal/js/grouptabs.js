/*!
* Ext JS Library 3.2.0
* Copyright(c) 2006-2010 Ext JS, Inc.
* licensing@extjs.com
* http://www.extjs.com/license
*/
Ext.onReady(function () {
    Ext.QuickTips.init();

    // create some portlet tools using built in Ext tool ids


    var save = function () {
        var result = [];
        var portal = viewport.getComponent('Dashboard');
        var items = portal.items;
        for (var i = 0; i < items.getCount(); i++) {
            var c = items.get(i);
            c.items.each(function (portlet) {
                var o = { id: portlet.getId(), col: i };
                result.push(o);
            });
        }
        alert(Ext.encode(result));
        return result;
    }
    var button3 = new Ext.Button({
        text: "发布流程任务",
        listeners: {
            "click": function () {
                save();
            }
        }
    })
    var Microblog_conn = Ext.lib.Ajax.getConnectionObject().conn;
    Microblog_conn.open("POST", "../SessionClear.aspx?OperateType=Microblog", false);
    Microblog_conn.send(null);
    var Microblog = Microblog_conn.responseText;

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [{
            xtype: 'portal',
            //  title: 'Dashboard',
            id: 'Dashboard',
            tabTip: 'Dashboard tabtip',
            items: [{
                columnWidth: .33,
                style: 'padding:10px 0 10px 10px',
                items: [{
                    title: '我的个人信息',
                    height: 400,
                    autoScroll: true,
                    tools: [{
                        id: 'refresh',
                        handler: function (e, target, panel) {
                            PersonInfEditPanel.load({
                                url: 'DataProcess.aspx',
                                params: { OperarteType: 'PersonInf' },
                                success: function (form, action) { //加载成功的处理函数  
                                    PersonInfEditPanel.load(Ext.util.JSON.decode(action.response.responseText));

                                }
                            });
                        }
                    }],
                    id: 'Grid in a Portlet',
                    buttonAlign: 'center',
                    buttons: [{
                        text: '保存',
                        //点击保存按钮后触发事件  
                        handler: function () { SavePersonInf(); }
                    }],
                    items: PersonInfEditPanel
                }, {
                    title: '平台公告',
                    tools: [{
                        id: 'refresh',
                        handler: function (e, target, panel) {
                            tpl.overwrite(PlatForm_PublishMessage_Panel.body, Get_PublishMessage());
                        }
                    }],
                    height: 300,
                    layout: 'fit',
                    id: 'Plat_Message',
                    items: PlatForm_PublishMessage_Panel
                }]
            }, {
                columnWidth: .33,
                style: 'padding:10px 0 10px 10px',
                items: [{
                    title: '宁波模具云制造服务平台',
   
                    height: 700,
                    id: 'Another Panel 2',
                    html: ' <iframe id="iframeningbo" scrolling="auto" frameborder="0" width="100%" height="100%" src="http://www.mie-idc.com:8098/main.jsp" > </iframe>'
                }]
            }, {
                columnWidth: .33,
                style: 'padding:10px',
                items: [{
                    title: '我的微博',

                    id: 'Panel 3',
                    html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + Microblog + '" > </iframe>'
                }, {
                    title: '友情链接',
                    id: 'Another Panel 3',
                    html: ' <div class="f_bar yqlj_bar"><div class="f_link yqlj_link"><a href="http://www.hydma.com/" target="_blank">黄岩模具行业协会</a></div><div class="f_link yqlj_link"><a href="http://www.cqmj.org/" target="_blank">重庆模具工业协会</a></div> <div class="f_link yqlj_link"><a href="http://www.shmould.org/" target="_blank">上海市模具技术协会</a></div><div class="f_link yqlj_link"><a href="http://www.mouldnet.com.cn/" target="_blank">广东省模具工业协会</a></div> <div class="f_link yqlj_link"><a href="http://www.mouldpt.com/index.php" target="_blank">中国模具平台网</a></div><div class="f_link yqlj_link"><a href="http://www.mould.org.cn/index.php" target="_blank">中国压铸模具网</a></div><div class="f_link yqlj_link"><a href="http://www.hejin360.com/" target="_blank">全锌网</a></div><div class="f_link yqlj_link"><a href="http://www.yzw.cc/" target="_blank">中国压铸网</a></div><div class="f_link yqlj_link"><a href="http://www.mj-z.com/" target="_blank">易展模具展览网</a></div><div class="f_link yqlj_link"><a href="http://www.001cndc.com/" target="_blank">中华压铸网</a></div><div class="f_link yqlj_link"><a href="http://www.59yzw.com/" target="_blank">环球压铸网</a></div><div class="f_link yqlj_link"><a href="http://www.iyazhu.com/" target="_blank">第一压铸网</a></div><div class="f_link yqlj_link"><a href="http://www.9peak.com/" target="_blank">北仑九峰模具网</a></div><div class="f_link yqlj_link"><a href="http://www.yze.cc/" target="_blank">中国压铸耗材网</a></div><div class="f_link yqlj_link"><a href="http://www.suliaojx.org/" target="_blank">中国塑料机械网</a></div><div class="f_link yqlj_link"><a href="http://moju.66good.com/" target="_blank">66模具导航网</a></div><div class="f_link yqlj_link"><a href="http://www.21rubber.com/" target="_blank">中国橡胶网</a></div><div class="f_link yqlj_link"><a href="http://www.51qiufa.cn/" target="_blank">中国球阀网</a></div><div class="f_link yqlj_link"><a href="http://e.huisou.com/" target="_blank">会搜商务网</a></div><div class="f_link yqlj_link"><a href="http://www.mj37.com/" target="_blank">模具商情网</a></div><div class="f_link yqlj_link"><a href="http://www.jichuang.net/" target="_blank">中国机床网</a></div><div class="f_link yqlj_link"><a href="http://www.365aps.com/" target="_blank">铝型材模具网</a></div><div class="f_link yqlj_link"><a href="http://lvye.mouldu.com/" target="_blank">华夏铝业网</a></div><div class="f_link yqlj_link"><a href="http://www.zgfmhyw.com/" target="_blank">中国阀门行业网</a></div><div class="f_link yqlj_link"><a href="http://al.job1001.com/" target="_blank">铝业英才网</a></div><div class="f_link yqlj_link"><a href="http://www.oilequipcn.com/" target="_blank">中国石油设备网</a></div><div class="f_link yqlj_link"><a href="http://www.gunye.com/" target="_blank">中国辊业网</a></div><div class="f_link yqlj_link"><a href="http://www.mjcl.net/" target="_blank">模具材料网</a></div><div class="f_link yqlj_link"><a href="http://www.gyz-xz.com/" target="_blank">2012中国国际采购商大会</a></div><div class="f_link yqlj_link"><a href="http://www.penshaji.org/" target="_blank">中国喷砂机网</a></div><div class="f_link yqlj_link"><a href="http://www.mj-z.com/" target="_blank">易展模具展览网</a></div><div class="f_link yqlj_link"><a href="http://www.jsj35.com/" target="_blank">减速机商务网</a></div><div class="clear"></div></div>'
                }]
            }]
        }]
    });
    PersonInfEditPanel.doLayout();
    function SavePersonInf() {
        if (PersonInfEditPanel.form.isValid())//判断是否通过客户端验证
        {
            PersonInfEditPanel.form.submit({
                waitMsg: '正在提交数据请稍等...', 		//提示信息
                waitTitle: '提示', 					//标题
                url: 'DataProcess.aspx', //请求的url地址
                method: 'POST',
                params: {
                    OperarteType: "EditPersonInf"
                },
                success: function (form, action) {


                    App.setAlert(App.STATUS_NOTICE, action.result.msg);


                },
                failure: function (form, action) {
                    App.setAlert(App.STATUS_NOTICE, action.result.msg);


                }
            });

        }
    }
});
