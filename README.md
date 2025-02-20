SoundPilot is a music education web app created for the Exscore 2025 hackathon using HTML, CSS, JS, NodeJS, and MySQL.

This project does not have account support and is not hosted, meaning it is run locally with certain HTML files being considered by default as different types of users.
To run with LiveServer, simply right-click on an HTML file and click "Open with Live Server".

If you open home.html, that is considered by default the demo student, and there is no way to switch student accounts as mentioned above.
teacher.html is the default teacher page.
Again, these accounts cannot be changed, and are just for demo purposes.



This project uses MySQL. [Download MySQL](https://dev.mysql.com/downloads/installer/).
To setup this project's database, go into the Server directory within this project, and run "node setup.js".
Answer the prompts about your local MySQL installation, and a local database will be created for you, hosting the site.

After these prerequisites have been completed, you can run the project by:
1. Starting the server: go into the Server Directory and run "node index.js".
2. Open home.html to access the default student page or teacher.html to access the default teacher page.
