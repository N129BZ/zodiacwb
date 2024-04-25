"use strict";


var appData = {};
var valData = {};
var devstate = { "state": false };
var clickcount = 0;
var usemetric = false;
var isdarktheme = false; 
var ismainview = true;
var printpdf = false;
var isLoading = false;
var currentview = "";

const  logEntryType = {"error": "err", "debug": "debug", "information": "info"};

const  checkpdf = document.getElementById("printpdf");
const  mainview = document.getElementById("mainview");
const  ch650view = document.getElementById("ch650view");
const  ch650canvas = document.getElementById("ch650canvas");
const  ch650tdview = document.getElementById("ch650tdview");
const  ch650tdcanvas = document.getElementById("ch650tdcanvas");
const  ch701view = document.getElementById("ch701view");
const  ch701canvas = document.getElementById("ch701canvas");
const  ch750view = document.getElementById("ch750view");
const  ch750canvas = document.getElementById("ch750canvas");
const  ch750Cruzerview = document.getElementById("ch750Cruzerview");
const  ch750Cruzercanvas = document.getElementById("ch750Cruzercanvas");
const  rv9view = document.getElementById("rv9view");
const  rv9canvas = document.getElementById("rv9canvas");
const  rv9aview = document.getElementById("rv9aview");
const  rv9acanvas = document.getElementById("rv9acanvas");
const  convertview = document.getElementById("convertview");
const  chartcanvas = document.getElementById("chartcanvas");  
const  saveButton = document.getElementById("saveButton");
const  showAcButton = document.getElementById("showAcButton");
const  printButton = document.getElementById("printButton");
const  buttonBox = document.getElementById("buttonContainer");
const  exitButton = document.getElementById("exitButton");
const  container = document.getElementById("container");
const  mycog = document.getElementById("mycog");
const  accog = document.getElementById("accog");
const  chartDot = document.getElementById("dot");
const  acDot = document.getElementById("acdot");
const  leftMainWeight = document.getElementById("leftMainWeight"); 
const  leftMainArm = document.getElementById("leftMainArm");
const  leftMainMoment = document.getElementById("leftMainMoment");

const  rightMainWeight = document.getElementById("rightMainWeight") 
const  rightMainArm = document.getElementById("rightMainArm");
const  rightMainMoment = document.getElementById("rightMainMoment");

const  nosegearLimit = document.getElementById("nosegearLimit");
const  noseWheelWeight = document.getElementById("noseWheelWeight");
const  noseWheelArm = document.getElementById("noseWheelArm");
const  noseWheelMoment = document.getElementById("noseWheelMoment"); 

const  emptyWeight = document.getElementById("emptyWeight"); 
const  emptyArm = document.getElementById("emptyArm");
const  emptyMoment = document.getElementById("emptyMoment"); 

const  pilotWeight = document.getElementById("pilotWeight"); 
const  pilotArm = document.getElementById("pilotArm");
const  pilotMoment = document.getElementById("pilotMoment");

const  passengerWeight = document.getElementById("passengerWeight"); 
const  passengerArm = document.getElementById("passengerArm");
const  passengerMoment = document.getElementById("passengerMoment");

const  rightWingLockerWeight = document.getElementById("rightWingLockerWeight"); 
const  rightWingLockerArm = document.getElementById("rightWingLockerArm"); 
const  rightWingLockerMoment = document.getElementById("rightWingLockerMoment"); 

const  leftWingLockerWeight = document.getElementById("leftWingLockerWeight");
const  leftWingLockerArm = document.getElementById("leftWingLockerArm");
const  leftWingLockerMoment = document.getElementById("leftWingLockerMoment");

const  fuelUnits = document.getElementById("fuelUnits"); 
const  fuelWeight = document.getElementById("fuelWeight");
const  fuelArm = document.getElementById("fuelArm"); 
const  fuelMoment = document.getElementById("fuelMoment"); 

