// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


//http://walgreens/walgreens/croporientationpopup/PictureID=10003357001_10000822001/prdtype=reprint%3B4x6/journal=/isReprintable=true/



var picInfo = null;






/**************************************************************************************************/
var CROPORIENTATION_LANDSCAPE = 0;
var CROPORIENTATION_PORTRAIT = 1;
var hiresHeight = picInfo.picHrHeight;
var hiresWidth = picInfo.picHrWidth;
var picHeightUB = picInfo.picHeightUB;
var picWidthUB = picInfo.picWidthUB;
var displayBoxSize = 385;
// var leadingOliId = <%= leadingOLIOid%>;
// var isSqPrint = <%= isSqPrint%>;
//ToDo: Need to check this
var journal = picInfo.imageJournal;

var isJournalNull = true;
var journalParam = ""; //ToDo: get this fron Handler

if (journalParam != "") {
    journal = journalParam;
    isJournalNull = false;
}

var journalKeyValuePairs = journal.split("/");
var caAsAnArrayOfStrings = "";

var originalCropspectRatio = picInfo.originalCropspectRatio();
var minSizes = originalMinSizes = new Array();
var isMobileBrowser = false;
if (isMobileBrowser)
    displayBoxSize = 280;
var minResolutionArray = new Array(530, 360);

var journalEngine = new imageFactory(picInfo.journal,
    picInfo.imageSource,
    picInfo.renderHostname,
    hiresWidth, hiresHeight, picWidthUB,
    picHeightUB, displayBoxSize);

var cropAspectRatio = originalCropAspectRatio = picInfo.dblCropspectRatio;
var isLandscape = picInfo.HRWidth >= picInfo.HRHeight;
var thumbnailHeight = picInfo.tnHeight;

if (picWidthUB <= picHeightUB)
    window.resizeTo(695, 650);
else if (thumbnailHeight <= 59)
    window.resizeTo(695, 500);
else if (thumbnailHeight < 69)
    window.resizeTo(695, 530);
else if (thumbnailHeight < 79)
    window.resizeTo(695, 570);
else
    window.resizeTo(695, 720);

var displayBoxSize=385
var isDigitalImage = false;
var isDigitalImageHaveCR = false;


if ((picWidthUB < picHeightUB && isLandscape) || (picWidthUB > picHeightUB && !isLandscape))
    isDigitalImage = true;


var sMinSize = srcWidth = srcHeight = 50;
var defaultOrientation = null;
journalEngine.setMinimumResolution(minResolutionArray[0], minResolutionArray[1]);
if (isDigitalImage) {
    srcWidth = journalEngine.getConstrainedImageSizeFromPictDimension()[1];
    srcHeight = journalEngine.getConstrainedImageSizeFromPictDimension()[0];
}
else {
    srcWidth = journalEngine.getConstrainedImageSizeFromPictDimension()[0];
    srcHeight = journalEngine.getConstrainedImageSizeFromPictDimension()[1];
}
sMinSize = journalEngine.getMinCropFieldSize(hiresWidth, hiresHeight, srcWidth, srcHeight, true, 2);

if (sMinSize == null)
    sMinSize = Math.min(srcWidth, srcHeight);

var boxX1 = 0;
var boxY1 = 0;
var boxY2 = srcHeight;
var boxX2 = srcWidth;


function setInitialCrop(caAsAnArrayOfStrings) {
    if (!isJournalNull) {
        caAsAnArrayOfStrings = getInitialCrop(journalEngine);//create default journal for first time
    }
    if (caAsAnArrayOfStrings != null && caAsAnArrayOfStrings.length > 3) {
        boxY1 = srcHeight * caAsAnArrayOfStrings[0];
        boxX1 = srcWidth * caAsAnArrayOfStrings[1];
        /*to make x1 co-ordinate as 0( when the value is less than = 3) to avoid blank in leftside for default crop border*/
        if (boxX1 <= 3) {
            boxX1 = 0;
        }
        boxY2 = srcHeight * caAsAnArrayOfStrings[2];
        boxX2 = srcWidth * caAsAnArrayOfStrings[3];
    }
}

