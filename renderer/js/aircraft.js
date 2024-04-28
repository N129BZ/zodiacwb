

class Aircraft {
    constructor (name, actype, appdata) {
        this.name = name;
        this.appData = appdata;
        this.jsondata = this.#assignData();
        this.aircraftTitle = document.getElementById("aircraftTitle");
        this.view = document.getElementById(`${name}view`);
        this.canvas = document.getElementById(`${name}canvas`);
        this.rectangle = document.getElementById(`${name}rectangle`); 
        this.dot = document.getElementById(`${name}dot`);
		this.crosshair = document.getElementById(`${name}crosshair`)
        this.weightMin = document.getElementById("weightMin");   		
        this.weightNgStart = document.getElementById("weightNgStart"); 		
        this.weightMaxGross = document.getElementById("weightMaxGross"); 
        this.maxGrossDashes = document.getElementById("maxGrossDashes")
        this.weightMaxFloats = document.getElementById("weightMaxFloats"); 
        this.maxFloatsDashes = document.getElementById("maxFloatsDashes")
        this.maxGrossWeight = document.getElementById("maxGrossWeight"); 		
        this.momentMin = document.getElementById("momentMin"); 			
        this.momentMax = document.getElementById("momentMax"); 			
        this.weightAxis = document.getElementById("weightAxis");
        this.momentAxis = document.getElementById("momentAxis");
        this.fuelUnitLabel = document.getElementById("fuelUnitLabel");
        this.nosegearLimit = document.getElementById("nosegearLimit");
        this.ismetric = this.jsondata.units === "metric";
        this.data = this.ismetric ? this.jsondata.metric : this.jsondata.imperial;
        this.aircraftType = actype;
        this.moment = 0;
        this.weight = 0;
        this.hide();
    }

