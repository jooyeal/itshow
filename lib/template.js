module.exports = {
    html: function () {
        const htmlCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style.css  ">
            <title>login form</title>
        </head>
        <body>
            <div class="wrap">
            <div class="login_Form">
            <div class="title_bar">
            <h1>IT SHOW</h1>
            </div>
            <div class="box_inner">            
                <form>
                    ID <br>
                    <input type='text' >
                    <br>
                    PASSWORD <br>
                    <input type='password'>                
                </form>
            <button class = login_Button type="submit">Login</button>
            <button class = Create_Button type="submit">Create account</button>
            </div>
        </div>
        
    </div>
    
    </body>
    </html>
        `;
        return htmlCode;
    },

};