;var TimeDate = function () {
	this.targetId;
	this.curYear;
	this.curMonth;
	this.curDay;
	this.curMonthTotalDay;

	this.selYear;
	this.selMonth;
	this.selDay;
	this.selMonthTotalDay;
	this.selectedDateTime;

	this.cfg = {
		contralBar: false
	}
};

TimeDate.prototype = {

	constructor: TimeDate,

    //合并两个对象
    _merge: function (target, source) {
    	for (var i in source) {
    	    if (typeof source[i] === 'object' && Object.prototype.toString.call(source[i]).toLowerCase() == '[object object]') {
    	        this._merge(target[i], source[i]);
    	    } else {
    	        target[i] = source[i];
    	    }
    	}
    	return target;
    },

    // bind兼容IE8及以下
    _bindIE: function () {
		if (!Function.prototype.bind) {
			Function.prototype.bind = function (oThis) { 
		    	if (typeof this !== "function") { 		
		    		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); 
		    	} 
		    	var aArgs = Array.prototype.slice.call(arguments, 1), 
		    		fToBind = this, 
		    		fNOP = function () {}, 
		    		fBound = function () { 
		    			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); 
		    		}; 
		    	fNOP.prototype = this.prototype; 
		    	fBound.prototype = new fNOP(); 
		    	return fBound; 
    		}
		}
    },

    // 事件代理
    /*_on: function ($dom ,className ,fn) {// 'aaaa' function() {}
    	var $body = document.getElementsByTagName('body')[0];
    	if (typeof($dom) === 'object') {
    		$body = $dom;
    	} else {
    		fn = className;
    		className = $dom;
    	}
    	$body.addEventListener('click', function (e) {
    		if (e.target.className.indexOf(className) >= 0) {	//timedate-day no-cur 匹配出 timedate
    			if(fn){
    				var e = e || event;
    				e.cancelBubble = true; 
    				fn(e);
    			}
    		}
    	}, false)
    },*/
    _on: function (eType, $dom ,className ,fn) {// 'aaaa' function() {}
    	var $body = document.getElementsByTagName('body')[0];
    	if (typeof($dom) === 'object') {
    		$body = $dom;
    	} else {
    		fn = className;
    		className = $dom;
    	}
    	$body.addEventListener(eType, function (e) {
    		if (e.target.className.indexOf(className) >= 0) {	//timedate-day no-cur 匹配出 timedate
    			if(fn){
    				var e = e || event;
    				e.cancelBubble = true; 
    				fn(e);
    			}
    		}
    	}, false)
    },

	//获取当前信息
	_initCurrent: function () {
		var dDate = new Date();
		this.curYear = dDate.getFullYear();
		this.curMonth = dDate.getMonth();
		this.curDay = dDate.getDate();
		this.curMonthTotalDay = this._getMonthTotalDay(this.curYear, this.curMonth + 1);
		this.selYear = this.curYear;
		this.selMonth = this.curMonth;
		this.selDay = this.curDay;
		this.selMonthTotalDay = this.curMonthTotalDay;
	},

	//获取2018年8月有多少天 getTotalDay(2018, 8)
    _getMonthTotalDay: function (year, month) {
        var d = new Date(year, month,0);
        return d.getDate();
    },

    //获取 某年某月某日 是星期几。 八月是month=7
    _getWeekNum: function (year, month, day) {
    	return new Date(year, month, day).getDay();
    },

    //获取 星期名称
    _getWeekName: function (num) {
    	switch (num) {
    		case 0: 
    			return '星期日';
    		case 1: 
    			return '星期一';
    		case 1: 
    			return '星期二';
    		case 1: 
    			return '星期三';
    		case 1: 
    			return '星期四';
    		case 1: 
    			return '星期五';
    		case 1: 
    			return '星期六';
    	}
    },

    // input 框设置值
    _setInputVal: function (val) {
    	document.querySelectorAll(this.targetId)[0].value = val;
    	this._removeHTML();
    },

    //初始化界面数据
    _initDay: function (year, month, ctr) {
    	if (year == undefined) year = this.curYear;
    	if (month == undefined) month = this.curMonth;

		if (ctr === 'show'){
    		if (document.querySelectorAll('.timedate-wrapper')[0]) return;
		}

    	var totalDay = this._getMonthTotalDay(year, month+1);
    	var prevTotalDay = this._getMonthTotalDay(year, month);
    	var week = this._getWeekNum(year, month, 1);	//year month 1号星期几
    	var arr = [];
    	for (var i = 0; i < week; i++) {
    		var weekend = week-1-i;
    		arr.push(year + '-' + month + '-' + (prevTotalDay - weekend));
    	}
    	for (var j = 0; j < totalDay; j++) {
    		arr.push(year + '-' + (month+1) + '-' + (j+1));
    	}
    	var arrlen = arr.length;
    	for (var i = 0; i < (42 - arrlen); i++) {
    		arr.push(year + '-' + (month+2) + '-' + (i+1));
    	}
    	this._initHTML(arr);
    },

    //根据配置初始化日期内容
    _initHTML: function (arr) {
    	this._removeHTML(); //	渲染之前先清空原来的
    	/*var html = "";
    	for (var i = 0; i < arr.length; i++ ) {
    		html = html + '<li class="timedate-day" dateTime-day="'+ arr[i] +'">'+ arr[i].split('-')[2] +'</li>';
    	}*/

    	var html = "";
    	var flag = false;
    	var clazz = "";
    	var firstFlag = true;
    	for (var i = 0; i < arr.length; i++ ) {

    		var arrDay = parseInt(arr[i].split('-')[2]);
    		if (i+1 != arr.length) {
    			var arrNextDay = parseInt(arr[i+1].split('-')[2]);
    		} else {
    			var arrNextDay = arrDay;
    		}

    		if (firstFlag) {
    			if (i === 0 && arrDay === 1) {
    				clazz = 'cur';
    				flag = true;
    			} else {
    				clazz = 'no-cur';
    				flag = false;
    			}
    			firstFlag = false;
    		}

			if (this.selYear+'-'+(this.selMonth+1)+'-'+this.selDay === arr[i]) {
	    		html = html + '<li class="timedate-day sel-cur" dateTime-day="'+ arr[i] +'">'+ arr[i].split('-')[2] +'</li>';
			} else {
	    		html = html + '<li class="timedate-day ' + clazz + '" dateTime-day="'+ arr[i] +'">'+ arr[i].split('-')[2] +'</li>';
			}

    		if (arrNextDay < arrDay) {
    			if (flag) {
	    			clazz = 'no-cur';
    			} else {
    				clazz = 'cur';
    			}
    			flag = !flag;
    		}

    	}
    	
    	var $fragment = document.createDocumentFragment();
		var $div = document.createElement('div');
		$div.className = "timedate-wrapper";
		$div.innerHTML = '<div class="timedate-main-wrapper">\
							<div class="timedate-header-wrapper">\
								<div class="timedate-prev-y">《</div>\
								<div class="timedate-prev-m"><</div>\
								<div class="timedate-select">\
									<span class="timedate-select-y">'+ this.selYear +'年</span>\
									<span class="timedate-select-m">'+ (this.selMonth+1) +'月</span>\
								</div>\
								<div class="timedate-next-m">></div>\
								<div class="timedate-next-y">》</div>\
							</div>\
							<div class="timedate-body-wrapper">\
								<ul class="timedate-week-wrapper">\
									<li>周日</li>\
									<li>周一</li>\
									<li>周二</li>\
									<li>周三</li>\
									<li>周四</li>\
									<li>周五</li>\
									<li>周六</li>\
								</ul>\
								<ul class="timedate-day-wrapper">'+ html +'</ul>\
							</div>\
						</div>\
						<div class="timedate-ctrl-warpper">\
							<div class="timedate-clear">清除</div>\
							<div class="timedate-now">现在</div>\
							<div class="timedate-confrim">确定</div>\
						</div>';
		$fragment.appendChild($div);
    	document.getElementsByTagName('body')[0].append($fragment);

    },

    _removeHTML: function () {
    	var $body = document.getElementsByTagName('body')[0];
    	var $div = document.querySelectorAll('.timedate-wrapper')[0];
    	if (!$div) return;
    	$body.removeChild($div);
    },

    //给选择对象绑定事件
    _bind: function ($ele) {
    	// document.addEventListener('focus', this.__eventTouchMove.bind(this), {passive: false})
    	// document.addEventListener('blur', this.__eventTouchEnd.bind(this), {capture: false})
    	$ele.addEventListener('focus', function (e) {
    		this._show(e)
    	}.bind(this), false);

    	/*document.addEventListener('mouseover', function(e) {
    		if (e.target.className && e.target.className.indexOf('timedate-day') >= 0) {
    			e.target.classList.add('hour-cur');
    		}
    	})
    	document.addEventListener('mouseout', function(e) {
    		if (e.target.className && e.target.className.indexOf('timedate-day') >= 0) {
    			e.target.classList.remove('hour-cur');
    		}
    	})*/

    	this._on('mouseover', 'timedate-day', function(e) {
    		// if (e.target.className && e.target.className.indexOf('timedate-day') >= 0) {
    		e.target.classList.add('hour-cur');
    		// }
    	})
    	this._on('mouseout', 'timedate-day', function(e) {
    		// if (e.target.className && e.target.className.indexOf('timedate-day') >= 0) {
    		e.target.classList.remove('hour-cur');
    		// }
    	})

    	this._on('mouseover', 'timedate-prev-y', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-prev-y', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-next-y', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-next-y', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-prev-m', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-prev-m', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-next-m', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-next-m', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-select-y', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-select-y', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-select-m', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-select-m', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-clear', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-clear', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-now', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-now', function(e) {
    		e.target.classList.remove('hover-active');
    	})

    	this._on('mouseover', 'timedate-confrim', function(e) {
    		e.target.classList.add('hover-active');
    	})
    	this._on('mouseout', 'timedate-confrim', function(e) {
    		e.target.classList.remove('hover-active');
    	})


    	this._on('click', $ele, 'time-date', function (e) {
    	}.bind(this));

    	document.addEventListener('click', function() {
    		this._removeHTML();
    	}.bind(this), false)

    	// 年控制事件代理
    	this._on('click', 'timedate-prev-y', function (e) {
    		this.selYear = this.selYear - 1;
    		this._initDay(this.selYear, this.selMonth);
    	}.bind(this));

    	this._on('click', 'timedate-next-y', function (e) {
    		this.selYear = this.selYear + 1;
    		this._initDay(this.selYear, this.selMonth);
    	}.bind(this))
    	
    	// 月控制事件代理
    	this._on('click', 'timedate-prev-m', function(e) {
			this.selMonth = this.selMonth-1;
			if (this.selMonth < 0) {	  // 减年处理
				this.selMonth = 11;
				this.selYear = this.selYear - 1;
			}
    		this._initDay(this.selYear, this.selMonth);
    	}.bind(this));

    	this._on('click', 'timedate-next-m', function (e) {
			this.selMonth = this.selMonth+1;
			if (this.selMonth > 11) {	// 加年处理
				this.selMonth = 0;
				this.selYear = this.selYear + 1;
			}
    		this._initDay(this.selYear, this.selMonth);
    	}.bind(this))

    	// 年日选择事件代理
    	this._on('click', 'timedate-select-y', function(e) {
    		console.log('timedate-select-y');
    	}.bind(this));

    	this._on('click', 'timedate-select-m', function (e) {
    		console.log('timedate-select-m');
    	}.bind(this))

    	// 日期选择事件代理
    	this._on('click', 'timedate-day', function (e) {
    		if (!this.selYear) this.selYear = this.curYear;
    		if (!this.selMonth) this.selMonth = this.curMonth;
    		if (!this.selDay) this.selDay = this.curDay;

    		var dateTimeDay = e.target.getAttribute('datetime-day');
    		this.selDay = e.target.innerHTML;
    		this.selectedDateTime = dateTimeDay;
    		this._setInputVal(dateTimeDay);
    	}.bind(this))


    	// 控制部分事件代理
    	this._on('click', 'timedate-clear', function (e) {
    		this._setInputVal('');
    	}.bind(this))
    	this._on('click', 'timedate-now', function(e) {
    		this.selYear = this.curYear;
    		this.selMonth = this.curMonth;
    		this.selDay = this.curDay;
    		this.selectedDateTime = this.curYear+'-'+(this.curMonth+1)+'-'+this.curDay;
    		this._setInputVal(this.selectedDateTime);
    	}.bind(this));
    	this._on('click', 'timedate-confrim', function (e) {
    		this._setInputVal(this.selectedDateTime);
    	}.bind(this));

    },

    // 初始化日历
	init: function (id, option) {
		this.targetId = id;
		this._bindIE();
		id = id.replace(/\#/, '');
		var $inputTimeDate = document.getElementById(id);
		if ($inputTimeDate === undefined) return;
		this._bind($inputTimeDate);
		if (option) {
			this._merge(this.cfg, option);
		}
		this._initCurrent();

	},

	// 展示选择日历
	_show: function (e) {
		this._initDay(this.selYear, this.selMonth, 'show');//setInterval setTimeout 事件绑定  多层对象嵌套
	}

}

var c = new TimeDate();
c.init('#timeDate',{
	contralBar: true 
});