#扩展vue-validator

这个插件是配合vue，使用指令 `v-validate` 对model进行验证，验证方法可以自己写也可以使用默认的几个方法。

【扩展插件】可以直接添加和显示提示消息，不用通过手写，直接显示错误信息根据配置或者默认设置。

##指令

###v-validate

【例如】 [demo](validationSimple.html)

- 这个指令通常是跟 `v-model` 一起使用
- 这个指令接受视图模型的属性。
- 指令参数：`wait-for`

验证`v-model`里面的值。你可以使用内建的验证方法也可以自己自定义验证方法。

###使用方法

####JS
	//初始化
    var validator = window["vue-validator"]

    Vue.use(validator)

    new Vue({
        el:"#form",
        //自定义验证器
        validator: {
            validates: {
                email: function (val) {
                    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
                },
                value:function(val){
                    return parseInt(val, 10) > 0 && parseInt(val, 10) < 100;
                }
            },
            message:{
                email:"请填写正确的邮箱",
                value:"数值不能大于10 ，小于100"
            },
            absolute:true
        },
        data: {
            id:"",
            password:"12",
            email:""
        },
        methods:{
            click:function(){
                //全局验证
                console.log(this.valid)
                //id model验证
                console.log(this.validation.id.valid)
                //password model验证
                console.log(this.validation.password.valid)
            }
        }
    });

####html

	<form id="form">
	    <div style="margin: 20px;padding: 8px; position: relative;">
	        ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16">
	    </div>
	    <br /><br />
	    Password: <input type="text" v-model="password" v-validate="required, min: 8, max: 16"><br /><br />
	    email: <input type="text" v-model="email" v-validate="required, email"><br /><br />
	    value: <input type="text" v-model="value" v-validate="required, value"><br /><br />
	    <input type="submit" value="send" disabled v-if="!valid"><br /><br />
	    <input type="submit" value="send" v-if="valid"><br /><br />
	    <input type="button" value="click" v-on="click:click"/>
	</form>



###懒初始化

【例如】 [demo](validationLazyInitialization.html)

当调用 `wait-for` 这个属性时，可以等待异步数据加载完在进行验证。在 `created` `compiled` `ready` 里使用 `$emit` 可以指定事件名处理赋值

####JS

	var validator = window["vue-validator"]

        Vue.use(validator)

        new Vue({
            el:"#form",
            data: {
                name: "",
                email: "",
                res:{
                    name:"testtest",
                    email:""
                }
            },
            validator: {
                validates: {
                    email: function (val) {
                        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
                    }
                },
                message:{
                    email:"请填写正确的邮箱"
                }
            },
            ready: function () {
                var self = this

                // ...

                // load user profile data with ajax (example: vue-resource)
                $.get("data/data.txt", function(data){
                    //console.log(data)
                    // ...

                    // emit the event that was specified 'wait-for' attribute
                    self.$emit('name-loaded', self.res.name)
                    self.$emit('email-loaded', self.res.email)

                    // ...
                });

            }
        })

####HTML

	<form id="form">
        name: <input type="text" v-model="name" wait-for="name-loaded" v-validate="required, minLength:5"><br /><br />
        email: <input type="text" v-model="email" wait-for="email-loaded" v-validate="required, email"><br /><br />
        <input type="submit" value="send" v-if="valid && dirty">
    </form>



##属性

###验证

`validation` 获得验证程序里的验证结果对应每个 `v-model` 。

【格式】

	validation.model.validator

【例如】

	<form id="user-form">
	  Password: <input type="password" v-model="password" v-validate="required"><br />
	  <div>
	    <span v-if="validation.password.required">required your password.</span>
	  </div>
	</form>


###有效性

`valid`获得验证程序验证的结果。

- 类型：布尔值
	- true: 成功
    - false: 失败


可以获得所有验证程序的验证结果；也可获得每个验证程序的验证结果。

###无效性

`valid`与`invalid`是相对的。

【格式】

	valid  || invalid
	 
###改变

`dirty` 查看 `v-model` 从初始化值，是否有改变

- 类型：布尔值
	- true: 表单初始化值改变
    - false: 表单初始化值没有改变

可以对所有model；也可对单个model进行判断是否改变。



###


##方法

###内建方法

- required

【例】

	<form id="user-form">
	  Password: <input type="password" v-model="password" v-validate="required"><br />
	  <div>
	    <span v-if="validation.password.required">required your password.</span>
	  </div>
	</form>

- pattern

【例】

	<form id="user-form">
	  Zip: <input type="text" v-model="zip" v-validate="pattern: '/^[0-9]{3}-[0-9]{4}$/'"><br />
	  <div>
	    <span v-if="validation.zip.pattern">Invalid format of your zip code.</span>
	  </div>
	</form>

- minLength

【例】

	<form id="blog-form">
	  <input type="text" v-model="comment" v-validate="minLength: 16">
	  <div>
	    <span v-if="validation.comment.minLength">too short your comment.</span>
	  </div>
	</form>

- maxLength

【例】

	<form id="blog-form">
	  <input type="text" v-model="comment" v-validate="maxLength: 128">
	  <div>
	    <span v-if="validation.comment.maxLength">too long your comment.</span>
	  </div>
	</form>

- min

【例】
	
	<form id="config-form">
	  <input type="text" v-model="threshold" v-validate="min: 0">
	  <div>
	    <span v-if="validation.threshold.min">too small threshold.</span>
	  </div>
	</form>

- max

【例】

	<form id="config-form">
	  <input type="text" v-model="threshold" v-validate="max: 100">
	  <div>
	    <span v-if="validation.threshold.max">too big threshold.</span>
	  </div>
	</form>

###自定义方法

【例】

####JS
	
	var validator = window["vue-validator"]

    Vue.use(validator)

	var MyComponent = Vue.extend({
	  data: {
	    name: '',
	    address: ''
	  },
	  validator: {
	    validates: {
	      email: function (val) {
	        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
	      }
	    }
	  }
	})
	
	new MyComponent().$mount('#user-form')

####HTML

	<form id="user-form">
	  name: <input type="text" v-model="name" v-validate="required"><br />
	  address: <input type="text" v-model="address" v-validate="email"><br />
	  <input type="submit" value="send" v-if="valid && dirty">
	  <div>
	    <span v-if="validation.name.required">required your name.</span>
	    <span v-if="validation.address.email">invalid your email address format.</span>
	  </div>
	</form>

##异步验证

可以实现异步验证。

##更多

想更多的了解vue-validator这个插件，请点击[查看](https://github.com/vuejs/vue-validator)








