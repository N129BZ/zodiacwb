"use strict";

var appData = {};
var devstate = { "state": false };
var clickcount = 0;
var isdarktheme = false; 
var ismainview = true;
var printpdf = false;
var isLoading = false;
var aircraftList = new Map();
var currentAircraft = {};

const  logEntryType = {"error": "err", "debug": "debug", "information": "info"};

const  checkpdf = document.getElementById("printpdf");
const  mainview = document.getElementById("mainview");
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


/**
 * Load up all of the available Aircraft classes into a key/value Map object,
 * get the currently selected aircraft, and activate the view with that
 */
const actypes = {"chTricycle": 1, "chTaildragger": 2, "rv": 3 }
function loadAircraft() {
	aircraftList.set("ch650", new Aircraft("ch650", actypes.chTricycle, appData)); 
	aircraftList.set("ch650td", new Aircraft("ch650td", actypes.chTaildragger, appData)); 
	aircraftList.set("ch701", new Aircraft("ch701", actypes.chTricycle, appData)); 
	aircraftList.set("ch750", new Aircraft("ch750", actypes.chTricycle, appData)); 
	aircraftList.set("chCruzer", new Aircraft("chCruzer", actypes.chTricycle, appData));
	aircraftList.set("rv9", new Aircraft("rv9", actypes.rv, appData)); 
	aircraftList.set("rv9a", new Aircraft("rv9a", actypes.rv, appData)); 

	aircraftList.forEach(aircraft => {
		if (aircraft.name === appData.currentview) {
			currentAircraft = aircraft;
			return;
		}
	});
}

/**
 * Activate the currently selected view and set any specific labels it needs
 */
function activateView() {
	let nw = document.getElementById("nosewheel");
	let rightwl = document.getElementById("rightlocker");
	let leftwl = document.getElementById("leftlocker");

	currentAircraft.show();
	nw.innerHTML = currentAircraft.nwtext;
	
	if (currentAircraft.hideWL) {
		rightwl.setAttribute("style", "visibility:hidden;height:0px;");
		leftwl.setAttribute("style", "visibility:hidden;height:0px;");
	}
	
	electronAPI.logentry(logEntryType.information, `Aircraft selected: ${currentAircraft.name}`);
}

/**
 * Main entry point for the rendering process, it all begins here...
 */
window.onload = async () => {
	const data = await window.electronAPI.getappdata();
	isLoading = true;
	appData = JSON.parse(data);
	if (appData.settings.debug) console.log(appData);
	drawChart();
	loadAircraft();
	drawAllObjects();
};

