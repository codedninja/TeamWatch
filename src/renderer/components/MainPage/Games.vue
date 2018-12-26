<template>
  <div>
        <md-card class="md-primary" v-for="game in games" :key="game.gamePk">
          <md-card-content>
            <div class="md-layout team_logo">
              <div class="md-layout-item " ><img :src="teamLogo(game.teams.away.team.abbreviation)"></div>
              <div class="md-layout-item"><span>{{gameStartTime(game.gameDate)}}</span></div>
              <div class="md-layout-item"><img :src="teamLogo(game.teams.home.team.abbreviation)"></div>
            </div>
            <div class="md-layout team_name">
              <div class="md-layout-item" >{{game.teams.away.team.abbreviation}}</div>
              <div class="md-layout-item"></div>
              <div class="md-layout-item">{{game.teams.home.team.abbreviation}}</div>
            </div>
          </md-card-content>

          <md-card-actions md-alignment="right">
            <md-menu md-size="medium" md-align-trigger>
              <md-button md-menu-trigger>Play</md-button>

              <md-menu-content>
                <md-menu-item v-for="broadcast in game.content.media.epg[0].items" v-bind:key="broadcast.mediaPlaybackId" @click="playStream(game, broadcast)">{{broadcast.mediaFeedType}} <span v-show="broadcast.callLetters != ''">({{broadcast.callLetters}})</span></md-menu-item>
              </md-menu-content>
            </md-menu>

          </md-card-actions>
        </md-card>
  </div>
</template>

<script>
  var moment = require('moment-timezone');

  export default {
    data () {
      return {
        games: [],
        timezone: "America/New_York",
        networks: [
          ["ALT", "ALT"],
          ["ATT", "ATT"],
          ["CBC", "CBC"],
          ["CITY", "CBC"],
          ["CNBC", "NBC"],
          ["CSN", "NBC"],
          ["ESPN", "ESPN"],
          ["FS", "FS"],
          ["GOLF", "NBC"],
          ["KCOP", "FS"],
          ["MSG", "MSG"],
          ["NBC", "NBC"],
          ["NESN", "NESN"],
          ["PRIM", "FS"],
          ["RDS", "RDS"],
          ["ROOT", "ROOT"],
          ["SN", "SN"],
          ["SUN", "FS"],
          ["TCN", "CSN"],
          ["TSN", "TSN"],
          ["TVAS", "TVAS"],
          ["USA", "NBC"],
          ["WGN", "WGN"]
        ]
      }
    },
    props: ['selectedDate'],
    methods: {
      getGames() {
        var date = moment(this.selectedDate).format('YYYY-MM-DD');
        var vm = this;
        this.$http.get("https://statsapi.web.nhl.com/api/v1/schedule?startDate="+date+"&endDate="+date+"&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.game.content.media.epg").then(response => {
          if(response.data.totalGames > 0) {
            vm.games = response.data.dates[0].games;
          }
          else {
            vm.games = [];
          }
        })
      },
      teamLogo(abbreviation) {
        if (abbreviation == null) return "";
        
        return "static/img/"+abbreviation.toString().toLowerCase()+"_d.png";
      },
      getNetworkLogo(networkName, feedType, teams) {
        for (let i = 0; i < this.networks.length; i++) {
          if(networkName.startsWith(this.networks[i][0])) {
            return "static/img/"+this.networks[i][1].toLowerCase()+".png";
          }
        }

        if(feedType == "HOME")
          return "static/img/"+teams.home.team.abbreviation.toLowerCase()+"_d.png";
        if(feedType == "AWAY")
          return "static/img/"+teams.away.team.abbreviation.toLowerCase()+"_d.png";

        return "static/img/alt.png";
      },
      gameStartTime(date) {
        var start = moment.tz(date, "America/Danmarkshavn");
        return start.clone().tz(this.timezone).format("hh:mm A");
      },
      playStream(game, broadcast) {
        this.$electron.ipcRenderer.send('playstream', [game, broadcast])
      }
    },
    mounted: function() {
    }
  }
</script>

<style scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

  .team_logo > div {
    line-height: 96px;
  }

  .team_logo div, .team_logo div img {
    max-height: 96px;
    max-width: 96px;
    text-align: center;
  }

  .team_logo div img, .team_logo div span {
    vertical-align: middle;
  }

  .team_name {
    text-align: center;
    padding-top: 5px;
    font-weight: bold;
  }
</style>
