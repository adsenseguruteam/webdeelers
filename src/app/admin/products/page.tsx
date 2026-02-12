"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Package,
	Plus,
	Search,
	Edit,
	Trash2,
	Eye,
	Loader2,
	CheckCircle,
	XCircle,
	Clock,
	Star,
	Upload,
	X,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import AdminSidebar from "@/components/admin-sidebar";
import Link from "next/link";

interface Product {
	_id: string;
	title: string;
	slug: string;
	description: string;
	shortDescription?: string;
	category: string;
	price: number;
	comparePrice?: number;
	currency: string;
	images: string[];
	thumbnail?: string;
	status: "draft" | "active" | "archived";
	stock: number;
	salesCount: number;
	rating: {
		average: number;
		count: number;
	};
	isFeatured: boolean;
	isBestseller: boolean;
	createdAt: string;
}

const categories = [
	// Product Types
	{ value: "script", label: "💻 Code Script" },
	{ value: "tool", label: "🛠️ Tool/Software" },
	{ value: "course", label: "📚 Course" },
	{ value: "service", label: "🎯 Service" },
	{ value: "template", label: "📄 Template" },
	{ value: "ebook", label: "📖 E-Book" },
	// Tech Categories
	{ value: "wordpress", label: "WordPress" },
	{ value: "react", label: "React" },
	{ value: "nextjs", label: "Next.js" },
	{ value: "nodejs", label: "Node.js" },
	{ value: "python", label: "Python" },
	{ value: "php", label: "PHP" },
	// Other Categories
	{ value: "automation", label: "Automation" },
	{ value: "seo", label: "SEO" },
	{ value: "marketing", label: "Marketing" },
	{ value: "design", label: "Design" },
	{ value: "adsense", label: "AdSense" },
	{ value: "monetization", label: "Monetization" },
	{ value: "other", label: "Other" },
];

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [uploadingImage, setUploadingImage] = useState(false);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		shortDescription: "",
		category: "script",
		price: "",
		comparePrice: "",
		currency: "USD",
		status: "draft",
		stock: "-1",
		isFeatured: false,
		isBestseller: false,
		images: [] as string[],
		thumbnail: "",
		features: [] as string[],
		demoUrl: "",
		videoUrl: "",
	});

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await axios.get("/api/products?limit=100&status=");
			setProducts(response.data.products || []);
		} catch (error) {
			toast.error("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleCreate = async () => {
		try {
			const payload = {
				...formData,
				price: parseFloat(formData.price),
				comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
				stock: parseInt(formData.stock),
			};
			
			await axios.post("/api/products", payload);
			toast.success("Product created successfully");
			setIsAddDialogOpen(false);
			resetForm();
			fetchProducts();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to create product");
		}
	};

	const handleUpdate = async () => {
		if (!editingProduct) return;
		
		try {
			const payload = {
				...formData,
				price: parseFloat(formData.price),
				comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
				stock: parseInt(formData.stock),
			};
			
			await axios.put(`/api/products/${editingProduct._id}`, payload);
			toast.success("Product updated successfully");
			setIsEditDialogOpen(false);
			setEditingProduct(null);
			fetchProducts();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to update product");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;
		
		try {
			await axios.delete(`/api/products/${id}`);
			toast.success("Product deleted successfully");
			fetchProducts();
		} catch (error) {
			toast.error("Failed to delete product");
		}
	};

	const openEditDialog = (product: Product) => {
		setEditingProduct(product);
		setFormData({
			title: product.title,
			description: product.description,
			shortDescription: product.shortDescription || "",
			category: product.category,
			price: product.price.toString(),
			comparePrice: product.comparePrice?.toString() || "",
			currency: product.currency,
			status: product.status,
			stock: product.stock.toString(),
			isFeatured: product.isFeatured,
			isBestseller: product.isBestseller,
			images: product.images || [],
			thumbnail: product.thumbnail || "",
			features: [],
			demoUrl: "",
			videoUrl: "",
		});
		setIsEditDialogOpen(true);
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			shortDescription: "",
			category: "script",
			price: "",
			comparePrice: "",
			currency: "USD",
			status: "draft",
			stock: "-1",
			isFeatured: false,
			isBestseller: false,
			images: [],
			thumbnail: "",
			features: [],
			demoUrl: "",
			videoUrl: "",
		});
	};

	const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploadingImage(true);
		const uploadedImages: string[] = [];

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				
				// Get ImageKit auth
				const authRes = await axios.get("/api/imagekit/auth");
				const { token, expire, signature, publicKey } = authRes.data;

				const form = new FormData();
				form.append("file", file);
				form.append("fileName", file.name);
				form.append("publicKey", publicKey);
				form.append("signature", signature);
				form.append("expire", String(expire));
				form.append("token", token);
				form.append("useUniqueFileName", "true");

				const uploadRes = await axios.post(
					"https://upload.imagekit.io/api/v1/files/upload",
					form
				);

				if (uploadRes.data && uploadRes.data.url) {
					uploadedImages.push(uploadRes.data.url);
				}
			}

			if (uploadedImages.length > 0) {
				setFormData((prev) => ({
					...prev,
					images: [...prev.images, ...uploadedImages],
					// Set first image as thumbnail if no thumbnail set
					thumbnail: prev.thumbnail || uploadedImages[0],
				}));
				toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
			}
		} catch (error: any) {
			console.error("Upload failed:", error);
			// Fallback to local upload if ImageKit fails
			try {
				for (let i = 0; i < files.length; i++) {
					const file = files[i];
					const formData = new FormData();
					formData.append("file", file);
					const localRes = await axios.post("/api/upload", formData);
					if (localRes.data.success) {
						uploadedImages.push(localRes.data.url);
					}
				}
				if (uploadedImages.length > 0) {
					setFormData((prev) => ({
						...prev,
						images: [...prev.images, ...uploadedImages],
						thumbnail: prev.thumbnail || uploadedImages[0],
					}));
					toast.success(`${uploadedImages.length} image(s) uploaded successfully (local)`);
				}
			} catch (localError) {
				toast.error("Image upload failed");
			}
		} finally {
			setUploadingImage(false);
		}
	}, []);

	const removeImage = useCallback((index: number) => {
		setFormData((prev) => {
			const newImages = prev.images.filter((_, i) => i !== index);
			const wasThumbnail = prev.images[index] === prev.thumbnail;
			return {
				...prev,
				images: newImages,
				// If removed image was thumbnail, set new thumbnail
				thumbnail: wasThumbnail ? (newImages[0] || "") : prev.thumbnail,
			};
		});
		toast.success("Image removed");
	}, []);

	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
		const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
		return matchesSearch && matchesCategory && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
						<CheckCircle size={12} /> Active
					</span>
				);
			case "draft":
				return (
					<span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
						<Clock size={12} /> Draft
					</span>
				);
			case "archived":
				return (
					<span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
						<XCircle size={12} /> Archived
					</span>
				);
			default:
				return null;
		}
	};

	// Simple inline form - no nested component to avoid focus issues
	const renderProductForm = (isEdit = false) => (
		<div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
			<div className="grid grid-cols-2 gap-4">
				<div className="col-span-2">
					<Label>Title</Label>
					<Input
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						placeholder="Product title"
					/>
				</div>
				
				<div className="col-span-2">
					<Label>Short Description</Label>
					<Input
						value={formData.shortDescription}
						onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
						placeholder="Brief description (max 300 chars)"
						maxLength={300}
					/>
				</div>
				
				<div className="col-span-2">
					<Label>Full Description</Label>
					<Textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Detailed product description"
						rows={4}
					/>
				</div>
				
				<div className="col-span-2">
					<Label>Category</Label>
					<Select
						value={formData.category}
						onValueChange={(value) => setFormData({ ...formData, category: value })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				
				<div>
					<Label>Price</Label>
					<Input
						type="number"
						value={formData.price}
						onChange={(e) => setFormData({ ...formData, price: e.target.value })}
						placeholder="0.00"
					/>
				</div>
				
				<div>
					<Label>Compare Price</Label>
					<Input
						type="number"
						value={formData.comparePrice}
						onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
						placeholder="0.00"
					/>
				</div>
				
				<div>
					<Label>Currency</Label>
					<Select
						value={formData.currency}
						onValueChange={(value) => setFormData({ ...formData, currency: value })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="USD">USD</SelectItem>
							<SelectItem value="EUR">EUR</SelectItem>
							<SelectItem value="GBP">GBP</SelectItem>
							<SelectItem value="INR">INR</SelectItem>
						</SelectContent>
					</Select>
				</div>
				
				<div>
					<Label>Stock (-1 for unlimited)</Label>
					<Input
						type="number"
						value={formData.stock}
						onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
					/>
				</div>
				
				<div>
					<Label>Status</Label>
					<Select
						value={formData.status}
						onValueChange={(value: any) => setFormData({ ...formData, status: value })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="draft">Draft</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="archived">Archived</SelectItem>
						</SelectContent>
					</Select>
				</div>
				
				<div className="col-span-2">
					<Label>Product Images</Label>
					<div className="space-y-4">
						{/* Image Upload Area */}
						<div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer relative">
							<Input
								type="file"
								accept="image/*"
								className="absolute inset-0 h-full opacity-0 cursor-pointer"
								onChange={handleImageUpload}
								disabled={uploadingImage}
								multiple
							/>
							{uploadingImage ? (
								<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
							) : (
								<div className="flex flex-col items-center text-slate-500">
									<div className="p-3 bg-slate-100 rounded-full mb-2">
										<Upload size={20} />
									</div>
									<span className="text-sm font-medium">Click to upload images</span>
									<span className="text-xs text-slate-400">JPG, PNG, WebP (Max 5 images)</span>
								</div>
							)}
						</div>
						
						{/* Image Previews */}
						{formData.images.length > 0 && (
							<div className="grid grid-cols-5 gap-3">
								{formData.images.map((img, idx) => (
									<div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
										<img src={img} alt="" className="w-full h-full object-cover" />
										<div className="absolute top-1 right-1 flex gap-1">
											<Button
												size="sm"
												variant="secondary"
												className="h-6 w-6 p-0"
												onClick={() => setFormData({ ...formData, thumbnail: img })}
												title="Set as thumbnail"
											>
												{formData.thumbnail === img ? (
													<Star size={12} className="text-amber-500 fill-amber-500" />
												) : (
													<Star size={12} />
												)}
											</Button>
											<Button
												size="sm"
												variant="destructive"
												className="h-6 w-6 p-0"
												onClick={() => removeImage(idx)}
											>
												<X size={12} />
											</Button>
										</div>
										{formData.thumbnail === img && (
											<div className="absolute bottom-0 left-0 right-0 bg-amber-500 text-white text-xs text-center py-0.5">
												Thumbnail
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
				
				<div className="col-span-2">
					<Label>Demo URL</Label>
					<Input
						value={formData.demoUrl}
						onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
						placeholder="https://example.com/demo"
					/>
				</div>
				
				<div className="col-span-2 flex gap-4">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={formData.isFeatured}
							onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
							className="w-4 h-4 rounded border-slate-300"
						/>
						<span className="text-sm">Featured Product</span>
					</label>
					
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={formData.isBestseller}
							onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
							className="w-4 h-4 rounded border-slate-300"
						/>
						<span className="text-sm">Bestseller</span>
					</label>
				</div>
			</div>
			
			<div className="flex justify-end gap-3 pt-4">
				<Button variant="outline" onClick={() => isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}>
					Cancel
				</Button>
				<Button
					onClick={isEdit ? handleUpdate : handleCreate}
					className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
				>
					{isEdit ? "Update Product" : "Create Product"}
				</Button>
			</div>
		</div>
	);

	return (
		<div className="flex min-h-[calc(100vh-85px)] bg-gradient-to-br from-slate-50 via-white to-slate-100">
			<AdminSidebar />

			<main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8">
				{/* Header */}
				<div className="mb-8 mt-5 md:mt-0">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
								<Package size={24} className="text-white" />
							</div>
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-slate-900">
									Shop Products
								</h1>
								<p className="text-slate-500 text-sm">
									Manage your digital products, scripts, courses & services
								</p>
							</div>
						</div>

						<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
							<DialogTrigger asChild>
								<Button className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 gap-2">
									<Plus size={18} />
									Add Product
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Add New Product</DialogTitle>
								</DialogHeader>
								{renderProductForm()}
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					{[
						{ label: "Total Products", value: products.length, color: "from-blue-500 to-indigo-500" },
						{ label: "Active", value: products.filter(p => p.status === "active").length, color: "from-emerald-500 to-teal-500" },
						{ label: "Drafts", value: products.filter(p => p.status === "draft").length, color: "from-amber-500 to-orange-500" },
						{ label: "Total Sales", value: products.reduce((sum, p) => sum + (p.salesCount || 0), 0), color: "from-violet-500 to-purple-500" },
					].map((stat, i) => (
						<Card key={i} className="bg-white border-slate-200 shadow-sm">
							<CardContent className="p-4">
								<p className="text-xs text-slate-500 mb-1">{stat.label}</p>
								<p className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
									{stat.value}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
						<Input
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
							<SelectItem value="archived">Archived</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Products Grid */}
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="animate-spin text-orange-500" size={32} />
					</div>
				) : filteredProducts.length === 0 ? (
					<Card className="bg-slate-50 border-dashed">
						<CardContent className="p-12 text-center">
							<Package size={48} className="mx-auto mb-4 text-slate-300" />
							<h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
							<p className="text-slate-500 mb-4">Create your first product to get started</p>
							<Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-orange-500 to-rose-500">
								<Plus size={18} className="mr-2" />
								Add Product
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProducts.map((product) => (
							<Card key={product._id} className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
								<div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
									{product.thumbnail ? (
										<img
											src={product.thumbnail}
											alt={product.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<Package size={48} className="text-slate-300" />
										</div>
									)}
									<div className="absolute top-2 right-2 flex gap-1">
										{product.isFeatured && (
											<span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
												Featured
											</span>
										)}
										{product.isBestseller && (
											<span className="px-2 py-1 bg-violet-500 text-white text-xs font-medium rounded-full">
												Bestseller
											</span>
										)}
									</div>
									<div className="absolute bottom-2 left-2">
										{getStatusBadge(product.status)}
									</div>
								</div>
								
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-2">
										<div>
											<p className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</p>
											<h3 className="font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
										</div>
									</div>
									
									<p className="text-sm text-slate-600 line-clamp-2 mb-3">{product.shortDescription || product.description}</p>
									
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-baseline gap-2">
											<span className="text-lg font-bold text-slate-900">
												{product.currency} {product.price}
											</span>
											{product.comparePrice && product.comparePrice > 0 && (
												<span className="text-sm text-slate-400 line-through">
													{product.currency} {product.comparePrice}
												</span>
											)}
										</div>
										<div className="flex items-center gap-1 text-sm text-slate-500">
											<Star size={14} className="text-amber-400 fill-amber-400" />
											<span>{product.rating?.average?.toFixed(1) || "0.0"}</span>
											<span className="text-slate-400">({product.rating?.count || 0})</span>
										</div>
									</div>
									
									<div className="flex items-center justify-between pt-3 border-t border-slate-100">
										<span className="text-xs text-slate-500">
											{product.salesCount || 0} sales
										</span>
										<div className="flex gap-1">
											<Link href={`/shop/${product.slug}`} target="_blank">
												<Button size="sm" variant="ghost" className="h-8 w-8 p-0">
													<Eye size={16} className="text-slate-500" />
												</Button>
											</Link>
											<Button
												size="sm"
												variant="ghost"
												className="h-8 w-8 p-0"
												onClick={() => openEditDialog(product)}
											>
												<Edit size={16} className="text-blue-500" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												className="h-8 w-8 p-0"
												onClick={() => handleDelete(product._id)}
											>
												<Trash2 size={16} className="text-rose-500" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Edit Dialog */}
				<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Edit Product</DialogTitle>
						</DialogHeader>
						{renderProductForm(true)}
					</DialogContent>
				</Dialog>
			</main>
		</div>
	);
}
