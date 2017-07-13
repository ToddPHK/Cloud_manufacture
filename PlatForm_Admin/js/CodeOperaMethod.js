var CodeOperaMethod = function (u, p) {
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
                App.setAlert(App.STATUS_NOTICE, response.responseText);
            }
            else {
                App.setAlert(App.STATUS_NOTICE, "所提交的操作失败！");
            }

        }
    });
};