import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '../node_modules/@ant-design/icons';
const ErrorModal = ({ error, onCancel }) => {
	return (
		<Modal 
				title= {
                    <div>
						<ExclamationCircleOutlined /> Oh no! Si è verificato un errore.
			  		</div>
                }    
				open={error !== null} 
				onCancel={onCancel}
				footer={null}
			>	
				<p>{error}</p>
		</Modal>
	)
};

export default ErrorModal;