    #assignData() {
        switch (this.name) {
            case "ch650": return this.appData.ch650;
            case "ch650td": return this.appData.ch650td;
            case "ch701": return this.appData.ch701;
            case "ch750": return this.appData.ch750;
            case "chCruzer": return this.appData.chCruzer;
            case "rv9a": return this.appData.rv9a;
            case "rv9": return this.appData.rv9;
        }
    }

    save() {
        if (this.ismetric) {
            this.jsondata.metric = this.data;
        } else {
            this.jsondata.imperial = this.data;
        } 
        switch (this.name) {
            case "ch650": 
                this.appData.ch650 = this.jsondata;
                break;
            case "ch650td": 
                this.appData.ch650td = this.jsondata;
                break;
            case "ch701": 
                this.appData.ch701 = this.jsondata;
                break;
            case "ch750": 
                this.appData.ch750 = this.jsondata;
                break;
            case "chCruzer": 
                this.appData.chCruzer = this.jsondata;
                break;
            case "rv9a": 
                this.appData.rv9a = this.jsondata;
                break;
            case "rv9": 
                this.appData.rv9 = this.jsondata;
                break;
        }
        window.electronAPI.saveappdata(this.appData);
    }

    setLoadedCG(weight, moment) {
        this.weight = weight;
        this.moment = moment;
    }

    get loadedWeight() {
        return this.weight;
    }

    get loadedMoment() {
        return this.ismetric ? this.moment : Math.round(this.moment * 25.4)
    }

    get boundingRect() {
        return this.rectangle.getBoundingClientRect();
    }

    get rectClassName() {
        return `${this.name}rectangle`;
    }

    get lightImage() {
        return `img/${this.name}_light.png`;
    }

    get darkImage() {
        return `img/${this.name}_dark.png`;
    }

    get chartImage() {
        return this.aircraftType === 1 ? "img/bevelChart.png" : "img/noBevelChart.png"
    }

    get hideWL() {
        return (this.name !== "ch650" || this.name !== "ch650td"); 
    }

    get nwtext() {
        return (this.name === "ch650td" || this.name === "rv9") ? "Tail Wheel:" : "Nose Wheel:";
    }

    get ngstart() {
        return this.data.ngstart;
    }

    get mincg() {
        var output = this.ismetric ? this.data.mincg : Math.round(this.data.mincg * 25.4);
        return output;
    }
    get maxcg() {
        var output = this.ismetric ? this.data.maxcg : Math.round(this.data.maxcg * 25.4);
        return output;
    }

    get mingross() {
       return this.data.mingross;
    }

    get maxgross() {
        return this.data.maxgross;
    }

    get maxfloats() {
        return this.data.maxfloats;
    }

    setLabels() {
        // clear any old values from labels
        this.weightMaxFloats.innerHTML = "";
        this.maxFloatsDashes.innerHTML = "";
        this.maxGrossDashes.innerHTML = "";
        this.weightNgStart.innerHTML = "";
        this.nosegearLimit.innerHTML = "";
        this.weightMin.innerHTML = this.mingross;
        this.weightMaxGross.innerHTML = this.maxgross;
        this.maxGrossWeight.value = this.maxgross;
        switch (this.aircraftType) { 
			case 1:
				this.maxFloatsDashes.innerHTML = "&nbsp;Max floats --------------------------------------------";
				this.maxGrossDashes.innerHTML = "&nbsp;&nbsp;Max gross ---------";
				this.weightNgStart.innerHTML = this.ngstart;
				this.nosegearLimit.innerHTML = "Nose gear structural limit";
				if (this.ismetric) {
					// adjust attributes for metric units
					this.weightMaxFloats.innerHTML = this.maxfloats;  
					this.momentMin.className = "momentMinMetric";
					this.momentMax.className = "momentMaxMetric";
					this.weightAxis.className = "weightAxisMetric";
					this.weightAxis.innerHTML = "Weight (kilograms)";
					this.fuelUnitLabel.innerHTML = "Fuel in Liters:";
					this.momentMin.innerHTML = this.mincg;
					this.momentMax.innerHTML = this.maxcg;
					this.momentAxis.innerHTML = "Acceptable CG Range (millimeters)";
				} else  {
					// adjust attributes for imperial units
					this.weightMaxFloats.innerHTML = this.maxfloats; 
					this.momentMin.className = "momentMinImperial";
					this.momentMax.className = "momentMaxImperial";
					this.weightAxis.className = "weightAxisImperial";
					this.weightAxis.innerHTML = "Weight (pounds)";
					this.fuelUnitLabel.innerHTML = "Fuel in Gallons:";
					this.momentMin.innerHTML = this.mincg;
					this.momentMax.innerHTML = this.maxcg;
					this.momentAxis.innerHTML = "Acceptable CG Range (inches)";
				}
				break;
			case 2:
				if (currentAircraft.ismetric) {
					// adjust attributes for metric units
					this.weightMaxFloats.innerHTML = "";  
					this.momentMin.className = "momentMinMetric";
					this.momentMax.className = "momentMaxMetric";
					this.weightAxis.className = "weightAxisMetric";
					this.weightAxis.innerHTML = "Weight (kilograms)";
					this.fuelUnitLabel.innerHTML = "Fuel in Liters:";
					this.momentMin.innerHTML = this.mincg;
					this.momentMax.innerHTML = this.maxcg;
					this.momentAxis.innerHTML = "Acceptable CG Range (millimeters)";
				} else  {
					// adjust attributes for imperial units
					this.weightMaxFloats.innerHTML = ""; 
					this.momentMin.className = "momentMinImperial";
					this.momentMax.className = "momentMaxImperial";
					this.weightAxis.className = "weightAxisImperial";
					this.weightAxis.innerHTML = "Weight (pounds)";
					this.fuelUnitLabel.innerHTML = "Fuel in Gallons:";
					this.momentMin.innerHTML = this.mincg;
					this.momentMax.innerHTML = this.maxcg;
					this.momentAxis.innerHTML = "Acceptable CG Range (inches)";
				}
				break;
			case 3:
				this.momentMin.className = "momentMinImperial";
				this.momentMax.className = "momentMaxImperial";
				this.weightAxis.className = "weightAxisImperial";
				this.weightAxis.innerHTML = "Weight (pounds)";
				this.fuelUnitLabel.innerHTML = "Fuel in Gallons:";
				this.momentMin.innerHTML = this.mincg;
				this.momentMax.innerHTML = this.maxcg
				this.momentAxis.innerHTML = "Acceptable CG Range (inches)";
				break;
		}
    }

    setData(jsondata) {
        this.jsondata = jsondata;
        this.ismetric = jsondata.units === "metric";
    }
    

    toggleUOM() {
        this.ismetric = !this.ismetric;
        data.units = this.ismetric ? "metric" : "imperial";
    }

    show() {
        var title = "";
        if (this.name.search("ch") > -1) {
            if (this.name === "chCruzer") {
                title = "Zenith ch750 CruZer";
            } else if (this.name === "ch650td") {
                title = `Zenith ch6xx Tail Dragger`;
            } else {
                title = `Zenith ${this.name}`;
            }
        } else {
            title = `Vans ${this.name.toUpperCase()}`;
        }    
        this.aircraftTitle.innerHTML = title;
        this.appData.currentview = this.name;
        this.view.setAttribute("style", "visibility:visible;");
    } 

    hide() {
        this.view.setAttribute("style", "visibility:hidden;");
    }
}