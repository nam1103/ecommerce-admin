"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrdersClientProps {
	data: OrderColumn[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<Heading
				title={`Orders (${data.length})`}
				description="Manage orders of your store"
			/>

			<Separator />
			<DataTable columns={columns} data={data} searchKey="products" />
		</>
	);
};

export default OrdersClient;