function getCropOrientation() {
    var cropOrientationArea = mainCropControl.getCropArea();
    var newCropOrientationArea = new Array();
    newCropOrientationArea[1] = srcHeight * cropOrientationArea[0];
    newCropOrientationArea[0] = srcWidth * cropOrientationArea[1];
    newCropOrientationArea[3] = srcHeight * cropOrientationArea[2];
    newCropOrientationArea[2] = srcWidth * cropOrientationArea[3];
    return newCropOrientationArea;
}

function setCropOrientationButton(orientation) {
    if (orientation == CROPORIENTATION_LANDSCAPE) {
        $("#potraitRadio").attr('class', 'sprite-h radio-blue radio-v-position');
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue-active radio-h-position');
    }
    else {
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue radio-h-position');
        $("#potraitRadio").attr('class', 'sprite-h radio-blue-active radio-v-position');
    }
}

function getCropOrientationButton() {
    if (mainCropControl.isLandscapeOrientation() != null && mainCropControl.isLandscapeOrientation()) {
        $("#potraitRadio").attr('class', 'sprite-h radio-blue radio-v-position');
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue-active radio-h-position');
    }
    else {
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue radio-h-position');
        $("#potraitRadio").attr('class', 'sprite-h radio-blue-active radio-v-position');
    }
}

function setLandscapeRatio(aspectRatioToBeCorrected) {
    switch (aspectRatioToBeCorrected) /* setting the landscape crop aspects */
    {
        case '0.66' :
            cropAspectRatio = 1.50;
            break;
        case '0.71':
            cropAspectRatio = 1.40;
            break;
        case '0.80':
            cropAspectRatio = 1.25;
            break;
        case '0.78':
            cropAspectRatio = 1.27;
            break;
    }
}

function setPortraitRatio(aspectRatioToBeCorrected) {
    switch (aspectRatioToBeCorrected) /* setting the portrait crop aspects */
    {
        case '1.50' :
            cropAspectRatio = 0.66;
            break;
        case '1.40':
            cropAspectRatio = 0.71;
            break;
        case '1.25':
            cropAspectRatio = 0.80;
            break;
        case '1.27':
            cropAspectRatio = 0.78;
            break;
    }
}

function isLandscapeAspectRatio(ratio) {
    ratio = parseFloat(ratio).toFixed(2);
    if (ratio == "1.50" || ratio == "1.40" || ratio == "1.25" || ratio == "1.27")
        return true;
    return false;
}

function isPortraitAspectRatio(ratio) {
    ratio = parseFloat(ratio).toFixed(2);
    if (ratio == "0.66" || ratio == "0.71" || ratio == "0.78" || ratio == "0.80")
        return true;
    return false;
}

/* setting crop aspect ratios for digital images */
function setDigitalImagesCropOrientation(ratio) {
    if (isLandscapeAspectRatio(ratio)) {
        defaultOrientation = CROPORIENTATION_LANDSCAPE;
        $("#potraitRadio").attr('class', 'sprite-h radio-blue radio-v-position');
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue-active radio-h-position');
    }
    else {
        defaultOrientation = CROPORIENTATION_PORTRAIT;
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue radio-h-position');
        $("#potraitRadio").attr('class', 'sprite-h radio-blue-active radio-v-position');
    }
}

