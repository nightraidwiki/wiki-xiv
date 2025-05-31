<template>
  <div class="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center px-4">
    <!-- Hero Section -->
    <div class="max-w-3xl mx-auto">
      <h1 class="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-text">
        Wiki XIV
      </h1>
      <p class="text-xl text-gray-300 mb-16 leading-relaxed">
        Your modern and intuitive documentation platform. Explore our knowledge base and stay informed.
      </p>
      
      <!-- Call to Action -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-32">
        <NuxtLink 
          to="/auth/login"
          class="button button-primary px-8 py-4"
        >
          Access Administration
        </NuxtLink>
      </div>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
      <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
        <h3 class="text-xl font-semibold mb-2">
          <span class="text-blue-400 mr-2">📚</span>
          Documentation
        </h3>
        <p class="text-gray-400">Access comprehensive and structured documentation</p>
      </div>
      
      <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
        <h3 class="text-xl font-semibold mb-2">
          <span class="text-blue-400 mr-2">🔍</span>
          Search
        </h3>
        <p class="text-gray-400">Quickly find the information you need</p>
      </div>
      
      <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
        <h3 class="text-xl font-semibold mb-2">
          <span class="text-blue-400 mr-2">✨</span>
          Interface
        </h3>
        <p class="text-gray-400">A modern and intuitive user experience</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-\[calc\(100vh-16rem\)\] {
  min-height: calc(100vh - 16rem);
}

.bg-gray-750 {
  background-color: rgb(31, 41, 55);
}
</style> 