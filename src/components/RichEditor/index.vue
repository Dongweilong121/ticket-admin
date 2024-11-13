<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
      <Editor :defaultConfig="editorConfig" :mode="mode" :value="modelValue" style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus"
        @onBlur="handleBlur" @customAlert="customAlert" />
    </div>
  </div>
</template>

<script>
import { ref, shallowRef, onMounted, onBeforeUnmount, defineComponent, watch } from 'vue';
import '@wangeditor-next/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';

export default defineComponent({
  components: { Editor, Toolbar },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholderStr: String
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const editorRef = shallowRef();

    watch(() => props.modelValue, (newValue) => {
      const editor = editorRef.value;
      if (editor && newValue !== editor.getHtml()) {
        editor.setHtml(newValue || '');
      }
    });

    const toolbarConfig = {
      excludeKeys: [
        'emotion', // 表情
        "insertLink",    // 链接
        'group-image',   // 图片
        "group-video",   // 视频
      ]
    };
    const editorConfig = { placeholder: props.placeholderStr || '请输入内容...' };

    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor) editor.destroy();
    });

    const handleCreated = (editor) => {
      console.log('created', editor);
      editorRef.value = editor;
      if (props.modelValue) {
        editor.setHtml(props.modelValue);
      }
    };
    const handleChange = (editor) => {
      const html = editor.getHtml();
      emit('update:modelValue', html);
      emit('change', html);
    };
    const handleDestroyed = (editor) => {
      console.log('destroyed', editor);
    };
    const handleFocus = (editor) => {
      console.log('focus', editor);
    };
    const handleBlur = (editor) => {
      console.log('blur', editor);
    };
    const customAlert = (info, type) => {
      alert(`【自定义提示】${type} - ${info}`);
    };
    const customPaste = (editor, event, callback) => {
      console.log('ClipboardEvent 粘贴事件对象', event);
      editor.insertText('xxx');
      callback(false); // 阻止默认粘贴行为
    };

    const insertText = () => {
      const editor = editorRef.value;
      if (editor) editor.insertText('hello world');
    };

    const printHtml = () => {
      const editor = editorRef.value;
      if (editor) console.log(editor.getHtml());
    };

    const disable = () => {
      const editor = editorRef.value;
      if (editor) editor.disable();
    };

    return {
      editorRef,
      mode: 'default',
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      insertText,
      printHtml,
      disable,
    };
  },
});
</script>
