const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client/src');

function findAndReplace(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            findAndReplace(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://localhost:5000')) {
                // Replace 'http://localhost:5000/api' with 'import.meta.env.VITE_API_URL + ' or similar.
                // Or better, replace "http://localhost:5000" with "` + config.API_URL + `"
                // Actually, VITE uses import.meta.env.VITE_API_URL
                // Let's replace 'http://localhost:5000' with ${import.meta.env.VITE_API_URL || 'http://localhost:5000'}
                // For strings with backticks: `http://localhost:5000/api...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api...`
                // For strings with quotes: 'http://localhost:5000/api...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api...`
                
                content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
                content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
                content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
                
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplace(directoryPath);
