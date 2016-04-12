/**
 * drag and copy images into div
 * A jQuery plugin to provide simple yet fully customisable drag and paste of images.
 * https://github.com/soundwave/dragandpaste.js
 * 
 * Copyright 2016-2100, soundwave
 * Released under the GPL license.
 */
(function() {
	"use strict"
	
	var pluginName = "dropandpaste";
	var language = "zh";
	
	if($.fn.myplugin) {
		pluginName = "dropandpaste2";
	}
	
	$.fn[pluginName] = function(options) {
		/*
		 * options instruction
		 * 1.drag: true/false if drag event is listened
		 * 2.paste: true/false if drop event is listened
		 * 3.showSize: {width: 400, height: 300} the actual size of preview img
		 * 			   or {widthPercent: 0.8, heightPercent: 0.9} the ratios of container's size
		 * 			   default size is container's width * 0.85 and container's height * 0.9
		 * 4.submitElementId: the element to trigger upload operation
		 * 5.uploadUrl: indicate where to upload the file
		 * 6.fileParamName: the paramName to use when upload, default is 'file'
		 * 7.callBack: call back function after upload
		 * 8.commitInterval: minimal milliseconds between two uploads, e.g 2000, default is 0
		 * 9.preventRepeatableCommit: true/false, absolutely prevent repeatable commit under the same drag or paste event 
		 * 10.doorkeeper: function to check if more file can be drag in or paste on
		 * 11.formats: an array to specify formats allowed, e.g ['jpg','png']
		 * 12.status: on/off enable or disable this plugin, default is on
		 * 13.trigger: a function to switch the status of this plugin
		 * 14.maxFileSize: maximum file size to upload
		 * 15.messageProvider: a specified function to provide message instead of alert
		 * */
        if (typeof options === 'undefined' || options == null) {
            return this;
        }
        var container = $(this);
        if(!container.data(pluginName)) {
            container.data(pluginName, {});
        }

        if(options.drag === true) {
        	bindDrop(container, options);
        }
        if(options.paste == true) {
        	bindPaste(container, options);
        }
        
        if(options.submitElementId) {
        	$('#' + options.submitElementId).bind('click', function() {
        		// alert('execute');
        		upload(options.uploadUrl, options.callBack, options.fileParamName, container);
        	});
        }
        
	};
	
	function upload(uploadUrl, callBack, fileParamName, container) {
		var fileData = container.data('tempFile');
		if(!fileData) {
			alert('no file here');
			return;
		}
		if(!uploadUrl) {
			alert('no upload destination')
			return;
		}
		if(!fileParamName) {
			fileParamName = 'file';
		}

        var xmlHttpReq =new XMLHttpRequest();
        xmlHttpReq.open('post', uploadUrl, true);
        xmlHttpReq.onload=function() {
    		if(callBack) {
            	callBack(xmlHttpReq);
    		}
        }
		var formData = new FormData();
		formData.append(fileParamName, fileData);
		xmlHttpReq.send(formData);
	};
	
	var bindDrop = function(container,options) {
		container.bind('drop', function (e) {
    	    e.preventDefault();
    	    if(options.doorkeeper) {
    	        // doorkeeper to see whether the container permit files in.
    	    	var permit = option.doorkeeper(container);
    	    	if(!permit) {
    	    		return false;
    	    	}
    	    }
            var fileList = e.originalEvent.dataTransfer.files; 
            if(fileList.length == 0){
                return false;
            }
            if(fileList[0].type.indexOf('image') === -1){
            	alert("提示", "只支持图片格式上传！"); 
                return false;
            }
            readImg(fileList[0], container, options.showSize);
            container.data('tempFile', fileList[0]);
    	});
	};
	
	var bindPaste = function(container, options) {
		container.bind('paste', function(e) {
			if (e.originalEvent.clipboardData) {
	        	// check file type
	        	if(e.originalEvent.clipboardData.items[0].type.indexOf('image') === -1) {
	            	alert("提示", "只支持图片格式上传！"); 
	                return false;
	        	}
	    	    if(options.doorkeeper) {
	    	        // doorkeeper to see whether the container permit files in.
	    	    	var permit = option.doorkeeper(container);
	    	    	if(!permit) {
	    	    		return false;
	    	    	}
	    	    }
	            var file = e.originalEvent.clipboardData.items[0].getAsFile();//读取e.clipboardData中的数据
	            readImg(file, container, options.showSize);
	            container.data('tempFile', file);
			}
		});
	};
	
	var readImg = function(file, parent, size) {
        var reader = new FileReader();
        reader.onload = function(evt){
            var img = new Image();
            img.src = evt.target.result;
            if(size) {
                img.width = size.width;
                img.height = size.height;
            } else {
            	var div = parent[0];
            	img.width = parent.width() * 0.85;
            	img.height = parent.height() * 0.9;
            }
            parent.append(img);
        };
        reader.readAsDataURL(file);
	};
	
	
})(this, window.jQuery);