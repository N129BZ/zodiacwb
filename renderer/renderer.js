"use strict";


var appData = {};
var valData = {};
var devstate = { "state": false };
var clickcount = 0;
var usemetric = false;
var isdarktheme = false; 
var ismainview = true;

const  weightMap = new Map();
const  momentMap = new Map();

const  mainview = document.getElementById("mainview");
const  acview = document.getElementById("acview");
const  convertview = document.getElementById("convertview");
const  accanvas = document.getElementById("accanvas");
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
	isdarktheme = appData.settings.theme === "dark";

	if (appData.settings.units === "metric") {
		valData = appData.metric;
	}
	else if (appData.settings.units === "imperial") {
		valData = appData.imperial;
	}

	setBoundaryLabels();

	rightMainWeight.value = valData.rmweight;
	rightMainArm.value = valData.rmarm;
	
	leftMainWeight.value = valData.lmweight;
	leftMainArm.value = valData.lmarm;
	
	noseWheelWeight.value = valData.nwweight;
	noseWheelArm.value = valData.nwarm;
	
	emptyArm.value = valData.emptyarm;
	
	pilotWeight.value = valData.pilotweight;
	pilotArm.value = valData.pilotarm;
	
	passengerWeight.value = valData.psgrweight;
	passengerArm.value = valData.psgrarm;
	
	rightWingLockerWeight.value = valData.rwlockweight;
	rightWingLockerArm.value = valData.lwlockarm;
	
	leftWingLockerWeight.value = valData.lwlockweight;
	leftWingLockerArm.value = valData.lwlockarm;
	
	fuelUnits.value = valData.fuelunits;
	fuelArm.value = valData.fuelarm;
	
	rearBaggageWeight.value = valData.rbagweight;
	rearBaggageArm.value = valData.rbagarm;
	
	drawChart();
	drawAirplane();
	loadCgMaps();
	calcWB(true);
};

function drawChart() {
	const ctx = chartcanvas.getContext("2d");
	var img = new Image(); 
	img.onload = function() {
		ctx.drawImage(img, 0, 0); 
	}
	img.src = "chart.png";
}

function drawAirplane() {
	const lbl = document.getElementById("accoglabel");	 
	const apctx = accanvas.getContext("2d");
	var apimg = new Image();
	apimg.onload = function() {
		apctx.drawImage(apimg, 0, 0);
	}
	if (isdarktheme) {
		apimg.src = "airplane_dark.png";
		lbl.setAttribute("style", "color:white;")
	}
	else {
		apimg.src = "airplane.png"
		lbl.setAttribute("style", "color:black;")
	}
}

