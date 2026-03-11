import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
	try {
		const {
			amount,
			productinfo,
			firstname,
			email,
			phone,
			userId,
			productId,
			couponCode,
			finalAmount,
		} = await request.json();

		if (!amount || !productinfo || !firstname || !email || !phone) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 },
			);
		}

		const key = process.env.PAYU_MERCHANT_KEY;
		const salt = process.env.PAYU_MERCHANT_SALT;

		if (!key || !salt) {
			return NextResponse.json(
				{ success: false, message: "PayU configuration missing" },
				{ status: 500 },
			);
		}

		// Generate random transaction ID
		const txnid = `txnid_${Date.now()}`;

		// UDFs to pass custom data
		const udf1 = userId || "";
		const udf2 = productId || "";
		// serialize order context
		const udf3 = JSON.stringify({
			couponCode: couponCode || null,
			finalAmount: finalAmount,
			currency: "INR"
		});
		const udf4 = "";
		const udf5 = "";

		// Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
		const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

		const hash = crypto.createHash("sha512").update(hashString).digest("hex");

		return NextResponse.json({
			success: true,
			hash,
			txnid,
			key,
		});
	} catch (error) {
		console.error("Error initiating PayU transaction:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 },
		);
	}
}
