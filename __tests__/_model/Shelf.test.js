import Shelf from "@_model/Shelf";
import { ShelfError } from "@_model/Shelf";
import Bin, { binState } from "@_model/Bin";

//ShelfError test
test('ShelfError should return correct message', () => { 
    const myError = new ShelfError("myMessage");
    expect(myError.msg).toEqual("myMessage");
});

//Shelf test
test('Shelf should return correct name', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
	expect(newShelf.name).toEqual("newShelf");
});

test('Shelf should should set new name correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
    newShelf.name = "myNewName";
	expect(newShelf.name).toEqual("myNewName");
});

test('Shelf should return correct binSize', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
	expect(newShelf.binSize).toEqual(5);
});

test('Shelf should should set new binSize correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
    newShelf.binSize = 12;
	expect(newShelf.binSize).toEqual(12);
});

test('Shelf should return correct width', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
	expect(newShelf.width).toEqual(2);
});

test('Shelf should should set new width correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
    newShelf.width = 200;
	expect(newShelf.width).toEqual(200);
});

test('Shelf should return correct height', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
	expect(newShelf.height).toEqual(3);
});

test('Shelf should should set new height correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3);
    newShelf.height = 19;
	expect(newShelf.height).toEqual(19);
});

test('Shelf should return correct position', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29});
	expect(newShelf.position).toEqual({x: 10, y: 50, z: 29});
});

test('Shelf should should set new position correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29});
    newShelf.position = {x: 70, y: 40, z: 11};
	expect(newShelf.position).toEqual({x: 70, y: 40, z: 11});
});

test('Shelf should return correct isFlipped', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29}, true);
	expect(newShelf.isFlipped).toEqual(true);
});

test('Shelf should should set new isFlipped correctly', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29});
    newShelf.isFlipped = true;
	expect(newShelf.isFlipped).toEqual(true);
});

test('Shelf should return correct id', () => { 
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29}, true, "SH012");
	expect(newShelf.id).toEqual("SH012");
});


// check
test('Shelf bins should be of type Bin', () => {
    const newShelf = new Shelf("newShelf", 5, 2, 3, {x: 10, y: 50, z: 29}, true);
    const bins = newShelf.bins;
    for (let i = 0; i < bins.length; i++) {
        for (let j = 0; j < bins[i].length; j++) {
            expect(bins[i][j]).toBeInstanceOf(Bin);
        }        
    }
});

test('Shelf bins should have #width columns', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6, {x: 10, y: 50, z: 29}, true);
    const width = newShelf.width;
    const bins = newShelf.bins;
	for (let i = 0; i < bins.length; i++) {
        expect(bins[i].length).toEqual(width);        
    }
});

test('Shelf bins should have #height rows', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6, {x: 10, y: 50, z: 29}, true);
    const height = newShelf.height;
    expect(newShelf.bins.length).toEqual(height);
});

test('Shelf bins should have unique ids', () => { 
    function uniqueFilter(value, index, array) {
        return array.indexOf(value) === index;
    }
      
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    const binsArray = [].concat(...newShelf.bins);
    var uniqueBins = binsArray.filter(uniqueFilter);
    
    expect(uniqueBins.length).toEqual(binsArray.length);
});

test('Shelf bins should adapt to increasing width', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.width = 6;
    const bins = newShelf.bins;
    for (let i = 0; i < bins.length; i++) {
        expect(bins[i].length).toEqual(6);        
    }
});

test('Shelf bins should adapt to increasing height', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.height = 9;
    const bins = newShelf.bins;
    expect(bins.length).toEqual(9);
});

test('Shelf bins should adapt to decreasing width', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.width = 2;    
    const bins = newShelf.bins;
    for (let i = 0; i < bins.length; i++) {
        expect(bins[i].length).toEqual(2);        
    }
});

test('Shelf width should not decrease if involved bins are non-empty', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.bins[0][3].state = binState.INCOMING;
    expect(() => {newShelf.width = 3}).toThrow(ShelfError);
});

test('Shelf height should not decrease if involved bins are non-empty', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.bins[5][3].state = binState.STILL;
    expect(() => {newShelf.height = 3}).toThrow(ShelfError);
});

test('Shelf bins should adapt to decreasing height', () => { 
    const newShelf = new Shelf("newShelf", 5, 4, 6);
    newShelf.height = 1;    
    const bins = newShelf.bins;
    expect(bins.length).toEqual(1);
});

test('Self bins should be set only with same size shelf', () => { 
    const myFirstShelf = new Shelf("newShelf", 5, 4, 6);
    const mySecondShelf = new Shelf("newShelf", 5, 2, 6);
    expect(() => {myFirstShelf.bins = mySecondShelf}).toThrow(ShelfError);
});

test('Shelf bin ids must follow the rule shelf.id+i+j where i and j are indexes of matrix', () => { 
    const newShelf = new Shelf("newShelf", 5, 3, 6);
    const bins = newShelf.bins;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            expect(bins[i][j].id).toEqual(`${newShelf.id}+${i}+${j}`);	
        }
    }
});

test('Shelf bin ids (in Shelf with personalized id) must follow the rule shelf.id+i+j where i and j are indexes of matrix', () => { 
    const newShelf = new Shelf("newShelf", 5, 3, 6, {x: 1, y: 2, z: 3}, true, "98Na4");
    const bins = newShelf.bins;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            expect(bins[i][j].id).toEqual(`98Na4+${i}+${j}`);
        }
    }
});

test('Shelf bins should be set correctly', () => { 
    const myFirstShelf = new Shelf("newShelf", 5, 4, 6);
    myFirstShelf.bins[0][0].state = binState.STILL;
    myFirstShelf.bins[3][2].state = binState.INCOMING;
    myFirstShelf.bins[5][3].state = binState.OUTGOING;
    const mySecondShelf = new Shelf("newShelf", 5, 4, 6);
    mySecondShelf.bins = myFirstShelf;

    expect(mySecondShelf.bins[0][0].state).toEqual(binState.STILL);
    expect(mySecondShelf.bins[3][2].state).toEqual(binState.INCOMING);
    expect(mySecondShelf.bins[5][3].state).toEqual(binState.OUTGOING);
});