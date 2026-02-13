"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';

interface Listing {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  thumbnail?: string;
  status: 'active' | 'sold' | 'draft' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  views?: number;
  slug?: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/user-listings');
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'sold':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <AdminSidebar role="user" />
    <div className=" md:ml-64 mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-2">
            Manage all your product listings in one place
          </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/create-listing')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          + Add New Listing
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="h-48 w-full bg-gray-200 animate-pulse" />
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 mt-2 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 mt-2 bg-gray-200 rounded animate-pulse" />
                <div className="flex justify-between items-center mt-4">
                  <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card 
              key={listing._id} 
              className="overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative">
                {listing.thumbnail || (listing.images && listing.images.length > 0) ? (
                  <img 
                    src={listing.thumbnail || listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <Badge 
                  className={`absolute top-3 right-3 capitalize ${getStatusVariant(listing.status)}`}
                >
                  {listing.status}
                </Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl truncate">{listing.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">${listing.price}</span>
                  <span>•</span>
                  <span className="ml-3 capitalize">{listing.category}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {listing.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(listing.createdAt)}</span>
                  <span>Updated: {formatDate(listing.updatedAt)}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <Link href={`/dashboard/edit-listing/${listing._id}`}>
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/listing/${listing.slug || listing._id}`} target="_blank">
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
          <p className="mt-1 text-gray-500 max-w-md mx-auto">
            Get started by creating your first product listing. Click the button above to add a new listing.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => router.push('/dashboard/create-listing')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Your First Listing
            </Button>
          </div>
        </div>
      )}
    </div>

    </div>
  );
}