import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getDataFromToken } from "@/lib/auth";

// GET /api/products/[id]/download - Get download URL for a product
export async function GET(request, { params }) {
	try {
		const userId = getDataFromToken(request);
		
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized. Please login." },
				{ status: 401 }
			);
		}

		await connectDB();
		const { id } = await params;
		
		// 1. Ownership Verification
		// We only allow download if user has a completed order for this product
		const hasPurchased = await Order.findOne({
			user: userId,
			paymentStatus: "completed",
			status: "completed",
			$or: [
				{ "items.product": id },
				{ product: id } // Fallback for legacy items
			]
		});

		if (!hasPurchased) {
			console.log(`Download denied for user ${userId} for product ${id}. No completed order found.`);
			return NextResponse.json(
				{ success: false, message: "Access Denied: Product purchase not verified or order still processing." },
				{ status: 403 }
			);
		}

		// 2. Find the product details
		const product = await Product.findById(id);
		
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Product details not found" },
				{ status: 404 }
			);
		}
		
		// 3. Extract Download URL
		const options = product.downloadOptions;
		if (!options || (!options.file?.url && !options.link)) {
			console.error(`Download config missing for product ${id}:`, options);
			return NextResponse.json(
				{ success: false, message: "This product does not have a downloadable file attached. Please contact support." },
				{ status: 404 }
			);
		}
		
		let downloadUrl = null;
		
		// Handle direct upload vs external link
		if (options.type === "upload" && options.file?.url) {
			downloadUrl = options.file.url;
		} else if (options.type === "link" && options.link) {
			downloadUrl = options.link;
		}
		
		if (!downloadUrl) {
			return NextResponse.json(
				{ success: false, message: "Internal Error: Download link is malformed or missing." },
				{ status: 500 }
			);
		}
		
		return NextResponse.json({
			success: true,
			downloadUrl,
			type: options.type,
			fileName: options.file?.name || "download"
		});
	} catch (error) {
		console.error("Critical download error:", error);
		return NextResponse.json(
			{ success: false, message: "An error occurred while retrieving your asset." },
			{ status: 500 }
		);
	}
}