if(typeof jsonViewer=="undefined"){jsonViewer={}}jsonViewer.Comparer=function(){var storedObject={},addDirtyFlags=function(newObject){for(p in newObject){if(ko.isObservable(newObject[p])){if(typeof newObject[p].isDirty==="undefined"){newObject[p].isDirty=new jsonViewer.DirtyFlag(newObject[p])}}var unwrapped=ko.utils.unwrapObservable(newObject[p]);if(isObject(unwrapped)){addDirtyFlags(unwrapped)}}},isObject=function(object){return object&&typeof object==="object"&&typeof object.getMonth==="undefined"},resetDirtyFlag=function(object){object.isDirty=new jsonViewer.DirtyFlag(object)},compare=function(newObject){addDirtyFlags(newObject);recurse(newObject,this.object)},recurse=function(newObject,object){for(p in newObject){if(ko.isObservable(newObject[p])){var unwrapped=ko.utils.unwrapObservable(newObject[p]);if(object[p]){if(isObject(object[p].value)){if(newObject[p].isDirty()){resetDirtyFlag(newObject[p]);object[p].count++;object[p].value={}}recurse(unwrapped,object[p].value)}else{if(newObject[p].isDirty()){resetDirtyFlag(newObject[p]);object[p].count++;object[p].value=unwrapped;object[p].isObservable=true}}}else{var unwrapped=ko.utils.unwrapObservable(newObject[p]);parseObject(unwrapped,newObject,object,p)}}else{if(object[p]){updateObject(newObject[p],newObject,object,p)}else{parseObject(newObject[p],newObject,object,p)}}}},updateObject=function(unwrapped,newObject,object,p){if(isObject(object[p].value)){recurse(newObject[p],object[p].value)}else{if(object[p].value!==newObject[p]){object[p].count++;object[p].value=newObject[p];object[p].isObservable=false}}},parseObject=function(unwrapped,newObject,object,p){if(isObject(unwrapped)){object[p]={value:{},count:0,isObservable:ko.isObservable(newObject[p])};recurse(unwrapped,object[p].value)}else{object[p]={value:unwrapped,count:0,isObservable:ko.isObservable(newObject[p])}}};return{compare:compare,object:storedObject,addDirtyFlags:addDirtyFlags}};if(typeof jsonViewer=="undefined"){jsonViewer={}}jsonViewer.renderer=function(){var htmlEncode=function(t){return t!=null?t.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""},decorateWithSpan=function(value,className){return'<span class="'+className+'">'+htmlEncode(value)+"</span>"},getValue=function(value){if(value&&value.value)return value;else return{value:value,count:0}},valueToHtml=function(value){value=getValue(value);var valueType=typeof value.value,output="";if(value.value==null)output+=decorateWithSpan("null","type-null");else if(value.value&&value.value.constructor==Array)output+=arrayToHtml(value.value);else if(valueType=="object"&&value.value.getMonth)output+=stringToHtml(value.value.toString());else if(valueType=="object")output+=objectToHtml(value.value);else if(valueType=="number")output+=decorateWithSpan(value.value,"type-number");else if(valueType=="string")output+=stringToHtml(value.value);else if(valueType=="boolean")output+=decorateWithSpan(value.value,"type-boolean");else if(valueType=="function")output+=decorateWithSpan("function() {  }","type-callback-function");return output},stringToHtml=function(value){var output="";if(/^(http|https):\/\/[^\s]+$/.test(value))output+=decorateWithSpan('"',"type-string")+'<a href="'+value+'">'+htmlEncode(value)+"</a>"+decorateWithSpan('"',"type-string");else output+=decorateWithSpan('"'+value+'"',"type-string");return output},arrayToHtml=function(json){var i,length,output='<div class="collapser "></div>[<span class="ellipsis"></span><ul class="array collapsible">',hasContents=false;for(i=0,length=json.length;i<length;i++){hasContents=true;output+='<li><div class="hoverable">';output+=valueToHtml(json[i]);if(i<length-1)output+=",";output+="</div></li>"}output+="</ul>]";if(!hasContents)output="[ ]";return output},objectToHtml=function(json){var i,key,length,keys=Object.keys(json),output='<div class="collapser"></div>{<span class="ellipsis"></span><ul class="obj collapsible">',hasContents=false;for(i=0,length=keys.length;i<length;i++){key=keys[i];hasContents=true;if(json[key]&&json[key].hasOwnProperty("isObservable")&&json[key].isObservable)output+='<li><div class="hoverable">';else output+='<li><div class="hoverable nonObservable">';if(json[key]&&json[key].hasOwnProperty("count")&&json[key].count>0)output+='<span class="change-counter">'+json[key].count+"</span>";debugger;var css="property "+(json[key]&&json[key].isObservable?"":"nonObservable");output+='<span class="'+css+'">'+htmlEncode(key)+"</span>: ";output+=valueToHtml(json[key]);if(i<length-1)output+=",";output+="</div></li>"}output+="</ul>}";if(!hasContents)output="{ }";return output},jsonToHtml=function(json,root){var output="";output+='<div class="jsonViewer">';output+='<ul class="obj collapsible"><li><div class="hoverable"><span class="property">'+root+"</span>: ";output+=valueToHtml(json);output+="</div></li></ul>";output+="</div>";return output};return jsonToHtml}();ko.bindingHandlers.jsonViewer={bindingHandler:{},init:function(element,valueAccessor,allBindingsAccessor){this.bindingHandler=new jsonViewer.BindingHandler(element,valueAccessor,allBindingsAccessor)},update:function(element,valueAccessor,allBindingsAccessor){this.bindingHandler.compare(valueAccessor());var jsonHtml=this.bindingHandler.render();element.innerHTML=jsonHtml}};if(typeof jsonViewer=="undefined"){jsonViewer={}}jsonViewer.BindingHandler=function(element,valueAccessor,allBindingsAccessor){var comparer=jsonViewer.Comparer(),rootName=function(){var propertyString=allBindingsAccessor()._ko_property_writers.jsonViewer.toString();propertyString=propertyString.substring(24).replace(" = __ko_value; }","");return propertyString},render=function(){return jsonViewer.renderer(this.object,this.rootName())};return{rootName:rootName,compare:comparer.compare,object:comparer.object,render:render}};if(typeof jsonViewer=="undefined"){jsonViewer={}}jsonViewer.DirtyFlag=function(root){var isDirty=ko.observable(false);root.subscribe(function(){if(!isDirty()){isDirty(true)}});return isDirty};