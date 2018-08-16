
;(function(){
	
	function FormValide(){
		this.options = {//默认配置参数
			valideType:{
				tel:{
					rule:/^1[\d]{10}/,//电话号码验证
					errorTip:'号码格式错误',
					emptyTip:'号码不能为空',
					blurFlag:true,//是否启用blur验证
					space:true//是否显示间隔
				},
				password:{
					rule:/^[a-zA-Z]+[\d]+/,
					errorTip:'密码格式错误',
					emptyTip:'密码不能为空',
					blurFlag:true//是否启用blur验证
				},
				number:{
					rule:/\d?/,
					errorTip:'number输入格式错误',
					emptyTip:'number输入不能为空',
					blurFlag:true//是否启用blur验证
				},
				card:{
					rule:/^1[\d]{10}/,
					errorTip:'身份证格式错误',
					emptyTip:'身份证不能为空',
					blurFlag:true,//是否启用blur验证
					space:''
				},
				text:{
					rule:/\S/,
					errorTip:'文本内容格式错误',
					emptyTip:'文本内容不能为空',
					blurFlag:true,//是否启用blur验证
					space:''
				},
				email:{
					rule:/\S/,
					errorTip:'email格式错误',
					emptyTip:'email不能为空',
					blurFlag:true,//是否启用blur验证
					space:''
				}
			},
			successFun: null,
			errorFun:null,
			isValide:false,
			sClass:'v-submit',//验证当前class下面的input
			validAll:false,//是否验证全部
			errorNodeArr:[]//错误提示节点
		}
		this.ele = null;//当前元素
		this.valideElementArr = [];//验证对象集合
		this.successFlag = false;//验证成功flag
		this.errorFlag = false;//验证失败flag
		this._slice = Array.prototype.slice;//数组slice函数
	}
	
	FormValide.prototype = {
		
		init:function(ele,options){
			
			this.options = this._extend(this.options,options);

			this.ele = null;//当前需要验证的表单class
			if(typeof ele == 'object'){
				this.ele = ele;
			}else if(typeof ele == 'string'){
				this.ele = document.querySelector(ele);
			}else{
				throw new Error('元素'+ele+'不存在');
			}
			this.valideElementArr = [];//验证对象集合
			this.valideType = this.options.valideType;//获取所有验证元素的相关信息集合
			this.successFun = this.options.sSuccess;//验证通过执行的callback
			this.errorFun = this.options.sError;//验证错误或者为空提示callback
			this.isValide = this.options.isValide;//是否开启验证
			this.sClass = this.options.sClass;//当前点击验证class
			this.validAll = this.options.validAll;//
			
			this.toValide(true);
		},
		
		/**
		 * 类型判断
		 * params[name] 传入一个变量，判断该变量的类型
		 * return 一个函数
		 * */
		_typeJudge:function(name){//判断是否为某一种类型
			var _toString = Object.prototype.toString;
		    return function(){
		        return _toString.call(arguments[0]) == '[object '+name+']';
		    }
		},
		/**
		 * 对象合并
		 * params 传入对象的个数是2个以上
		 * return 合并之后的新对象
		 **/
		_extend:function(){
			var isObject = this._typeJudge('Object');
		    var isArray = this._typeJudge('Array');
		    var length = arguments.length;
		    var target = arguments[0] || {};
		    if (typeof target!="object" && typeof target != "function") {
		        target = {};
		    }
		    for (var i = 1; i < length; i++) { 
		        var source = arguments[i]; 
		        for (var key in source) { 
		            // 使用for in会遍历数组所有的可枚举属性，包括原型。
		            if (Object.prototype.hasOwnProperty.call(source, key)) {
						var value = source[key]; 
		                if(isObject(value)){
							target[key] = this._extend(target[key],value)
						}else{
							target[key] = value; 
						}
		            }
		        } 
		    }
		    return target;
		},
		/**
		 * 验证能否通过
		 * params[currentobj] 当前传入验证的对象，例如 tel 
		 * params[_node] 当前验证的input节点
		 * return undefined;
		 * */
		_valideFun:function(currentobj,_node){
			var type = _node.getAttribute('v-check');
			var errorId = _node.getAttribute('errorId');
			var len = this.errorNodeArr.length;
			var errorTipNode = null;
			
			for(var i = 0;i<len;i++){
				
				if(errorId == this.errorNodeArr[i].getAttribute("errorId")){
					
					errorTipNode = this.errorNodeArr[i];
				}
			}
			
			var current = null;

			for(v_item in this.valideType){

				if(type == v_item){
					current = this.valideType[type];
					break;
				}
			}

			var n_value = _node.value;
			var c_rule = current.rule;
			var msg = '';
			
			if(n_value.trim() == ''){//如果值为空
				msg = current.emptyTip;
				this.errorFlag = true;
			}else{//不为空,验证是否符合规则
				if(new RegExp(c_rule).test(n_value)){//验证成功
					this.errorFlag = false;
				}else{
					this.flag = false;
					msg = current.errorTip;//验证不通过，错误提示
					this.errorFlag = true;
				}
			}
			if(this.errorFlag){
				_node.style.border = '1px solid red';
				this.successFlag = false;
				
				if(errorTipNode){
					errorTipNode.innerHTML = msg;
					errorTipNode.style.display = 'block';
				}
				
				if(!this.validAll){//验证全部
					return false;
				}
			}else{
				this.successFlag = true;
				_node.style.border = '1px solid #999';
				
				if(errorTipNode){
					errorTipNode.innerHTML = '';
					errorTipNode.style.display = 'none';
				}
				
			}
			return true;
		},
		//获取所有需要验证的input对象
		getValideElement:function(){
			var inputCheck = this.ele.querySelectorAll("input[v-check]");
			if(!inputCheck.length){//跳过验证
				return;
			}
			var vElementArr = this._slice.call(inputCheck,'');
			return vElementArr;
		},
		/**
		 * 开启验证
		 * params[blurFlag] 当为true的时候，默认设置开启blur验证 ，设为false的话，该方法调用该方法直接验证
		 * return undefined
		 **/
		toValide:function(blurFlag){
			
			var vElementArr = this.valideElementArr = this.getValideElement();
			var len = this.valideElementArr.length;
			var valideInfo = this.valideType;
			this.errorNodeArr = this._slice.call(this.ele.querySelectorAll(".error-tip"),'');
			
			for(var i=0;i<len;i++){
				var type = vElementArr[i].getAttribute('v-check');
				var currentValue = vElementArr[i].value;//获取当前inout的value值
				var errorId = vElementArr[i].getAttribute('errorId');
				var currentObj = null;
				var msg = '';
				var c_rule = null;
				var errorFlag = false;
				for(item in valideInfo){
					if(type == item){
						currentObj = valideInfo[type];
						if(blurFlag){
							this.addBlurEvent(vElementArr[i],currentObj,function(node){
								this._valideFun(currentObj,node);
								if(this.successFlag){
									this.successFun(this);
								}else{
									this.errorFun(this,msg);
								}
							}.bind(this));
						}
						break;
					}
				}
				if(!currentObj){
					continue;
				}
				
				if(!blurFlag){
					if(!this._valideFun(currentObj,vElementArr[i])){
						break;
					}
				}
			}
			if(this.successFlag){
				this.successFun(this);
			}else{
				this.errorFun(this,'not-pass');
			}
		},
		/**
		 * 通过事件代理的方式来添加点击事件，触发验证 
		 * params[sClass] 代理的对象
		 * params[callback] 点击事件触发的回调
		 * return undefined
		 **/
		addEvent:function(sClass,callback){
			this.ele.addEventListener("click",function(e){
				if(e.target.className.indexOf(sClass)>-1){
					callback();
				}
			});
		},
		/**
		 * 添加blur验证 
		 * params[node] 当前验证的node节点
		 * params[currentObj] 当前验证的类型的相关信息对象
		 * params[callFun] 验证的回调方法
		 * return undefined
		 **/
		addBlurEvent:function(node,currentObj,callFun){
			if(currentObj.blurFlag){
				node.addEventListener("blur",function(e){
					callFun(node);
				});
			}
		},
		/**
		 * 对输入的内容进行处理,通过input事件，限制输入规则
		 * params[node] 当前输入input节点
		 * params[type] 当前输入输入的类型限制
		 * 
		 * */
		inputValide:function(node,type){
			var nodeType = type;
			var _value = '';
			node.addEventListener("input",function(){
				_value = node.value;//当前元素的value
				switch(nodeType){
					
					case 'tel':
						doTel(node,_value);//
						break;
					case 'text':
						doText(node,_value);
						break;
					case 'number':
						doNumber(node,_value);
						break;
					case 'password':
						doPassword(node,_value);
						break;
					case 'card':
						doCard(node,_value);
						break;
					default:
						break;
				}
			});
			
			var doTel = function(node,value){
				
				
			}
		}
	}
	
	/**
	 * FormValide，主要用来做登录注册的表单验证
	 * 
	 * 
	 * */
	var fv = new FormValide();
	
	fv.init('.form-valide',{
		valideType:{
			tel:{
				rule:/^1[\d]{10}/,//电话号码验证
				errorTip:'号码格式错误',
				emptyTip:'号码不能为空',
				blurFlag:true,
				space:true//是否显示间隔
			},
			password:{
				rule:/^[a-zA-Z]+[\d]+/,
				errorTip:'密码格式错误',
				emptyTip:'密码不能为空'
			},
			number:{
				rule:/\d?/,
				errorTip:'number输入格式错误',
				emptyTip:'number输入不能为空',
				blurFlag:true
			},
			card:{
				rule:/^1[\d]{10}/,
				errorTip:'身份证格式错误',
				emptyTip:'身份证不能为空',
				space:''
			}
		},
		isValide:true,//开启点击验证，默认为true，设置为false之后，不开启默认点击触发验证，
		sClass:'v-submit',//点击按钮class，开启点击验证之后，需设置点击按钮class
		blurFlag:false,//是否开启blur验证方式
		isForm:true,
		validAll:true,//是否验证全部
		sSuccess:function(v){//点击登录，全部验证成功之后的回调函数
			console.log(v,'success');
		},
		sError:function(v,msg){
//			console.log(msg);//验证失败，返回对应的错误提示
		}
	});
	
	
	function submit(){
		
		var flag = fv.valide();//主动触发
		
		return flag;
		
	}
	
	document.querySelector(".click-test").addEventListener("click",function(){
		
		fv.toValide();//主动触发
		
	});
	
	
	
})();



