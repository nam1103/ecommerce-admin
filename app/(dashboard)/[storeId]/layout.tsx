import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		storeId: string;
	};
}) {
	const { userId } = auth();
	let store;

	if (!userId) {
		redirect("/sign-in");
	}

	if (ObjectId.isValid(params.storeId)) {
		store = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
	}

	if (!store) {
		redirect("/");
	}

	return (
		<>
			<Navbar />
			{children}
		</>
	);
}