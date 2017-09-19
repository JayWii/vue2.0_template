<template>
  <span v-html="content"></span>
</template>
<script>
export default {
  props: {
    times: {
      type: Number, // 倒计时时间差
      default: 0
    },
    tpl: {
      type: String,
      default: '<em>{{d}}</em>天<em>{{h}}</em>小时<em>{{m}}</em>分<em>{{s}}</em>秒'
    },
    end: Function, // 倒计时完成时执行的回调
    callback: Function, // 每减少一秒执行的回调
    double: {
      type: Boolean,
      default: true
    },
    time: {
      type: Number,
      default: 1000
    },
    justify: {
      type: Boolean,
      default: true // 是否在天或时为0是隐藏天或时，默认是这样
    },
    hideDay: {
      type: Boolean,
      default: false // 只隐藏天
    }
  },
  data () {
    return {
      content: '',
      sEndTime: 0,
      n: 0,
      newTpl: '',
      timer: null,
      dtimes: 0
    }
  },
  created () {
    this.newTpl = this.tpl
    this.createCountdown()
  },
  methods: {
    createCountdown () {
      let seconds = this.times
      let tpl = this.newTpl
      let stime = parseFloat(seconds) * 1000 // 倒计时时间差-毫秒
      let sEndTime = stime + new Date().getTime() // 倒计时结束时间-毫秒
      this.sEndTime = sEndTime
      // 初始化显示
      this.content = tpl.replace(/\{\{d\}\}/, '00').replace(/\{\{h\}\}/, '00').replace(/\{\{m\}\}/, '00').replace(/\{\{s\}\}/, '00')
      this.rush()
    },
    rush () {
      let self = this
      let total = 0
      let secFlag = false
      let tpl = this.newTpl
      let now = new Date().getTime()
      if (self.sEndTime > now) {
        total = self.sEndTime - now
      }
      let totalSecond = total -= self.time
      if (self.time < 1000) {
        // 刷新时间小于一秒，判断是否执行每秒回调
        if (((self.n++) * self.time) % 1000 === 0) {
          secFlag = true
        }
      }
      totalSecond /= 1000
      if (totalSecond <= 0) {
        // 已无剩余时间，执行每秒回调，并且时间归零
        if (self.callback && typeof self.callback === 'function') {
          let time = { total: Math.floor(self.times) }
          if (secFlag) {
            self.callback(time)
          } else if (!secFlag && self.time >= 1000) {
            self.callback(time)
          }
        }
        totalSecond = 0
        self.content = (tpl.replace(/\{\{d\}\}/, '00').replace(/\{\{h\}\}/, '00').replace(/\{\{m\}\}/, '00').replace(/\{\{s\}\}/, '00'))
        if (self.end && typeof self.end === 'function') {
          // 执行倒计时结束回调
          self.end()
        }
        return false
      }
      // 计算时间
      let tplParten = /(\{\{[dhms]\}\})+/gi
      let tplRes = this.tpl.match(tplParten)
      let D = 0
      let H = 0
      let M = 0
      let S = 0
      if (tplRes && tplRes.length > 0 && tplRes.length < 4) {
        if (tplRes.indexOf('{{d}}') !== -1) {
          D = totalSecond / (24 * 3600)
          H = (totalSecond / 3600) % 24
          M = (totalSecond / 60) % 60
          S = (total % 60000 * 0.001).toFixed(1)
        } else if (tplRes.indexOf('{{h}}') !== -1) {
          H = totalSecond / 3600
          M = (totalSecond / 60) % 60
          S = (total % 60000 * 0.001).toFixed(1)
        } else if (tplRes.indexOf('{{m}}') !== -1) {
          M = totalSecond / 60
          S = (total % 60000 * 0.001).toFixed(1)
        } else if (tplRes.indexOf('{{s}}') !== -1) {
          S = totalSecond.toFixed(1)
        }
      } else {
        D = totalSecond / (24 * 3600)
        H = (totalSecond / 3600) % 24
        M = (totalSecond / 60) % 60
        S = (total % 60000 * 0.001).toFixed(1)
      }
      D = Math.floor(D)
      H = Math.floor(H)
      M = Math.floor(M)
      if (self.time === 1000) {
        S = Math.floor(S)
      }
      if (self.double) {
        D = self.fitTime(D)
        H = self.fitTime(H)
        M = self.fitTime(M)
        S = self.fitTime(S)
      } else {
        S = self.fitTime(S)
      }
      // 回调
      if (self.callback && typeof self.callback === 'function') {
        var time = { total: Math.floor(totalSecond) }
        if (secFlag) {
          self.callback(time)
        } else if (!secFlag && self.time >= 1000) {
          self.callback(time)
        }
      }
      if (self.hideDay) {
        // 只隐藏天
        if (D <= 0) {
          if (secFlag) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{d\}\}.*?<\/\w+>[^<]?)?/, '')
          } else if (!secFlag && self.time >= 1000) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{d\}\}.*?<\/\w+>[^<]?)?/, '')
          }
        }
      } else if (self.justify) {
        // 天和时为0时，隐藏
        if (D <= 0) {
          if (secFlag) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{d\}\}.*?<\/\w+>[^<]?)?/, '')
          } else if (!secFlag && self.time >= 1000) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{d\}\}.*?<\/\w+>[^<]?)?/, '')
          }
        }
        if (D <= 0 && H <= 0) {
          if (secFlag) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{h\}\}.*?<\/\w+>[^<]?)?/, '')
          } else if (!secFlag && self.time >= 1000) {
            tpl = tpl.replace(/(<\w+.*?>.*?\{\{h\}\}.*?<\/\w+>[^<]?)?/, '')
          }
        }
      }
      self.newTpl = tpl
      self.content = tpl.replace(/\{\{d\}\}/, D).replace(/\{\{h\}\}/, H).replace(/\{\{m\}\}/, M).replace(/\{\{s\}\}/, S)
      self.timer = setTimeout(self.rush, self.time)
    },
    fitTime (t) {
      return t < 10 ? '0' + t : t
    },
    changeTimes () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.createCountdown()
    }
  },
  watch: {
    times: 'changeTimes'
  }
}
</script>
