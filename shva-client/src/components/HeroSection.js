import illustration from '../assets/hero-illustration.svg';
import phone from '../assets/hero-phone.svg';

function HeroSection({ t }) {
  return (
    <section className="hero">
      <div className="badge">{t.badge}</div>

      <h1 className="title">{t.title}</h1>

      <div className="hero-visual" aria-hidden="true">
        <img
          src={illustration}
          alt={t.illustrationAlt}
          className="hero-illustration"
        />

        <img src={phone} alt={t.phoneAlt} className="hero-phone" />
      </div>
    </section>
  );
}

export default HeroSection;
