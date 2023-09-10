import prismadb from "@/lib/prismadb";
import SizesClient from "./components/SizesClient";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formmatedSizes: SizeColumn[] = sizes.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizesClient data={formmatedSizes} />
			</div>
		</div>
	);
};

export default SizesPage;