const  rearBaggageWeight = document.getElementById("rearBaggageWeight"); 
const  rearBaggageArm = document.getElementById("rearBaggageArm"); 
const  rearBaggageMoment = document.getElementById("rearBaggageMoment"); 

const  totalWeight = document.getElementById("totalWeight"); 
const  totalCog = document.getElementById("totalArm");
const  totalMoment = document.getElementById("totalMoment"); 
const  cog = document.getElementById("cog"); 


//--------------------------------------------------------
// weight & moment indication labels, these change when:
// -- user wants weight in kg and moment in millimeters
// -- user wants weight in lbs and moment in inches
//--------------------------------------------------------
const weightMin = document.getElementById("weightMin");   		
const weightNosegearMin = document.getElementById("weightNosegearMin"); 		
const weightMaxGross = document.getElementById("weightMaxGross"); 
const maxGrossDashes = document.getElementById("maxGrossDashes")
const weightMaxFloats = document.getElementById("weightMaxFloats"); 
const maxFloatsDashes = document.getElementById("maxFloatsDashes")
const maxGrossWeight = document.getElementById("maxGrossWeight"); 		
const momentMin = document.getElementById("momentMin"); 			
const momentMax = document.getElementById("momentMax"); 			
const weightAxis = document.getElementById("weightAxis");
const momentAxis = document.getElementById("momentAxis");
const fuelUnitLabel = document.getElementById("fuelUnitLabel");

var activeView;
var activeCanvas;

function setBoundaryLabels() {
	
	switch (currentview) {
		case "rv9":
			usemetric = false;
			weightMaxFloats.innerHTML = "";
			maxFloatsDashes.innerHTML = "";
			break;
		case "rv9a":
			usemetric = false;
			weightMaxFloats.innerHTML = "";
			maxFloatsDashes.innerHTML = "";
			break;
	}

	weightMin.innerHTML = valData.mingross;
	weightMaxGross.innerHTML = valData.maxgross;
	maxGrossWeight.value = valData.maxgross;
	
	switch (currentview) { 
		case "ch650":
	    case "ch750": 
		case "ch750Cruzer":
		case "ch701":
			maxFloatsDashes.innerHTML = "&nbsp;Max floats --------------------------------------------";
			maxGrossDashes.innerHTML = "&nbsp;&nbsp;Max gross ---------";
			weightNosegearMin.innerHTML = valData.ngstart;
			if (usemetric) {
				// adjust attributes for metric units
				weightMaxFloats.innerHTML = valData.maxfloats;  
				momentMin.className = "momentMinMetric";
				momentMax.className = "momentMaxMetric";
				weightAxis.className = "weightAxisMetric";
				weightAxis.innerHTML = "Weight (kilograms)";
				fuelUnitLabel.innerHTML = "Fuel in Liters:";
				momentMin.innerHTML = valData.mincg;
				momentMax.innerHTML = valData.maxcg;
				momentAxis.innerHTML = "Acceptable CG Range (millimeters)";
			} else  {
				// adjust attributes for imperial units
				weightMaxFloats.innerHTML = valData.maxfloats; 
				momentMin.className = "momentMinImperial";
				momentMax.className = "momentMaxImperial";
				weightAxis.className = "weightAxisImperial";
				weightAxis.innerHTML = "Weight (pounds)";
				fuelUnitLabel.innerHTML = "Fuel in Gallons:";
				momentMin.innerHTML = valData.mincg;
				momentMax.innerHTML = valData.maxcg;
				momentAxis.innerHTML = "Acceptable CG Range (inches)";
			}
			break;
		case "ch650td":
			maxGrossDashes.innerHTML = "";
			nosegearLimit.innerHTML = "";
			if (usemetric) {
				// adjust attributes for metric units
				weightMaxFloats.innerHTML = "";  
				momentMin.className = "momentMinMetric";
				momentMax.className = "momentMaxMetric";
				weightAxis.className = "weightAxisMetric";
				weightAxis.innerHTML = "Weight (kilograms)";
				fuelUnitLabel.innerHTML = "Fuel in Liters:";
				momentMin.innerHTML = valData.mincg;
				momentMax.innerHTML = valData.maxcg;
				momentAxis.innerHTML = "Acceptable CG Range (millimeters)";
			} else  {
				// adjust attributes for imperial units
				weightMaxFloats.innerHTML = ""; 
				momentMin.className = "momentMinImperial";
				momentMax.className = "momentMaxImperial";
				weightAxis.className = "weightAxisImperial";
				weightAxis.innerHTML = "Weight (pounds)";
				fuelUnitLabel.innerHTML = "Fuel in Gallons:";
				momentMin.innerHTML = valData.mincg;
				momentMax.innerHTML = valData.maxcg;
				momentAxis.innerHTML = "Acceptable CG Range (inches)";
			}
			break;
		default:
			nosegearLimit.innerHTML = "";
			maxGrossDashes.innerHTML = "";
			momentMin.className = "momentMinImperial";
			momentMax.className = "momentMaxImperial";
			weightAxis.className = "weightAxisImperial";
			weightAxis.innerHTML = "Weight (pounds)";
			fuelUnitLabel.innerHTML = "Fuel in Gallons:";
			momentMin.innerHTML = valData.mincg;
			momentMax.innerHTML = valData.maxcg
			momentAxis.innerHTML = "Acceptable CG Range (inches)";
			break;
	}
}

