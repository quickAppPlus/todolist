<template>
  <div>
      <span v-for="button in spanButtons" v-bind:id="button" v-on:click="showLiTag(button)">{{ button }}</span>
  </div>
</template>

<script>
export default {
  props: {
    spanButtons: {
      type: Array,
      require: true
    },
    itemsArr: {
      type: Array,
      require: true
    }
  },
  methods: {
    showLiTag(button) {
    },
    changeStatus(index) {
      this.itemsArr[index] = {inputData: this.itemsArr[index].inputData, done: !this.itemsArr[index].done}
      localStorage.setItem("gAllInputData", JSON.stringify(this.itemsArr));
    }
  }
};


</script>