function getDigitalImagesAspectRatio(aspectRatioToBeCorrected) {
    cropAspectRatio = aspectRatioToBeCorrected = parseFloat(aspectRatioToBeCorrected).toFixed(2);
    if (picWidthUB < picHeightUB) {
        defaultOrientation = CROPORIENTATION_PORTRAIT;
        setPortraitRatio(aspectRatioToBeCorrected);
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue radio-h-position');
        $("#potraitRadio").attr('class', 'sprite-h radio-blue-active radio-v-position');
    }
    else {
        defaultOrientation = CROPORIENTATION_LANDSCAPE;
        setLandscapeRatio(aspectRatioToBeCorrected);
        $("#potraitRadio").attr('class', 'sprite-h radio-blue radio-v-position');
        $("#landscapeRadio").attr('class', 'sprite-h radio-blue-active radio-h-position');
    }
    return cropAspectRatio;
}
/* getting the correct correct aspect */
function getCorrectAspectRatio(aspectRatioToBeCorrected) {
    defaultOrientation = mainCropControl.getOrientation();
    cropAspectRatio = aspectRatioToBeCorrected = parseFloat(aspectRatioToBeCorrected).toFixed(2);
    if (mainCropControl.isLandscapeOrientation() != null && mainCropControl.isLandscapeOrientation())
        setLandscapeRatio(aspectRatioToBeCorrected);
    else
        setPortraitRatio(aspectRatioToBeCorrected);
    return cropAspectRatio;
}

function getLandscapeCropAspect() {
    var sizeName = "<%=displaySizeName%>";
    if (sizeName == "4x6" || sizeName == "12x18" || sizeName == "20x30" || sizeName == "24x36" || sizeName == "Wallet Set")
        cropAspectRatio = 1.50;
    else if (sizeName == "8x10" || sizeName == "16x20")
        cropAspectRatio = 1.25;
    else if (sizeName == "5x7")
        cropAspectRatio = 1.40;
    else if (sizeName == "11x14")
        cropAspectRatio = 1.27;
    return cropAspectRatio;
}

function getPortraitCropAspect() {
    var sizeName = "<%=displaySizeName%>";
    if (sizeName == "4x6" || sizeName == "12x18" || sizeName == "20x30" || sizeName == "24x36" || sizeName == "Wallet Set")
        cropAspectRatio = 0.66;
    else if (sizeName == "8x10" || sizeName == "16x20")
        cropAspectRatio = 0.80;
    else if (sizeName == "5x7")
        cropAspectRatio = 0.71;
    else if (sizeName == "11x14")
        cropAspectRatio = 0.78;
    return cropAspectRatio;
}

/* set the crop area to landscape*/
function setLandscape() {
    $("#potraitRadio").attr('class', 'sprite-h radio-blue radio-v-position');
    $("#landscapeRadio").attr('class', 'sprite-h radio-blue-active radio-h-position');
    mainCropControl.switchCropOrientation(CROPORIENTATION_LANDSCAPE);
    mainCropControl.setCompositeCrop(true);
    mainCropControl.nudge();
}
/* set the crop area to portrait*/
function setPortrait() {
    $("#landscapeRadio").attr('class', 'sprite-h radio-blue radio-h-position');
    $("#potraitRadio").attr('class', 'sprite-h radio-blue-active radio-v-position');
    mainCropControl.switchCropOrientation(CROPORIENTATION_PORTRAIT);
    mainCropControl.setCompositeCrop(true);
    mainCropControl.nudge();
}

