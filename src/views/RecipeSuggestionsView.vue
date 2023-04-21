<template>
    <div class="container">
        <h1 class="title">Middagsforslag-tittel</h1>
        <SearchBarComp /> <!--Make sure that this is the correct search bar for recipes-->
        <div class="recipe-row">
            <!--Add recipe cards here-->
            <RecipeCardComp />
        </div>
    </div>
</template>

<script setup lang="ts">
import RecipeCardComp from '@/components/RecipeCardComp.vue'
import SearchBarComp from '@/components/SearchBarComp.vue'
import { onMounted } from 'vue'
import { useUtilityStore } from '@/stores/UtilityStore'

const utilityStore = useUtilityStore()

onMounted(() => {
  utilityStore.setTransparentStatus(false)
})

</script>

<style scoped>
.container {
    /* Fixed distance from nav bar, might need to change this so it corresponds with window size */
    display: grid;
    margin-top: 100px;
}

.title {
    padding: 20px;
}

.recipe-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    empty-cells: hide;
    gap: 20px;
    margin: 20px;
}
</style>