function drawAllObjects() {
	
	currentAircraft.setLabels();
	
	activateView();
	
	isdarktheme = appData.settings.theme === "dark";
	printpdf = appData.settings.printaspdf;
	checkpdf.checked = printpdf;

	rightMainWeight.value = currentAircraft.data.rmweight;
	rightMainArm.value = currentAircraft.data.rmarm;
	
	leftMainWeight.value = currentAircraft.data.lmweight;
	leftMainArm.value = currentAircraft.data.lmarm;
	
	noseWheelWeight.value = currentAircraft.data.nwweight;
	noseWheelArm.value = currentAircraft.data.nwarm;
	
	pilotWeight.value = currentAircraft.data.pilotweight;
	pilotArm.value = currentAircraft.data.pilotarm;
	
	passengerWeight.value = currentAircraft.data.psgrweight;
	passengerArm.value = currentAircraft.data.psgrarm;

	fuelUnits.value = currentAircraft.data.fuelunits;
	fuelArm.value = currentAircraft.data.fuelarm;
	
	rearBaggageWeight.value = currentAircraft.data.rbagweight;
	rearBaggageArm.value = currentAircraft.data.rbagarm;
	
	
	if (currentAircraft.name === "ch650" || currentAircraft.name === "ch650td") {
		rightWingLockerWeight.value = currentAircraft.data.rwlockweight;
		rightWingLockerArm.value = currentAircraft.data.lwlockarm;
		leftWingLockerWeight.value = currentAircraft.data.lwlockweight;
		leftWingLockerArm.value = currentAircraft.data.lwlockarm;
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
}

/**
 * Create the upper light-green "chart box" image
 */
function drawChart() {
	const ctx = chartcanvas.getContext('2d', { willReadFrequently: true });
	ctx.clearRect(0,0,chartcanvas.width, chartcanvas.height)
	var img = new Image(); 
	img.onload = function() {
		ctx.drawImage(img, 0, 0); 
	}
	img.src = currentAircraft.chartImage;
}

/**
 * Draw the lower Aircraft image in the user's 
 * light or dark theme preference
 */
function drawAirplane() {
	const lbl = document.getElementById("accoglabel");	 
	const apctx = currentAircraft.canvas.getContext('2d', { willReadFrequently: true });
	var apimg = new Image();
	apimg.onload = function() {
		apctx.drawImage(apimg, 0, 0);
	}
	if (isdarktheme) {
		apimg.src = currentAircraft.darkImage;
		lbl.setAttribute("style", "color:white;")
	}
	else {
		apimg.src = currentAircraft.lightImage;
		lbl.setAttribute("style", "color:black;")
	}
}

/**
 * Calculate the weight and moment of the fuel based on UOM and quantity
 * @returns {[number, number]}
 */
function calcFuel() {
	let fuelunits = handleNaN(fuelUnits.value);
	let fuelwt =  currentAircraft.ismetric ? fuelunits * 0.79 : fuelunits * 6;
	fuelWeight.value = fuelwt;
	let fuelarm = handleNaN(fuelArm.value);
	let fuelmom = fuelwt * fuelarm; 
	fuelMoment.value = +(fuelmom).toFixed(1);
	currentAircraft.data.fuelunits = fuelunits;
	currentAircraft.data.fuelweight = fuelwt;
	currentAircraft.data.fuelarm = fuelarm;
	return [fuelwt, fuelmom];
}

/**
 * Calculate the Aircraft's weight and balance
 */
function calcWB() {	
	saveButton.disabled = isLoading;
	
	let rtMainWt = +rightMainWeight.value;
	let rtMainArm = +rightMainArm.value;
	currentAircraft.data.rmweight = rtMainWt;
	currentAircraft.data.rmarm = rtMainArm;
	let rtMainMom = +(rtMainWt * rtMainArm).toFixed(1);
	rightMainMoment.value = rtMainMom;
	
	let lftMainmWt = +leftMainWeight.value; 
	let lftMainArm = +leftMainArm.value;
	currentAircraft.data.lmweight = lftMainmWt;
	currentAircraft.data.lmarm = lftMainArm;
	let lftMainMom =  +(lftMainmWt * lftMainArm).toFixed(1);
	leftMainMoment.value = lftMainMom;
	
	let noseWhlWt = +noseWheelWeight.value;
	let noseWhlArm = +noseWheelArm.value;
	currentAircraft.data.nwweight = noseWhlWt;
	currentAircraft.data.nwarm = noseWhlArm;
	let noseWhlMom = +(noseWhlWt * noseWhlArm).toFixed(1);
	noseWheelMoment.value = noseWhlMom;
	
	let emptyWt = + lftMainmWt + rtMainWt + noseWhlWt;
	let emptyMom = +(lftMainMom + rtMainMom + noseWhlMom).toFixed(1);
	let emptyCg = +(emptyMom / emptyWt).toFixed(2);
	emptyWeight.value = emptyWt;
	if (currentAircraft.name === "rv9" || currentAircraft.name === "rv9a") {
		currentAircraft.data.mingross = emptyWt;
	}
	emptyArm.value = `CG: ${emptyCg}`;
	emptyMoment.value = emptyMom; 
	
	let pltWt = +pilotWeight.value; 
	let pltArm = +pilotArm.value;
	currentAircraft.data.pilotweight = pltWt;
	currentAircraft.data.pilotarm = pltArm;
	let pltMom = +(pltWt * pltArm).toFixed(1);
	pilotMoment.value = pltMom;
	
	let psgrWt = +passengerWeight.value;
	let psgrArm = +passengerArm.value;
	currentAircraft.data.psgrweight = psgrWt;
	currentAircraft.data.psgrarm = psgrArm;
	let psgrMom = +(psgrWt * psgrArm).toFixed(1); 
	passengerMoment.value = psgrMom;
	
	let rtWngLkrWt = +rightWingLockerWeight.value;
	let rtWngLkrArm = +rightWingLockerArm.value;
	currentAircraft.data.rwlockweight = rtWngLkrWt;
	currentAircraft.data.rwlockarm = rtWngLkrArm;
	let rtWngLkrMom = Math.round(rtWngLkrWt * rtWngLkrArm);
	rightWingLockerMoment.value = rtWngLkrMom;

	let lftWngLkrWt = +leftWingLockerWeight.value; 
	let lftWngLkrArm = +leftWingLockerArm.value;
	currentAircraft.data.leftWingLockerArm = lftWngLkrArm;
	currentAircraft.data.lwlockweight = lftWngLkrWt;
	let lftWngLkrMom = Math.round(lftWngLkrWt * lftWngLkrArm);
	leftWingLockerMoment.value = lftWngLkrMom;
	
	let fuelnums = calcFuel(); // returns [weight, moment]
	
	let rearBagWt = +rearBaggageWeight.value; 
	let rearBagArm = +rearBaggageArm.value;  
	currentAircraft.data.rbagweight = rearBagWt;
	currentAircraft.data.rbagarm = rearBagArm;
	let rearBagMom = +(rearBagWt * rearBagArm).toFixed(1);
	rearBaggageMoment.value = rearBagMom;
	
	let totalWtArray = [emptyWt, pltWt, psgrWt, rtWngLkrWt, lftWngLkrWt, fuelnums[0], rearBagWt];
	let totalArmArray = [emptyMom, pltMom, psgrMom, rtWngLkrMom, lftWngLkrMom , fuelnums[1], rearBagMom];
	let totalWt = addArrayElements(totalWtArray);
	let totalMom = addArrayElements(totalArmArray);
	let finalCog = +(totalMom / totalWt).toFixed(1);
	
	totalWeight.value = Math.round(totalWt);
	totalCog.value = `CG: ${finalCog}`;
	totalMoment.value = +totalMom.toFixed(2); 
	
	let cogtxt = `(${finalCog}, ${totalWt})`;
	mycog.innerHTML = cogtxt;
	accog.innerHTML = cogtxt.replace("(", "").replace(")", "");

	currentAircraft.setLoadedCG(+totalWeight.value, finalCog);

	drawChartDot();
	isLoading = false;
}

/**
 * Change colors of textboxes to match Weight & Balance 
 * condition, green if OK, red if overweight
 * @param {boolean} isoverweight 
 */
function applyTextColors(isoverweight) {
	let colors = appData.settings;
	if (!isoverweight) {
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

/**
 * Check if input is NaN and return zero if it is
 * @param {number} theNumber 
 * @returns {number}
 */
function handleNaN(theNumber) {
	var tn = 0;
	if (theNumber === "" || isNaN(theNumber)) {
		// do nothing
	} else {
		tn = +theNumber
	}
	return tn;
}

/**
 * Add up all the numbers in an array of numbers
 * @param {array} theArray 
 * @returns {number}
 */
function addArrayElements(theArray) {
	var outval = 0;
	theArray.forEach( val => {
		outval = !isNaN(val) ? outval + val : outval;
	});
	return outval;
}

/**
 * Draw a dot on the upper chart in position, then call 
 * drawAircraftDot with the calculated numbers
 * @param {number} weight 
 * @param {number} moment 
 */
function drawChartDot() {
	let ctx = chartcanvas.getContext('2d', { willReadFrequently: true });
	let rgba = ctx.getImageData(5,5,1,1).data
	let color; 
	let tcolor;
	let bgcolor;
	let fgcolor;
	let maxweight = currentAircraft.maxgross;
	let minweight = currentAircraft.mingross;
	let weight = currentAircraft.loadedWeight;
	let mincg = currentAircraft.mincg;
	let maxcg = currentAircraft.maxcg;
	let mom = currentAircraft.loadedMoment;
	let isoverwt = true;
	let x = 0;
	let y = 0;
	
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
	
	applyTextColors(isoverwt);

	chartDot.setAttribute("style", `height:14px;width:14px;border-radius:50%;position:absolute;top:${+y - 9}px;left:${+x - 5}px;background-color:${color};`);
	
	mycog.setAttribute("style", `font-size:x-small;color:${tcolor};position:absolute;top:${+y + 7}px;left:${+x - 25}px;width:fit-content`);
	
	let crosshair = document.getElementById("chartcrosshair");
	crosshair.setAttribute("style", "font-size:25px;position:relative;top:-6px;left:0px;color:white;")
	
	drawAircraftDot(weight, mom, bgcolor, fgcolor);
}

/**
 * Draw the appropriate colored dot in or around the rectangular 
 * area that is superimposed on the aircraft drawing
 * @param {number} weight 
 * @param {number} moment 
 * @param {color} bgcolor 
 * @param {color} fgcolor 
 */
function drawAircraftDot(weight, moment, bgcolor, fgcolor) {
	let rect = currentAircraft.boundingRect;
	let dot = currentAircraft.dot;
	let crosshair = currentAircraft.crosshair;
	let x;
	let y;

	try {

		x = plotX(rect, currentAircraft.maxcg, currentAircraft.mincg, moment);
		y = plotY(rect, currentAircraft.maxgross, currentAircraft.mingross, weight);

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

/**
 * Save aircraft state
 */
const saveAppData = function() {
	currentAircraft.save();
	saveButton.disabled = true;
}

/**
 * Print a screen shot
 */
const printScreen = function() {
	buttonBox.setAttribute("style", "visibility:hidden");
	setTimeout(() => window.electronAPI.printscreen(printpdf), 300);
}

/**
 * "Secret" developer mode counter, toggles dev mode on/off
 */
function countClicks() {
	clickcount++;
	if (clickcount === 10) {
		devstate.state = !appData.settings.debug;
		window.electronAPI.showdev(devstate);
	}
}

function exitApp() {
	window.electronAPI.exitapp();
}

/**
 * Theme changing handlers
 */
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

/**
 * This event is raised by the main process when user
 * selects an aircraft from the top menu
 */
window.electronAPI.onAircraftSelect((aircraft) => {
	currentAircraft.hide();
	appData.settings.currentview = aircraft;
	currentAircraft = aircraftList.get(aircraft);
	drawAllObjects();
});

/**
 * If user checks/unchecks the Print to PDF checkbox,
 * save that preference in the zodiacwb.json file
 * @param {object} checkbox 
 */
function togglePrintPDF(checkbox) {
	if (!isLoading) {
		printpdf = checkbox.checked;
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

