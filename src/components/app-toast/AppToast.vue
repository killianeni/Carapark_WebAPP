<template>
  <b-toast
    id="app-toast"
    :variant="toast.variant"
    solid
    auto-hide-delay="5000"
    toaster="b-toaster-bottom-right"
    append-toast
  >
    <template v-slot:toast-title>
      <div class="d-flex flex-grow-1 align-items-baseline">
        <strong class="mr-auto">Information</strong>
      </div>
    </template>
    <p>
      {{ toast.text }}
    </p>
  </b-toast>
</template>
<script lang="js" src="./AppToast.js"></script>
