import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CardMetrics = ({ metrics }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{metrics.map((metric) => (
				<Card key={metric.label}>
					<CardHeader>
						<CardTitle>{metric.value}</CardTitle>
						<CardDescription>{metric.label}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className={
									metric.changeType === 'positive'
										? 'bg-green-200 text-green-800'
										: 'bg-red-200 text-red-800'
								}
							>
								{metric.change}
							</Badge>
							<CardDescription>from last week</CardDescription>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default CardMetrics;
