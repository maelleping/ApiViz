<template>
    <section class="filter-feedback" v-if="selectedFilters.length >= 1">
      
      <div class="container inline-filters">

        <a class="button is-small" @click="clearAllFilters">
          <span>
            effacer les filtres
          </span>

          <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
        </a>

        <a 
          v-for="{filter, value} in selectedFilters" :key="filter+value"
          class="button is-small is-grey" 
          @click="clearFilter({filter, value})"
          >
          <span>
            {{
              filterDescriptions
                .find(f => f.name === filter)
                .choices
                .find(c => c.name === value)
                .fullname
            }}
          </span>

          <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
        </a>

      </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'FiltersFeedback',
    computed: {
      ...mapState({
        filterDescriptions: 'filterDescriptions',
        selectedFilters: ({search}) => {
          const {selectedFilters} = search.question
          const filters = []

          for(const [filter, values] of selectedFilters){
            for(const value of values){
                filters.push({filter, value})
            }
          }

          return filters
        }
      }),
    },
    methods: {
      clearAllFilters(){
        this.$store.dispatch( 'clearAllFilters' )
      },
      clearFilter({filter, value}){
        this.$store.dispatch( 'toggleFilter', {filter, value} )
      },


      // reinitFiltersTexts() {
      //   let filtersDftReinit = this.$store.state.global.app_basic_dict
      //   console.log("filtersDftReinit : ", filtersDftReinit )
      //   return this.$store.getters.getTranslation({ texts : filtersDftReinit })
      // },
      // translate( textsToTranslate ) {
      //   let listTexts = textsToTranslate
      //   console.log("listTexts : ", listTexts )
      //   return this.$store.getters.getTranslation({ texts : listTexts })
      // },
      // translateBis( textsToTranslate, listField ) {
      //   let listTexts = textsToTranslate[listField]
      //   return this.$store.getters.getTranslation({ texts : listTexts })
      // }
    }

}
</script>

<style scoped>

.filter-feedback{
  width: 100%;
  /* background-color: #F6F6F6; */
  background-color: white;
  /* border-top: 1px solid; */
  /* border-top-color: #40529d; */
  /* top : -1px; */
  z-index: 10;
}

.filter-feedback > .inline-filters{
  padding-top: 1em;
  padding-bottom: 1em;
  font-size: 12px;
}

.filter-feedback > .inline-filters a.button {
  border-radius: 3px;
  margin-right: 0.5em;
  border: 1px solid #767676;
  padding-top: 0.1em ;
  padding-bottom: 0.1em ;
  height: inherit;
}
/* .filter-feedback > .inline-filters span{
    white-space: nowrap;
    border: 1px solid #767676;
    background-color: #767676;

    color: white;

    border-radius: 3px;

    padding: 0.1em 0 0.2em 1em;
    font-size: 0.9em;
}

.filter-feedback > .inline-filters span button{
    border: 0;
    padding: 0.2em 1em;
    margin: 0;

    font-size: 1.2em;
    font-weight: bold;
    height: 100%;

    color: currentColor;
    background-color: transparent;

    cursor: pointer;
    
} */

.filter-feedback > .inline-filters span.all{

    background-color: white;

    color: #767676;
}

</style>