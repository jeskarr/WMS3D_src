import Shelf from "@_model/Shelf"
import { binState } from "@_model/Bin"

export const shelvesSlice = (set, get) => ({
	shelves: [],

	setShelves: (shelvesToSet) => {
		const uniqueNames = new Set();
		const uniqueIds = new Set();
		let error = false;
		shelvesToSet.forEach(shelf => {
			if (uniqueNames.has(shelf.name)) {
				get().setError("La scaffalatura aggiunta contiene un nome già esistente.");
				error=true;
				return;
			}
			if(uniqueIds.has(shelf.id)){
				get().setError("La scaffalatura aggiunta ha un ID già presente nel sistema.");
				error=true;
				return;
			}
			uniqueNames.add(shelf.name);
			uniqueIds.add(shelf.id);
		});
		if(!error) set({ shelves: shelvesToSet.map(shelf => {
			let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
			newShelf.bins = shelf;
			return newShelf;
		}) 
		});
	},

	addShelf: (name, binSize, height, width) => { 
		let error=false;
		get().shelves.forEach(shelf => {
			if (shelf.name === name) {
				get().setError("La scaffalatura aggiunta contiene un nome già esistente.");
				error=true;
				return;
			}
		});
		
		const maxHeight = get().whsHeight;
  		if (height * binSize > maxHeight) {
			get().setError("L'altezza deve essere inferiore a " + maxHeight + ".");
    		error=true;
  		}

		if(!error){
			const newShelf = new Shelf(name, binSize, width, height);

			set((state) => ({
				shelves: [...state.shelves, newShelf] 
			}));
		}
	},

	removeShelf: (id) => {   
		const shelf = get().shelves.find(shelf => shelf.id == id);
		
		let isEmpty = true;
		for (let i = 0; i < shelf.height && isEmpty; i++) {
			for (let j = 0; j < shelf.width && isEmpty; j++) {
				if(shelf.bins[i][j].state != binState.EMPTY)
					isEmpty = false;
			}
		}
		if(!isEmpty) {
			get().setError("Impossibile eliminare. La scaffalatura non è vuota.");	// to test (not sure)
		}
		else {
			set((state) => ({
				shelves: state.shelves.filter(shelf => shelf.id !== id)
			}));
		}
	},

	/*
	updateShelfInfo: (id, binSize, width, height) => {
		set((state) => ({	
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					newShelf.binSize = binSize;
					newShelf.width = width;
					newShelf.height = height;
					newShelf.position = {x: binSize * width / 2, y: binSize * height / 2, z: binSize / 2};			
					return newShelf;
				} else {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
				}
			})
		}));
	},*/

	updateShelfInfo: (id, name, binSize, width, height) => {
		let error = false;
		get().shelves.forEach(shelf => {
			if (shelf.name === name && shelf.id !== id) {
				get().setError("La scaffalatura aggiunta contiene un nome già esistente.");
				error=true;
				return;
			}
		});
		const maxHeight = get().whsHeight;
		if (height * binSize > maxHeight) {
		  	get().setError("L'altezza deve essere inferiore a " + maxHeight + ".");
			error=true;
		}
		if(!error){
			set((state) => ({  
				shelves: state.shelves.map(shelf => {
					if (shelf.id === id) {
						let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
						newShelf.bins = shelf;
						newShelf.binSize = binSize;
						try{
							newShelf.width = width;
							newShelf.height = height;
						}
						catch{
							newShelf.width = shelf.width;
							newShelf.height = shelf.height;
							get().setError("Impossibile ridurre la scaffalatura, sono presenti dei prodotti.");
						}
						newShelf.name = name;
						newShelf.position = {
							x: shelf.position.x,
							y: binSize * height / 2,
							z: shelf.position.z
						};      
						return newShelf;
						/*
						return {
						...shelf,
						binSize: binSize,
						width: width,
						height: height,
						position: {x: binSize * width / 2, y: binSize * height / 2, z: binSize / 2}
						};*/
					} else {
						let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
						newShelf.bins = shelf;
						return newShelf;
					//return shelf;
					}
				})
			}));
		}
	},

	updateShelfPosition: (id, x, z) => {	
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					let isValidPosition = true;
					// Check if shelf intersect walls
					if (get().intersectingIds.includes(shelf.id)) {
						get().setError(`Posizione non valida. Si prega di riprovare. 
						Controllare che le misure della scaffalature rientrino nel magazzino.`);
						isValidPosition = false;
					}
					// Check if shelf outside or inside  TO CHECK: not sure
					else {
						let inside = false;
						const whsFloor = get().points;		
						for (let i = 0, j = whsFloor.length - 1; i < whsFloor.length; j = i++) {
							const xi = whsFloor[i].x;
							const zi = whsFloor[i].z;
							const xj = whsFloor[j].x;
							const zj = whsFloor[j].z;
					
							const intersect =
								zi > z !== zj > z &&
								x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
							if (intersect) {
								inside = !inside;
							}
						}
						if(!inside) {
							get().setError(`Posizione non valida. Si prega di riprovare. 
							Controllare che le misure della scaffalature rientrino nel magazzino.`);
							isValidPosition = false;
						}
					}

					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;

					if(isValidPosition) {
						newShelf.position = {x: x, y: shelf.position.y, z: z};
					}
					
					return newShelf;
					/*
					return {
						...shelf,
						position: {
							...shelf.position,
							x: x,
							z: z,
						},
					};*/
				} else {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
					//return shelf;
				}
			})
		}));
	},

	updateBinState: (shelfId, row, col, binState) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if(shelf.id === shelfId) {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					newShelf.bins[row][col].state = binState;
					return newShelf;
					/*
					return {
						...shelf,
						bins: shelf.bins.map(bin => {
							if (bin.id === `${shelfId}-${row}-${col}`) {
								return {
									...bin,
									state: binState,
								}
							}
							else {
								return bin;
							}
						}),
					};*/
				} else {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
					//return shelf;
				}
			})
		}));
	},

	flipShelf: (id) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, !shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
					/*
					return {
						...shelf,
						isFlipped: true,
					};*/
				} else {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
					//return shelf;
				}
			})
		}));
	},

	insertProduct: (productId, shelfId, row, col) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if(shelf.id === shelfId) {
					if(shelf.bins[row][col].state !== binState.EMPTY) {
						get().setError("Impossibile inserire il prodotto. Il bin è occupato.");	// to test (not sure)
						let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
						newShelf.bins = shelf;
						return newShelf;
						//return shelf;
					} else {
						let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
						newShelf.bins = shelf;
						newShelf.bins[row][col].state = binState.STILL;
						newShelf.bins[row][col].productId = productId;
						return newShelf;/*
						return {
							...shelf,
							bins: shelf.bins.map(bin => {
								if (bin.id === `${shelfId}-${row}-${col}`) {
									return {
										...bin,
										state: binState.STILL,
										productId: productId,
									}
								}
								else {
									return bin;
								}
							}),
						};*/
					}
					
				} else {
					let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
					newShelf.bins = shelf;
					return newShelf;
					//return shelf;
				}
			})
		}));
	},

	removeProductFromBin: (id, row, col) => {
		set((state) => ({
		  shelves: state.shelves.map(shelf => {
			if(shelf.id == id) {
				let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
				newShelf.bins = shelf;
				newShelf.bins[row][col].state = binState.EMPTY;
				newShelf.bins[row][col].productId = null;
				return newShelf;
			}
			else {
				let newShelf = new Shelf(shelf.name, shelf.binSize, shelf.width, shelf.height, shelf.position, shelf.isFlipped, shelf.id);
				newShelf.bins = shelf;
				return newShelf;
				//return shelf;
			}
		  })
		}));
		get().removeMovementsWithBin(id, row, col);
	},

	getBinsWithProduct: (productId) => {
		let binInfos = [];
		const shelves = get().shelves;
		
		for(let s = 0; s < shelves.length; s++){
		  	const shelf = shelves[s];
		  	for (let i = 0; i < shelf.height; i++) {
				for (let j = 0; j < shelf.width; j++) {
			  		if(shelf.bins[i][j].productId == productId) {
						const newObj = {
				  			shelfName: shelf.name,
				  			binId: shelf.bins[i][j].id
						}
						binInfos.push(newObj);
			  		}
				}
		  	}
		}
		return binInfos;
	}
	/*
	getBinsWithProduct: (productId) => {
		let binsIds = [];
		const shelves = get().shelves;
		
		for(let s = 0; s < shelves.length; s++){
			const shelf = shelves[s];
			for (let i = 0; i < shelf.height; i++) {
				for (let j = 0; j < shelf.width; j++) {
					if(shelf.bins[i][j].productId == productId)
						binsIds.push(shelf.bins[i][j].id);
				}
			}
		}
		return binsIds;
	}*/
})