"use strict";

var appData = {};
var valData = {};
var devstate = { "state": false };
var clickcount = 0;
var usemetric = false;

const kgfactor = 0.453592;
const mmfactor = 25.4;

const  saveButton = document.getElementById("saveButton");
const  container = document.getElementById("container");
const  mycog = document.getElementById("mycog");

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
const  emptyCog = document.getElementById("emptyArm");
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
const  dot = document.getElementById("dot");

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

function setBoundaryLabels() {

	weightMin.innerHTML = valData.mingross;
	weightNosegearMin.innerHTML = valData.ngstart;
	weightMaxGross.innerHTML = valData.maxgross;
	weightMaxFloats.innerHTML = valData.maxfloats;
	maxGrossWeight.value = valData.maxgross;

	if (usemetric) {
		// adjust attributes for metric units
		weightMaxFloats.innerHTML = valData.maxfloats;  
		maxGrossDashes.innerHTML = "- Max gross kg ------";
		maxFloatsDashes.innerHTML = "- Max floats kg -----------------------------------------";
		momentMin.className = "momentMinMetric";
		momentMax.className = "momentMaxMetric";
		weightAxis.className = "weightAxisMetric";
		weightAxis.innerHTML = "Weight (kilograms)";
		fuelUnitLabel.innerHTML = "Fuel in Liters:";
		momentMin.innerHTML = `|&nbsp;&nbsp;${valData.mincg}`;
		momentMax.innerHTML = `${valData.maxcg}&nbsp;&nbsp;|`
		momentAxis.innerHTML = "Acceptable CG Range (millimeters)";
	}
	else {
		// adjust attributes for imperial units
		weightMaxFloats.innerHTML = valData.maxfloats;
		maxGrossDashes.innerHTML = "- Max gross lb ------";
		maxFloatsDashes.innerHTML = "- Max floats lb -----------------------------------------";
		momentMin.className = "momentMinImperial";
		momentMax.className = "momentMaxImperial";
		weightAxis.className = "weightAxisImperial";
		weightAxis.innerHTML = "Weight (pounds)";
		fuelUnitLabel.innerHTML = "Fuel in Gallons:";
		momentMin.innerHTML = `|&nbsp;&nbsp;${valData.mincg}`;
		momentMax.innerHTML = `${valData.maxcg}&nbsp;&nbsp;|`
		momentAxis.innerHTML = "Acceptable CG Range (inches)";
	}
}

window.onload = async () => {
	const data = await window.electronAPI.getappdata();
	console.log(data);
	appData = JSON.parse(data);
	usemetric = appData.settings.units === "metric";
	if (appData.settings.units === "metric") {
		valData = appData.metric;
	}
	else if (appData.settings.units === "imperial") {
		valData = appData.imperial;
	}

	setBoundaryLabels();

	rightMainWeight.value = valData.rmweight;
	rightMainArm.value = valData.rmarm;
	rightMainMoment.value = valData.rmmoment;
	rightMainMoment.setAttribute("readonly", "readonly");

	leftMainWeight.value = valData.lmweight;
	leftMainArm.value = valData.lmarm;
	leftMainMoment.value = valData.lmmoment;
	leftMainMoment.setAttribute("readonly", "readonly");

	noseWheelWeight.value = valData.nwweight;
	noseWheelArm.value = valData.nwarm;
	noseWheelMoment.value = valData.nwmoment;
	noseWheelMoment.setAttribute("readonly", "readonly");

	emptyWeight.value = valData.emptyweight;
	emptyCog.value = valData.emptyarm;
	emptyMoment.value = valData.emptymoment;
	emptyMoment.setAttribute("readonly", "readonly");
	
	pilotWeight.value = valData.pilotweight;
	pilotArm.value = valData.armpilot;
	pilotArm.setAttribute("readonly", "readonly");
	pilotMoment.value = valData.pilotmoment;

	passengerWeight.value = valData.psgrweight;
	passengerArm.value = valData.armpsgr;
	passengerArm.setAttribute("readonly", "readonly");
	passengerMoment.value = appData.psgrmoment;

	rightWingLockerWeight.value = valData.rwlockweight;
	rightWingLockerArm.value = valData.armlwlock;
	rightWingLockerArm.setAttribute("readonly", "readonly");
	rightWingLockerMoment.value = valData.rwlockmoment;

	leftWingLockerWeight.value = valData.lwlockweight;
	leftWingLockerArm.value = valData.armlwlock;
	leftWingLockerArm.setAttribute("readonly", "readonly");
	leftWingLockerMoment.value = valData.lwlockmoment;

	fuelUnits.value = valData.fuelunits;
	fuelArm.value = valData.armfuel;
	fuelArm.setAttribute("readonly", "readonly");
	fuelMoment.value = valData.fuelmoment;

	rearBaggageWeight.value = valData.rbagweight;
	rearBaggageArm.value = valData.armbag;
	rearBaggageArm.setAttribute("readonly", "readonly");
	rearBaggageMoment.value = valData.rbagmoment;

	totalWeight.value = valData.emptyweight;
	totalCog.value = valData.emptyarm;
	totalMoment.value = valData.emptymoment;

	calcWB(true);
};

