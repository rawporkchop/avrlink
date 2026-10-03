import scrubhud from '../assets/scrubhud.mp4';

export default function FeatureShowcase() {
  return (
    <section className="feature-showcase-section" id="showcase">
      <div className="feature-text-content">
        <h2 className="feature-title">Volume control, down to one gesture.</h2>
        <p className="feature-caption">
          AVR Link's ScrubHud lives quietly in your menu bar until you need it. It shouldn't be a hassle to listen to music.
        </p>
        <ul className="feature-bullets">
          <li>Hold and drag anywhere in the menu bar to open the ScrubHud and adjust the Main zone's volume instantly.</li>
          <li>Turn on Open at Login and it's already running by the time you sit down to listen.</li>
          <li>One app follows you across Mac, iPhone, and Apple Watch. A unified platform for your high-end receiver.</li>
        </ul>
      </div>
      <div className="feature-media-container">
        <video autoPlay loop muted playsInline>
          <source src={scrubhud} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
