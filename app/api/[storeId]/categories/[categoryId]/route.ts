import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();

		const body = await request.json();
		const { billboardId, name } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!ObjectId.isValid(billboardId)) {
			return new NextResponse("BillboardId is required", { status: 400 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
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

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!ObjectId.isValid(params.storeId)) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		if (!ObjectId.isValid(params.categoryId)) {
			return new NextResponse("Category id is required", { status: 400 });
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

		console.log(params.categoryId);

		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
