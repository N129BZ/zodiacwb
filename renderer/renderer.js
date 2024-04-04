"use strict";

var appData = {};

const  saveBtn = document.getElementById("savebutton");
const  container = document.getElementById("container");
const  maxgross = document.getElementById("mgw"); 
const  mycog = document.getElementById("myplane");

const  lmWt = document.getElementById("lm"); 
const  lmArm = document.getElementById("lma");
const  lmMoment = document.getElementById("lmm");

const  rmWt = document.getElementById("rm") 
const  rmArm = document.getElementById("rma");
const  rmMoment = document.getElementById("rmm");

const  noseWt = document.getElementById("nw");
const  noseArm = document.getElementById("nwa");
const  noseMoment = document.getElementById("nwm"); 

const  emptyWt = document.getElementById("ewt"); 
const  emptyCG = document.getElementById("ecg");
const  emptyMoment = document.getElementById("emom"); 

const  pilotWt = document.getElementById("piw"); 
const  pilotArm = document.getElementById("pia");
const  pilotMoment = document.getElementById("pim");

const  psgrWt = document.getElementById("paw"); 
const  psgrArm = document.getElementById("paa");
const  psgrMoment = document.getElementById("pam");

const  rwLockWt = document.getElementById("rwl"); 
const  rwLockArm = document.getElementById("rwla"); 
const  rwLockMoment = document.getElementById("rwlm"); 

const  lwLockWt = document.getElementById("lwl");
const  lwlockArm = document.getElementById("lwla");
const  lwlockMoment = document.getElementById("lwlm");

const  fuelGals = document.getElementById("fig"); 
const  fuelWt = document.getElementById("fwt");
const  fuelArm = document.getElementById("fua"); 
const  fuelMoment = document.getElementById("fum"); 

const  rbagWt = document.getElementById("rb"); 
const  rbagArm = document.getElementById("rba"); 
const  rbagMoment = document.getElementById("rbm"); 

const  totalWt = document.getElementById("totwt"); 
const  totalCG = document.getElementById("totcg");
const  totalMoment = document.getElementById("totmom"); 
const  cog = document.getElementById("cog"); 
const  dot = document.getElementById("dot");

window.onload = async () => {
	const data = await window.electronAPI.getappdata();
	console.log(data);
	appData = JSON.parse(data);

	maxgross.value = appData.maxgross;
	rmWt.value = appData.rmweight;
	rmArm.value = appData.rmarm;
	rmMoment.value = appData.rmmoment;
	
	lmWt.value = appData.lmweight;
	lmArm.value = appData.lmarm;
	lmMoment.value = appData.lmmoment;

	noseWt.value = appData.nwweight;
	noseArm.value = appData.nwarm;
	noseMoment.value = appData.nwmoment;

	emptyWt.value = appData.emptyweight;
	emptyCG.value = appData.emptycg;
	emptyMoment.value = appData.emptymoment;

	pilotWt.value = appData.pilotweight;
	pilotArm.value = appData.pilotarm;
	pilotMoment.value = appData.pilotmoment;

	psgrWt.value = appData.psgrweight;
	psgrArm.value = appData.psgrarm;
	psgrMoment.value = appData.psgrmoment;

	rwLockWt.value = appData.rwlockweight;
	rwLockArm.value = appData.rwlockarm;
	rwLockMoment.value = appData.rwlockmoment;

	lwLockWt.value = appData.lwlockweight;
	lwlockArm.value = appData.lwlockarm;
	lwlockMoment.value = appData.lwlockmoment;

	fuelGals.value = appData.fuelgals;
	fuelWt.value = appData.fuelweight;
	fuelArm.value = appData.fuelarm;
	fuelMoment.value = appData.fuelmoment;

	rbagWt.value = appData.rbagweight;
	rbagArm.value = appData.rbagarm;
	rbagMoment.value = appData.rbagmoment;

	totalWt.value = appData.emptyweight;
	totalCG.value = appData.emptycg;
	totalMoment.value = appData.emptymoment;

	calcWB(true);
};

const calcFuel = function() {
	let fgals = parseInt(fuelGals.value);
	let fwt =  fgals * 6;
	let fua = parseInt(fuelArm.value);
	let fum = fwt * fua; 
	fuelWt.value = fwt;
	fuelMoment.value = fum;
	appData.fuelgals = fgals;
	appData.fuelweight = fwt;
	appData.fuelarm = fua;
	appData.fuelmoment = fum;
	return [fwt, fum];
}

