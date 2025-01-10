<template>
    <main>
        <ArtboardEditor :content="content" :width="500" :height="500"/>
    </main>
</template>

<script setup lang="ts">
    import ArtboardEditor from '@/components/ArtboardEditor/ArtboardEditor.vue'
    import { ref } from 'vue'

    const content = ref([
        {
            elementId: '678451367',
            elementName: 'Element 1',
            elementType: 'div',
            position: 'fixed',
            zIndex: 1,
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            testProp: 'test',
        }
    ])
</script>

<style lang="sass" scoped>
</style>