/* getting the min size array w.r.t to orientation*/
function getMinSizeArray(cropAspectRatio) {
    var minimumSizes = new Array();
    if (isLandscapeAspectRatio(cropAspectRatio))
        minimumSizes = [sMinSize * originalCropspectRatio, sMinSize];
    else
        minimumSizes = [sMinSize, sMinSize * originalCropspectRatio];
    return minimumSizes;
}
jQuery(function ($) {
    onLoadCrop(mainCropControl);
    /* loading crop.js crop functionality as jcrop doesn't provide crop orientation*/
    /* calcaulating the exact crop aspect ratio based on the type of image and setting the default orientation*/
    if (isDigitalImage && !isDigitalImageHaveCR)
        originalCropAspectRatio = getDigitalImagesAspectRatio(cropAspectRatio);
    else {
        if (!isDigitalImageHaveCR) {
            originalCropAspectRatio = getCorrectAspectRatio(cropAspectRatio);
            getCropOrientationButton();
        }
        else {
            originalCropAspectRatio = cropAspectRatio;
            setDigitalImagesCropOrientation(cropAspectRatio);
        }
    }
    mainCropControl.setCropAspect(cropAspectRatio, true, minResolutionArray[0], minResolutionArray[1]);
    setInitialCrop(mainCropControl.getCropArea());
    minSizes = originalMinSizes = getMinSizeArray(cropAspectRatio);

    /* loading jcrop*/
    var jcrop_api;
    $('#target').Jcrop({
        onChange: showCoords,
        onSelect: showCoords,
        setSelect: [boxX1, boxY1, boxX2, boxY2],
        aspectRatio: cropAspectRatio,
        trueSize: [srcWidth, srcHeight],
        minSize: [minSizes[0], minSizes[1]]
    }, function () {
        jcrop_api = this;
    });

    var __cropCA = "";

    $('#landscapeRadio').click(function (e) {
        cropAspectRatio = getLandscapeCropAspect();
        minSizes = getMinSizeArray(cropAspectRatio);
        jcrop_api.setOptions({aspectRatio: cropAspectRatio, minSize: [minSizes[0], minSizes[1]]});
        setLandscape();
        jcrop_api.setSelect(getCropOrientation());
    });

    $('#landscapeImageRadio').click(function (e) {
        cropAspectRatio = getLandscapeCropAspect();
        minSizes = getMinSizeArray(cropAspectRatio);
        jcrop_api.setOptions({aspectRatio: cropAspectRatio, minSize: [minSizes[0], minSizes[1]]});
        setLandscape();
        jcrop_api.setSelect(getCropOrientation());
    });

    $('#potraitRadio').click(function (e) {
        cropAspectRatio = getPortraitCropAspect();
        minSizes = getMinSizeArray(cropAspectRatio);
        jcrop_api.setOptions({aspectRatio: cropAspectRatio, minSize: [minSizes[0], minSizes[1]]});
        setPortrait();
        jcrop_api.setSelect(getCropOrientation());
    });

    $('#potraitImageRadio').click(function (e) {
        cropAspectRatio = getPortraitCropAspect();
        minSizes = getMinSizeArray(cropAspectRatio);
        jcrop_api.setOptions({aspectRatio: cropAspectRatio, minSize: [minSizes[0], minSizes[1]]});
        setPortrait();
        jcrop_api.setSelect(getCropOrientation());
    });
    /*resetting to default*/
    $('#revertCrop').click(function (e) {
        cropAspectRatio = originalCropAspectRatio;
        minSizes = originalMinSizes;
        jcrop_api.setOptions({aspectRatio: cropAspectRatio, minSize: [minSizes[0], minSizes[1]]});
        setCropOrientationButton(defaultOrientation);
        jcrop_api.setSelect([boxX1, boxY1, boxX2, boxY2]);
    });
});

function showCoords(c) {
    setImgSrc(c.y / srcHeight + "," + c.x / srcWidth + "," + c.y2 / srcHeight + "," + c.x2 / srcWidth);
    cropMessage(c);
};
/* checking the minsize and displaying message*/
function cropMessage(c) {
    if (Math.floor(c.w) - 1 > minSizes[0])
        document.getElementById("resWarningCrop").style.display = "none";
    else
        document.getElementById("resWarningCrop").style.display = "block";
}

function setImgSrc(cropCA) {
    __cropCA = cropCA;
}

function showHelpPopup(url, name) {
    CPopup.open(url, 'width=478,height=550,scrollbars=yes,resizable', name);
}

function cancel() //called when the cancel button is clicked
{
    window.opener.CPopup.close("dppcroporientation");
}

