<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SessionTimeOut.aspx.cs" Inherits="SessionTimeOut" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style type="text/css"> 

#BodyBg{ 
    width: 100%;  
    height: 99%;  
    position: absolute;  
    left: 0px;  
    top: 0px;  
    z-index: 0; 
} 
 
.stretch { 
    width:100%; 
    height:100%; 
} 



</style> 
</head>
<body >
<div id="BodyBg"> 
你已长时间不操作，请重新登录！
    <img src="images/ErroPageBK.jpg" class="stretch" alt="" /> 
</div>



</body>
</html>