function assignValData() {
	switch (currentview) {
		case "ch650":
			usemetric = appData.ch650.units === "metric";
			valData =  usemetric ? appData.ch650.metric : appData.ch650.imperial;
			break;
		case "ch650td":
			usemetric = appData.ch650td.units === "metric";
			valData =  usemetric ? appData.ch650td.metric : appData.ch650td.imperial;
			break;
		case "ch701":
			usemetric = appData.ch701.units === "metric";
			valData =  usemetric ? appData.ch701.metric : appData.ch701.imperial;
			break;
		case "ch750":
			usemetric = appData.ch750.units === "metric";
			valData =  usemetric ? appData.ch750.metric : appData.ch750.imperial;
			break;
		case "ch750Cruzer":
			usemetric = appData.ch750Cruzer.units === "metric";
			valData =  usemetric ? appData.ch750Cruzer.metric : appData.ch750Cruzer.imperial;
			break;
		case "rv9":
			usemetric = false;
			valData = appData.rv9;
			break;
		case "rv9a":
			usemetric = false;
			valData = appData.rv9a;
			break;
	}
	activateView();
}

function activateView() {
	let nw = document.getElementById("nosewheel");
	let rightwl = document.getElementById("rightlocker");
	let leftwl = document.getElementById("leftlocker");
	let nwtext = "Nose Wheel:"
	let hideWL = false;

	// deactivate ALL VIEWS first...
	ch650view.setAttribute("style", "visibility:hidden;")
	ch650tdview.setAttribute("style", "visibility:hidden;")
	ch701view.setAttribute("style", "visibility:hidden;")
	ch750view.setAttribute("style", "visibility:hidden;")
	ch750Cruzerview.setAttribute("style", "visibility:hidden;")	
	rv9view.setAttribute("style", "visibility:hidden;");	
	rv9aview.setAttribute("style", "visibility:hidden;");
	switch (currentview) {
		case "ch650":
			activeView = ch650view;
			activeCanvas = ch650canvas;
			break;
		case "ch650td":
			nwtext = "Tail Wheel:"
			activeView = ch650tdview; 
			activeCanvas = ch650tdcanvas;
			break;
		case "ch701":
			hideWL = true;
			activeView = ch701view;
			activeCanvas = ch701canvas;
			break;
		case "ch750":
			hideWL = true;
			activeView = ch750view;
			activeCanvas = ch750canvas;
			break;
		case "ch750Cruzer":
			hideWL = true;
			activeView = ch750Cruzerview;
			activeCanvas = ch750Cruzercanvas;
			break;
		case "rv9":
			hideWL = true;
			nwtext = "Tail Wheel:";
			activeView = rv9view;
			activeCanvas = rv9canvas;
			break;
		case "rv9a":
			hideWL = true;
			activeView = rv9aview;
			activeCanvas = rv9acanvas;
			break;

	}
	activeView.setAttribute("style", "visibility:visible");	

	nw.innerHTML = nwtext;
	
	if (hideWL) {
		rightwl.setAttribute("style", "visibility:hidden;height:0px;");
		leftwl.setAttribute("style", "visibility:hidden;height:0px;");
	}
	
	electronAPI.logentry(logEntryType.information, `Aircraft selected: ${currentview}`);
}

