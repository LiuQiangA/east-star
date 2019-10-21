import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  linkActiveClass: "list_active",
  routes: [{
      path: '/',
      name: 'layout',
      component: resolve => require(['@/view/layout'], resolve),
      redirect: 'activity',
      children: [
        //今日所学->活动介绍
        {
          path: '/activity',
          name: 'activity',
          component: resolve => require(['@/view/activity'], resolve)
        },

        //活动详情
        {
          path: '/activityDetails',
          name: 'activityDetails',
          component: resolve => require(['@/view/activityDetails'], resolve)
        },

        //班级设置->班级二维码
        {
          path: '/classCode',
          name: 'classCode',
          component: resolve => require(['@/view/classCode'], resolve)
        },

        //教研圈 ->教研资讯详情
        {
          path: '/consultDetails',
          name: 'consultDetails',
          component: resolve => require(['@/view/consultDetails'], resolve),
          meta: {
            keepAlive: false
          }
        },

        //关于我们->课程简介详情
        {
          path: '/courseDetails',
          name: 'courseDetails',
          component: resolve => require(['@/view/courseDetails'], resolve)
        },

        //留作业->拓展练习
        {
          path: '/extendPractice',
          name: 'extendPractice',
          component: resolve => require(['@/view/extendPractice'], resolve),
          meta: {
            keepAlive: true
          }
        },
        //留作业->拓展练习详情
        {
          path: '/extendPracticeDet',
          name: 'extendPracticeDet',
          component: resolve => require(['@/view/extendPracticeDet'], resolve)
        },

        //教师课堂 ->视频详情
        {
          path: '/videoDetails',
          name: 'videoDetails',
          component: resolve => require(['@/view/videoDetails'], resolve)
        },
        {
          path: '/login',
          name: 'login',
          component: resolve => require(['@/view/login'], resolve)
        },
        //教研圈
        {
          path: '/teaCircle',
          name: 'teaCircle',
          redirect: '/teaCircle/consult',
          component: resolve => require(['@/view/teaCircle/layout'], resolve),
          children: [
            //教研咨询
            {
              path: '/teaCircle/consult',
              name: 'consult',
              component: resolve => require(['@/view/teaCircle/consult'], resolve),
              meta: {
                keepAlive: true,
                tab: true
              }
            },
            //分享交流
            {
              path: '/teaCircle/communion',
              name: 'communion',
              component: resolve => require(['@/view/teaCircle/communion'], resolve),
              meta: {
                keepAlive: true,
                tab: true
              }
            },
            //教研问答
            {
              path: '/teaCircle/questions',
              name: 'questions',
              component: resolve => require(['@/view/teaCircle/questions'], resolve),
              meta: {
                keepAlive: true,
                tab: true
              }
            },
            //分享交流-详情
            {
              path: '/teaCircle/communionDet',
              name: 'communionDet',
              component: resolve => require(['@/view/teaCircle/communionDet'], resolve),
              meta: {
                keepAlive: false,
                tab: false
              }
            },

            //教研问答-详情
            {
              path: '/teaCircle/questionsDet',
              name: 'questionsDet',
              component: resolve => require(['@/view/teaCircle/questionsDet'], resolve),
              meta: {
                keepAlive: false,
                tab: false
              }
            },
            //点赞列表
            {
              path: '/teaCircle/zan',
              name: 'zan',
              component: resolve => require(['@/view/teaCircle/zan'], resolve),
              meta: {
                keepAlive: false
              }
            },
          ]
        },
        //点赞列表
        {
          path: '/zan',
          name: 'zan',
          component: resolve => require(['@/view/zan'], resolve),
          meta: {
            keepAlive: false
          }
        },

        //分享交流-详情
        {
          path: '/communionDet',
          name: 'communion',
          component: resolve => require(['@/view/teaCircle/communionDet'], resolve),
          meta: {
            keepAlive: false
          }
        },

        //教研问答-详情
        {
          path: '/questionsDet',
          name: 'questions',
          component: resolve => require(['@/view/teaCircle/questionsDet'], resolve),
          meta: {
            keepAlive: false
          }
        },
        //点赞列表
        {
          path: '/zan',
          name: 'zan',
          component: resolve => require(['@/view/teaCircle/zan'], resolve),
          meta: {
            keepAlive: false
          }
        },

        // 班级圈
        {
          path: '/classCircle',
          name: 'classCircle',
          component: resolve => require(['@/view/class/classCircle'], resolve)
        },
        // 班级圈-分享详情
        {
          path: '/classCircleDet',
          name: 'classCircle',
          component: resolve => require(['@/view/class/classCircleDet'], resolve)
        },

        // 我的班级圈
        {
          path: '/myClassCircle',
          name: 'myClassCircle',
          component: resolve => require(['@/view/my/myClassCircle'], resolve)
        },
        // 我的班级圈详情
        {
          path: '/myClassCircleDet',
          name: 'myClassCircleDet',
          component: resolve => require(['@/view/my/myClassCircleDet'], resolve)
        },
        // 我的班级圈详情
        {
          path: '/starList',
          name: 'starList',
          component: resolve => require(['@/view/my/starList'], resolve)
        },
        // 我的分享
        {
          path: '/myShare',
          name: 'myShare',
          component: resolve => require(['@/view/my/myShare'], resolve)
        },
        // 我的问答
        {
          path: '/myQa',
          name: 'myQa',
          component: resolve => require(['@/view/my/myQa'], resolve)
        },
        // 消息
        {
          path: '/mess',
          name: 'mess',
          component: resolve => require(['@/view/my/message'], resolve)
        },
        //帮助中心
        {
          path: '/helpCenter',
          name: 'helpCenter',
          component: resolve => require(['@/view/my/helpCenter'], resolve)
        },
        // 帮助详情
        {
          path: '/helpDetails',
          name: 'helpDetails',
          component: resolve => require(['@/view/my/helpDetails'], resolve)
        },
        // 清除缓存
        {
          path: '/clear',
          name: 'clear',
          component: resolve => require(['@/view/clear'], resolve)
        },
        // 课件全屏
        {
          path: '/fullScreen',
          name: 'fullScreen',
          component: resolve => require(['@/view/fullScreen'], resolve)
        },

      ]
    },

  ]
})
