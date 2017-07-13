var OutSource = new Ext.form.FormPanel({ title: '零件外购', id: 'OutSource', autoHeight: true,
    frame: true,
    layout: 'form',
    defaults: {
        autoScroll: true

    },
    labelAlign: 'right',
    items: [{ // 行D2
        layout: 'column',
        items: [{
            layout: 'form',
            items: [{ xtype: 'textfield',
                fieldLabel: '外购件名称',
                width: 120,
                name: 'OutSourcePartName'

            }]
        }, {
            layout: 'form',
            items: [{ xtype: 'textfield',
                fieldLabel: '零件标准编号',
                width: 120,
                allowBlank: false,
                blankText: '',
                name: 'StandardCode'

            }]
        }]
    },
{ // 行D2
    layout: 'column',
    items: [{
        layout: 'form',
        items: [{ xtype: 'textfield',
            fieldLabel: '任务描述',
            width: 120,
            name: 'TaskDescription'

        }]
    }, {
        layout: 'form',
        items: [{ xtype: 'textfield',
            fieldLabel: '外购件数量',
            width: 120,
            name: 'PartMount'

        }]
    }]
},
{ // 行D2
    layout: 'column',
    items: [{
        layout: 'form',
        items: [{ xtype: 'datefield',
            fieldLabel: '截止日期',
            width: 120,
            name: 'Deadline',
            format: 'Y-m-d H:i:s'
        }]
    }]
}
]
});
