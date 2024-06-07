const { exec } = require('child_process');

// Function to execute a command and return a promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}: ${error}`);
        return reject(error);
      }
      console.log(`Output of ${command}: ${stdout}`);
      if (stderr) {
        console.error(`Error output of ${command}: ${stderr}`);
      }
      resolve(stdout);
    });

    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
}

// Main function to run scripts sequentially
async function runScripts() {
  try {
    await executeCommand('node scrape.js');
    await executeCommand('node scrape_details_from_links.js');
    await executeCommand('node scrape_src_links.js');
    console.log('All scripts executed successfully.');
  } catch (error) {
    console.error('Error executing scripts:', error);
  }
}

// Run the scripts
runScripts();
