<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Import de la police Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Styles de base */
:root {
  --bs-body-font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Personnalisation du thème sombre */
body {
  background-color: #121212;
  color: #f8f9fa;
}

/* Personnalisation des cartes */
.card {
  background-color: #1e1e1e;
  border: 1px solid #333;
}

/* Personnalisation des formulaires */
.form-control, .form-select {
  background-color: #2d2d2d;
  border: 1px solid #444;
  color: #f8f9fa;
}

.form-control:focus, .form-select:focus {
  background-color: #2d2d2d;
  color: #f8f9fa;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
