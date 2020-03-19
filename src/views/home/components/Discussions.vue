<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="card-body">
      <div v-for="(discussion, idx) in discussionsData" :key="idx" :class="idx===discussionsData.length-1?'':'blog-comments-item'">
        <el-row>
          <el-col :sm="6" :md="6" :lg="6">
            <!-- Avatar -->
            <div class="blog-comments-avatar">
              <img :src="discussion.author.image" :alt="discussion.author.name" />
              <a class="text-secondary" :href="discussion.author.url">{{ discussion.author.name }}</a>
            </div>
          </el-col>
          <el-col :sm="18" :md="18" :lg="18">
            <!-- Content -->
            <div class="blog-comments-content">
              <!-- Content - Title -->
              <div class="blog-comments-meta">
                <a class="text-secondary" :href="discussion.post.url">{{ discussion.post.title }}</a>
                <span class="text-muted">– {{ discussion.date }}</span>
              </div>
              <!-- Content - Body -->
              <p class="text-muted">{{ discussion.body }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card-foot">
      <el-button type="submit" @click="handleClick('view-all-comments')">View All Comments</el-button>
    </div>
  </el-card>
</template>

<script>
const defaultDiscussionsData = [{
  id: 1,
  date: '3 days ago',
  author: {
    image: require('@/assets/images/avatars/1.png?imageView2/1/w/80/h/80'),
    name: 'John Doe',
    url: '#',
  },
  post: {
    title: 'Hello World!',
    url: '#',
  },
  body: 'Well, the way they make shows is, they make one show ...',
}, {
  id: 2,
  date: '4 days ago',
  author: {
    image: require('@/assets/images/avatars/2.png'),
    name: 'John Doe',
    url: '#',
  },
  post: {
    title: 'Hello World!',
    url: '#',
  },
  body: 'After the avalanche, it took us a week to climb out. Now...',
}, {
  id: 3,
  date: '5 days ago',
  author: {
    image: require('@/assets/images/avatars/3.png'),
    name: 'John Doe',
    url: '#',
  },
  post: {
    title: 'Hello World!',
    url: '#',
  },
  body: 'My money\'s in that office, right? If she start giving me...',
}];

export default {
  name: 'discussions',
  props: {
    //The component's title.
    title: {
      type: String,
      default: '热门话题',
    },
    //The discussions data.
    discussionsData: {
      type: Array,
      default() {
        return defaultDiscussionsData;
      },
    },
  },
  methods: {
    /**
     * Emits an action and passes the discussions' ID for reference.
     * @param  {String} action The action type. One of: approve,reject,edit,view-all-comments
     */
    handleClick(action, id) {
      this.$emit(action, id);
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-height: 605px;
}
.card-header {
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid #e1e5eb;
}
.card-body {
  padding: 0;
}
.el-row {
  padding: 16px;
}
.blog-comments-item {
  border-bottom: 1px solid #e1e5eb;  
}
.blog-comments-avatar img {
  border-radius: 4px;
  width: 60px;
  height: 60px;
  display: block;
}
.text-secondary {
  font-size: 12px;
  color: #5a6169;
}
.blog-comments-meta {
  margin-bottom: 5px;
}
.blog-comments-meta a,span {
  font-size: 15px;
}
.text-muted {
  font-size: 12px;
  color: #868e96;
}
.card-foot {
  padding: 16px;
  border-top: 1px solid #e1e5eb;
  text-align: center;
}
</style>
