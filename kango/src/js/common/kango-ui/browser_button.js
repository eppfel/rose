var utils=require("kango/utils"),object=utils.object,EventTarget=utils.EventTarget,IEventTarget=utils.IEventTarget,NotImplementedException=utils.NotImplementedException;function BrowserButtonBase(a){EventTarget.call(this);this._details=a}
BrowserButtonBase.prototype=object.extend(EventTarget,{_details:null,event:{COMMAND:"command",POPUP_DOCUMENT_COMPLETE:"PopupDocumentComplete"},setTooltipText:function(a){throw new NotImplementedException;},setCaption:function(a){throw new NotImplementedException;},setIcon:function(a){throw new NotImplementedException;},setBadgeValue:function(a){throw new NotImplementedException;},setBadgeBackgroundColor:function(a){throw new NotImplementedException;},setPopup:function(a){throw new NotImplementedException;
},setContextMenu:function(){throw new NotImplementedException;}});function getPublicApi(){return utils.createApiWrapper(module.exports,BrowserButtonBase.prototype,IEventTarget.prototype)};