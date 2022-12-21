<template>
  <div ref="homePage" class="homePage-container" @scroll="handleScroll">
    <span :class="state.titleActive ? 'titleActive' : 'title'">{{
      state.hello
    }}</span>
    <div class="recommend-containter">
      <div class="history">为你推荐</div>
      <div class="recommendBox">
        <!-- {{qq_allDataList.recomPlaylist}} -->
        <!-- <slider
          ref="slider"
          :options="options"
          class="itemBox"
          v-if="historyData"
        >
          <slideritem
            class="item"
            v-for="item in qqAllData"
            :key="item.content_id"
            @click="goSongDetails(item.id)"
          >
            <div class="imgBox">
              <img :src="item.cover" alt />
            </div>
            <span class="imgTitle" :title="item.title">{{item.title}}</span>
            <span class="listenNum" :title="item.listen_num">{{item.listen_num}}</span>
          </slideritem>
        </slider> -->
      </div>
    </div>
    <div class="like-container">
      <div class="history">上次播放</div>
      <ul v-if="state.historyData" class="likeBox">
        <li
          v-for="item in state.historyData"
          :key="item.id"
          class="itemLike"
          @click="goSongDetails(item.id)"
        >
          <div v-if="item.al" class="imgLike">
            <img :src="item.al.picUrl" alt />
          </div>
          <span v-if="item.name" class="imgTitle" :title="item.name">{{
            item.name
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, onUnmounted } from "vue";
// import { slider, slideritem } from "vue-concise-slider";
import { useRoute } from "vue-router";
import { useMusicStore } from "../stores/music";

const musicStore = useMusicStore();

const router = useRoute();

const state = reactive({
  hello: "",
  historyData: [],
  titleActive: false,
  options: {
    currentPage: 0,
  },
});

const historyList = computed(() => musicStore.historyList);
const qq_allDataList = computed(() => musicStore.qq_allDataList);

const qqAllData = computed(() => {
  let array = qq_allDataList.value.recomPlaylist
    ? qq_allDataList.value.recomPlaylist.data.v_hot
    : [];
  array.forEach((ele) => {
    ele.style = {
      background: "#1bbc9b",
      width: "100%",
      "margin-right": "20px",
    };
  });
  return array;
});

// 清除历史记录中的空对象
if (historyList.value) {
  historyList.value.forEach((ele, index) => {
    if (ele.name != undefined) {
      state.historyData.push(ele);
    }
  });
}
let time = new Date().getHours(); //获取当前小时数(0-23)
if (0 < time && time < 5) {
  state.hello = "晚上好";
} else if (5 <= time && time < 11) {
  state.hello = "早上好";
} else if (11 <= time && time < 14) {
  state.hello = "中午好";
} else if (14 <= time && time < 18) {
  state.hello = "下午好";
} else {
  state.hello = "晚上好";
}

const handleScroll = () => {
  if (document.querySelector(".mainContainer").scrollTop > 50) {
    state.titleActive = true;
  } else {
    state.titleActive = false;
  }
};

const goSongDetails = (songId) => {
  musicStore.setPrevPlayList({ obj: musicStore.historyList });
  musicStore.historyList.forEach((item) => {
    if (item.id == songId) {
      musicStore.setPrevPlaySong({ obj: item });
    }
  });
  router.push({
    name: "songDetails",
    params: { songId: "wy_" + songId },
  });
};

const getQQAllData = () => {
  // $.ajax({
  //   type: "get",
  //   url:
  //     "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom4017956852977256&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22category%22%3A%7B%22method%22%3A%22get_hot_category%22%2C%22param%22%3A%7B%22qq%22%3A%22%22%7D%2C%22module%22%3A%22music.web_category_svr%22%7D%2C%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%2C%22playlist%22%3A%7B%22method%22%3A%22get_playlist_by_category%22%2C%22param%22%3A%7B%22id%22%3A8%2C%22curPage%22%3A1%2C%22size%22%3A40%2C%22order%22%3A5%2C%22titleid%22%3A8%7D%2C%22module%22%3A%22playlist.PlayListPlazaServer%22%7D%2C%22new_song%22%3A%7B%22module%22%3A%22newsong.NewSongServer%22%2C%22method%22%3A%22get_new_song_info%22%2C%22param%22%3A%7B%22type%22%3A5%7D%7D%2C%22new_album%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_info%22%2C%22param%22%3A%7B%22area%22%3A1%2C%22sin%22%3A0%2C%22num%22%3A10%7D%7D%2C%22new_album_tag%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_area%22%2C%22param%22%3A%7B%7D%7D%2C%22toplist%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetAll%22%2C%22param%22%3A%7B%7D%7D%2C%22focus%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetFocus%22%2C%22param%22%3A%7B%7D%7D%7D",
  //   ContentType: "application/x-www-form-urlencoded",
  //   dataType: "jsonp",
  //   success: jsData => {
  //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
  //     nextTick(() => {
  //       musicStore.set_QQ_allDataList({ data: jsData });
  //       // console.log(jsData);
  //     });
  //   }
  // });
  musicStore.set_QQ_allDataList({ data: [] });
};

getQQAllData();

onMounted(() => {
  nextTick(() => {
    window.addEventListener("scroll", handleScroll, true);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<style lang="scss" scoped>
.homePage-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin-left: 20px;
  margin: 20px;
  background-color: #fff;

  .titleActive {
    padding-left: 20px;
    position: fixed;
    display: block;
    left: 70px;
    top: 52px;
    line-height: 100px;
    font-size: 30px;
    font-weight: 700;
    width: 100%;
    background-color: #f8f8f8;
    opacity: 0.95;
    z-index: 2;
  }

  .title {
    transition: all 1s ease;
    margin-top: 150px;
    display: block;
    font-size: 50px;
    font-weight: 700;
  }

  .recommend-containter {
    .history {
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      font-weight: 700;
    }

    .recommendBox {
      // height: 300px;
      // width: 250%;
      .itemBox {
        overflow: hidden;
        margin-top: 20px;

        .item {
          float: left;
          width: 250px;
          height: 250px;
          margin-left: 20px;

          .imgBox {
            img {
              width: 250px;
              height: 250px;
            }
          }
        }
      }
    }
  }

  .like-container {
    .history {
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      font-weight: 700;
    }

    .likeBox {
      padding-left: 10px;
      padding-top: 10px;

      // display: flex;
      // justify-content: space-around;
      .itemLike {
        float: left;
        margin: 20px;
        text-align: center;
        cursor: pointer;

        .imgLike {
          background-color: #9530a3;
          width: 200px;
          height: 200px;

          img {
            width: 200px;
            height: 200px;
          }
        }

        .imgTitle {
          font-size: 14px;
          display: block;
          line-height: 30px;
          height: 30px;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
