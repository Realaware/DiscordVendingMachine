import * as fs from 'fs';
import * as path from 'path';

const STORAGE_PATH = path.join(__dirname + '/../Storage');
// Handling product reward files.
// Promise base.

class ReadOneLineConfig {
    removeLine: boolean;
}

export default class StorageManager {
    
    async CreateFile(name: string, content: string = "") {
        if (!fs.existsSync(`${STORAGE_PATH}/${name}.txt`)) {

            fs.writeFileSync(`${STORAGE_PATH}/${name}.txt`,content);
        
            return null;
        } else {
            return 'Already existing file. To Edit file, you should use \'EditFile\' method. ';
        }
    }

    async EditFile(name: string, content: string) {
        if (fs.existsSync(`${STORAGE_PATH}/${name}.txt`)) {

            fs.writeFileSync(`${STORAGE_PATH}/${name}.txt`,content);

        } else {
            return 'Not existing file.';
        }
    }

    async ReadOneLine(content: string, config: ReadOneLineConfig) {
        const firstLine = content
        .split('\n')[0]
        
        if (config.removeLine) {
            const _content = content
            .split('\n')
            .shift()
            .trimStart();

            return [firstLine,_content]
        }

        return [firstLine,content];
    }

    async ReadMultipleLine(content:string, config: ReadOneLineConfig, lines: number = 1) {
        if (lines == 1) {
            return this.ReadOneLine(content,config);
        }

        if (config.removeLine) {

            var _content = content
            .split('\n')
            
            const RemovedLines = [];

            for (let i = 0;i<lines;i++) {
                RemovedLines.push(_content.shift());
            }
            
            return [RemovedLines.join('\n'),_content.join('\n')];
        }
    }

    async ReadFile(name: string) {
        if (fs.existsSync(`${STORAGE_PATH}/${name}.txt`)) {

            const content = fs.readFileSync(`${STORAGE_PATH}/${name}.txt`,'utf-8');

            return content;
        } else {
            return null;
        }
    }

    async RemoveFile(name: string) {
        if (fs.existsSync(`${STORAGE_PATH}/${name}.txt`)) {
            fs.unlinkSync(`${STORAGE_PATH}/${name}.txt`);
        }
    }

}