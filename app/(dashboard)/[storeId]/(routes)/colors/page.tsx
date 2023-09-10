import prismadb from "@/lib/prismadb";
import SizesClient from "./components/ColorsClient";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
	const colors = await prismadb.color.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formmatedColors: ColorColumn[] = colors.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizesClient data={formmatedColors} />
			</div>
		</div>
	);
};

export default ColorsPage;
