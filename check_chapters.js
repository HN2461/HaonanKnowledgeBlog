import fs from 'fs';
import path from 'path';

const jsDir = 'c:\\Users\\HN246\\Desktop\\前端书籍\\public\\notes\\JS';

// 检查所有章节文件
function checkAllChapters() {
    const results = [];
    
    for (let i = 1; i <= 30; i++) {
        const filename = `第${i}章*.md`;
        const files = fs.readdirSync(jsDir).filter(f => f.match(new RegExp(`第${i}章.*\\.md`)));
        
        if (files.length > 0) {
            const filePath = path.join(jsDir, files[0]);
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            results.push({
                chapter: i,
                filename: files[0],
                lines: lines.length,
                hasEnding: content.includes('**下一章预告**') || content.includes('附录') || content.includes('**教程总结**'),
                size: Math.round(content.length / 1024) + 'KB'
            });
        } else {
            results.push({
                chapter: i,
                filename: '未找到',
                lines: 0,
                hasEnding: false,
                size: '0KB'
            });
        }
    }
    
    return results;
}

// 输出结果
const results = checkAllChapters();
console.log('JavaScript教程章节检查结果：\n');
console.log('章节\t文件名\t\t\t\t行数\t大小\t状态');
console.log('─'.repeat(80));

results.forEach(result => {
    const status = result.hasEnding ? '✓完整' : '⚠️未完成';
    const name = result.filename.length > 20 ? 
        result.filename.substring(0,17) + '...' : 
        result.filename;
    
    console.log(`${result.chapter.toString().padStart(2)}\t${name.padEnd(25)}\t${result.lines.toString().padStart(4)}\t${result.size.padStart(5)}\t${status}`);
});

const completedChapters = results.filter(r => r.hasEnding).length;
console.log(`\n总计：${completedChapters}/30 章已完成`);
