"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();

	const routes = [
		{
			href: `/${params.storeId}`,
			label: "Overview",
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/billboards`,
			label: "Billboards",
			active: pathname.includes("/billboards"),
		},
		{
			href: `/${params.storeId}/categories`,
			label: "Categories",
			active: pathname.includes("categories"),
		},
		{
			href: `/${params.storeId}/sizes`,
			label: "Sizes",
			active: pathname.includes("sizes"),
		},
		{
			href: `/${params.storeId}/colors`,
			label: "Colors",
			active: pathname.includes("colors"),
		},
		{
			href: `/${params.storeId}/products`,
			label: "Products",
			active: pathname.includes("products"),
		},
		{
			href: `/${params.storeId}/orders`,
			label: "Orders",
			active: pathname.includes("orders"),
		},
		{
			href: `/${params.storeId}/settings`,
			label: "Settings",
			active: pathname.includes("settings"),
		},
	];

	return (
		<nav
			className={cn(
				"flex items-center space-x-4 lg:space-x-6 overflow-x-auto",
				className
			)}
		>
			{routes.map((route) => (
				<Link
					href={route.href}
					key={route.href}
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						route.active
							? "text-black dark:text-white"
							: "text-muted-foreground"
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
