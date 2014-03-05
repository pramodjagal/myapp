/* static constants */
var CROPORIENTATION_LANDSCAPE = 0;
var CROPORIENTATION_PORTRAIT = 1;
var CROPORIENTATION_DYNAMIC = 2 ;
/* environment defaults */
var staticFloatScaler = 1.3333333730697632;
var xAxisScalingFactor = 0.13576159;
var heightScalingFactor = 0.15929204;
var widthScalingFactor = 0.8576159;
var verticalScalingConstant = 0.84513277;
var scalingFloat = 0.0;
/* corner handle attributes */
var CROPCORNERSIZE = 15;
var CROPCORNEROUTER = 7;
var showDDArea = true;
var hasFaceTags = false;

/* custom browser handling */
var agt = navigator.userAgent.toLowerCase();
is_major = parseInt(navigator.appVersion);
is_minor = parseFloat(navigator.appVersion);
is_ie  = ((agt.indexOf("msie") != -1) && (agt.lastIndexOf(")") == agt.length-1));
is_ie5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
is_ie5up = (is_ie && (is_major == 4) && (agt.indexOf("msie 4.0")==-1) );
is_nav = (navigator.appName.indexOf("Netscape") != -1);
is_win = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );
is_mac = (agt.indexOf("mac")!=-1);
is_nav4 = (is_nav && is_major == 4);
is_nav6 = (is_nav && (is_major > 4));
is_safari = agt.indexOf("safari") > -1;

if( is_nav4 && (is_minor > 4.08) ) //don't reload the page if its netscape
{
   window.captureEvents(Event.RESIZE);
   window.onResize = handleResize;
}

function outStream(str)
{
   document.write(str);
}

function handleResize()
{
   document.location.reload(false);
}

createDOMObject.list = new Array();
function createDOMObject(id, html)
{
   this.id = id;
   this.html = html;
   outStream("<span id=" + id + " style='position:absolute;display:none'>" + html + "</span>");
   createDOMObject.list[createDOMObject.list.length] = this;
}

createDOMObject.initialize = function()
{
   for( var i=0; i<createDOMObject.list.length; ++i )
   {
      createDOMObject.list[i].proto_initialize();
   }
   createDOMObject.list.length = new Array();
}

createDOMObject.prototype.render = function(state)
{
   this.proto_render((arguments.length == 0 || state) ? 'visible' : 'hidden');
}

createDOMObject.prototype.move = function(x, y)
{
   this.proto_move(x ? Math.floor(x) : this.getXaxs(), y ? Math.floor(y) : this.getYaxs());
}

