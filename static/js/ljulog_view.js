// 详见需求文档：http://wiki.lianjia.com/pages/viewpage.action?pageId=129172520

// 当页面离开时发送页面停留时长log
(function() {
  const throttle = function(fn, time) {
    let lastExec = new Date().getTime();
    let timeoutId;
    return function() {
      const that = this;
      const args = Array.prototype.slice.call(arguments, 0);

      const exec = function() {
        lastExec = new Date().getTime();
        fn.apply(that, args);
        timeoutId = null;
      };

      timeoutId && clearTimeout(timeoutId);

      const now = new Date().getTime();
      const waitTime = time - (now - lastExec);

      if (waitTime > 0) {
        timeoutId = setTimeout(() => {
          exec();
        }, waitTime);
      } else {
        exec();
      }
    };
  };

  const isView = function(el) {
    el = $(el);
    const offset = el.offset();

    const totalHeight = document.documentElement.clientHeight;
    // const totalWidth = document.documentElement.clientWidth;

    const scrollTop = document.documentElement.scrollTop;
    // const scrollLeft = document.documentElement.scrollLeft;

    const po = el.offset().top + el.height();
    if (po <= scrollTop + totalHeight && po >= scrollTop) {
      return true;
    }

    return false;
  };

  // 检测所有带曝光打点的标签
  const testView = function() {
    $('[data-view-ulog]')
      .not('.has-view').each(function() {
        if (isView($(this))) {
          $(this).addClass('has-view');
          window.OCULOG_SEND && window.OCULOG_SEND('10905', {
            action: {
              link_type: $(this).data('link-type'),
            }
          });
        }
      });
  };

  // 检测所有新版带曝光打点的标签
  const testViewNew = function() {
    $('[data-view-ulog-new]')
      .not('.has-view-new').each(function() {
        if ($(this).css('display') !== 'none') {
          if (isView($(this))) {
            $(this).addClass('has-view-new');
            const data = $(this).data('view-ulog-new');
            window.OCULOG_SEND_NEW && window.OCULOG_SEND_NEW(data.evt, data);
          }
        }
      });
  }

  // 检测所有新版埋点 点击 事件
  const testDigClick = function() {
    $('[data-ulog-click]').on('click', function() {
      const data = $(this).data('ulog-click');
      window.OCULOG_SEND_NEW && window.OCULOG_SEND_NEW(data.evt, data);
    });
  };

  // 如果throttle 另外使用第三方的请修改这段
  window.onscroll = throttle(() => {
    testView();
    testViewNew();
  }, 500);

  // 针对列表页为服务端渲染问题，由服务端refer字段与当前path比较判断是否为筛选
  // 此处增加列表页 12076：搜索筛选请求埋点
  $('body').ready(() => {
    testView();
    testViewNew();
    testDigClick();
    sendListFilterDig();
    // 新埋点
    try {
      sendPageView();
    } catch (e) {
      console.log(e);
    }
  });

  const sendListFilterDig = () => {
    const isFilteredPage = $('#isFilteredPage').data('isfilteredpage');
    if (isFilteredPage) {
      const ulogData = $('#isFilteredPage').data('ulog');
      window.OCULOG_SEND_NEW(ulogData.evt, {
        'action': ulogData.action
      });
    }
  }

  const sendPageView = function() {
    if (!!_new_dig_action_PC.pid) {
      delete window.__UDL_CONFIG.ljweb_channel_key;
      if (window.$ULOG) {
        window.$ULOG.send('1,3', $.extend({}, { event:'$pageview', event_name:'页面访问' }, _new_dig_action_PC));
      } else {
        setTimeout(() => {
          sendPageView();
        }, 1000);
      }
    }
  }

  window.OCULOG_SEND = function(id, params) {
    console.log('OCULOG_SEND===', params);
    params = params || {};
    params.ljweb_channel_key = params.ljweb_channel_key || _old_dig_action_PC.ljweb_channel_key;
    params.action = params.action || {};
    params.action.nation_id = params.action.nation_id || _old_dig_action_PC.action.nation_id;
    if (_old_dig_action_PC.ucid) params.ucid = _old_dig_action_PC.ucid || '';
    if (_old_dig_action_PC.cid) params.cid = _old_dig_action_PC.cid || '';
    try {
      console.log('sendUlog:', id,params);
      if (window.$ULOG) {
        window.$ULOG.send(id, params);
      } else {
        setTimeout(() => {
          window.OCULOG_SEND(id, params);
        }, 1000);
      }
    } catch (e) {
      console.log('window.$ULOG:', window.$ULOG);
    }
  };
  window.OCULOG_SEND_NEW = function(evt_id, params) {
    console.log('OCULOG_SEND_NEW===', params);
    params = $.extend({}, digAction[evt_id], params, {
      pid: _new_dig_action_PC.pid,
      h5pid: _new_dig_action_PC.h5pid,
      uicode: _new_dig_action_PC.uicode,
      f: document.referrer,
      cid: _new_dig_action_PC.cid,
    });
    params.action = params.action || {};

    // 所在页面的国家
    if (_new_dig_action_PC && _new_dig_action_PC.action && _new_dig_action_PC.action.page_nation) {
      params.action.page_nation = _new_dig_action_PC.action.page_nation;
    }

    // 发送新埋点，删除ljweb_channel_key
    if (window.__UDL_CONFIG && window.__UDL_CONFIG.ljweb_channel_key) {
      delete window.__UDL_CONFIG.ljweb_channel_key;
    }
    try {
      if (window.$ULOG) {
        window.$ULOG.send(evt_id, params);
      } else {
        setTimeout(() => {
          window.OCULOG_SEND_NEW(evt_id, params);
        }, 1000);
      }
    } catch(e) {
      console.log("window.$ULOG:", window.$ULOG + "e" + e);
    }
  };

  const digAction = {
    12007: {
      evt: 12007,
      event: 'mElementExpo',
      event_name: '频道入口_曝光',
      action: {
        element_title: '',
        element_index: 0
      },
    },
    12008: {
      evt: 12008,
      event: 'mElementClick',
      event_name: '频道入口_点击',
      action: {
        element_title: '',
        element_index: 0
      },
    },
    12009: {
      evt: 12009,
      event: 'mElementExpo',
      event_name: '讲座卡片_曝光',
      action: {
        element_title: '',
        element_index: 0,
        lecture_id: '',
      },
    },
    12010: {
      evt: 12010,
      event: 'mElementClick',
      event_name: '讲座卡片_点击',
      action: {
        element_title: '',
        element_index: 0,
        lecture_id: '',
      },
    },
    12011: {
      evt: 12011,
      event: 'mElementExpo',
      event_name: '广告位_曝光',
      action: {
        element_title: '',
        ad_id: '',
      },
    },
    12012: {
      evt: 12012,
      event: 'mElementClick',
      event_name: '广告位_点击',
      action: {
        element_title: '',
        ad_id: '',
      },
    },
    12013: {
      evt: 12013,
      event: 'mElementExpo',
      event_name: '顾问列表_曝光',
      action: {
        element_title: '',
        element_index: 0,
        agent_ucid: '',
      },
    },
    12014: {
      evt: 12014,
      event: 'mElementClick',
      event_name: '顾问列表_点击',
      action: {
        element_title: '',
        element_index: 0,
        agent_ucid: '',
      },
    },
    12015: {
      evt: 12015,
      event: 'mElementExpo',
      event_name: '内容分类tab_曝光',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12016: {
      evt: 12016,
      event: 'mElementClick',
      event_name: '内容分类tab_点击',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12017: {
      evt: 12017,
      event: 'mElementExpo',
      event_name: '内容列表_曝光',
      action: {
        element_title: '',
        element_index: 0,
        article_id: '',
      },
    },
    12018: {
      evt: 12018,
      event: 'mElementClick',
      event_name: '内容列表_点击',
      action: {
        element_title: '',
        element_index: 0,
        article_id: '',
      },
    },
    12019: {
      evt: 12019,
      event: 'mElementClick',
      event_name: '切换国家入口_点击',
    },
    12020: {
      evt: 12020,
      event: 'mElementClick',
      event_name: '切换国家选项_点击',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12021: {
      evt: 12021,
      event: 'mElementClick',
      event_name: '顶部搜索框_点击',
    },
    12022: {
      evt: 12022,
      event: 'mElementClick',
      event_name: '内容搜索按钮_点击',
    },
    12026: {
      evt: 12026,
      event: 'mElementExpo',
      event_name: '展位模块_曝光',
      action: {
        element_title: '',
        item_type: '',
        agent_ucid: '',
      },
    },
    12027: {
      evt: 12027,
      event: 'mElementClick',
      event_name: '电话拨号_点击',
      action: {
        element_title: '',
        item_type: '',
        agent_ucid: '',
      },
    },
    12028: {
      evt: 12028,
      event: 'mElementClick',
      event_name: '留言提交_点击',
      action: {
        element_title: '',
        agent_ucid: '',
        item_type: '',
      },
    },
    12921: {
      evt: 12921,
      event: 'mElementClick',
      event_name: '留言提交成功_曝光',
      action: {
        element_title: '',
        agent_ucid: '',
        item_type: '',
      },
    },
    12609: {
      evt: 12609,
      event: 'mElementClick',
      event_name: 'IM发送_点击',
      action: {
        element_title: '',
        agent_ucid: '',
        item_type: 'agent',
      },
    },
    12030: {
      evt: 12030,
      event: 'mElementClick',
      event_name: '地址_点击',
    },
    12031: {
      evt: 12031,
      event: 'mElementClick',
      event_name: '模块详情扩展_点击',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12032: {
      evt: 12032,
      event: 'mElementExpo',
      event_name: '搜索框sug_曝光',
      action: {
        sug_condition: '',
        item_type: '',
        sug_result: '',
      },
    },
    12034: {
      evt: 12034,
      event: 'mElementClick',
      event_name: '头像_点击',
      action: {
        item_type: '',
        agent_ucid: '',
      },
    },
    12035: {
      evt: 12035,
      event: 'mElementExpo',
      event_name: '推荐房源_曝光',
      action: {
        element_title: '',
        element_index: '',
        house_id: '',
        resblock_id: '',
      },
    },
    12038: {
      evt: 12038,
      event: 'mElementClick',
      event_name: '搜索框sug_点击',
      action: {
        sug_condition: '',
        item_type: '',
        sug_result: '',
        element_title: '',
        element_index: 0,
      },
    },
    12039: {
      evt: 12039,
      event: 'mElementClick',
      event_name: '列表页filter选项_点击',
      action: {
        filter_value: '',
        filter_type: '',
        item_type: '',
        type: '',
        field_title: '',
      },
    },
    12063: {
      evt: 12063,
      event: 'mElementClick',
      event_name: '列表页filter多选提交_点击',
      action: {
        filter_value: '',
        filter_type: '',
        item_type: '',
      },
    },
    12076: {
      evt: 12076,
      event: 'mElementClick',
      event_name: '搜索筛选请求',
      action: {
        search_condition: '',
        search_result: '',
        item_type: '',
      },
    },
    12077: {
      evt: 12077,
      event: 'mElementClick',
      event_name: '页面头图_点击',
      action: {
        pic_id: '',
      },
    },
    12078: {
      evt: 12078,
      event: 'mElementExpo',
      event_name: '房源列表_曝光',
      action: {
        element_title: '',
        element_index: 0,
        house_id: '',
        resblock_id: '',
        search_condition: '',
        filter_value: '',
        sort_type: '',
        nation: '',
      },
    },
    12079: {
      evt: 12079,
      event: 'mElementClick',
      event_name: '房源列表_点击',
      action: {
        element_title: '',
        element_index: 0,
        house_id: '',
        resblock_id: '',
        search_condition: '',
        filter_value: '',
        sort_type: '',
        nation: '',
      },
    },
    12080: {
      evt: 12080,
      event: 'mElementExpo',
      event_name: '页面头图_曝光',
      action: {
        pic_id: '',
      },
    },
    12081: {
      evt: 12081,
      event: 'mElementClick',
      event_name: '分享_点击',
      action: {
        agent_ucid: '',
        share_url: '',
        share_type: '',
        platform: '',
      },
    },
    12085: {
      evt: 12085,
      event: 'mElementExpo',
      event_name: '户型卡片_曝光',
      action: {
        element_title: '',
        element_index: 0,
        house_frame: '',
      },
    },
    12086: {
      evt: 12086,
      event: 'mElementClick',
      event_name: '户型卡片_点击',
      action: {
        element_title: '',
        element_index: 0,
        house_frame: '',
      },
    },
    12091: {
      evt: 12091,
      event: 'mElementExpo',
      event_name: '户型标签_曝光',
      action: {
        element_title: '',
        element_index: 0,
        house_frame: '',
      },
    },
    12096: {
      evt: 12096,
      event: 'mElementClick',
      event_name: '户型标签_点击',
      action: {
        element_title: '',
        element_index: 0,
        house_frame: '',
      },
    },
    12097: {
      evt: 12097,
      event: 'mElementExpo',
      event_name: '标签_曝光',
      action: {
        element_title: '',
        element_index: 0
      },
    },
    12098: {
      evt: 12098,
      event: 'mElementClick',
      event_name: '标签_点击',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12102: {
      evt: 12102,
      event: 'mElementClick',
      event_name: '推荐房源_点击',
      action: {
        nation: '',
        element_title: '',
        element_index: 0,
        house_id: '',
        resblock_id: '',
      },
    },
    12104: {
      evt: 12104,
      event: 'mElementExpo',
      event_name: '推荐文章_曝光',
      action: {
        element_index: 0,
        article_id: '',
        item_type: '',
      },
    },
    12105: {
      evt: 12105,
      event: 'mElementClick',
      event_name: '推荐文章_点击',
      action: {
        element_index: 0,
        article_id: '',
        item_type: '',
      },
    },
    12181: {
      evt: 12181,
      event: 'mElementClick',
      event_name: '返回大首页入口_点击',
    },
    12427: {
      evt: 12427,
      event: 'mElementClick',
      event_name: '商学院列表_点击',
      action: {
        element_title: '',
        element_index: 0,
        article_id: 0,
      },
    },
    12428: {
      evt: 12428,
      event: 'mElementExpo',
      event_name: '商学院列表_曝光',
      action: {
        element_title: '',
        element_index: 0,
        article_id: 0,
      },
    },
    12429: {
      evt: 12429,
      event: 'mElementClick',
      event_name: '商学院分类tab_点击',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12430: {
      evt: 12430,
      event: 'mElementExpo',
      event_name: '商学院分类tab_曝光',
      action: {
        element_title: '',
        element_index: 0,
      },
    },
    12434: {
      evt: 12434,
      event: 'mElementExpo',
      event_name: '更多他的课程_曝光',
      action: {
        agent_ucid: '',
      },
    },
    12435: {
      evt: 12435,
      event: 'mElementExpo',
      event_name: '头像_曝光',
      action: {
        agent_ucid: '',
      },
    },
    12441: {
      evt: 12441,
      event: 'mElementClick',
      event_name: '筛选_点击',
    },
    12031: {
      evt: 12031,
      event: 'mElementClick',
      event_name: '模块详情扩展_点击',
      action: {
        element_title: '',
        module_title: '',
      },
    },
    12034: {
      evt: 12034,
      event: 'mElementClick',
      event_name: '头像_点击',
      action: {
        agent_ucid: '',
        item_type: '',
      },
    },
    12020: {
      evt: 12020,
      event: 'mElementClick',
      event_name: '切换国家选项_点击',
      action: {
        element_title: '',
        element_index: '',
      },
    },
    12922: {
      evt: 12922,
      event: 'mElementExpo',
      event_name: '模块详情扩展更多全部等_曝光',
      action: {
        element_title: '',
        module_title: '',
      },
    },
    23490: {
      evt: 23490,
      event: 'ItemExpo',
      action: {
        resblock_id: '',
        nation: '',
      },
    },
    23491: {
      evt: 23491,
      event: 'WebClick',
      action: {
        resblock_id: '',
        nation: '',
      },
    },
    23492: {
      evt: 23492,
      event: 'WebClick',
      action: {
        resblock_id: '',
        nation: '',
      },
    }
  };
})();
