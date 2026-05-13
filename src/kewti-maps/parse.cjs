const fs = require('fs');
const content = fs.readFileSync('et-mono.svg', 'utf8');
const paths = content.match(/<path[^>]+>/g);
console.log('Number of paths:', paths ? paths.length : 0);
if (paths) {
    paths.forEach((p, i) => {
        const fill = p.match(/fill=\"([^\"]+)\"/);
        const d = p.match(/d=\"([^\"]{0,50})/);
        console.log(`Path ${i+1}: fill=${fill ? fill[1] : 'none'} d=${d ? d[1] : ''}`);
    });
}
