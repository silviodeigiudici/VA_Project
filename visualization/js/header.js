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
        return this.checkBoxPaid.checked;
    }

    checkFreeFilter(row){
        return this.checkBoxFree.checked;
    }

    activateHeader(referenceHeader){

        referenceHeader.checkBoxPaid.addEventListener('change', function() {
            //referenceHeader.checkBoxPaid.checked = !referenceHeader.checkBoxPaid.checked; //filter
            referenceHeader.dataUpdater.updateData();
        });
        
        referenceHeader.checkBoxFree.addEventListener('change', function() {
            //referenceHeader.checkBoxFree.checked = !referenceHeader.checkBoxFree.checked; //filter
            referenceHeader.dataUpdater.updateData();
        });

    }


}


