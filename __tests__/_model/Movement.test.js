import Movement from "@_model/Movement";

test('Movement should return correct fromId', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.fromId).toEqual('A00');
})

test('Movement should return correct fromRow', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.fromRow).toEqual(0);
})

test('Movement should return correct fromCol', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.fromCol).toEqual(1);
})

test('Movement should return correct toId', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.toId).toEqual('B00');
})

test('Movement should return correct toRow', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.toRow).toEqual(3);
})

test('Movement should return correct toCol', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    expect(myMovement.toCol).toEqual(4);
})

test('Movement should return correct id', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4, 'MyId01');
    expect(myMovement.id).toEqual('MyId01');
})

test('Movement should set new fromId correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.fromId = 'Y01';
    expect(myMovement.fromId).toEqual('Y01');
});

test('Movement should set new fromRow correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.fromRow = 5;
    expect(myMovement.fromRow).toEqual(5);
});

test('Movement should set new fromCol correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.fromCol = 2;
    expect(myMovement.fromCol).toEqual(2);
});

test('Movement should set new toId correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.toId = '90$';
    expect(myMovement.toId).toEqual('90$');
});

test('Movement should set new toRow correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.toRow = 0;
    expect(myMovement.toRow).toEqual(0);
});

test('Movement should set new toCol correctly', () => { 
    const myMovement = new Movement('A00', 0, 1, 'B00', 3, 4);
    myMovement.toCol = 8;
    expect(myMovement.toCol).toEqual(8);
});

/*
If need multiple:
const fromIds = ['AA0', '001', 'P$2', '_MYID'];

test.each(fromIds)(
    'Movement should return correct fromId',
    (id) => {
        const myMovement = new Movement(id, 0, 1, 'B00', 3, 4);
        expect(myMovement.fromId).toEqual(id);
    }
);
*/