import { binState } from "@_model/Bin";
import Bin from "@_model/Bin";

// binState tests
test('binState should possess EMPTY property', () => {
    expect(binState).toHaveProperty('EMPTY', 'EMPTY');
});

test('binState should possess OUTGOING property', () => {
    expect(binState).toHaveProperty('OUTGOING', 'OUTGOING');
});

test('binState should possess INCOMING property', () => {
    expect(binState).toHaveProperty('INCOMING', 'INCOMING');
});

test('binState should possess STILL property', () => {
    expect(binState).toHaveProperty('STILL', 'STILL');
});

// Bin tests
test('Bin should have default productId to null', () => {
    const newBin = new Bin('B00');
    expect(newBin.productId).toEqual(null);
})

test('Bin should have default state to EMPTY', () => {
    const newBin = new Bin('B00');
    expect(newBin.state).toEqual(binState.EMPTY);
})

test('Bin should return correct id', () => {
    const newBin = new Bin('B00');
    expect(newBin.id).toEqual('B00');
})

test('Bin should return correct productId', () => {
    const newBin = new Bin('B00', 'P012A');
    expect(newBin.productId).toEqual('P012A');
})

test('Bin should return correct state', () => {
    const newBin = new Bin('B00', 'P012A', binState.OUTGOING);
    expect(newBin.state).toEqual(binState.OUTGOING);
})

test('Bin should set new productId correctly', () => { 
    const newBin = new Bin('B00', 'P012A');
    newBin.productId = 'P012B';
    expect(newBin.productId).toEqual('P012B');
});

test('Bin should set new state correctly', () => { 
    const newBin = new Bin('B00', 'P012A');
    newBin.state = binState.INCOMING;
    expect(newBin.state).toEqual(binState.INCOMING);
});