define(function () {
    var BrewMath = {

        /**
         * Converts a brix reading to specific gravity using original gravity
         */
        brixToSg: function (brix, originalGravity) {
            var sg = 0;
            var og = (originalGravity - 1) * 1000;
            var ob = 0.02 + 0.25687 * og - 0.00019224 * og * og;
            ob = Math.round(ob*10)/10;
            sg = ((1.001843 - 0.002318474*ob - 0.000007775*ob*ob - 0.000000034*ob*ob*ob + 0.00574*brix + 0.00003344*brix*brix + 0.000000086*brix*brix*brix)-1)*1000;
            if (sg === 0) { return 1.000; }
            if (sg < 0) {
                sg = 1000 + sg;
                return sg / 1000;
            }
            return ((sg / 1000) + 1);
        },

        /**
         * Converts brix &deg; to gravity
         */
        brixToGravity: function (brix) {
            brix = brix || 0;
            return 1.000898 + 0.003859118 * brix + 0.00001370735 * brix * brix + 0.00000003742517 * brix * brix * brix;
        },

        /**
         * Calculating strike temperature
         * (0.2 / R) (T2 - T1) + T2
         * R: Grain to water ratio (L./Kg)
         * T1: Dry grain temperature
         * T2: Target temperature
         */
        strikeTemperature: function (grainTemp, kgGrain, litersWater, targetTemp) {
            return (0.2 / (litersWater/kgGrain)) * (targetTemp - grainTemp) + targetTemp;
        },

        /**
         * Calculates the amount of water needed to add to a mash to raise the temperature
         * and perform an infusion step
         */
        infusionAmount: function (currentMashCelsius, targetCelsius, kgGrain, litersWater, infusionCelsius) {
            return (targetCelsius - currentMashCelsius) * (0.2 * kgGrain + litersWater) / (infusionCelsius - targetCelsius);
        },

        /**
         * Formats a number as a readable gravity messure
         */
        displayGravity: function (g) {
            g = Math.round(g * 1000) / 1000;
            while (g.toString().length < 5) {
                g = g + '0';
            }
            return g;
        },

        /**
         * Formats a number as a readable ABV string
         */
        displayABV: function (abv) {
            abv = Math.round( abv * 10 ) / 10;
            return abv + '%';
        },

        /**
         * Estimate ABV
         */
        estimateABV: function (og, sg) {
            return (og - sg) * 131;
        },

        /**
         * Hydrometer Temperature Corrections
         * http://hbd.org/brewery/library/HydromCorr0992.html
         */
        specificGravityTemperatureCorrection: function (sg, tempC) {
            //Convert sg to a floating point number
            sg=parseFloat(sg);
            //Convert celsisus values to fahrenheit
            var temp=(9/5)*tempC+32;
            //Calculates SG correction for 59F from HBD http://hbd.org/brewery/library/HydromCorr0992.html
            var correction=1.313454-(0.132674*temp)+(0.002057793*temp*temp)-(0.000002627634*temp*temp*temp);
            //Round off correction values and convert to SG scale
            correction=(Math.round(correction))/1000;
            //Adds SG correction to the measured SG
            var adjustedgravity=correction+sg;
            //Round off adjustedgravity
            adjustedgravity=Math.round(adjustedgravity * 1000)/1000;
            //sends the calculations back to a form named "entry"
            return adjustedgravity;
        },

        /**
         * Calculates the amount (oz) of sugar needed to carbonate
         * http://www.merrycuss.com/calc/bottlecarbonation.html
         */
        carbonationCalculation: function (gallons, fahrenheit, targetCarbonation) {
            //Sets variables; data from form named "entry"
            var precarbonation=0;
            var neededcarbonation=0;
            var anhydrousglucose=0;
            var anhydrousglucose2=0;
            var glucosemonohydrate=0;
            var glucosemonohydrate2=0;
            var sucrose=0;
            var sucrose2=0;
            var volume=gallons;
            var temp=fahrenheit;
            var targetcarbonation=targetCarbonation;

            //Convert gallons to liters
            volume=volume*3.78541178;
            //CO2 before bottling - Regression formula based on data from McGill (2006)
            precarbonation=-0.0153*temp + 1.9018;
            //CO2 needed to reach the target
            neededcarbonation=targetcarbonation-precarbonation;
            //Convert needed C02 to grams of C02 per liter
            neededcarbonation=neededcarbonation*2;
            //Total grams of CO2 required for the batch size
            neededcarbonation=neededcarbonation*volume;
            //Needed amount of various sugars
            anhydrousglucose=neededcarbonation/0.49;
            anhydrousglucose2=anhydrousglucose*0.0352739619;
            glucosemonohydrate=neededcarbonation/0.44;
            glucosemonohydrate2=glucosemonohydrate*0.0352739619;
            sucrose=neededcarbonation/0.54;
            sucrose2=sucrose*0.0352739619;
            //Round off values
            anhydrousglucose=(Math.round(anhydrousglucose * 100))/100;
            anhydrousglucose2=(Math.round(anhydrousglucose2 * 100))/100;
            glucosemonohydrate=(Math.round(glucosemonohydrate * 100))/100;
            glucosemonohydrate2=(Math.round(glucosemonohydrate2 * 100))/100;
            sucrose=(Math.round(sucrose * 100))/100;
            sucrose2=(Math.round(sucrose2 * 100))/100;

            return sucrose2;
        }



    };

    return BrewMath;
});
