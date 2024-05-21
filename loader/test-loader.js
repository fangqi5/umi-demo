const { urlToRequest } = require('loader-utils');
const { validate } = require('schema-utils');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

let i = 0,
  folderName = './loader-output',
  timer = dayjs(Date.now()).format('YYYYMMDDHHmmss');
module.exports = function (source) {
  async function createFile(filePath, content) {
    try {
      const res = await fs.writeFileSync(
        path.resolve(__dirname, filePath),
        content,
      );
      return res;
    } catch (err) {
      console.log('createFile error=====>', err);
      return err;
    }
  }
  async function createFolder(folderPath) {
    try {
      const res = await fs.mkdirSync(folderPath);
      return res;
    } catch (err) {
      return err;
    }
  }

  if (!i) {
    console.log('this.query=====>', this.query);
    createFile(`${folderName}/file-${timer}.js`, source).then(
      async (result) => {
        if (result) {
          if (result.code === 'ENOENT') {
            await createFolder(`${folderName}`);
            await createFile(`${folderName}/file-${timer}.js`, source);
          }
        }
      },
    );
    i++;
  }
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
