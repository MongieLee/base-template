<template>
  <div id="wangEditor" @input="this.editorOnChange"></div>
</template>

<script>
import E from "wangeditor";
import FileService from "services/file";

export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    wHeight: {
      type: Number,
      default: 400
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  name: "wangEditor",
  data() {
    return {
      instance: null
    };
  },
  mounted() {
    this.initialEditor();
  },
  beforeDestroy() {
    this.instance.destroy();
    this.editor = null;
  },
  watch:{
    value(newValue){
      if(newValue !== this.value){
        this.instance.txt.html(this.value);
      }
    }
  },
  methods: {
    initialEditor() {
      this.instance = new E("#wangEditor");
      const { instance } = this;
      instance.height = this.wHeight;
      instance.config.placeholder = this.placeholder;
      instance.config.customUploadImg = async function(resultFiles,insertImgFn){
        const formData = new FormData();
        formData.append("FormFile",resultFiles[0]);
        formData.append("FileName",resultFiles[0].name);
        const res = await FileService.uploadFile(formData);
        insertImgFn(res.data.path)
      }
      instance.create();
      instance.txt.html(this.value)
    },
    editorOnChange(e){
      console.log("editorOnChange"+e.target.innerHTML);
      this.$emit("change",e.target.innerHTML)
      this.$emit("input",e.target.innerHTML)
    }
  }
};
</script>

<style scoped>

</style>