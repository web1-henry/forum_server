import { Context } from 'koa'
import { v4 } from 'uuid'
import path = require('path')
import { checkFile, success, error } from '../lib'
import { ErrorDatas, FileDatas } from '../type'
import { uploadError } from '../constant/errType'

const fs = require('fs')

export async function upload(ctx: Context) {
  try {
    let files = ctx.request.files?.file as any
    // let formatFiles = []
    let fileDatas = [] as FileDatas[]
    let ErrorDatas = [] as ErrorDatas[]

    if (files.length === undefined) {
      files = [files]
    }
    // for (let i = 0; i < files.length; i++) {
    //   let file = files[i]
    //   if (await checkFile(file.type)) {
    //     formatFiles.push(file)
    //   } else {
    //     ErrorDatas.push({
    //       fileName: file.name as string,
    //       message: '格式不正确',
    //     })
    //   }
    // }
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = v4()

      let ext = file.name.split('.')
      let fileName = ext[0] + fileId + '.' + ext[1]
      let fileReader = fs.createReadStream(file.path)
      fileDatas.push({ fileName, fileId })
      const dir = path.join(__dirname, '../uploads')
      const fileResorse = dir + `/${fileName}`
      const writeStream = fs.createWriteStream(fileResorse)
      fileReader.pipe(writeStream)
    }
    ctx.body = success({ fileDatas, ErrorDatas })
    return { fileDatas, ErrorDatas }
  } catch (err) {
    ctx.body = error(uploadError)
    console.log(err, ctx)

    return err
  }
}
