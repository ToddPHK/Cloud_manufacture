var HeatTreatment = new Ext.form.FormPanel({title:'热处理',id:'HeatTreatment',autoHeight: true,
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
                             items:[{xtype:'textfield',
fieldLabel:'耐磨性',
width:120,
allowBlank:false,
blankText:'',
regex:/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
regexText:'非负浮点数',
name:'WearResistance'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'塑性',
width:120,
name:'Plasticity'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'韧性',
width:120,
name:'Toughness'

}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'毛坯尺寸',
width:120,
name:'MaoPiChic'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'combotree',
fieldLabel:'工艺类型',
width:120,
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
fieldLabel:'材料类型',
width:120,
name:'Material',
 
                store: new Ext.data.ArrayStore({baseParams:{OperateType:'Material'},url: '../../../PlatForm_Admin/TaskTemplateData.aspx',autoLoad:true,
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
fieldLabel:'心部强度',
width:120,
emptyText:'单位MPA',
allowBlank:false,
blankText:'',
name:'HeartStr'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'心部硬度',
width:120,
name:'HearHardness'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'表面硬度',
width:120,
name:'SurfaceHardness'

}]
                            }]
                            }
]
                            });
