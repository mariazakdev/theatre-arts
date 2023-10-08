import GalleryCard from "../GalleryCard/GalleryCard";
import "./FeaturedGallery.scss";

function FeaturedGallery() {
  // Example content and photo props
  const galleries = [
    {
      content: "Content 1",
      photo: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "Content 2",
      photo: "https://images.pexels.com/photos/50855/pexels-photo-50855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "Content 3",
      photo: "https://images.pexels.com/photos/6526847/pexels-photo-6526847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "Content 4",
      photo: "https://images.pexels.com/photos/4689910/pexels-photo-4689910.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  return (
    <section className="featured-gallery">
      {galleries.map((gallery, index) => (
        <GalleryCard key={index} content={gallery.content} photo={gallery.photo} />
      ))}
    </section>
  );
}

export default FeaturedGallery;