window.onload = async () => {
	const data = await window.electronAPI.getappdata();
	isLoading = true;
	appData = JSON.parse(data);
	if (appData.settings.debug) console.log(appData);
	currentview = appData.settings.currentview;
	
	assignValData();
	
	isdarktheme = appData.settings.theme === "dark";
	printpdf = appData.settings.printaspdf;
	checkpdf.checked = printpdf;

	setBoundaryLabels();

	rightMainWeight.value = valData.rmweight;
	rightMainArm.value = valData.rmarm;
	
	leftMainWeight.value = valData.lmweight;
	leftMainArm.value = valData.lmarm;
	
	noseWheelWeight.value = valData.nwweight;
	noseWheelArm.value = valData.nwarm;
	
	pilotWeight.value = valData.pilotweight;
	pilotArm.value = valData.pilotarm;
	
	passengerWeight.value = valData.psgrweight;
	passengerArm.value = valData.psgrarm;

	fuelUnits.value = valData.fuelunits;
	fuelArm.value = valData.fuelarm;
	
	rearBaggageWeight.value = valData.rbagweight;
	rearBaggageArm.value = valData.rbagarm;
	
	
	if (currentview === "ch650" || currentview === "ch650td") {
		rightWingLockerWeight.value = valData.rwlockweight;
		rightWingLockerArm.value = valData.lwlockarm;
		leftWingLockerWeight.value = valData.lwlockweight;
		leftWingLockerArm.value = valData.lwlockarm;
	}
	else { //no other a/c use wing lockers
		rightWingLockerWeight.value = 0;
		rightWingLockerArm.value = 0;
		leftWingLockerWeight.value = 0;
		leftWingLockerArm.value = 0;
	}

	drawChart();
	calcWB(null, true);
	drawAirplane();
};

function drawChart() {
	const ctx = chartcanvas.getContext("2d");
	var imgpath = "";
	var img = new Image(); 
	img.onload = function() {
		ctx.drawImage(img, 0, 0); 
	}
	switch (currentview) {
		case "ch650":
		case "ch701":
		case "ch750":
		case "ch750Cruzer":
			imgpath = "img/ch650chart.png";
			break;
		case "ch650td":
		case "rv9":
		case "rv9a":
			imgpath = "img/noBevelChart.png";
			break;
	}
	img.src = imgpath;
}

