<template>
  <div>
    <a-row :gutter="16" style="padding-top: 2rem">
      <a-col :sm="24" :md="8" :xl="6">
        <a-card :loading="loading">
          <div class="avatar-and-name"
               style="display:flex;justify-content: center;align-items: center;flex-direction: column">
            <a-avatar :size="88" :src="user.avatar" />
            <p style="font-weight: bold;font-size: 2rem">{{ 'Mike Chen' }}</p>
            <p>{{ '生于忧患死于安乐' }}</p>
            <div style="width: 100%">
              <p>
                <i class="title"></i>前端工程师
              </p>
              <p>
                <i class="group"></i>百智科技－技术研发部
              </p>
            </div>
          </div>

        </a-card>
      </a-col>
      <a-col :sm="24" :md="16" :xl="18">
        <a-card :loading="loading" title="参与项目" style="">
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
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserInfo',
  data() {
    return {
      user2: {
        name: 'John Doe',
        email: ''
      },
      loading: true
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  computed: {
    ...mapState('auth', ['user'])
  }
};
</script>

<style lang="less" scoped>
.avatar-and-name {
  background: red;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
p{
  margin: 2px;
}
</style>