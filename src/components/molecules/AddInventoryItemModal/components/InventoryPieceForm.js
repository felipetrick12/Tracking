import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getStatusRowClass } from '@/utils/getStatusRowClass';

const fileToBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file); // ✅ esto está bien
		reader.onload = () => resolve(reader.result); // 👈 esto devuelve un base64 válido
		reader.onerror = (error) => reject(error);
	});

const InventoryPieceForm = ({ pieces = [], setPieces }) => {
	const handleItemImageChange = async (index, files, status = 'received') => {
		const updatedItems = [...pieces];

		if (!updatedItems[index].imagesByStatus) {
			updatedItems[index].imagesByStatus = {};
		}
		if (!updatedItems[index].imagesByStatus[status]) {
			updatedItems[index].imagesByStatus[status] = [];
		}

		const base64Images = await Promise.all(Array.from(files).map(fileToBase64));
		updatedItems[index].imagesByStatus[status].push(...base64Images);

		setPieces(updatedItems);
	};

	const removeItemImage = (index, status, imageIndex) => {
		const updatedItems = [...pieces];
		if (!updatedItems[index].imagesByStatus?.[status]) return;

		updatedItems[index].imagesByStatus[status].splice(imageIndex, 1);
		setPieces(updatedItems);
	};

	const handleItemChange = (index, field, value) => {
		const updatedItems = [...pieces];
		updatedItems[index][field] = value;
		setPieces(updatedItems);
	};

	const handlePieceChange = (itemIndex, pieceIndex, field, value) => {
		const updatedItems = [...pieces];
		if (!updatedItems[itemIndex].pieces[pieceIndex]) return;
		updatedItems[itemIndex].pieces[pieceIndex][field] = value;
		setPieces(updatedItems);
	};

	const handlePieceImageChange = async (itemIndex, pieceIndex, files, status = 'received') => {
		const updatedItems = [...pieces];

		if (!updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus) {
			updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus = {};
		}
		if (!updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus[status]) {
			updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus[status] = [];
		}

		const base64Images = await Promise.all(Array.from(files).map(fileToBase64));
		updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus[status].push(...base64Images);

		setPieces(updatedItems);
	};

	const removePieceImage = (itemIndex, pieceIndex, status, imageIndex) => {
		const updatedItems = [...pieces];
		const imagesArray = updatedItems[itemIndex].pieces[pieceIndex].imagesByStatus?.[status] || [];
		imagesArray.splice(imageIndex, 1);
		setPieces(updatedItems);
	};

	const addPiece = (itemIndex) => {
		const updatedItems = [...pieces];
		if (!updatedItems[itemIndex].pieces) updatedItems[itemIndex].pieces = [];
		updatedItems[itemIndex].pieces.push({
			name: '',
			note: '',
			location: '',
			status: 'received',
			imagesByStatus: {}
		});
		setPieces(updatedItems);
	};

	const removePiece = (itemIndex, pieceIndex) => {
		const updatedItems = [...pieces];
		updatedItems[itemIndex].pieces.splice(pieceIndex, 1);
		setPieces(updatedItems);
	};

	return (
		pieces.length > 0 && (
			<div className="mt-6 space-y-4">
				<h3 className="text-lg font-semibold">Items Preview ({pieces.length})</h3>
				<div className="grid grid-cols-2 gap-4">
					{pieces.map((item, index) => (
						<div
							key={index}
							className={`border p-2 mt-2 rounded-md space-y-2 p-4 ${getStatusRowClass(item.status)}`}
						>
							<p className="font-semibold mb-2">{item.name}</p>

							<Select
								onValueChange={(value) => handleItemChange(index, 'status', value)}
								value={item.status || 'received'}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{['received', 'damaged'].map((status) => (
										<SelectItem key={status} value={status}>
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Textarea
								placeholder="Note"
								value={item.note || ''}
								onChange={(e) => handleItemChange(index, 'note', e.target.value)}
							/>

							<Input
								placeholder="Location"
								value={item.location || ''}
								onChange={(e) => handleItemChange(index, 'location', e.target.value)}
							/>

							<Input
								type="file"
								accept="image/*"
								multiple
								onChange={(e) =>
									handleItemImageChange(index, e.target.files, item.status || 'received')
								}
								className="mt-2"
							/>
							{item.imagesByStatus?.[item.status]?.map((img, i) => (
								<div key={i} className="relative inline-block mr-2">
									<img
										src={img}
										alt="Item preview"
										className="mt-2 h-24 w-auto object-cover rounded-md"
									/>
									<button
										type="button"
										onClick={() => removeItemImage(index, item.status, i)}
										className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
									>
										×
									</button>
								</div>
							))}

							<div className="mt-2">
								{item.pieces.map((piece, pIndex) => (
									<div
										key={pIndex}
										className={`border p-2 mt-4 rounded-md space-y-2 p-4 ${getStatusRowClass(
											piece.status
										)}`}
									>
										<div className="flex justify-between items-center">
											<p className="text-sm font-medium text-black">Piece {pIndex + 1}</p>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-500"
												onClick={() => removePiece(index, pIndex)}
											>
												Remove
											</Button>
										</div>

										<Input
											type="text"
											placeholder="Piece Name"
											value={piece.name}
											onChange={(e) => handlePieceChange(index, pIndex, 'name', e.target.value)}
										/>

										<Select
											onValueChange={(value) => handlePieceChange(index, pIndex, 'status', value)}
											value={piece.status || 'received'}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												{['received', 'damaged'].map((status) => (
													<SelectItem key={status} value={status}>
														{status.charAt(0).toUpperCase() + status.slice(1)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Textarea
											placeholder="Note"
											value={piece.note}
											onChange={(e) => handlePieceChange(index, pIndex, 'note', e.target.value)}
										/>

										<Input
											placeholder="Location"
											value={piece.location || ''}
											onChange={(e) =>
												handlePieceChange(index, pIndex, 'location', e.target.value)
											}
										/>

										<Input
											type="file"
											accept="image/*"
											multiple
											onChange={(e) =>
												handlePieceImageChange(
													index,
													pIndex,
													e.target.files,
													piece.status || 'received'
												)
											}
										/>

										{piece.imagesByStatus?.[piece.status]?.map((img, i) => (
											<div key={i} className="relative inline-block mr-2">
												<img
													src={img}
													alt={`Piece preview ${i + 1}`}
													className="mt-2 h-24 w-auto object-cover rounded-md"
												/>
												<button
													type="button"
													onClick={() => removePieceImage(index, pIndex, piece.status, i)}
													className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
												>
													×
												</button>
											</div>
										))}
									</div>
								))}
								<Button type="button" onClick={() => addPiece(index)} className="mt-2">
									+ Add Piece
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	);
};

export default InventoryPieceForm;