function drawAirplane() {
	var imgsrcLight = "";
	var imgsrcDark = "";
	activeView.setAttribute("style", "visibility:hidden;");
	switch(currentview) {
		case "ch650":
			activeView = ch650view;
			activeCanvas = ch650canvas;
			imgsrcLight = "img/ch650_light.png";
			imgsrcDark = "img/ch650_dark.png";
			break;
		case "ch650td":
			activeView = ch650tdview;
			activeCanvas = ch650tdcanvas;
			imgsrcLight = "img/ch650td_light.png";
			imgsrcDark = "img/ch650td_dark.png";
			break;
		case "ch701":
			activeView = ch701view;
			activeCanvas = ch701canvas;
			imgsrcLight = "img/ch701_light.png";
			imgsrcDark = "img/ch701_dark.png";
			break;
		case "ch750":
			activeView = ch750view;
			activeCanvas = ch750canvas;
			imgsrcLight = "img/ch750_light.png";
			imgsrcDark = "img/ch750_dark.png";
			break;
		case "ch750Cruzer":
			activeView = ch750Cruzerview;
			activeCanvas = ch750Cruzercanvas;
			imgsrcLight = "img/ch750Cruzer_light.png";
			imgsrcDark = "img/ch750Cruzer_dark.png";
			break;
		case "rv9":
			activeView = rv9view;
			activeCanvas = rv9canvas;
			imgsrcLight = "img/rv9_light.png";
			imgsrcDark = "img/rv9_dark.png";
			break;
		case "rv9a":
			activeView = rv9aview;
			activeCanvas = rv9acanvas;
			imgsrcLight = "img/rv9a_light.png";
			imgsrcDark = "img/rv9a_dark.png";
			break;
	}
	activeView.setAttribute("style", "visibility:visible;");
	const lbl = document.getElementById("accoglabel");	 
	const apctx = activeCanvas.getContext("2d");
	var apimg = new Image();
	apimg.onload = function() {
		apctx.drawImage(apimg, 0, 0);
	}
	if (isdarktheme) {
		apimg.src = imgsrcDark;
		lbl.setAttribute("style", "color:white;")
	}
	else {
		apimg.src = imgsrcLight;
		lbl.setAttribute("style", "color:black;")
	}
}

const calcFuel = function() {
	let fuelunits = handleNaN(fuelUnits.value);
	let fuelwt =  usemetric ? fuelunits * 0.79 : fuelunits * 6;
	fuelWeight.value = fuelwt;
	let fuelarm = handleNaN(fuelArm.value);
	let fuelmom = fuelwt * fuelarm; 
	fuelMoment.value = +(fuelmom).toFixed(1);
	valData.fuelunits = fuelunits;
	valData.fuelweight = fuelwt;
	valData.fuelarm = fuelarm;
	return [fuelwt, fuelmom];
}

