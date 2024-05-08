export const fileManagementSlice = (set, get) => ({
    jsonToState: (fileData) => {
        const data = JSON.parse(fileData);

        get().setWhsName(data.whsName);
        get().setWhsPolygon(data.whsPoints, data.whsHeight);
        get().setProducts(data.products);
        get().setMovements(data.movements);
        get().setShelves(data.shelves);
    },

    stateToJson: () => {
        const pointsJsonData = get().points;

        const productJsonArray = get().products.map(product => ({
            id: product.id,
            name: product.name,
            color: product.color
        }));

        const shelfJsonArray = get().shelves.map(shelf => ({
            id: shelf.id,
            name: shelf.name,
            binSize: shelf.binSize,
            width: shelf.width,
            height: shelf.height,
            position: shelf.position,
            isFlipped: shelf.isFlipped,
            bins: shelf.bins.map(row => row.map(bin => ({
                id: bin.id,
                productId: bin.productId,
                state: bin.state
            })))
        }));

        const movementsJsonArray = get().movements.map(movement => ({
            id: movement.id,
            fromId: movement.fromId,
            fromRow: movement.fromRow,
            fromCol: movement.fromCol,
            toId: movement.toId,
            toRow: movement.toRow,
            toCol: movement.toCol
        }));

        const jsonData = {
            whsName: get().whsName,
            whsHeight: get().whsHeight,
            whsPoints: pointsJsonData,
            products: productJsonArray,
            shelves: shelfJsonArray,
            movements: movementsJsonArray
        };

        return jsonData;
    },

    svgToState: (svgData, height) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
        const polygons = svgDoc.getElementsByTagName('polygon');
        
        const firstPolygon = Array.from(polygons).find(polygon => polygon.getAttribute('points'));
        const points = firstPolygon.getAttribute('points').trim().split(' ').map(point => {
            const [x, z] = point.split(',').map(Number).map(num => parseFloat(num.toFixed(2)));
            return { x, z };
        });

        // Translate the center of the polygon in (x: 0, z: 0)          TO CHECK: not sure
        const centroid = {
            x: points.reduce((sum, vertex) => sum + vertex.x, 0) / points.length,
            z: points.reduce((sum, vertex) => sum + vertex.z, 0) / points.length
        };

        const translatedPoints = points.map(vertex => ({
            x: parseFloat((vertex.x - centroid.x).toFixed(2)),
            z: parseFloat((vertex.z - centroid.z).toFixed(2)*(-1))
        }));

        get().setWhsPolygon(translatedPoints, parseFloat(height));
    }
})