// // app/listings/[id]/page.tsx
// import { notFound } from 'next/navigation';
// import { getListingById } from '@/actions/listing-actions';
// import ListingDetails from '@/components/listings/ListingDetails';
// import RentalRequestForm from '@/components/listings/RentalRequestForm';
// import { getCurrentUser } from '@/actions/auth-actions';

// export default async function ListingDetailsPage({ params }: { params: { id: string } }) {
//   const listingData = await getListingById(params.id);
//   const currentUser = await getCurrentUser();

//   if (!listingData?.success) {
//     notFound();
//   }

//   const { listing } = listingData.data;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <ListingDetails listing={listing} />

//       {currentUser && currentUser.role === 'tenant' && (
//         <div className="mt-8">
//           <RentalRequestForm listingId={params.id} />
//         </div>
//       )}
//     </div>
//   );
// }
