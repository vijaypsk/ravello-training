
Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
    value: function (item) {
        var removeCounter = 0;

        for (var index = 0; index < this.length; index++) {
            if (this[index] === item) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }

        return removeCounter;
    }
});


function mapToArray(mapObject, returnedArray) {
    if (returnedArray == undefined) {
        returnedArray = [];
    }

    for( var i in mapObject ) {
        if (mapObject.hasOwnProperty(i)){
            returnedArray.push(mapObject[i]);
        }
    }

    return returnedArray;
}