<template>
  <div>
    <a-row style="margin-bottom: 2.4rem;background: white;  padding: 1.2rem;display: flex;align-items:center;">
      <a-col :sm="24" :md="12" :xl="12">
        <div style="display: flex">
          <div class="avatar">
            <a-avatar :size="80" icon="user"
                      :src="user && user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" />
          </div>
          <div
            style="margin-left: 2rem;display: flex;flex-direction:column;justify-content:space-between;padding: 8px 0;">
            <div class="content-title animate__animated animate__bounce">
              {{ timeFix }}，{{ user && user.username }}
            </div>
            <div>前端工程师 | 百智科技 - 研发部</div>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12">
        <div style="display: flex;justify-content: space-around;align-items: center;">
          <div class="stat-item">
            <a-statistic title="项目数" :value="6" />
          </div>
          <div class="stat-item">
            <a-statistic title="未修复BUG" :value="8" />
          </div>
          <div class="stat-item">
            <a-statistic title="项目访问" :value="2223" />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 2.4rem;background: white;">
      <a-card :loading="loading" title="参与项目" style="margin-left: 0;">
        <a slot="extra">全部项目</a>
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
    <a-row style="margin-bottom: 2.4rem; background: white;">
      <a-card :loading="loading" title="动态" :bordered="false">
        <a-list>
          <a-list-item :key="index" v-for="(item, index) in dynamicList">
            <a-list-item-meta>
              <a-avatar slot="avatar" size="small" :src="item.user.avatar" />
              <div slot="title">
                <span>{{ item.user.nickname }}</span>
                <span style="margin: 0 1rem">在</span>
                <a href="#">{{ item.project.name }}</a>
                <span style="margin: 0 1rem">{{ item.project.action }}</span>
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
      timeFix: timeFix(),
      dynamicList: [{
        user: {
          nickname: '前端开发',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        },
        project: { name: '珠海A项目', action: '添加', event: '项目' },
        time: '2019-01-01 12:00:00'
      }]
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('setting', ['contentHeight'])
  }
};
</script>

<style lang="less" scoped>
.content-title {
  font-size: 2.4rem;
  font-weight: 500;
}
</style>