const calcFuel = function() {
	let fuelunits = handleNaN(fuelUnits.value);
	let fuelwt =  usemetric ? fuelunits * 0.79 : fuelunits * 6;
	fuelWeight.value = fuelwt;
	let fuelarm = handleNaN(fuelArm.value);
	let fuelmom = fuelwt * fuelarm; 
	fuelMoment.value = Math.round(fuelmom);
	valData.fuelunits = fuelunits;
	valData.fuelweight = fuelwt;
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
	
	let lftMainmWt = handleNaN(leftMainWeight.value)
	let lftMainArm = handleNaN(leftMainArm.value);
	let lftMainMom =  lftMainmWt * lftMainArm;
	leftMainMoment.value = lftMainMom;
	valData.lmweight = lftMainmWt;
	valData.lmarm = lftMainArm;
	
	let noseWhlWt = handleNaN(noseWheelWeight.value);
	let noseWhlArm = handleNaN(noseWheelArm.value);
	let noseWhlMom = noseWhlWt * noseWhlArm;
	noseWheelMoment.value = noseWhlMom;
	valData.nwweight = noseWhlWt;
	valData.nwarm = noseWhlArm;
	
	let emptyWt = + lftMainmWt + rtMainWt + noseWhlWt;
	let emptyMom = lftMainMom + rtMainMom + noseWhlMom;
	let emptyCg = Math.round(handleNaN(emptyMom / emptyWt));
	emptyWeight.value = emptyWt;
	emptyArm.value = `CG: ${emptyCg}`;
	emptyMoment.value = emptyMom; 
	
	let pltWt = handleNaN(pilotWeight.value); 
	let pltArm = handleNaN(pilotArm.value);
	let pltMom = pltWt * pltArm;
	pilotMoment.value = pltMom;
	valData.pilotweight = pltWt;
	
	let psgrWt = handleNaN(passengerWeight.value);
	let psgrArm = handleNaN(passengerArm.value);
	let psgrMom = psgrWt * psgrArm; 
	passengerMoment.value = psgrMom;
	valData.psgrweight = psgrWt;
	
	let rtWngLkrWt = handleNaN(rightWingLockerWeight.value);
	let rtWngLkrArm = handleNaN(rightWingLockerArm.value);
	let rtWngLkrMom = rtWngLkrWt * rtWngLkrArm;
	rightWingLockerMoment.value = rtWngLkrMom;
	valData.rwlockweight = rtWngLkrWt;
	
	let lftWngLkrWt = handleNaN(leftWingLockerWeight.value); 
	let lftWngLkrArm = handleNaN(leftWingLockerArm.value);
	let lftWngLkrMom = lftWngLkrWt * lftWngLkrArm;
	leftWingLockerMoment.value = lftWngLkrMom;
	valData.lwlockweight = lftWngLkrWt;
	
	let fuelnums = calcFuel(); // returns [weight, moment]
	
	let rearBgWt = handleNaN(rearBaggageWeight.value); 
	let rearBgArm = handleNaN(rearBaggageArm.value);  
	let rearBgMom = rearBgWt * rearBgArm;
	rearBaggageMoment.value = rearBgMom;
	valData.rbagweight = rearBgWt;
	
	let totalWtArray = [emptyWt, pltWt, psgrWt, rtWngLkrWt, lftWngLkrWt, fuelnums[0], rearBgWt];
	let totalArmArray = [emptyMom, pltMom, psgrMom, rtWngLkrMom, lftWngLkrMom , fuelnums[1], rearBgMom];
	let totalWt = addArray(totalWtArray);
	let totalMom = addArray(totalArmArray);
	let finalCog = Math.round(handleNaN(totalMom / totalWt));
	
	totalWeight.value = Math.round(totalWt);
	totalCog.value = `CG: ${Math.round(finalCog)}`;
	totalMoment.value = Math.round(totalMom); 
	
	let cogtxt = `(${Math.round(finalCog)}, ${Math.round(totalWt)})`;
	mycog.innerHTML = cogtxt;
	accog.innerHTML = cogtxt.replace("(", "").replace(")", "");
	placeDots(totalWt, finalCog);
}

