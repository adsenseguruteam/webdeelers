import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/listings/${params.id}`
  );
  const listing = await response.json();

  if (!listing) {
    return {
      title: "Listing Not Found",
      description: "The requested listing could not be found.",
    };
  }

  const title = `${listing.title} | ${listing.category} | WebDeelers`;
  const description =
    listing.description?.substring(0, 160) ||
    "Check out this listing on WebDeelers";
  const imageUrl = listing.thumbnail || "/placeholder.png";
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/listing/${params.id}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: "WebDeelers",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}