const calcFuel = function() {
	let fuelunits = handleNaN(fuelUnits.value);
	let fuelwt =  usemetric ? fuelunits * 0.79 : fuelunits * 6;
	let fuelarm = handleNaN(fuelArm.value);
	let fuelmom = fuelwt * fuelarm; 
	fuelMoment.value = Math.round(fuelmom);
	valData.fuelunits = fuelunits;
	valData.fuelweight = fuelwt;
	valData.fuelarm = fuelarm;
	valData.fuelmoment = Math.round(fuelmom);
	return [fuelwt, fuelmom];
}

const calcWB = function(isOnLoad = false) {
	
	saveButton.disabled = isOnLoad;

	let rtMainWt = handleNaN(rightMainWeight.value);
	let rtMainArm = handleNaN(rightMainArm.value);
	let rtMainMom = rtMainWt * rtMainArm;
	rightMainMoment.value = rtMainMom;
	valData.rmweight = rtMainWt;
	valData.rmarm = rtMainArm;
	valData.rmmoment = rtMainMom;

	let lftMainmWt = handleNaN(leftMainWeight.value)
	let lftMainArm = handleNaN(leftMainArm.value);
	let lftMainMom =  lftMainmWt * lftMainArm;
	leftMainMoment.value = lftMainMom;
	valData.lmweight = lftMainmWt;
	valData.lmarm = lftMainArm;
	valData.lmmoment = lftMainMom;

	let noseWhlWt = handleNaN(noseWheelWeight.value);
	let noseWhlArm = handleNaN(noseWheelArm.value);
	let noseWhlMom = noseWhlWt * noseWhlArm;
	noseWheelMoment.value = noseWhlMom;
	valData.nwweight = noseWhlWt;
	valData.nwarm = noseWhlArm;
	valData.nwmoment = noseWhlMom;

	let emptyWt = + lftMainmWt + rtMainWt + noseWhlWt;
	let emptyMom = lftMainMom + rtMainMom + noseWhlMom;
	let emptyCg = Math.round(handleNaN(emptyMom / emptyWt));
	emptyWeight.value = emptyWt;
	emptyCog.value = `COG: ${emptyCg}`;
	emptyMoment.value = emptyMom; 
	valData.emptyweight = emptyWt;
	valData.emptycog = emptyCg;
	valData.emptymoment = emptyMom;
	
	let pltWt = handleNaN(pilotWeight.value); 
	let pltArm = handleNaN(pilotArm.value);
	let pltMom = pltWt * pltArm;
	pilotMoment.value = pltMom;
	valData.pilotweight = pltWt;
	valData.pilotarm = pltArm;
	valData.pilotmoment = pltMom;

	let psgrWt = handleNaN(passengerWeight.value);
	let psgrArm = handleNaN(passengerArm.value);
	let psgrMom = psgrWt * psgrArm; 
	passengerMoment.value = psgrMom;
	valData.psgrweight = psgrWt;
	valData.psgrarm = psgrArm;
	valData.psgrmoment = psgrMom;

	let rtWngLkrWt = handleNaN(rightWingLockerWeight.value);
	let rtWngLkrArm = handleNaN(rightWingLockerArm.value);
	let rtWngLkrMom = rtWngLkrWt * rtWngLkrArm;
	rightWingLockerMoment.value = rtWngLkrMom;
	valData.rwlockweight = rtWngLkrWt;
	valData.rwlockarm = rtWngLkrArm;
	valData.rwlockmoment = rtWngLkrMom;

	let lftWngLkrWt = handleNaN(leftWingLockerWeight.value); 
	let lftWngLkrArm = handleNaN(leftWingLockerArm.value);
	let lftWngLkrMom = lftWngLkrWt * lftWngLkrArm;
	leftWingLockerMoment.value = lftWngLkrMom;
	valData.lwlockweight = lftWngLkrWt;
	valData.lwlockarm = lftWngLkrArm;
	valData.lwlockmoment = lftWngLkrMom;

	let fuelnums = calcFuel(); // returns [weight, moment]
	
	let rearBgWt = handleNaN(rearBaggageWeight.value); 
	let rearBgArm = handleNaN(rearBaggageArm.value);  
	let rearBgMom = rearBgWt * rearBgArm;
	rearBaggageMoment.value = rearBgMom;
	valData.rbagweight = rearBgWt;
	valData.rbagarm = rearBgArm;
	valData.rbagmoment = rearBgMom;

	let totalWtArray = [emptyWt, pltWt, psgrWt, rtWngLkrWt, lftWngLkrWt, fuelnums[0], rearBgWt];
	let totalArmArray = [emptyMom, pltMom, psgrMom, rtWngLkrMom, lftWngLkrMom , fuelnums[1], rearBgMom];
	let totalWt = addArray(totalWtArray);
	let totalMom = addArray(totalArmArray);
	let finalCog = Math.round(handleNaN(totalMom / totalWt));
	
	totalWeight.value = Math.round(totalWt);
	totalCog.value = `COG: ${Math.round(finalCog)}`;
	totalMoment.value = Math.round(totalMom); 
	valData.totalweight = Math.round(totalWt);
	valData.totalcog = Math.round(finalCog);
	valData.totalmoment = Math.round(totalMom);
	
	let cogtxt = `(${Math.round(finalCog)}, ${Math.round(totalWt)})`
	cog.value = cogtxt;
	mycog.innerHTML = cogtxt;

	placeDot(finalCog, totalWt);
}

