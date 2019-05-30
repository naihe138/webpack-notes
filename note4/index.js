
<<<<<<< HEAD

// webpack-serve
let xhr = new XMLHttpRequest()
xhr.open('GET', '/test', true)

xhr.onload = () => {
  console.log(xhr.response)
}

xhr.send()
=======
// import jquery from 'jquery'

// import moment from 'moment'

// // 因为webpack忽略了，所以要手动引入中文包
// // 设置语言
// import 'moment/locale/zh-cn'

// moment.locale('zh-cn')

// let r = moment().endOf('day').fromNow()

import React from 'react'
import { render } from 'react-dom'

render(<h1>jsx</h1>, document.querySelector('#root'))
>>>>>>> 08e3daef4654e6fd50a529a84b6f7fc0b052b26a
