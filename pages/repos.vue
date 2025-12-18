<template>
  <div class="container py-5">
    <div v-for="(repoGroup, index) in repositories" :key="index" class="repo-card p-4 mb-4">
      <div class="d-flex align-items-center mb-4 header-section">
        <div class="repo-icon-header me-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-hard-drive"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>
        </div>
        <div>
          <h2 class="mb-0 fw-bold">{{ repoGroup.name }}</h2>
          <div class="repo-url">{{ repoGroup.url }}</div>
        </div>
      </div>

      <div class="repo-list">
        <div v-for="repo in repoGroup.plugins" :key="repo.name" class="repo-item d-flex gap-3 mb-4">
          <div class="repo-icon flex-shrink-0">
             <!-- Placeholder icon since we don't have the specific custom emojis -->
             <img v-if="repo.icon" :src="repo.icon" alt="icon" class="img-fluid" />
             <div v-else class="default-icon d-flex align-items-center justify-content-center">
                <span>{{ repo.name.charAt(0) }}</span>
             </div>
          </div>
          <div class="repo-content">
            <h4 class="mb-1 fw-bold repo-name">{{ repo.name }}</h4>
            <div class="repo-description fst-italic text-muted mb-1">{{ repo.description }}</div>
            <div class="repo-meta text-muted">
              by <span class="author-name">{{ repo.author }}</span>
              <span v-if="repo.discord" class="mx-1">•</span>
              <a v-if="repo.discord" :href="repo.discord" target="_blank" class="meta-link">Discord</a>
              <span v-if="repo.github" class="mx-1">•</span>
              <a v-if="repo.github" :href="repo.github" target="_blank" class="meta-link">GitHub</a>
               <span v-if="repo.report" class="mx-1">•</span>
              <a v-if="repo.report" :href="repo.report" target="_blank" class="meta-link">Report Issue</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-text mt-4 pt-3 border-top border-secondary text-muted text-end">
        {{ repoGroup.plugins.length }} plugins
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Wiki XIV - Repositories',
  ogTitle: 'Wiki XIV - Repositories',
  description: 'A collection of useful software repositories and plugins for Final Fantasy XIV.',
  ogDescription: 'A collection of useful software repositories and plugins for Final Fantasy XIV.',
})

interface RepoPlugin {
  name: string;
  description: string;
  author: string;
  discord?: string;
  github?: string;
  report?: string;
  icon?: string;
}

interface Repository {
  name: string;
  url: string;
  plugins: RepoPlugin[];
}

