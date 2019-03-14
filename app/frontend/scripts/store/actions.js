import axios from 'axios';
import {apiConfig} from '../config/api.js';
import {csvParse} from 'd3-dsv';
import {searchProjects, getSpiders, searchEnpointCreator, searchEndpointGenerator} from '../utils.js';

const SOURCE_FILTER_NAME = 'source_';


// LEGACY SPIDERS-RELATED --> DEPRECATED IN THE FUTURE
function makeSourceFilterFromSpiders(spiders){
  return {
    "fullname": "Source",
    "name": SOURCE_FILTER_NAME,
    "choices": [ ...Object.entries(spiders)]
      .map(([id, {name}]) => ({
        "fullname": name,
        "id": id,
        "spiderId": id,
        "name": name
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }
}

// LEGACY CIS-RELATED --> DEPRECATED IN THE FUTURE
function filterValuesToCISTags(filterValues){
  const cisTags = new Set();

  const categoriesByUITag = CATEGORIES_CIS_DICT_FLAT;
  const cisTagByCategory = NORMALIZATION_TAGS_SOURCES_CIS_DICT;

  let uiTags = [];
  for(const [filter, tags] of filterValues.entries()){
    uiTags = [...uiTags, ...([...tags].map(t => filter+t))]
  }

  for(const uiTag of uiTags){
    const categories = categoriesByUITag[uiTag];

    for(const category of categories){
      const categoriesCISTags = cisTagByCategory[category];

      for(const tag of categoriesCISTags){
        cisTags.add(tag);
      }
    }
  }

  return cisTags;
}


export default {

  // FOR TRANSLATIONS
  // chooseTranslation({state}, textsData ){
  //   const locale = state.locale
  //   const textField = 'text'
  //   console.log("textsData : ", textsData)
  //   return textFromLocale( textsData.texts, locale, textField )
  // },


  // FOR FILTERS
  toggleFilter({state, commit, dispatch}, {filter, value}){
    const selectedFilters = state.search.question.selectedFilters
    const selectedValues = selectedFilters.get(filter)
    if(selectedValues.has(value))
      selectedValues.delete(value)
    else
      selectedValues.add(value)

    commit('setSelectedFilters', {selectedFilters})
    dispatch('search')
  },

  emptyOneFilter({state, commit, dispatch}, {filter}){
    const selectedFilters = state.search.question.selectedFilters
    selectedFilters.set(filter, new Set())

    commit('setSelectedFilters', {selectedFilters})
    dispatch('search')
  },

  clearAllFilters({commit, dispatch}){
    commit('clearAllFilters')
    dispatch('search')
  },



  // FOR SEARCH
  searchedTextChanged({commit, dispatch}, {searchedText}){
    commit('setSearchedText', {searchedText})
    dispatch('search')
  },




  // MAIN SEARCH ACTION
  search({state, commit, dispatch}){

    console.log("\n-- search ...", )

    const {search} = state;

    // const dataset_uri = search.dataset_uri
    const selectedFiltersWithoutSourceurs = new Map(search.question.selectedFilters)
    selectedFiltersWithoutSourceurs.delete(SOURCE_FILTER_NAME);

    const cisTags = filterValuesToCISTags(selectedFiltersWithoutSourceurs)

    const selectedSources = search.question.selectedFilters.get(SOURCE_FILTER_NAME)

    // SPIDERS-RELATED --> DEPRECATED
    const spiderIds = selectedSources ? [...selectedSources].map(source => {
    	return [...Object.entries(state.spiders)].find(([id, spider]) => spider.name === source)[0]
    }) : undefined;

    // abort previous search if any
    if(search.answer.pendingAbort){
      search.answer.pendingAbort.abort()
    }

    //create the endpoints
    let root_url = (state.search && state.search.endpoint) ? state.search.endpoint.root_url : dispatch('getConfigType',{type:'endpoints',configTypeEndpoint:'endpoints'})

    const endpoint = searchEnpointCreator({

      baseUrl:root_url,

      // query from main input in search bar
      search: search.question.query,
      
      // tags / filters
      tags:cisTags,

      // pagination
      page:1,
      per_page:100,
      
      // here for map requests 
      map_list : search.question.for_map,
      as_latlng : search.question.for_map
      
    })
    console.log("-- search / endpoint : \n", endpoint )


    // perform search
    const searchPendingAbort = searchProjects(endpoint)

    commit('setSearchPending', {pendingAbort: searchPendingAbort})

    searchPendingAbort.promise
      .then(({projects, total}) => {
        commit('setSearchResult', {result: {projects, total}})
      })
      .catch(error => {
        // don't report aborted fetch as errors
        if (error.name !== 'AbortError')
          commit('setSearchError', {error})
      })
  },
  

  // DEPRECATED ????? creates error when commented.... 
  getSpiders({commit}){
    getSpiders()
    .then(spiders => {
      commit('setSpiders', {spiders})
      commit('setSourceFilter', {sourceFilter: makeSourceFilterFromSpiders(spiders)})
    })
    .catch(err => console.error('err getSpiders', text, err))
  },
  

  ////////////////////////////////////////////////
  // TO COMMENT ABSOLUTLY -> data must be pre-geocoded when arriving as response
  findProjectsGeolocs({commit}, projects){
    const projectWithValidAddress = projects.filter(p => p['address'])
    const addresses = projectWithValidAddress.map(p => p['address'].replace(/[^(\w|\s)]/g, '').slice(0, 200) )

    const adressesCSV = 'adresse\n' + addresses.join('\n')
    const adresseCSVBANBody = new FormData();
    adresseCSVBANBody.append('data', new File([adressesCSV], 'adresses.csv'))

    return fetch('https://api-adresse.data.gouv.fr/search/csv/', {
      method: 'POST',
      body: adresseCSVBANBody,
    })
    .then(r => r.text())
    .then(geolocsTxt => {
      const geolocs = csvParse(geolocsTxt);

      const geolocByProjectId = new Map();

      projectWithValidAddress.forEach(({id}, i) => {
        const {latitude, longitude} = geolocs[i];

        geolocByProjectId.set(
          id,
          (Number.isFinite(parseFloat(latitude)) && Number.isFinite(parseFloat(longitude))) ?
            {latitude: parseFloat(latitude), longitude: parseFloat(longitude)} :
            false
        )
      })

      projects.forEach(({id}) => {
        if(!geolocByProjectId.has(id)){
          geolocByProjectId.set(id, false)
        }
      })

      commit('addGeolocs', {geolocByProjectId})
    });
  },
  /////////////////////////:



  // FOR CONFIGs
  getConfigAll({dispatch}) {
    let arr = []
    arr.push(dispatch('getConfigType',{type:'global',configTypeEndpoint:'global'}) )
    arr.push(dispatch('getConfigType',{type:'styles',configTypeEndpoint:'styles'}) )
    arr.push(dispatch('getConfigType',{type:'socials',configTypeEndpoint:'socials'}) )
    arr.push(dispatch('getConfigType',{type:'footer',configTypeEndpoint:'footer'}) )
    arr.push(dispatch('getConfigType',{type:'navbar',configTypeEndpoint:'navbar'}) )
    arr.push(dispatch('getConfigType',{type:'routes',configTypeEndpoint:'routes?as_list=true'}) )
    arr.push(dispatch('getConfigType',{type:'endpoints',configTypeEndpoint:'endpoints?as_list=true'}) )
    return Promise.all(arr)
    // dispatch('getConfigType',{type:'global',configTypeEndpoint:'global'})
    // dispatch('getConfigType',{type:'styles',configTypeEndpoint:'styles'})
    // dispatch('getConfigType',{type:'socials',configTypeEndpoint:'socials'})
    // dispatch('getConfigType',{type:'footer',configTypeEndpoint:'footer'})
    // dispatch('getConfigType',{type:'navbar',configTypeEndpoint:'navbar'})
    // dispatch('getConfigType',{type:'routes',configTypeEndpoint:'routes?as_list=true'})
    // dispatch('getConfigType',{type:'endpoints',configTypeEndpoint:'endpoints?as_list=true'})
  },

  getConfigType({commit, getters},{type,configTypeEndpoint}) {
    const rootURLbackend = getters.getRootUrlBackend
    return axios
    .get(rootURLbackend+'/config/'+configTypeEndpoint)
    // .get(apiConfig.rootURL+'/config/'+configTypeEndpoint)
    .then(response => {
      // console.log("type : ", type," / response : ", response)
      let app_config = (response && response.data && response.data.app_config) ? response.data.app_config : undefined
      commit('setConfig', {type:type,result:app_config}); 
      return app_config
    })
    .catch( err => console.log('there was an error trying to fetch some configuration file',err) )
  },


  // TO VARIABILIZE
  setSearchConfigDisplay({commit}) {
    // here this function will probably change when this may be inherited from the configuration files
    const defaultDisplay = {
      columnCount : 4,
      defaultShowCount : 50,
      moreProjectOnScrollCount : 20,
      scrollBeforeBottomTrigger : 500
    }
    commit('setSearchConfig', {type:'display',result:defaultDisplay});
  },

  // USER-RELATED
  saveLoginInfos({commit}, {APIresponse}){
    let r = APIresponse
    let tokens = (r && r.data && r.data.tokens) ? r.data.tokens : undefined
    let infos = (r && r.data && r.data.data && r.data.data.infos) ? r.data.data.infos : undefined
    let role = (r && r.data && r.data.data && r.data.data.auth && r.data.data.auth.role) ? r.data.data.auth.role : undefined

    commit('setTokens', {tokens})
    commit('setInfos', {infos})
    commit('setRole', {role})
  },
  logout({commit}){
    commit('setTokens', {})
    commit('setInfos', {})
    commit('setRole', {})
  },


  // FOR ENDPOINT CONFIG
  setSearchEndpointConfig({commit,getters,state},{path}) {

    let routeConfig = getters.getCurrentRouteConfig(path)
    // console.log("\n-- setSearchEndpointConfig / endpointConfig :\n ", routeConfig)
    
    // if (!endpointConfig) { console.log('here ?'); return undefined }
    // let arr = []
    // arr.push(commit('setSearchParam',{type:'currentRouteConfig',result:routeConfig}))
    // arr.push(commit('setSearchParam',{type:'dataset_uri',result:routeConfig.dataset_uri}))
    // arr.push(commit('setSearchParam',{type:'endpoint_type',result:routeConfig.endpoint_type}))
    // return Promise.all(arr)
    commit('setSearchParam',{type:'currentRouteConfig',result:routeConfig})
    commit('setSearchParam',{type:'dataset_uri',result:routeConfig.dataset_uri})
    commit('setSearchParam',{type:'endpoint_type',result:routeConfig.endpoint_type})
    
    let endpointConfig = getters.getEndpointConfig
    commit('setSearchParam',{type:'endpoint',result:endpointConfig})
    // console.log("-- setSearchEndpointConfig / state.search : \n", state.search )
  },
  // setCurrentRouteAndEndpointConfig({dispatch}) {
  //     let arr = []
  //     arr.push(dispatch('getConfigType',{type:'routes',configTypeEndpoint:'routes?as_list=true'}))
  //     arr.push(dispatch('getConfigType',{type:'endpoints',configTypeEndpoint:'endpoints?as_list=true'}))
  //     return Promise.all(arr)
  // },

  // setSearchEndpoint({commit,getters,state}) {
  //   let endpointConfig = getters.getEndpointConfig
  //   // console.log("\n-- setSearchEndpoint / endpointConfig :\n ", endpointConfig)
    
  //   // if (!endpointConfig) { return undefined }
  //   // let arr = []
  //   // arr.push(commit('setSearchParam',{type:'endpoint',result:endpointConfig}))
  //   // return Promise.all(arr)
  //   commit('setSearchParam',{type:'endpoint',result:endpointConfig})
  // },

  // - - - - - - - - - - - - // 
  // DEPRECATED
  // - - - - - - - - - - - - // 
  // fetchCurrentEndpoint({commit},{type,configTypeEndpoint}) {
  //     return true
  //     // return axios
  //     //   .get(apiConfig.rootURL+'/config/'+configTypeEndpoint)
  //     //   .then(response => {
  //     //     let app_config = (response && response.data && response.data.app_config) ? response.data.app_config : undefined
  //     //     commit('setConfig', {type:type,result:app_config}); return app_config
  //     //   })
  //     //   .catch( err => console.log('there was an error trying to fetch some configuration file',err) )
  // },
}
