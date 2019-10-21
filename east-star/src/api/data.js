import fetch from '@/api/fetch'
import Ls from '@/config/storage'
import router from '@/router'

// 获取app传过来的参数存到本地
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  // 判断本地是否有auth，没有则取url中的auth存到本地
  if (!Ls.getItem("auth")) {
    Ls.setItem("userId", to.query.userId || '122481');
    Ls.setItem("auth", to.query.auth || 'e84dfa1d016b698df3c754c40a9202be');
    next();
  } else {
    // 判断本地auth是否过期，过期重置
    if (to.query.auth && to.query.auth != Ls.getItem("auth")) {
      Ls.setItem("userId", to.query.userId || '122481');
      Ls.setItem("auth", to.query.auth || 'e84dfa1d016b698df3c754c40a9202be');
    }
    next();
  }
})

/**
 * 获取教研资讯列表
 * @param {serviceTypeId} 教研主题ID  1.园所特色活动 2.家园共育 3.教研风采
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 */
export function getServiceNewList({
  serviceTypeId,
  pageNo,
  pageSize
} = {}) {
  return fetch({
    url: '/researchApi/research/getServiceNewList',
    params: {
      serviceTypeId,
      pageNo,
      pageSize
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}

/**
 * 获取分享交流列表
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 * @param {type} 区分分享交流和我的分享交流标识  1：分享交流  2：我的分享交流  
 */
export function getShareList({
  pageNo,
  pageSize,
  type
} = {}) {
  return fetch({
    url: '/researchApi/share/getShareList',
    params: {
      pageNo,
      pageSize,
      type
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}

/**
 * 获取分享交流详情
 * @param {shareId} 分享交流ID  
 */
export function getShareDetail({
  shareId
} = {}) {
  return fetch({
    url: '/researchApi/share/getShareDetail',
    params: {
      shareId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}

/**
 * 获取教研问答列表
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 * @param {type} 区分教研问答和我的问答状态标识  1:教研问答  2：我的问答
 */
export function getQuestionList({
  pageNo,
  pageSize,
  type
} = {}) {
  return fetch({
    url: '/researchApi/question/getQuestionList',
    params: {
      pageNo,
      pageSize,
      type
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}

/**
 * 获取教研问答详情
 * @param {shareId} 分享交流ID  
 */
export function getQuestionDetail({
  questionId
} = {}) {
  return fetch({
    url: '/researchApi/question/getQuestionDetail',
    params: {
      questionId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}

/**
 * 获取教研资讯详情
 * @param {serviceNewId} 教研资讯ID
 */
export function getServiceNewDetail({
  serviceNewId
} = {}) {
  return fetch({
    url: '/researchApi/research/getServiceNewDetail',
    params: {
      serviceNewId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取Banner列表
 * @param {type} banner展示位置 1课程 2教研资讯
 */
export function getBannerList({
  type = 2
} = {}) {
  return fetch({
    url: '/courseApi/course/getBannerList',
    params: {
      type
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 给分享点赞/取消赞
 * @param {shareId} 分享交流ID
 * @param {starState} 点赞状态（1点赞  -1取消点赞）
 * @param {shareType} 分享类型（3.分享交流  5班级圈分享）
 */
export function setStar({
  shareId,
  starState,
  shareType
} = {}) {
  return fetch({
    url: '/researchApi/share/setStar',
    params: {
      shareId,
      starState,
      shareType
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 删除我的分享交流
 * @param {shareId} 分享交流ID
 */
export function setDelShare({
  shareId
} = {}) {
  return fetch({
    url: '/researchApi/share/setDelShare',
    params: {
      shareId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 删除我的分问答
 * @param {questionId} 教研问答ID
 */
export function setDelQuestion({
  questionId
} = {}) {
  return fetch({
    url: '/researchApi/question/setDelQuestion',
    params: {
      questionId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取我的班级圈分享交流/班级圈分享交流列表
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 * @param {type} 区分班级圈和我的班级圈状态标识  1:班级圈  2：我的班级圈
 * @param {classId} 当为班级圈列表查询，使用该参数
 */
export function getClassRingList({
  pageNo,
  pageSize,
  type,
  classId
} = {}) {
  return fetch({
    url: '/researchApi/classring/getClassRingList',
    params: {
      pageNo,
      pageSize,
      type,
      classId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取我的班级圈/班级圈分享交流详情
 * @param {classRingId} --班级圈分享ID
 */
export function getClassRingDetail({
  classRingId
} = {}) {
  return fetch({
    url: '/researchApi/classring/getClassRingDetail',
    params: {
      classRingId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 删除我的班级圈分享交流、
 * @param {classRingId} --班级圈分享ID
 */
export function setDelClassRingShare({
  classRingId
} = {}) {
  return fetch({
    url: '/researchApi/classring/setDelClassRingShare',
    params: {
      classRingId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 帮助中心
 * @param {keyWord} 查询内容，没有搜索传空字符串，有搜索传搜索内容  
 */
export function getHelpCenter({
  keyWord
} = {}) {
  return fetch({
    url: '/userApi/user/getHelpCenter',
    params: {
      keyWord
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 帮助中心details
 * @param {questionId} 客服公告Id
 */
export function getHelpCenterInfo({
  questionId
} = {}) {
  return fetch({
    url: '/userApi/user/getHelpCenterInfo',
    params: {
      questionId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取课程内容详情(今日所学/拓展练习)
 * @param {activityid} 活动id
 * @param {studentId} 学生id（获取拓展练习必传）
 * @param {classId} 班级id
 */
export function getStudyDetail({
  activityid,
  studentId,
  classId
} = {}) {
  return fetch({
    url: '/classesApi/studyHomework/getStudyDetail',
    params: {
      activityid,
      studentId,
      classId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取我的班级圈的点赞列表
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 * @param {classRingId} 我的班级圈分享ID
 */
export function getStarList({
  pageNo,
  pageSize,
  classRingId,
  shareType
} = {}) {
  return fetch({
    url: '/researchApi/classring/getStarList',
    params: {
      pageNo,
      pageSize,
      classRingId,
      shareType
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取课程资源分类
 * @param {courseId} 课程Id  
 */
export function getCourseResourceClassics({
  courseId
} = {}) {
  return fetch({
    url: '/courseApi/course/getCourseResourceClassics',
    params: {
      courseId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 获取课程活动资源
 * @param {courseId} 课程Id  
 * @param {activityId} 课程活动Id,  
 * @param {unitId} 单元Id 如果没有的单元传0,  
 * @param {resourceClassicsId} 课程活动分类Id  
 */
export function getCourseResource({
  courseId,
  activityId,
  unitId
} = {}) {
  return fetch({
    url: '/courseApi/course/getCourseResource',
    params: {
      courseId,
      activityId,
      unitId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 发布评论
 * @param {baseId} 前言分享ID  
 * @param {touseId} 被评论人ID
 * @param {parentId} 评论内容的ID 0直接评论前言分享  其他值评论别人的评论  
 * @param {comment} 评论内容  
 * @param {typeId} 内容类别 1分享交流  2教研问答  3前言分享  4记录  5班级动态  
 */
export function setPostComment({
  baseId,
  touseId,
  parentId,
  comment,
  typeId
} = {}) {
  return fetch({
    url: '/researchApi/comment/setPostComment',
    params: {
      baseId,
      touseId,
      parentId,
      comment,
      typeId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 删除评论信息
 * @param {commentId} 评论ID  
 */
export function setDelComment({
  commentId
} = {}) {
  return fetch({
    url: '/researchApi/comment/setDelComment',
    params: {
      commentId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 添加浏览量
 * @param {serviceNewId} 教研主题ID  
 */
export function setView({
  serviceNewId
} = {}) {
  return fetch({
    url: '/researchApi/research/setView',
    params: {
      serviceNewId
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 动态获取教研资讯栏目组
 * @param {pageNo} 页数  
 * @param {pageSize} 条数  
 */
export function getColumnGroup({
  pageNo,
  pageSize
} = {}) {
  return fetch({
    url: '/researchApi/research/getColumnGroup',
    params: {
      pageNo,
      pageSize
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
/**
 * 用户详细信息
 * @param {userId}
 */
export function getCourseUserInfo({
  userId = Ls.getItem("userId"),
} = {}) {
  return fetch({
    url: '/userApi/user/getCourseUserInfo',
    params: {
      userId,
    },
    userId: Ls.getItem('userId'),
    auth: Ls.getItem('auth')
  })
}
