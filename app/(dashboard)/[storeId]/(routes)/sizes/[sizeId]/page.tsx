import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import { SizeForm } from "./components/size-form";

const SizesPage = async ({ params }: { params: { sizeId: string } }) => {
	let size = null;

	if (ObjectId.isValid(params.sizeId)) {
		size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			},
		});
	}

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizeForm initialData={size} />
			</div>
		</div>
	);
};

export default SizesPage;
