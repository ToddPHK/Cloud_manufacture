var TaskTreeOperaMethod = function (u, p) {
    var conn = new Ext.data.Connection();
    conn.request({
        //请求的 Url  
        url: u,
        // 传递的参数  
        params: p,
        method: 'post',
        scope: this,
        //回调函数，根据执行结果作不同的操作，如果成功提示操作成功的信息，如果失败提示失败的信息  
        callback: function (options, success, response) {
            if (success) {
                Ext.MessageBox.alert("提示", response.responseText);
            }
            else {
                Ext.MessageBox.alert("提示", "所提交的操作失败！");
            }

        }
    });
};