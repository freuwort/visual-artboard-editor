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
            elementId: 'c5e7eabe-ccc7-4b69-9ba1-90c70193f436',
            elementName: 'Element 1',
            elementType: 'span',
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
