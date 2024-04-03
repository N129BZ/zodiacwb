"use strict";

var config = {};

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

window.onload = async () => {
	const cfg = await window.electronAPI.getconfig();
	console.log(cfg);
	config = JSON.parse(cfg);

	maxgross.value = config.maxgross;
	rmWt.value = config.rmweight;
	rmArm.value = config.rmarm;
	rmMoment.value = config.rmmoment;
	
	lmWt.value = config.lmweight;
	lmArm.value = config.lmarm;
	lmMoment.value = config.lmmoment;

	noseWt.value = config.nwweight;
	noseArm.value = config.nwarm;
	noseMoment.value = config.nwmoment;

	emptyWt.value = config.emptyweight;
	emptyCG.value = config.emptycg;
	emptyMoment.value = config.emptymoment;

	pilotWt.value = config.pilotweight;
	pilotArm.value = config.pilotarm;
	pilotMoment.value = config.pilotmoment;

	psgrWt.value = config.psgrweight;
	psgrArm.value = config.psgrarm;
	psgrMoment.value = config.psgrmoment;

	rwLockWt.value = config.rwlockweight;
	rwLockArm.value = config.rwlockarm;
	rwLockMoment.value = config.rwlockmoment;

	lwLockWt.value = config.lwlockweight;
	lwlockArm.value = config.lwlockarm;
	lwlockMoment.value = config.lwlockmoment;

	fuelGals.value = config.fuelgals;
	fuelWt.value = config.fuelweight;
	fuelArm.value = config.fuelarm;
	fuelMoment.value = config.fuelmoment;

	rbagWt.value = config.rbagweight;
	rbagArm.value = config.rbagarm;
	rbagMoment.value = config.rbagmoment;

	totalWt.value = config.emptyweight;
	totalCG.value = config.emptycg;
	totalMoment.value = config.emptymoment;

	calcWB(true);
};

const calcFuel = function() {
	let fgals = parseInt(fuelGals.value);
	let fwt =  fgals * 6;
	let fua = parseInt(fuelArm.value);
	let fum = fwt * fua; 
	fuelWt.value = fwt;
	fuelMoment.value = fum;
	config.fuelgals = fgals;
	config.fuelweight = fwt;
	config.fuelarm = fua;
	config.fuelmoment = fum;
	return [fwt, fum];
}

const calcWB = function(isOnLoad = false) {
	
	saveBtn.disabled = isOnLoad;

	let rmw = parseInt(rmWt.value);
	let rma = parseInt(rmArm.value);
	let rmm = rmw * rma;
	rmMoment.value = rmm;
	config.rmweight = rmw;
	config.rmarm = rma;
	config.rmmoment = rmm;

	let lmw = parseInt(lmWt.value)
	let lma = parseInt(lmArm.value);
	let lmm =  lmw * lma;
	lmMoment.value = lmm;
	config.lmweight = lmw;
	config.lmarm = lma;
	config.lmmoment = lmm;

	let nww = parseInt(noseWt.value);
	let nwa = parseInt(noseArm.value);
	let nwm = nww * nwa;
	noseMoment.value = nwm;
	config.nwweight = nww;
	config.nwarm = nwa;
	config.nwmoment = nwm;

	let ewt = + lmw + rmw + nww;
	let emom = lmm + rmm + nwm;
	let ecg = Math.round(emom / ewt);
	emptyWt.value = ewt;
	emptyCG.value = ecg;
	emptyMoment.value = emom; 
	config.emptyweight = ewt;
	config.emptycg = ecg;
	config.emptymoment = emom;
	
	let piw = parseInt(pilotWt.value); 
	let pia = parseInt(pilotArm.value);
	let pim = piw * pia;
	pilotMoment.value = pim;
	config.pilotweight = piw;
	config.pilotarm = pia;
	config.pilotmoment = pim;

	let paw = parseInt(psgrWt.value);
	let paa = parseInt(psgrArm.value);
	let pam = paw * paa; 
	psgrMoment.value = pam;
	config.psgrweight = paw;
	config.psgrarm = paa;
	config.psgrmoment = pam;

	let rwlw = parseInt(rwLockWt.value);
	let rwla = parseInt(rwLockArm.value);
	let rwlm = rwlw * rwla;
	rwLockMoment.value = rwlm;
	config.rwlockweight = rwlw;
	config.rwlockarm = rwla;
	config.rwlockmoment = rwlm;

	let lwlw = parseInt(lwLockWt.value); 
	let lwla = parseInt(lwlockArm.value);
	let lwlm = lwlw * lwla;
	lwlockMoment.value = lwlm;
	config.lwlockweight = lwlw;
	config.lwlockarm = lwla;
	config.lwlockmoment = lwlm;

	let fnums = calcFuel(); // returns [weight, moment]
	
	let rbw = parseInt(rbagWt.value); 
	let rba = parseInt(rbagArm.value);  
	let rbm = rbw * rba;
	rbagMoment.value = rbm;
	config.rbagweight = rbw;
	config.rbagarm = rba;
	config.rbagmoment = rbm;

	let twt = ewt + piw + paw + rwlw + lwlw + fnums[0] + rbw;
	let tmom = emom + pim + pam + rwlm + lwlm + fnums[1] + rbm;
	let tcg = Math.round(tmom / twt);
	totalWt.value = twt;
	totalCG.value = tcg;
	totalMoment.value = tmom; 
	config.totalweight = twt;
	config.totalcg = tcg;
	config.totalmoment = tmom;
	
	let cogtxt = `(${tcg}, ${twt})`
	cog.value = cogtxt;
	mycog.innerHTML = cogtxt;

	placeDot(tcg, twt);
}

const placeDot = function(acMoment, acWeight) {
	let color = "red";
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
		}
	}
	catch (error) {
		console.log(error.message)
	}
	finally { 
		let dot = document.getElementById("dot");
		dot.setAttribute("style", `height:10px;width:10px;border-radius:50%;position:absolute;top:${y-5}px;left:${x-5}px;background-color:${color};`);
		mycog.setAttribute("style", `font-size:x-small;visibility:visible;position:absolute;top:${y+10}px;left:${x-25}px;`);
	}
}

const saveConfig = function() {
	window.electronAPI.saveconfig(config);
	saveBtn.disabled = true;
}
