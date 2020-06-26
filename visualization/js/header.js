class Header {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;

        this.checkBoxPaid = document.querySelector("input[name='paid']");
        this.checkBoxPaid.checked = true;
        this.checkBoxFree = document.querySelector("input[name='free']");
        this.checkBoxFree.checked = true;

        this.monthSelector = document.querySelector("input[name='year_month']");
        this.monthSelector.value = "05/2011 - 08/2018";

        this.monthDict = {  "January" : 1,
                            "February" : 2,                    
                            "March" : 3,                    
                            "April" : 4,                    
                            "May" : 5,                    
                            "June" : 6,                    
                            "July" : 7,                    
                            "August" : 8,                    
                            "September" : 9,                    
                            "October" : 10,                    
                            "November" : 11,                    
                            "December" : 12
        }
        
        var referenceHeader = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            
            referenceHeader.activateHeader(referenceHeader);

        });
    
    }

    checkPaidFilter(row){
        if( !this.checkBoxPaid.checked && row.Type === "Paid" )
            return false;
        else
            return true;
    }

    checkFreeFilter(row){
        if( !this.checkBoxFree.checked && row.Type === "Free" )
            return false;
        else
            return true;
    }

    checkLastUpdate(row){
        
        var temp = row.LastUpdated.trim().split(",");
        var y = parseInt( temp[1].trim() );
        var mString = temp[0].trim().split(" ")[0].trim();
        var m = this.monthDict[mString];

        if(this.lowerYear > y || y > this.higherYear)
            return false;

        if(this.lowerYear === y && this.lowerMonth > m)
            return false;

        if(this.higherYear === y && this.higherMonth < m)
            return false;

        return true;

    }

    activateHeader(referenceHeader){

        referenceHeader.checkBoxPaid.addEventListener('change', function() {
            //referenceHeader.checkBoxPaid.checked = !referenceHeader.checkBoxPaid.checked; //filter
            referenceHeader.dataUpdater.typeUpdateData();
        });
        
        referenceHeader.checkBoxFree.addEventListener('change', function() {
            //referenceHeader.checkBoxFree.checked = !referenceHeader.checkBoxFree.checked; //filter
            referenceHeader.dataUpdater.typeUpdateData();
        });

        referenceHeader.monthSelector.addEventListener('change', function() {
            //console.log(referenceHeader.monthSelector.value);
            var string = referenceHeader.monthSelector.value.trim().split("-");
            var lowerDate = string[0].trim();
            var higherDate = string[1].trim();

            var tempLower = lowerDate.split("/");
            var tempHigher = higherDate.split("/");

            referenceHeader.lowerMonth = parseInt( tempLower[0].trim() );
            referenceHeader.lowerYear = parseInt( tempLower[1].trim() );

            //console.log(referenceHeader.lowerMonth);
            //console.log(referenceHeader.lowerYear);

            referenceHeader.higherMonth = parseInt( tempHigher[0].trim() );
            referenceHeader.higherYear = parseInt( tempHigher[1].trim() );

            //console.log(referenceHeader.higherMonth);
            //console.log(referenceHeader.higherYear);
            
            referenceHeader.dataUpdater.typeUpdateData();
        
        });

    }


}


