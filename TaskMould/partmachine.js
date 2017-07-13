var partmachine = new Ext.form.FormPanel({title:'零件加工',id:'partmachine',autoHeight: true,
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
fieldLabel:'联系方式',
width:120,
name:'ContactUs'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'combo',
fieldLabel:'加工批量',
width:120,
name:'Amount',
 
                store: new Ext.data.ArrayStore({url: '../../../PlatForm_Admin/TaskTemplateData.aspx?OperateType=AmountSort',autoLoad:true,
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
                             items:[{xtype:'datefield',
fieldLabel:'结束时间',
width:120,
name:'EndTime',
format:'Y-m-d H:i:s'
}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'工期',
width:120,
name:'Pduration'

}]
                            }]
                            },
{ // 行D2
                            layout:'column',
                            items:[{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'任务描述',
width:120,
name:'TaskDescription'

}]
                            },{
                            layout:'form',
                             items:[{xtype:'textfield',
fieldLabel:'预算',
width:120,
name:'Bedget'

}]
                            }]
                            }
]
                            });
