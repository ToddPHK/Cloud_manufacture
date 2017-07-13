var DieUse = new Ext.form.FormPanel({title:'试模任务',id:'DieUse',autoHeight: true,
    frame: true,
    layout: 'form', 
    defaults: {              
         autoScroll: true

    },
    labelAlign: 'right',
    items: [{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'combotree',
fieldLabel:'模具类型',
width:120,
name:'MoldType',

                resizable: true,
                autoScroll: false,
                autoLoad: true,
                //listWidth:300, 这是设置下拉框的宽度，默认和comBoxTree的宽度相等   
                tree: new Ext.tree.TreePanel({
                    rootVisible: false,
                    autoScroll: false,
                    autoHeight: true,
                    listeners: {//监听
                        'contextmenu': function (node, e) {
                            // 编辑菜单  
                            menu = new Ext.menu.Menu([{
                                text: '展开',
                                handler: function () {
                                    node.expand(true, false);
                                    //  alert(node.text + '|' + node.id);
                                }
                            }, {
                                text: '收缩',

                                handler: function () {
                                    node.collapse(true, true);
                                }
                            }])
                            menu.showAt(e.getPoint());
                        }
                    },
                    loader: new Ext.tree.TreeLoader({baseParams:{OperateType:'DieClass'},url: '../../../PlatForm_Admin/TaskTemplateData.aspx'   }),
                    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '标准任务' })
                }),
                selectModel: 'single',
                selectNodeModel: 'all'
}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'报告形式',
width:120,
name:'ReportType'

}]
                            }]
                            }
]
                            });
