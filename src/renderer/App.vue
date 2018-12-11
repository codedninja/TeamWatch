<template>
  <div id="app">
    <div class="page-container">
      <md-app  class="main-app"> 
        <md-app-toolbar class="md-dense md-default">
          <div class="md-toolbar-row electron-drag">
            <div class="md-toolbar-section-start">
              <span class="md-title"><img src="static/img/teamwatch_white.png" class="logo"></span>
            </div>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button system-icons" @click="minimizeWindow">
                <md-icon>remove</md-icon>
              </md-button>
              <md-button class="md-icon-button system-icons" @click="maximizeWindow">
                <md-icon>crop_square</md-icon>
              </md-button>
              <md-button class="md-icon-button system-icons" @click="closeWindow">
                <md-icon>close</md-icon>
              </md-button>
            </div>
          </div>

          </md-app-toolbar>

          <md-app-content class="main-app-content">
            <router-view></router-view>
          </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teamwatch',
    methods: {
      minimizeWindow() {
        var window = this.$electron.remote.getCurrentWindow();
        window.minimize();
      },
      maximizeWindow() {
        var window = this.$electron.remote.getCurrentWindow();
        if(window.isMaximized()){
            window.unmaximize();
        }else{
            window.maximize();
        }
      },
      closeWindow() {
        var window = this.$electron.remote.getCurrentWindow();
        window.close();
      }
    }
  }
</script>

<style>
  @import '~material-icons-font/material-icons-font.css';

  /* CSS */
  .main-app-content {
    padding: 0 !important;
    overflow-x: hidden;
  }
  
  .main-app .md-app-scroller, .main-app-content {
    overflow-y: hidden;
  }
  
  .main-app {
    max-height: 100vh;
    border: 1px solid rgba(#000, .12);
  }
  
  .logo {
    height: 24px !important;
  }
</style>
