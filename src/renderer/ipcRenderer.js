const {ipcRenderer, remote} = require('electron')
const {dialog} = remote
const fs = require('fs')
const textArea = document.querySelector('#textArea')
document.title = '无标题'
// 文件是否保存过
let isSave = true
// 当前文件路径
let currentFile = ''

editor.on('change', function() {
  console.log(isSave);
  if(isSave) {
    isSave = false
    document.title += '*'
  }
})

document.addEventListener('contextmenu', function (e){
  e.preventDefault()
  ipcRenderer.send('contextMenu')
}, false)

ipcRenderer.on('action',async function (e, action) {
  console.log(action);
  switch(action) {
    case 'new':
      await askSaveDialog()
      isSave = true
      editor.setValue('')
      document.title = '无标题'
      currentFile = ''
      break
    case 'open':
      const a = dialog.showOpenDialogSync({
        roperties: ['openFile']
      })
      if(a) {
        fs.readFile(a[0], (err, data) => {
          if(err) {
            console.log(err);
          }
          document.title = a[0]
          currentFile = a[0]
          isSave = true
          editor.setValue(data.toString())
        })
      }
      break
    case 'save':
      await saveCurrentDoc()
      isSave = true

      break
    case 'exit':
      await askSaveDialog()
      ipcRenderer.send('exit-app')
      isSave = true

      break
  }
})

async function askSaveDialog() {
  if(!isSave) {
    const index = await dialog.showMessageBoxSync({
      type: 'question',
      message: '是否保存此文件？',
      buttons: ['Yes', 'No'],
    })
    if(index == 0) {
      saveCurrentDoc()
    }
  }
}

function saveCurrentDoc() {
  if(!currentFile) {
    const dir = dialog.showSaveDialogSync({
      defaultPath: 'aaa.txt',
      filters: [{ name: 'All Files', extensions: ['*'] }]
    })
    if(dir) {
      fs.writeFileSync(dir, editor.getValue())
      currentFile = dir
      document.title = dir
    }
  } else {
    fs.writeFileSync(currentFile, editor.getValue())
    document.title = currentFile
  }
  
}