<template>
  <div class="container2" :style="`height: calc(100vh - ${contentHeight}px)`">
    <a-row style="margin-bottom: 2.4rem;background: white;  padding: 1.2rem;">
      <a-col :sm="24" :md="12" :xl="12">
        <div style="display: flex">
          <div class="avatar">
            <a-avatar :size="80" icon="user" :src="user.avatar" />
          </div>
          <div
            style="margin-left: 2rem;display: flex;flex-direction:column;justify-content:space-between;padding: 8px 0;">
            <div class="content-title">
              {{ timeFix }}，{{ user.username }}
            </div>
            <div>前端工程师 | 百智科技 - 研发部</div>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12">
        <div style="display: flex;justify-content: space-around;align-items: center;">
          <div class="stat-item">
            <a-statistic title="项目数" :value="56" />
          </div>
          <div class="stat-item">
            <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
          </div>
          <div class="stat-item">
            <a-statistic title="项目访问" :value="2223" />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 2.4rem;background: white;  padding: 1.2rem;">
      <a-card title="参与项目" style="margin-left: 0;">
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
        <a-card-grid style="width:25%;text-align:center">
          珠海A项目
        </a-card-grid>
      </a-card>
    </a-row>
    <a-row style="margin-bottom: 2.4rem;background: white;  padding: 1.2rem;">
      <a-card style="margin-top: 2.4rem" :loading="loading" title="动态" :bordered="false">
        <a-list>
          <a-list-item :key="index" v-for="(item, index) in []">
            <a-list-item-meta>
              <a-avatar slot="avatar" size="small" :src="item.user.avatar" />
              <div slot="title">
                    <span>{{ item.user.nickname }}</span
                    >&nbsp; 在&nbsp;<a href="#">{{ item.project.name }}</a
              >&nbsp; <span>{{ item.project.action }}</span
              >&nbsp;
                <a href="#">{{ item.project.event }}</a>
              </div>
              <div slot="description">{{ item.time }}</div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { timeFix } from 'utils/common';

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      welcome: '',
      timeFix: timeFix()
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('setting', ['contentHeight'])
  }
};
</script>

<style lang="less" scoped>
.container {
  //border: 1px solid red;
}

.content-title {
  font-size: 2.4rem;
  font-weight: 500;
}
</style>