<template>
  <div class="landing-page">
    <section class="hero-section">
      <div class="hero-card">
        <div class="hero-image" :style="{ backgroundImage: 'url(/hero_1.png)' }"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="logo-text-wrapper mb-4 animate-fade-in">
            <h1 class="logo-text">
              <span class="text-white">Wiki</span>
              <span class="text-accent">XIV</span>
            </h1>
            <div class="logo-underline"></div>
          </div>
          <p class="hero-subtitle mb-5 animate-slide-up">
            A gathering of resources and tools for <br>Final Fantasy XIV.
          </p>
          <div class="hero-buttons animate-slide-up-delayed">
            <NuxtLink to="/articles" class="btn-hero-primary">
              <i class="bi bi-journal-text me-2"></i>Articles
            </NuxtLink>
            <NuxtLink to="/repos" class="btn-hero-secondary">
              <i class="bi bi-code-slash me-2"></i>Repos
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- External Tools -->
    <div class="container py-5">
      <div class="row g-4 justify-content-center">
        <div class="col-12 col-md-4 animate-fade-in-up">
          <a href="https://wtfdig.info/" target="_blank" class="tool-card">
            <div class="tool-icon">🗺️</div>
            <h4>Raidplan</h4>
            <p>Easily visualize and plan your raid strategies.</p>
          </a>
        </div>
        <div class="col-12 col-md-4 animate-fade-in-up" style="animation-delay: 0.1s">
          <a href="https://discord.gg/b7ADJSgBXc" target="_blank" class="tool-card discord-card">
            <div class="tool-icon">
              <img src="https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png" alt="Discord Logo" class="tool-img">
            </div>
            <h4>Discord Auto Party</h4>
            <p>Discussion of accessibility software for FFXIV</p>
          </a>
        </div>
        <div class="col-12 col-md-4 animate-fade-in-up" style="animation-delay: 0.2s">
          <a href="https://www.hammertime.cyou/" target="_blank" class="tool-card">
            <div class="tool-icon">⏰</div>
            <h4>HammerTime</h4>
            <p>Quickly format your timestamps for Discord.</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Wiki XIV - Resources and Tools for FFXIV',
  description: 'A comprehensive collection of resources, documentation, and tools for Final Fantasy XIV, including raid planning, Discord integration, and plugin repositories.',
  ogTitle: 'Wiki XIV - Resources and Tools for FFXIV',
  ogDescription: 'Explore our database of FFXIV resources, plugins, and guides.',
  ogImage: '/logo_wiki.png',
  twitterCard: 'summary_large_image',
})

// Structured Data (JSON-LD)
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Wiki XIV",
        "url": "https://wiki-xiv.com",
        "description": "A gathering of resources and tools for Final Fantasy XIV",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://wiki-xiv.com/articles?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})
</script>

<style scoped>
.landing-page {
  /* On compense un peu le margin-top par défaut du layout si nécessaire */
  padding-top: 1rem;
}

/* Hero Card Styling */
.hero-section {
  padding: 0;
  margin-bottom: 2rem;
}

.hero-card {
  position: relative;
  height: 600px;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 10s ease;
  z-index: 1;
}

.hero-card:hover .hero-image {
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(18, 18, 18, 0.3) 0%, rgba(18, 18, 18, 0.9) 100%);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  padding: 3rem 2rem;
  max-width: 800px;
  color: white;
  width: 100%;
}

/* Stylized Logo Text */
.logo-text {
  font-size: 5.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -3px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  line-height: 1;
}

.text-accent {
  background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 15px rgba(96, 165, 250, 0.4));
}

.logo-underline {
  height: 5px;
  width: 120px;
  background: linear-gradient(to right, #60a5fa, #a855f7);
  margin: 1.5rem auto 0;
  border-radius: 10px;
  opacity: 0.8;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Buttons */
.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn-hero-primary {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  color: white;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px -5px rgba(13, 110, 253, 0.5);
}

.btn-hero-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 30px -5px rgba(13, 110, 253, 0.6);
  color: white;
}

.btn-hero-secondary {
  padding: 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

/* Tool Cards */
.tool-card {
  display: block;
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2rem;
  padding: 2.5rem;
  text-decoration: none;
  color: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
  height: 100%;
}

.tool-card:hover {
  background: #252525;
  transform: translateY(-10px);
  border-color: #60a5fa;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-img {
  height: 4rem;
  width: auto;
  object-fit: contain;
}

.tool-card h4 {
  font-weight: 800;
  margin-bottom: 1rem;
  color: #60a5fa;
  font-size: 1.5rem;
}

.tool-card p {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 0;
  line-height: 1.5;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 1s ease-out 0.2s both;
}

.animate-slide-up-delayed {
  animation: slideUp 1s ease-out 0.4s both;
}

.animate-fade-in-up {
  animation: slideUp 0.8s ease-out both;
}

@media (max-width: 992px) {
  .logo-text {
    font-size: 4rem;
  }
  .hero-card {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 3rem;
    letter-spacing: -1px;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  .btn-hero-primary, .btn-hero-secondary {
    padding: 0.8rem 2rem;
    width: 100%;
  }
}
</style>
 