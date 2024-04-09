
placeDot(412, 1252);

function placeDot(acMoment, acWeight) {
	//const svg = document.getElementById("myairplane");
	const cgarea = document.getElementById("cgarea");
    const cgrect = cgarea.getBoundingClientRect();
	const momentfactor =  0.32216;
    const weightfactor = 0.2312;

    
    const left = cgrect.left;
    const top = cgrect.top + 40;
    const yAdjustedPos = weightfactor * (1320 - acWeight); 
    const xAdjustedPos = momentfactor * (450 - acMoment);
    const posX = left + xAdjustedPos;
    const posY = top + yAdjustedPos;
    console.log(`rect: L=${left}, T=${top}, posX=${posX}, posY: ${posY}`);
    var point = new DOMPoint(posX, posY,);
    
    // default to invalid w&b colors
    var color = "red";
	var tcolor = "red"; 
    
    if (acMoment <= 450 && acWeight <= 1320) {
        color = "#CCFF33";
        tcolor = "black";
    }           

    let dstyle = `height:10px;width:10px;border-radius:50%;position:absolute;top:${posY - 5}px;left:${posX - 5}px;background-color:${color};border-width:5px;"`;
	dot.setAttribute("style", dstyle);
}