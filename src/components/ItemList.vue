<template>
  <div>
    <ol id="olTag">
      <li class="itemLi" v-for="(inputDataObj, index) in itemsArr">
        <input
          type="checkbox"
          v-bind:checked="inputDataObj.done"
          v-on:click="changeStatus(index)"
        />
        <input
          class="liInput"
          v-bind:id="'liInput' + index"
          v-model="itemsArr[index].inputData"
          type="text"
          v-on:keyup.enter="editInput(index)"
        />
        <button class="delButton" v-bind:id="index" v-on:click="onDeleteBtnClick(index)">del</button>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    itemsArr: {
      type: Array,
      require: true
    }
  },
  methods: {
    onDeleteBtnClick(index) {
      this.itemsArr.splice(index, 1);
      localStorage.setItem("gAllInputData", JSON.stringify(this.itemsArr));
    },
    changeStatus(index) {
      this.itemsArr[index] = {inputData: this.itemsArr[index].inputData, done: !this.itemsArr[index].done}
      localStorage.setItem("gAllInputData", JSON.stringify(this.itemsArr));
    },
    editInput(index) {
      var counter = 0;
      if (this.itemsArr[index].inputData == '') {alert("输入为空!");return}
      this.itemsArr.forEach(element => {
        element.inputData == this.itemsArr[index].inputData ? counter ++ : ''
      });
      counter == 1 ? localStorage.setItem("gAllInputData", JSON.stringify(this.itemsArr)) : alert("重复输入！！");
    }
  }
};
</script>