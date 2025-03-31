import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = ({ onScan }) => {
	const [scanResult, setScanResult] = useState(null);

	console.log('onScan', onScan);

	const handleScan = (data) => {
		if (data) {
			setScanResult(data);
			onScan(data); // Llama a la función onScan con el resultado
		}
	};

	const handleError = (err) => {
		console.error(err);
	};

	return (
		<div>
			<QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
			{scanResult && <p>Scan Result: {scanResult}</p>}
		</div>
	);
};

export default QRCodeScanner;
