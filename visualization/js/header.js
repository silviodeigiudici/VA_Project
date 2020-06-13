class Header {
    constructor(dataUpdater) {
        
        this.dataUpdater = dataUpdater;
        this.checkBoxPaid = document.querySelector("input[name='paid']");
        this.checkBoxPaid.checked = true;
        this.checkBoxFree = document.querySelector("input[name='free']");
        this.checkBoxFree.checked = true;

        
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

    activateHeader(referenceHeader){

        referenceHeader.checkBoxPaid.addEventListener('change', function() {
            //referenceHeader.checkBoxPaid.checked = !referenceHeader.checkBoxPaid.checked; //filter
            referenceHeader.dataUpdater.typeUpdateData();
        });
        
        referenceHeader.checkBoxFree.addEventListener('change', function() {
            //referenceHeader.checkBoxFree.checked = !referenceHeader.checkBoxFree.checked; //filter
            referenceHeader.dataUpdater.typeUpdateData();
        });

    }


}


