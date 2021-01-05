const {Menu, ipcMain, shell, BrowserWindow, app} = require('electron')
const fs = require('fs')

const template = [
  {
    label: 'electron',
    submenu: [
      {
        label: '加载',
        role: 'reload'
      },
      {
        label: '退出',
        role: 'close',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('action', 'exit')
        }
      }
    ]
  },
  {
    label: '文件',
    submenu: [
      {
        label: '新建',
        accelerator: 'CmdOrCtrl + N',
        // role: 'reload'
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('action', 'new')
        }
      },
      {
        label: '打开',
        accelerator: 'CmdOrCtrl + O',
        click: () => {
          // 主进程通知渲染进程操作文件
          BrowserWindow.getFocusedWindow().webContents.send('action', 'open')
        }
      },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl + S',
        click: () => {
          // 主进程通知渲染进程操作文件
          BrowserWindow.getFocusedWindow().webContents.send('action', 'save')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '打印',
        accelerator: 'CmdOrCtrl + P',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.print()
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤消',
        role: 'undo'
      },
      {
        label: '恢复',
        role: 'redo'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
      {
        label: '删除',
        role: 'delete'
      }
    ]
  },
  {
    label: '视图',
    submenu: [
      {
        label: '缩小',
        role: 'zoomin'
      },
      {
        label: '放大',
        role: 'zoomout'
      },
      {
        label: '重置',
        role: 'resetzoom'
      },
      {
        type: 'separator'
      },
      {
        label: '全屏',
        role: 'togglefullscreen'
      }
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click() {
          shell.openExternal('http://www.baidu.com')
        }
      }
    ]
  }
]

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)

// 右键菜单
const contextMenuTemplate = [
  {
    label: '撤消',
    role: 'undo'
  },
  {
    label: '恢复',
    role: 'redo'
  },
  {
    label: '剪切',
    role: 'cut'
  },
  {
    label: '复制',
    role: 'copy'
  },
  {
    label: '粘贴',
    role: 'paste'
  },
  {
    type: 'separator'
  },
  {
    label: '全选',
    role: 'selectAll'
  }
]

const contextMenu = Menu.buildFromTemplate(contextMenuTemplate)
ipcMain.on('contextMenu', () => {
  contextMenu.popup(BrowserWindow.getFocusedWindow())
})

ipcMain.on('exit-app', () => {
  app.quit()
})