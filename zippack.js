var fs = require('fs');
var archiver = require('archiver');
console.log('打包进行中，请稍等...');
var output = fs.createWriteStream('./webapp(H5).zip');
var archive = archiver('zip');

archive.on('error', function(err){
	console.log('打包压缩失败了....');
    throw err;
});

archive.pipe(output);
archive.bulk([
	{ expand: true, cwd: './build', src: ['**'] }
    //{ src: ['./build/**']}
]);
archive.finalize();
console.log('打包压缩OK，编译成功 ....');
console.log('请到“'+__dirname+'\\webapp(H5).zip” 目录下拷贝前端工程编译包');