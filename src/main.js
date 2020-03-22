//找到要执行的核心文件
//1) 要解析用户的参数
const program = require('commander');
const { version } = require('./constants');
const path = require('path');

const mapActions = {
    create: {
        alias: 'c',
        description: 'create a project',
        examples:[
            'lx-cli create <project-name>'
        ]
    },
    config: {
        alias: 'conf',
        description: 'config project variable',
        examples: [
            'lx-cli config set <k> <v>',
            'li-cli config get <k>'
        ]
    },
    '*': {
        alias:'',
        description: 'command not found',
        examples: []
    }
};

//和Object.keys一样，只是支持symble
Reflect.ownKeys(mapActions).forEach((action) => {
    program
    .command(action) //配置命令的名字
    .alias(mapActions[action].alias) //命令的别名
    .description(mapActions[action].description)//命令的描述
    .action(() => { //命令的动作
        if(action === '*') { //访问不到对应的命令，就打印找不到
            console.log(mapActions[action].description);
        }else {
            //lx-cli create xxx //获取参数数组 [node环境, lx-cli所在目录, create, xxx]
            require(path.resolve(__dirname, action))(...process.argv.slice(3));
        }
    })
});

//监听用户的--help事件
program.on('--help', () => {
    console.log('\nExample:');
    Reflect.ownKeys(mapActions).forEach((action) => {
        mapActions[action].examples.forEach(example => {
            console.log(`  ${example}`);
        })
    });
})

//解析用户传过来的参数
program.version(version).parse(process.argv);