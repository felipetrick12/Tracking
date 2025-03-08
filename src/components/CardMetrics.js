const CardMetrics = ({ metrics }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{metrics.map((metric) => (
				<div key={metric.label} className="bg-white rounded-lg border-t-2 border-gray-400 rounded-sm p-4">
					<p className="text-gray-900 text-md py-8">{metric.label}</p>
					<h2 className="text-xl font-semibold">{metric.value}</h2>
					<div className="flex items-center gap-1 mt-2">
						<span
							className={`text-xs font-semibold px-2 py-1 rounded-md ${
								metric.changeType === 'positive'
									? 'bg-green-200 text-green-800'
									: 'bg-red-200 text-red-800'
							}`}
						>
							{metric.change}
						</span>
						<span className="text-xs text-gray-500">from last week</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default CardMetrics;
