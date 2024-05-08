import { Drawer, List, Button } from 'antd';

const MovementView = ({ open, closeView, movementsData, onClick, isLoading }) => {
    return (
        <Drawer
			placement="right"
			width={450}
            title="Lista delle movimentazioni pendenti"
            open={open}
			closable={true}
            onClose={closeView}
			mask={false}
        >
            <List
                itemLayout="horizontal"
                dataSource={movementsData}
                renderItem={movement => (
                    <List.Item
                        actions={[
                            <Button onClick={() => {onClick(movement.movementId)}} loading={isLoading}>
                                Sollecita risposta
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`Movimento #${movement.movementId}`}
                            description={
                                <div>
                                    <p style={{margin: 0}}>Da scaffalatura: {movement.fromShelfName}, bin: {movement.fromBinString}</p>
                                    <p style={{margin: 0}}>A scaffalatura: {movement.toShelfName}, bin: {movement.toBinString}</p>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Drawer>
    );
};

export default MovementView;
