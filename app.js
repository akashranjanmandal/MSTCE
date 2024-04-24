// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./connection'); // Import the database connection
const {User, Payment} = require('./model')
; // Import the User model
const path = require('path');

// Initialize express app
const app = express();
const puppeteer = require('puppeteer');

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.get('/college', (req, res) => {
  res.sendFile(path.join(__dirname, 'college.html'));
});

app.get('/tabulationlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'tabulationlogin.html'));
  });
app.get('/tabulation', (req, res) => {
    res.sendFile(path.join(__dirname, 'tabulation.html'));
  });
  app.get('/tabulationstep2', (req, res) => {
    res.sendFile(path.join(__dirname, 'tabulationstep2.html'));
  });
    
  app.get('/councillogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'councillogin.html'));
  });
  
app.get('/council', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/council/Coucil.html'));
  });
  

  app.get('/editproduct', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/council/editproduct.html'));
  });
  

  app.get('/grace', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/council/grace.html'));
  });
  

  app.get('/polytechniclogin', async (req, res) => {

        res.sendFile(path.join(__dirname, 'polytechniclogin.html'));
  });

app.get('/polytechnic', async (req, res) => {
    try {
        // Fetch all user details from the database
        const users = await User.find();
        // Render the HTML file and pass the user details as data
        res.render('polytechnic', { users: users });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/attendance', async (req, res) => {
    try {
        // Fetch all user details from the database
        const users = await User.find();
        // Render the HTML file and pass the user details as data
        res.render('attendance', { users: users });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/registercertificate', async (req, res) => {
    try {
        // Find users with status 'Accepted'
        const acceptedUsers = await User.find({ status: 'accepted' });

        // Filter users whose payment status is 'PAID'
        const usersWithApprovedPayment = await Promise.all(acceptedUsers.map(async (user) => {
            const payment = await Payment.findOne({ email: user.email, status: 'PAID' });
            if (payment) {
                return user;
            }
        }));

        // Remove any undefined elements from the array
        const filteredUsers = usersWithApprovedPayment.filter(user => user);

        // Render the HTML file and pass the filtered user details as data
        res.render('registercertificate', { users: filteredUsers });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/viewapplication', async (req, res) => {
    try {
        const { email } = req.query;

        // Fetch user details from the User collection
        const user = await User.findOne({ email });

        // Fetch payment details from the Payment collection using the same email
        const payment = await Payment.findOne({ email });

        // Render the HTML file and pass both user and payment details as data
        res.render('viewapplication', { user: user, payment: payment });
    } catch (error) {
        console.error('Error fetching user and payment details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/registatus', async (req, res) => {
    try {
        const { email } = req.query;

        const users = await User.find();

        // Fetch user details from the User collection
        const user = await User.findOne({ email });

        // Fetch payment details from the Payment collection using the same email

        // Update user status to "rejected"
        if (user) {
            user.status = "rejected";
            await user.save();
        }

        // Render the HTML file and pass both user and payment details as data
        res.render('polytechnic', { users: users });
    } catch (error) {
        console.error('Error fetching user and payment details:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/registatus1', async (req, res) => {
    try {
        const { email } = req.query;

        const users = await User.find();

        // Fetch user details from the User collection
        const user = await User.findOne({ email });

        // Fetch payment details from the Payment collection using the same email

        // Update user status to "rejected"
        if (user) {
            user.status = "accepted";
            await user.save();
        }

        // Render the HTML file and pass both user and payment details as data
        res.render('polytechnic', { users: users });
    } catch (error) {
        console.error('Error fetching user and payment details:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/confirmedstudentlist', async (req, res) => {
    try {

        const users = await User.find({ status: 'accepted' });
        // Render the HTML file and pass both user and payment details as data
        res.render('confirmedstudentlist', { users: users });
    } catch (error) {
        console.error('Error fetching user and payment details:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/collectpayment', async (req, res) => {
    try {
        // Find all payments with status 'UNPAID'
        const billGeneratedPayments = await Payment.find({ status: 'UNPAID' });
        // Extract unique email addresses from the payments
        const emails = billGeneratedPayments.map(payment => payment.email);

        // Find users corresponding to these emails
        const users = await User.find({ email: { $in: emails } });

        // Render an EJS view and pass payment and user details
        res.render('collectPayment', { payments: billGeneratedPayments, users: users });
    } catch (error) {
        console.error('Error fetching payment and user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/rejectedstudents', async (req, res) => {
    try {

        const users = await User.find({ status: 'rejected' });
        // Render the HTML file and pass both user and payment details as data
        res.render('rejectedstudents', { users: users });
    } catch (error) {
        console.error('Error fetching user and payment details:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/education', (req, res) => {
  res.sendFile(path.join(__dirname,  'education.html'));
});

const pdf = require('html-pdf');
const fs = require('fs');


app.get('/downloadpaymentslip', async (req, res) => {
    try {
        const { email } = req.query;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <html>
        <body>
        <style>
        {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
        }
        
        img {
            max-width: 100%;
        }
        
        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6;
        }
        
        /* Let's make sure all tables have defaults */
        table td {
            vertical-align: top;
        }
        
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
        body {
            background-color: #f6f6f6;
        }
        
        .body-wrap {
            background-color: #f6f6f6;
            width: 100%;
        }
        
        .container {
            display: block !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            /* makes it centered */
            clear: both !important;
        }
        
        .content {
            max-width: 600px;
            margin: 0 auto;
            display: block;
            padding: 20px;
        }
        
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
            background: #fff;
            border: 1px solid #e9e9e9;
            border-radius: 3px;
        }
        
        .content-wrap {
            padding: 20px;
        }
        
        .content-block {
            padding: 0 0 20px;
        }
        
        .header {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .footer {
            width: 100%;
            clear: both;
            color: #999;
            padding: 20px;
        }
        .footer a {
            color: #999;
        }
        .footer p, .footer a, .footer unsubscribe, .footer td {
            font-size: 12px;
        }
        
        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1, h2, h3 {
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            color: #000;
            margin: 40px 0 0;
            line-height: 1.2;
            font-weight: 400;
        }
        
        h1 {
            font-size: 32px;
            font-weight: 500;
        }
        
        h2 {
            font-size: 24px;
        }
        
        h3 {
            font-size: 18px;
        }
        
        h4 {
            font-size: 14px;
            font-weight: 600;
        }
        
        p, ul, ol {
            margin-bottom: 10px;
            font-weight: normal;
        }
        p li, ul li, ol li {
            margin-left: 5px;
            list-style-position: inside;
        }
        
        /* -------------------------------------
            LINKS & BUTTONS
        ------------------------------------- */
        a {
            color: #1ab394;
            text-decoration: none;
        }
        
        .btn-primary {
            text-decoration: none;
            color: #FFF;
            background-color: #1ab394;
            border: solid #1ab394;
            border-width: 5px 10px;
            line-height: 2;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 5px;
            text-transform: capitalize;
        }
        
        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .last {
            margin-bottom: 0;
        }
        
        .first {
            margin-top: 0;
        }
        
        .aligncenter {
            text-align: center;
        }
        
        .alignright {
            text-align: right;
        }
        
        .alignleft {
            text-align: left;
        }
        
        .clear {
            clear: both;
        }
        
        /* -------------------------------------
            ALERTS
            Change the class depending on warning email, good email or bad email
        ------------------------------------- */
        .alert {
            font-size: 16px;
            color: #fff;
            font-weight: 500;
            padding: 20px;
            text-align: center;
            border-radius: 3px 3px 0 0;
        }
        .alert a {
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
        }
        .alert.alert-warning {
            background: #f8ac59;
        }
        .alert.alert-bad {
            background: #ed5565;
        }
        .alert.alert-good {
            background: #1ab394;
        }
        
        /* -------------------------------------
            INVOICE
            Styles for the billing table
        ------------------------------------- */
        .invoice {
            margin: 40px auto;
            text-align: left;
            width: 80%;
        }
        .invoice td {
            padding: 5px 0;
        }
        .invoice .invoice-items {
            width: 100%;
        }
        .invoice .invoice-items td {
            border-top: #eee 1px solid;
        }
        .invoice .invoice-items .total td {
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            font-weight: 700;
        }
        
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 640px) {
            h1, h2, h3, h4 {
                font-weight: 600 !important;
                margin: 20px 0 5px !important;
            }
        
            h1 {
                font-size: 22px !important;
            }
        
            h2 {
                font-size: 18px !important;
            }
        
            h3 {
                font-size: 16px !important;
            }
        
            .container {
                width: 100% !important;
            }
        
            .content, .content-wrap {
                padding: 10px !important;
            }
        
            .invoice {
                width: 100% !important;
            }
        }
        .btn {
            transition: all 0.3s ease-in-out;
            font-family: "Dosis", sans-serif;
          }
          
          .btn {
            width: 250px;
            height: 60px;
            border-radius: 20px;
            background-color: red;
            box-shadow: 0 20px 30px -6px #eee;
            outline: none;
            cursor: pointer;
            border: none;
            font-size: 24px;
            color: white;
          }
          
          .btn:hover {
            transform: translateY(3px);
            box-shadow: none;
          }
          
          .btn:active {
            opacity: 0.5;
          }
        </style>
        <table class="body-wrap">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                <h1> 
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap aligncenter">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
        <button class="btn">NOT PAID</button>

                                            <h2>Your Payment Request has been generated </h2>
                                            <h3> Visit you college and Make Payment for Exam Registration</h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block"> 
                                            <table class="invoice">
                                                <tbody><tr>
                                                    <td>${user.firstName} ${user.lastName} <br>Invoice #12345<br>April 20 2024</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="invoice-items" cellpadding="0" cellspacing="0">
                                                            <tbody><tr>
                                                                <td>Pending Payment for Exam Registration </td>
                                                                
                                                                <td class="alignright">Rs  1200.00</td>
                                                            </tr>
                                                            <tr>
                                                            <td> MSCTE ID: UNPAID2024EE0042</td>
                                                            </tr>
                                                            
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href="#">Contact College</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            Shillong Polytechnic Insititute
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>
            </body>
            </html>
        `;

        // Options for pdf creation
        const options = {
            format: 'A4',
            orientation: 'portrait'
        };

        // Generate PDF from HTML template
        pdf.create(htmlTemplate, options).toStream((err, stream) => {
            if (err) {
                // If there's an error, respond with an error message or redirect to an error page
                return res.status(500).send('Failed to generate PDF');
            }
            
            // Serve the generated PDF to the user
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});

app.get('/viewattendance', async (req, res) => {
    try {
        const { email } = req.query;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Attendance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .student-info {
            float: left;
            margin-bottom: 20px;
        }
        .student-info p {
            margin: 5px 0;
        }
        .student-info img {
            float: right;
            width: 100px;
            height: 100px;
            object-fit: cover;
            margin-left: 10px;
            border: 1px solid #ddd;
        }
        .attendance-header {
            clear: both;
            text-align: center;
            margin-top: 20px;
        }
        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            margin-top: 20px;
        }
        .attendance-table th, .attendance-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .attendance-table th {
            background-color: #f2f2f2;
        }
        .student-signature {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="student-info">
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Roll Number:</strong> 32538</p>
        <!-- Add more student information as needed -->
    </div>
    <img src="/img/dp.png" alt="Student Image" class="student-image">
    <div class="attendance-header">
        <h2>Student Attendance</h2>
        <h3>Attendance Record (Percentage)</h3>
    </div>
    <table class="attendance-table">
        <thead>
            <tr>
                <th>Subject</th>
                <th>Week 1</th>
                <th>Week 2</th>
                <th>Week 3</th>
                <th>Week 4</th>
                <!-- Add more weeks as needed -->
                <th>Average</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="subject-name">EE501 Power Electronics</td>
                <td>80%</td>
                <td>90%</td>
                <td>85%</td>
                <td>95%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">87.5%</td>
            </tr>
            <tr>
                <td class="subject-name">EE505 Switchgear & Protection</td>
                <td>70%</td>
                <td>80%</td>
                <td>75%</td>
                <td>85%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">77.5%</td>
            </tr>
            <tr>
                <td class="subject-name">EE506 Instrumentation & Control</td>
                <td>75%</td>
                <td>85%</td>
                <td>80%</td>
                <td>90%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">82.5%</td>
            </tr>
            <tr>
                <td class="subject-name">EE601 Elective-II Utilisation of Electrical Power</td>
                <td>85%</td>
                <td>95%</td>
                <td>90%</td>
                <td>100%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">92.5%</td>
            </tr>
            <tr>
                <td class="subject-name">EE513 Professional Practices-V</td>
                <td>60%</td>
                <td>70%</td>
                <td>65%</td>
                <td>75%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">67.5%</td>
            </tr>
            <tr>
                <td class="subject-name">EE612 Project</td>
                <td>90%</td>
                <td>100%</td>
                <td>95%</td>
                <td>100%</td>
                <!-- Add attendance percentage for each week -->
                <td class="attendance-percentage">96.25%</td>
            </tr>
            <!-- Add more rows for other subjects -->
        </tbody>
    </table>
 <div class="student-signature">
        <p>________________________</p>
        <p>Student Signature</p>
    </div>
</body>
</html>


        `;

        // Options for pdf creation
        const options = {
            format: 'A4',
            orientation: 'portrait'
        };

        // Generate PDF from HTML template
        pdf.create(htmlTemplate, options).toStream((err, stream) => {
            if (err) {
                // If there's an error, respond with an error message or redirect to an error page
                return res.status(500).send('Failed to generate PDF');
            }
            
            // Serve the generated PDF to the user
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});




app.get('/downloadpaymentsliponline', async (req, res) => {
    try {
        const { email } = req.query;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <html>
        <body>
        <style>
        {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
        }
        
        img {
            max-width: 100%;
        }
        
        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6;
        }
        
        /* Let's make sure all tables have defaults */
        table td {
            vertical-align: top;
        }
        
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
        body {
            background-color: #f6f6f6;
        }
        
        .body-wrap {
            background-color: #f6f6f6;
            width: 100%;
        }
        
        .container {
            display: block !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            /* makes it centered */
            clear: both !important;
        }
        
        .content {
            max-width: 600px;
            margin: 0 auto;
            display: block;
            padding: 20px;
        }
        
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
            background: #fff;
            border: 1px solid #e9e9e9;
            border-radius: 3px;
        }
        
        .content-wrap {
            padding: 20px;
        }
        
        .content-block {
            padding: 0 0 20px;
        }
        
        .header {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .footer {
            width: 100%;
            clear: both;
            color: #999;
            padding: 20px;
        }
        .footer a {
            color: #999;
        }
        .footer p, .footer a, .footer unsubscribe, .footer td {
            font-size: 12px;
        }
        
        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1, h2, h3 {
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            color: #000;
            margin: 40px 0 0;
            line-height: 1.2;
            font-weight: 400;
        }
        
        h1 {
            font-size: 32px;
            font-weight: 500;
        }
        
        h2 {
            font-size: 24px;
        }
        
        h3 {
            font-size: 18px;
        }
        
        h4 {
            font-size: 14px;
            font-weight: 600;
        }
        
        p, ul, ol {
            margin-bottom: 10px;
            font-weight: normal;
        }
        p li, ul li, ol li {
            margin-left: 5px;
            list-style-position: inside;
        }
        
        /* -------------------------------------
            LINKS & BUTTONS
        ------------------------------------- */
        a {
            color: #1ab394;
            text-decoration: underline;
        }
        
        .btn-primary {
            text-decoration: none;
            color: #FFF;
            background-color: #1ab394;
            border: solid #1ab394;
            border-width: 5px 10px;
            line-height: 2;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 5px;
            text-transform: capitalize;
        }
        
        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .last {
            margin-bottom: 0;
        }
        
        .first {
            margin-top: 0;
        }
        
        .aligncenter {
            text-align: center;
        }
        
        .alignright {
            text-align: right;
        }
        
        .alignleft {
            text-align: left;
        }
        
        .clear {
            clear: both;
        }
        
        /* -------------------------------------
            ALERTS
            Change the class depending on warning email, good email or bad email
        ------------------------------------- */
        .alert {
            font-size: 16px;
            color: #fff;
            font-weight: 500;
            padding: 20px;
            text-align: center;
            border-radius: 3px 3px 0 0;
        }
        .alert a {
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
        }
        .alert.alert-warning {
            background: #f8ac59;
        }
        .alert.alert-bad {
            background: #ed5565;
        }
        .alert.alert-good {
            background: #1ab394;
        }
        
        /* -------------------------------------
            INVOICE
            Styles for the billing table
        ------------------------------------- */
        .invoice {
            margin: 40px auto;
            text-align: left;
            width: 80%;
        }
        .invoice td {
            padding: 5px 0;
        }
        .invoice .invoice-items {
            width: 100%;
        }
        .invoice .invoice-items td {
            border-top: #eee 1px solid;
        }
        .invoice .invoice-items .total td {
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            font-weight: 700;
        }
        
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 640px) {
            h1, h2, h3, h4 {
                font-weight: 600 !important;
                margin: 20px 0 5px !important;
            }
        
            h1 {
                font-size: 22px !important;
            }
        
            h2 {
                font-size: 18px !important;
            }
        
            h3 {
                font-size: 16px !important;
            }
        
            .container {
                width: 100% !important;
            }
        
            .content, .content-wrap {
                padding: 10px !important;
            }
        
            .invoice {
                width: 100% !important;
            }
        }
        .btn {
            transition: all 0.3s ease-in-out;
            font-family: "Dosis", sans-serif;
          }
          
          .btn {
            width: 150px;
            height: 60px;
            border-radius: 20px;
            background-color: green;
            box-shadow: 0 20px 30px -6px #eee;
            outline: none;
            cursor: pointer;
            border: none;
            font-size: 24px;
            color: white;
          }
          
          .btn:hover {
            transform: translateY(3px);
            box-shadow: none;
          }
          
          .btn:active {
            opacity: 0.5;
          }
        </style>
        <table class="body-wrap">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                <h1> 
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap aligncenter">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
        <button class="btn">PAID</button>

                                            <h2>Payment Successful</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block"> 
                                            <table class="invoice">
                                                <tbody><tr>
                                                    <td>${user.firstName} ${user.lastName} <br>Invoice #12345<br>April 20 2024</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="invoice-items" cellpadding="0" cellspacing="0">
                                                            <tbody><tr>
                                                                <td>Payment for Exam Registration </td>
                                                                <td class="alignright">Rs  1200.00</td>
                                                            </tr>
                                                            <tr>
                                                            <td> MSCTE ID: MSCTE2024EE0042</td>
                                                           </tr>
                                                            
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href="#">Contact College</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            Shillong Polytechnic Insititute
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>
            </body>
            </html>
        `;

        // Options for pdf creation
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlTemplate);

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Close browser
        await browser.close();

        // Set headers and send the PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=payment_slip.pdf');
        res.send(pdfBuffer);
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});


app.post('/downloadregisteredform', async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Registration Form</title>
            <style>
                body {
                    height: 270vh;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-image: url('https://cdn1.byjus.com/wp-content/uploads/2019/01/Meghalaya-Board-Of-School-Education-1.png');
                    background-size: cover;
                    opacity: 1.2;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed; 
                }
        
                .container {
                    width: 80%;
                    height: 85%;
                    max-width: 600px;
                    padding-left: 200px;
                    padding-top: 30px;

                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    
                }
        
                .container h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: rgb(63, 63, 241);
                }
        
                .section {
                    margin-bottom: 20px;
                    
                }
        
                .section h2 {
                    margin-bottom: 2px;
                }
        
                .section p {
                    margin: 4px 0;
                    padding: 3px; /* Add padding to create space between the text and the border */
                    border: 1px solid #ccc; /* Add border for the box-like styling */
                    border-radius: 5px;
                    white-space: nowrap; /* Add rounded corners */
                   
                }
        
                .section p strong {
                    display: inline-block; /* Ensure <strong> tags are displayed as blocks to apply styling */
                    width: 150px; /* Set a fixed width for the labels */
                    font-weight: bold; /* Make the labels bold */
                    color: rgb(63, 63, 241);
                }
        
                /* Add more CSS styling for form elements */
            </style>
        </head>
        <body>
        <div class="container">
    <h1>User Registration Form</h1>
    <div class="section">
        <h2>Personal Information</h2>
        <p><strong>First Name:</strong> ${user.firstName}</p>
        <p><strong>Last Name:</strong> ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <!-- Add more personal information fields as needed -->
    </div>
    <div class="section">
        <h2>Contact Information</h2>
        <p><strong>Contact Number:</strong> ${user.contactNo}</p>
        <!-- Add more contact information fields as needed -->
    </div>
    <div class="section">
        <h2>Date of Birth</h2>
        <p><strong>Date of Birth:</strong> ${user.dob}</p>
        <!-- Add more date of birth fields as needed -->
    </div>
    <div class="section">
        <h2>Address</h2>
        <p><strong>Address Line 1:</strong> ${user.addressLine1}</p>
        <p><strong>Address Line 2:</strong> ${user.addressLine2}</p>
        <!-- Add more address fields as needed -->
    </div>
    <!-- Add more sections and user details as needed -->
</div>

        </body>
        </html>
        `;

        // Options for pdf creation
        const options = {
            format: 'A4',
            orientation: 'portrait'
        };

        // Generate PDF from HTML template
        pdf.create(htmlTemplate, options).toStream((err, stream) => {
            if (err) {
                // If there's an error, respond with an error message or redirect to an error page
                return res.status(500).send('Failed to generate PDF');
            }
            
            // Serve the generated PDF to the user
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});

app.get('/downloadcertificate', async (req, res) => {
    try {
        const { email } = req.query;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Registration Form</title>
            <style>
                body {
                    height: 270vh;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-image: url('https://cdn1.byjus.com/wp-content/uploads/2019/01/Meghalaya-Board-Of-School-Education-1.png');
                    background-size: cover;
                    opacity: 1.2;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed; 
                }
        
                .container {
                    width: 80%;
                    height: 85%;
                    max-width: 600px;
                    padding-left: 200px;
                    padding-top: 30px;

                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    
                }
        
                .container h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: rgb(63, 63, 241);
                }
        
                .section {
                    margin-bottom: 20px;
                    
                }
        
                .section h2 {
                    margin-bottom: 2px;
                }
        
                .section p {
                    margin: 4px 0;
                    padding: 3px; /* Add padding to create space between the text and the border */
                    border: 1px solid #ccc; /* Add border for the box-like styling */
                    border-radius: 5px;
                    white-space: nowrap; /* Add rounded corners */
                   
                }
        
                .section p strong {
                    display: inline-block; /* Ensure <strong> tags are displayed as blocks to apply styling */
                    width: 150px; /* Set a fixed width for the labels */
                    font-weight: bold; /* Make the labels bold */
                    color: rgb(63, 63, 241);
                }
        
                /* Add more CSS styling for form elements */
            </style>
        </head>
        <body>
        <div class="container">
    <h1>User Registration Form</h1>
    <div class="section">
        <h2>Personal Information</h2>
        <p><strong>First Name:</strong> ${user.firstName}</p>
        <p><strong>Last Name:</strong> ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <!-- Add more personal information fields as needed -->
    </div>
    <div class="section">
        <h2>Contact Information</h2>
        <p><strong>Contact Number:</strong> ${user.contactNo}</p>
        <!-- Add more contact information fields as needed -->
    </div>
    <div class="section">
        <h2>Date of Birth</h2>
        <p><strong>Date of Birth:</strong> ${user.dob}</p>
        <!-- Add more date of birth fields as needed -->
    </div>
    <div class="section">
        <h2>Address</h2>
        <p><strong>Address Line 1:</strong> ${user.addressLine1}</p>
        <p><strong>Address Line 2:</strong> ${user.addressLine2}</p>
        <!-- Add more address fields as needed -->
    </div>
    <!-- Add more sections and user details as needed -->
</div>

        </body>
        </html>
        `;

        // Options for pdf creation
        const options = {
            format: 'A4',
            orientation: 'portrait'
        };

        // Generate PDF from HTML template
        pdf.create(htmlTemplate, options).toStream((err, stream) => {
            if (err) {
                // If there's an error, respond with an error message or redirect to an error page
                return res.status(500).send('Failed to generate PDF');
            }
            
            // Serve the generated PDF to the user
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,  'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/uploaddoc', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploaddoc.html'));
  });

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname,  'signup.html'));
});


// Define route for the first form (no validation)
app.post('/form1', async (req, res) => {
  try {
    // Create a new user with data from the form
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNo: req.body.contactNo,
      email: req.body.email,
      dob: req.body.dob,
      password: req.body.password
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.redirect(`/register?email=${req.body.email}`);
  } catch (err) {
    // If there's an error, respond with an error message
    res.status(400).send(err.message);
  }
});



// Define route for the second form
app.post('/form2', async (req, res) => {
  try {
    const { email } = req.body; // Get the email from the query parameters
    // Find the user by email address
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their information
      user.fatherName = req.body.fatherName;
      user.motherName = req.body.motherName;
      user.guardianName = req.body.guardianName;
      user.guardianContactNo = req.body.guardianContactNo;
      user.addressLine1 = req.body.addressLine1;
      user.addressLine2 = req.body.addressLine2;
      // Update other fields from form 2 as needed
    } else {
      // If user doesn't exist, respond with an error message
      return res.status(404).send('User not found. Please fill the first form.');
    }

    // Save the updated user to the database
    await user.save();

    // Respond with a success message
    res.redirect(`/education?email=${req.body.email}`);
  } catch (err) {
    // If there's an error, respond with an error message
    res.status(400).send(err.message);
  }
});


app.post('/forcollege' , async(req, res) =>{
    try{

        const email = req.body;
        console.log(email);
    res.redirect(`/college?email=${req.body.email}`);

    }
    catch (err) {
        // If there's an error, respond with an error message
        res.status(400).send(err.message);
      }
});
// Define route for the third form
app.post('/form3', async (req, res) => {
    try {
      let { email } = req.body;
  
      // Convert email to a string if it's not already
      email = String(email);
  
      // Check if there is a comma after the email, and remove it if it exists
      if (email && email.endsWith(',')) {
        email = email.slice(0, -1); // Remove the last character, which is the comma
      }
  
      // Find the user by email address
      let user = await User.findOne({ email });
  
      if (user) {
        // If user exists, update their information
        user.boardName = req.body.boardName;
        user.schoolName = req.body.schoolName;
        user.percentage = req.body.percentage;
        user.passoutYear = req.body.passoutYear;
        // Update other fields from form 3 as needed
      } else {
        // If user doesn't exist, respond with an error message
        return res.status(404).send('User not found. Please fill the first form.');
      }
  
      // Save the updated user to the database
      await user.save();
  
      // Respond with a success message
      res.redirect(`/uploaddoc?email=${email}`);
  
    } catch (err) {
      // If there's an error, respond with an error message
      res.status(400).send(err.message);
    }
  });
  


app.get('/finalcertificate', async (req, res) => {
    try {
        const { email } = req.query;
        // Find the user by email address
        const user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, respond with an error message or redirect to an error page
            return res.status(404).send('User not found');
        }

        // Define the HTML template for the registration form
        const htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Certificate</title>
</head>
<body>
    <div style="width:800px; height:600px; padding:20px; text-align:center; border: 10px solid #787878; background-image: url(assets/imgs/certificate.jpg); background-position: center;">
        <div style="width:750px; height:550px; padding:20px; text-align:center; border: 5px solid #787878;">
               <span style="font-size:50px; font-weight:bold">Registration Certificate</span>
               <br><br>
               <span style="font-size:25px"><i>This is to certify that</i></span>
               <br><br>
               <span style="font-size:30px"><b>${user.firstName} ${user.lastName}</b></span><br/><br/>
               <span style="font-size:25px"><i>has Succesfully registered for</i></span> <br/><br/>
               <span style="font-size:30px">The examination</span> <br/><br/>
               <span style="font-size:20px">that will be held <b>on Nov</b></span> <br/><br/><br/><br/>
               <span style="font-size:25px"><i></i></span><br>
              <span style="font-size:30px">2024</span>
        </div>
        </div>
</body>
</html>
        `;

        // Options for pdf creation
        const options = {
            format: 'A4',
            orientation: 'landscape'
        };

        // Generate PDF from HTML template
        pdf.create(htmlTemplate, options).toStream((err, stream) => {
            if (err) {
                // If there's an error, respond with an error message or redirect to an error page
                return res.status(500).send('Failed to generate PDF');
            }
            
            // Serve the generated PDF to the user
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (err) {
        // If there's an error, respond with an error message or redirect to an error page
        res.status(500).send('Internal Server Error');
    }
});




app.get('/acceptpayment', async (req, res) => {
    try {
        const { email } = req.query;

        // Find the payment with the provided email and update its status to "PAID"
        const payment = await Payment.findOneAndUpdate({ email }, { status: 'PAID' }, { new: true });

        if (!payment) {
            // If no payment is found with the provided email, return a 404 Not Found response
            return res.status(404).json({ error: 'Payment not found' });
        }

        const billGeneratedPayments = await Payment.find({ status: 'UNPAID' });
        // Extract unique email addresses from the payments
        const emails = billGeneratedPayments.map(payment => payment.email);

        // Find users corresponding to these emails
        const users = await User.find({ email: { $in: emails } });

        // Render an EJS view and pass payment and user details
        res.render('collectPayment', { payments: billGeneratedPayments, users: users });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/allpayments', async (req, res) => {
    try {

        // Find the payment with the provided email and update its status to "PAID"



        const billGeneratedPayments = await Payment.find({ status: 'PAID' });
        // Extract unique email addresses from the payments
        const emails = billGeneratedPayments.map(payment => payment.email);

        // Find users corresponding to these emails
        const users = await User.find({ email: { $in: emails } });

        // Render an EJS view and pass payment and user details
        res.render('allpayments', { payments: billGeneratedPayments, users: users });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/qrpage', async (req, res) => {
    res.sendFile(path.join(__dirname, 'qrpage.html'));

});

app.post('/payment_slip', async (req, res) => {
    try {

      const { email, paymentMethod , college } = req.body;
      // Check if the payment mode is offline
      if (paymentMethod === 'offline') {
        // Save the payment information to the database
        const payment = new Payment({
          email,
          paymentMethod,
          college,
          status : 'UNPAID'
        });
        await payment.save();
  
        // Respond with a success message
        res.redirect(`/downloadpaymentslip?email=${req.body.email}`)
      } else {
        res.redirect(`/qrpage?email=${req.body.email}`);

        // const payment = new Payment({
        //     email,
        //     paymentMethod,
        //     college,
        //     status : 'PAID'
        //   });
        //   await payment.save();
        // // Respond with a message indicating that online payments are not handled in this example
        // res.redirect(`/downloadpaymentsliponline?email=${req.body.email}`);
      }
    } catch (err) {
        console.log(err);
      // If there's an error, respond with an error message
      res.status(500).send('Internal Server Error');
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
