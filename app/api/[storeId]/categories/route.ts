import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await request.json();
		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!ObjectId.isValid(billboardId)) {
			return new NextResponse("BillboardId is required", { status: 400 });
		}

		if (!ObjectId.isValid(params.storeId)) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(category);
	} catch (error: any) {
		console.log("[CATEGORIES_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const categories = await prismadb.category.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(categories);
	} catch (error: any) {
		console.log("[CATEGORIES_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
