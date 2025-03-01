<template>
    <div class="comment" id="comment" />
</template>
<script setup>
import { watch, onMounted } from 'vue'
import { useRoute } from 'vitepress'
const route = useRoute()
const initValine = (path) => {
    new Valine({
        el: '#comment',
        appId: 'BvOjd5ZYpsg3il3xKl7l5lIT-gzGzoHsz',
        appKey: '8Jp8lQfaLlCUlmet2KtXdmmW',
        path: path,
        avatar: 'mm',
        placeholder: '留下你的想法...',
        recordIP: true,

    })
}
watch(
    () => route.path,
    () => {
        console.log("监听路由变化");
        initValine(route.path);
    }
);
//加载完成之后才开始初始化
onMounted(() => {
    remoteImport('https://unpkg.com/valine@1.5.2/dist/Valine.min.js').then(() => initValine(route.path));
});

//动态加载js文件
function remoteImport(url) {
    return new Promise((resolve) => {
        let head = document.getElementsByTagName("head")[0];
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        head.appendChild(script);

        script.onload = function () {
            resolve();
        };
    });
}
</script>
<style scoped>
#comment {
    width: 100%;  
}
</style>