const calcWB = function(isOnLoad = false) {
	
	saveBtn.disabled = isOnLoad;

	let rmw = parseInt(rmWt.value);
	let rma = parseInt(rmArm.value);
	let rmm = rmw * rma;
	rmMoment.value = rmm;
	appData.rmweight = rmw;
	appData.rmarm = rma;
	appData.rmmoment = rmm;

	let lmw = parseInt(lmWt.value)
	let lma = parseInt(lmArm.value);
	let lmm =  lmw * lma;
	lmMoment.value = lmm;
	appData.lmweight = lmw;
	appData.lmarm = lma;
	appData.lmmoment = lmm;

	let nww = parseInt(noseWt.value);
	let nwa = parseInt(noseArm.value);
	let nwm = nww * nwa;
	noseMoment.value = nwm;
	appData.nwweight = nww;
	appData.nwarm = nwa;
	appData.nwmoment = nwm;

	let ewt = + lmw + rmw + nww;
	let emom = lmm + rmm + nwm;
	let ecg = Math.round(emom / ewt);
	emptyWt.value = ewt;
	emptyCG.value = ecg;
	emptyMoment.value = emom; 
	appData.emptyweight = ewt;
	appData.emptycg = ecg;
	appData.emptymoment = emom;
	
	let piw = parseInt(pilotWt.value); 
	let pia = parseInt(pilotArm.value);
	let pim = piw * pia;
	pilotMoment.value = pim;
	appData.pilotweight = piw;
	appData.pilotarm = pia;
	appData.pilotmoment = pim;

	let paw = parseInt(psgrWt.value);
	let paa = parseInt(psgrArm.value);
	let pam = paw * paa; 
	psgrMoment.value = pam;
	appData.psgrweight = paw;
	appData.psgrarm = paa;
	appData.psgrmoment = pam;

	let rwlw = parseInt(rwLockWt.value);
	let rwla = parseInt(rwLockArm.value);
	let rwlm = rwlw * rwla;
	rwLockMoment.value = rwlm;
	appData.rwlockweight = rwlw;
	appData.rwlockarm = rwla;
	appData.rwlockmoment = rwlm;

	let lwlw = parseInt(lwLockWt.value); 
	let lwla = parseInt(lwlockArm.value);
	let lwlm = lwlw * lwla;
	lwlockMoment.value = lwlm;
	appData.lwlockweight = lwlw;
	appData.lwlockarm = lwla;
	appData.lwlockmoment = lwlm;

	let fnums = calcFuel(); // returns [weight, moment]
	
	let rbw = parseInt(rbagWt.value); 
	let rba = parseInt(rbagArm.value);  
	let rbm = rbw * rba;
	rbagMoment.value = rbm;
	appData.rbagweight = rbw;
	appData.rbagarm = rba;
	appData.rbagmoment = rbm;

	let twt = ewt + piw + paw + rwlw + lwlw + fnums[0] + rbw;
	let tmom = emom + pim + pam + rwlm + lwlm + fnums[1] + rbm;
	let tcg = Math.round(tmom / twt);
	totalWt.value = twt;
	totalCG.value = tcg;
	totalMoment.value = tmom; 
	appData.totalweight = twt;
	appData.totalcg = tcg;
	appData.totalmoment = tmom;
	
	let cogtxt = `(${tcg}, ${twt})`
	cog.value = cogtxt;
	mycog.innerHTML = cogtxt;

	placeDot(tcg, twt);
}

const placeDot = function(acMoment, acWeight) {
	let color = "red";
	let tcolor = "red";
	let svg = document.getElementById("wbcontainer");
	let path = document.getElementById("wbpath");
	let x = 0;
	let y = 0;
	try {
		let point = svg.createSVGPoint();
		x = Math.round(((185 * acMoment) / 455) * 1.685);
		y = 1322 - acWeight;
		point.x = x;
		point.y = y;
		
		console.log(`Point(${point.x},${point.y} is in fill area: ${path.isPointInFill(point)}`);

		if (path.isPointInFill(point)) {
			color = "limegreen";
			tcolor = "black";
		}
	}
	catch (error) {
		console.log(error.message)
	}
	
	let dstyle = `height:10px;width:10px;border-radius:50%;position:absolute;top:${y-5}px;left:${x-5}px;background-color:${color};`
	let cstyle = `font-size:x-small;color:${tcolor};visibility:visible;position:absolute;top:${y+10}px;left:${x-25}px;`;
	dot.setAttribute("style", dstyle);
	mycog.setAttribute("style", cstyle);
}

const saveAppData = function() {
	window.electronAPI.saveappdata(appData);
	saveBtn.disabled = true;
}