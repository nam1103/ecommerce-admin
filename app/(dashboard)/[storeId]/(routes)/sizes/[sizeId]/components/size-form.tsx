"use client";

import { Size } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface SizeFormProps {
	initialData: Size | null;
}

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
});

type SizeFormValue = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const params = useParams();
	const router = useRouter();

	const title = initialData ? "Edit size" : "Create size";
	const description = initialData ? "Edit your size" : "Add a new size";
	const toastMessage = initialData ? "Size updated." : "Size created.";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<SizeFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || { name: "", value: "" },
	});

	const onSubmit = async (data: SizeFormValue) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/sizes/${params.sizeId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success("Size deleted");
		} catch (error) {
			toast.error("Make you sure your removed all products using this size!");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" disabled={loading} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							control={form.control}
							name="name"
						/>
						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											placeholder="Size Value"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							control={form.control}
							name="value"
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
