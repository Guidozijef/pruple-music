import { defineStore } from "pinia";
import { getHistoryList } from "../utils";

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useMusicStore = defineStore("music", {
  // other options...
  state: () => ({
    audioEle: null, // audio元素
    songPlayUrl: "", // 当前播放的链接地址
    songPlayLrc: [], // 当前歌词
    currentTime: 0, // 当前已播放的时间
    importUserInfo:
      JSON.parse(localStorage.getItem("userInfo") as string) || [], // 存储导入的歌单
    prevPlayList: {
      tracks: [],
    }, // 当前播放的歌单
    prevPlaySong: { al: "" }, // 当前播放的歌曲信息
    wangyiyun: {
      hottest: {},
      hot: {}, // 最热歌单
      boutique: {}, // 精品歌单
    },
    qq: {
      allData: {}, // 全部qq音乐数据
      hottest: {},
      hot: {}, // 最热歌单
      boutique: {}, // 精品歌单
    },
    historyList: getHistoryList() || [],
  }),
  getters: {
    // audio元素
    // audioEle(state) {
    //   return state.audioEle;
    // },
    // 播放链接地址
    // songPlayUrl(state) {
    //   return state.songPlayUrl;
    // },
    // 当前播放的歌词
    // songPlayLrc(state) {
    //   return state.songPlayLrc;
    // },
    // 当前已播放的时间
    // currentTime(state) {
    //   return state.currentTime;
    // },
    // importUserInfo(state) {
    //   return state.importUserInfo;
    // },
    // prevPlayList(state) {
    //   return state.prevPlayList;
    // },
    // prevPlaySong(state) {
    //   return state.prevPlaySong;
    // },
    wy_HottestSongList(state) {
      return state.wangyiyun.hottest;
    },
    wy_HotSongList(state) {
      return state.wangyiyun.hot;
    },
    wy_BoutiqueSongList(state) {
      return state.wangyiyun.boutique;
    },
    qq_HottestSongList(state) {
      return state.qq.hottest;
    },
    qq_allDataList(state) {
      return state.qq.allData;
    },
    qq_HotSongList(state) {
      return state.qq.hot;
    },
    qq_BoutiqueSongList(state) {
      return state.qq.boutique;
    },
    // historyList(state) {
    //   return state.historyList;
    // },
  },
  actions: {
    // 修改audio元素
    setAudioEle(audioEle: Element | any) {
      this.audioEle = audioEle;
    },
    // 播放链接地址
    setSongPlayUrl(songPlayUrl: string) {
      this.songPlayUrl = songPlayUrl;
    },
    // 播放的歌词
    setSongPlayLrc(songPlayLrc: string) {
      // this.songPlayLrc = songPlayLrc;
      if (songPlayLrc === "") return "";
      const lyrics = songPlayLrc.split("\n");
      const lrcList = [];
      for (let i = 0; i < lyrics.length; i++) {
        const lyric = decodeURIComponent(lyrics[i]);
        const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g;
        const timeRegExpArr = lyric.match(timeReg);
        if (!timeRegExpArr) continue;
        const clause = lyric.replace(timeReg, "");
        for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
          const t = timeRegExpArr[k];
          const min = Number(String(t.match(/\[\d*/i)).slice(1));
          const sec = Number(String(t.match(/:\d*/i)).slice(1));
          const times = min * 60 + sec;
          lrcList.push({ times: times, clause: clause });
        }
      }
      this.songPlayLrc = []; // lrcList;
    },
    // 当前播放的时间
    setCurrentTime(currentTime: number) {
      this.currentTime = currentTime;
    },
    // 网易云最热歌单
    set_WY_HottestSongList(wyHottestSongList: any[]) {
      this.wangyiyun.hottest = wyHottestSongList;
    },
    // 网易云最热歌单
    set_WY_HotSongList(wyHotSongList: any[]) {
      this.wangyiyun.hot = wyHotSongList;
    },
    // 网易云最热歌单
    set_WY_BoutiqueSongList(wyBoutiqueSongList: any[]) {
      this.wangyiyun.boutique = wyBoutiqueSongList;
    },
    // QQ全部数据
    set_QQ_allDataList(qqAllDataList: any[]) {
      this.qq.allData = qqAllDataList;
    },
    // QQ最热歌单
    set_QQ_HottestSongList(qqHottestSongList: any[]) {
      this.qq.hottest = qqHottestSongList;
    },
    // QQ最热歌单
    set_QQ_HotSongList(qqHotSongList: any[]) {
      this.qq.hot = qqHotSongList;
    },
    // QQ最热歌单
    set_QQ_BoutiqueSongList(qqBoutiqueSongList: any[]) {
      this.qq.boutique = qqBoutiqueSongList;
    },
    // 修改audio元素
    setImportUserInfo(importUserInfo: never[]) {
      this.importUserInfo = importUserInfo;
    },
    // 修改audio元素
    setPrevPlayList(prevPlayList: { tracks: never[] }) {
      this.prevPlayList = prevPlayList;
    },
    // 修改audio元素
    setPrevPlaySong(prevPlaySong: { al: string }) {
      this.prevPlaySong = prevPlaySong;
    },
    // 历史记录数据
    setHistory(historyList: any[]) {
      this.historyList = historyList;
    },
  },
});
