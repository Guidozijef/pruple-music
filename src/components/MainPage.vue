<template>
  <div class="main-page">
    <audio
      autoplay
      :src="songPlayUrl"
      :loop="state.loop"
      @canplay="getDuration"
      @timeupdate="updateTime"
      ref="audio"
      id="audio"
    ></audio>
    <div class="menu">
      <ul class="menu-icon-list">
        <li class="iconFontItem">
          <span class="iconfont icon-fanhui" @click="goBack()"></span>
        </li>
        <li class="iconFontItem" @click="goHome()">
          <span class="iconfont icon-zhuye"></span>
          <a herf>首页</a>
        </li>
        <li class="iconFontItem" @click="goSlef()">
          <span class="iconfont icon-gengduo"></span>
          <a herf>Slef</a>
        </li>
        <li class="iconFontItem">
          <span
            class="iconfont icon-yinlehe"
            style="font-size: 27px"
            @click="goMusicBox()"
          ></span>
          <a herf>音乐盒</a>
        </li>
        <li class="iconFontItem">
          <span
            class="iconfont icon-FMxia-copy"
            style="font-size: 25px"
            @click="goQieFM()"
          ></span>
          <a herf>企鹅FM</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-music_active"></span>
          <a herf>历史</a>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="heades">
        <input
          type="text"
          class="input"
          placeholder="在库中搜索"
          v-model="state.seachValue"
          @keyup.enter="goSeach(state.seachValue)"
        />
        <span class="blank"></span>
        <span
          class="iconfont icon-sousuo1"
          @click="goSeach(state.seachValue)"
        ></span>
      </div>
    </div>
    <div class="musicControl">
      <ul class="iconControl">
        <li class="itemControl" @click="prev()">
          <span class="iconfont icon-shangyishou"></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl" @click="play()">
          <span
            class="iconfont"
            :class="{
              'icon-bofang': !state.playing,
              'icon-zanting': state.playing,
            }"
          ></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl" @click="next()">
          <span class="iconfont icon-shangyishou1"></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl" @click="state.target = false">
          <span
            class="iconfont icon-laba"
            v-show="state.target"
            style="font-size: 22px"
          ></span>
          <span class="itemBorder" v-show="state.target"></span>
        </li>
        <div class="volume-slider" v-show="!state.target">
          <mu-slider
            @change="changeVolume"
            :display-value="false"
            v-model="state.volume"
            color="#9530a3"
          ></mu-slider>
        </div>
        <li class="itemControl">
          <span
            class="iconfont"
            @click="state.sequence = !state.sequence"
            :class="
              state.sequence
                ? 'icon-bofangye-caozuolan-suijibofang'
                : 'icon-xunhuanbofang'
            "
          ></span>
          <!-- <span class="iconfont icon-bofangye-caozuolan-suijibofang"></span> -->
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl">
          <span
            class="iconfont icon-danquxunhuan"
            @click="state.loop = !state.loop"
            :style="{ color: state.loop ? '#fff' : '#000' }"
            style="font-size: 22px"
          ></span>
          <span
            class="itemBorder"
            :style="{
              backgroundColor: state.loop ? '#9530a3' : null,
              display: state.loop ? 'inline-block' : 'none',
            }"
          ></span>
        </li>
      </ul>
      <div class="musicSilder">
        <mu-slider
          class="demo-slider"
          :display-value="false"
          @change="changePlayTime"
          :value="playTime"
          color="#9530a3"
        ></mu-slider>
        <!-- <el-slider v-model="this.playTime"></el-slider> -->
      </div>
      <div class="musicBarTime">
        {{ format(currentTime) }}/{{ format(state.duration % 3600) }}
      </div>
      <!-- <div class="minBox" v-if="prevPlaySong.al" @click="goShowSonging()">
        <div class="minImg">
          <img
            :src="
              prevPlaySong.al.picUrl.slice(0, 5) == 'https'
                ? prevPlaySong.al.picUrl
                : prevPlaySong.al.picUrl.replace('http', 'https')
            "
            alt
            srcset
          />
        </div>
        <div class="infoBox">
          <span class="prevsonger">{{ prevPlaySong.name }}</span>
          <span class="prevName">{{ prevPlaySong.ar[0].name }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, Ref, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMusicStore } from "../stores/music";

const musicStore = useMusicStore();
// let { setAudioEle } = storeToRefs(musicStore);

const router = useRouter();

let state = reactive({
  sequence: false, // 是否乱序播放
  loop: false, // 是否循环
  lyric: [],
  volume: 30,
  target: true,
  playing: null,
  duration: 0,
  seachValue: "",
});

let audio = ref(null);

