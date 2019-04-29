export default {
    workerStatus: [
        { value: 0, label: '待岗', color: '' },
        { value: 1, label: '上户中', color: 'success' },
        { value: 2, label: '培训中', color: 'warning' },
        { value: 3, label: '休假', color: 'warning' },
        { value: 4, label: '离职', color: 'info' },
        { value: 5, label: '转行', color: 'info' },
        { value: 6, label: '黑名单', color: 'danger' }
    ],
    employerStatus: [
        { value: 0, label: '待跟进', color: '' },
        { value: 1, label: '跟进中', color: 'warning' },
        { value: 2, label: '已面试', color: 'warning' },
        { value: 3, label: '已签约', color: 'success' },
        { value: 4, label: '已失效', color: 'info' }
    ],
    zodiac: [
        { value: '猴', label: '猴' },
        { value: '鸡', label: '鸡' },
        { value: '狗', label: '狗' },
        { value: '猪', label: '猪' },
        { value: '鼠', label: '鼠' },
        { value: '牛', label: '牛' },
        { value: '虎', label: '虎' },
        { value: '兔', label: '兔' },
        { value: '龙', label: '龙' },
        { value: '蛇', label: '蛇' },
        { value: '马', label: '马' },
        { value: '羊', label: '羊' }
    ],
    astro: [
        { value: '魔羯', label: '魔羯座' },
        { value: '水瓶', label: '水瓶座' },
        { value: '双鱼', label: '双鱼座' },
        { value: '牡羊', label: '牡羊座' },
        { value: '金牛', label: '金牛座' },
        { value: '双子', label: '双子座' },
        { value: '巨蟹', label: '巨蟹座' },
        { value: '狮子', label: '狮子座' },
        { value: '处女', label: '处女座' },
        { value: '天秤', label: '天秤座' },
        { value: '天蝎', label: '天蝎座' },
        { value: '射手', label: '射手座' }
    ],
    nation: [
        { value: '汉族', label: '汉族' },
        { value: '蒙古族', label: '蒙古族' },
        { value: '回族', label: '回族' },
        { value: '藏族', label: '藏族' },
        { value: '维吾尔族', label: '维吾尔族' },
        { value: '苗族', label: '苗族' },
        { value: '彝族', label: '彝族' },
        { value: '壮族', label: '壮族' },
        { value: '布依族', label: '布依族' },
        { value: '朝鲜族', label: '朝鲜族' },
        { value: '满族', label: '满族' },
        { value: '侗族', label: '侗族' },
        { value: '瑶族', label: '瑶族' },
        { value: '白族', label: '白族' },
        { value: '土家族', label: '土家族' },
        { value: '哈尼族', label: '哈尼族' },
        { value: '哈萨克族', label: '哈萨克族' },
        { value: '傣族', label: '傣族' },
        { value: '黎族', label: '黎族' },
        { value: '傈僳族', label: '傈僳族' },
        { value: '佤族', label: '佤族' },
        { value: '畲族', label: '畲族' },
        { value: '高山族', label: '高山族' },
        { value: '拉祜族', label: '拉祜族' },
        { value: '水族', label: '水族' },
        { value: '东乡族', label: '东乡族' },
        { value: '纳西族', label: '纳西族' },
        { value: '景颇族', label: '景颇族' },
        { value: '柯尔克孜族', label: '柯尔克孜族' },
        { value: '土族', label: '土族' },
        { value: '达翰尔族', label: '达翰尔族' },
        { value: '么佬族', label: '么佬族' },
        { value: '羌族', label: '羌族' },
        { value: '布朗族', label: '布朗族' },
        { value: '撒拉族', label: '撒拉族' },
        { value: '毛南族', label: '毛南族' },
        { value: '仡佬族', label: '仡佬族' },
        { value: '锡伯族', label: '锡伯族' },
        { value: '阿昌族', label: '阿昌族' },
        { value: '普米族', label: '普米族' },
        { value: '塔吉克族', label: '塔吉克族' },
        { value: '怒族', label: '怒族' },
        { value: '乌孜别克族', label: '乌孜别克族' },
        { value: '俄罗斯族', label: '俄罗斯族' },
        { value: '鄂温克族', label: '鄂温克族' },
        { value: '德昂族', label: '德昂族' },
        { value: '保安族', label: '保安族' },
        { value: '裕固族', label: '裕固族' },
        { value: '京族', label: '京族' },
        { value: '塔塔尔族', label: '塔塔尔族' },
        { value: '独龙族', label: '独龙族' },
        { value: '鄂伦春族', label: '鄂伦春族' },
        { value: '赫哲族', label: '赫哲族' },
        { value: '门巴族', label: '门巴族' },
        { value: '珞巴族', label: '珞巴族' },
        { value: '基诺族', label: '基诺族' }
    ],
    academic: [
        { value: '小学', label: '小学' },
        { value: '初中', label: '初中' },
        { value: '高中', label: '高中' },
        { value: '中专', label: '中专' },
        { value: '大专', label: '大专' },
        { value: '本科', label: '本科' }
    ],
    marriaged: [
        { value: '未婚', label: '未婚' },
        { value: '已婚', label: '已婚' },
        { value: '离异', label: '离异' },
        { value: '丧偶', label: '丧偶' }
    ],
    mandarin_level: [
        { value: '标准', label: '标准' },
        { value: '一般', label: '一般' },
        { value: '乡音', label: '乡音' }
    ],
    languages: [
        { value: '普通话', label: '普通话' },
        { value: '广东话', label: '广东话' },
        { value: '潮汕话', label: '潮汕话' },
        { value: '客家话', label: '客家话' },
        { value: '四川话', label: '四川话' },
        { value: '闽南话', label: '闽南话' },
        { value: '上海话', label: '上海话' },
        { value: '英语', label: '英语' },
        { value: '其他语言', label: '其他语言' }
    ],
    zuofannengli: [
        { value: '不会', label: '不会' },
        { value: '一般', label: '一般' },
        { value: '很好', label: '很好' }
    ],
    caixi: [
        { value: '家常菜', label: '家常菜' },
        { value: '面食', label: '面食' },
        { value: '中餐', label: '中餐' },
        { value: '西餐', label: '西餐' },
        { value: '海鲜', label: '海鲜' },
        { value: '煲汤', label: '煲汤' },
        { value: '辅食', label: '辅食' }
    ],
    credentials: [
        { value: '月嫂证', label: '月嫂证' },
        { value: '育婴师证', label: '育婴师证' },
        { value: '催乳师证', label: '催乳师证' },
        { value: '家政服务员证', label: '家政服务员证' },
        { value: '护理上岗证', label: '护理上岗证' },
        { value: '母婴护理证', label: '母婴护理证' },
        { value: '营养师证', label: '营养师证' },
        { value: '厨师证', label: '厨师证' },
        { value: '驾驶证', label: '驾驶证' }
    ],
    job: [
        { value: '保洁', label: '保洁' },
        { value: '月嫂', label: '月嫂' },
        { value: '育婴师', label: '育婴师' },
        { value: '长期钟点工', label: '长期钟点工' },
        { value: '住家保姆', label: '住家保姆' },
        { value: '不住家保姆', label: '不住家保姆' },
        { value: '老人陪护', label: '老人陪护' },
        { value: '病人陪护', label: '病人陪护' }
    ],
    workingAge: [
        { value: '1年', label: '1年' },
        { value: '2年', label: '2年' },
        { value: '3年', label: '3年' },
        { value: '4年', label: '4年' },
        { value: '5年', label: '5年' },
        { value: '6年', label: '6年' },
        { value: '7年', label: '7年' },
        { value: '8年', label: '8年' },
        { value: '9年', label: '9年' },
        { value: '10年以上', label: '10年以上' }
    ],
    worktime: [
        { value: '住家', label: '住家' },
        { value: '走家', label: '走家' },
        { value: '全天白班', label: '全天白班' },
        { value: '上午白班', label: '上午白班' },
        { value: '下午白班', label: '下午白班' },
        { value: '均可', label: '均可' }
    ],
    txType: [
        { value: '收入', label: '收入' },
        { value: '支出', label: '支出' }
    ],
    requirements: [
        { value: '月嫂', label: '月嫂' },
        { value: '保姆', label: '保姆' },
        { value: '育婴师', label: '育婴师' },
        { value: '钟点工', label: '钟点工' },
        { value: '家电保洁', label: '家电保洁' },
        { value: '老年护理', label: '老年护理' },
        { value: '病人护理', label: '病人护理' },
        { value: '管家', label: '管家' },
        { value: '维修', label: '维修' }
    ],
    serviceTime: [
        { value: '住家', label: '住家' },
        { value: '走家', label: '走家' },
        { value: '上午中餐', label: '上午中餐' },
        { value: '下午晚餐', label: '下午晚餐' },
        { value: '全天白班', label: '全天白班' },
        { value: '晚班', label: '晚班' }
    ]
};