const calcWB = function(field = null) {	
	saveButton.disabled = isLoading;
	
	let rtMainWt = +rightMainWeight.value;
	let rtMainArm = +rightMainArm.value;
	valData.rmweight = rtMainWt;
	valData.rmarm = rtMainArm;
	let rtMainMom = +(rtMainWt * rtMainArm).toFixed(1);
	rightMainMoment.value = rtMainMom;
	
	let lftMainmWt = +leftMainWeight.value; 
	let lftMainArm = +leftMainArm.value;
	valData.lmweight = lftMainmWt;
	valData.lmarm = lftMainArm;
	let lftMainMom =  +(lftMainmWt * lftMainArm).toFixed(1);
	leftMainMoment.value = lftMainMom;
	
	let noseWhlWt = +noseWheelWeight.value;
	let noseWhlArm = +noseWheelArm.value;
	valData.nwweight = noseWhlWt;
	valData.nwarm = noseWhlArm;
	let noseWhlMom = +(noseWhlWt * noseWhlArm).toFixed(1);
	noseWheelMoment.value = noseWhlMom;
	
	let emptyWt = + lftMainmWt + rtMainWt + noseWhlWt;
	let emptyMom = +(lftMainMom + rtMainMom + noseWhlMom).toFixed(1);
	let emptyCg = +(emptyMom / emptyWt).toFixed(2);
	emptyWeight.value = emptyWt;
	if (currentview === "rv9" || currentview === "rv9a") {
		valData.mingross = emptyWt;
	}
	emptyArm.value = `CG: ${emptyCg}`;
	emptyMoment.value = emptyMom; 
	
	let pltWt = +pilotWeight.value; 
	let pltArm = +pilotArm.value;
	valData.pilotweight = pltWt;
	valData.pilotarm = pltArm;
	let pltMom = +(pltWt * pltArm).toFixed(1);
	pilotMoment.value = pltMom;
	
	let psgrWt = +passengerWeight.value;
	let psgrArm = +passengerArm.value;
	valData.psgrweight = psgrWt;
	valData.psgrarm = psgrArm;
	let psgrMom = +(psgrWt * psgrArm).toFixed(1); 
	passengerMoment.value = psgrMom;
	
	let rtWngLkrWt = +rightWingLockerWeight.value;
	let rtWngLkrArm = +rightWingLockerArm.value;
	valData.rwlockweight = rtWngLkrWt;
	valData.rwlockarm = rtWngLkrArm;
	let rtWngLkrMom = Math.round(rtWngLkrWt * rtWngLkrArm);
	rightWingLockerMoment.value = rtWngLkrMom;

	let lftWngLkrWt = +leftWingLockerWeight.value; 
	let lftWngLkrArm = +leftWingLockerArm.value;
	valData.leftWingLockerArm = lftWngLkrArm;
	valData.lwlockweight = lftWngLkrWt;
	let lftWngLkrMom = Math.round(lftWngLkrWt * lftWngLkrArm);
	leftWingLockerMoment.value = lftWngLkrMom;
	
	let fuelnums = calcFuel(); // returns [weight, moment]
	
	let rearBagWt = +rearBaggageWeight.value; 
	let rearBagArm = +rearBaggageArm.value;  
	valData.rbagweight = rearBagWt;
	valData.rbagarm = rearBagArm;
	let rearBagMom = +(rearBagWt * rearBagArm).toFixed(1);
	rearBaggageMoment.value = rearBagMom;
	
	let totalWtArray = [emptyWt, pltWt, psgrWt, rtWngLkrWt, lftWngLkrWt, fuelnums[0], rearBagWt];
	let totalArmArray = [emptyMom, pltMom, psgrMom, rtWngLkrMom, lftWngLkrMom , fuelnums[1], rearBagMom];
	let totalWt = addArray(totalWtArray);
	let totalMom = addArray(totalArmArray);
	let finalCog = +(totalMom / totalWt).toFixed(1);
	
	totalWeight.value = Math.round(totalWt);
	totalCog.value = `CG: ${finalCog}`;
	totalMoment.value = +totalMom.toFixed(2); 
	
	let cogtxt = `(${finalCog}, ${totalWt})`;
	mycog.innerHTML = cogtxt;
	accog.innerHTML = cogtxt.replace("(", "").replace(")", "");
	placeDots(+totalWeight.value, finalCog);
	isLoading = false;
}

// change colors of textboxes to match condition
function applyTextColors(isoverwt) {
	let colors = appData.settings;
	if (!isoverwt) {
		totalWeight.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		totalCog.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		totalMoment.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		mycog.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
	} 
	else {
		totalWeight.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		totalCog.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		totalMoment.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		mycog.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
	}
}

function handleNaN(theNumber) {
	var tn = 0;
	if (theNumber === "" || isNaN(theNumber)) {
		// do nothing
	} else {
		tn = +theNumber
	}
	return tn;
}

function addArray(theArray) {
	var outval = 0;
	theArray.forEach( val => {
		outval = !isNaN(val) ? outval + val : outval;
	});
	return outval;
}

