import Header from "@/components/Header";
import ListingForm from "@/components/forms/ListingForm";

const CreateListing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ListingForm />
      </div>
    </div>
  );
};

export default CreateListing;