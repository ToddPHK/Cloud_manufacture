var testtest = new Ext.form.FormPanel({title:'test1',id:'testtest',autoHeight: true,
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
emptyText:'无',
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
                             items:[{xtype:'combotree',
fieldLabel:'工艺类型',
width:120,
emptyText:'无',
name:'Process',

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
                    loader: new Ext.tree.TreeLoader({baseParams:{OperateType:'Craft'},url: '../../../PlatForm_Admin/TaskTemplateData.aspx'   }),
                    root: new Ext.tree.AsyncTreeNode({ id: '0', text: '标准任务' })
                }),
                selectModel: 'single',
                selectNodeModel: 'all'
}]
                            },{
                            layout:'form',
                             items:[{xtype:'combo',
fieldLabel:'表面特征',
width:120,
emptyText:'无',
name:'SurCha',
 
                store: new Ext.data.ArrayStore({baseParams:{OperateType:'GeoChaType'},url: '../../../PlatForm_Admin/TaskTemplateData.aspx',autoLoad:true,
                    fields: ['value', 'text'],
                    sortInfo: {
                        field: 'value',
                        direction: 'ASC'
                    }
                }),
                mode:'local',//数据加载模式，'local'本地加载，'remote'远程加载
                valueField : 'value',   
                displayField : 'text',  
               // value:'1001',   
                mode : 'local', //数据加载模式，local代表本地数据  
                triggerAction : 'all',  
                readOnly : false,   //只读，为true时不能编辑不能点击  
                editable:false
}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'报告形式',
width:120,
name:'ReportType'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'结果形式',
width:120,
name:'ResultType'

}]
                            }]
                            }
]
                            });
