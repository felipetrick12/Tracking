import { Bed, Chair, DoorOpen, ImageIcon, Sofa, Table2 } from 'lucide-react';

export const getCategoryIcon = (category) => {
	if (!category) return <ImageIcon size={18} />;

	const name = category.name.toLowerCase();
	if (name.includes('chair')) return <Chair size={18} />;
	if (name.includes('sofa') || name.includes('loveseat')) return <Sofa size={18} />;
	if (name.includes('bed') || name === 'beds') return <Bed size={18} />;
	if (name.includes('table')) return <Table2 size={18} />;
	if (name.includes('door')) return <DoorOpen size={18} />;

	return <ImageIcon size={18} />;
};
