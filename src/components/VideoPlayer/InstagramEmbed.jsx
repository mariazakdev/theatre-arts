function InstagramEmbed({ videoUrl }) {
    return (
      <div className="instagram-embed">
        <iframe
          src={videoUrl}
          width="500"
          height="600"
          frameBorder="0"
          scrolling="no"
          allowtransparency="true">
        </iframe>
      </div>
    );
  }
export default InstagramEmbed;  