import * as React from 'react'
// import { Button, Input, Spin, Card } from 'antd'
import { withStore } from '@/src/components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { IpcRenderer, Shell, WebContents, BrowserWindow, Remote } from 'electron'
import Store from 'electron-store'
import { Layout, Button, Popover, Row, Col } from 'antd'
import { DownloadOutlined, ApartmentOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import './details.less'
const { Content } = Layout
const store = new Store<any>()
interface DetailsProps extends PageProps, StoreProps {
  count: StoreStates['count']
  countAlias: StoreStates['count']
}

declare interface DetailsState {
  data: any
  s4books: any
  loading: boolean
  createWindowLoading: boolean
  asyncDispatchLoading: boolean
}

declare global {
  interface Window {
    require: (
      module: 'electron'
    ) => {
      ipcRenderer: IpcRenderer
      shell: Shell
      remote: Remote
    }
  }
}

const { ipcRenderer, shell, remote } = window.require('electron')

/**
 * DemoProps 是组件的 props 类型声明
 * DemoState 是组件的 state 类型声明
 * props 和 state 的默认值需要单独声明
 */
const data = store.get('detail')
const s4books = store.get('s4books')
@withStore(['count', { countAlias: 'count' }])
export default class Details extends React.Component<DetailsProps, DetailsState> {
  // state 初始化
  state: DetailsState = {
    data: data,
    s4books: s4books,
    loading: false,
    createWindowLoading: false,
    asyncDispatchLoading: false,
  }
  // 构造函数
  constructor(props: DetailsProps) {
    super(props)
  }
  postoption: RequestOptions = {
    formData: false,
    method: 'GET',
    errorType: 'modal',
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async handleQuery() {}
  handleClose() {
    this.props.closeWindow()
  }
  image = (<img src={$tools.SIGN_UP} width="100%" alt="sign" />)
  componentDidMount() {
    console.log(this.state.s4books)
  }
  handleDownload(url: string, filename: any) {
    const win: BrowserWindow = remote.getCurrentWindow()
    win.webContents.downloadURL(url)
  }

  handlePreview(url: string, filename: any) {
    store.set('filename', filename)
    // const win: BrowserWindow = remote.getCurrentWindow()
    const web: WebContents = remote.getCurrentWebContents()
    web.downloadURL(url)
    web.session.on('will-download', (event: any, item: any, webContents: any) => {
      item.setSavePath(`${$tools.AssetsPath('preview-file')}/${filename}`)
      item.once('done', (event: any, state: any) => {
        if (state === 'completed') {
          $tools.createWindow('Preview', {
            windowOptions: { title: 'Preview', transparent: false },
          })
        } else {
          console.log(`Download failed: ${state}`)
        }
      })
    })
  }
  render() {
    // const { resData, loading, createWindowLoading, asyncDispatchLoading } = this.state
    // const { count: reduxCount, countAlias } = this.props
    if (this.state.loading) {
      return <div>loading</div>
    }
    let summarytext, summarytag
    let authortext, authortag
    let hasEpub, preview, filename

    this.state.s4books.files.forEach((element: string) => {
      if (element.includes('.epub')) {
        hasEpub = true
        filename = element
      }
    })

    if (hasEpub) {
      preview = (
        <span>
          <Button
            onClick={this.handlePreview.bind(
              this,
              `${process.env.API_PROTOCOL}${process.env.API_HOST}${process.env.API_BASE_PATH}/download/${filename}`,
              filename
            )}
            type="primary"
            danger
            icon={<EyeOutlined></EyeOutlined>}
          />
        </span>
      )
    } else {
      preview = ''
    }

    if (this.state.data.summary === '') {
      summarytext = ''
      summarytag = ''
    } else {
      summarytag = <p className="cata-tag">内容简介: </p>
      summarytext = this.state.data.summary.split('\n').map((value: string, index: number) => {
        return (
          <p className="cata-text" key={index}>
            {value}
          </p>
        )
      })
    }
    if (this.state.data.author_intro === '') {
      authortext = ''
      authortag = ''
    } else {
      authortag = <p className="cata-tag">作者简介: </p>
      authortext = this.state.data.author_intro
        .replace('作者简介：', '')
        .split('\n')
        .map((value: string, index: number) => {
          return (
            <p className="cata-text" key={index}>
              {value}{' '}
            </p>
          )
        })
    }

    const book = (
      <Row className="book-row">
        <Col flex="260px"></Col>
        <Col flex="auto" className="book-text"></Col>
      </Row>
    )
    return (
      <Layout className="book-detail-container">
        <Layout>
          <Content>
            <Row>
              <Col flex="260px">
                <img src={this.state.data.images.large} className="detail-image" alt="" />
              </Col>
              <PerfectScrollbar>
                <Col flex="auto" className="book-right-area">
                  <div className="book-right-container">
                    <div>
                      <p className="book-text cata-tag">书名:{this.state.data.title}</p>
                    </div>
                    <div>
                      <p className="book-text cata-tag">
                        作者:
                        {this.state.data.author.map((value: string, index: number) => {
                          return <span key={index}>{value}</span>
                        })}
                      </p>

                      {/* {this.state.data.results[0].book_author} */}
                    </div>
                    <div>
                      <span className="book-icon" title="Download">
                        <Popover
                          placement="left"
                          content={this.state.s4books.files.map((value: string, index: number) => {
                            return (
                              <p key={index}>
                                <a
                                  onClick={this.handleDownload.bind(
                                    this,
                                    `${process.env.API_PROTOCOL}${process.env.API_HOST}${process.env.API_BASE_PATH}/download/${value}`,
                                    value
                                  )}
                                >
                                  {value.split('.')[1]}
                                </a>
                              </p>
                            )
                          })}
                        >
                          <Button type="primary" icon={<DownloadOutlined />} />
                        </Popover>
                      </span>
                      <span className="book-icon" title="Subscribe">
                        <Button type="primary" icon={<ApartmentOutlined />} />
                      </span>
                      <span
                        className="book-icon"
                        title="Close the window"
                        onClick={this.handleClose.bind(this)}
                      >
                        <Button type="primary" danger icon={<CloseOutlined />} />
                      </span>
                      {preview}
                    </div>
                    <div>
                      {summarytag}
                      {summarytext}
                    </div>
                    <div>
                      {authortag}
                      {authortext}
                    </div>
                  </div>
                </Col>
              </PerfectScrollbar>
            </Row>
          </Content>
        </Layout>
      </Layout>
    )
  }
} // class Demo end
