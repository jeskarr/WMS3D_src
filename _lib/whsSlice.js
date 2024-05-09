const MAX_HEIGHT = 50;
const MAX_DEPTH = 1000;
const MAX_WIDTH = 1000;
const MIN_SIZE = 0.01;
const MAX_NAME_LENGTH = 20;

export const whsSlice = (set, get) => ({
	whsName: null,
	whsHeight: null,
	points: [],

	setWhsName: (name) => {
		let error = false;
		if(name.length > MAX_NAME_LENGTH) {
			get().setError("Il nome del magazzino non può superarare i 20 caratteri.");
			error = true;
		}
		if(!name.match(/^[a-zA-Z0-9_]+$/)) {
			get().setError("Il nome del magazzino può contenere solo lettere, numeri e _.");
			error = true;
		}
		if(!name.trim()) {
			get().setError("Il nome del magazzino non può essere vuoto.");
			error = true;
		}
		if(!error) {
			set({ whsName: name });
		}
	},

	setWhsRectangle: (depth, width, height) => {
		if (!depth || !width || !height) {
			get().setError("Le dimensioni del magazzino non possono essere vuote.");
		}
		else if (width > MAX_WIDTH || depth > MAX_DEPTH || height > MAX_HEIGHT) {
			get().setError("Le dimensioni del magazzino superano i limiti massimi consentiti.");
		}
		else if (width < MIN_SIZE || depth < MIN_SIZE || height < MIN_SIZE) {
			get().setError("Le dimensioni del magazzino sono inferiori ai limiti minimi consentiti (0.01mt).");
		} 
		else {
			const widthParsed = parseFloat(width.toFixed(2))/2;
			const depthParsed = parseFloat(depth.toFixed(2))/2;
			set({ 
				whsHeight: parseFloat(height.toFixed(2)), 
				points: 
					[{ x: -widthParsed, z: -depthParsed },
					{ x: widthParsed, z: -depthParsed },
					{ x: widthParsed, z: depthParsed },
					{ x: -widthParsed, z: depthParsed },]
			})
		}
	}, 

	setWhsPolygon: (points, height) =>{
		if (!points || points.length < 3) {
			get().setError("Per creare l'ambiente di magazzino sono necessari almeno tre punti.");
		}
		else {
			const maxX = Math.max(...points.map(p => p.x.toFixed(2)));
			const maxZ = Math.max(...points.map(p => p.z.toFixed(2)));
			const minX = Math.min(...points.map(p => p.x.toFixed(2)));
			const minZ = Math.min(...points.map(p => p.z.toFixed(2)));
			const calculatedWidth = maxX - minX;
			const calculatedDepth = maxZ - minZ;

			if (calculatedDepth > MAX_DEPTH || calculatedWidth > MAX_WIDTH || height > MAX_HEIGHT) {
				get().setError("Le dimensioni del magazzino superano i limiti massimi consentiti.");
			}
			else if (calculatedWidth < MIN_SIZE || calculatedDepth < MIN_SIZE || height < MIN_SIZE) {
				get().setError("Le dimensioni del magazzino superano i limiti minimi consentiti (0.01mt).");
			}
			else {
				set({ points: points, whsHeight: height });
			}
		}
	},
})