function placeDots(weight, moment) {
	let ctx = chartcanvas.getContext('2d', { willReadFrequently: true });
	let rgba = ctx.getImageData(5,5,1,1).data
	let color; 
	let tcolor;
	let bgcolor;
	let fgcolor;
	let maxweight = valData.maxgross;
	let minweight = valData.mingross;
	let isoverwt = true;
	let mincg = 0;
	let maxcg = 0;
	let mom = 0;
	let x = 0;
	let y = 0;
	
	try {	
		
		switch (currentview) {
			case "ch650":
			case "ch650td":
			case "ch701":
			case "ch750":
			case "ch750Cruzer":
				mincg = usemetric ? valData.mincg : Math.round(valData.mincg * 25.4);
				maxcg = usemetric ? valData.maxcg : Math.round(valData.maxcg * 25.4);
				mom = usemetric ? moment : Math.round(moment * 25.4);
				break;
			case "rv9":
			case "rv9a":
				mom = +(moment * 25.4).toFixed(2);
				mincg = +(valData.mincg * 25.4).toFixed(2);
				maxcg = +(valData.maxcg * 25.4).toFixed(2);
				break;
		}

		x = plotX(chartcanvas, maxcg, mincg, mom);
		y = plotY(chartcanvas, maxweight, minweight, weight);
		
		if ((weight <= maxweight && weight >= minweight) && (mom >= mincg && mom <= maxcg)) {
			if ((rgba[0] === 221 && rgba[1] === 238 && rgba[2] === 235) || 
				(rgba[0] === 0 && rgba[1] === 0 && rgba[2] === 0)) { // on the black border line counts!!
				color = appData.settings.underbgcolor;
				tcolor = appData.settings.underbgcolor;
				bgcolor = appData.settings.underbgcolor;;
				fgcolor = appData.settings.underfgcolor;
				isoverwt = false;
			}
		} else {
			color = appData.settings.overbgcolor;
			tcolor = appData.settings.overbgcolor;
			bgcolor = appData.settings.overbgcolor;
			fgcolor = appData.settings.overfgcolor;
		}

	}
	catch (error){
		electronAPI.logentry(logEntryType.error, error.toString());
	}
	
	applyTextColors(isoverwt);

	chartDot.setAttribute("style", `height:14px;width:14px;border-radius:50%;position:absolute;top:${+y - 9}px;left:${+x - 5}px;background-color:${color};`);
	
	mycog.setAttribute("style", `font-size:x-small;color:${tcolor};position:absolute;top:${+y + 7}px;left:${+x - 25}px;width:fit-content`);
	
	let crosshair = document.getElementById("chartcrosshair");
	crosshair.setAttribute("style", "font-size:25px;position:relative;top:-6px;left:0px;color:white;")
	
	placeAcDot(maxcg, mincg, maxweight, minweight, weight, mom, bgcolor, fgcolor);
}

function placeAcDot(maxcg, mincg, maxweight, minweight, weight, moment, bgcolor, fgcolor) {
	let elements = getCogElements();
	let rect = elements.rectangle;
	let dot = elements.dot;
	let crosshair = elements.crosshair;
	let x;
	let y;

	try {

		x = plotX(rect, maxcg, mincg, moment);
		y = plotY(rect, maxweight, minweight, weight);

		dot.setAttribute(
			"style", `height:7px;width:7px;border-radius:50%;position:relative;top:${y-9}px;` +
					 `left:${x-5}px;background-color:${bgcolor};` + 
					 `padding:4px;border:2px; ${fgcolor};`
		);
		
		crosshair.setAttribute("style", "font-size:29px;position:relative;top:-13px;left:-5px;color:white;")

		accog.setAttribute("style", `background-color:${bgcolor};color:${fgcolor};`);
	}
	catch (error) {
		electronAPI.logentry(logEntryType.error, error.toString());
	}
}

