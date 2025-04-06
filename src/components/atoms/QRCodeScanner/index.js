import { QrReader } from 'react-qr-reader';

const QRCodeScanner = ({ onScan }) => {
	const handleScan = (data) => {
		if (data) onScan(data);
	};

	const handleError = (err) => {
		console.log('QR SCAN ERROR:', err);
	};

	return (
		<QrReader
			delay={300}
			onResult={(result, error) => {
				if (!!result) handleScan(result?.text);
				if (!!error) handleError(error);
			}}
			constraints={{ facingMode: 'environment' }}
			style={{ width: '100%' }}
		/>
	);
};

export default QRCodeScanner;
