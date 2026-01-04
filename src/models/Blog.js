import mongoose from "mongoose";

const slugifyTitle = (title) =>
	title
		?.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
			index: true,
		},
		content: {
			type: String, // Rich text HTML
			required: true,
		},
		image: {
			type: String,
		},
		category: {
			type: String,
			default: "General",
		},
		seo: {
			metaTitle: String,
			metaDescription: String,
			keywords: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "published", "rejected", "draft"],
			default: "pending",
		},
		rejectionReason: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

blogSchema.pre("save", function (next) {
	if (!this.isModified("title") && this.slug) {
		return next();
	}
	const baseSlug = slugifyTitle(this.title);
	// Basic slug uniqueness handling could be improved but simple for now
	this.slug = baseSlug || this.slug;
	next();
});

// Update slug on title change during update
blogSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate() || {};
	const title = update.title || update.$set?.title;

	if (title) {
		const newSlug = slugifyTitle(title);
		if (update.$set) {
			update.$set.slug = newSlug;
		} else {
			update.slug = newSlug;
		}
		this.setUpdate(update);
	}
	next();
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
