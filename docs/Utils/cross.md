
## jsonp

## CORS (cross-origin-resource sharing)跨域资源共享
?> 参考文献：[CORS详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

access-control-allow-origin: http://api.bob.com  
access-control-allow-credentials: true  
access-control-expose-headers: FooBar  

### 跨域请求时不会带上请求的那个域的cookie
原生写法：
```js
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://xxxx.com/demo/b/index.php", true);
xhr.withCredentials = true; //支持跨域发送cookies
xhr.send();
```

jquery写法：
```js
$.ajax({
     type: "POST",
     url: "http://xxx.com/api/test",
     dataType: 'jsonp',
     xhrFields: {
          withCredentials: true
     },
     crossDomain: true,
     success:function(){},
     error:function(){}
});
```