const songPlayUrl = computed(() => musicStore.songPlayUrl);
const currentTime = computed(() => musicStore.currentTime);
const prevPlaySong = computed(() => musicStore.prevPlaySong);
const prevPlayList = computed(() => musicStore.prevPlayList);
const historyList = computed(() => musicStore.historyList);
const playTime = computed(() => {
  return parseInt(currentTime.value * (100 / state.duration)); //将当前时间转换为进度条显示
});

const format = (value: number): string => {
  let minute = Math.floor(value / 60) + "";
  let second = Math.floor(value % 60) + "";
  return `${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
};

const changePlayTime = (val) => {
  audio.value.currentTime = (val * state.duration) / 100; // 设置从什么时候开始播放
  musicStore.setCurrentTime({ data: (val * state.duration) / 100 }); //获取audio当前播放时间
};
// 去首页
const goHome = () => {
  router.push({ name: "homePage" });
};
// 返回
const goBack = () => {
  router.go(-1);
};
// 去自己的页面
const goSlef = () => {
  router.push({ name: "self" });
};
// 去音乐盒
const goMusicBox = () => {
  router.push({ name: "musicBox" });
};
// 去企鹅FM
const goQieFM = () => {
  router.push({ name: "qieFM" });
};
// 获取当前播放的时间
const updateTime = (e) => {
  musicStore.setCurrentTime({ data: e.target.currentTime }); //获取audio当前播放时间
};
// 获取总时长
const getDuration = () => {
  // console.log(audio.value.duration); //此时可以获取到duration
  state.duration = audio.value.duration; // 总共时长
};
// 去到歌词的页面
const goShowSonging = () => {
  router.push({ name: "showSonging" });
};
// 搜索
const goSeach = (seachValue: string) => {
  state.seachValue
    ? router.push({ name: "seach", params: { seachValue } })
    : null;
};
// 点击播放
const play = () => {
  state.playing = audio.value.paused; // 播放器的状态
  state.playing ? audio.value.play() : audio.value.pause();
};
// 上一首
const prev = () => {
  if (songPlayUrl.value.indexOf("ws.stream.fm.qq.com") == -1) {
    let prevPlayId = prevPlaySong.value.id;
    prevPlayList.value.tracks.forEach((item, index) => {
      if (prevPlayId == item.id) {
        let ele = index <= 0 ? item : prevPlayList.value.tracks[index - 1];
        // this.setPrevPlaySong({ obj: ele });
        // $.ajax({
        //   type: "get",
        //   url: "https://api.mtnhao.com/song/detail?ids=" + ele.id,
        //   dataType: "json",
        //   success: (data) => {
        //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
        //     nextTick(() => {
        //       musicStore.setPrevPlaySong({ obj: data.songs[0] });
        //     });
        //   },
        // });
        // $.ajax({
        //   type: "get",
        //   url: "https://api.imjad.cn/cloudmusic/?type=song&id=" + ele.id,
        //   ContentType: "application/x-www-form-urlencoded",
        //   dataType: "json",
        //   success: (jsData) => {
        //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
        //     nextTick(() => {
        //       musicStore.setSongPlayUrl({ url: jsData.data[0].url });
        //     });
        //   },
        // });
        // $.ajax({
        //   type: "get",
        //   url: "https://api.mtnhao.com/lyric",
        //   data: {
        //     id: ele.id,
        //   },
        //   dataType: "json",
        //   success: (dataRic) => {
        //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
        //     nextTick(() => {
        //       // var lyric = parseLyric(dataRic.lyric);
        //       musicStore.setSongPlayLrc({ lrc: dataRic.lrc.lyric || {} });
        //       // console.log(parseLyric(dataRic.lyric))
        //     });
        //   },
        // });
      }
    });
  } else {
    // 正则匹配出企鹅FM的播放链接id
    let reg = new RegExp(/R196(\w+).m4a/g);
    let Mid = reg.exec(songPlayUrl.value);
    // console.log(Mid)
    let prevPlayList: { show: { strMid: any } }[] = [];
    for (let item in prevPlayList.value.showList) {
      prevPlayList.push(prevPlayList.value.showList[item]);
    }
    prevPlayList.forEach((ele, nI) => {
      if (ele.show.strMid == Mid[1]) {
        let nextUrlMid =
          nI != 0
            ? prevPlayList[nI - 1].show.strMid
            : prevPlayList[nI].show.strMid;
        musicStore.setSongPlayUrl({
          url: `http://ws.stream.fm.qq.com/vfm.tc.qq.com/R196${nextUrlMid}.m4a?fromtag=36&vkey=98837D0874E15B38FB695D0A78FF157379BCD2F8515C42A2E57B9E9B58C78C58C8093F96E2A9A6AA66D273AB647D42FBAF2BF882425C245B&guid=10000`,
        });
      }
    });
  }
};
// 下一首
const next = () => {
  if (songPlayUrl.value.indexOf("ws.stream.fm.qq.com") == -1) {
    var prevPlayId = prevPlaySong.value.id;
    if (prevPlayList.value.tracks.length) {
      prevPlayList.value.tracks.forEach((item, index) => {
        if (prevPlayId == item.id) {
          var ele =
            index >= prevPlayList.value.tracks.length - 1
              ? item
              : prevPlayList.value.tracks[index + 1];
          // this.setPrevPlaySong({ obj: ele }); // 改变当前播放的歌曲信息
          // // console.log(this.prevPlayList.tracks[index + 1]);
          // $.ajax({
          //   type: "get",
          //   url: "https://api.mtnhao.com/song/detail?ids=" + ele.id,
          //   dataType: "json",
          //   success: (data) => {
          //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
          //     nextTick(() => {
          //       musicStore.setPrevPlaySong({ obj: data.songs[0] });
          //     });
          //   },
          // });
          // $.ajax({
          //   type: "get",
          //   url: "https://api.imjad.cn/cloudmusic/?type=song&id=" + ele.id,
          //   ContentType: "application/x-www-form-urlencoded",
          //   dataType: "json",
          //   success: (jsData) => {
          //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
          //     nextTick(() => {
          //       musicStore.setSongPlayUrl({ url: jsData.data[0].url });
          //     });
          //   },
          // });
          // $.ajax({
          //   type: "get",
          //   url: "https://api.mtnhao.com/lyric",
          //   data: {
          //     id: ele.id,
          //   },
          //   dataType: "json",
          //   success: (dataRic) => {
          //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
          //     nextTick(() => {
          //       // var lyric = parseLyric(dataRic.lyric);
          //       musicStore.setSongPlayLrc({ lrc: dataRic.lrc.lyric || {} });
          //       // console.log(parseLyric(dataRic.lyric))
          //     });
          //   },
          // });
        }
      });
    }
  } else {
    // 正则匹配出企鹅FM的播放链接id
    var reg = new RegExp(/R196(\w+).m4a/g);
    var Mid = reg.exec(songPlayUrl.value);
    // console.log(Mid)
    var prevPlayList = [];
    for (let item in prevPlayList.value.showList) {
      prevPlayList.push(prevPlayList.value.showList[item]);
    }
    prevPlayList.forEach((ele, nI) => {
      if (ele.show.strMid == Mid[1]) {
        var nextUrlMid =
          nI != prevPlayList.vlaue.length
            ? prevPlayList.value[nI + 1].show.strMid
            : prevPlayList.value[nI].show.strMid;
        musicStore.setSongPlayUrl({
          url: `http://ws.stream.fm.qq.com/vfm.tc.qq.com/R196${nextUrlMid}.m4a?fromtag=36&vkey=98837D0874E15B38FB695D0A78FF157379BCD2F8515C42A2E57B9E9B58C78C58C8093F96E2A9A6AA66D273AB647D42FBAF2BF882425C245B&guid=10000`,
        });
      }
    });
  }
};
// 按键事件
const initKeyDown = () => {
  document.onkeydown = (e) => {
    switch (e.ctrlKey && e.keyCode) {
      // case 13: // 回车
      //   this.$refs.input.focus(function() {
      //     console.log("adfgdsf");
      //     this.goSeach(this.seachValue);
      //   });
      //   break;
      case 32: // 播放暂停Ctrl + Space
        play();
        break;
      case 37: // 上一曲Ctrl + Left
        prev();
        break;
      case 38: // 音量加Ctrl + Up
        // let plus = Number((audio.value.volume += 0.1).toFixed(1));
        // eslint-disable-next-line no-case-declarations
        let plus = 2;
        if (plus > 1) {
          plus = 1;
        }
        changeVolume(plus);
        break;
      case 39: // 下一曲Ctrl + Right
        next();
        break;
      case 40: // 音量减Ctrl + Down
        // let reduce = Number((audio.value.volume -= 0.1).toFixed(1));
        // eslint-disable-next-line no-case-declarations
        let reduce = 2;
        if (reduce < 0) {
          reduce = 0;
        }
        changeVolume(reduce);
        break;
      case 79: // 切换播放模式Ctrl + O
        modeChange();
        break;
    }
  };
};
const changeVolume = (value) => {
  audio.value.volume = value / 100;
};

