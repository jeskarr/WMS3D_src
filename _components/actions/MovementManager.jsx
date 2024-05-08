import { boundStore } from '@_lib/boundStore';
import MovementView from '@_components/actions/MovementView';
import { message } from 'antd';
import { useState } from 'react';

const MovementManager = ({ open, closeView }) => {
    const [ loading, setLoading ] = useState(false);
    const movements = boundStore((state) => state.movements);
    const shelves = boundStore((state) => state.shelves);
    const removeMovementsWithBin = boundStore((state) => state.removeMovementsWithBin);
    const updateBinState = boundStore((state) => state.updateBinState);

	const requestForMovement = async (id) => {
        setLoading(true);
        console.log(id)
		const response = await fetch(
			'/api/movementRequest',
			{
				method: 'POST',
                body: JSON.stringify({id: id}),
			}
		);
		const {msg, requestStatus} = await response.json();

        const movement = movements.find((movement) => movement.id === id);
        if(!requestStatus) { 
            const fromId = movement.fromId;
            const fromRow = movement.fromRow;
            const fromCol = movement.fromCol;
            updateBinState(fromId, fromRow, fromCol, 'STILL');
            removeMovementsWithBin(fromId, fromRow, fromCol);
            message.error(msg);
        }
        else {
            const toId = movement.toId;
            const toRow = movement.toRow;
            const toCol = movement.toCol;
            updateBinState(toId, toRow, toCol, 'STILL');
            removeMovementsWithBin(toId, toRow, toCol);
            message.success(msg);
        }
        setLoading(false);
	}

	const dataSource = movements.map(item => ({
        movementId: item.id,
        fromShelfName: shelves.find(shelf => shelf.id === item.fromId).name,
        toShelfName: shelves.find(shelf => shelf.id === item.toId).name,
        fromBinString: "x: "+item.fromRow+" y: "+item.fromCol,
        toBinString: "x: "+item.toRow+" y: "+item.toCol,
	}));

    return (
        <MovementView
            open={open}
            closeView={closeView}
            movementsData={dataSource}
            onClick={requestForMovement}
            isLoading={loading}
        />
    );
};

export default MovementManager;
