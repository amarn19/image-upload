import React, {PropTypes} from 'react';
import {Row, Upload, Icon, Alert, Button, Progress} from 'antd';
import CSSModules from 'react-css-modules';
import styles from './style/UploadImage.scss';
import config from './config';
const Dragger = Upload.Dragger;

@CSSModules(styles)
export default class UploadImage extends React.Component {

  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.finishSuccessEdit = this.finishSuccessEdit.bind(this);
    this.state = {
      fileList: []
    };
  }

  static propTypes = {
    finishEdit: PropTypes.func,
    onChange: PropTypes.func,
    multiple: PropTypes.bool
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.fileList.length > 0 && nextState.fileList === 0) {
      return false;
    }

    return true;
  }

  finishSuccessEdit() {
    const {onChange} = this.props;
    const urls = this.state.fileList.map(file => file.url);

    onChange(urls);
  }

  uploadFile(info) {
    let fileList = info.fileList;
    // see issue: https://github.com/ant-design/ant-design/issues/2423#issuecomment-233523579
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-3);

    // 2. read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.link;
      }
      return file;
    });

    this.setState({
      fileList
    });
  }

  render() {
    const {multiple, finishEdit} = this.props;
    const {fileList} = this.state;
    const imgConfig = config.imgurEndPoint();
    let content;
    let finish;
    let disabled = false;
    const props = {
      multiple,
      // name is **need** to be image according to imgur api
      // https://api.imgur.com/endpoints/image
      name: 'image',
      accept: 'image/*',
      headers: imgConfig.header,
      action: imgConfig.url,
      onChange: this.uploadFile
    };

    if (fileList && fileList.length) {
      content = fileList.map(file => {
        const percent = file.percent;
        let info;
        disabled = true;

        if (file.status === 'error') {
          info = (
            <div key={file.name}>
              <Alert
                message="抱歉，上傳照片出了點問題。我們正在儘速為您修復!"
                type="error"
                showIcon
              />
              <Button type="primary" onClick={finishEdit}>
                知道了
              </Button>
            </div>
          );
        } else if (file.status === 'uploading') {
          info = (
            <div key={file.name}>
              <Alert
                message={`正在上傳 ${file.name}`}
                type="info"
                showIcon
              />
              <Progress percent={Math.round(percent)}/>
            </div>
          );
        } else if (file.status === 'done') {
          info = (
            <div key={file.name}>
              <Alert
                message={`成功上傳 ${file.name}`}
                type="success"
                showIcon
              />
            </div>
          );
        }

        return info;
      });

      if (fileList.every(file => file.status === 'done')) {
        finish = (
          <Button type="primary" onClick={this.finishSuccessEdit}>
            完成！
          </Button>
        );
      }
    } else {
      content = (
        <div>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>

          <p className="ant-upload-text">點此或是把檔案拖移到這邊</p>
          <p className="ant-upload-hint">就可以上傳您的檔案</p>
        </div>
      );
    }

    return (
      <Row>
        <div styleName="file-upload">
          <Dragger {...props}
            fileList={fileList}
            disabled={disabled}>
            <div styleName="file-upload__content">
              {content}
              {finish}
            </div>
          </Dragger>
        </div>
      </Row>
    );
  }
}