// change colors of textboxes to match condition
function applyTextColors(acWeight) {
	let colors = appData.settings;
	if (acWeight > valData.maxgross) {
		totalWeight.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		totalCog.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		totalMoment.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
		cog.setAttribute("style", `color:${colors.overfgcolor};background-color:${colors.overbgcolor};`);
	} 
}

function handleNaN(theNumber) {
	var tv = 0;
	if (theNumber === "" || isNaN(theNumber)) {
		// do nothing
	} else {
		tv = parseInt(theNumber)
	}
	return tv;
}

function addArray(theArray) {
	var outval = 0;
	theArray.forEach( val => {
		outval = !isNaN(val) ? outval + val : outval;
	});
	return outval;
}

function placeDot(moment, weight) {
	let color = "red";
	let tcolor = "red";
	let svg = document.getElementById("chart");
	let cgarea = document.getElementById("path");
	let x = 0;
	let y = 0;
	let xr = Math.round(moment);
	let yr = Math.round(weight);
	
	try {
		let point = svg.createSVGPoint();
		x = Math.round(((185 * moment) / 455) * 1.685);
		y = 1322 - weight;
		point.x = x;
		point.y = y;

		console.log(`Point(${point.x},${point.y} is in fill area: ${path.isPointInFill(point)}`);

		// don't use textbox color for the dot - it's either red or green
		if (cgarea.isPointInFill(point)) {
			color = "limegreen";
			tcolor = "black";
		}
	}
	catch (error) {
		console.log(error.message);
	}

	let dstyle = `height:10px;width:10px;border-radius:50%;position:absolute;top:${y - 5}px;left:${x - 5}px;background-color:${color};`;
	let cstyle = `font-size:x-small;color:${tcolor};visibility:visible;position:absolute;top:${y + 10}px;left:${x - 25}px;`;
	dot.setAttribute("style", dstyle);
	mycog.setAttribute("style", cstyle);

	applyTextColors(weight);
}

const saveAppData = function() {
	window.electronAPI.saveappdata(appData);
	saveButton.disabled = true;
}

function countClicks() {
	clickcount++;
	console.log(`clickcount: ${clickcount}`);
	if (clickcount === 10) {
		devstate.state = !appData.settings.debug;
		saveAppData();
		showDev();
	}
}

const showDev = function() {
	window.electronAPI.showdev(devstate);
}