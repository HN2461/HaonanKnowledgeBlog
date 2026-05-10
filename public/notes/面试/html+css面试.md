## 1:主流浏览器的内核分别是什么？
IE：trident内核 [‘traidnt ]  踹腚恩德     			因特网浏览器

Firefox：gecko 内核 [ˈɡekəʊ]  改口					火狐浏览器

Safari：webkit 内核 							苹果浏览器

Chrome,Opera：Blink内核(基于webkit)  				谷歌浏览器	欧朋浏览器



1. **IE（Internet Explorer）

** - 内核是Trident，读音是['traɪdnt]。Trident内核是微软开发的，在早期的Windows操作系统中广泛应用。 

1. **Firefox（火狐浏览器）** 

- 内核是Gecko，读音是['ɡekoʊ]。Gecko内核由Mozilla基金会开发，以其对网络标准的良好支持和扩展性著称。 

1. **Safari**

- 内核是WebKit。WebKit是一个开源的浏览器引擎，最初由苹果公司开发，用于Safari浏览器。它也被其他一些浏览器所采用。 

1. **Chrome和Opera** 

- 内核是Blink。Blink是基于WebKit开发的，由谷歌主导开发。Chrome最初也是使用WebKit内核，后来谷歌将其发展为Blink内核。Opera后来也切换到了Blink内核。 这些就是目前主流浏览器所使用的内核信息。

## 2:每个HTML文件开头都有<!DOCTYPE  html>，它的作用是什么
<!DOCTYPE html>

声明位于文档中的最前面的位置，此标签告知浏览器文档使用哪种HTML或XHTMl规范（重点：**<font style="color:#FF0000;">告诉浏览器按照何种规范解析页面</font>**）

<!DOCTYPE  html>**<font style="color:#FF0000;">不写或格式不正确会导致文档以混杂模式呈现</font>**

## 3: div+css的布局较table布局有什么优点？
（1）div+css布局的好处：

1. **<font style="color:#FF0000;">a.符合W3C标准，结构、样式和行为分离，代码结构清晰明了，带来足够好的可维护性。</font>**
2. b.布局精准，网站版面**<font style="color:#FF0000;">布局修改简单</font>**。
3. c.**<font style="color:#FF0000;">加快了页面的加载速度（最重要的）</font>**。
4. d.用只包含结构化内容的HTML代替嵌套的标签，**<font style="color:#FF0000;">提高</font>**另外搜索引擎对网页的**<font style="color:#FF0000;">搜索效率。</font>**
5. table布局的好处

a.**<font style="color:#FF0000;">容易上手</font>**。

b.可以**<font style="color:#FF0000;">形成复杂的变化，简单快速</font>**。

c.表现上更加“严谨”，在**<font style="color:#FF0000;">不同浏览器</font>**中都能**<font style="color:#FF0000;">得到很好的兼容。</font>**

table布局的缺点

**<font style="color:#FF0000;">a、不易浏览器的搜索，seo效果不好</font>**

**<font style="color:#FF0000;">b、结构不清楚，修改较为麻烦</font>**



## 4:img的alt属性与title属性有何异同
区别一：

1. **<font style="color:#FF0000;">title ： 鼠标移入到图片显示的值</font>**
2. **<font style="color:#FF0000;">alt   	：</font>** **<font style="color:#FF0000;">图片无法加载时显示的值</font>**

区别二：

在seo的层面上，爬虫抓取不到图片的内容，所以前端在写img标签的时候为了增加seo效果要加入alt属性来描述这张图是什么内容或者关键词。





<img src="图像的URL地址" alt="图像的替代文本">

alt属性提供了图像的替代文本。当图像无法加载时，浏览器会显示alt文本，并且这个文本对于屏幕阅读器等辅助技术也很重要，可以帮助视障用户理解图像的内容。



title：

当用户将鼠标悬停在图像上时，会显示title属性中的文本内容，作为图像的提示信息。例如title="This is a beautiful landscape"，可以为用户提供关于图像的更多细节。



## 5:strong标签与em标签的异同
strong:粗体强调标签，强调，表示**内容的重要性**

em:斜体强调标签，更强烈强调，表示**语音语调的强调点**



## 6:渐进增强和优雅降级之间的不同
1. **渐进增强**（progressive enhancement） [prəu'ɡresiv][ɪnˈhɑːnsmənt]

针**<font style="color:#FF0000;">对低版本</font>**浏览器进行**<font style="color:#FF0000;">构建页面</font>**，**<font style="color:#FF0000;">保证最基本的功能</font>**，然后**<font style="color:#FF0000;">再</font>**针对高级浏览器进行效果、交互等**<font style="color:#FF0000;">改进和追加功能</font>**达到更好的用户体验。

2. **优雅降级**( graceful degradation)[ˈɡreɪsfl ,deɡrəˈdeɪʃn]

**<font style="color:#FF0000;">一开始就构建完整的功能</font>**，然后**<font style="color:#FF0000;">再</font>**针对**<font style="color:#FF0000;">低版本</font>**浏览器进行**<font style="color:#FF0000;">兼容</font>**。 

3. 渐进增强的观点关注内容本身

4. 优雅降级的观点更关注主流浏览器，一些特定的浏览器，除修复较大的错误外，其他的差异将会被直接忽略



## 7:CSS3 新增伪类举例： 
p:first-of-type 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。 

p:last-of-type 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。 

p:nth-of-type()   

p:only-of-type 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。 

p:only-child 选择属于其父元素的唯一子元素的每个 <p> 元素。 

p:first-child

p:last-child

p:nth-child(2) 选择属于其父元素的第二个子元素的每个 <p> 元素。 



1. **<font style="color:#FF0000;">:disabled 控制表单控件的禁用状态。 </font>**
2. **<font style="color:#FF0000;">:checked，单选框或复选框被选中。</font>**

## 9:简述一下 src与 href 的区别
src 用于**<font style="color:#FF0000;">替换当前元素</font>**

href 用于**<font style="color:#FF0000;">在当前文档和引用资源之间确立联系</font>**。

Src是source的缩写，**<font style="color:#FF0000;">指向外部资源的位置</font>**，**指向的内容将会嵌入到文档中当前标签所在的位置**。例如：js脚本，img图片，frame等。当浏览器**<font style="color:#FF0000;">解析</font>**到**<font style="color:#FF0000;">该元素时</font>**，**<font style="color:#FF0000;">会暂停其他资源的下载和处理</font>**，直到将该资源加载、编译、执行完毕，这也是为什么将js 脚本放在底部而不是头部。 

href 是 Hypertext Reference 的缩写，**<font style="color:#FF0000;">指向网络资源所在位置</font>**，**建立和当前元素（锚点）或当前文档（链接）之间的链接**，**<font style="color:#FF0000;">会并行下载资源并且不会停止对当前文档的处理</font>**。这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。



src 用于替换当前元素，指向外部资源位置，资源会嵌入当前标签位置，加载时会暂停其他资源处理，如 js 脚本、img 图片、frame 等。

href 用于在当前文档和引用资源间确立联系，指向网络资源位置，建立链接，会并行下载资源且不停止对当前文档处理，如用于加载 css 的 link 方式。



## 10:网页制作会用的图片格式有哪些
 Png,jpg,gif,svg,webp,base64

png:**<font style="color:#FF0000;">无损</font>**压缩，尺寸体积要比jpg/jpeg的大，适合做**<font style="color:#FF0000;">小图标</font>**。

jpg:采用**<font style="color:#FF0000;">压缩</font>**算法，有一点**<font style="color:#FF0000;">失真</font>**，**<font style="color:#FF0000;">比png体积</font>**要**<font style="color:#FF0000;">小</font>**，适合做**<font style="color:#FF0000;">中大图片</font>**。

gif:一般是做**<font style="color:#FF0000;">动图</font>**的。

webp：同时**<font style="color:#FF0000;">支持有损</font>**或者**<font style="color:#FF0000;">无损</font>**压缩，相同质量的图片，webp具有更小的体积。**<font style="color:#FF0000;">兼容性不是特别好。</font>**



**<font style="color:#FF0000;">JPEG(JPG)//效果好，保存图片</font>**

- JPEG图片支持的颜色比较多，图片**<font style="color:#FF0000;">可以压缩</font>**，但是**<font style="color:#FF0000;">不支持透明</font>**

- 一般用来保存照片等颜色丰富的图片				

**<font style="color:#FF0000;">GIF//动图 </font>**

- GIF支持的颜色少，只**<font style="color:#FF0000;">支持简单的透明，支持动态图</font>**

- 图片颜色单一或者是动态图时可以使用gif				

**<font style="color:#FF0000;">PNG//显示复杂的图片，为网页而生 </font>**

- PNG支持的颜色多，并且**<font style="color:#FF0000;">支持复杂的透明，不支持动图</font>**

- 可以用来显示颜色复杂的透明的图片

专为网页而生的

**<font style="color:#FF0000;">webp//优点全具备，但兼容性不好</font>**

-谷歌新推出的专门用来表示网页的一种格式

-它具有其他图片格式的所有优点，而且文件格式还很小

**<font style="color:#FF0000;">-缺点：兼容性不好</font>**				

**<font style="color:#FF0000;">base64 //与网页一起出现，需要先转字符</font>**

-讲图片使用base64编码，这样可以将图片转换为字符，通过字符形式来引入

-一般都是需要和网页一起加载的图片才会使用base64





## 13:一个页面上有大量的图片（大型电商网站），加载很慢，你有哪些方法优化这些图片的加载，给用户更好的体验
a. 图片**<font style="color:#FF0000;">懒加载</font>**，滚动到相应位置才加载图片。

b. 图片**<font style="color:#FF0000;">预加载</font>**，如果为幻灯片、相册等，将当前展示图片的前一张和后一张优先下载。

c. 如果图片为**<font style="color:#FF0000;">css图片</font>**的话，**<font style="color:#FF0000;">使用</font>**CSSsprite，SVGsprite，Iconfont、Base64等**<font style="color:#FF0000;">技术</font>**。

d. 如果**<font style="color:#FF0000;">图片过大，可以使用特殊编码</font>**的图片，加载时会**先加载一张压缩**的特别厉害的**缩略图**，以提高用户体验。



## 15:以前端角度出发，有哪些注意事项有利于SEO?
+ 维护网站，提高内容质量，保持更新。
+ 优化网站结构布局，控制首页链接数量。
+ 优化导航，采用文字方式，优化图片导航代码，添加面包屑导航。
+ 控制页面大小，减少 http 请求，提高加载速度。
+ 合理使用关键词和网页描述，使代码语义化，谨慎使用 display:none，保留文字效果。

(1)、维护网站，**<font style="color:#FF0000;">提高内容质量</font>**，保持更新

(2)、网站结构**<font style="color:#FF0000;">布局优化</font>**：尽量简单、开门见山，提倡扁平化结构。

(3)、**<font style="color:#FF0000;">控制</font>**首页**<font style="color:#FF0000;">链接数量</font>**,要适中

(4)、**<font style="color:#FF0000;">导航优化：</font>**

**<font style="color:#FF0000;">a:尽量采用文字方式</font>**

**<font style="color:#FF0000;">b:搭配图片导航，但是图片代码一定要进行优化，img标签必须添加“alt”和“title”属性</font>**

**<font style="color:#FF0000;">c:应该加上面包屑导航</font>**

(5)、**<font style="color:#FF0000;">控制页面的大小:减少http请求，提高网站的加载速度</font>**

(6)、**<font style="color:#FF0000;">适量的关键词和网页描述</font>**

**<font style="color:#FF0000;">title标题，强调重点即可，</font>**

**<font style="color:#FF0000;">meta keywords标签：关键词，列重要关键字即可</font>**

**<font style="color:#FF0000;">meta description标签：网页描述，要高度概括</font>**

(7)、**<font style="color:#FF0000;">body中的标签：尽量让代码语义化</font>**

**<font style="color:#FF0000;">a标签：页内链接，要加 “title” 属性加以说明</font>**

**<font style="color:#FF0000;">img应使用 “alt” 属性加以说明</font>**

**<font style="color:#FF0000;">strong、em标签 : 需要强调时使用</font>**

(8)、巧妙利用CSS布局

(9)、**<font style="color:#FF0000;">谨慎使用 display：none；</font>**

(10)、**<font style="color:#FF0000;">保留文字效果</font>**



## 16:对网页设置CSS样式的方式有哪些？
A:**<font style="color:#FF0000;">外部</font>**样式表，**<font style="color:#FF0000;">引入</font>**一个**<font style="color:#FF0000;">外部</font>** css **<font style="color:#FF0000;">文件</font>** 

B:**<font style="color:#FF0000;">内部</font>**样式表，将 css 代码**<font style="color:#FF0000;">放在</font>** <head> **<font style="color:#FF0000;">标签内部</font>**，<style>里 

C:**<font style="color:#FF0000;">内联</font>**样式，将 css **<font style="color:#FF0000;">样式</font>**直接**<font style="color:#FF0000;">定义</font>**在**<font style="color:#FF0000;"> HTML 元素内部</font>** 



## 17:css选择器有哪些，选择器的权重的优先级
选择器类型

(1)、ID　　#id

(2)、class　　.class

(3)、标签　　p

(4)、通用　　*

(5)、属性　　[type="text"]

(6)、伪类　　a: hover

(7)、伪元素　　li: nth - child

(8)、子选择器（ul < li） 、相邻选择器（h1 + p）、后代选择器（li a） 



权重计算规则

一般而言，选择器越特殊，它的优先级越高。也就是选择器**<font style="color:#FF0000;">指向的越准确</font>**，**<font style="color:#FF0000;">它的优先级就越高。</font>**

!important 比 内联优先级高 

优先级就近原则，样式定义最近者为准,载入样式以最后载入的定位为准;



**<font style="color:#FF0000;">优先级比较：!important > 内联样式 > id > class > 标签 > 通配</font>**



**<font style="color:#FF0000;"> !important            最高的优先级</font>**

**<font style="color:#FF0000;">        内联样式              1000</font>**

**<font style="color:#FF0000;">        id选择器               100</font>**

**<font style="color:#FF0000;">        class选择器             10</font>**

**<font style="color:#FF0000;">        类和伪类选择器          10</font>**

		**<font style="color:#FF0000;">属性选择器              10</font>**

**<font style="color:#FF0000;">        元素选择器               1           </font>**

**<font style="color:#FF0000;">        通配选择器               0</font>**

**<font style="color:#FF0000;">        继承样式               没有权重</font>**



## 18:css中，对DOM元素设置不显示的方式
**<font style="color:#FF0000;">display:none；隐藏，并且不占位 ，宽高各种属性值，都‘丢失’</font>**

**<font style="color:#FF0000;">visibility：hidden;隐藏，占位，仅是视觉上‘看不见’</font>**



**<font style="color:#FF0000;">width:0;height:0; 通过设置元素的大小使元素不显示</font>**

**<font style="color:#FF0000;">overflow:hidden;通过设置元素的大小使元素不显示</font>**

## 19:超链接访问过后，hover样式就不出现的问题是什么，如何解决
问题是：a标签的四种状态，排序出问题了？

正确排序：**<font style="color:#FF0000;">L-V-H-A</font>**

love hate原则，即l（link）ov（visited）e h（hover）a（active）te。

**<font style="color:#FF0000;">a:link 普通的、未被访问的链接</font>**

**<font style="color:#FF0000;">a:visited 用户已访问的链接</font>**

**<font style="color:#FF0000;">a:hover 鼠标指针位于链接的上方</font>**

**<font style="color:#FF0000;">a:active 链接被点击的时刻</font>**



**你先捡到了个LV包，然后你HA哈大笑。**



## 21. 行内元素和块级元素的具体区别是什么？行内元素的 padding 和 margin 可设置吗？ 
(1):块级元素(block)特性： 

总是独占一行；默认宽度是父元素100%，高度被内容撑开；

宽度(width)、高度(height)、内边距(padding)和外边距(margin)都可控制; 

(2):内联元素(inline)特性： 

宽度(width)、高度(height)、内外边距的上下都不可设置，内外边距的左右可设置，其大小就是里面文字或图片的大小。

(3):inline-block 元素

拥有内在尺寸，可设置高宽,但不会自动换行

常用行内块元素：**<font style="color:#FF0000;"><input> </font>**、<img> 、**<font style="color:#FF0000;"><button> 、<texterea> 、<label></font>**



## 22:什么是外边距重叠？重叠的结果是什么？ 
外边距重叠（ margin-collapse），在 CSS 当中，相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的**<font style="color:#FF0000;">外边距可以结合成一个单独的外边距</font>**。



当父元素没有内边距（padding）、边框（border）或者内容将其与子元素分隔开时，子元素的外边距会与父元素的外边距发生塌陷。



解决外边距重叠的问题：

1、开启元素的**<font style="color:#FF0000;">BFC</font>**属性，

2、在元素的**<font style="color:#FF0000;">前面加</font>**一个**<font style="color:#FF0000;">空的table</font>**

.mc::befor{

content:'',

display:table;

}

3、**<font style="color:#FF0000;">增加透明的边框</font>**



## 23:rgba()和opacity的区别
Opacity

 样式名，可以进行单独设置，后面跟的样式值是0-1之间

 **<font style="color:#FF0000;">作用于整个元素，以及元素内的所有内容的透明度</font>**(元素**<font style="color:#FF0000;">会继承</font>**其属性)

rgba()

 样式值，写在固定样式后面的，例如背景色，字体颜色等

**<font style="color:#FF0000;">作用于元素的颜色或其背景色</font>**(设置rgba透明的元素的子元素**<font style="color:#FF0000;">不会继承</font>**透<u>明效</u>果)

## 24. css 中可以让单行文字在垂直水平居中显示？ 
垂直方向：line-height  设置跟高度一致

水平方向：text-align   center



## 25:如何水平垂直居中一个元素
**<font style="color:#0000FF;">定位（3个），弹性布局（1个），表格单元格（1个），311</font>**

方法一：

.child{

height: 100px;

position: absolute;//父元素相对定位

top:50%;

left:50%;

**<font style="color:#FF0000;">transform: translate(-50%,-50%);</font>**

}

方法二：

.child{

width: 100px;

height: 100px;

position: absolute;

top:50%;

left:50%;

**<font style="color:#FF0000;">margin-top: -50px;</font>**

**<font style="color:#FF0000;">margin-left: -50px;</font>**

}

方法三：

child {

width: 100px;

height: 100px;

position: absolute;

**<font style="color:#FF0000;">top: 0;</font>**

**<font style="color:#FF0000;">left: 0;</font>**

**<font style="color:#FF0000;">right: 0;</font>**

**<font style="color:#FF0000;">bottom: 0;</font>**

**<font style="color:#FF0000;">margin: auto	//靠这个</font>**

}

方法四：

father{

 	width: 200px;

         height: 200px;

         **<font style="color:#FF0000;">display: flex;</font>**

**<font style="color:#FF0000;">        justify-content: center;</font>**

**<font style="color:#FF0000;">        align-items: center;</font>**

}

方式五

father{

width: 500px;

        height: 500px;

        border: 1px solid red;

         /* 将元素转成表格单元格显示 */

**<font style="color:#FF0000;">        display: table-cell;</font>**

        **<font style="color:#FF0000;"> vertical-align: middle;</font>**

**<font style="color:#FF0000;">        text-align: center;</font>**

}

son{

display:inline-block;

/*解决三像素问题*/

**<font style="color:#FF0000;">vertical-align: middle;</font>**

}

## 26:如何垂直居中一个img ？
**<font style="color:#0000FF;">弹性布局（1个），表格单元格（1个）</font>**

方法一：<img>的容器

.img-container{

width: 500px;

         height: 500px;

         border: 1px solid red;

         /* 将元素转成表格单元格显示 */

        **<font style="color:#FF0000;"> display: table-cell;</font>**

**<font style="color:#FF0000;">         vertical-align: middle;</font>**

**<font style="color:#FF0000;">         text-align: center;</font>**

}

方法二：方法二

.img-container{

**<font style="color:#FF0000;">display: flex;</font>**

**<font style="color:#FF0000;">justify-content: center;</font>**

**<font style="color:#FF0000;">align-items: center;</font>**

}



## 27. px 和 em，rem 的区别。 
px 和 em 都是长度单位，

px 的值是固定的，指定是多少就是多少，计算比较容易。

em 得值不是固定的，并且 em 相对于当前字体大小改变，若自身没有字体大小，则继承祖先元素的字体大小。 

浏览器的默认字体高都是 16px。所以未经调整的浏览器都符合: 1em=16px。

rem也是相对单位，只相对于根标签的字体大小变化而变化



## 28:Sass、LESS 是什么？大家为什么要使用他们？
**<font style="color:#FF0000;">CSS 预处理器</font>**。是 CSS 上的一种抽象层。是一种特殊的语法/语言编译成 CSS。

优势：

1. **<font style="color:#FF0000;">结构清晰，便于扩展。</font>**
2. **<font style="color:#FF0000;">减少</font>**了**<font style="color:#FF0000;">重复</font>**代码的**<font style="color:#FF0000;">编写</font>**，**<font style="color:#FF0000;">增加</font>**了**<font style="color:#FF0000;">变量</font>**等的功能
3. 可以方便的**<font style="color:#FF0000;">屏蔽浏览器私有语法差异</font>**。
4. 可以**<font style="color:#FF0000;">轻松实现多重继承</font>**。
5. 完全**<font style="color:#FF0000;">兼容CSS代码</font>**，可以**<font style="color:#FF0000;">方便地应用到老项目</font>**中。less只是在CSS语法上做了扩展，所以老的CSS代码也可以与less代码一同编译。

<font style="color:#222222;">Sass和less，css预处理器，优点，代码结构清晰，易于扩展，减少重复代码，屏蔽浏览器私有语法的差异，实现多重继承，兼容css代码，可应用于新老项目中。</font>



## 29:CSS 中 link 和@import 的区别是： 
1. Link 属于 html 标签，而@import 是 CSS 中提供的 
2. 在页面加载的时候，link 会同时被加载，而@import 引用的 CSS 会在页面加载完成后才会加载引用的 CSS ,@import 只有在 ie5 以上才可以被识别，
3. link 是 html 标签，不存在浏览器兼容性问题 
4. Link 引入样式的权重大于@import 的引用（@import 是将引用的样式导入到当前的页面中）
+ link 属于 html 标签，页面加载时同时加载，不存在兼容性问题，引入样式权重大于 @import。
+ @import 是 CSS 提供的，页面加载完成后加载引用的 CSS，仅 ie5 以上可识别。



## 30:简介盒子模型： 
标准的 W3C 盒子模型模型 ，css为了更好的布局，将页面中所有的元素形状都统一为矩形。

**<font style="color:#FF0000;">盒模型包括四个方面：内容、内边距、边框、外边距</font>**（不计入盒子实际大小）



## 31:为什么要初始化样式？ 
由于**<font style="color:#FF0000;">浏览器兼容的问题</font>**，不同的浏览器对标签的**<font style="color:#FF0000;">默认样式值不同</font>**，若不初始化会造成不同 

浏览器之间的显示差异，一般引入重制样式表，常用的有resize.css,normal.css等



## 32.  面试题：对BFC规范(块级格式化上下文：block formatting context)的理解？
BFC（块级格式化上下文），页面上的一个隔离的独立容器，一个创建了新的 BFC 的盒子是独立布局的，盒子内元素的布局**<font style="color:#FF0000;">不会影响盒子外面的元素</font>**。

可以解决两个相邻的盒子垂直外边距重叠的问题

开启BFC

1、**<font style="color:#FF0000;">float的值不是none。</font>**

2、**<font style="color:#FF0000;">position的值不是static或者relative。</font>**

3、**<font style="color:#FF0000;">display的值是inline-block、table-cell、flex</font>**

4、**<font style="color:#FF0000;">overflow的值不是visible</font>**

## 34.html 常见兼容性问题？ 
浏览器默认的margin和padding

不同解决方案：

加一个全局的 *{margin:0;padding:0;} 来统一



## 36:常见行内元素有哪些?块级元素有哪些?
CSS 规范规定，每个元素都有 display 属性，确定该元素的类型，每个元素都有默认 的 display 值

块级元素(默认值是‘block’) ： div p h1-h6 ul ol  header main  footer

行内元素(默认值是‘inline’) : a em span strong del strong

## 37:前端页面的基本构成，分别是?作用是? 
结构层  Html 

表示层  CSS 

行为层  js 



 HTML 用于构建网页的结构

  CSS  用于设置网页的样式

  JavaScript  用于实现网页的行为

**<font style="color:#FF0000;">1、结构,是网页的骨架,由html超文本标记语言创建,用于搭建文档的结构、定义网页的内容，例如标题、正文、图像等；</font>**

**<font style="color:#FF0000;">2、表现,是网页的样式,由css负责创建,用于设置文档的呈现效果,例如颜色、字体、背景等；</font>**

**<font style="color:#FF0000;">3、行为,是网页的行为,由javascript语言创建,可实时更新网页中的内容，例如从服务器获取数据并更新到网页中，能够让网页更加生动。</font>**



## 38:列出 display 的值，并说明他们的作用
display：

none：取消样式

block：块级元素

inline：行内元素

inline-block：行内块元素

normal：默认样式

flex：弹性布局



## 39:列出position的值，注意他们的定位参照原点
*absolute 

生成绝对定位的元素，相对于离最近的包含块元素进行定位。 

*fixed

生成固定定位的元素，相对于浏览器窗口进行定位。 

* relative 

生成相对定位的元素，相对于其正常位置进行定位。 

* static 默认值。没有定位，元素出现在正常的流中

**<font style="color:#FF0000;">* Sticky  开启粘滞定位</font>**



## 40:i标签与em标签和b标签与strong标签的区别
(1):b标签和strong标签都可以对文本进行加粗

(2):i标签和em标签同样也可以对文本进行倾斜

但是**<font style="color:#FF0000;">strong和em有强调的作用，有利于SEO</font>**（搜索引擎优化

所以日常工作中建议用strong和em标签。





## 44:从浏览器地址栏输入url到显示页面的步骤   
    **<font style="color:#FF0000;"> 浏览器根据请求的 URL 交给 DNS 进行域名解析</font>**，**<font style="color:#FF0000;">找到真实 IP 地址，向服务器发起请求；</font>**

      **<font style="color:#FF0000;">服务器交给后台处理完成后返回数据，浏览器接收文件（HTML、CSS、JS、images等）；</font>**

**<font style="color:#FF0000;">      浏览器对加载到的资源（HTML、CSS、JS、images等）进行语法解析，建立相应的内部数据结构（如HTML的DOM）；</font>**

**<font style="color:#FF0000;">      载入解析到的资源文件，渲染页面，完成。</font>**



## 45:写出常用的css传统布局
    表格布局

    浮动布局，

       浮动布局主要采用float和clear两个属性来构建。

    定位布局  

        position属性来实现元素的绝对定位和相对定位。

   流体布局

   弹性布局





## 46:简单描述一下什么是flex布局及常用属性说明
       1、flex-direction：排列方向

            flex-direction: row | row-reverse | column | column-reverse

       2、flex-wrap如果一条轴线排不下，如何换行

            flex-wrap: nowrap | wrap | **<font style="color:#FF0000;">wrap-reverse元素沿着辅轴反方向换行   </font>**

       3、flex-flow属性（上述两个组合）

            flex-flow: flex-direction, flex-wrap

            flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap

       4、justify-content属性（在主轴上的对齐方式）横向

            justify-content: flex-start | flex-end | center | space-between | space-around

**<font style="color:#FF0000;">space-evenly 空白分布到元素的单侧（兼容性差一些）</font>**



       5、align-items属性（在交叉轴上如何对齐）纵向

        align-items: flex-start | flex-end | center | baseline**<font style="color:#FF0000;">  基线对齐  </font>**      

 	| stretch**<font style="color:#FF0000;">  默认值，将同一行元素的长度设置为相同的值</font>**



       6、flex-grow属性（放大比例，默认为0，即如果存在剩余空间，也不放大）

        flex-grow: 默认为0  

       7、flex-shrink属性（缩小比例，默认为1，即如果空间不足，则缩小）

        flex-shrink: 默认为1

       8、flex-basis属性（在分配多余空间之前，项目占据的主轴空间）

        flex-basis: | auto

       9、flex属性

        flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选

        flex: auto; （1 1 auto）

        flex: none; （0 0 auto）





<font style="color:#FF0000;">flex-basis 元素的基础长度，指定的是元素在主轴上的基础长度，跟你设置的宽高会冲突</font>

<font style="color:#FF0000;">如果主轴是横向的，则该值指定的就是元素的宽度</font>

<font style="color:#FF0000;">如果主轴是纵向的，则该值指定的是元素的高度</font>

<font style="color:#FF0000;">-默认值是auto，表示参考元素自身的高度或宽度</font>

<font style="color:#FF0000;">-如果传递了一个具体的数值，则以该值为准 </font>

<font style="color:#FF0000;"></font>

当一个元素设置了 `flex: 1`，它会：

+ 尽可能地占据父容器的剩余空间
+ 当空间不足时，允许被压缩
+ 不考虑自身内容的初始大小



## 42、title与h1的区别
title与h1的区别：

定义：

title：概括了网站信息，可以告诉搜索引擎或者用户关于这个网站的内容主题是什么

h1：文章主题内容，告诉蜘蛛我们的网站内容最主要是什么

区别：

**<font style="color:#FF0000;">title他是显示在网页标题上、h1是显示在网页内容上</font>**

title比h1，添加的重要 (title > h1 ) ==》对于seo的了解

场景：

网站的logo都是用h1标签包裹的



## 43、b与strong的区别：
定义：

b：实体标签，用来给文字加粗的。

strong：逻辑标签，用来<font style="color:#FF0000;">加强字符语气内容</font>的。

区别：

b标签<font style="color:#FF0000;">只有加粗</font>的样式，<font style="color:#FF0000;">没有实际含义</font>。

strong表示标签内字符比较重要，用以强调的。

题外话：为了符合css3的规范，b尽量少用该用strong就行了。



## 43、i与em的区别：
定义：

i:实体标签，用来做文字倾斜的。

em：是逻辑标签，用来<font style="color:#FF0000;">强调文字语气</font>的

区别：

i只是一个<font style="color:#FF0000;">倾斜标签，没有实际含</font>义。

em表示标签内字符重要，用以强调的。

场景：

i更多的用在字体图标，em术语上（医药，生物）。

##  44、面试题：CSS哪些属性可以继承？
继承性

   **<font style="color:#FF0000;"> 可继承： font-size font-family color line-height text-algin·····; </font>**

**<font style="color:#FF0000;">    不可继承 ：border padding margin width height ;</font>**

##  45、面试题：用CSS画一个三角形
**<font style="color:#FF0000;">Width：0；</font>**

**<font style="color:#FF0000;">Height：0；</font>**

**<font style="color:#FF0000;">Border：50px solid yellowgreen；</font>**

**<font style="color:#FF0000;">border-color：transparent transparent transparent yellowgreen</font>**

## 46、 面试题：清除浮动有哪些方式？
1. 触发**<font style="color:#FF0000;">BFC</font>**

2. 多创建一个盒子，添加样式：**<font style="color:#FF0000;">clear: both;</font>**

3. after方式

**<font style="color:#FF0000;">ul:after{</font>**

**<font style="color:#FF0000;">            content: '';</font>**

**<font style="color:#FF0000;">            display: block;</font>**

**<font style="color:#FF0000;">            clear: both;</font>**

**<font style="color:#FF0000;">}</font>**



##  48、面试题：css sprite是什么,有什么优缺点
通常被意译为“CSS图像拼合”或“**<font style="color:#FF0000;">CSS贴图定位</font>**”

（1）CSS Sprites的**<font style="color:#FF0000;">优点</font>**

利用CSS Sprites能很好地**<font style="color:#FF0000;">减少网页的http请求</font>**，从而大大提高了页面的性能，这也是CSS Sprites**<font style="color:#FF0000;">最大的优点</font>**；

CSS Sprites能**<font style="color:#FF0000;">减少图片的字节</font>**，曾经多次比较过，把3张图片合并成1张图片的字节总是小于这3张图片的字节总和。

（2）CSS Sprites的**<font style="color:#FF0000;">缺点</font>**

在图片合并时，要把多张图片有序的、合理的合并成一张图片，还**<font style="color:#FF0000;">要留好足够的空间，防止板块内出现不必要的背景</font>**。在宽屏及高分辨率下的自适应页面，如果**<font style="color:#FF0000;">背景不够宽，很容易出现背景断裂；</font>**

CSSSprites在**<font style="color:#FF0000;">开发</font>**的时候比**<font style="color:#FF0000;">较麻烦</font>**，你要通过photoshop或其他工具测量计算每一个背景单元的精确位置，这是**<font style="color:#FF0000;">针线活</font>**，没什么难度，但是很**<font style="color:#FF0000;">繁琐</font>**；幸好腾讯的鬼哥用RIA开发了一个CSS Sprites样式生成工具，虽然还有一些使用上的不灵活，但是已经比photoshop测量来的方便多了，而且样式直接生成，复制，拷贝就OK！　　

CSS Sprites在**<font style="color:#FF0000;">维护</font>**的时候比较**<font style="color:#FF0000;">麻烦</font>**，如果页面背景有**<font style="color:#FF0000;">少许改动</font>**，一般**<font style="color:#FF0000;">就要改这张合并的图片</font>**，无需改的地方最好不要动，这样避免改动更多的CSS，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动CSS。

## 49、 面试题：line-height和height有什么区别？
Line-height是设置行高，**<font style="color:#FF0000;">每一行的行高</font>**

height是设置**<font style="color:#FF0000;">元素高度</font>**，整个的高度

## 50、<font style="color:#4D4D4D;">CSS的三大特性</font>
<font style="color:#4D4D4D;">CSS的三大特性：层叠性，继承性，优先级。</font>

