<style scoped>
  .loader {
    --color: #a5a5b0;
    --size: 40px;
    position: relative;
    width: var(--size);
    height: var(--size);
  }

  .loader span {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid var(--color);
    border-bottom: 1px solid transparent;
    border-radius: 100%;
    animation: keyframes-rotate .8s infinite linear;
  }

  .loader svg {
    width: 100%;
    height: 100%;
    padding: 25%;
    fill: var(--color);
    animation: keyframes-blink .8s infinite ease-in-out;
  }

  @keyframes keyframes-rotate {
    0% {
      transform: rotate(360deg);
    }
  }

  @keyframes keyframes-blink {
    50% {
      opacity: 0.8;
    }
  }
</style>

<template>
  <div class="loader">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V352c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path></svg>
    <span></span>
  </div>
</template>
