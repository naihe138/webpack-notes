

// webpack-serve
let xhr = new XMLHttpRequest()
xhr.open('GET', '/test', true)

xhr.onload = () => {
  console.log(xhr.response)
}

xhr.send()