function doneEditing() //called when the 'done editing' button is clicked
{
    var cropArea = __cropCA.split(",");
    journalEngine.setCropArea(cropArea[0], parseFloat(cropArea[1]) + 0.003, cropArea[2], cropArea[3], cropArea[4]);
    var finalJournal = journalEngine.getFinalJournal();
    if (finalJournal.indexOf("/of") != -1)
        finalJournal = finalJournal.substring(0, finalJournal.indexOf("/of"));
    if (finalJournal.indexOf("/bd") == 0)
        finalJournal = finalJournal.substring(finalJournal.indexOf("/ca")) + finalJournal.substring(0, finalJournal.indexOf("/ca"));
        var finalJournalwithbd = finalJournal + "/" + "picInfo.imageBorder";
    var sizeName = "<%=displaySizeName%>";
    var cropAspRatio = "";
    if (sizeName == "4x6" || sizeName == "5x7" || sizeName == "8x10" || sizeName == "Wallet Set")
        cropAspRatio = "/cr=" + cropAspectRatio;
    /* removing crop aspect ratio for posters as poster size can not fit to that cr value */
    var strOf = "/of=50,150,150/";
    if (isMobileBrowser) {
        strOf = "/of=50,120,120/";
    }
    if (window.opener.isSingleSizeSelected) {
        var pictOwnerId = "<%=pictId_ownerId %>";
        var cropPictSize = "<%=upc%>";
        window.opener.applySingleJournal(cropPictSize, pictOwnerId, finalJournalwithbd +
            cropAspRatio, finalJournal +
            cropAspRatio, picInfo.getRenderHostname + "is=" + picInfo.getImageSource(true) +
            "/" + finalJournal + cropAspRatio + "/of=50,150,150/");
    }
    else /* when multiple sizes selected */
        window.opener.applyJournal(picInfo.getRenderHostname + "/is=" +
            picInfo.imageSource + "/" + finalJournal + cropAspRatio + strOf, finalJournal +
            cropAspRatio, finalJournalwithbd + cropAspRatio, mainCropControl.isLandscapeOrientation());
    window.self.close();
}   //end of doneEditing()


function getInitialCrop(journalEngine) {

    //get intial crop fields
    var aCropArea = null;
    if (journalEngine.getRotation() == "fh") {
        var finalJournal = journalEngine.getFinalJournal();
        if (finalJournal.indexOf("rf=cw") != -1) {
            aCropArea = rotateCropFields(journalEngine.getCropArea(), "cw");
        } else if (finalJournal.indexOf("rf=ccw") != -1) {
            aCropArea = rotateCropFields(journalEngine.getCropArea(), "ccw");
        } else if (finalJournal.indexOf("rf=ud") != -1) {
            aCropArea = rotateCropFields(journalEngine.getCropArea(), "ud");
        }
    }

    if (aCropArea == null) {
        aCropArea = journalEngine.getCropArea();
    }

    aCropArea = rotateCropFields(aCropArea, journalEngine.getRotation());
    return aCropArea;

}

function rotateCropFields(cropArea, rotation) {
    var aCropArea = null;
    if (typeof(cropArea) == "string") {
        aCropArea = cropArea.split(",", 4);
        if (aCropArea.length
            < 4) {
            return null;
        }
    } else {
        if ((typeof(cropArea.length) == "number") && cropArea.length >= 4) {//array object
            aCropArea = cropArea;
        }
    }

    if (aCropArea == null) {
        return null;
    }

    if (rotation == "cw") {
        aCropArea.push(aCropArea.shift());
        aCropArea[1] = Math.abs(1 - aCropArea[1]);
        aCropArea[3] = Math.abs(1 - aCropArea[3]);
    }
    else if (rotation == "ccw") {
        aCropArea.unshift(aCropArea.pop());
        aCropArea[0] = Math.abs(1 - aCropArea[0]);
        aCropArea[2] = Math.abs(1 - aCropArea[2]);
    }
    else if (rotation == "fh") {
        var old = aCropArea[1];
        aCropArea[1] = Math.abs(1 - aCropArea[3]);
        aCropArea[3] = Math.abs(1 - old);
    }
    else if (rotation == "ud") {
        var old = aCropArea[1];
        var old0 = aCropArea[0];
        aCropArea[1] = Math.abs(1 - aCropArea[3]);
        aCropArea[3] = Math.abs(1 - old);
        aCropArea[0] = Math.abs(1 - aCropArea[2]);
        aCropArea[2] = Math.abs(1 - old0);
    }
    return aCropArea;
}

function showImage() {
    var src = picInfo.renderHostname+"/is="+picInfo.imageSouce+"/"+picInfo.imageJournal+"/ca=no/of=50,"+displayBoxSize+","+displayBoxSize+"/bd=no";
    $(target).src = src;
}