const modeChange = () => ({});

onMounted(() => {
  // 设置audio元素
  nextTick(() => {
    musicStore.setAudioEle(audio.value);
  });

  document.addEventListener("click", (e: Event) => {
    if (e.target.className != "iconfont icon-laba") {
      state.target = true;
    }
  });
  audio.value.volume = 0.3;
  // 自动播放下一首
  audio.value.onended = () => {
    !state.loop ? next() : null;
  };
  // 音乐播放出错
  audio.value.onerror = () => {
    prevPlayList.value.length
      ? console.error("暂时无法播放，已自动播放下一首")
      : null;
    next();
    // console.log('播放出错啦！')
  };
  // 开始播放音乐
  audio.value.onplay = () => {
    state.playing = true;
  };
  // 初始化按键事件
  nextTick(() => {
    initKeyDown();
  });
  // 将能播放的音乐加入播放历史
  audio.value.oncanplay = () => {
    if (
      historyList.value.length === 0 ||
      prevPlaySong.value.id !== historyList.value[0].id
    ) {
      musicStore.setHistory(prevPlaySong.value);
    }
  };
});
</script>

<style lang="scss" scoped>
.main-page {
  overflow: hidden;
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100px;
    background: -webkit-gradient(
      linear,
      0 0,
      0 bottom,
      from(#9530a330),
      to(#dedfdf)
    );

    // background-color: #dedfdf;
    // filter: blur(5px);
    .menu-icon-list {
      height: 100%;
      width: 70px;

      .iconFontItem {
        padding: 10px 0px;
        text-align: center;
        transition: all 0.5s ease;
        cursor: pointer;

        &:hover {
          background-color: #9530a3;

          .iconfont {
            color: #fff;
          }

          a {
            color: #fff;
          }
        }

        .iconfont {
          display: block;
          width: 100%;
          font-size: 30px;
        }

        a {
          font-size: 12px;
          color: #000;
        }
      }
    }
  }

  .main {
    // position: relative;
    .heades {
      margin-top: 10px;
      position: absolute;
      text-align: center;
      left: 550px;
      width: 600px;

      .input {
        background-color: #fafafa;
        position: absolute;
        left: 10px;
        padding-left: 20px;
        width: 320px;
        color: #b6b6b9;
        // background-color: #eae8e7;
        height: 30px;
        margin: 0 auto;
        font-size: 16px;
        outline: none;
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
        box-shadow: none;
      }

      .blank {
        position: absolute;
        width: 320px;
        height: 1px;
        top: 30px;
        left: 10px;
        border-bottom: 1px solid #abacaf;
      }

      .icon-sousuo1 {
        position: absolute;
        right: 280px;
        font-size: 25px;
        color: #434343;
        cursor: pointer;
      }
    }
  }

  .musicControl {
    position: absolute;
    bottom: 0px;
    height: 70px;

    .iconControl {
      line-height: 70px;
      margin-left: 120px;

      .itemControl {
        position: relative;
        float: left;
        line-height: 50px;
        text-align: center;
        bottom: 0px;
        width: 50px;
        height: 50px;
        margin-top: 10px;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
          .itemBorder {
            display: inline-block;
          }

          .iconfont {
            color: #9530a3;
          }
        }

        .iconfont {
          position: absolute;
          top: 0;
          left: 15px;
          z-index: 99;
          text-align: center;
          line-height: 50px;
          font-size: 25px;
        }

        .itemBorder {
          position: absolute;
          top: 2px;
          left: 3px;
          display: none;
          border: 1px solid #7b7b7d;
          background-color: #e6e6e6;
          width: 45px;
          height: 45px;
          border-radius: 35px;
        }
      }

      .volume-slider {
        position: absolute;
        top: 22px;
        z-index: 999;
        left: 310px;
        width: 60px;
      }
    }

    .musicSilder {
      position: relative;
      top: -38px;
      left: 500px;
      width: 430px;
      height: 40px;
    }

    .musicBarTime {
      position: relative;
      top: -38px;
      left: 950px;
      height: 40px;
    }

    .minBox {
      cursor: pointer;

      &:hover {
        background-color: #9530a330;
      }

      position: absolute;
      right: -850px;
      bottom: 1px;
      width: 270px;
      height: 70px;

      .minImg {
        margin-left: 5px;
        margin-top: 5px;
        float: left;
        width: 60px;
        height: 60px;
        line-height: 70px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .infoBox {
        float: left;

        .prevsonger,
        .prevName {
          margin-top: 10px;
          display: block;
          margin-left: 10px;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .prevsonger {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }

  // 弹框动画
  .mu-scale-transition-enter-active,
  .mu-scale-transition-leave-active {
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    backface-visibility: hidden;
  }

  .mu-scale-transition-enter,
  .mu-scale-transition-leave-active {
    transform: scale(0);
    opacity: 0;
  }

  .mainContainer {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 52px;
    left: 70px;
    background-color: #fff;
    width: calc(100% - 70px);
    height: calc(100% - 122px);
    // box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.3);
    box-shadow: -5px 3px 13px rgba(0, 0, 0, 0.2);
  }
}
</style>
