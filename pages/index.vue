<template>
  <div class="min-vh-100 d-flex flex-column justify-content-center text-center p-4">
    <!-- Hero Section -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-3 fw-bold mb-4">
            <img src="/public/logo.png" alt="Wiki XIV" class="" style="height: 250px;">
          </h1>
          <p>
            We're not lazy, we're just conserving energy.
            <br></br>
            <br>
            Every raidplan that we used can be found here 
            <br>
            <a href="https://mczub.github.io/wtfdig/">https://mczub.github.io/wtfdig/</a>
          </p>
          
        </div>
      </div>

      <!-- Features -->
      <div class="row g-4 mt-5">
        <div class="col-12 col-md-4 m-auto">
          <NuxtLink 
            to="/articles"
            class="card h-100 text-decoration-none text-reset hover-shadow"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4 card-title mb-3">
                <span class="text-primary me-2">📚</span>
                Documentation
              </h3>
              <p class="card-text text-muted">Access to docs for Tools and Plugins</p>
            </div>
          </NuxtLink>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
  min-height: calc(100vh - 16rem);
}

.bg-gray-750 {
  background-color: rgb(31, 41, 55);
}
</style> 