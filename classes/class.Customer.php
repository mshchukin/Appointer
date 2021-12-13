<?php
//CREATED BY MITCHELL STEFFENSEN AND MIKHAIL SHCHUKIN
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

/*
    The Customer class provides the basic user functionality of logging
    in, logging out, registering, data retrieval, session validation and
    view routing.
*/
class Customer
{
    private $database, //Stores the database connection
            $data; //Stores the user's data

    public function __construct($database) //Set up the customer by copying the specified database connection
    {
        $this->database = $database; //Copy the database connection
    }

    public function login() //Log the user into the system by checking the supplied email and password and creating a session
    {
        if($this->validSession()) //The user is already logged in
        {
            exit(header('Location: /home')); //Send the user back to their home view and kill the script
        }

        header('Content-type: application/json; charset=utf-8'); //Set the content type to JSON

        if(!isset($_POST['email']) || !isset($_POST['pass']) || !isset($_SESSION)) //One of the required POST variables is missing or a session hasn't been started
        {
            print json_encode(array('error' => 'You have entered an invalid email and/or password!', 'success' => false)); //Output a JSON encoded error message
        }

        if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && strlen($_POST['pass'])) //The POST variables are valid
        {
            if($this->getUserBy('email', $_POST['email'])) //Get the user's data the supplied email
            {
                if(password_verify($_POST['pass'], $this->data['password'])) //The supplied password is correct
                {
                    //Set up the user's session with their ID and rank
                    $_SESSION['id'] = $this->data['id'];
                    $_SESSION['rank'] = $this->data['rank'];
                    $_SESSION['location'] = $this->data['location'];

                    print json_encode(array('success' => true)); //Output a JSON encoded success message
                }
                else //The supplied password is incorrect
                {
                    print json_encode(array('error' => 'The password you entered is incorrect!', 'success' => false)); //Output a JSON encoded error message
                }
            }
            else //The user doesn't exist
            {
                print json_encode(array('error' => 'An account with that email does not exist!', 'success' => false)); //Output a JSON encoded error message
            }
        }
        else //The POST variables are invalid
        {
            print json_encode(array('error' => 'You have entered an invalid email and/or password!', 'success' => false)); //Output a JSON encoded error message
        }
    }

    public function logout() //Log the user out of the system
    {
        if($this->validSession()) //The user is logged in
        {
            session_destroy(); //Destroy their session
        }

        exit(header('Location: /')); //Send the user back to the index page and kill the script
    }

    public function register()
    {
        if($this->validSession()) //The user is already logged in
        {
            exit(header('Location: /home')); //Send the user back to their home view and kill the script
        }

        header('Content-type: application/json; charset=utf-8'); //Set the content type to JSON

        if(!isset($_POST['fname']) || !isset($_POST['lname']) || !isset($_POST['bday']) || !isset($_POST['bmonth']) || !isset($_POST['byear']) || !isset($_POST['country']) || !isset($_POST['province']) || !isset($_POST['city']) || !isset($_POST['email']) || !isset($_POST['pass']) || !isset($_POST['confpass'])) //One of the required POST variables is missing
        {
            print json_encode(array('error' => 'You have entered invalid information 2!', 'success' => false)); //Output a JSON encoded error message
        }

        if(strlen($_POST['fname']) || strlen($_POST['lname']) || strlen($_POST['bday']) || strlen($_POST['bmonth']) || strlen($_POST['byear']) || strlen($_POST['country']) || strlen($_POST['province']) || strlen($_POST['city']) || strlen($_POST['email']) || strlen($_POST['pass']) || strlen($_POST['confpass'])) //The POST variables are valid
        {
            if(!strcmp($_POST['pass'], $_POST['confpass'])) //The two passwords match
            {
                $birthday = $_POST['byear'] . '-' . $_POST['bmonth'] . '-' . $_POST['bday']; //Format the date

                if($this->database->query('INSERT INTO users (email, password, firstname, lastname, birthday, country, province, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', $_POST['email'], password_hash($_POST['pass'], PASSWORD_DEFAULT), $_POST['fname'], $_POST['lname'], $birthday, $_POST['country'], $_POST['province'], $_POST['city'])) //Insert the new user into the database
                {
                    $this->getUserBy('email', $_POST['email']); //Get the user's data the supplied email

                    //Set up the user's session with their ID and rank
                    $_SESSION['id'] = $this->data['id'];
                    $_SESSION['rank'] = $this->data['rank'];

                    print json_encode(array('success' => true)); //Output a JSON encoded success message
                }
                else //The user wasn't added to the database
                {
                    print json_encode(array('error' => 'An error occured!', 'success' => false)); //Output a JSON encoded error message
                }
            }
            else //The two passwords don't match
            {
                print json_encode(array('error' => 'The two passwords you entered do not match!', 'success' => false)); //Output a JSON encoded error message
            }
        }
        else //The POST variables are invalid
        {
            print json_encode(array('error' => 'You have entered an invalid information!', 'success' => false)); //Output a JSON encoded error message
        }
    }

    public function view($view) //Show the specified view
    {
        if($view == 'home')
        {
            include(__DIR__ . '/../pages/html/customer_view.html'); //Display the home view
        }
        else if($view == 'settings')
        {
            include(__DIR__ . '/../pages/html/customer_settings.html'); //Display the settings view
        }
        else if($view == 'profile')
        {
            include(__DIR__ . '/../pages/html/customer_profile.html'); //Display the profile view
        }
        else //Invalid view
        {
            exit(header('Location: /home')); //Send the user back to their home view and kill the script
        }
    }

    public function validSession() //Check whether the user has a valid session or not
    {
        return isset($_SESSION['id']) && $_SESSION['id'] > 0 && isset($_SESSION['rank']) && $_SESSION['rank'] >=0 && $_SESSION['rank'] <= 2; //Return true if the session is valid or false if itt's invalid
    }

    public function getUserBy($param, $value) //Get the user's data from the database based on the specified parameter and value
    {
        if($param == 'id' || $param == 'email') //A valid parameter was specified
        {
            $userQuery = $this->database->query('SELECT * FROM users WHERE ' . $param . ' = ? LIMIT 1', $value); //Select the user from the database with the specified paramter and value
        }

        if(isset($userQuery) && $this->database->rowCount($userQuery)) //The query was successful and returned a row
        {
            $userRow = $this->database->fetch($userQuery); //Fetch the row

            foreach($userRow as $key => $data) //Loop through each key/data pair in the row
            {
                $this->data[$key] = $data; //Copy each key/data pair into the data array
            }

            return true; //Return true because the user was found
        }

        unset($this->data); //Unset any data that might be set since the user wasn't found

        return false; //Return false because the user wasn't found
    }

    public function getData($param) //Get the specified piece of data
    {
        if(isset($this->data) && isset($this->data[$param])) //The specified piece of data exists in the data array
        {
            return $this->data[$param]; //Return the piece of data
        }

        return false; //Return false because the data was not found
    }

    public function changeSettings() //Change the user's settings
    {
        //NOT IMPLEMENTED
    }

    public function changeProfile() //Change the stylist's profile information
    {
        //NOT IMPLEMENTED
    }
}