// change colors of textboxes to match condition
function applyTextColors(isoverwt) {
	let colors = appData.settings;
	if (!isoverwt) {
		totalWeight.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		totalCog.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		totalMoment.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
		cog.setAttribute("style", `color:${colors.underfgcolor};background-color:${colors.underbgcolor};`);
	} 
	else {
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

function loadCgMaps() {
	let rect = chartcanvas.getBoundingClientRect();
	let pospx = -100;
	let mompx = 48;

	for (let w = 1500; w >= 720; w--) {
		weightMap.set(w, pospx.toFixed(3));
		pospx += .6;
	}
	for (let m = 270; m <= 455; m++) {
		momentMap.set(m, mompx.toFixed(3));
		mompx += 2;
	}
}

function placeDots(weight, moment) {
	let color = appData.settings.overbgcolor;
	let tcolor = appData.settings.overbgcolor;
	let bgcolor = appData.settings.overbgcolor;
	let fgcolor = appData.settings.overfgcolor;
	let x = 0;
	let y = 0;
	let isoverwt = true;
	let mom = Math.round(moment);
	
	x = momentMap.get(mom); 
	
	try {
		if (usemetric) {
			// apply metric conversion to weight 
			weight = Math.round(+weight * 2.205) - 2;
			y = weightMap.get(weight); 
		}
		else {
			y = weightMap.get(weight) - 5; 
		}
		try {
			let rgba = chartcanvas.getContext('2d', { willReadFrequently: true }).getImageData(x,y,1,1).data
			if ((weight <= 1320 && weight >= 720) && (moment >= 270 && moment <= 455)) {
				if ((rgba[0] === 221 && rgba[1] === 238 && rgba[2] === 235) || 
				    (rgba[0] === 0 && rgba[1] === 0 && rgba[2] === 0)) { // on the black border line counts!!
					color = appData.settings.underbgcolor;
					tcolor = appData.settings.underbgcolor;
					bgcolor = appData.settings.underbgcolor;;
					fgcolor = appData.settings.underfgcolor;
					isoverwt = false;
				}
				console.log("point is on the chart!");
			}
		}
		catch {
			console.log("point is NOT on the chart!");
		}
		applyTextColors(isoverwt);
		
	}
	catch (error) {
		console.log(error.message);
	}

	if (usemetric) {
		y -= 6
	}
	chartDot.setAttribute("style", `height:14px;width:14px;border-radius:50%;position:absolute;top:${+y - 9}px;left:${+x - 5}px;background-color:${color};`);
	mycog.setAttribute("style", `font-size:x-small;color:${tcolor};position:absolute;top:${+y + 7}px;left:${+x - 25}px;`);
    
	let crosshair = document.getElementById("chartcrosshair");
	crosshair.setAttribute("style", "font-size:25px;position:relative;top:-6px;left:0px;color:white;")
	
	placeAcDot(weight, moment, bgcolor, fgcolor);
}

function placeAcDot(weight, moment, bgcolor, fgcolor) {
	let yFactor = .2533;
	let xFactor = .3027;
	let rect = document.getElementById("cgrectangle").getBoundingClientRect();
	let xx = 455 - moment; //moment * xFactor; // * xFactor; // - rect.width ;
	let x = (xx * xFactor) - 8;
	let y = (rect.height - ((weight - 600) * yFactor)) + 10; 
	acDot.setAttribute("style", `height:7px;width:7px;border-radius:50%;position:relative;top:${y}px;` +
	                            `left:${x}px;background-color:${bgcolor};` + 
								`padding:4px;border:2px; ${fgcolor};`);
	let crosshair = document.getElementById("crosshair");
	crosshair.setAttribute("style", "font-size:29px;position:relative;top:-13px;left:-5px;color:white;")

	accog.setAttribute("style", `background-color:${bgcolor};color:${fgcolor};`);
}

const saveAppData = function() {
	window.electronAPI.saveappdata(appData);
	saveButton.disabled = true;
}

const printScreen = function() {
	buttonBox.setAttribute("style", "visibility:hidden");
	setTimeout(() => window.electronAPI.printscreen(), 200);
	setTimeout(() => buttonBox.setAttribute("style", "visibility:visible"), 200);
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

function exitApp() {
	window.electronAPI.exitapp();
}

function setButtonVisibility(isvisible) {
	let vstring = isvisible === true ? "visibility:visible" : "visibility:hidden";
	saveButton.setAttribute("style", vstring);
	showAcButton.setAttribute("style", vstring);
	exitButton.setAttribute("style", vstring);
}

window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change',({ matches }) => {
    if (matches) {
		isdarktheme = false;
		appData.settings.theme = "light";	
	}
	drawChart();
	drawAirplane();
	saveAppData();		
});


window.matchMedia('(prefers-color-scheme: dark)') 
		.addEventListener('change', ({ matches }) => {
	if(matches) {
		isdarktheme = true;
		appData.settings.theme = "dark";
	}
	drawChart();
	drawAirplane();
	saveAppData();		
});

function calcMM(element) {
	console.log(element.id, element.value);
	let ids = `${element.id}`.split("-");
	let rte = document.getElementById(`rightval-${ids[1]}`);
	rte.value = Math.round(element.value * 25.4);
}

window.electronAPI.onConvertUnits((unit) => {
	let cl = document.getElementById("convertlabel");
	if (unit === "inches") {
		cl.innerText ="Enter inches to convert to millimeters";
		acview.setAttribute("style", "visibility:hidden");
		mainview.setAttribute("style", "visibility:hidden");
		container.setAttribute("style", "visibility:hidden");
		convertview.setAttribute("style", "visibility:visible");
	} else {
		cl.innerText ="Enter pounds to convert to kilograms";
	}

});

// document.onmousedown = function(event){
// 	alert("clientX: " + event.clientX + " - clientY: " + event.clientY);
// }