function getCogElements() {
	let crosshair;
	let dot;
	let rect; 
	switch (currentview) {
		case "ch650":
			rect = document.getElementById("ch650rectangle").getBoundingClientRect();
			rect.className = "cg650rectangle";
			dot = document.getElementById("ch650dot");
			crosshair = document.getElementById("ch650crosshair");
			break;
		case "ch650td":
			rect = document.getElementById("ch650tdrectangle").getBoundingClientRect();
			rect.className = "cg650tdrectangle";
			dot = document.getElementById("ch650tddot");
			crosshair = document.getElementById("ch650tdcrosshair");
			break;
		case "ch701":
			rect = document.getElementById("ch701rectangle").getBoundingClientRect();
			rect.className = "cg701rectangle";
			dot = document.getElementById("ch701dot");
			crosshair = document.getElementById("ch701crosshair");
			break;
		case "ch750":
			rect = document.getElementById("ch750rectangle").getBoundingClientRect();
			rect.className = "cg750rectangle";
			dot = document.getElementById("ch750dot");
			crosshair = document.getElementById("ch750crosshair");
			break;
		case "ch750Cruzer":
			rect = document.getElementById("ch750Cruzerrectangle").getBoundingClientRect();
			rect.className = "cg750Cruzerrectangle";
			dot = document.getElementById("ch750Cruzerdot");
			crosshair = document.getElementById("ch750Cruzercrosshair");
			break;
		case "rv9":
			rect = document.getElementById("rv9rectangle").getBoundingClientRect();
			rect.className = "cgrv9rectangle";
			dot = document.getElementById("rv9dot");
			crosshair = document.getElementById("rv9crosshair");
			break;
		case "rv9a":
			rect = document.getElementById("rv9arectangle").getBoundingClientRect();
			rect.className = "cgrv9arectangle";
			dot = document.getElementById("rv9adot");
			crosshair = document.getElementById("rv9acrosshair");
			break;
	}

	return { "rectangle": rect, "dot": dot, "crosshair":crosshair }
}

const saveAppData = function() {
	window.electronAPI.saveappdata(appData);
	saveButton.disabled = true;
}

const printScreen = function() {
	buttonBox.setAttribute("style", "visibility:hidden");
	setTimeout(() => window.electronAPI.printscreen(printpdf), 300);
}

function countClicks() {
	clickcount++;
	if (clickcount === 10) {
		devstate.state = !appData.settings.debug;
		saveAppData();
		showDev();
	}
}

const showDev = function() {
	window.electronAPI.showdev(devstate);
}

function exitApp() {
	window.electronAPI.exitapp();
}

window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change',({ matches }) => {
    if (matches) {
		isdarktheme = false;
		appData.settings.theme = "light";	
	}
	saveAppData();	
	window.electronAPI.reload();
		
});

window.matchMedia('(prefers-color-scheme: dark)') 
		.addEventListener('change', ({ matches }) => {
	if(matches) {
		isdarktheme = true;
		appData.settings.theme = "dark";
	}
	saveAppData();
	window.electronAPI.reload();	
});

window.electronAPI.onAircraftSelect((aircraft) => {
	console.log(aircraft);
	currentview = aircraft;
	appData.settings.currentview = aircraft;
	saveAppData();
	window.electronAPI.selectaircraft(aircraft);
});

function togglePrintPDF(chkbox) {
	if (!isLoading) {
		printpdf = chkbox.checked;
		appData.settings.printaspdf = printpdf;
		saveAppData();
	}
}

/**
 * Plot Y based on height of destination object
 * @param {object} chart canvas or rectangle 
 * @param {number} maxGross
 * @param {number} minGross
 * @param {number} acWeight 
  * @returns {number} 
 */
function plotY(chart, maxGross, minGross, acWeight) {
	let range = maxGross - minGross; 
	let pxfactor = chart.height / range;
	let diff = maxGross - acWeight;
	let offset = diff * pxfactor;
	return offset;
}

/**
 * Plot X based on width of destination object
 * @param {object} chart canvas or rectangle
 * @param {number} maxCg 
 * @param {number} minCg 
 * @param {number} acMoment 
 * @returns {number} 
 */
function plotX(chart, maxCg, minCg, acMoment) {
	let range = maxCg - minCg; 
	let pxfactor = chart.width / range;
	let diff = maxCg - acMoment;
	let offset = chart.width - (diff * pxfactor);
	return offset;
}