createDOMObject.prototype.clip = function(x, y, w, h)
{
   this.proto_setClip(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

if( document.all )
{
   createDOMObject.prototype.getXaxs = function()
   {
      return this.style.pixelLeft;
   }

   createDOMObject.prototype.getYaxs = function()
   {
      return this.style.pixelTop;
   }

   createDOMObject.prototype.getImage = function(name)
   {
      return this.element.all[name];
   }

   createDOMObject.prototype.cursor = function(name)
   {
      this.style.cursor = name;
   }

   createDOMObject.prototype.proto_initialize = function()
   {
      this.element = document.all[this.id];
      this.style   = this.element.style;
      this.style.width     = this.element.scrollWidth;
      this.style.height    = this.element.scrollHeight;
      this.style.pixelLeft = this.element.offsetLeft;
      this.style.pixelTop  = this.element.offsetTop;
      //this.style.overflow  = 'hidden';
   }

   createDOMObject.prototype.proto_render = function(state)
   {
      this.style.visibility = state;
   }

   createDOMObject.prototype.proto_move = function(x, y)
   {
      this.style.pixelLeft = x;
      this.style.pixelTop  = y;
   }

   createDOMObject.prototype.proto_setClip = function(x, y, w, h)
   {
      this.style.clip = 'rect(' + y + ' ' + (x + w) + ' ' + (y + h) + ' ' + x + ')';
   }

   createDOMObject.prototype.setBodyCntnt = function(html)
   {
      this.element.innerHTML = html;
   }

   createDOMObject.prototype.setZidx = function(z)
   {
      this.style.zIndex = z;
   }

   createDOMObject.prototype.proto_upGrabRelease = function(e)
   {
      if( e.type == 'mousedown' )
      {
         document.onmouseup  = this.upFunc;
      }
      else if( e.type == 'mouseup' )
      {
         document.onmouseup  = null;
      }
   }

   createDOMObject.prototype.grabEvent = function(name, object, method)
   {
      var self = this;
      var func = function()
      {
         var e = event;
         e.cancelBubble = true;
         self.proto_upGrabRelease(e);
         return object[method](this, e.type, e.x, e.y, e.button);
      }
      this.element[name] = func;
      if( name == 'onmouseup' )
      {
         this.upFunc = func;
      }
   }
}
else if( is_nav6 )
{
   createDOMObject.prototype.getXaxs = function()
   {
      return parseInt(this.style.left);
   }

   createDOMObject.prototype.getYaxs = function()
   {
      return parseInt(this.style.top);
   }

   createDOMObject.prototype.getImage = function(name)
   {
      var s = 'find ' + name + '\n' + typeof(this.element) + '\n';
      for( var p in this.element )
      {
         s += p + ': ' + this.element[p] + '\n';
      }
      return this.element.firstChild;
   }

   createDOMObject.prototype.cursor = function(name)
   {
      this.style.cursor = name;
   }

   createDOMObject.prototype.proto_initialize = function()
   {
      this.element = document.getElementById( this.id );
      this.style   = this.element.style;
      this.style.overflow  = 'hidden';
   }

   createDOMObject.prototype.proto_render = function(state)
   {
      this.style.visibility = state;
   }

   createDOMObject.prototype.proto_move = function(x, y)
   {
      this.style.left = x + "px";
      this.style.top  = y + "px";
   }

   createDOMObject.prototype.proto_setClip = function(x, y, w, h)
   {
      this.style.clip = 'rect(' + y + 'px, ' + (x + w) + 'px, ' + (y + h) + 'px, ' + x + ')';
   }

   createDOMObject.prototype.setBodyCntnt = function(html)
   {
      this.element.innerHTML = html;
   }

   createDOMObject.prototype.setZidx = function(z)
   {
      this.style.zIndex = z;
   }

   createDOMObject.prototype.proto_upGrabRelease = function(e)
   {
      if (e.type == 'mousedown')
      {
         document.addEventListener("mouseup", this.upFunc, false);
      }
      else if (e.type == 'mouseup')
      {
         document.removeEventListener("mouseup", this.upFunc, false);
      }
   }

   createDOMObject.prototype.grabEvent = function(name, object, method)
   {
      var self = this;
      var func = function(e)
      {
         e.stopPropagation();
         e.preventDefault();
         self.proto_upGrabRelease(e);
         return object[method](this, e.type, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.button);
      }
      this.element[name] = func;
      if( name == 'onmouseup' )
      {
         this.upFunc = func;
      }
   }
}
else
{
   createDOMObject.prototype.getXaxs = function()
   {
      return this.layer.left;
   }

   createDOMObject.prototype.getYaxs = function()
   {
      return this.layer.top;
   }

   createDOMObject.prototype.getImage = function(name)
   {
      return this.layer.document[name];
   }

   createDOMObject.prototype.cursor = function(name){}

   createDOMObject.prototype.proto_initialize = function()
   {
      this.layer = document[this.id];
      this.layer.document.write(this.html);
      this.layer.document.close();
   }

   createDOMObject.prototype.proto_render = function(state)
   {
      this.layer.visibility = state;
   }

   createDOMObject.prototype.proto_move = function(x, y)
   {
      this.layer.moveTo(x, y);
   }

   createDOMObject.prototype.proto_setClip = function(x, y, w, h)
   {
      this.layer.clip.left   = x;
      this.layer.clip.top    = y;
      this.layer.clip.width  = w;
      this.layer.clip.height = h;
   }

   createDOMObject.EVENTMASKS = { onmousedown:Event.MOUSEDOWN, onmouseup:Event.MOUSEUP, onmousemove:Event.MOUSEMOVE };

   createDOMObject.prototype.proto_upGrabRelease = function(e)
   {
      if( e.type == 'mousedown' )
      {
         window.captureEvents(Event.MOUSEUP);
      }
      else if( e.type == 'mouseup' )
      {
         window.releaseEvents(Event.MOUSEUP);
      }
   }

   createDOMObject.prototype.grabEvent = function(name, object, method)
   {
      if( !createDOMObject.EVENTMASKS[name] )
      {
         return;
      }
      this.layer.captureEvents(createDOMObject.EVENTMASKS[name]);
      var self = this;
      var func = function(e)
      {
         self.proto_upGrabRelease(e);
         return object[method](self, e.type, e.pageX, e.pageY, e.which);
      }
      this.layer[name] = func;
      if( name == 'onmouseup' )
      {
         window.onmouseup = func;
      }
   }
}

function cropControl(id, path, aspectRatioToBeCropped, minResWidth, minResHeight, journalEngine, useHiResBlocker, hiResScaleFactor, forceCropOrientation)
{
   //Added by Vijay, need to be reviewed by Yuri

   this.aspectRatioToBeCropped = aspectRatioToBeCropped >= 1 ?
            aspectRatioToBeCropped : 1.0/aspectRatioToBeCropped ;
   this.useHiResBlocker = useHiResBlocker ;
   this.hiResScaleFactor = hiResScaleFactor ;
   this.journalEngine = journalEngine ;
   this.sMinSize = 50;
   this.lock = false;
   this.hasReachedMinSize = false;
   this.minResWidth = minResWidth ;
   this.minResHeight = minResHeight ;
   this.fc = false;

   this.setMinimumResolution(minResWidth, minResHeight);

   this.loaded = false;
   this.imagePath = path + "/";
   if(typeof forceCropOrientation != 'undefined' && forceCropOrientation != '2'){
      this.forceCropOrientation = forceCropOrientation ;
      //set forceCrop
      this.fc = true;
   }else{
      this.forceCropOrientation = CROPORIENTATION_DYNAMIC ;
   }

   journalEngine.setForceCropOrientation(this.forceCropOrientation);

   var src = journalEngine.getImageURLForCroppingControl(journalEngine.displayBoxSize, journalEngine.displayBoxSize) ;
   var srcWidth = this.journalEngine.getConstrainedImageSizeFromPictDimension()[0] ;
   var srcHeight = this.journalEngine.getConstrainedImageSizeFromPictDimension()[1] ;

   var vspace = 4;
   if( srcWidth > srcHeight )
   {
      this.sWidth   = srcHeight;
      this.sHeight  = srcWidth;
      this.realSrc  = src;
      this.src = this.imagePath + "spacer.gif";
      this.wasFlipped = true;
      vspace = 15;
   }
   else
   {
      this.sWidth   = srcWidth;
      this.sHeight  = srcHeight;
      this.realSrc  = this.src = src;
      this.wasFlipped = false;
      vspace = 8;
   }

   //need a check for forceCrop
   if(this.fc){
        this.orientation = forceCropOrientation;
   } else {
        this.orientation = CROPORIENTATION_LANDSCAPE;
   }

   outStream('<img name="cropperpos' + id + '" id="cropperpos' + id + '" src="' + this.imagePath + 'spacer.gif" vspace='+vspace +' width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;"><br>');
   recalculateScalingFloat(this);

   this.haveDimensionsChanged = true;
   this.cropHasMoved = false;
   this.id       = id;
   this.srcid    = id + '_src';
   this.isIE4Mac = (is_ie && is_mac && parseInt(navigator.appVersion) == 4 && agt.indexOf('msie 5') == -1);
   this.isIE45Mac = (this.isIE4Mac && parseFloat(navigator.appVersion) == 4.5);
   if( this.sMinSize == null ) {
      this.lock = true;
      this.sMinSize = 50;
   }

   this.masked = new createDOMObject(id + 'masked', '<img name="' + this.srcid + '" id="' + this.srcid + '" src="' + this.src + '" isComplete="false" onload="this.isComplete=\'true\'" width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;">');
   if( !this.isIE4Mac )
   {
      this.mask = new createDOMObject(id + 'mask', '<img src="' + this.imagePath + 'cropMask.gif" border=0 style="display:none;">');
      this.compunmasked = new createDOMObject(id + 'compunmasked', '<img src="' + this.src + '" isComplete="false" onload="this.isComplete=\'true\'" name="' + this.srcid + 'Compunmasked" id="' + this.srcid + 'Compunmasked" width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;">');
      this.compmask = new createDOMObject(id + 'compmask', '<img src="' + this.imagePath + 'cropCompMask.gif" border=0 style="display:none;">');
      this.border = new createDOMObject(id + 'border', '<img name="' + this.srcid + 'border" id="' + this.srcid + 'border" src="' + this.imagePath + 'cropBlack.gif" width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;">');
      this.mark = new Array();
      for( var i = 0; i < cropControl.MARK.length; ++i )
      {
         this.mark[i] = new createDOMObject(id + 'mark' + i, '<img name="' + this.srcid + 'mark'+i+'" id="' + this.srcid + 'mark'+i+'" src="' + this.imagePath + 'cropWhite.gif" width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;">');
      }
      this.unmasked = new createDOMObject(id + 'unmasked', '<img name="' + this.srcid + 'Unmasked" id="' + this.srcid + 'Unmasked" src="' + this.src + '" isComplete="false" onload="this.isComplete=\'true\'" width=' + this.sWidth + ' height=' + this.sHeight + ' border=0 style="display:none;">');
   }
   this.cornerUL = new createDOMObject(id + 'cornerUL', '<img src="' + this.imagePath + 'cropCornerTL.gif" width=' + CROPCORNERSIZE + ' height=' + CROPCORNERSIZE + ' border=0 style="display:none;">');
   this.cornerUR = new createDOMObject(id + 'cornerUR', '<img src="' + this.imagePath + 'cropCornerTR.gif" width=' + CROPCORNERSIZE + ' height=' + CROPCORNERSIZE + ' border=0 style="display:none;">');
   this.cornerLL = new createDOMObject(id + 'cornerLL', '<img src="' + this.imagePath + 'cropCornerBL.gif" width=' + CROPCORNERSIZE + ' height=' + CROPCORNERSIZE + ' border=0 style="display:none;">');
   this.cornerLR = new createDOMObject(id + 'cornerLR', '<img src="' + this.imagePath + 'cropCornerBR.gif" width=' + CROPCORNERSIZE + ' height=' + CROPCORNERSIZE + ' border=0 style="display:none;">');
   if( this.isIE4Mac )
   {
      this.mask = new createDOMObject(id + 'mask', '<img name="' + this.srcid + 'mask" id="' + this.srcid + 'mask" src="' + this.imagePath + 'spacer.gif" width=' + (this.sWidth + 2) + ' height=' + (this.sHeight + 3) + ' border=0 style="display:none;">');
   }
   var html = '<img name="' + this.srcid + 'html" id="' + this.srcid + 'html" src="' + this.imagePath + 'spacer.gif" width=' + (this.sWidth + cropControl.TOL) + ' height=' + (this.sHeight + cropControl.TOL) + ' border=0 style="display:none;">';
   if( is_nav4 || this.isIE45Mac )
   {
      html = '<a href="javascript:void(0);">' + html + '</a>';
   }
   this.events = new createDOMObject(id + 'events', html);
   this.loaded = true;

}

cropControl.prototype.setMinSizeHandler = function(minSizeHandler)
{
   this.minSizeCallback = minSizeHandler;
}
cropControl.prototype.setFaceCropHandler = function(faceCropHandler)
{
   this.faceCropCallback = faceCropHandler;
}

cropControl.prototype.setCropField = function(top, left, bottom, right)
{
   var x = Math.floor(left*this.sWidth);
   var y = Math.floor(top*this.sHeight);
   var w = Math.floor((right-left)*this.sWidth);
   var h = Math.floor((bottom-top)*this.sHeight);

   //need a check for force
   if(!this.fc){
   if( w > h && this.orientation == CROPORIENTATION_PORTRAIT  )
   {
      this.switchCropOrientation(CROPORIENTATION_LANDSCAPE);
   }
   else if( h > w && this.orientation == CROPORIENTATION_LANDSCAPE  )
   {
      this.switchCropOrientation(CROPORIENTATION_PORTRAIT);
   }
   }
   this.doCrop(x, y, w-2, h-2);
}

cropControl.prototype.setCropImage = function(image)
{
   imageToCrop = image;
}

cropControl.prototype.getCropArea = function() //returns top, left, bottom, right
{
   return new Array((Math.floor(this.clip.y)/this.sHeight), (Math.floor(this.clip.x)/this.sWidth), (Math.floor(this.clip.y+this.clip.h+2)/this.sHeight), (Math.floor(this.clip.x+this.clip.w+2)/this.sWidth), this.aspectRatioToBeCropped);
}

cropControl.prototype.getCropAreaWidth = function()
{
   return this.clip.w+2;
}

cropControl.prototype.getCropAreaHeight = function()
{
   return this.clip.h+2;
}

cropControl.prototype.switchCropOrientation = function(alignment)
{
   this.orientation = alignment;
   this.setCropperAspect(this.aspectRatioToBeCropped);
}

cropControl.prototype.setCropAspect = function(aspectRatio, isCompostie, minResWidth, minResHeight)
{
   if( typeof (isCompostie) == "boolean"  && isCompostie == true ){
       this.isCompositeCrop = true ;
   }else{
       this.isCompositeCrop = false ;
   }

   this.setMinimumResolution(minResWidth, minResHeight);
   this.setAutoShape(); //re-renders the fields at MAXWIDTH
   this.setCropperAspect(aspectRatio);
   this.render(); // draw corners
   /*this.doChangeSize(0,0); //recalculate the minimum size for new aspectratio
   this.reachedMinSize(); //triggers minimum size handler
   if(this.hasReachedMinSize){
        this.lock = true ;
    }else{
        this.lock = false ;
    }
     */
}

cropControl.prototype.setMinimumResolution = function(minResWidth, minResHeight)
{
    if( minResWidth != null  && minResHeight != null )
    {
        this.journalEngine.setMinimumResolution(minResWidth, minResHeight);
        var srcWidth = this.journalEngine.getConstrainedImageSizeFromPictDimension()[0] ;
        var srcHeight = this.journalEngine.getConstrainedImageSizeFromPictDimension()[1] ;
        this.sMinSize = this.journalEngine.getMinCropFieldSize(
            this.journalEngine.hiresWidth, this.journalEngine.hiresHeight,
            srcWidth, srcHeight, this.useHiResBlocker, this.hiResScaleFactor);
    }

    if(this.sMinSize == null){
        this.hasReachedMinSize = true ;
        this.lock = true;
    }
    else{
        this.lock = false;
        this.hasReachedMinSize = false ;
    }
}

cropControl.prototype.getCropMode = function()
{
   return this.aspectRatioToBeCropped;
}

cropControl.prototype.lock = function(lockField)
{
   this.lock = lockField;
}

cropControl.prototype.isLocked = function()
{
   return this.lock;
}

cropControl.prototype.nudge = function()
{
   this.cropHasMoved = true;
}

cropControl.prototype.hasCropMoved = function()
{
   var val = this.cropHasMoved;
   this.cropHasMoved = false;
   return val;
}

cropControl.prototype.updateImage = function(imageSrc)
{
   this.src = imageSrc;
   var imageArray = new Array(   this.srcid,
                        this.srcid+"Unmasked",
                        this.srcid+"Compunmasked");
   for( var i=0; i<imageArray.length; i++ )
   {
      document[imageArray[i]].src = imageSrc;
   }
}

cropControl.prototype.complete = function()
{
   var imageArray = new Array(   this.srcid,
                        this.srcid+"Unmasked",
                        this.srcid+"Compunmasked");
   for( var i=0; i<imageArray.length; i++ )
   {
      if( document[imageArray[i]].isComplete == "false" || !this.loaded )
      {
         return false;
      }
   }
   return true;
}

cropControl.prototype.touch = function()
{
   this.haveDimensionsChanged = true;
}

cropControl.prototype.resetPosition = function()
{

    var x, y;
    var posimg = document['cropperpos' + this.id];
    if( !is_nav4 )
    {
        var ua = navigator.userAgent.toLowerCase();
        var intExp = parseInt(navigator.appVersion);
        if( intExp >=4 && ua.indexOf('msie 5') != -1 )
        {
            intExp = 5;
        }
        var macIntExp = (ua.indexOf('mac') == -1) ? 0.0 : intExp;
        x = getPagePos(posimg, 'offsetLeft',
        (macIntExp == 4) ? 'parentElement' : 'offsetParent',
        (macIntExp >= 5) ? 'leftMargin' : null);
        y = getPagePos(posimg, 'offsetTop',
        (macIntExp == 4) ? 'parentElement' : 'offsetParent',
        (macIntExp >= 5) ? 'topMargin' : null);
     }
     else
     {
        x = posimg.x;
        y = posimg.y;
     }
     this.move(x, y);
}

cropControl.prototype.resetImage = function(imageSrc, width, height)
{
   if( !this.haveDimensionsChanged )
   {
      this.updateImage(imageSrc);
   }
   else
   {
      this.loaded = false;
      this.sWidth = width;
      this.sHeight = height;
      this.src = imageSrc;
      var imageArray = new Array(   this.srcid,
                           "cropperpos"+this.id,
                           this.srcid+"html",
                           this.srcid+"border",
                           this.srcid+"Unmasked",
                           this.srcid+"Compunmasked");

      for( var i=0; i<imageArray.length; i++ )
      {
         if( imageArray[i] == this.srcid || imageArray[i] == this.srcid+"Unmasked" || imageArray[i] == this.srcid+"Compunmasked" )
         {
            document[imageArray[i]].isComplete = "false";
            document[imageArray[i]].src = imageSrc;
         }
         if( imageArray[i] == this.srcid+"html" )
         {
            document[imageArray[i]].width = width + cropControl.TOL;
            document[imageArray[i]].height = height + cropControl.TOL;
         }
         else
         {
            document[imageArray[i]].width = width;
            document[imageArray[i]].height = height;
         }
      }

      if( !this.isIE4Mac )
      {
         for( var i=0; i<cropControl.MARK.length; i++ )
         {
            imageArray[imageArray.length] = this.srcid+"mark"+i;
         }
      }
      if( this.isIE4Mac )
      {
         imageArray[imageArray.length] = this.srcid+"mask";
      }

      var x, y;
      var posimg = document['cropperpos' + this.id];
      if( !is_nav4 )
      {
         var ua = navigator.userAgent.toLowerCase();
         var intExp = parseInt(navigator.appVersion);
         if( intExp >=4 && ua.indexOf('msie 5') != -1 )
         {
            intExp = 5;
         }
         var macIntExp = (ua.indexOf('mac') == -1) ? 0.0 : intExp;
         x = getPagePos(posimg, 'offsetLeft',
         (macIntExp == 4) ? 'parentElement' : 'offsetParent',
         (macIntExp >= 5) ? 'leftMargin' : null);
         y = getPagePos(posimg, 'offsetTop',
         (macIntExp == 4) ? 'parentElement' : 'offsetParent',
         (macIntExp >= 5) ? 'topMargin' : null);
      }
      else
      {
         x = posimg.x;
         y = posimg.y;
      }
      var width, height;
      if( scalingFloat > 1.0 )
      {
         width = (this.sWidth-2);
         height = (this.sHeight-2);
      }
      else
      {
         height = (this.sHeight-2);
         width = Math.round(height*scalingFloat);
      }
      this.initialize(x, y, width, height);
      {
         var x, y, w, h;
         switch( this.orientation )
         {
            case 0:
               x = xAxisScalingFactor;
               y = 1.0-verticalScalingConstant;
               w = widthScalingFactor-xAxisScalingFactor;
               h = verticalScalingConstant-heightScalingFactor;
            break;
            case 1:
               x = heightScalingFactor;
               y = xAxisScalingFactor;
               w = verticalScalingConstant-heightScalingFactor;
               h = widthScalingFactor-xAxisScalingFactor;
            break;
         }
         this.set(x, y, w, h);
      }

      this.setCropAspect(this.aspectRatioToBeCropped,this.isCompositeCrop,this.minResWidth, this.minResHeight);
      this.loaded = true;
      this.haveDimensionsChanged = false;

      document.getElementById("target").src=this.src;

   }
}

cropControl.prototype.getOrientation = function()
{
   return this.orientation;
}

cropControl.prototype.isLandscapeOrientation = function()
{
   if( this.getOrientation() == CROPORIENTATION_LANDSCAPE ) { return true; }
   else if( this.getOrientation() == CROPORIENTATION_PORTRAIT ) { return false; }
   else { return null; }
}

cropControl.prototype.isLoaded = function()
{
   if( typeof this.loaded != "undefined" && this.loaded )
   {
      return true;
   }
   else
   {
      return false;
   }
}

cropControl.TOL    = 25;
cropControl.NONE   = 0;
cropControl.XSIDE  = 1;
cropControl.YSIDE  = 4;
cropControl.LEFT   = 1;
cropControl.RIGHT  = 2;
cropControl.TOP    = 4;
cropControl.BOTTOM = 8;
cropControl.ALL    = 15;
cropControl.CORNERS = [ 0, 5, 10, 15, 3, 1, 2, 15, 12, 4, 8, 15, 15, 15, 15, 15 ];
cropControl.MARK = [ { x:1.0/3.0, y:0, width:2, height:"100%" },
                  { x:2.0/3.0, y:0, width:2, height:"100%" },
                  { x:0, y:1.0/3.0, width:"100%", height:1 },
                  { x:0, y:2.0/3.0, width:"100%", height:1 } ];

cropControl.prototype.setCompositeCrop = function(state)
{
    //this.setCropAspect(this.aspectRatioToBeCropped, state) ;
    this.isCompositeCrop = state ;
    this.render();
}

cropControl.prototype.initialize = function(x, y, w, h)
{
   this.width = w;
   this.height = h;
   this.absoluteLeft = Math.floor((this.sWidth-w)/2);
   this.absoluteTop = Math.ceil((this.sHeight-h)/2);
   this.callback = null;
   if( !this.isIE4Mac )
   {
      this.mask.clip(this.absoluteLeft, this.absoluteTop, this.width, this.height);
      this.masked.clip(this.absoluteLeft, this.absoluteTop, this.width, this.height);
   }
   if( this.isIE4Mac )
   {
      this.cornerUL.setZidx(1);
      this.cornerUR.setZidx(1);
      this.cornerLL.setZidx(1);
      this.cornerLR.setZidx(1);
      this.events.setZidx(2);
   }
    
   //need a
   if (!this.fc) {
        if( this.sWidth > this.sHeight ) { this.orientation = CROPORIENTATION_LANDSCAPE; }
        else { this.orientation = CROPORIENTATION_PORTRAIT; }
   }
   this.aRange = new Array();
   var compType = new Array("compCropLandscape", "compCropPortrait");

   var aMin = new Array(10.0/8.0, 4.0/6.0);
   var aMax = new Array(6.0/4.0, 10.0/8.0);

   for( var i=0; i<compType.length ;i++ )
   {
      var compAspect = 1.0;
      var compMaxWidth = 1.0;
      if( this.aspectRatioToBeCropped>= aMax[i] )
      {
         compAspect = aMin[i];
         compMaxWidth = this.sHeight*aMin[i];
         this.aRange[i] = new Array(0, aMin[i], aMax[i]);
      }
      else if( this.aspectRatioToBeCropped<= aMin[i] )
      {
         compAspect = aMax[i];
         compMaxWidth = this.sWidth;
         this.aRange[i] = new Array(1, aMin[i], aMax[i]);
      }
      else
      {
         compAspect = aMin[i]*aMax[i]*(this.sHeight/this.sWidth);
         compMaxWidth = this.sHeight*aMin[i];
         this.aRange[i] = new Array(2, aMin[i], aMax[i]);
      }

   }
   this.clip = new Object();
   this.tmpClip = new Object();
   this.setAutoShape();
   this.move(x, y);
   this.sideMove = 0;
   
   if(showDDArea)
   {
    this.events.grabEvent('onmousemove', this, 'onmove');
	this.events.grabEvent('onmousedown', this, 'ondown');
	this.events.grabEvent('onmouseup',   this, 'onup');
	this.events.grabEvent('ondrag',      this, 'ondrag');
	this.events.grabEvent('ondragstart', this, 'ondrag');
	this.events.grabEvent('onselectstart', this, 'ondrag');
   }
}

cropControl.prototype.getXaxs1 = function()
{
   return this.clip.x/this.width;
}

cropControl.prototype.getYaxs1 = function()
{
   return 1.0 - (this.clip.y + this.clip.h)/this.height;
}

cropControl.prototype.getXaxs2 = function()
{
   return (this.clip.x + this.clip.w)/this.width;
}

cropControl.prototype.getYaxs2 = function()
{
   return 1.0 - this.clip.y / this.height;
}

cropControl.prototype.set = function(x, y, w, h)
{
   this.doCrop(Math.round(x*this.width), Math.round(y*this.height), Math.round(w*this.width), Math.round(h*this.height));
}

cropControl.prototype.setCallback = function(callback)
{
   this.callback = callback;
}

cropControl.prototype.render = function(state)
{
   if (state == null)
   {
      state = true;
   }
   this.mask.render(state);
   this.masked.render(state);
   if( !this.isIE4Mac )
   {
      this.border.render(state);
      this.unmasked.render(state);
      if( this.isCompositeCrop )
      {
         this.compunmasked.render(state);
         this.compmask.render(state);
      }
      else
      {
         this.compunmasked.render(false);
         this.compmask.render(false);
      }
   }
   this.events.render(state);
   if( state )
   {
      this.renderCornerHandles(0);
   }
   else if( !this.isIE4Mac )
   {
      for( var i = 0; i<cropControl.MARK.length; ++i )
      {
         this.mark[i].render(false);
      }
      this.cornerUL.render(false); //hide corners in netscape
      this.cornerUR.render(false);
      this.cornerLL.render(false);
      this.cornerLR.render(false);
   }
}

cropControl.prototype.move = function(x, y)
{
   this.x = x;
   this.y = y;
   this.mask.move(x, y);
   this.masked.move(x, y);
   if( !this.isIE4Mac )
   {
      this.border.move(x, y);
      this.unmasked.move(x, y);
      this.compmask.move(x+1, y+1);
      this.compunmasked.move(x+1, y+1);
      for( var i = 0; i<cropControl.MARK.length; ++i )
      {
         this.mark[i].move(x, y);
      }
   }
   else
   {
      this.mask.move(x, y-1);
   }
   this.events.move(x-0.5*cropControl.TOL, y-0.5*cropControl.TOL);
   this.moveCropHandles(this.clip.x, this.clip.y, this.clip.w, this.clip.h);
}

cropControl.prototype.setAutoShape = function()
{
   this.clip.aspectRatio = this.width / this.height;
   this.minSize = this.sMinSize;
   this.doCrop(0, 0, this.width, this.height);
}

cropControl.prototype.adjustAspect = function(newAspect, maxWidth)
{
   var cx = this.clip.x + 0.5*this.clip.w;
   var cy = this.clip.y + 0.5*this.clip.h;
   var a = this.clip.w*this.clip.h;
   var h = Math.sqrt(a/newAspect);
   var w = Math.floor(a/h + 0.5);
   h = Math.floor(h + 0.5);
   if( w > this.width )
   {
      w = this.width;
      h = Math.floor(w/newAspect + 0.5);
   }
   if( h > this.height )
   {
      h = this.height;
      w = Math.floor(h*newAspect + 0.5);
   }
   var x = Math.floor(cx - 0.5*w);
   var y = Math.floor(cy - 0.5*h);
   if( x < 0 )
   {
      x = 0;
   }
   else if( x + w > this.width )
   {
      x = this.width - w;
   }
   if( y < 0 )
   {
      y = 0;
   }
   else if( y + h > this.height )
   {
      y = this.height - h;
   }
   this.clip.aspectRatio = newAspect;
   if( (w / this.width) > maxWidth )
   {
      var oldW = w;
      var oldH = h;
      w = Math.floor(this.width*maxWidth);
      h = Math.floor(w/newAspect);
      x += (oldW - w)/2.0;
      y += (oldH - h)/2.0;
   }
   if(hasFaceTags)
   {
	   if(x >= this.tlx || (x+w) <= this.brx || 
	      y >= this.tly || (y+h)<= this.bry)
	   {
	     this.hasReachedfaceCropLimit = true;
	   }
	   else
	   {
		 this.hasReachedfaceCropLimit = false;
	   }
   	   this.reachedfaceCrop();
   }
   this.doCrop(x, y, w, h);
}

cropControl.prototype.getSides = function(x, y)
{
   var FscrollX = FscrollY = 0;
   if( document.all )
   {
      FscrollX = document.body.scrollLeft*-1;
      FscrollY = document.body.scrollTop*-1;
   }
   else if( agt.indexOf('safari') > -1 && agt.indexOf("chrome") == -1)
   {
      FscrollX = document.body.scrollLeft;
      FscrollY = document.body.scrollTop;
   }
   x -= this.absoluteLeft + this.clip.x + FscrollX;
   y -= this.absoluteTop  + this.clip.y + FscrollY;
   if( x < -cropControl.TOL )
      return 0;
   if( x > this.clip.w + cropControl.TOL )
      return 0;
   if( y < -cropControl.TOL )
      return 0;
   if( y > this.clip.h + cropControl.TOL )
      return 0;
   var e  = Math.floor(((this.clip.w < this.clip.h) ? this.clip.w : this.clip.h)/3.0);
   var e2 = Math.floor(e/2);
   var x1 = e;
   var x2 = this.clip.w - e;
   var y1 = e;
   var y2 = this.clip.h - e;
   if( x >= e2 && x < this.clip.w - e2 && y >= e2 && y < this.clip.h - e2 )
      return cropControl.ALL;
   if( x < 0 )
      x = 0;
   else if( x >= this.clip.w )
      x = this.clip.w - 1;
   if( y < 0 )
      y = 0;
   else if( y >= this.clip.h )
      y = this.clip.h - 1;
   if( x + y < x1 )
      return cropControl.LEFT + cropControl.TOP;
   if( y - x > y2 )
      return cropControl.LEFT + cropControl.BOTTOM;
   if( x - y > x2 )
      return cropControl.RIGHT + cropControl.TOP;
   if( x + y > x2 + this.clip.h )
      return cropControl.RIGHT + cropControl.BOTTOM;
   if( x < x1 )
      if( y < y1 )
         return (x - x1 < y - y1) ? cropControl.LEFT : cropControl.TOP;
      else
         return (x - x1 < y2 - y) ? cropControl.LEFT : cropControl.BOTTOM;
      else
         if( y < y1 )
            return (x2 - x < y - y1) ? cropControl.RIGHT : cropControl.TOP;
         else
            return (x2 - x < y2 - y) ? cropControl.RIGHT : cropControl.BOTTOM;
}

cropControl.prototype.ondown = function(e, type, x, y, button)
{
   this.cropHasMoved = true;
   x -= this.x;
   y -= this.y;
   this.mx = x;
   this.my = y;
   this.copyClipZoneToTemp();
   this.sideMove = this.getSides(x, y);
   this.renderCornerHandles(this.sideMove);
   return false;
}

cropControl.prototype.onup = function(e, type, x, y, button)
{
   this.sideMove = 0;
   this.onmove(e, type, x, y, button);
   this.doCrop(this.tmpClip.x1, this.tmpClip.y1, this.tmpClip.x2-this.tmpClip.x1, this.tmpClip.y2-this.tmpClip.y1);
   return false;
}

cropControl.prototype.onmove = function(e, type, x, y, button)
{
   if( this.lock)
   {
      this.hasReachedMinSize = true ;
   }
   if( this.sideMove == 0 )
   {
      var sides = this.getSides(x - this.x, y - this.y);
      this.events.cursor(this.renderCornerHandles(sides) ? 'move' : 'auto');
      return false;
   }
   x -= this.x;
   y -= this.y;
   var dx = x - this.mx;
   var dy = y - this.my;
   if( this.sideMove == cropControl.ALL )
   {
      this.doMoveField(dx, dy);
      this.drawCrop(this.tmpClip.x1, this.tmpClip.y1, this.tmpClip.x2-this.tmpClip.x1, this.tmpClip.y2-this.tmpClip.y1);
   }
   else if( !this.lock )
   {
      this.doChangeSize(dx, dy);
      this.drawCrop(this.tmpClip.x1, this.tmpClip.y1, this.tmpClip.x2-this.tmpClip.x1, this.tmpClip.y2-this.tmpClip.y1);
   }
   //this.drawCrop(this.tmpClip.x1, this.tmpClip.y1, this.tmpClip.x2-this.tmpClip.x1, this.tmpClip.y2-this.tmpClip.y1);
   return false;
}

cropControl.prototype.ondrag = function()
{
   return false;
}

cropControl.prototype.renderCornerHandles = function(sides)
{
   var mask = (this.minSize == this.sMinSize) ? cropControl.CORNERS[sides] : 0;
   var mask2 = (mask == 0) ? cropControl.ALL : mask;
   mask2 = cropControl.ALL;
   this.cornerUL.render((mask2 & 1) != 0);
   this.cornerUR.render((mask2 & 2) != 0);
   this.cornerLL.render((mask2 & 4) != 0);
   this.cornerLR.render((mask2 & 8) != 0);
   return (mask != 0);
}

cropControl.prototype.doCrop = function(x, y, w, h)
{
   this.clip.x = x;
   this.clip.y = y;
   this.clip.w = w;
   this.clip.h = h;
   this.drawCrop(x, y, w, h);
   if( this.callback )
   {
      this.callback(this);
   }
}

cropControl.prototype.drawCrop = function(x, y, w, h)
{
   if( !this.isIE4Mac )
   {
       this.border.clip(this.absoluteLeft + x, this.absoluteTop + y, w, h);
       this.unmasked.clip(this.absoluteLeft + x + 1, this.absoluteTop + y + 1, w - 2, h - 3);
       if( this.aRange[this.orientation][0] == 0 )
      {
         var cw = h*this.aRange[this.orientation][2];
         var ch = h;
      }
      else if( this.aRange[this.orientation][0] == 1 )
      {
         var cw = w;
         var ch = w/this.aRange[this.orientation][1];
      }
      else
      {
         if( this.orientation == CROPORIENTATION_LANDSCAPE )
         {
            var cw = w*this.width/(1.25*this.height);
            var ch = h*this.height/(this.width/1.50);
         }
         else
         {
            var ch = h*this.height/(this.width*1.25);
            var cw = w*this.width/(this.height/1.50);
         }
      }
      var cx = x-((cw-w)/2);
      var cy = y-((ch-h)/2);
      if( cx <= 0 )
      {
         cx = 0;
      }
      if( cx+cw+1 > this.width )
      {
         cx += this.width-(cw+cx);
      }
      if( cy <= 0 )
      {
         cy = 0;
      }
      if( cy+ch+1 > this.height )
      {
         cy += this.height-(ch+cy);
      }
      this.compunmasked.clip(cx, cy, cw, ch);
      this.compmask.clip(cx, cy, cw, ch);

      for (var i = 0; i < cropControl.MARK.length; ++i)
      {
         var mx = x + cropControl.MARK[i].x * w;
         var my = y + cropControl.MARK[i].y * h;
         var mw, mh;
         if( typeof(cropControl.MARK[i].width) == 'string' )
         {
            mw = 0.01*parseFloat(cropControl.MARK[i].width)*w;
         }
         else
         {
            mw = cropControl.MARK[i].width;
         }
         if( typeof(cropControl.MARK[i].height) == 'string' )
         {
            mh = 0.01*parseFloat(cropControl.MARK[i].height)*h;
         }
         else
         {
            mh = cropControl.MARK[i].height;
         }
         this.mark[i].clip(this.absoluteLeft + mx, this.absoluteTop + my, mw, mh);
      }
   }
   else
   {
      x += this.absoluteLeft;
      y += this.absoluteTop;
      var body = '';
      body += '<img src="' + this.imagePath + 'spacer.gif" border=0 width=' + this.sWidth + ' height=1>';
      body += '<table border=0 cellpadding=0 cellspacing=0>';
         body += '<tr>';
         body += '<td background="' + this.imagePath + 'cropMask.gif"><img border=0 width=' + this.sWidth + ' height=' + y + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '</tr>';
      body += '</table>';
      body += '<table border=0 cellpadding=0 cellspacing=0>';
         body += '<tr>';
         body += '<td background="' + this.imagePath + 'cropMask.gif"><img border=0 width=' + x + ' height=' + h + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '<td background="' + this.imagePath + 'spacer.gif">';
         body += '<table border=0 cellpadding=0 cellspacing=0>';
         body += '<tr><td bgcolor=black colspan=3><img border=0 width=' + w + ' height=1 src="' + this.imagePath + 'spacer.gif"></td></tr>';
         body += '<tr><td bgcolor=black><img border=0 width=1 height=' + (h-2) + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '<td><img border=0 width=' + (w-2) + ' height=' + (h-2) + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '<td bgcolor=black><img border=0 width=1 height=' + (h-2) + ' src="' + this.imagePath + 'spacer.gif"></td></tr>';
         body += '<tr><td bgcolor=black colspan=3><img border=0 width=' + w + ' height=1 src="' + this.imagePath + 'spacer.gif"></td></tr>';
         body += '</table>';
         body += '</td>';
         body += '<td background="' + this.imagePath + 'cropMask.gif"><img border=0 width=' + (this.sWidth - x - w) + ' height=' + h + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '</tr>';
      body += '</table>';
      body += '<table border=0 cellpadding=0 cellspacing=0>';
         body += '<tr>';
         body += '<td background="' + this.imagePath + 'cropMask.gif"><img border=0 width=' + this.sWidth + ' height=' + (this.sHeight - y - h) + ' src="' + this.imagePath + 'spacer.gif"></td>';
         body += '</tr>';
      body += '</table>';
      this.mask.setBodyCntnt(body);
      x -= this.absoluteLeft;
      y -= this.absoluteTop;
   }
   this.moveCropHandles(x, y, w, h);
}

cropControl.prototype.moveCropHandles = function(x, y, w, h)
{
   x += this.x + this.absoluteLeft;
   y += this.y + this.absoluteTop;
   this.cornerUL.move(x - CROPCORNEROUTER, y - CROPCORNEROUTER);
   this.cornerUR.move(x + w + CROPCORNEROUTER - CROPCORNERSIZE, y - CROPCORNEROUTER);
   this.cornerLL.move(x - CROPCORNEROUTER, y + h + CROPCORNEROUTER - CROPCORNERSIZE);
   this.cornerLR.move(x + w + CROPCORNEROUTER - CROPCORNERSIZE, y + h + CROPCORNEROUTER - CROPCORNERSIZE);
}

cropControl.prototype.widthToHeight = function(n, h)
{
   n = Math.floor(n / this.clip.aspectRatio + 0.5);
   if (n < this.minSize)
   {
      this.hasReachedMinSize = true;
      return this.minSize;
   }
   if (n > this.height)
   {
      return this.height;
   }
   return n;
}

cropControl.prototype.heightToWidth = function(n, w)
{
   n = Math.floor( n*this.clip.aspectRatio + 0.5 );
   if( n < this.minSize )
   {
      this.hasReachedMinSize = true;
      return this.minSize;
   }
   if( n > this.width )
   {
      return this.width;
   }
   return n;
}

cropControl.prototype.copyClipZoneToTemp = function()
{
   this.tmpClip.x1 = this.clip.x;
   this.tmpClip.y1 = this.clip.y;
   this.tmpClip.x2 = this.clip.x + this.clip.w;
   this.tmpClip.y2 = this.clip.y + this.clip.h;
}

cropControl.prototype.reachedMinSize = function()
{
   if( this.hasReachedMinSize && typeof this.minSizeCallback != "undefined" )
   {
      eval(this.minSizeCallback + "(true)");
   }
   else if( typeof this.minSizeCallback != "undefined" )
   {
      eval(this.minSizeCallback + "(false)");
   }
}
cropControl.prototype.reachedfaceCrop = function()
{
   if( this.hasReachedfaceCropLimit && typeof this.faceCropCallback != "undefined" )
   {
      eval(this.faceCropCallback + "(true)");
   }
   else if( typeof this.faceCropCallback != "undefined" )
   {
      eval(this.faceCropCallback + "(false)");
   }
}
cropControl.prototype.doMoveField = function(dx, dy)
{
   this.copyClipZoneToTemp();
   if( dx < 0 && this.tmpClip.x1 + dx < 0 )
   {
      dx = -this.tmpClip.x1;
   }
   if( dx > 0 && this.tmpClip.x2 + dx > this.width )
   {
      dx = this.width - this.tmpClip.x2;
   }
   if( dy < 0 && this.tmpClip.y1 + dy < 0 )
   {
      dy = -this.tmpClip.y1;
   }
   if( dy > 0 && this.tmpClip.y2 + dy > this.height )
   {
      dy = this.height - this.tmpClip.y2;
   }
   this.tmpClip.x1 += dx;
   this.tmpClip.x2 += dx;
   this.tmpClip.y1 += dy;
   this.tmpClip.y2 += dy;
   if(hasFaceTags)
   {
	   if(this.tmpClip.x1 >= this.tlx || this.tmpClip.x2 <= this.brx || 
	      this.tmpClip.y1 >= this.tly || this.tmpClip.y2 <= this.bry)
	   {
	     this.hasReachedfaceCropLimit = true;
	   }
	   else
	   {
		 this.hasReachedfaceCropLimit = false;
	   }
	   this.reachedfaceCrop();
   }
}

cropControl.prototype.doChangeSize = function(dx, dy)
{
   var w, h;
   var wMax, hMax;
   this.hasReachedMinSize = false;
   switch( this.sideMove & (3*cropControl.XSIDE) )
   {
      case 1:
         w    = this.clip.w - dx;
         wMax = this.clip.x + this.clip.w;
      break;
      case 2:
         w    = this.clip.w + dx;
         wMax = this.width - this.clip.x;
      break;
      default:
         w = this.clip.w;
         wMax = this.width;
      break;
   }
   switch( this.sideMove & (3*cropControl.YSIDE) )
   {
      case 4:
         h    = this.clip.h - dy;
         hMax = this.clip.y + this.clip.h;
      break;
      case 8:
         h    = this.clip.h + dy;
         hMax = this.height - this.clip.y;
      break;
      default:
         h = this.clip.h;
      break;
   }

   safeCropMaxWidthCord = 1.0;
   var safeCropMaxWidthScreenCoord = safeCropMaxWidthCord * this.width;
   if( wMax > safeCropMaxWidthScreenCoord )
   {
      wMax = safeCropMaxWidthScreenCoord;
   }

   if( w < this.minSize )
   {
      //this.hasReachedMinSize = true;
      w = this.minSize;
   }
   if( wMax && w > wMax )
   {
      w = wMax;
   }
   if( h < this.minSize )
   {
      //this.hasReachedMinSize = true;
      h = this.minSize;
   }
   if( hMax && h > hMax )
   {
      h = hMax;
   }
   var x2, y2;
   switch( this.sideMove )
   {
      case 1:
      case 2:
         h = this.widthToHeight(w, h);
         y2 = this.clip.y + 0.5*(this.clip.h - h);
         if (y2 < 0)
         y2 = 0;
         if (y2 + h > this.height)
         y2 = this.height - h;
         y2 += h;
         w = this.heightToWidth(h, w);
      break;
      case 4:
      case 8:
         w = this.heightToWidth(h, w);
         if( w > safeCropMaxWidthScreenCoord )
         {
            w = safeCropMaxWidthScreenCoord;
         }
         x2 = this.clip.x + 0.5*(this.clip.w - w);
         if( x2 < 0 )
         {
            x2 = 0;
         }
         if( x2 + w > this.width )
         {
            x2 = this.width - w;
         }
         x2 += w;
         h = this.widthToHeight(w, h);
         break;
      default:
         if( this.heightToWidth(h, w) > w )
         {
            w = this.heightToWidth(h, w);
            if( wMax && w > wMax )
            {
               w = wMax;
            }
            h = this.widthToHeight(w, h);
         }
         else
         {
            h = this.widthToHeight(w, h);
            if (hMax && h > hMax)
            {
               h = hMax;
            }
            w = this.heightToWidth(h, w);
         }
      break;
   }
   switch( this.sideMove & (3*cropControl.XSIDE) )
   {
      case 1:
         this.tmpClip.x2 = this.clip.x + this.clip.w;
      break;
      case 2:
         this.tmpClip.x2 = this.clip.x + Math.floor(w);
      break;
      default:
         if( x2 )
         {
            this.tmpClip.x2 = x2;
         }
         else
         {
            this.tmpClip.x2 = this.clip.x + Math.floor(0.5*(this.clip.w + w));
         }
      break;
   }
   switch( this.sideMove & (3*cropControl.YSIDE) )
   {
      case 4:
         this.tmpClip.y2 = this.clip.y + this.clip.h;
      break;
      case 8:
         this.tmpClip.y2 = this.clip.y + Math.floor(h);
      break;
      default:
         if( y2 )
         {
            this.tmpClip.y2 = y2;
         }
         else
         {
            this.tmpClip.y2 = this.clip.y + Math.floor(0.5*(this.clip.h + h));
         }
      break;
   }
   this.tmpClip.x1 = this.tmpClip.x2 - Math.floor(w);
   this.tmpClip.y1 = this.tmpClip.y2 - Math.floor(h);
   if(hasFaceTags)
   {
	   if(this.tmpClip.x1 >= this.tlx || this.tmpClip.x2 <= this.brx || 
	      this.tmpClip.y1 >= this.tly || this.tmpClip.y2 <= this.bry)
	   {
	     this.hasReachedfaceCropLimit = true;
	   }
	   else
	   {
		 this.hasReachedfaceCropLimit = false;
	   }
	   this.reachedfaceCrop();
   }

   if( (this.tmpClip.x2 - this.tmpClip.x1) <= this.minSize
      || (this.tmpClip.y2 - this.tmpClip.y1) <= this.minSize  )
   {
      this.hasReachedMinSize = true;
   }else{
      this.hasReachedMinSize = false;
   }
   if( this.minSize == null ){
      //this.hasReachedMinSize = true;
   }

   this.reachedMinSize();
}

function mapRectToCoords(cropCtrl, rect)
{
   var leftX, leftY, rightX, rightY;
   switch(cropCtrl.orientation)
   {
      case 0:
         leftX = rect.llx;
         leftY = rect.lly;
         rightX = rect.urx;
         rightY = rect.ury;
      break;
      case 1:
         leftX = 1.0-rect.ury;
         leftY = rect.llx;
         rightX = 1.0-rect.lly;
         rightY = rect.urx;
      break;
   }
   rect.llx = leftX;
   rect.lly = leftY;
   rect.urx = rightX;
   rect.ury = rightY;
}

function cropperCallback(c)
{
   var retVector = new Object;
   retVector.llx = c.getXaxs1();
   retVector.lly = c.getYaxs1();
   retVector.urx = c.getXaxs2();
   retVector.ury = c.getYaxs2();
   mapRectToCoords(c, retVector);
   xAxisScalingFactor = retVector.llx;
   heightScalingFactor = retVector.lly;
   widthScalingFactor = retVector.urx;
   verticalScalingConstant = retVector.ury;
}

cropControl.prototype.setCropperAspect = function(aspectRatio)
{
   this.aspectRatioToBeCropped = aspectRatio >=1 ? aspectRatio : 1.0/aspectRatio ;

   if( this.isCropPortrait() )
   {
      this.adjustAspect(aspectRatio >=1 ? 1.0/aspectRatio : aspectRatio, 1.0);
   }
   else
   {
      this.adjustAspect(aspectRatio >=1 ? aspectRatio : 1.0/aspectRatio, 1.0);
   }

}

cropControl.prototype.isCropPortrait = function()
{
   return (this.orientation == CROPORIENTATION_PORTRAIT);
}


cropControl.prototype.rotateLeft = function(croppedArea)
{
   return this.rotate("ccw",croppedArea);
};


cropControl.prototype.rotateRight = function(croppedArea)
{
   return this.rotate("cw",croppedArea);
};



cropControl.prototype.rotate = function(rotation,croppedArea)
{
    this.journalEngine.setRotation(rotation);
    //swapCropDimensions
    if( rotation == "cw" || rotation == "ccw" )
    {
        var oldWidth = this.journalEngine.resizedImageDimensions[0];
        this.journalEngine.resizedImageDimensions[0] = this.journalEngine.resizedImageDimensions[1];
        this.journalEngine.resizedImageDimensions[1] = oldWidth;
    }
    //var cropArea = this.getCropArea();
    this.journalEngine.removeAllCropsForIPads();
    //this.journalEngine.setCropAreaNotNested(cropArea[0], cropArea[1], cropArea[2], cropArea[3], cropArea[4]);
    this.journalEngine.setCropAreaNotNested(croppedArea[0], croppedArea[1], croppedArea[2], croppedArea[3], croppedArea[4]);
    this.touch();
    this.resetImage(this.journalEngine.getImageURLForCroppingControl(
        this.journalEngine.displayBoxSize, this.journalEngine.displayBoxSize),
        this.journalEngine.resizedImageDimensions[0], this.journalEngine.resizedImageDimensions[1]);


    //set crop fields for crop control
    var aCropArea = rotateCropFields(croppedArea, rotation );
    if(aCropArea != null ){
        this.setCropField(aCropArea[0], aCropArea[1], aCropArea[2], aCropArea[3]);
    }

    if( (this.forceCropOrientation == CROPORIENTATION_LANDSCAPE)
        || (this.forceCropOrientation == CROPORIENTATION_PORTRAIT) )
    {
        this.setForceCropField() ;
    }
    this.reachedMinSize() ;
    return aCropArea;
};


cropControl.prototype.setForceCropField = function()
{
    var w, h ;

    if( this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
         && this.journalEngine.isRotated() )
    {
        w = this.journalEngine.hiresHeight ;
        h = this.journalEngine.hiresWidth ;
    }
    else if(this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
         && !this.journalEngine.isRotated() )
    {
        w = this.journalEngine.hiresWidth ;
        h = this.journalEngine.hiresHeight ;
    }
    else if( this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
         && !this.journalEngine.isRotated() )
    {
        w = this.journalEngine.hiresWidth ;
        h = this.journalEngine.hiresHeight ;
    }
    else if( this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
         && this.journalEngine.isRotated() )
    {
        w = this.journalEngine.hiresHeight ;
        h = this.journalEngine.hiresWidth ;
    }else
    {
        alert("setForceCropField() : should not come here, some thing is wrong");
        return ;
    }

    /*
    alert("setCropField=" + this.journalEngine.isRotated() + " :: " +
        this.journalEngine.hiresWidth + ", " + this.journalEngine.hiresHeight
          + "  :: " + w  + ", " + h);
    */
    //*************FORCE LANDSCAPE ***********************************************
    if(this.forceCropOrientation == CROPORIENTATION_LANDSCAPE)
    {
        //landscape  picture not rotated/portrait picture rotated
        //ultimately for landscape orientation with force landscape crop
        if( (this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
             && !this.journalEngine.isRotated())
            || (this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
             && this.journalEngine.isRotated()) )
        {
            var top = 0;
            var left = (w - (h * this.aspectRatioToBeCropped))/(2.0 * w) ;
            var bottom = 1;
            var right = 1 - left ;
            if(left < 0)
            {
                top = (h - w/this.aspectRatioToBeCropped)/(2.0 * h) ;
                left = 0 ;
                bottom = 1 - top ;
                right = 1 ;
            }
            this.setCropField(top, left, bottom, right);
        }
        else if( (this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
             && this.journalEngine.isRotated())
            || (this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
             && !this.journalEngine.isRotated()) )
        {   //landscape picture but rotated/portrait picture but not rotated
            //ultimately for portrait orienation with force lanscape crop

            var top = (h - w/this.aspectRatioToBeCropped)/(2.0 * h) ;
            var left = 0 ;
            var bottom = 1 - top ;
            var right = 1 ;
            if(top < 0)
            {
                top = 0;
                left = (w - (h * this.aspectRatioToBeCropped))/(2.0 * w) ;
                bottom = 1;
                right = 1 - left ;
            }
            this.setCropField(top, left, bottom, right);
        }

    }
    //***************FORCE PORTRAIT************************************************
    else if (this.forceCropOrientation == CROPORIENTATION_PORTRAIT)
    {
        //landscape  picture not rotated/portrait picture rotated
        //ultimately for landscape orientation with force portrait crop
        if( (this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
             && !this.journalEngine.isRotated())
            || (this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
             && this.journalEngine.isRotated()) )
        {
            var top = 0 ;
            var left = (w - h/this.aspectRatioToBeCropped)/(2.0 * w) ;
            var bottom = 1 ;
            var right = 1 - left ;
            if(left < 0)
            {
                top = (h - (w*this.aspectRatioToBeCropped))/(2.0 * h) ;
                left = 0 ;
                bottom = 1 - top ;
                right = 1 ;
            }
            this.setCropField(top, left, bottom, right);

        }
        else if( (this.journalEngine.hiresWidth >= this.journalEngine.hiresHeight
             && this.journalEngine.isRotated())
            || (this.journalEngine.hiresWidth < this.journalEngine.hiresHeight
             && !this.journalEngine.isRotated()) )
        {
            //portrait picture not rorated/lanscape picture but rotated
            //ultimately portriat orientation with force portriat crop
            var top = (h - (w * this.aspectRatioToBeCropped))/(2.0 * h);
            var left = 0 ;
            var bottom = 1 - top;
            var right = 1 ;
            if(top < 0)
            {
                top = 0;
                left = (w - h/this.aspectRatioToBeCropped)/(2.0 * w) ;
                bottom = 1;
                right = 1 - left ;
            }
            this.setCropField(top, left, bottom, right);
        }

    }

}


cropControl.prototype.revertToOriginal = function()
{
    //revert journal changes back to original
    this.journalEngine.revertToOriginal() ;
    this.journalEngine.setConstrainedImageSizeFromPictDimension();

    //revert crop contorl changes to backe to original
    this.touch() ;
    this.resetImage(this.journalEngine.getImageURLForCroppingControl(
        this.journalEngine.displayBoxSize, this.journalEngine.displayBoxSize),
        this.journalEngine.resizedImageDimensions[0], this.journalEngine.resizedImageDimensions[1]);

    //set intial crop fields
    applyInitialCrop(this);

    // to show low resolution info and lock crop area
    if(this.lock)   {
        this.hasReachedMinSize = true ;
    }
}


function applyInitialCrop(cropCtrl)
{
    //Added by Vijay, need to be reviewed by Yuri
    //set intial crop fields
    var aCropArea = null ;
    if( cropCtrl.journalEngine.getRotation() == "fh" )
    {
        var finalJournal = cropCtrl.journalEngine.getFinalJournal() ;
        if( finalJournal.indexOf("rf=cw") != -1)
        {
            aCropArea = rotateCropFields(cropCtrl.journalEngine.getCropArea(), "cw");
        }else if( finalJournal.indexOf("rf=ccw") != -1 )
        {
            aCropArea = rotateCropFields(cropCtrl.journalEngine.getCropArea(), "ccw" );
        }else if( finalJournal.indexOf("rf=ud") != -1 )
        {
            aCropArea = rotateCropFields(cropCtrl.journalEngine.getCropArea(), "ud" );
        }
    }

    if(aCropArea == null){
        aCropArea = cropCtrl.journalEngine.getCropArea() ;
    }

    aCropArea = rotateCropFields(aCropArea,  cropCtrl.journalEngine.getRotation() );

    if(aCropArea != null ){
        cropCtrl.setCropField(aCropArea[0], aCropArea[1], aCropArea[2], aCropArea[3]);
    }
}


function rotateCropFields(cropArea, rotation)
{
    var aCropArea = null ;

    if( typeof(cropArea) == "string" )
    {
        aCropArea = cropArea.split(",", 4);
        if( aCropArea.length < 4 ){
            return null ;
        }
    }else
    {
        if( (typeof(cropArea.length) == "number") && cropArea.length >= 4 ){//array object
            aCropArea = cropArea ;
        }
    }

    if( aCropArea == null ){
        return null ;
    }

    if( rotation == "cw" )
    {
        aCropArea.push(aCropArea.shift());
        aCropArea[1] = Math.abs(1-aCropArea[1]);
        aCropArea[3] = Math.abs(1-aCropArea[3]);
    }
    else if( rotation == "ccw" )
    {
        aCropArea.unshift(aCropArea.pop());
        aCropArea[0] = Math.abs(1-aCropArea[0]);
        aCropArea[2] = Math.abs(1-aCropArea[2]);
    }
    else if( rotation == "fh" )
    {
        var old = aCropArea[1];
        aCropArea[1] = Math.abs(1-aCropArea[3]);
        aCropArea[3] = Math.abs(1-old);
    }
    else if( rotation == "ud" )
    {
        var old = aCropArea[1];
        var old0 = aCropArea[0];
        aCropArea[1] = Math.abs(1-aCropArea[3]);
        aCropArea[3] = Math.abs(1-old);
        aCropArea[0] = Math.abs(1-aCropArea[2]);
        aCropArea[2] = Math.abs(1-old0);
    }

    return aCropArea ;
}


function getPagePos(o, c, p, m)
{
   var x = o[c];
   o = o[p];
   while( o != null && typeof(o[c]) != 'undefined' )
   {
      if( o.tagName != 'FONT' )
      {
         x += parseInt(o[c]);
      }
      if( o.tagName == 'BODY' && m && typeof(o[m]) != 'undefined' )
      {
         x += parseInt(o[m]);
      }
      if( o.tagName == 'HTML' )
      {
         break;
      }
      o = o[p];
   }
   return x;
}

function recalculateScalingFloat(cropCtrl)
{
   if( (cropCtrl.orientation == CROPORIENTATION_LANDSCAPE) || (cropCtrl.orientation == 2) )
   {
      scalingFloat = staticFloatScaler;
   }
   else
   {
      scalingFloat = 1.0/staticFloatScaler;
   }
}

function onLoadCrop(cropCtrl)
{
   createDOMObject.initialize();
   var x, y;
   var posimg = document['cropperpos' + cropCtrl.id];
   if( !is_nav4 )
   {
      var ua = navigator.userAgent.toLowerCase();
      var intExp = parseInt(navigator.appVersion);
      if( intExp >=4 && ua.indexOf('msie 5') != -1 )
      {
         intExp = 5;
      }
      var macIntExp = (ua.indexOf('mac') == -1) ? 0.0 : intExp;
      x = getPagePos(posimg, 'offsetLeft',
      (macIntExp == 4) ? 'parentElement' : 'offsetParent',
      (macIntExp >= 5) ? 'leftMargin' : null);
      y = getPagePos(posimg, 'offsetTop',
      (macIntExp == 4) ? 'parentElement' : 'offsetParent',
      (macIntExp >= 5) ? 'topMargin' : null);
   }
   else
   {
      x = posimg.x;
      y = posimg.y;
   }
   var width, height;
   if( scalingFloat > 1.0 )
   {
      width = (cropCtrl.sWidth-2);
      height = (cropCtrl.sHeight-2);
   }
   else
   {
      height = (cropCtrl.sHeight-2);
      width = Math.round(height*scalingFloat);
   }
   cropCtrl.initialize(x, y, width, height);
   cropCtrl.setCallback(cropperCallback);
   {
      var x, y, w, h;
      switch( cropCtrl.orientation )
      {
         case 0:
            x = xAxisScalingFactor;
            y = 1.0-verticalScalingConstant;
            w = widthScalingFactor-xAxisScalingFactor;
            h = verticalScalingConstant-heightScalingFactor;
         break;
         case 1:
            x = heightScalingFactor;
            y = xAxisScalingFactor;
            w = verticalScalingConstant-heightScalingFactor;
            h = widthScalingFactor-xAxisScalingFactor;
         break;
      }
      cropCtrl.set(x, y, w, h);
   }
   cropCtrl.setCropAspect(cropCtrl.aspectRatioToBeCropped,cropCtrl.isCompositeCrop,cropCtrl.minResWidth, cropCtrl.minResHeight);
   if( cropCtrl.wasFlipped )
   {
      cropCtrl.resetImage(cropCtrl.realSrc, cropCtrl.sHeight, cropCtrl.sWidth);
   }


    applyInitialCrop(cropCtrl) ;
    //hack to fix the bug : already cropped pictures have weared behaviour
    //when user tries to crop it. the crop control box expands suddenly.
    cropCtrl.expandCropForAlreadyCroppedPictures(5);
    cropCtrl.expandCropForAlreadyCroppedPictures(6);
    cropCtrl.expandCropForAlreadyCroppedPictures(9);
    cropCtrl.expandCropForAlreadyCroppedPictures(10);
    cropCtrl.expandCropForAlreadyCroppedPictures(0);
   //end of hack

    // to show low resolution info and lock crop area (onload of crop control tool)
    if(cropCtrl.lock){
        cropCtrl.hasReachedMinSize = true ;
    }


    //end of Vijay's Code

}

cropControl.prototype.expandCropForAlreadyCroppedPictures = function(sideMove)
{
    this.sideMove = sideMove ;
    this.doChangeSize(0, 0);
    this.doCrop(this.tmpClip.x1, this.tmpClip.y1, this.tmpClip.x2-this.tmpClip.x1, this.tmpClip.y2-this.tmpClip.y1);

}

cropControl.prototype.setFaceTagsCoordinatesForPict = function(brx,bry,tlx,tly)
{
    this.brx = brx*this.sWidth;
	this.bry = bry*this.sHeight;
	this.tlx = tlx*this.sWidth;
	this.tly = tly*this.sHeight;
	hasFaceTags = true;//setting this to true because this function will be called only when we have face tags
}