const repositories: Repository[] = [
  {
    name: "Core Repository",
    url: "https://love.puni.sh/ment.json",
    plugins: [
      {
        name: "Artisan",
        description: "Crafting solver, lists & macros",
        author: "Taurenkey",
        discord: "https://discord.com/channels/1001823907193552978/1003395035762528387",
        github: "https://github.com/PunishXIV/Artisan",
        icon: "https://github.com/PunishXIV/Artisan/raw/main/PunishImages/artisan-icon.png?raw=true"
      },
      {
        name: "AutoHook",
        description: "Automated fishing & solving",
        author: "Det",
        discord: "https://discord.com/channels/1001823907193552978/1205242969595052132",
        github: "https://github.com/PunishXIV/AutoHook"
      },
      {
        name: "AutoRetainer",
        description: "Retainer & submersible auto",
        author: "kawaii • Limiana",
        discord: "https://discord.com/channels/1001823907193552978/1001825038598676530",
        github: "https://github.com/PunishXIV/AutoRetainer"
      },
      {
        name: "Avarice",
        description: "Positional assistant w/ feedback",
        author: "kawaii",
        discord: "https://discord.com/channels/1001823907193552978/1001824895585497088",
        github: "https://github.com/PunishXIV/Avarice"
      },
      {
        name: "LazyLoot",
        description: "Looting automation",
        author: "Gidedin",
        discord: "https://discord.com/channels/1001823907193552978/1104088932255285298",
        github: "https://github.com/PunishXIV/LazyLoot"
      },
      {
        name: "Orbwalker",
        description: "Slidecasting helper",
        author: "kawaii",
        discord: "https://discord.com/channels/1001823907193552978/1104147620785565719",
        github: "https://github.com/PunishXIV/Orbwalker"
      },
      {
        name: "Pandora's Box",
        description: "Quality of life focused tweaks",
        author: "Croizat • Kage • Taurenkey",
        discord: "https://discord.com/channels/1001823907193552978/1107281537986211972",
        github: "https://github.com/PunishXIV/PandorasBox"
      },
      {
        name: "Questionable",
        description: "Small quest helper",
        author: "Aly",
        discord: "https://discord.com/channels/1001823907193552978/1408201462722596945",
        github: "https://github.com/PunishXIV/Questionable",
        report: "https://discord.com/channels/1001823907193552978/1432814065226612787"
      },
      {
        name: "Saucy",
        description: "MGP & Triple Triad automation",
        author: "Taurenkey",
        discord: "https://discord.com/channels/1001823907193552978/1071794989786468412",
        github: "https://github.com/PunishXIV/Saucy"
      },
      {
        name: "Splatoon",
        description: "Fight mechanic helper",
        author: "Limiana • Sourpuh",
        discord: "https://discord.com/channels/1001823907193552978/1107282120541491252",
        github: "https://github.com/PunishXIV/Splatoon"
      },
      {
        name: "Wrath Combo",
        description: "Combo plugin, with auto-rotation",
        author: "Akechi • Aki • Edewen • Flan Tartarga • Kaeris • Kage • Taurenkey • zbee",
        discord: "https://discord.com/channels/1001823907193552978/1271175781569003590",
        github: "https://github.com/PunishXIV/WrathCombo"
      },
      {
        name: "YesAlready",
        description: "Dynamic dialogue automation",
        author: "Croizat • kawaii",
        discord: "https://discord.com/channels/1001823907193552978/1159605318066634773",
        github: "https://github.com/PunishXIV"
      }
    ]
  },
  {
    name: "kawaii's Repository",
    url: "https://puni.sh/api/repository/kawaii",
    plugins: [
      {
        name: "Dropbox",
        description: "Your personal vending machine.",
        author: "kawaii",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/kawaii/Dropbox"
      },
      {
        name: "Hyperborea",
        description: "What if we GPosed in the Mordion Gaol?",
        author: "kawaii",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/kawaii/Hyperborea"
      },
      {
        name: "Moodles",
        description: "",
        author: "kawaii • Glyceri",
        discord: "https://discord.com/channels/1001823907193552978/1427541529379213392",
        github: "https://github.com/kawaii/Moodles"
      }
    ]
  },
  {
    name: "Limiana's Repository",
    url: "https://github.com/NightmareXIV/MyDalamudPlugins/raw/main/pluginmaster.json",
    plugins: [
      {
        name: "AntiAfkKick",
        description: "Preventing being auto-kicked from due to inactivity",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/AntiAfkKick"
      },
      {
        name: "HuntTrainAssistant",
        description: "Provides useful tools for hunt trains such as: highlighting conductor messages and muting all other chat, auto-opening flags from conductors and auto-teleporting to announced destination.",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/HuntTrainAssistant"
      },
      {
        name: "Lifestream",
        description: "A plugin to speed up Aethernet travel and World changing.",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/Lifestream"
      },
      {
        name: "TextAdvance",
        description: "Automatically skips cut scenes.",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/TextAdvance"
      },
      {
        name: "Battlevest",
        description: "Battle Leve Quest Helper",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/Battlevest"
      },
      {
        name: "DSR Toolbox",
        description: "A helper plugin for Dragonsong's Reprise (Ultimate).",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/DSREyeLocator"
      },
      {
        name: "Dynamic Bridge",
        description: "Allows you to automatically change your appearance based on various conditions",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/DynamicBridge"
      },
      {
        name: "Imagenation",
        description: "An image drawing back-end. To be used together with Triggernometry",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/Imagenation"
      },
      {
        name: "Object Explorer",
        description: "A convenient way to explore current objects around you",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/ObjectExplorer"
      },
      {
        name: "Prioritizer",
        description: "Prioritizer sets game's priority to high while crafting.",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/Prioritizer"
      },
      {
        name: "Select String",
        description: "Select items in menus via 0-9 keys rather than mouse",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/SelectString"
      },
      {
        name: "Standalone Plugin Manager",
        description: "Simplifies installation and upgrade process for plugins installed manually",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/StandalonePluginManager"
      },
      {
        name: "Stylist",
        description: "Gear manager that will watch your gear set for possible upgrades and upgrade them via single command",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/Stylist"
      },
      {
        name: "Unload Error Fuck Off",
        description: "[For plugin developers only] A plugin that clears off load and unload errors",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/UnloadErrorFuckOff"
      },
      {
        name: "Weatherman Extras",
        description: "Experimental Weatherman functions.",
        author: "Limiana",
        discord: "https://discord.gg/BeeRFKDJD3",
        github: "https://github.com/NightmareXIV/WExtras"
      }
    ]
  },
  {
    name: "Taurenkey's Repository",
    url: "https://puni.sh/api/repository/taurenkey",
    plugins: [
      {
        name: "ReActionEx",
        description: "QoL for the battle system.",
        author: "Taurenkey",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448"
      }
    ]
  },
  {
    name: "veyn's Repository",
    url: "https://puni.sh/api/repository/veyn",
    plugins: [
      {
        name: "Boss Mod",
        description: "Don't fail at raid mechanics anymore",
        author: "veyn • Akechi • xan",
        discord: "https://discord.com/channels/1001823907193552978/1191076246860349450",
        github: "https://github.com/awgil/ffxiv_bossmod"
      },
      {
        name: "Easier Faux Hollows",
        description: "Faux Hollows solver based on known patterns",
        author: "veyn • Croizat",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/awgil/vfaux"
      },
      {
        name: "Satisfier",
        description: "Simplify custom deliveries.",
        author: "veyn • Croizat",
        discord: "https://discord.com/channels/1001823907193552978/1191076157882388581",
        github: "https://github.com/awgil/ffxiv_satisfy"
      },
      {
        name: "visland",
        description: "",
        author: "veyn • Croizat",
        discord: "https://discord.com/channels/1001823907193552978/1191076157882388581",
        github: "https://github.com/awgil/ffxiv_visland"
      },
      {
        name: "vnavmesh",
        description: "Move around!",
        author: "veyn • xan",
        discord: "https://discord.com/channels/1001823907193552978/1191076157882388581",
        github: "https://github.com/awgil/ffxiv_navmesh"
      }
    ]
  },
  {
    name: "Croizat's Repository",
    url: "https://puni.sh/api/repository/croizat",
    plugins: [
      {
        name: "Something Need Doing",
        description: "Work work.",
        author: "Croizat",
        discord: "https://discord.com/channels/1001823907193552978/1196163718216679514",
        github: "https://github.com/Jaksuhn/SomethingNeedDoing"
      }
    ]
  },
  {
    name: "Ice's Repository",
    url: "https://puni.sh/api/repository/ice",
    plugins: [
      {
        name: "Chilled Leves",
        description: "Guild Leves, fully automated",
        author: "Ice",
        discord: "https://discord.com/channels/1001823907193552978/1356608740224405547",
        github: "https://github.com/LeontopodiumNivale14/LeveItAlone"
      },
      {
        name: "Explorer's Icebox",
        description: "Island Sanctuary Leveling/Gathering Buddy",
        author: "Ice",
        discord: "https://discord.com/channels/1001823907193552978/1356608740224405547",
        github: "https://github.com/LeontopodiumNivale14/Explorers-Icebox/tree/master"
      },
      {
        name: "Ice's Cosmic Exploration",
        description: "Automation, in spaaace!",
        author: "Ice",
        discord: "https://discord.com/channels/1001823907193552978/1356608740224405547",
        github: "https://github.com/LeontopodiumNivale14/Ices-Cosmic-Exploration"
      }
    ]
  },
  {
    name: "Jukka's Repository",
    url: "https://puni.sh/api/repository/jukka",
    plugins: [
      {
        name: "Hoard Farm",
        description: "\"For the Hoard\"-achievement farmer",
        author: "Jukka",
        discord: "https://discord.com/channels/1001823907193552978/1103082265187205170",
        github: "https://github.com/Jukkales/HoardFarm"
      },
      {
        name: "NecroLens",
        description: "DeepDungeon ESP",
        author: "Jukka • Ice",
        discord: "https://discord.com/channels/1001823907193552978/1103082265187205170",
        github: "https://github.com/Jukkales/NecroLens"
      }
    ]
  },
  {
    name: "erdelf's Repository",
    url: "https://puni.sh/api/repository/erdelf",
    plugins: [
      {
        name: "Autoduty",
        description: "Dungeons while you sleep, eat, or work. (Swimsuit Shtola made easy.)",
        author: "erdelf • Herculezz",
        discord: "https://discord.com/channels/1001823907193552978/1236757595738476725",
        github: "https://github.com/erdelf/AutoDuty",
        report: "https://github.com/erdelf/AutoDuty/issues/new/choose"
      }
    ]
  },
  {
    name: "Sourpuh's Repository",
    url: "https://puni.sh/api/repository/sourpuh",
    plugins: [
      {
        name: "Interjection",
        description: "Better interrupt and enmity tracking",
        author: "Sourpuh",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/sourpuh/ffxiv_interjection"
      },
      {
        name: "Waymark Studio",
        description: "Total replacement waymark editor and presets",
        author: "Sourpuh",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/sourpuh/ffxiv_waymarkstudio"
      }
    ]
  },
  {
    name: "Knightmore's Repository",
    url: "https://puni.sh/api/repository/knightmore",
    plugins: [
      {
        name: "Henchman",
        description: "Doing your dirty work",
        author: "Knightmore",
        discord: "https://discord.com/channels/1001823907193552978/1396066072418975786",
        github: "https://github.com/Knightmore/Henchman"
      }
    ]
  },
  {
    name: "wah's Repository",
    url: "https://puni.sh/api/repository/wah",
    plugins: [
      {
        name: "WahJumps",
        description: "Jumping Puzzle Directory",
        author: "wah",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/Brappp/WahJumps"
      },
      {
        name: "Wrath Auto Toggle",
        description: "Wrath Auto Toggle (Wrath Auto Toggle)",
        author: "wah",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/Brappp/Wrath-Icon"
      },
      {
        name: "wahventory",
        description: "Inventory management with safety filter & auto-discard",
        author: "wah",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/Brappp/wahventory"
      }
    ]
  },
  {
    name: "Glyceri's Repository",
    url: "https://puni.sh/api/repository/glyceri",
    plugins: [
      {
        name: "Silence No More",
        description: "Shows whispers normally blocked during duties.",
        author: "Glyceri",
        discord: "https://discord.com/channels/1001823907193552978/1427541529379213392",
        github: "https://github.com/Glyceri/SilenceNoMore"
      }
    ]
  },
  {
    name: "xan's Repository",
    url: "https://puni.sh/api/repository/xan",
    plugins: [
      {
        name: "Cope, Seethe, Meld",
        description: "Auto-meld gear",
        author: "xan",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/xanunderscore/CopeSeetheMeld"
      }
    ]
  },
  {
    name: "Akechi's Repository",
    url: "https://puni.sh/api/repository/akechi",
    plugins: [
      {
        name: "Chroma",
        description: "Modify the color of AOE indicators",
        author: "Akechi",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/Akechi-kun/Chroma"
      }
    ]
  },
  {
    name: "Det's Repository",
    url: "https://puni.sh/api/repository/det",
    plugins: [
      {
        name: "AutoHook (CN)",
        description: "Makes fishing less (or more) boring",
        author: "Det",
        discord: "https://discord.com/channels/1001823907193552978/1205242969595052132",
        github: "https://github.com/PunishXIV/AutoHook"
      }
    ]
  },
  {
    name: "zbee's Repository",
    url: "https://puni.sh/api/repository/justbees",
    plugins: [
      {
        name: "ARControl",
        description: "The better AutoRetainer venture planner",
        author: "zbee",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/zbee/ARC"
      }
    ]
  },
  {
    name: "Faye's Repository",
    url: "https://ffxiv.ohkannaduh.com/plugins.json",
    plugins: [
      {
        name: "BOCCHI",
        description: "Occult Crescent Automation & Toolkit",
        author: "Faye • Knightmore",
        discord: "https://discord.com/channels/1001823907193552978/1365442407809814538",
        github: "https://github.com/OhKannaDuh/OccultCrescentHelper",
        report: "https://github.com/OhKannaDuh/OccultCrescentHelper/issues"
      },
      {
        name: "Twist of Fayte",
        description: "Automating your fate(s)",
        author: "Faye • Knightmore",
        discord: "https://discord.com/channels/1001823907193552978/1365442407809814538",
        github: "https://github.com/OhKannaDuh/TwistOfFayte",
        report: "https://github.com/OhKannaDuh/TwistOfFayte/issues"
      }
    ]
  },
  {
    name: "Spider's Repository",
    url: "https://puni.sh/api/repository/spider",
    plugins: [
      {
        name: "CCAnonymizer",
        description: "Preserving your sanity by hiding the identity of enemies and teammates in Crystalline Conflict",
        author: "Spider",
        github: "https://github.com/spide-r/CCAnonymizer"
      }
    ]
  },
  {
    name: "Vera's Repository",
    url: "https://puni.sh/api/repository/vera",
    plugins: [
      {
        name: "Deliveroo",
        description: "Better Grand Company Deliveries",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/Deliveroo"
      },
      {
        name: "Discard Helper",
        description: "Discard items automatically via a command or as a post-venture task for AutoRetainer",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/ARDiscard"
      },
      {
        name: "FishNotify",
        description: "",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/FishNotify"
      },
      {
        name: "Gearsetter",
        description: "Find gear upgrades",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/Gearsetter"
      },
      {
        name: "Kitchen Sink",
        description: "",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448"
      },
      {
        name: "Squadronista",
        description: "Squadron Mission Solver",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/Squadronista"
      },
      {
        name: "Workshoppa",
        description: "Better Company Workshop Turn-In",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/Workshoppa"
      },
      {
        name: "VIWI",
        description: "",
        author: "Vera",
        discord: "https://discord.com/channels/1001823907193552978/1147576914349928448",
        github: "https://github.com/VeraNala/VIWI",
        report: "https://github.com/VeraNala/VIWI/issues"
      }
    ]
  }
]
</script>

<style scoped>
.repo-card {
  background-color: #2b2d31; /* Discord Embed Background approx */
  border-left: 4px solid #a259ec; /* Purple accent */
  border-radius: 4px;
  color: #dcddde;
  max-width: 800px;
  margin: 0 auto;
}

.repo-url {
  background-color: #1e1f22;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  margin-top: 4px;
  display: inline-block;
}

.repo-icon-header {
  color: #fa5050; /* Reddish icon color from embed title approx */
}

/* Override indentation logic to just look like list items but cleaner */
.repo-item {
  border-left: 2px solid #4f545c;
  padding-left: 0.75rem;
}

.repo-icon img {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: contain;
}

.default-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #5865f2; /* Discord Blurple */
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.repo-name {
  color: #f2f3f5;
  font-size: 0.95rem;
}

.repo-description {
  color: #b9bbbe;
  font-size: 0.85rem;
}

.repo-meta {
  font-size: 0.75rem;
}

.author-name {
  color: #dcddde;
}

.meta-link {
  color: #00b0f4;
  text-decoration: none;
}

.meta-link:hover {
  text-decoration: underline;
}

.repo-icon-header svg {
  stroke: #ff5f5f;
}
</style>
