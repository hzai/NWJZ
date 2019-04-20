/*
 * @Author: Roy Chen
 * @Date: 2017-12-21 11:06:00
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-21 00:01:28
 */
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import qiniu from 'qiniu';
import gm from 'gm';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');

qiniu.conf.ACCESS_KEY = config.qiniu.access_key;
qiniu.conf.SECRET_KEY = config.qiniu.secret_key;

async function uploadImg(req, res, next) {
    const type = req.params.type;
    try {
        //const image_path = await this.qiniu(req, type);
        // const image_path = await getPath(req);
        const form = formidable.IncomingForm();
        form.uploadDir = './public/img';
        form.parse(req, async (err, fields, files) => {
            const imgName = Utils.genUuid();
            const fullName = imgName + path.extname(files.file.name);
            const repath = './public/img/' + fullName;
            fs.renameSync(files.file.path, repath);
            res.send({
                status: 0,
                image_path: fullName,
                type: '上传图片成功'
            });
        });
    } catch (err) {
        console.log('上传图片失败', err);
        res.send({
            status: 1,
            type: 'ERROR_UPLOAD_IMG',
            message: '上传图片失败'
        });
    }
}

async function uploadImgByQiniu(req, res, next) {
    const type = req.params.type;
    try {
        const image_path = await Qiniu(req, type);
        res.send({
            status: 0,
            image_path,
            type: '上传图片成功'
        });
    } catch (err) {
        console.log('上传图片失败', err);
        res.send({
            status: 1,
            type: 'ERROR_UPLOAD_IMG',
            message: '上传图片失败'
        });
    }
}

async function getPath(req) {
    return new Promise((resolve, reject) => {
        const form = formidable.IncomingForm();
        form.uploadDir = './public/img';
        form.parse(req, async (err, fields, files) => {
            const imgName = Utils.genUuid();
            const fullName = imgName + path.extname(files.file.name);
            const repath = './public/img/' + fullName;
            try {
                await fs.rename(files.file.path, repath);
                console.log(repath);
                gm(repath)
                    // .resize(200, 200, "!")
                    .write(repath, async err => {
                        if (err) {
                            console.log(err);
                            console.log('裁切图片失败');
                            reject('裁切图片失败');
                            return;
                        }
                        resolve(fullName);
                    });
            } catch (err) {
                console.log('保存图片失败', err);
                fs.unlink(files.file.path);
                reject('保存图片失败');
            }
        });
    });
}

async function Qiniu(req, type = 'default') {
    return new Promise((resolve, reject) => {
        const form = formidable.IncomingForm();
        form.uploadDir = './public/img';
        form.parse(req, async (err, fields, files) => {
            // let img_id = '123';
            // try {
            //     img_id = await this.getId('img_id');
            // } catch (err) {
            //     console.log('获取图片id失败');
            //     fs.unlink(files.file.path);
            //     reject('获取图片id失败')
            // }
            const imgName = Utils.genUuid();
            // const imgName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
            const extname = path.extname(files.file.name);
            const repath = './public/img/' + imgName + extname;
            try {
                const key = imgName + extname;
                await fs.rename(files.file.path, repath);
                const token = uptoken(config.qiniu.bucket, key);
                const qiniuImg = await uploadFile(
                    token.toString(),
                    key,
                    repath
                );
                fs.unlink(repath);
                resolve(qiniuImg);
            } catch (err) {
                console.log('保存至七牛失败', err);
                fs.unlink(files.file.path);
                reject('保存至七牛失败');
            }
        });
    });
}

function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key);
    return putPolicy.token();
}

function uploadFile(uptoken, key, localFile) {
    return new Promise((resolve, reject) => {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if (!err) {
                resolve(ret.key);
            } else {
                console.log('图片上传至七牛失败', err);
                reject(err);
            }
        });
    });
}

export default {
    uploadImg,
    uploadImgByQiniu
};
