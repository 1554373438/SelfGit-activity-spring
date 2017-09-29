## project setup
* init     

	~~~
	npm install && bower install
	~~~
* local serve 

	~~~
	gulp serve
	~~~
* serve dist

	~~~
	gulp serve:dist
	~~~
* build 

	~~~
	gulp
	~~~
	
## bower
使用`bower`来管理第三方库依赖  

* install  

	~~~
	npm install bower -g
	~~~
* usage(以添加zepto为例)
	
	~~~
	bower install zepto --save
	~~~

### cnpm
npm的国内淘宝镜像，可用于替换npm的操作，提升下载速度

* install

	~~~
	npm install -g cnpm --registry=https://registry.npm.taobao.org
	~~~
