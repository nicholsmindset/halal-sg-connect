import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import ListingForm from '@/components/forms/ListingForm';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ListingForm listingId={id} />
      </div>
    </div>
  );
};

export default EditListing;
