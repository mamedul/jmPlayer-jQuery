/*!
 * jmPlayer - jQuery Audio & Video player
 *
 * Copyright (c) 2021 MAMEDUL ISLAM
 *
 * Licensed under the MIT license:
 *   https://opensource.org/licenses/MIT
 *
 * Project home:
 *   https://mamedul.gitlab.io/dev-projects/jquery-jmplayer
 *
 * Version: 1.0.0
 */

(function($) {

	"use strict";

	jQuery.fn.jmPlayer = function(options) {

		// Plugin Settings
		var settings = jQuery.extend({
			seekable: true, // Time seekable
			seekAmount: 0.05, // Seek amount in percentage
			volume: 50, // Percentage
			volumeChangeable: true, // Volume can change
			autoplay: false, // Autoplay on loaded
			position: 0, // Start position
			poster: true, // Show video poster
			defaultControls: false, // Default controls show
			// Custom controls elements
			controls: {
				play: null, // Play element
				pause: null, // Pause element
				stop: null, // Stop element
				togglePlayPause: null, // Toggle play & pause element
				volume: null, // Volume element
				volumePlus: null, // Volume plus element
				volumeMinus: null, // Volume minus element
				mute: null, // Mute element
				unmute: null, // Unmute element
				toggleMute: null, // Toggle mute element
				seek: null, // Seek element
				forward: null, // Forward element
				backward: null, // Backward element
				fullScreen: null, // Fullscreen element
				restoreScreen: null, // Restore screen element
				toggleScreen: null, // Toggle screen element
			},
			// Event handle
			onbefore: null, // On load before
			onloadstart: null, // On load start the media
			onprogress: null,  // On progress the media
			onsuspend: null, // On suspend the media
			onabort: null, // On abort the media
			onemptied: null, // On progress the media
			onstalled: null, // On stalled the media
			onerror: null, // On stalled the media
			onplay: null, // On play the the media
			onpause: null, // On pause the media
			onloadedmetadata: null, // On loaded metadata the media
			onloadeddata: null, // On loaded data the media
			onwaiting: null, // On waiting the media
			onplaying: null, // On playing the media
			oncanplay: null, // On can play the media
			oncanplaythrough: null, // On can play through the media
			onseeking: null, // On seeking the media
			onseeked: null, // On seek the media
			ontimeupdate: null, // On time update the media
			onended: null, // On end the media
			onratechange: null, // On rate change the media
			ondurationchange: null, // On duration change the media
			onvolumechange: null, // On volume change the media
			onready: null, // On ready the media
			onresize: null, // On resize the media
			onclick: null, // On click the media
			onmute: null, // On mute the media
			onunmute: null, // On unmute the media
		}, options);

		// Parse seconds
		var parseSeconds = function(seconds){
			var s = seconds;
			var h = Math.floor(s / 3600);
            var hm = Math.floor(s % 3600);
			var m = Math.floor(hm / 60);
			m = (m >= 10) ? m : "0" + m;
			s = Math.floor(s % 60);
			s = (s >= 10) ? s : "0" + s;
			return (h>0?h+":":"") + m + ":" + s;
		};

		/* View in fullscreen */
		var openFullscreen= function(elem){
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
		};
		
		/* Close fullscreen */
		var closeFullscreen = function (elem=false) {
			if(!elem)elem=document;
			if (elem.exitFullscreen) {
				elem.exitFullscreen();
			} else if (elem.webkitExitFullscreen) {
				elem.webkitExitFullscreen();
			} else if (elem.msExitFullscreen) {
				elem.msExitFullscreen();
			}
		};

		var jmPlayer = function (that) {

			var current=null;

			var keep = {};

			try{
				if( that && that instanceof HTMLMediaElement ) {
					current = that;
				}else if( !( that && that instanceof HTMLMediaElement ) && settings.onerror!=null ) {
					settings.onerror(that);
				}
			}catch(err){
				if( settings.onerror!=null ){ settings.onerror(that); }
			}

			if(current!=null){
				
				keep.muted = current.muted;

				if( settings.onbefore!=null ){ settings.onbefore(current); }

				jQuery(current).on("loadstart", function(e){ if( settings.onloadstart!=null ){ settings.onloadstart(e); }});
				jQuery(current).on("progress", function(e){ if( settings.onprogress!=null ){
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current ,
					duration =  tgt.duration;
					var buffered_time = 0;
					if (duration > 0) {
						for (var i = 0; i < tgt.buffered.length; i++) {
							if (tgt.buffered.start(tgt.buffered.length - 1 - i) < tgt.currentTime) {
								buffered_time = tgt.buffered.end(tgt.buffered.length - 1 - i);
								break;
							}
						}
					}
					settings.onprogress(e,buffered_time);
				}});
				jQuery(current).on("suspend", function(e){ if( settings.onsuspend!=null ){ settings.onsuspend(e); }});
				jQuery(current).on("abort", function(e){ if( settings.onabort!=null ){ settings.onabort(e); }});
				jQuery(current).on("emptied", function(e){ if( settings.onemptied!=null ){ settings.onemptied(e); }});
				jQuery(current).on("stalled", function(e){ if( settings.onstalled!=null ){ settings.onstalled(e); }});
				jQuery(current).on("error", function(e){ if( settings.onerror!=null ){ settings.onerror(that); }});
				jQuery(current).on("play", function(e){ if( settings.onplay!=null ){ settings.onplay(e); } });
				jQuery(current).on("pause", function(e){ if( settings.onpause!=null ){ settings.onpause(e); }});
				jQuery(current).on("loadedmetadata", function(e){ if( settings.onloadedmetadata!=null ){ settings.onloadedmetadata(e);}});
				jQuery(current).on("loadedmetadata", function(e){ if( settings.onready!=null ){ settings.onready(e); }});
				jQuery(current).on("loadeddata", function(e){ if( settings.onloadeddata!=null ){ settings.onloadeddata(e); }});
				//jQuery(current).on("ready", function(e){ if( settings.onready!=null ){ settings.onready(e); }});
				jQuery(current).on("waiting", function(e){ if( settings.onwaiting!=null ){ 
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current ,
					duration =  tgt.duration;
					var buffered_time = 0;
					if (duration > 0) {
						for (var i = 0; i < tgt.buffered.length; i++) {
							if (tgt.buffered.start(tgt.buffered.length - 1 - i) < tgt.currentTime) {
								buffered_time = tgt.buffered.end(tgt.buffered.length - 1 - i);
								break;
							}
						}
					}
					settings.onwaiting(e,buffered_time);
				}});
				jQuery(current).on("playing", function(e){ if( settings.onplaying!=null ){ settings.onplaying(e); }});
				jQuery(current).on("canplaythrough", function(e){ if( settings.oncanplaythrough!=null ){ settings.oncanplaythrough(e); }});
				jQuery(current).on("seeking", function(e){ if( settings.onseeking!=null ){
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current ,
					duration =  tgt.duration;
					var buffered_time = 0;
					if (duration > 0) {
						for (var i = 0; i < tgt.buffered.length; i++) {
							if (tgt.buffered.start(tgt.buffered.length - 1 - i) < tgt.currentTime) {
								buffered_time = tgt.buffered.end(tgt.buffered.length - 1 - i);
								break;
							}
						}
					}
					settings.onseeking(e,buffered_time);
				}});
				jQuery(current).on("seeked", function(e){ if( settings.onseeked!=null ){
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current,
					duration =  tgt.duration;
					var buffered_time = 0;
					if (duration > 0) {
						for (var i = 0; i < tgt.buffered.length; i++) {
							if (tgt.buffered.start(tgt.buffered.length - 1 - i) < tgt.currentTime) {
								buffered_time = tgt.buffered.end(tgt.buffered.length - 1 - i);
								break;
							}
						}
					}
					settings.onseeked(e,buffered_time);
				}});
				jQuery(current).on("timeupdate", function(e){
					if( settings.ontimeupdate!=null ){
						e = e || Event || window.Event;
						var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current,
						duration =  tgt.duration,
						buffered_time = tgt.currentTime;
						settings.ontimeupdate(e,buffered_time);
					}
				});
				jQuery(current).on("ended", function(e){ if( settings.onended!=null ){ settings.onended(e); }});
				jQuery(current).on("ratechange", function(e){ if( settings.onratechange!=null ){ settings.onratechange(e); }});
				jQuery(current).on("durationchange", function(e){ if( settings.ondurationchange!=null ){
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current,
					duration =  tgt.duration, 
					buffered_time = tgt.currentTime;
					settings.ondurationchange(e,buffered_time);
				}});

				jQuery(current).on("volumechange", function(e){ if( settings.onvolumechange!=null ){ if(current.muted){keep.muted=true;}else{keep.muted=false;} settings.onvolumechange(e); }});

				jQuery(current).on("resize", function(e){ if( settings.onresize!=null ){
					e = e || Event || window.Event;
					var tgt = e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current;
					var w = tgt.videoWidth;
					var h = tgt.videoHeight;
					var wElement = tgt.clientWidth;
					var hElement = tgt.clientHeight;
					//if (h) { jQuery(current).attr("data-videoHeight", h); }
					//if (w) { jQuery(current).attr("data-videoWidth", w); }
					if (hElement) { jQuery(current).attr("data-videoHeight", hElement); }
					if (wElement) { jQuery(current).attr("data-videoWidth", wElement); }
					//settings.onresize(e);
				}});
				jQuery(current).on("click", function(e){ if( settings.onclick!=null ){ settings.onclick(e); }});
				jQuery(window).on('resize', function(e) {
					e = e || Event || window.Event;
					e.target = e.srcElement = e.currentTarget = current;
					var w = e.target.videoWidth;
					var h = e.target.videoHeight;
					var wElement = current.clientWidth;
					var hElement = current.clientHeight;
					var currentHeight = parseInt(jQuery(current).attr("data-videoHeight"));
					var currentWidth =  parseInt(jQuery(current).attr("data-videoWidth"));
					if ( (currentHeight && hElement && currentHeight!=hElement) || (currentWidth && wElement && currentWidth!=wElement) ){
						e.target = e.srcElement = e.currentTarget = current;
						//if (h) { jQuery(current).attr("data-videoHeight", h); }
						//if (w) { jQuery(current).attr("data-videoWidth", w); }
						if (hElement) { jQuery(current).attr("data-videoHeight", hElement); }
						if (wElement) { jQuery(current).attr("data-videoWidth", wElement); }
						settings.onresize(e);
					}
					if(!currentHeight && hElement){ jQuery(current).attr("data-videoHeight", hElement);}
					if(!currentWidth && wElement){ jQuery(current).attr("data-videoHeight", wElement);}
				});

				jQuery(window).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e) {
					
					e = e || Event || window.Event;
					e.target = e.srcElement = e.currentTarget = e.target || e.srcElement || current;
					var w = e.target.videoWidth;
					var h = e.target.videoHeight;
					var wElement = current.clientWidth;
					var hElement = current.clientHeight;
					var currentHeight = parseInt(jQuery(current).attr("data-videoHeight"));
					var currentWidth =  parseInt(jQuery(current).attr("data-videoWidth"));
					if ( (currentHeight && hElement && currentHeight!=hElement) || (currentWidth && wElement && currentWidth!=wElement) ){
						e.target = e.srcElement = e.currentTarget = current;
						//if (h) { jQuery(current).attr("data-videoHeight", h); }
						//if (w) { jQuery(current).attr("data-videoWidth", w); }
						if (hElement) { jQuery(current).attr("data-videoHeight", hElement); }
						if (wElement) { jQuery(current).attr("data-videoWidth", wElement); }
						settings.onresize(e);
					}
					if(!currentHeight && hElement){ jQuery(current).attr("data-videoHeight", hElement);}
					if(!currentWidth && wElement){ jQuery(current).attr("data-videoHeight", wElement);}
				});

				/*
				jQuery(current).on('play pause ended timeupdate volumechange', function(e){
					if ( jQuery(current).prop('muted') || current.muted ) {
						if( settings.onmute!=null && !keep.muted ){ settings.onmute(e); }
						//keep.muted=true;
					} else {
						if( settings.onunmute!=null && keep.muted ){ settings.onunmute(e); }
						//keep.muted=false;
					}
				});
				*/


				// Controls 
				if( settings.controls.play!=null && jQuery(settings.controls.play).length>0){
					jQuery(settings.controls.play).on("click", function(e){var playPromise=current.play(); if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});} });
				}

				if( settings.controls.pause!=null && jQuery(settings.controls.pause).length>0){
					jQuery(settings.controls.pause).on("click", function(e){var playPromise=current.pause(); if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});} });
				}

				if( settings.controls.stop!=null && jQuery(settings.controls.stop).length>0){
					jQuery(settings.controls.stop).on("click", function(e){current.currentTime=0; var playPromise=current.pause(); if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});} });
				}

				if( settings.controls.togglePlayPause!=null && jQuery(settings.controls.togglePlayPause).length>0){
					jQuery(settings.controls.togglePlayPause).on("click", function(e){if(current.paused){var playPromise=current.play();}else{var playPromise=current.pause();}  if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});} });
				}
				
				if( settings.controls.volume!=null && jQuery(settings.controls.volume).length>0){
					jQuery(settings.controls.volume).on("change input", function(e){
						var val = $(settings.controls.volume).val();
						var max = $(settings.controls.volume).attr('max');
						if( val!="undefined" && max!="undefined" && !isNaN(parseFloat(val)) && !isNaN(parseFloat(max)) ){
							var parts = val/max;
							parts = parts>1?1:(parts<0?0:parts);
							current.volume = parts;
						}
						jQuery(current).trigger("volumechange");
					});
				}

				if( settings.controls.volumePlus!=null && jQuery(settings.controls.volumePlus).length>0){
					jQuery(settings.controls.volumePlus).on("click", function(e){current.volume = (current.volume+0.1>1)?1:current.volume+0.1;});
				}

				if( settings.controls.volumeMinus!=null && jQuery(settings.controls.volumeMinus).length>0){
					jQuery(settings.controls.volumeMinus).on("click", function(e){current.volume = (current.volume-0.1<0)?0:current.volume-0.1;});
				}

				if( settings.controls.mute!=null && jQuery(settings.controls.mute).length>0){
					jQuery(settings.controls.mute).on("click", function(e){
						keep.muted = true;
						current.muted = true;
						e = e || Event || window.Event;
						e.target = e.srcElement = e.currentTarget = current;
						if( settings.onmute!=null ){ settings.onmute(e); }
					});
				}

				if( settings.controls.unmute!=null && jQuery(settings.controls.unmute).length>0){
					jQuery(settings.controls.unmute).on("click", function(e){
						keep.muted = false;
						current.muted = false;
						e = e || Event || window.Event;
						e.target = e.srcElement = e.currentTarget = current;
						if( settings.onunmute!=null ){ settings.onunmute(e); }
					});
				}

				if( settings.controls.seek!=null && jQuery(settings.controls.seek).length>0 && settings.seekable===true){
					jQuery(settings.controls.seek).on("change input", function(e){
						var val = $(settings.controls.seek).val();
						var max = $(settings.controls.seek).attr('max');
						if( current.duration>0 && val!="undefined" && max!="undefined" && !isNaN(parseFloat(val)) && !isNaN(parseFloat(max)) ){
							var parts = val/max;
							parts = parts>1?1:(parts<0?0:parts);
							current.currentTime = current.duration*parts;
						}
					});
				}

				if( settings.controls.forward!=null && jQuery(settings.controls.forward).length>0 && settings.seekable===true){
					jQuery(settings.controls.forward).on("click", function(e){
						var multiply_by = isNan(parseFloat(settings.seekAmount))?0.05:parseFloat(settings.seekAmount);
						var currTime = current.currentTime+current.duration*multiply_by;
						current.currentTime = (currTime>1)?1:(currTime<0?0:currTime);
					});
				}

				if( settings.controls.backward!=null && jQuery(settings.controls.backward).length>0 && settings.seekable===true){
					jQuery(settings.controls.backward).on("click", function(e){
						var multiply_by = isNan(parseFloat(settings.seekAmount))?0.05:parseFloat(settings.seekAmount);
						var currTime = current.currentTime-current.duration*multiply_by;
						current.currentTime = (currTime<0)?0:(currTime>1?1:currTime);
					});
				}

				if( settings.controls.fullScreen!=null ){
					if( typeof settings.controls.fullScreen=="string" || ( typeof settings.controls.fullScreen=="object" && settings.controls.fullScreen.length==1 && settings.controls.fullScreen[0] && jQuery(settings.controls.fullScreen[0]).length>0 ) ){
						jQuery(settings.controls.fullScreen).on("click", function(e){
							openFullscreen(current);
						});
					}else if( ( typeof settings.controls.fullScreen=="object" && settings.controls.fullScreen.length==2 ) && settings.controls.fullScreen[0] && settings.controls.fullScreen[1] && jQuery(settings.controls.fullScreen[0]).length>0 && jQuery(settings.controls.fullScreen[1]).length>0 ){
						jQuery(settings.controls.fullScreen[0]).on("click", function(e){
							openFullscreen(settings.controls.fullScreen[1]);
						});
					}
					
				}

				if( settings.controls.restoreScreen!=null ){
					if( typeof settings.controls.restoreScreen=="string" || ( typeof settings.controls.restoreScreen=="object" && settings.controls.restoreScreen.length==1 && settings.controls.restoreScreen[0] && jQuery(settings.controls.restoreScreen[0]).length>0 ) ){
						jQuery(settings.controls.restoreScreen).on("click", function(e){
							closeFullscreen(false);
						});
					}else if( typeof settings.controls.restoreScreen=="object" && settings.controls.restoreScreen.length==2 && settings.controls.restoreScreen[0] && settings.controls.restoreScreen[1] && jQuery(settings.controls.restoreScreen[0]).length>0 && jQuery(settings.controls.restoreScreen[1]).length>0 && jQuery(settings.controls.restoreScreen[1]).closest(settings.controls.restoreScreen[0]).length>0 ){
						jQuery(settings.controls.restoreScreen[0]).on("click", function(e){
							try{closeFullscreen(settings.controls.restoreScreen[1]);}catch{closeFullscreen(false);}
						});
					}
				}

				if( settings.controls.toggleScreen!=null ){
					if( ( typeof settings.controls.toggleScreen=="string" || ( typeof settings.controls.toggleScreen=="object" && settings.controls.toggleScreen.length==1 ) ) && jQuery(settings.controls.toggleScreen).length>0 ){
						jQuery(settings.controls.toggleScreen).on("click", function(e){
							closeFullscreen(false);
							if((window.fullScreen)||(window.innerWidth==screen.width && window.innerHeight==screen.height)) {
								closeFullscreen(false);
							} else {
								openFullscreen(current);
							}
						});
					}else if( ( typeof settings.controls.toggleScreen=="object" && settings.controls.toggleScreen.length==2 ) && settings.controls.toggleScreen[0] && settings.controls.toggleScreen[1] && jQuery(settings.controls.toggleScreen[0]).length>0 && jQuery(settings.controls.toggleScreen[1]).length>0 && jQuery(settings.controls.toggleScreen[1]).closest(settings.controls.toggleScreen[0]).length>0 ){
						jQuery(settings.controls.toggleScreen[0]).on("click", function(e){
							if((window.fullScreen)||(window.innerWidth==screen.width && window.innerHeight==screen.height)) {
								closeFullscreen(false);
							} else {
								openFullscreen(settings.controls.toggleScreen[1]);
							}
						});
					}
				}

				// Settings
				current.volume = ((settings.volume/100)=='Infinity')?1:( (settings.volume/100)>1?1:( ((settings.volume/100)<0)?0:(settings.volume/100) ) );
				if(!settings.defaultControls){ jQuery(current).removeAttr("controls");}
				if(!settings.autoplay){ jQuery(current).removeAttr("autoplay");}
				if(!settings.poster){ jQuery(current).removeAttr("poster");}

				this.play = function(){
					var playPromise=current.play();
					if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});}
				};

				this.pause = function(){
					var playPromise=current.pause();
					if(playPromise!== undefined){playPromise.then(function(){}).catch(function(error) {});}
				};

				this.mute = function(){
					current.muted=true;
				};

				this.unmute = function(){
					current.muted=false;
				};

				this.paused = current.paused;
				this.muted = current.muted;

				//return this;

			}

			return this;

		};

		return this.each(function() {
			new jmPlayer(this);
		});

	};

}(jQuery));