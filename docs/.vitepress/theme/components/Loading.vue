<style scoped>
  .loader {
    --color-success-300: #4bdf80;
    --color-success-500: #1ed760;
    --color-success-700: #18ac4d;
    display: block;
    justify-content: center;
    align-items: center;
  }

  .loader .form1,
  .loader .form2 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .square {
    width: 40px;
    height: 40px;
    margin: 2px;
    background-color: rgba(150, 150, 150, 0.253);
    border-radius: 5px;
    animation: blinking 0.8s ease-in-out infinite;
    opacity: 0;
  }

  @keyframes blinking {
    0% {
      opacity: 0.25;
      background-color: rgba(4, 160, 30, 0.589);
    }

    50% {
      opacity: 0.5;
      background-color: var(--color-success-300);
    }

    75% {
      opacity: 0.75;
      background-color: var(--color-success-500);
    }

    100% {
      opacity: 1;
      background-color: var(--color-success-700);
    }
  }

  .form1 .square:nth-child(1) {
    animation-delay: 0.2s;
  }

  .form1 .square:nth-child(2) {
    animation-delay: 0.4s;
  }

  .form2 .square:nth-child(2) {
    animation-delay: 0.6s;
  }

  .form2 .square:nth-child(1) {
    animation-delay: 0.8s;
  }
</style>

<template>
  <div class="loader">
    <div class="form1">
      <div class="square"></div>
      <div class="square"></div>
    </div>
    <div class="form2">
      <div class="square"></div>
      <div class="square"></div>
    </div>
  </div>
</template>
