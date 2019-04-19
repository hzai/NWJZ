'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const fs = require('fs')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const stat = fs.stat

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
        console.log(chalk.yellow('Start to copy files to distant (cordova-app) folder'))
        // 复制目录和文件
        rm(path.join(config.build.assetsRoot, config.build.distIosPath, config.build.assetsSubDirectory), err1 => {
            if (err1) throw err1
            exists(path.join(config.build.assetsRoot), path.join(config.build.assetsRoot, config.build.distIosPath), copy)
        })
        rm(path.join(config.build.assetsRoot, config.build.distAndroidPath, config.build.assetsSubDirectory), err2 => {
            if (err2) throw err2
            exists(path.join(config.build.assetsRoot), path.join(config.build.assetsRoot, config.build.distAndroidPath), copy)
        })
        console.log(chalk.yellow('Done copy files to distant (cordova-app) folder'))
    })
})

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
function copy(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err
        }
        paths.forEach(function(path) {
            const _src = src + '/' + path
            const _dst = dst + '/' + path
            let readable = null
            let writable = null
            stat(_src, function(err, st) {
                if (err) {
                    throw err
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src)
                        // 创建写入流
                    writable = fs.createWriteStream(_dst)
                        // 通过管道来传输流
                    readable.pipe(writable)
                } else if (st.isDirectory()) { // 如果是目录则递归调用自身
                    exists(_src, _dst, copy)
                }
            })
        })
    })
}
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
    fs.exists(dst, function(exists) {
        // 已存在
        if (exists) {
            callback(src, dst)
        } else { // 不存在
            fs.mkdir(dst, function() {
                callback(src, dst)
            })
        }
    })
}
