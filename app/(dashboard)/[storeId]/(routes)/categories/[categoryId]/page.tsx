import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import { CategoryForm } from "./components/category-form";

const CategoriesPage = async ({
	params,
}: {
	params: { categoryId: string; storeId: string };
}) => {
	let category = null;

	if (ObjectId.isValid(params.categoryId)) {
		category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
		});
	}

	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoryForm initialData={category} billboards={billboards} />
			</div>
		</div>
	);
};

export default CategoriesPage;
