<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed"> 
      <md-app-toolbar class="md-dense md-primary">
        <div class="md-toolbar-row">
          <md-tabs @md-changed="pageChange" class="md-primary">
            <md-tab id="tab-games" md-label="Games"></md-tab>
            <!-- <md-tab id="tab-settings" md-label="Settings"></md-tab>
            <md-tab id="tab-console" md-label="Console"></md-tab> -->
          </md-tabs>
        </div>

        <div class="md-toolbar-row md-accent" v-show="activeTab == 'tab-games'">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="previousDay()">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
            <md-button>
              <md-datepicker v-model="selectedDate" md-immediately/>
            </md-button>
            <md-button class="md-icon-button" @click="nextDay()">
              <md-icon>keyboard_arrow_right</md-icon>
            </md-button>
          </div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="clickRefreshGames()">
              <md-icon>refresh</md-icon>
            </md-button>
          </div>
        </div>
      </md-app-toolbar>


      <md-app-content>
        <games v-show="activeTab == 'tab-games'" ref="gamesComponent" :selectedDate="selectedDate"></games>
        <settings v-show="activeTab == 'tab-settings'"></settings>
        <console v-show="activeTab == 'tab-console'"></console>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  import Games from './MainPage/Games'
  import Settings from './MainPage/Settings'
  import Console from './MainPage/Console'
  
  var _ = require('lodash');
  var moment = require('moment-timezone');

  export default {
    name: 'main-page',
    components: { Games, Settings, Console },
    methods: {
      
      previousDay() {
        this.selectedDate = moment(this.selectedDate).subtract(1, 'days');
      },
      nextDay() {
        this.selectedDate = moment(this.selectedDate).add(1, 'days');
      },
      pageChange(activeTab) {
        this.activeTab = activeTab;
      },
      refreshGames() {
        this.$refs.gamesComponent.getGames();
      }
    },
    created: function() {
      this.debouncedSelectedDate = _.debounce(this.refreshGames, 1000);
    },
    watch: {
      selectedDate: function (newSelectedDate, oldSelectedDate) {
        this.debouncedSelectedDate();
      }
    },
    data: () => ({
      menuVisible: false,
      activeTab: 'tab-games',
      selectedDate: moment().format("ddd, MMM, D YYYY")
    }),
    computed: {
      isMaximized() {
      }
    },
    mounted: function() {
      this.$material.locale.dateFormat = 'ddd, MMM, D YYYY'
    }
  }
</script>

<style>
  .md-app {
    max-height: 100vh;
  }

  .electron-drag {
    -webkit-app-region: drag;
  }

  .system-icons {
    -webkit-app-region: no-drag;
  }
</style>
