class ParallelPlot {
    constructor(dataUpdater) {
        
        this.dataUpdater = dataUpdater;
        //draw/allocate here (everything that don't need the data)
        //use 'this' to declare variables:
        //this.svg = robe
        
        
        //in the function below (on every callback in general) use referenceParallelPlot 
        //when you need to use 'this' (why? because the callback doesn't see 'this'... JS SHIT)
        //so instead of using:
        //this.svg = robe
        //use: 
        //referenceParallelPlot.svg = robe
        var referenceParallelPlot = this;
        this.dataUpdater.addListener('dataReady', function(e) {

            referenceParallelPlot.startVisualization(referenceParallelPlot);

        });
    }

    startVisualization(referenceParallelPlot) {
        //to see the data(you can delete this line, it's only an example):
        console.log(referenceParallelPlot.dataUpdater.data); //TO DELETE
        
        //here populate the draw with the data
    }

    updateVisualization() {

    }

}


