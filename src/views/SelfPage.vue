<template>
  <div class="Self-container">
    <div class="self-left">
      <div>
        <div class="selfTitle">
          我的歌单
          <span
            class="iconfont icon-jia"
            style="font-size: 22px; float: right; margin-right: 10px; cursor: pointer"
            @click="creatorSongList()"
          ></span>
        </div>
        <ul v-if="state.addSongList" class="addList">
          <li v-for="item in state.addSongList" :key="item.id" class="addItem" @click="goSongList(item.name)">
            <div v-if="item.img" class="listCover">
              <img :src="item.img.replace('http', 'https')" alt srcset />
            </div>
            <div class="infoBox">
              <span class="listName">{{ item.name }}</span>
              <div class="listSum">
                <span calss="number" style="margin-right: 5px">{{ item.tracks.length }}首 by {{ item.creator }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <div class="selfTitle">网易歌单</div>
        <ul v-if="importUserInfo.length" class="addList">
          <li v-for="item in importUserInfo" :key="item.id" class="addItem" @click.prevent="goImportList(item.id)">
            <div v-if="item" class="listCover">
              <img :src="item.coverImgUrl" alt srcset />
            </div>
            <div class="infoBox">
              <span class="listName">{{ item.name }}</span>
              <div class="listSum">
                <span calss="number" style="margin-right: 5px">{{ item.trackCount }}首 by {{ item.creator.nickname }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="addBtn" @click="importList()">
        <span>{{ !importUserInfo.length ? "导入网易歌单" : "退出网易歌单" }}</span>
      </div>
    </div>
    <div v-if="importUserInfo.length || prevPlayList.name" class="self-right">
      <div :class="titleActive ? 'titleActive' : 'infoBox'">
        <div v-if="prevPlayList.coverImgUrl" class="songListCover">
          <img :src="prevPlayList.coverImgUrl.replace('http', 'https')" alt srcset />
        </div>
        <div class="songListInfoBox">
          <span class="songListName">{{ prevPlayList.name }}</span>
          <span class="songListDescription">{{ prevPlayList.description }}</span>
          <div v-if="!titleActive" class="songListSum" style="margin-left: 20px">
            <span calss="number" style="margin-right: 5px"
              >共<i style="fontweight: 700"> {{ prevPlayList.trackCount }} </i>首</span
            >
            <span v-if="prevPlayList.playCount" calss="number" style="margin-right: 5px">
              共播放
              <i style="font-weight: 700">{{
                prevPlayList.playCount.toString().length > 4 ? `${prevPlayList.playCount.toString().slice(0, -4)}万` : prevPlayList.playCount
              }}</i>
              次
            </span>
          </div>
        </div>
      </div>
      <div class="songList">
        <ul>
          <li style="background-color: #e0e0e0">
            <span class="idx"></span>
            <span class="songName">歌曲</span>
            <span class="songer">歌手</span>
            <span class="songAr">专辑</span>
          </li>
          <li v-for="(item, index) in prevPlayList.tracks" :key="index" :class="{ bgEven: (index + 1) % 2 == 0 ? true : false }">
            <span class="idx">{{ index + 1 }}</span>
            <span class="songName" @click="goSongDetails(item.id)">{{ item.name }}</span>
            <span class="songer">{{ item.ar[0].name }}</span>
            <span class="songAr">{{ item.al.name }}</span>
            <!-- <div class="itemControl">
                <span class="iconfont icon-xiayishoubofang" style="cursor: pointer;" title="下一首播放"></span>
                <el-dropdown @command="handleCommand">
                  <span
                    class="el-dropdown-link iconfont icon-gengduo5"
                    style="cursor: pointer;margin-top:-5px;"
                  >
                    <span class="iconfont icon-gengduo5" style="cursor: pointer;margin-top:-5px;"></span>
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                    v-for="(addSong, index) in addSongList"
                    :key="index"
                  >
                    <el-dropdown-item
                      :command="{songListId:item.id, songName:addSong.name}"
                    >{{addSong.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, nextTick, onMounted, reactive } from "vue-demi";
  import { useMusicStore } from "../stores/music";
  import { useRouter } from "vue-router";
  import request from "../request";

  const musicStore = useMusicStore();
  const router = useRouter();
  const state = reactive({
    addSongList: [],
    titleActive: false,
    containerHeight: window.innerHeight - 122 + "px",
  });

  state.addSongList = JSON.parse(localStorage.getItem("addList") as string) || [];

  const importUserInfo = computed(() => musicStore.importUserInfo);
  const prevPlayList = computed(() => musicStore.prevPlayList);
  const historyList = computed(() => musicStore.historyList);

  const handleScroll = () => {
    if (document.querySelector(".mainContainer").scrollTop > 0) {
      state.titleActive = true;
    } else {
      state.titleActive = false;
    }
  };

  const importList = async () => {
    if (!importUserInfo.value.length) {
      const uid = "1581414085";

      const { code, token, account } = await request.get("/login/cellphone?phone=18842498090&password=913497146zjf", {});
      if (code === 200) {
        localStorage.setItem("token", token);
      }

      const { code: status } = await request.get("/user/playlist?uid=" + account.id);

      // this.$prompt("请输入网易云Uid", "提示", {
      //   validator(value) {
      //     return {
      //       valid: /\d+/.test(value),
      //       message: "请输入正确的网易云Uid",
      //     };
      //   },
      // }).then(({ result, value }) => {
      //   if (result) {
      //     $.ajax({
      //       type: "get",
      //       url: "https://api.mtnhao.com/user/playlist",
      //       data: {
      //         uid: value,
      //       },
      //       dataType: "json",
      //       success: (data) => {
      //         nextTick(() => {
      //           musicStore.setImportUserInfo({ data: data.playlist });
      //         });
      //       },
      //     });
      //   } else {
      //     // this.$toast.message("点击了取消");
      //   }
      // });
    } else {
      musicStore.setImportUserInfo([]);
    }
  };

  const goImportList = () => {
    // $.ajax({
    //       type: "get",
    //       url: "https://api.mtnhao.com/playlist/detail?id=" + id,
    //       dataType: "json",
    //       success: data => {
    //         this.$nextTick(() => {
    //           // this.importData = data.playlist;
    //           this.setPrevPlayList({ obj: data.playlist });
    //         });
    //       }
    //     });
    musicStore.setPrevPlayList({ tracks: [] }); // data.playlist
  };

  const goSongList = (songListName) => {
    JSON.parse(localStorage.getItem("addList")).forEach((ele) => {
      if (ele.name == songListName) {
        ele.trackCount = ele.tracks.length;
        musicStore.setPrevPlayList({ obj: ele });
      }
    });
  };
  const goSongDetails = (songId) => {
    prevPlayList.value.tracks.forEach((ele) => {
      if (ele.id == songId) {
        musicStore.setPrevPlaySong({ obj: ele });
      }
    });
    router.push({
      name: "songDetails",
      params: { songId: "wy_" + songId },
    });
  };

  const creatorSongList = () => {
    // this.$prompt("请输入歌单名称", "提示", {
    //       validator(value) {
    //         return {
    //           valid: value
    //           // message: "请输入正确的网易云Uid"
    //         };
    //       }
    //     }).then(({ result, value }) => {
    //       if (result) {
    //         let obj = {
    //           name: value,
    //           coverImgUrl:
    //             "http://p.qpic.cn/music_cover/aaxX4Babic4VicBPicJOwr5xmE7IYuBzNiaRLyfbDZHmatYE1EliaZeVD9Q/600?n=1",
    //           img:
    //             "http://p.qpic.cn/music_cover/aaxX4Babic4VicBPicJOwr5xmE7IYuBzNiaRLyfbDZHmatYE1EliaZeVD9Q/600?n=1",
    //           creator: "my",
    //           tracks: [],
    //           trackCount: 0
    //         };
    //         state.addSongList.push(obj);
    //         // this.setHistory(this.addSongList);
    //         localStorage.setItem("addList", JSON.stringify(state.addSongList));
    //       } else {
    //         // this.$toast.message("点击了取消");
    //       }
    //     });
    localStorage.setItem("addList", JSON.stringify(state.addSongList));
  };

  // 点击添加到本地的函数
  const handleCommand = (command) => {
    prevPlayList.value.tracks.forEach((item, n) => {
      if (command.songListId == item.id) {
        // 循环本地歌单，如果名字相同，就表示为当前要添加到的哪个歌单
        state.addSongList.forEach((ele, m) => {
          if (command.songName == ele.name) {
            ele.tracks.unshift(item);
            ele.img = ele.coverImgUrl = ele.tracks[0].al.picUrl;
            alert("添加成功");
            localStorage.setItem("addList", JSON.stringify(state.addSongList));
          }
        });
      }
    });
  };

  onMounted(() => {
    nextTick(() => {
      window.addEventListener("scroll", handleScroll, true);
    });
  });
</script>
<style lang="scss" scoped>
  .Self-container {
    .self-left {
      position: fixed;
      width: 300px;
      border-right: 1px solid #9b9b9b;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 122px);

      .selfTitle {
        background-color: #fff;
        position: sticky;
        top: 0px;
        font-size: 16px;
        font-weight: 700;
        padding-left: 20px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #9b9b9b;
      }

      .addList {
        .addItem {
          padding-left: 20px;
          height: 60px;
          cursor: pointer;
          transition: all 0.5s ease;

          .listCover {
            img {
              width: 100%;
              height: 100%;
            }

            margin-top: 5px;
            line-height: 60px;
            width: 50px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0.322);
            float: left;
          }

          .infoBox {
            margin-left: 10px;
            float: left;

            .listName {
              display: block;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 31px;
              font-size: 14px;
              font-weight: 700;
            }

            .listSum {
              font-size: 12px;
              line-height: 20px;
              color: #9b9b9b;
            }
          }

          &:hover {
            background-color: #9530a330;

            .listName {
              color: #b773c1;
            }

            .listSum {
              color: #b773c1;
            }
          }
        }
      }

      .addBtn {
        margin: 0 auto;
        display: block;
        cursor: pointer;
        width: 250px;
        text-align: center;
        line-height: 30px;

        &:hover {
          background-color: #9530a330;

          span {
            color: #9530a3;
          }
        }

        span {
          font-size: 14px;
        }
      }
    }

    .self-right {
      margin-left: 300px;

      .titleActive {
        position: fixed;
        top: 52px;
        height: 100px;
        width: 100%;
        background-color: #e6e6e6;
        opacity: 0.95;

        .songListCover {
          width: 80px;
          height: 80px;
          float: left;
          margin-left: 10px;

          img {
            margin: 10px;
            width: 100%;
            height: 100%;
          }
        }

        .songListInfoBox {
          margin: 20px 0;
          float: left;

          .songListName {
            margin-left: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: wrap;
            display: block;
            font-size: 18px;
            font-weight: 700;
            line-height: 50px;
          }

          .songListDescription {
            display: none;
          }
        }
      }

      .infoBox {
        height: 240px;

        .songListCover {
          width: 200px;
          height: 200px;
          float: left;
          line-height: 100px;

          img {
            margin: 20px;
            width: 100%;
            height: 100%;
          }
        }

        .songListInfoBox {
          margin: 20px 20px;
          float: left;

          .songListName {
            margin-left: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: wrap;
            display: block;
            font-size: 18px;
            font-weight: 700;
            line-height: 50px;
          }

          .songListDescription {
            margin-left: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: wrap;
            width: 550px;
            height: 127px;
            display: block;
            line-height: 25px;
          }
        }
      }

      .songList {
        ul {
          .bgEven {
            background-color: #f9f9f9;
          }

          li {
            height: 40px;
            width: 100%;

            &:hover {
              // background-color: #e0e0e0;
              background: -webkit-gradient(linear, 0 0, 0 bottom, from(#9530a330), to(#dedfdf));

              .itemControl {
                display: inline-block;

                span {
                  // color:#fff;
                  font-size: 20px;
                  margin-top: 5px;
                  display: inline-block;
                }
              }
            }

            .idx {
              color: #6b3c71;
              line-height: 40px;
              text-align: center;
              display: inline-block;
              width: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
            }

            .songName {
              line-height: 40px;
              display: inline-block;
              margin-left: 20px;
              width: 250px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
              cursor: pointer;
            }

            .songer {
              line-height: 40px;
              margin-left: 50px;
              display: inline-block;
              width: 180px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
            }

            .songAr {
              line-height: 40px;
              display: inline-block;
              overflow: hidden;
              width: 200px;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
            }

            .itemControl {
              display: none;
              float: right;
              margin-right: 20px;
              font-size: 20px;
              width: 100px;
            }
          }
        }
      }
    }
  }
</style>
