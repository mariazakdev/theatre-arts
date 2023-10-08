import "./GalleryCard.scss";

function GalleryCard({content, photo}){
    return(
        <article className="gallery-card">
            <img src={photo} alt={content} />
            <p>{content}</p>
        </article>
    );
};

export default GalleryCard;